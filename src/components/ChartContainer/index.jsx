import CommonChart from "components/CommonChart/index";
import React, { useEffect, useState } from "react";

import Skeleton from "components/Skeleton";

import "./chartContainer.scss";

const ChartContainer = ({ chartBtn, chartData, loading, currency }) => {
  const [filter, setFilter] = useState(1);

  const [transactionVolume, setTransactionVolume] = useState({});
  const [timeSaved, setTimeSaved] = useState({});
  const [costSaved, setCostSaved] = useState({});
  const [touchless, setTouchless] = useState({});

  const [activeData, setActiveData] = useState({});
  const [yTitle, setYTitle] = useState("Transactions");

  const selectedFilter = (i) => {
    setFilter(i);
  };

  const convertToHours = (inputData) => {
    // Function to convert empty strings to null
    const processArray = (arr) => arr.map((value) => Math.floor(value / 60));

    // Process currentData
    const processedCurrentData = {
      value: processArray(inputData.currentData.value),
      label: inputData.currentData.label
    };

    // Process previousData
    const processedPreviousData = {
      value: processArray(inputData.previousData.value)
    };

    // Create and return a new object of objects
    const resultObject = {
      currentData: processedCurrentData,
      previousData: processedPreviousData
    };

    return resultObject;
  };

  function replaceEmptyStringWithNull(obj) {
    // const replaceEmptyString = (value) => (value === "" ? null : value);

    // const processArray = (arr) => arr.map(replaceEmptyString);

    const resultObject = {};

    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const element = obj[key];
        if (Array.isArray(element.value)) {
          resultObject[key] = {
            value: element.value,
            ...(element.label && { label: element.label })
          };
        } else {
          resultObject[key] = {
            value: element.value
          };
        }
      }
    }

    return resultObject;
  }

  useEffect(() => {
    setTransactionVolume(
      replaceEmptyStringWithNull(chartData?.transaction_volume_trend)
    );
    setTimeSaved(
      chartData?.time_saved_trend && convertToHours(chartData?.time_saved_trend)
    );
    setTouchless(replaceEmptyStringWithNull(chartData?.touchless_trend));
    setCostSaved(replaceEmptyStringWithNull(chartData?.cost_saved_trend));
  }, [chartData]);

  useEffect(() => {
    switch (filter) {
      case 1:
        setActiveData(transactionVolume);
        setYTitle("No. of Transactions");
        break;
      case 2:
        setActiveData(timeSaved);
        setYTitle("Time Saved (Hours)");
        break;
      case 3:
        setActiveData(costSaved);
        setYTitle(`Savings (${currency})`);
        break;
      case 4:
        setActiveData(touchless);
        setYTitle("Touchless (%)");
        break;
      default:
        break;
    }
  }, [chartData, filter, transactionVolume, timeSaved, costSaved, touchless]);

  return (
    <div className="transportationDataChart">
      <div className="transportationDataChartFilter">
        {chartBtn.map((item, i) => (
          <React.Fragment key={i}>
            {loading ? (
              <Skeleton width={"100px"} height={"39"} />
            ) : (
              <span
                onClick={() => selectedFilter(item?.id)}
                className={filter === item?.id ? "filterActive" : ""}
              >
                {item?.value}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
      <CommonChart chartData={activeData} loading={loading} yTitle={yTitle} />
    </div>
  );
};

export default ChartContainer;
