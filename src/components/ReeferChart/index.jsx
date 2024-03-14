import React, { useEffect, useState } from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import Skeleton from "components/Skeleton";

import MinimizeArrow from "assets/images/header/downArrow.svg";

import "./reeferChart.scss";
import { getRoundedValue } from "utils/numbers";

ChartJS.register(ArcElement, Tooltip, Legend);

const ReeferChart = ({ getWindowWidth, loading, chartData }) => {
  const [chartActive, setChartActive] = useState(false);
  const [labels, setLabels] = useState([]);
  const [tripCount, setTripCount] = useState([]);
  const [costSaved, setCostSaved] = useState([]);

  useEffect(() => {
    const label = chartData?.map((arr) => arr?.reefer_type);
    const trip = chartData?.map((arr) => arr?.trip_count);
    const cost = chartData?.map((arr) => arr?.cost_saved);

    setLabels(label);
    setTripCount(trip);
    setCostSaved(cost);
  }, [chartData]);

  const data = {
    labels,
    datasets: [
      {
        label: "No of trips",
        data: tripCount,
        backgroundColor: [
          "#00333C",
          "#006C80",
          "#007E94",
          "#0391AA",
          "#03B0CE",
          "#03CAED",
          "#33E0FF",
          "#61E7FF",
          "#8FEEFF",
          "#B2F3FF",
          "#CCF7FF",
          "#1A4455",
          "#266681",
          "#3081A4",
          "#42A5D0",
          "#7EBFD9",
          "#BBE3F3",
          "#1A4C55",
          "#2C8695",
          "#649EA9",
          "#82B7C0",
          "#B5D6DB",
          "#C3E0E5",
          "#9ADEEA",
          "#4BB8CB"
        ],
        borderWidth: 0
      }
    ]
  };

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
      tooltipEl.style.transform += "translate(85px, -10px)";
      tooltipEl.style.transition = "all .3s ease";
      tooltipEl.style.minWidth = "100px";
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

    // Set Text
    if (tooltip.body) {
      const bodyLines = tooltip.body.map((b) => b.lines);

      const tableHead = document.createElement("thead");

      const tableBody = document.createElement("tbody");
      bodyLines.forEach((body, i, a, b) => {
        const tr = document.createElement("tr");
        tr.style.backgroundColor = "inherit";
        tr.style.borderWidth = 0;

        const td = document.createElement("td");
        td.style.borderWidth = 0;
        td.style.paddingBottom = "8px";

        const values = tooltip.dataPoints[i].formattedValue;

        // Heading style
        const headingSpan = document.createElement("span");
        headingSpan.style.marginRight = "10px";
        headingSpan.style.display = "inline-block";
        headingSpan.style.fontSize = "14px";
        headingSpan.style.fontWeight = "600";
        // headingSpan.style.marginBottom = "8px";

        // Value style
        const valueSpan = document.createElement("div");
        valueSpan.style.fontSize = "14px";
        valueSpan.style.fontWeight = "400";
        valueSpan.style.color = "#F0F0F0";

        const headingText = document.createTextNode("No. of trips");
        const valueText = document.createTextNode(`${values}`);

        headingSpan.appendChild(headingText);
        valueSpan.appendChild(valueText);

        td.appendChild(headingSpan);
        td.appendChild(valueSpan);

        tr.appendChild(td);
        tableBody.appendChild(tr);

        // row 2

        const tr2 = document.createElement("tr");
        tr2.style.backgroundColor = "inherit";
        tr2.style.borderWidth = 0;

        const td2 = document.createElement("td");
        td2.style.borderWidth = 0;

        const headingSpan2 = document.createElement("span");
        headingSpan2.style.marginRight = "10px";
        headingSpan2.style.display = "inline-block";
        headingSpan2.style.fontSize = "14px";
        headingSpan2.style.fontWeight = "600";

        // Value style
        const valueSpan2 = document.createElement("div");
        valueSpan2.style.fontSize = "14px";
        valueSpan2.style.fontWeight = "400";
        valueSpan2.style.color = "#F0F0F0";

        const headingText2 = document.createTextNode("Cost saved");
        const valueText2 = document.createTextNode(
          getRoundedValue(costSaved[tooltip.dataPoints[i].dataIndex])
        );

        headingSpan2.appendChild(headingText2);
        valueSpan2.appendChild(valueText2);

        td2.appendChild(headingSpan2);
        td2.appendChild(valueSpan2);

        tr2.appendChild(td2);
        tableBody.appendChild(tr2);
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

  const chartOptions = {
    responsive: true,
    aspectRatio: 2,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        onClick: null,
        position: getWindowWidth() <= 768 ? "bottom" : "right",
        labels: {
          boxWidth: 10,
          padding: 10
        }
      },
      tooltip: {
        enabled: false,
        position: "nearest",
        external: externalTooltipHandler
      }
    }
  };

  const openChart = () => {
    getWindowWidth() <= 1150 && setChartActive((prev) => !prev);
  };

  return (
    <div className="reeferChart">
      {loading ? (
        <h3>
          <Skeleton height={"19"} width={"140px"} />
        </h3>
      ) : (
        <h3
          onClick={openChart}
          className={`${getWindowWidth() <= 1150 && "loadChartTitlePhn"}`}
        >
          TRIPS BY REEFER{" "}
          {getWindowWidth() <= 1150 && (
            <img
              style={{
                transform: chartActive ? "rotate(180deg)" : "rotate(0)"
              }}
              src={MinimizeArrow}
              alt="MinimizeArrow"
            />
          )}
        </h3>
      )}
      {getWindowWidth() <= 1150 ? (
        <div
          style={{
            height: chartActive ? "0" : "270px",
            paddingTop: chartActive ? "0" : "38px"
          }}
          className="reeferChartSection"
        >
          {loading ? (
            <Skeleton height={"166"} width={"472px"} />
          ) : (
            <div
              style={{
                height: "98%",
                width: "100%",
                display: chartActive ? "none" : "block"
              }}
            >
              <Doughnut data={data} options={chartOptions} />
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: getWindowWidth() >= 1150 ? 190 : 340
          }}
          className="reeferChartSection"
        >
          {loading ? (
            <Skeleton height={"166"} width={"472px"} />
          ) : (
            <div
              style={{
                height: "98%",
                width: "100%",
                display: chartActive ? "none" : "block"
              }}
            >
              <Doughnut data={data} options={chartOptions} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReeferChart;
