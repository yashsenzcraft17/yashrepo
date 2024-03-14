import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EncryptStorage } from "encrypt-storage";
import { toast } from "react-toastify";
import { format, subYears } from "date-fns";

import DashboardHeader from "components/DashboardHeader";
import { getDashboardData } from "services/commonDashboard";
import DashboardModule from "components/dashboardModule";
import DashboardModuleLoader from "components/DashboardModuleLoader";

import { getWindowWidth } from "utils/window";

import "containers/Dashboard/dashboard.scss";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const Dashboard = () => {
  const currentDate = new Date();
  const lastYearDate = subYears(currentDate, 1);
  const formatDate = (date) => format(date, "yyyy-MM-dd");

  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({});
  const [activeModule, setActiveModule] = useState([0]);
  const [somethingWrongStatus, setSomethingWrongStatus] = useState(false);
  const [filterDate, setFilterDate] = useState({
    startDate: formatDate(lastYearDate),
    endDate: formatDate(currentDate)
  });
  const [checkCount, setCheckCount] = useState(false);
  const [oldFilterDate, setOldFilterDate] = useState({});
  const encryptStorage = new EncryptStorage("senzcraft123#", {
    prefix: ""
  });

  const token = encryptStorage.getItem("authToken");
  const profileData = encryptStorage.getItem("authData");
  const { data } = profileData;

  const navigate = useNavigate();

  const [cardData] = useState([
    {
      id: 1,
      keyword: "transaction_volume",
      title: "Transaction volume",
      titleColor: "#677787",
      value: "0",
      valueColor: "#3A4243",
      trend: "2.5%",
      background: "#FFF"
    },
    {
      id: 2,
      keyword: "time_saved",
      title: "time saved",
      titleColor: "#677787",
      value: "0h",
      valueColor: "#3A4243",
      trend: "70.5%",
      background: "#FFF"
    },
    {
      id: 3,
      keyword: "cost_saved",
      title: "cost saved",
      titleColor: "#677787",
      value: "0",
      valueColor: "#3A4243",
      trend: "70.5%",
      background: "#FFF"
    },
    {
      id: 4,
      keyword: "touchless",
      title: "touchless %",
      titleColor: "#677787",
      value: "0",
      valueColor: "#3A4243",
      trend: "70.5%",
      background: "#FFF"
    }
  ]);

  const chartBtn = [
    {
      id: 1,
      value: "Transaction Vol."
    },
    {
      id: 2,
      value: "Time Saved"
    },
    {
      id: 3,
      value: "Cost Saved"
    },
    {
      id: 4,
      value: "Touchless %"
    }
  ];

  // common dashboard module atleast one should active
  const handleTransition = (index) => {
    if (activeModule.includes(index)) {
      if (activeModule.length === 1) {
        return;
      }
      setActiveModule((prev) => prev.filter((id) => id !== index));
    } else {
      setActiveModule((prev) => [...prev, index]);
    }
  };

  // The useEffect hook fetches data based on the filterDate state.
  // It triggers an API call to update the dashboard data if filterDate has changed.
  // A successful call updates the chartData state and the authentication token in local storage.
  // In case of a 401 status code, it shows an error toast, clears local storage, and navigates to the login page.
  // For other status codes, it displays a generic error toast, clears local storage, and navigates to the login page.
  // If filterDate hasn't changed, no action is taken.
  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      const isFilterDateChanged =
        filterDate.startDate !== oldFilterDate.startDate ||
        filterDate.endDate !== oldFilterDate.endDate;

      if (isFilterDateChanged) {
        const dashboardData = await getDashboardData(
          {
            start_date: filterDate.startDate,
            end_date: filterDate.endDate,
            role_id: String(data.role_id),
            email: data.email
          },
          token
        );

        if (dashboardData?.status === 200) {
          setSomethingWrongStatus(false);
          if (dashboardData?.data?.status === "0") {
            toast.error(
              <>
                <span className="formAPIError">
                  {dashboardData?.data?.err_msg}
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
          }

          const apiChartData = dashboardData?.data?.data;
          setChartData(apiChartData);
          encryptStorage?.setItem("authToken", dashboardData?.data?.token);
        } else {
          if (dashboardData?.response?.status === 401) {
            toast.error(
              <>
                <span className="formAPIError">
                  {dashboardData?.response?.data?.err_msg}
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
            navigate("/", { replace: true });

            return;
          }

          // setSomethingWrongStatus(true);
          toast.error(
            <>
              <span className="formAPIError">
                Something went wrong! Please log in again
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
          navigate("/", { replace: true });
        }
        setLoading(false);
        setOldFilterDate({ ...filterDate });
      } else {
        setLoading(false);
      }
    };

    getData();
    // Object.keys(chartData).length > 1 && setCheckCount(true);
  }, [filterDate]);

  return (
    <React.Fragment>
      <DashboardHeader title={"Dashboard"} setFilterDate={setFilterDate} />
      <section className="dashboard">
        {loading && (
          <DashboardModuleLoader
            chartBtn={chartBtn}
            cardData={cardData}
            loading={loading}
            checkCount={checkCount}
          />
        )}

        {!loading &&
          chartData &&
          Object.keys(chartData).map((moduleName, index) => {
            return (
              <React.Fragment key={index}>
                <DashboardModule
                  moduleTitle={moduleName}
                  onClick={handleTransition}
                  chartBtn={chartBtn}
                  loading={loading}
                  index={index}
                  setActiveModule={setActiveModule}
                  isOpen={activeModule.includes(index)}
                  data={moduleName ? chartData[moduleName] : {}}
                  checkCount={checkCount}
                  setCheckCount={setCheckCount}
                />
              </React.Fragment>
            );
          })}

        {somethingWrongStatus && Object.keys(chartData).length === 0 && (
          <div className="somethingWrong">
            Something went wrong! Please try again later
          </div>
        )}
      </section>
    </React.Fragment>
  );
};

export default Dashboard;
