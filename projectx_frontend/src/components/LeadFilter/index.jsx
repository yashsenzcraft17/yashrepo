import React, { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { EncryptStorage } from "encrypt-storage";

import {
  getLeadListFilterData,
  getChannelFilterData
} from "services/leadFilterApi";

import Close from "assets/images/TripFilter/close.svg";

import FilterCard from "components/FilterCard";
import MultiSelect from "components/MultiSelector";

import CalendarLogo from "assets/images/dashboardHeader/calendarDesktop.svg";

const LeadFilter = ({
  addFilterValue,
  activeFilter,
  setActiveFilter,
  setActiveCalendar,
  selectedDate,
  activeCalendar,
  state,
  setSelectedDate,
  setFilterValues,
  setMultiselectValue,
  filterInfo,
  setFilterInfo,
  setState,
  applyFilters,
  multiselectValue
}) => {
  const [originCount, setOriginCount] = useState("");
  const [filterActive, setFilterActive] = useState(null);
  const [originOptions, setOriginOptions] = useState([]);
  const [channelOptions, setChannelOptions] = useState([]);
  const [seeAll, setSeeAll] = useState("");

  const encryptStorage = new EncryptStorage("senzcraft123#", {
    prefix: ""
  });

  const profileData = encryptStorage.getItem("authData");
  const { data } = profileData;

  // filter api
  useEffect(() => {
    const getLeadListData = async () => {
      const email = data?.email;
      const startsWith = "";
      const response = await getLeadListFilterData(email, startsWith);
      if (response?.status === "1") {
        const leadType = response?.data?.lead_type_list || [];
        const formattedData = leadType.map(({ id, ...rest }) => ({
          value: id,
          ...rest
        }));
        setOriginOptions(formattedData);

        // remove the empty string
        // const filteredCityList = cityList.filter(
        //   ([value, label]) =>
        //   label
        //   .toLowerCase()
        //   .replace(/\b(\w)/g, (x) => x.toUpperCase())
        //   .trim() !== ""
        //   );

        // // Convert the filtered city_list format to match the mockOptions format
        // const newApiOptions = filteredCityList.map(([value, label]) => ({
        //   value,
        //   label: label
        //     .toLowerCase()
        //     .replace(/\b(\w)/g, (x) => x.toUpperCase())
        //     .trim()
        // }));

        // setOriginOptions(newApiOptions);
      }
    };

    const getChannelListData = async () => {
      const email = data?.email;
      const startsWith = "";
      const response = await getChannelFilterData(email, startsWith);
      if (response?.status === "1") {
        const leadType = response?.data?.lead_channel_list || [];
        // remove the empty string
        const filteredCityList = leadType.filter(
          ([value, label]) =>
            label
              .toLowerCase()
              .replace(/\b(\w)/g, (x) => x.toUpperCase())
              .trim() !== ""
        );

        // Convert the filtered city_list format to match the mockOptions format
        const newApiOptions = filteredCityList.map(([value, label]) => ({
          value,
          label: label
            .toLowerCase()
            .replace(/\b(\w)/g, (x) => x.toUpperCase())
            .trim()
        }));
        setChannelOptions(newApiOptions);
      }
    };
    getLeadListData();
    getChannelListData();
  }, []);

  const closeFilter = () => {
    setActiveFilter(false);
    setSeeAll(true);
    if (Object.keys(filterInfo).length === 0) {
      setMultiselectValue({});
    }
  };

  const openCalendar = () => {
    setActiveCalendar((prev) => !prev);
  };

  const handleChange = (item, key) => {
    setState([item.selection]);
    addFilterValue(item, key);

    const formattedStartDate = item.selection.startDate
      ? format(item.selection.startDate, "dd MMM yy")
      : "";
    const formattedEndDate = item.selection.endDate
      ? format(item.selection.endDate, "dd MMM yy")
      : "";
    setSelectedDate({
      startDate: formattedStartDate,
      endDate: formattedEndDate
    });
  };

  const clearDate = () => {
    setActiveCalendar(false);
    setSelectedDate({});
  };

  const applyDate = () => {
    setActiveCalendar(false);
    const formattedStartDate = state[0].startDate
      ? format(state[0].startDate, "dd MMM yy")
      : "";
    const formattedEndDate = state[0].endDate
      ? format(state[0].endDate, "dd MMM yy")
      : "";
    setSelectedDate({
      startDate: formattedStartDate,
      endDate: formattedEndDate
    });
  };

  const resetFilter = () => {
    setFilterValues({});
    setMultiselectValue({});

    setState([
      {
        startDate: new Date(),
        endDate: null,
        key: "selection"
      }
    ]);

    setSelectedDate({});
    delete filterInfo.lead_type_list;
    delete filterInfo.channel_list;
    delete filterInfo.contact_date;
    setFilterInfo({});

    setActiveCalendar(false);
    setActiveFilter(false);
  };

  return (
    <div className="tripFilter" style={{ right: activeFilter ? "0" : "-100%" }}>
      <div style={{ width: "100%" }}>
        <div className="tripFilterTitle">
          <h4>Filter</h4>
          <img onClick={closeFilter} src={Close} alt="Close" />
        </div>
        <div className="tripFilterSection">
          <FilterCard
            filterTitle="Lead Type"
            selected={originCount}
            id="1"
            filterActive={filterActive}
            setFilterActive={setFilterActive}
            selectedCount={multiselectValue?.lead_type_list}
          >
            <MultiSelect
              originCount={originCount}
              setOriginCount={setOriginCount}
              multiselectValue={multiselectValue}
              addFilterValue={(value) =>
                addFilterValue(value, "lead_type_list")
              }
              selectKey={"lead_type_list"}
              setSeeAll={setSeeAll}
              seeAll={seeAll}
              apiOptions={originOptions}
              apiCallFunction={getLeadListFilterData}
              placeholderData={"Search for lead type"}
            />
          </FilterCard>
          <FilterCard
            filterTitle="Channel"
            selected={originCount}
            id="2"
            filterActive={filterActive}
            setFilterActive={setFilterActive}
            selectedCount={multiselectValue?.channel_list}
          >
            <MultiSelect
              originCount={originCount}
              setOriginCount={setOriginCount}
              selectKey={"channel_list"}
              multiselectValue={multiselectValue}
              addFilterValue={(value) => addFilterValue(value, "channel_list")}
              seeAll={seeAll}
              setSeeAll={setSeeAll}
              apiOptions={channelOptions}
              apiCallFunction={getChannelFilterData}
              placeholderData={"Search for channel"}
            />
          </FilterCard>
          <FilterCard
            filterTitle="Contacted Date"
            id="3"
            filterActive={filterActive}
            setFilterActive={setFilterActive}
          >
            <div className="tripDate">
              <div className="tripDateSection" onClick={openCalendar}>
                <p>
                  {selectedDate.startDate} <label></label>
                  {selectedDate.endDate}
                </p>
                <img src={CalendarLogo} alt="CalendarLogo" />
              </div>
              {activeCalendar && (
                <>
                  <div className="tripStart">
                    <DateRange
                      editableDateInputs={true}
                      onChange={(item) => handleChange(item, "contacted_date")}
                      moveRangeOnFirstSelection={false}
                      ranges={state}
                    />
                  </div>
                  <div className="tripDateBtn">
                    <button onClick={clearDate}>Clear</button>
                    <button onClick={applyDate}>Apply</button>
                  </div>
                </>
              )}
            </div>
          </FilterCard>
        </div>
      </div>
      <div className="tripFilterButtons">
        <button onClick={resetFilter}>Reset</button>
        <button onClick={applyFilters}>Apply Filters</button>
      </div>
    </div>
  );
};

export default LeadFilter;
