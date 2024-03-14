import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { identifyType, reduceYearByOne } from "utils/chart";

import Skeleton from "components/Skeleton";
import { getFormattedNumber } from "utils/numbers";

import lineLegend from "assets/images/chart/line.svg";
import dottedLegend from "assets/images/chart/dotted.svg";

import "./commonChart.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CommonChart = ({ chartData, loading, yTitle }) => {
  const chartRef = useRef();

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

        // const text = document.createTextNode(
        //   `${xValue} ${i === 0 ? "`23 " : "`22 "}\u00A0`
        // );

        // if (text) {
        //   text.parentNode.style.color = "#F0F0F0";
        // }
        const type = identifyType(xValue);

        const text = document.createElement("span");
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

        // Set the color for the text span
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

  const filterNumeric = (value) => typeof value === "number";

  const filteredData1 = chartData?.currentData?.value
    ? chartData?.currentData?.value.filter(filterNumeric)
    : [];
  const filteredData2 = chartData?.previousData?.value
    ? chartData?.previousData?.value.filter(filterNumeric)
    : [];

  // const min = Math.min(...filteredData1, ...filteredData2);
  const max = Math.max(...filteredData1, ...filteredData2);
  // const stepSizeTemp = Math.pow(10, Math.floor(Math.log10(max - min))) / 2;

  // const magnitude = Math.pow(10, Math.floor(Math.log10(stepSizeTemp)));

  // const roundedMin = Math.floor(min / magnitude) * magnitude;

  const getStepSize = (maxValue) => {
    if (maxValue < 100) {
      return 10;
    } else if (maxValue > 99 && maxValue < 999) {
      return 100;
    } else {
      return undefined;
    }
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
        // min: roundedMin <= 100 ? 0 : roundedMin,
        ticks: {
          callback: function (value, index, values) {
            return value >= 1000 ? value / 1000 + "k" : Math.round(value);
          },
          color: "#8B98A4",
          stepSize: getStepSize(max),
          precision: 0
        },
        grid: {
          color: "#EBEBEB"
        },
        title: {
          display: true,
          text: yTitle,
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
    }
  };

  const data = {
    labels: chartData?.currentData?.label,
    datasets: [
      {
        label: "current_value",
        data: chartData?.currentData?.value,
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
        label: "previous_value",
        data: chartData?.previousData?.value,
        borderColor: "rgb(139,152,164)",
        backgroundColor: "#C3ECF4",
        pointBackgroundColor: "#C3ECF4",
        borderDash: [5, 5],
        yAxisID: "y",
        borderWidth: 1,
        pointHoverRadius: 4,
        pointRadius: 0
      }
    ]
  };

  return (
    <div className="commonChart">
      {loading ? (
        <Skeleton height={"236"} />
      ) : (
        <div
          className="custom-chart"
          style={{
            height: "236px",
            width: "100%",
            maxWidth: 600,
            position: "relative"
          }}
        >
          <Line data={data} options={options} ref={chartRef} />
        </div>
      )}
    </div>
  );
};

export default CommonChart;
