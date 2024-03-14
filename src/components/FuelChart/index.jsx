import { useEffect, useRef, useState } from "react";
import { EncryptStorage } from "encrypt-storage";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { Line, getElementAtEvent } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { getFormattedNumber } from "utils/numbers";
import { reduceYearByOne } from "utils/chart";
import { getWindowWidth } from "utils/window";

import Skeleton from "components/Skeleton";
import { getChartData } from "services/tripDashboard";
import { COST_SAVING_CHART } from "services/apiUrl";

import lineLegend from "assets/images/chart/line.svg";
import dottedLegend from "assets/images/chart/dotted.svg";

import "./fuelChart.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FuelChart = ({ loading, filterDate }) => {
  const chartRef = useRef();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({});

  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec"
  ];

  function identifyType(inputString) {
    if (typeof inputString !== "string") {
      return "Invalid input";
    }

    const lowercasedMonth = inputString.slice(0, 3).toLowerCase();
    if (months.includes(lowercasedMonth)) {
      return "month";
    }

    const weekPattern = /^Week \d+$/;
    if (weekPattern.test(inputString)) {
      return "week";
    }

    return "Unknown type";
  }

  function identifyTypeArray(inputArray) {
    if (!Array.isArray(inputArray)) {
      return "Invalid input";
    }

    const typeCount = {
      month: 0,
      week: 0,
      unknown: 0
    };

    inputArray.forEach((item) => {
      const type = identifyType(item);
      typeCount[type]++;
    });

    const maxType = Object.keys(typeCount).reduce((a, b) =>
      typeCount[a] > typeCount[b] ? a : b
    );

    return maxType;
  }

  function findMonthIndex(monthString) {
    if (typeof monthString !== "string") {
      return null;
    }
    const inputMonthAbbreviation = monthString.slice(0, 3).toLowerCase();
    const index = months.findIndex(
      (month) => month.toLowerCase() === inputMonthAbbreviation
    );

    return index + 1;
  }

  const [duration, setDuration] = useState("Months");
  const [drillHistory, setDrillHistory] = useState(["Months"]);
  const [drillDownDates, setDrillDownDates] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [drillDownOn, setDrillDownOn] = useState(false);
  const [currentValue, setCurrentValue] = useState([]);
  const [previousValue, setPreviousValue] = useState([]);
  const [chartLabel, setChartLabel] = useState([]);
  const [dayDrilldown, setDayDrilldown] = useState(false);

  const encryptStorage = new EncryptStorage("senzcraft123#", {
    prefix: ""
  });

  const filterNumeric = (value) => typeof value === "number";

  const filteredData1 = currentValue ? currentValue.filter(filterNumeric) : [];
  const filteredData2 = previousValue
    ? previousValue.filter(filterNumeric)
    : [];

  const max = Math.max(...filteredData1, ...filteredData2);

  const getStepSize = (maxValue) => {
    if (maxValue < 100) {
      return 10;
    } else if (maxValue > 100 && maxValue < 999) {
      return 100;
    } else {
      return undefined;
    }
  };

  const token = encryptStorage.getItem("authToken");
  const profileData = encryptStorage.getItem("authData");
  const { data: profileInfo } = profileData;

  const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector("div");

    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.style.background = "rgb(23,27,28)";
      tooltipEl.style.borderRadius = "4px";
      tooltipEl.style.color = "white";
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = "none";
      tooltipEl.style.position = "absolute";
      tooltipEl.style.transform = "translate(-50%, 0)";
      tooltipEl.style.transition = "all .3s ease";
      tooltipEl.style.minWidth = "160px";
      tooltipEl.style.marginTop = "12px";

      tooltipEl.style.maxWidth = "300px";

      const table = document.createElement("table");
      table.style.margin = "0px";

      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
  };

  const adjustTooltipPosition = (tooltipEl, chart) => {
    const canvasBounds = chart.canvas.getBoundingClientRect();
    const tooltipBounds = tooltipEl.getBoundingClientRect();

    // Adjust left position if tooltip is going beyond the right edge
    if (tooltipBounds.right > window.innerWidth) {
      tooltipEl.style.left = `${canvasBounds.right - tooltipBounds.width}px`;
    }

    // Adjust top position if tooltip is going beyond the bottom edge
    if (tooltipBounds.bottom > window.innerHeight) {
      tooltipEl.style.top = `${canvasBounds.top - tooltipBounds.height}px`;
    }
  };

  const externalTooltipHandler = (context) => {
    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    tooltipEl.classList.remove("above", "below", "no-transform");
    if (tooltip.yAlign) {
      tooltipEl.classList.add(tooltip.yAlign);
    } else {
      tooltipEl.classList.add("no-transform");
    }

    // Set Text
    if (tooltip.body) {
      const bodyLines = tooltip.body.map((b) => b.lines);

      const tableHead = document.createElement("thead");

      const tableBody = document.createElement("tbody");
      bodyLines.forEach((body, i, a, b) => {
        // starts
        const span = document.createElement("span");
        span.style.marginRight = "10px";
        span.style.display = "inline-block";
        const image = document.createElement("img");

        if (i === 0) {
          image.src = lineLegend;
        } else {
          image.src = dottedLegend;
        }

        span.appendChild(image);
        // ends

        const tr = document.createElement("tr");
        tr.style.backgroundColor = "inherit";
        tr.style.borderWidth = 0;

        const td = document.createElement("td");
        td.style.borderWidth = 0;

        const xValue = tooltip.dataPoints[i].label;
        const values = tooltip.dataPoints[i].formattedValue;

        const text = document.createElement("span");
        text.style.whiteSpace = "pre";

        const type = identifyType(xValue);

        if (type === "month") {
          const oldYear = reduceYearByOne(xValue);
          if (i === 0) {
            text.textContent = `${xValue}`;
          } else {
            text.textContent = `${oldYear}`;
          }
        } else {
          text.textContent = `${xValue}`;
        }

        text.style.color = "#F0F0F0";
        text.style.fontSize = 12;

        const boldText = document.createElement("strong");
        boldText.appendChild(
          document.createTextNode(` ${getFormattedNumber(values)}`)
        );

        td.style.fontFamily = "Open Sans";
        td.style.fontSize = "14px";
        td.style.fontWeight = "normal";

        boldText.style.fontWeight = "600";

        td.appendChild(span);
        td.appendChild(text);
        td.appendChild(boldText);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      });

      const tableRoot = tooltipEl.querySelector("table");

      // Remove old children
      if (tableRoot && tableRoot.firstChild) {
        while (tableRoot.firstChild) {
          tableRoot.firstChild.remove();
        }
      }

      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);

      adjustTooltipPosition(tooltipEl, chart);
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + "px";
    tooltipEl.style.top = positionY + tooltip.caretY + "px";
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding =
      tooltip.options.padding + "px " + tooltip.options.padding + "px";
  };

  const options = {
    clip: false,
    spanGaps: true,
    responsive: true,
    maintainAspectRatio: false,
    bezierCurve: false,
    layout: {
      padding: {
        right: 20
      }
    },
    interaction: {
      mode: "index",
      intersect: false
    },
    stacked: false,
    plugins: {
      legend: {
        display: false
      },

      tooltip: {
        enabled: false,
        position: "nearest",
        external: externalTooltipHandler
      }
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        border: {
          dash: [8, 4]
        },
        // min: min <= 100 ? 0 : roundedMin,
        ticks: {
          callback: function (value, index, values) {
            return value >= 10000 ? value / 1000 + "k" : Math.round(value);
          },
          stepSize: getStepSize(max),
          color: "#8B98A4",
          precision: 0
        },
        grid: {
          color: "#EBEBEB"
        },
        title: {
          display: true,
          text: "Savings (INR)",
          color: "#8B98A4",
          font: {
            size: 12,
            family: "Open Sans"
          }
        }
      },

      x: {
        grid: {
          display: false
        },
        ticks: {
          color: "#8B98A4",
          font: {
            size: 12
          }
        }
      }
    },
    onHover: function (e) {
      const points = this.getElementsAtEventForMode(
        e,
        "index",
        { axis: "x", intersect: true },
        false
      );

      if ((points.length && drillDownOn) || (points.length && dayDrilldown))
        e.native.target.style.cursor = "pointer";
      else e.native.target.style.cursor = "default";
    }
  };

  const data = {
    labels: chartLabel,
    datasets: [
      {
        label: "Dataset 1",
        data: currentValue?.map((v) => Math.round(v)),
        borderColor: "rgb(0,152,179)",
        backgroundColor: (context) => {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(2, 152, 179, 0.2)");
          gradient.addColorStop(1, "rgba(2, 152, 179, 0)");
          return gradient;
        },
        pointBackgroundColor: "#0098B3",
        fill: true,
        yAxisID: "y",
        borderWidth: 1,
        pointHoverRadius: 4,
        pointRadius: 0
      },
      {
        label: "Dataset 2",
        data: previousValue,
        borderColor: "rgb(139,152,164)",
        backgroundColor: "#C3ECF4",
        pointBackgroundColor: "#C3ECF4",
        pointBorderColor: "#C3ECF4",
        borderDash: [5, 5],
        yAxisID: "y",
        borderWidth: 1,
        pointHoverRadius: 4,
        pointRadius: 0
      }
    ]
  };

  const getMonthDates = (month) => {
    // const currentYear = new Date().getFullYear();
    const year = 2023;

    if (month < 1 || month > 12) {
      return null;
    }

    const startDate = startOfMonth(new Date(year, month - 1, 1));
    const endDate = endOfMonth(new Date(year, month - 1, 1));

    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");

    return { start_date: formattedStartDate, end_date: formattedEndDate };
  };

  const handleOnClick = (event) => {
    if (!drillDownOn && !dayDrilldown) {
      return;
    }

    const index = getElementAtEvent(chartRef.current, event)[0]?.index;
    const selectedLabel = chartLabel?.length > 0 && chartLabel[index];

    const type = identifyType(selectedLabel);

    if (type === "week" && dayDrilldown) {
      setDrillHistory([...drillHistory, "Days"]);
      setDuration("Days");
      setSelectedLabel(selectedLabel);
    }

    if (type === "month") {
      const month = findMonthIndex(selectedLabel);

      setDrillHistory([...drillHistory, "Weeks"]);
      setDuration("Weeks");
      const dates = getMonthDates(month);
      setDrillDownDates({ ...dates });
    }

    if (type === "week") {
      setDrillHistory([...drillHistory, "Days"]);
      setDuration("Days");
      setSelectedLabel(selectedLabel);
    }
  };

  const handleBreadcrumbClick = (index) => {
    const newHistory = drillHistory.slice(0, index + 1);
    const newDuration = newHistory[newHistory.length - 1];

    if (dayDrilldown) {
      setDrillHistory(newHistory);
      setDuration("Months");
      return;
    }

    setDrillHistory(newHistory);
    setDuration(newDuration);
  };

  useEffect(() => {
    if (dayDrilldown) setDrillHistory(["Weeks"]);
  }, [dayDrilldown]);

  useEffect(() => {
    let body;

    if (duration === "Months" || dayDrilldown) {
      body = {
        email: profileInfo?.email,
        start_date: filterDate.startDate,
        end_date: filterDate.endDate,
        drill_down: "0",
        role_id: String(profileInfo?.role_id)
      };
    }

    if (duration === "Weeks" && !dayDrilldown) {
      body = {
        email: profileInfo?.email,
        start_date: drillDownDates?.start_date,
        end_date: drillDownDates?.end_date,
        drill_down: "1",
        role_id: profileInfo?.role_id
      };
    }

    const getChartDetails = async () => {
      const response = await getChartData(COST_SAVING_CHART, body, token);
      if (response?.status === 200) {
        const type = identifyTypeArray(
          response?.data?.data?.fuel_cost_saved?.current_data?.label
        );

        if (type !== "month" && duration === "Months") {
          setDrillDownOn(false);
        } else {
          setDrillDownOn(true);
          // setDrillHistory(["Months"]);
        }

        if (type === "week" && duration === "Months") {
          setDayDrilldown(true);
        } else {
          // setDrillHistory(["Weeks"]);
          setDayDrilldown(false);
        }

        setChartData(response?.data?.data?.fuel_cost_saved);
      }

      if (response?.status === 401) {
        toast.error(
          <>
            <span className="formAPIError">
              {response?.data?.err_msg ||
                "Session Expired, Redirecting to login page"}
            </span>
          </>,
          {
            position:
              getWindowWidth() <= 768
                ? toast.POSITION.BOTTOM_CENTER
                : toast.POSITION.TOP_RIGHT,
            toastId: "abc"
          }
        );
        localStorage.clear();
        navigate("/");
      }
    };

    if (duration !== "Days") {
      getChartDetails();
    }
  }, [filterDate, duration]);

  useEffect(() => {
    setDuration("Months");
    setDrillHistory(["Months"]);
  }, [filterDate]);

  useEffect(() => {
    if (duration === "Months") {
      setCurrentValue(chartData?.current_data?.value);
      setPreviousValue(chartData?.previous_data?.value);
      setChartLabel(chartData?.current_data?.label);
    } else if (duration === "Weeks" && !dayDrilldown) {
      if ("month" in chartData) {
        const keyname = Object.keys(chartData?.month)[0];
        setCurrentValue(chartData?.month[keyname]?.value || []);
        setPreviousValue([]);
        setChartLabel(chartData?.month[keyname]?.label || []);
      }
    } else if (duration === "Days" && dayDrilldown) {
      setCurrentValue(
        chartData?.current_data?.week[selectedLabel]?.value || []
      );
      setPreviousValue([]);
      setChartLabel(chartData?.current_data?.week[selectedLabel]?.label || []);
    } else if (duration === "Days" && !dayDrilldown) {
      setCurrentValue(chartData?.week[selectedLabel]?.value || []);
      setPreviousValue([]);
      setChartLabel(chartData?.week[selectedLabel]?.label);
    }
  }, [chartData, selectedLabel, duration]);

  return (
    <div className="tripChart">
      <div className="tripChartHeading">
        {loading ? (
          <Skeleton height={"19"} width={"90px"} />
        ) : (
          <h3>FUEL COST SAVED</h3>
        )}
        {drillHistory?.length > 1 && (
          <div className="breadcrumb">
            {drillHistory.map((item, index) => (
              <span key={index}>
                <a
                  className={
                    index < drillHistory.length - 1 ? "active" : "notActive"
                  }
                  onClick={() => handleBreadcrumbClick(index)}
                >
                  {item}
                </a>
                {index < drillHistory.length - 1 && " > "}
              </span>
            ))}
          </div>
        )}
      </div>
      {loading ? (
        <Skeleton height={"236"} width={"100%"} />
      ) : (
        <div
          style={{
            height: "236px",
            width: "100%",
            maxWidth: 600,
            position: "relative"
          }}
        >
          <Line
            data={data}
            options={options}
            ref={chartRef}
            onClick={handleOnClick}
          />
        </div>
      )}
    </div>
  );
};

export default FuelChart;
