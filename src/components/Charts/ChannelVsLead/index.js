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

const ChannelVsLead = ({ loading, chartData }) => {
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
          // borderRadius: 3,
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
          autoSkip: false,
          maxRotation: 0, // Disable label rotation
          minRotation: 0, // Disable label rotation
          callback: function (value, index, values) {
            const originalLabel = chartData?.label[index];

            if (/\s/.test(originalLabel)) {
              const words = originalLabel?.split(" ");
              if (words.length > 2) {
                // Wrap only the third word to a new line
                return [words.slice(0, 2).join(" "), words[2]];
              }
            }

            return originalLabel;
          }
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
          barThickness: 20
        };
      }
    )
  };

  return (
    <ChartCard heading="CHANNEL VS LEAD TYPE" height={342}>
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

export default ChannelVsLead;
