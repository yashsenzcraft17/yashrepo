import React from "react";
import ChartCard from "../ChartCard/index";
import { Pie } from "react-chartjs-2";
import { getWindowWidth } from "utils/window";
import Skeleton from "components/Skeleton/index";

const LeadStatus = ({ loading, chartData }) => {
  const LeadStatusApiData =
    chartData?.map((status) => ({
      label: status?.lead_capture_status,
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
            const percentage = value + "%";
            return ` ${context.label} - ${percentage}`;
          }
        }
      }
    }
  };

  const data = {
    labels: LeadStatusApiData?.map((ele) => ele.label),
    datasets: [
      {
        label: "Leads by status",
        data: LeadStatusApiData?.map((ele) => ele.data),
        backgroundColor: [
          "#35DFFD",
          "#9AEFFE",
          "#02ACCA",
          "#00333C",
          "#006C80",
          "#007E94"
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
    <ChartCard heading="LEADS BY STATUS" height={282}>
      {loading ? (
        <Skeleton width={"526px"} height={"198"} />
      ) : (
        <div style={{ height: 170 }}>
          <Pie data={data} options={chartOptions} plugin={[plugin]} />
        </div>
      )}
    </ChartCard>
  );
};

export default LeadStatus;
