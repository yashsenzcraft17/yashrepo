import React, { useEffect, useState } from "react";
import {
  addDays,
  endOfDay,
  startOfYear,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfDay,
  subMonths,
  format,
  subYears
} from "date-fns";

import DatePicker from "components/DatePicker";
import DatePickerMobile from "components/DatePickerMobile";

import CalendarLogo from "assets/images/dashboardHeader/calendarLogo.svg";
import CalendarDesktop from "assets/images/dashboardHeader/calendarDesktop.svg";
import DownArrow from "assets/images/header/downArrow.svg";
import ExportLogo from "assets/images/tripDashboard/exportLogo.svg";
import CalendarActive from "assets/images/dashboardHeader/calendarPhnActive.svg";

import "components/DashboardHeader/dashboardHeader.scss";

const DashboardHeader = ({
  title,
  setFilterDate,
  exportClicked,
  exportClickedXL,
  exportLoading,
  setOpenExport,
  openExport,
  setExportDate
}) => {
  const [calendar, setCalendar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [calendarPhn, setCalendarPhn] = useState(false);
  const [phnCalendarLogo, setPhnCalendarLogo] = useState(false);
  const [monthRanges, setMonthRanges] = useState("Last 12 Months");
  const [rangeOriginal, setRangeOriginal] = useState("Last 12 Months");
  const [rangePhn, setRangePhn] = useState("Last12Months");
  const [confirmDate, setConfirmDate] = useState([
    {
      startDate: startOfDay(subYears(new Date(), 1)),
      endDate: endOfDay(new Date()),
      key: "selection"
    }
  ]);
  const [mockRange, setMockRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 0),
      key: "selection"
    }
  ]);

  /**
   * Adds an event listener to the window object to handle resizing of the window.
   */
  useEffect(() => {
    // Update the window width when it's resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Attach the event listener when the component mounts
    window.addEventListener("resize", handleResize);

    // Detach the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  const dropdownData = [
    {
      label: "This Month",
      value: "ThisMonth"
    },
    {
      label: "Last 3 Months",
      value: "Last3Months"
    },
    {
      label: "Last 6 Months",
      value: "Last6Months"
    },
    {
      label: "Last 12 Months",
      value: "Last12Months"
    },
    {
      label: "Custom",
      value: "Custom"
    }
  ];

  const onCalendar = () => {
    setCalendar((prev) => !prev);
    setMockRange(confirmDate);
  };

  //  * Handles the change event of a dropdown menu and updates the state based on the selected value.
  const handleDropdownChange = (value) => {
    switch (value) {
      case "ThisMonth":
        setMockRange([
          {
            startDate: startOfMonth(new Date()),
            endDate: endOfMonth(new Date()),
            key: "selection"
          }
        ]);
        setRangePhn("ThisMonth");
        break;
      case "Last6Months":
        setMockRange([
          {
            startDate: startOfMonth(addMonths(new Date(), -6)),
            endDate: endOfDay(new Date()),
            key: "selection"
          }
        ]);
        setRangePhn("Last6Months");
        break;
      case "Last3Months":
        setMockRange([
          {
            startDate: startOfDay(subMonths(new Date(), 3)),
            endDate: endOfDay(new Date()),
            key: "selection"
          }
        ]);
        setRangePhn("Last3Months");
        break;
      case "Last12Months":
        setMockRange([
          {
            startDate: startOfYear(new Date()),
            endDate: endOfDay(new Date()),
            key: "selection"
          }
        ]);
        setRangePhn("Last12Months");
        break;
      case "Custom":
        setMockRange([
          {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection"
          }
        ]);
        setRangePhn("Custom");
        break;
      default:
        break;
    }
  };

  const openExportPopup = () => {
    setOpenExport((prev) => !prev);
  };

  const handleClick = (event) => {
    // calendarLogoPhn
    const profilePopup = event.target.closest("#calendarLogoPhn");
    if (!profilePopup && !event.target.closest("#datePickerPhn")) {
      document.querySelector("body").classList.remove("no-scroll");
      setRangePhn("");
      setCalendarPhn(false);
    }
  };

  /**
   * Handles the click event for exporting data.
   * If the current path is "/trip-dashboard" or "/marketing-lead-dashboard" and the click event
   * did not occur on the export button or the export popup, it closes the export popup.
   */

  const handleClickExport = (event) => {
    const currentPath = window.location.pathname;
    if (
      (currentPath === "/trip-dashboard" ||
        currentPath === "/marketing-lead-dashboard") &&
      !event.target.closest("#exportBtn") &&
      !event.target.closest("#exportPopup")
    ) {
      setOpenExport(false);
    }
  };

  const calendarPhnClick = () => {
    setCalendarPhn(true);
    setMockRange(confirmDate);
    document.querySelector("body").classList.add("no-scroll");
  };

  useEffect(() => {
    window.addEventListener("click", handleClick);
    window.addEventListener("click", handleClickExport);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("click", handleClickExport);
    };
  }, []);

  useEffect(() => {
    setConfirmDate([
      {
        startDate: startOfDay(subYears(new Date(), 1)),
        endDate: endOfDay(new Date()),
        key: "selection"
      }
    ]);
  }, []);

  useEffect(() => {
    window.location.pathname === "/trip-dashboard" &&
      setExportDate(confirmDate);
  }, [confirmDate]);

  return (
    <div style={{ height: "41px", width: "100%", backgroundColor: "#ecf3f5" }}>
      <div
        className="dashboardHeader"
        style={{
          padding:
            window.location.pathname !== "/dashboard" && "32px 16px 10px 32px"
        }}
      >
        <h2 className="custom-chart">{title}</h2>
        <div className="dashboardHeaderExportCalendar">
          {window.location.pathname !== "/dashboard" && (
            <button
              className={`exportBtn ${!exportLoading && "exportBtnLoading"}`}
              id="exportBtn"
              onClick={openExportPopup}
              disabled={!exportLoading}
            >
              {exportLoading ? (
                <>
                  Export <img src={ExportLogo} alt="ExportLogo" />
                </>
              ) : (
                <div className="exportSpinner"></div>
              )}
            </button>
          )}
          {openExport && (
            <div className="exportPopup" id="exportPopup">
              <button onClick={exportClicked}>Export as PDF</button>
              <button onClick={exportClickedXL}>Export as XLSX</button>
            </div>
          )}

          {windowWidth > 768 ? (
            <React.Fragment>
              <div
                className="dashboardHeaderCalendar custom-chart"
                onClick={onCalendar}
                id="dashboardHeaderCalendar"
              >
                <span className="dashboardHeaderCalendarPicker">
                  <p>
                    {format(confirmDate[0].startDate, "dd MMM yy")}{" "}
                    <label></label>
                    {format(confirmDate[0].endDate, "dd MMM yy")}
                  </p>
                  <img src={CalendarDesktop} alt="CalendarDesktop" />
                </span>

                <label onClick={onCalendar}></label>
                <div
                  className="selectedDates"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCalendar((prev) => !prev);
                  }}
                >
                  {/* <select onChange={(e) => handleDropdownChange(e.target.value)}>
                {dropdownData.map((item, i) => (
                  <option key={i} value={item?.value}>
                    {item?.label}
                  </option>
                ))}
              </select> */}
                  <span>{rangeOriginal}</span>
                  <img src={DownArrow} alt="DownArrow" />
                </div>
              </div>
              {calendar && (
                <DatePicker
                  setCalendar={setCalendar}
                  mockRange={mockRange}
                  setMockRange={setMockRange}
                  setMonthRanges={setMonthRanges}
                  setFilterDate={setFilterDate}
                  setConfirmDate={setConfirmDate}
                  monthRanges={monthRanges}
                  setRangeOriginal={setRangeOriginal}
                  confirmDate={confirmDate}
                />
              )}
            </React.Fragment>
          ) : (
            <>
              <span
                className="calendarLogo"
                id="calendarLogoPhn"
                onClick={calendarPhnClick}
              >
                <img
                  src={phnCalendarLogo ? CalendarActive : CalendarLogo}
                  alt="CalendarLogo"
                />
              </span>
              {/* <div className={calendarPhn && "datePickerPhnParent"}> */}
              <div className={calendarPhn ? "datePickerPhnParent" : ""}>
                <div
                  className="datePickerPhn"
                  id="datePickerPhn"
                  style={{ bottom: calendarPhn ? "0" : "-100%" }}
                >
                  <h3>Choose Date</h3>
                  <div className="datePickerPhnDropdown">
                    <label>Select Duration</label>
                    <div className="datePickerPhnDropdownCover">
                      <select
                        onChange={(e) => handleDropdownChange(e.target.value)}
                        value={rangePhn}
                      >
                        {dropdownData.map((item, i) => (
                          <option key={i} value={item?.value}>
                            {item?.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <DatePickerMobile
                    setCalendarPhn={setCalendarPhn}
                    mockRange={mockRange}
                    setMockRange={setMockRange}
                    setPhnCalendarLogo={setPhnCalendarLogo}
                    setConfirmDate={setConfirmDate}
                    setRangePhn={setRangePhn}
                    setFilterDate={setFilterDate}
                    confirmDate={confirmDate}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
