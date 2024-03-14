import React, { useEffect } from "react";
import { DateRange } from "react-date-range";
import { subYears, startOfDay, endOfDay, format } from "date-fns";

import "components/DatePickerMobile/datePickerMobile.scss";

const DatePickerMobile = ({
  setCalendarPhn,
  mockRange,
  setMockRange,
  setPhnCalendarLogo,
  setConfirmDate,
  setRangePhn,
  setFilterDate,
  confirmDate
}) => {
  // const [selectedState, setSelectedState] = useState([
  //   {
  //     startDate: startOfDay(subYears(new Date(), 1)),
  //     endDate: endOfDay(new Date()),
  //     key: "selection"
  //   }
  // ]);

  const clearFilter = () => {
    setCalendarPhn(false);
    setPhnCalendarLogo(false);
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
    document.querySelector("body").classList.remove("no-scroll");
  };

  const applyFilter = () => {
    setCalendarPhn(false);
    setPhnCalendarLogo(true);
    setConfirmDate(mockRange);
    setFilterDate({
      startDate: format(mockRange[0].startDate, "yyyy-MM-dd"),
      endDate: format(mockRange[0].endDate, "yyyy-MM-dd")
    });
    document.querySelector("body").classList.remove("no-scroll");
  };

  const handleChange = (item) => {
    setRangePhn("Custom");
    setMockRange([item.selection]);
  };

  useEffect(() => {
    // Set initial selectedState to cover the same day of the last year to today
    setMockRange([
      {
        startDate: startOfDay(subYears(new Date(), 1)),
        endDate: endOfDay(new Date()),
        key: "selection"
      }
    ]);
  }, []);

  return (
    <div className="calendarPhn">
      <div className="calendarPhnMain">
        <DateRange
          editableDateInputs={true}
          onChange={handleChange}
          moveRangeOnFirstSelection={false}
          ranges={mockRange}
          rangeColors={["#0098B3"]}
        />
      </div>
      <div className="selectBtn">
        <button onClick={clearFilter}>Clear</button>
        <button onClick={applyFilter}>Apply Filter</button>
      </div>
    </div>
  );
};

export default DatePickerMobile;
