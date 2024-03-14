import React from "react";
import { Pie } from "react-chartjs-2";

import { getWindowWidth } from "utils/window";

import ChartCard from "../ChartCard/index";
import Skeleton from "components/Skeleton";

const LeadType = ({ loading, chartData }) => {
  // const LeadTypeApiData = [
  //   {
  //     label: "Rooftop Projects",
  //     data: 10
  //   },
  //   {
  //     label: "Key Account EPC",
  //     data: 20
  //   },
  //   {
  //     label: "International Module",
  //     data: 30
  //   },
  //   {
  //     label: "Channel Module",
  //     data: 40
  //   },
  //   {
  //     label: "Secondary Customer Channel",
  //     data: 50
  //   }
  // ];

  const LeadTypeApiData =
    chartData?.map((status) => ({
      label: status?.lead_type,
      data: status?.value || 0
    })) || [];

  const chartOptions = {
    responsive: true,
    // aspectRatio: 3,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        onClick: null,
        position: getWindowWidth() <= 768 ? "bottom" : "right",
        labels: {
          boxWidth: 10
        },
        padding: {
          left: 0
        }
      },
      tooltip: {
        enabled: true,
        position: "nearest",
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
            const value = context.parsed;
            const percentage = Math.round(value);
            return ` ${context.label} - ${percentage}%`;
          }
        }
      }
    }
  };

  const data = {
    labels: LeadTypeApiData?.map((ele) => ele.label),
    datasets: [
      {
        label: "Lead type",
        data: LeadTypeApiData?.map((ele) => ele.data),
        backgroundColor: [
          "#0098B3",
          "#014D5B",
          "#027488",
          "#35DFFD",
          "#9AEFFE"
        ],
        borderWidth: 0
      }
    ]
  };

  const plugin = {
    beforeInit(chart) {
      // Get reference to the original fit function
      const originalFit = chart.legend.fit;

      // Override the fit function
      chart.legend.fit = function fit() {
        // Call original function and bind scope in order to use `this` correctly inside it
        originalFit.bind(chart.legend)();
        // Change the height as suggested in another answers
        this.width += 30;
      };
    }
  };

  return (
    <ChartCard heading="LEADS TYPE" height={342}>
      {loading ? (
        <Skeleton width={"526px"} height={"170"} />
      ) : (
        <div style={{ height: 170 }}>
          <Pie data={data} options={chartOptions} plugin={[plugin]} />
        </div>
      )}
    </ChartCard>
  );
};

export default LeadType;
