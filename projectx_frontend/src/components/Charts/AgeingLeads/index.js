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
import Skeleton from "components/Skeleton/index";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AgeingLeads = ({ chartData, loading }) => {
  // const channelVsLeadData = {
  //   label: [
  //     "Rooftop Projects",
  //     "Key Account EPC",
  //     "International Module",
  //     "Channel Module",
  //     "Secondary Customer Channel"
  //   ],
  //   channels: {
  //     Whatsapp: [54, 23, 78, 12, 45],
  //     Events: [87, 42, 65, 19, 78],
  //     Chatbot: [14, 68, 37, 91, 89],
  //     Email: [33, 92, 55, 27, 63]
  //   }
  // };

  // const AgeingLeadsData = {
  //   label: ["> 15 days", "7-15 days", "<7 days"],
  //   channels: {
  //     Whatsapp: [54, 23, 78],
  //     Events: [87, 42, 65],
  //     Chatbot: [14, 68, 37],
  //     Email: [33, 92, 55]
  //   }
  // };

  // const legendColors = ["#9AEFFE", "#35DFFD", "#0098B3", "#028197"];
  const legendColors = ["#35DFFD", "#0098B3", "#9AEFFE", "#028197"];

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
            const value = context.parsed.x;
            return ` ${datasetLabel} - ${value} Leads`;
          }
        }
      },
      legend: {
        onClick: null,
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          // borderRadius: 3
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
        },
        ticks: {
          stepSize: 50,
          maxRotation: 0,
          minRotation: 0,
          callback: (value) => Math.round(value)
        }
      },
      y: {
        stacked: true,
        grid: {
          display: false
        }
      }
    },
    indexAxis: "y"
  };

  const data = {
    labels: chartData?.label,
    datasets: Object.entries(chartData?.channels || {})?.map(
      ([channel, dataset], i) => {
        return {
          label: channel,
          data: dataset,
          backgroundColor: legendColors[i],
          barThickness: 32
        };
      }
    )
  };

  return (
    <ChartCard heading="AGEING LEADS BY CHANNEL" height={342}>
      {loading ? (
        <Skeleton width={"526px"} height={"249"} />
      ) : (
        <div style={{ height: "85%" }}>
          <Bar options={options} data={data} />
        </div>
      )}
    </ChartCard>
  );
};

export default AgeingLeads;
