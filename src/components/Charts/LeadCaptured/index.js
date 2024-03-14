import React, { useEffect, useRef, useState } from "react";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { endOfMonth, format, startOfMonth } from "date-fns";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { EncryptStorage } from "encrypt-storage";

import ChartCard from "../ChartCard/index";

import { getLeadCapturedData } from "services/leadDashboard";
import { getWindowWidth } from "utils/window";

import Skeleton from "components/Skeleton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LeadCaptured = ({ loading, filterDate }) => {
  const chartRef = useRef();
  const navigate = useNavigate();

  const [duration, setDuration] = useState("Months");
  const [dayDrilldown, setDayDrilldown] = useState(false);
  const [drillHistory, setDrillHistory] = useState(["Months"]);
  const [drillDownOn, setDrillDownOn] = useState(false);
  const [drillDownDates, setDrillDownDates] = useState(null);
  // const [chartLabel, setChartLabel] = useState([]);
  const [chartData, setChartData] = useState({});
  const [chartLabel, setChartLabel] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [currentValue, setCurrentValue] = useState([]);
  const [channels, setChannels] = useState([]);
  const [drillMonth, setDrillMonth] = useState("");

  const leadCapturedChannel = {
    label: [
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
    ]
    // channels: {
    //   WA: [10, 8, 4],
    //   CB: [13, 3, 17],
    //   ML: [18, 33, 11],
    //   EV: [1, 13, 13]
    // }
  };

  const encryptStorage = new EncryptStorage("senzcraft123#", {
    prefix: ""
  });

  const token = encryptStorage.getItem("authToken");
  const profileData = encryptStorage.getItem("authData");
  const { data } = profileData;
  // const navigate = useNavigate();

  function identifyType(inputString) {
    if (typeof inputString !== "string") {
      return "Invalid input";
    }

    const lowercasedMonth = inputString.slice(0, 3).toLowerCase();
    if (leadCapturedChannel.label.includes(lowercasedMonth)) {
      return "month";
    }

    const weekPattern = /^Week \d+$/;
    if (weekPattern.test(inputString)) {
      return "week";
    }

    return "unknown";
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
  // const legendColors = ["#9AEFFE", "#35DFFD", "#0098B3", "#028197"];
  const legendColors = ["#35DFFD", "#0098B3", "#9AEFFE", "#028197"];

  // Extracting unique labels
  const finalData = {
    labels: chartLabel,
    datasets: channels.map((label, i) => {
      return {
        label: label,
        data: currentValue.map(
          (valuesArray) => valuesArray[channels.indexOf(label)] || 0
        ),
        backgroundColor: legendColors[i],
        barThickness: 14
      };
    })
  };

  useEffect(() => {
    let body;

    if (duration === "Months" || dayDrilldown) {
      body = {
        email: data?.email,
        start_date: filterDate?.startDate,
        end_date: filterDate?.endDate,
        drill_down_flag: 0,
        role_id: String(data?.role_id)
      };
    }

    if (duration === "Weeks" && !dayDrilldown) {
      body = {
        email: data?.email,
        start_date: filterDate?.startDate,
        end_date: filterDate?.endDate,
        drill_down_flag: 1,
        role_id: String(data?.role_id)
      };
    }
    console.log(drillDownDates);

    const fetchLeadCaptured = async () => {
      const response = await getLeadCapturedData(body, token);
      if (response?.status === 200) {
        const type = identifyTypeArray(
          response?.data?.data?.current_data?.label
        );
        if (response?.data?.status === "0") {
          navigate("/no-data");
        }

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
        setChartData(response?.data?.data);

        encryptStorage?.setItem("authToken", response?.data?.token);

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
      }
      if (response?.response?.status) {
        setCurrentValue([]);
        setChartLabel([]);
        setChannels([]);
      }
    };

    if (duration !== "Days") {
      fetchLeadCaptured();
    }
  }, [filterDate, duration]);

  useEffect(() => {
    if (dayDrilldown) setDrillHistory(["Weeks"]);
  }, [dayDrilldown]);

  useEffect(() => {
    setDuration("Months");
    setDrillHistory(["Months"]);
  }, [filterDate]);

  useEffect(() => {
    if (duration === "Months") {
      // const currentDate = new Date();
      // const currentMonth = currentDate.getMonth();

      const chartDataValues = chartData?.current_data?.value || [];

      const tempSeparatedArrays = chartDataValues
        .filter((_, index) => index >= 0)
        .map((dataObject) => Object.values(dataObject).map(Number));

      const slicedLabels = chartData?.current_data?.label || [];

      const channels = Array.from(
        new Set(
          chartDataValues.flatMap((dataObject) => Object.keys(dataObject))
        )
      );

      setChannels(channels || []);
      setCurrentValue(tempSeparatedArrays || []);
      setChartLabel(slicedLabels || []);
    }

    if (duration === "Weeks" && !dayDrilldown) {
      if ("month" in chartData) {
        // const keyname = Object.keys(chartData?.month)[0];
        const dataObject = chartData?.month[drillMonth]?.value || [];

        // Extract unique channels dynamically
        const uniqueChannels = Array.from(
          new Set(dataObject.flatMap((obj) => Object.keys(obj)))
        );

        // Update values based on dynamic channels
        const transformedData = dataObject.map((obj) => {
          return uniqueChannels.map((channel) => obj[channel] || 0);
        });

        setCurrentValue(transformedData || []);
        setChannels(uniqueChannels || []);
        setChartLabel(chartData?.month[drillMonth]?.label || []);
      }
    } else if (duration === "Days" && dayDrilldown) {
      const selectedWeekData =
        chartData?.current_data?.week[selectedLabel] || {};
      const weekValues = selectedWeekData.value || [];

      // Extract unique channels dynamically
      const uniqueChannels = Array.from(
        new Set(weekValues.flatMap((dataObject) => Object.keys(dataObject)))
      );

      // Update values based on dynamic channels
      const updatedValues = weekValues.map((dataObject) => {
        return uniqueChannels.map((channel) => dataObject[channel] || 0);
      });
      setCurrentValue(updatedValues);
      setChannels(uniqueChannels);
      setChartLabel(chartData?.current_data?.week[selectedLabel]?.label || []);
    } else if (duration === "Days" && !dayDrilldown) {
      if ("week" in chartData) {
        const selectedWeekData = chartData?.week[selectedLabel] || {};
        const weekLabels = selectedWeekData.label || [];
        const weekValues = selectedWeekData.value || [];

        // Extract unique channels dynamically
        const uniqueChannels = Array.from(
          new Set(weekValues.flatMap((dataObject) => Object.keys(dataObject)))
        );

        // Update values based on dynamic channels
        const updatedValues = weekValues.map((dataObject) => {
          return uniqueChannels.map((channel) => dataObject[channel] || 0);
        });
        setCurrentValue(updatedValues);
        setChannels(uniqueChannels);
        setChartLabel(weekLabels.flat());
      }
    }
  }, [chartData, selectedLabel, duration]);

  function findMonthIndex(monthString) {
    if (typeof monthString !== "string") {
      return null;
    }
    const inputMonthAbbreviation = monthString.slice(0, 3).toLowerCase();
    const index = leadCapturedChannel.label.findIndex(
      (month) => month.toLowerCase() === inputMonthAbbreviation
    );

    return index + 1;
  }

  const options = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false
      },
      tooltip: {
        titleFont: {
          family: "Open Sans"
        },
        backgroundColor: "#171B1C",
        padding: 12,
        callbacks: {
          title: function () {
            return null;
          },
          label: (context) => {
            const datasetLabel = context.dataset.label || "";
            const value = context.parsed.y;
            return ` ${datasetLabel} - ${value} Leads`;
          }
          // label: (context) => {
          //   const datasetLabel = context.dataset.label || "";
          //   const value = context.parsed.y;
          //   return [` ${datasetLabel} - ${value} Leads`];
          // }
        }
      },
      legend: {
        onClick: null,
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 3,
          usePointStyle: true,
          pointStyle: "rectRounded"
        }
      }
    },

    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        }
      },
      y: {
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
          precision: 0
        },
        title: {
          display: true,
          text: "No. of Leads",
          color: "#8B98A4",
          font: {
            size: 12,
            family: "Open Sans"
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

  const handleOnClick = (event) => {
    if (!drillDownOn && !dayDrilldown) {
      return;
    }

    const index = getElementAtEvent(chartRef.current, event)[0]?.index;
    const selectedLabel = chartLabel?.length > 0 && chartLabel[index];
    const type = Array.isArray(selectedLabel)
      ? identifyType(selectedLabel[0])
      : identifyType(selectedLabel);

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
      setDrillMonth(selectedLabel.replace(/(\w+)\s/, "$1, "));
    }

    if (type === "week") {
      setDrillHistory([...drillHistory, "Days"]);
      setDuration("Days");
      setSelectedLabel(selectedLabel);
    }
  };

  return (
    <ChartCard heading="LEAD CAPTURED BY CHANNELS" height={342}>
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
      {loading ? (
        <Skeleton width={"526px"} height={"249"} />
      ) : (
        <div style={{ height: "85%" }}>
          <Bar
            options={options}
            data={finalData}
            onClick={handleOnClick}
            ref={chartRef}
          />
        </div>
      )}
    </ChartCard>
  );
};

export default LeadCaptured;
