import React from "react";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import ChartCard from "../ChartCard/index";
import Skeleton from "components/Skeleton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TouchlessChart = ({ loading, chartData }) => {
  // const touchlessData = [
  //   {
  //     label: "WhatsApp",
  //     data: 25
  //   },
  //   {
  //     label: "Events",
  //     data: 75
  //   },
  //   {
  //     label: "Chatbot",
  //     data: 50
  //   },
  //   {
  //     label: "Email",
  //     data: 60
  //   }
  // ];

  const touchlessData =
    chartData?.map((status) => ({
      label: status?.channel,
      data: status?.value || 0
    })) || [];

  const options = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false
      },
      tooltip: {
        enabled: true,
        position: "nearest",
        backgroundColor: "#171B1C",
        displayColors: false,
        callbacks: {
          title: function (tooltipItems) {
            return "";
          },
          label: (context) => {
            const value = context.parsed.y;
            const xLabel = context.label;
            return `${xLabel} - ${value}% touchless`;
          }
        }
      },
      legend: {
        display: false,
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 3
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
        }
      }
    }
  };

  const data = {
    labels: touchlessData.map((ele) => ele.label),
    datasets: [
      {
        label: "touchless",
        data: touchlessData.map((ele) => ele.data),
        backgroundColor: "#02ACCA",
        barThickness: 58
      }
    ]
  };

  return (
    <ChartCard heading="% TOUCHLESS BY CHANNEL" height={282}>
      {loading ? (
        <Skeleton width={"526px"} height={"198"} />
      ) : (
        <div style={{ height: "85%" }}>
          <Bar options={options} data={data} />
        </div>
      )}
    </ChartCard>
  );
};

export default TouchlessChart;
