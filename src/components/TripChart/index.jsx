import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EncryptStorage } from "encrypt-storage";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { toast } from "react-toastify";

import { Line, getElementAtEvent } from "react-chartjs-2";

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

import Skeleton from "components/Skeleton";

import lineLegend from "assets/images/chart/line.svg";
import dottedLegend from "assets/images/chart/dotted.svg";
import recLegend from "assets/images/chart/recommend.svg";

import { TRIP_COUNT_CHART } from "services/apiUrl";
import { getChartData } from "services/tripDashboard";

import { getFormattedNumber } from "utils/numbers";
import { reduceYearByOne } from "utils/chart";
import "./tripChart.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Both Trip chart and Fuel chart logics are almost same
const TripChart = ({ getWindowWidth, loading, filterDate }) => {
  const chartRef = useRef();
  const navigate = useNavigate();

  const [chartData, setChartData] = useState({});
  const [recPercent, setRecPercent] = useState([]);
  const [duration, setDuration] = useState("Months");
  const [drillHistory, setDrillHistory] = useState(["Months"]);
  const [drillDownOn, setDrillDownOn] = useState(false);
  const [currentValue, setCurrentValue] = useState([]);
  const [previousValue, setPreviousValue] = useState([]);
  const [chartLabel, setChartLabel] = useState([]);
  const [recoValue, setRecoValue] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [drillDownDates, setDrillDownDates] = useState(null);
  const [dayDrilldown, setDayDrilldown] = useState(false);

  const filterNumeric = (value) => typeof value === "number";

  const filteredData1 = currentValue ? currentValue.filter(filterNumeric) : [];
  const filteredData2 = previousValue
    ? previousValue.filter(filterNumeric)
    : [];

  // const min = Math.min(...filteredData1, ...filteredData2);
  const max = Math.max(...filteredData1, ...filteredData2);

  // const stepSizeTemp = Math.pow(10, Math.floor(Math.log10(max - min))) / 2;

  // const magnitude = Math.pow(10, Math.floor(Math.log10(stepSizeTemp)));

  // const roundedMin = Math.floor(min / magnitude) * magnitude;

  const getStepSize = (maxValue) => {
    if (maxValue < 100) {
      return 10;
    } else if (maxValue > 100 && maxValue < 999) {
      return 100;
    } else {
      return undefined;
    }
  };

  const encryptStorage = new EncryptStorage("senzcraft123#", {
    prefix: ""
  });

  const token = encryptStorage.getItem("authToken");

  const profileData = encryptStorage.getItem("authData");
  const { data: profileInfo } = profileData;

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

  // Identifies the type of the given input string.
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

  // Finds the index of a month in the months array based on the given month string.
  function findMonthIndex(monthString) {
    if (typeof monthString !== "string") {
      return null;
    }
    const inputMonthAbbreviation = monthString.slice(0, 3)?.toLowerCase();
    const index = months.findIndex(
      (month) => month?.toLowerCase() === inputMonthAbbreviation
    );

    return index + 1;
  }

  // Identifies the most common type in an array of items.
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

  // Get the start and end dates of a given month.
  const getMonthDates = (month) => {
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

  // Retrieves or creates a tooltip element for the given chart.
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

  // Adjusts the position of a tooltip element relative to a chart element.
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

  // Handles the rendering and positioning of an external tooltip for a chart.
  const externalTooltipHandler = (context) => {
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

    if (tooltip.body) {
      const bodyLines = tooltip.body.map((b) => b.lines);

      const tableHead = document.createElement("thead");

      const headingTr = document.createElement("tr");
      const headingTd = document.createElement("td");
      headingTd.textContent = "Trips";
      headingTd.style.fontFamily = "Open Sans";
      headingTd.style.fontSize = "14px";
      headingTd.style.fontWeight = "600";
      headingTr.appendChild(headingTd);
      tableHead.appendChild(headingTr);

      const gapTr = document.createElement("tr");
      const gapTd = document.createElement("td");
      gapTd.style.height = "6px";
      gapTr.appendChild(gapTd);
      tableHead.appendChild(gapTr);

      const tableBody = document.createElement("tbody");
      bodyLines.forEach((body, i, a, b) => {
        // starts
        const span = document.createElement("span");
        span.style.marginRight = "10px";
        span.style.display = "inline-block";
        const image = document.createElement("img");

        const chartName = tooltip.dataPoints[i].dataset.label;
        const arrIndex = tooltip.dataPoints[i].dataIndex;

        if (chartName === "current_val") {
          image.src = lineLegend;
        } else if (chartName === "prev_val") {
          image.src = dottedLegend;
        } else if (chartName === "recommend_val") {
          image.src = recLegend;
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

        if (chartName === "recommend_val") {
          const recommendationsTr = document.createElement("tr");
          const recommendationsTd = document.createElement("td");
          recommendationsTd.textContent = "Recommendations";
          recommendationsTd.style.fontFamily = "Open Sans";
          recommendationsTd.style.fontSize = "14px";
          recommendationsTd.style.fontWeight = "600";
          recommendationsTr.appendChild(recommendationsTd);

          recommendationsTd.style.paddingTop = "6px";
          recommendationsTd.style.paddingBottom = "4px";

          tableBody.appendChild(recommendationsTr);
        }

        const type = identifyType(xValue);
        const text = document.createElement("span");

        if (type === "month" && chartName === "prev_val") {
          const oldYear = reduceYearByOne(xValue);
          text.textContent = `${oldYear}`;
        } else {
          text.textContent = `${xValue}`;
        }

        text.style.color = "#F0F0F0";
        text.style.fontSize = 12;

        const boldText = document.createElement("strong");
        if (chartName === "recommend_val") {
          const recPercentValue = recPercent[arrIndex];
          isNaN(recPercentValue)
            ? boldText.appendChild(
                document.createTextNode(` (${getFormattedNumber(values)})`)
              )
            : boldText.appendChild(
                document.createTextNode(
                  ` ${recPercentValue}% (${getFormattedNumber(values)})`
                )
              );
          boldText.style.color = "#31A93E";
        } else {
          boldText.appendChild(
            document.createTextNode(` ${getFormattedNumber(values)}`)
          );
        }

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

  // Defines the options object for a chart.
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
        // min: roundedMin <= 100 ? 0 : roundedMin,
        ticks: {
          callback: function (value, index, values) {
            return value >= 10000 ? value : Math.round(value);
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
          text: "No. of Trips",
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

  // Defines the data object for a chart, including labels and datasets.
  const data = {
    labels: chartLabel,
    datasets: [
      {
        label: "current_val",
        data: currentValue,
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
        pointRadius: 0,
        lineTension: 0.6
      },
      {
        label: "prev_val",
        data: previousValue,
        borderColor: "rgb(139,152,164)",
        backgroundColor: "#C3ECF4",
        pointBackgroundColor: "#C3ECF4",
        pointBorderColor: "#C3ECF4",
        borderDash: [5, 5],
        yAxisID: "y",
        borderWidth: 1,
        pointHoverRadius: 4,
        pointRadius: 0,
        lineTension: 0.6
      },
      {
        label: "recommend_val",
        data: recoValue,
        borderColor: "#8B98A4",
        backgroundColor: "#8B98A4",
        pointBackgroundColor: "#8B98A4",
        pointBorderColor: "#8B98A4",
        yAxisID: "y",
        borderWidth: 1,
        pointHoverRadius: 4,
        pointRadius: 0,
        lineTension: 0.6
      }
    ]
  };

  /**
   * Handles the onClick event for a chart element. If drillDownOn or dayDrilldown is false,
   * the function returns early. Otherwise, it identifies the selected label and determines its type.
   */

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

  // Handles the click event on a breadcrumb item.
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

  // useEffect hook that fetches chart data based on the selected filter date and duration.
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
      const response = await getChartData(TRIP_COUNT_CHART, body, token);
      if (response?.status === 200) {
        const type = identifyTypeArray(
          response?.data?.data?.trip_count?.current_data?.label
        );
        if (response?.data?.status === "0") {
          navigate("/no-data");
        }
        if (type !== "month" && duration === "Months") {
          setDrillDownOn(false);
        } else {
          setDrillDownOn(true);
        }

        if (type === "week" && duration === "Months") {
          setDayDrilldown(true);
        } else {
          setDayDrilldown(false);
        }

        setChartData(response?.data?.data?.trip_count);
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

  // useEffect hook that updates the state variables based on the selected duration and chart data.
  useEffect(() => {
    if (duration === "Months") {
      setCurrentValue(chartData?.current_data?.value);
      setPreviousValue(chartData?.previous_data?.value);
      setChartLabel(chartData?.current_data?.label);
      setRecPercent(
        chartData.current_data?.recommendation?.map((v) => v?.perc)
      );
      setRecoValue(
        chartData.current_data?.recommendation?.map((v) => v?.value)
      );
    } else if (duration === "Weeks" && !dayDrilldown) {
      if ("month" in chartData) {
        const keyname = Object.keys(chartData?.month)[0];
        setCurrentValue(chartData?.month[keyname]?.value || []);
        setPreviousValue([]);
        setChartLabel(chartData?.month[keyname]?.label || []);
        setRecPercent(
          chartData?.month[keyname]?.recommendation?.map((v) => v?.perc) || []
        );
        setRecoValue(
          chartData?.month[keyname]?.recommendation?.map((v) => v?.value) || []
        );
      }
    } else if (duration === "Days" && dayDrilldown) {
      setCurrentValue(
        chartData?.current_data?.week[selectedLabel]?.value || []
      );
      setPreviousValue([]);
      setChartLabel(chartData?.current_data?.week[selectedLabel]?.label || []);
      setRecPercent(
        chartData.current_data?.week[selectedLabel]?.recommendation?.map(
          (v) => v?.perc
        ) || []
      );
      setRecoValue(
        chartData.current_data?.week[selectedLabel]?.recommendation?.map(
          (v) => v?.value
        ) || []
      );
    } else if (duration === "Days" && !dayDrilldown) {
      setCurrentValue(chartData?.week[selectedLabel]?.value || []);
      setPreviousValue([]);
      setChartLabel(chartData?.week[selectedLabel]?.label);
      setRecoValue(
        chartData?.week[selectedLabel]?.recommendation?.map((v) => v?.value) ||
          []
      );
      setRecPercent(
        chartData?.week[selectedLabel]?.recommendation?.map((v) => v?.perc) ||
          []
      );
    }
  }, [chartData, selectedLabel, duration]);

  return (
    <div className="tripChart">
      <div className="tripChartHeading">
        {loading ? (
          <Skeleton height={"19"} width={"90px"} />
        ) : (
          <h3>NO OF TRIPS</h3>
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
            maxWidth: getWindowWidth() <= 768 ? "none" : 600,
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

export default TripChart;
