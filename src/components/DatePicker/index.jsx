import React, { useEffect } from "react";
import {
  endOfDay,
  subMonths,
  startOfDay,
  startOfMonth,
  endOfMonth,
  isSameDay,
  format,
  subYears
} from "date-fns";
import { DateRangePicker } from "react-date-range";

import "components/DatePicker/datePicker.scss";

const DatePicker = ({
  setCalendar,
  mockRange,
  setMockRange,
  setMonthRanges,
  setFilterDate,
  setConfirmDate,
  setRangeOriginal,
  monthRanges
}) => {
  const staticRanges = [
    {
      label: "This Month",
      range: () => ({
        startDate: startOfMonth(new Date()),
        endDate:
          endOfDay(new Date()) < endOfMonth(new Date())
            ? endOfDay(new Date())
            : endOfMonth(new Date())
      }),
      isSelected(range) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      }
    },
    {
      label: "Last 3 Months",
      range: () => ({
        startDate: startOfDay(subMonths(new Date(), 3)),
        endDate: endOfDay(new Date())
      }),
      isSelected(range) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      }
    },
    {
      label: "Last 6 Months",
      range: () => ({
        startDate: startOfDay(subMonths(new Date(), 6)),
        endDate: endOfDay(new Date())
      }),
      isSelected(range) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      }
    },
    {
      label: "Last 12 Months",
      range: () => ({
        startDate: startOfDay(subMonths(new Date(), 12)),
        endDate: endOfDay(new Date())
      }),
      isSelected(range) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      }
    },
    {
      label: "Custom",
      range: () => ({
        startDate: new Date(),
        endDate: new Date()
      }),
      isSelected(range) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      }
    }
  ];

  const saveDate = () => {
    setCalendar(false);

    setConfirmDate(mockRange);
    setRangeOriginal(monthRanges);
    setFilterDate({
      startDate: format(mockRange[0].startDate, "yyyy-MM-dd"),
      endDate: format(mockRange[0].endDate, "yyyy-MM-dd")
    });
  };

  const closeDate = () => {
    const isLast12MonthsRange =
      monthRanges === "Last 12 Months" &&
      isSameDay(
        mockRange[0].startDate,
        startOfDay(subMonths(new Date(), 12))
      ) &&
      isSameDay(mockRange[0].endDate, endOfDay(new Date()));

    if (!isLast12MonthsRange) {
      setConfirmDate([
        {
          startDate: startOfDay(subYears(new Date(), 1)),
          endDate: endOfDay(new Date()),
          key: "selection"
        }
      ]);
      setFilterDate({
        startDate: format(startOfDay(subYears(new Date(), 1)), "yyyy-MM-dd"),
        endDate: format(endOfDay(new Date()), "yyyy-MM-dd")
      });

      setRangeOriginal("Last 12 Months");
    }
    setCalendar(false);
  };

  const handleChange = (item) => {
    setMockRange([item.selection]);

    // Check if the selected range matches any of the predefined ranges
    const selectedRange = staticRanges.find((range) => {
      const definedRange = range.range();
      return (
        isSameDay(item.selection.startDate, definedRange.startDate) &&
        isSameDay(item.selection.endDate, definedRange.endDate)
      );
    });

    // If the selected range is not predefined, set the label to "Custom"
    const label = selectedRange ? selectedRange.label : "Custom";

    // Pass the label to another component or perform any other action
    setMonthRanges(label);
  };

  const handleClick = (event) => {
    const calendarPopup = event.target.closest("#dashboardHeaderCalendar");
    if (!calendarPopup && !event.target.closest("#dashboardCalendar")) {
      setCalendar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="dashboardHeaderSection" id="dashboardCalendar">
      <div className="datePicker">
        <DateRangePicker
          onChange={handleChange}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={mockRange}
          direction="horizontal"
          rangeColors={["#C3ECF4"]}
          staticRanges={staticRanges}
          minDate={new Date(2000, 0, 1)}
          maxDate={new Date(new Date().getFullYear(), 11, 31)}
        />
      </div>
      <div className="dashboardHeaderSectionBtn">
        <button onClick={closeDate}>Reset</button>
        <button onClick={saveDate}>Apply</button>
      </div>
    </div>
  );
};

export default DatePicker;
