import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { EncryptStorage } from "encrypt-storage";

import {
  getRouteCodeOptions,
  getOriginOptions,
  getLoadType
} from "services/filterAPI";

import FilterCard from "components/FilterCard";

import Close from "assets/images/TripFilter/close.svg";
import CalendarLogo from "assets/images/dashboardHeader/calendarDesktop.svg";

import MultiSelect from "components/MultiSelector";
import SliderRange from "components/SliderRange";

import "components/TripFilter/tripFilter.scss";

const TripFilter = ({
  activeFilter,
  setActiveFilter,
  addFilterValue,
  setActiveCalendar,
  applyFilters,
  setFilterValues,
  filterValues,
  multiselectValue,
  activeCalendar,
  setMultiselectValue,
  selectedDate,
  setSelectedDate,
  state,
  setState,
  filterInfo,
  setFilterInfo,
  setResetSlider,
  resetSlider,
  setFilterActive,
  notFiltered,
  filterActive
}) => {
  const [originCount, setOriginCount] = useState("");
  const [originOptions, setOriginOptions] = useState([]);
  const [routeCodeOption, setRouteCodeOption] = useState([]);
  const [loadType, setLoadType] = useState([]);
  const [seeAll, setSeeAll] = useState("");

  const encryptStorage = new EncryptStorage("senzcraft123#", {
    prefix: ""
  });

  // originData API Call
  useEffect(() => {
    const profileData = encryptStorage.getItem("authData");
    const { data } = profileData;

    const fetchOriginOptions = async () => {
      const email = data?.email;
      const startsWith = "";

      const response = await getOriginOptions(email, startsWith);

      if (response?.status === "1") {
        const cityList = response?.data?.city_list || [];

        // remove the empty string
        const filteredCityList = cityList.filter(
          ([value, label]) =>
            label
              ?.toLowerCase()
              .replace(/\b(\w)/g, (x) => x.toUpperCase())
              .trim() !== ""
        );

        // Convert the filtered city_list format to match the mockOptions format
        const newApiOptions = filteredCityList.map(([value, label]) => ({
          value,
          label: label
            ?.toLowerCase()
            .replace(/\b(\w)/g, (x) => x.toUpperCase())
            .trim()
        }));

        setOriginOptions(newApiOptions);
      }
    };

    const fetchRouteCodeOptions = async () => {
      const email = data?.email;
      const startsWith = "";
      const response = await getRouteCodeOptions(email, startsWith);
      if (response?.status === "1") {
        const cityList = response?.data?.route_list || [];

        // remove the empty string
        const filteredRouteCode = cityList.filter(
          ([value, code, label]) =>
            label
              ?.toLowerCase()
              .replace(/\b(\w)/g, (x) => x.toUpperCase())
              .trim() !== ""
        );

        // Convert the filtered city_list format to match the mockOptions format
        const newDestinationOption = filteredRouteCode.map(
          ([value, code, label]) => ({
            code,
            value,
            label: `${code} ${label
              ?.toLowerCase()
              .replace(/\b(\w)/g, (x) => x.toUpperCase())
              .trim()}`
          })
        );
        setRouteCodeOption(newDestinationOption);
      }
    };

    // load type
    const fetchLoadTypeOptions = async () => {
      const email = data?.email;
      const startsWith = "";
      const response = await getLoadType(email, startsWith);
      if (response?.status === "1") {
        const loadType = response?.data?.loadtype_list || [];
        // remove the empty string
        const filteredCityList = loadType.filter(
          ([value, label]) => label.trim() !== ""
        );

        // Convert the filtered city_list format to match the mockOptions format
        const newLoadTypeOptions = filteredCityList.map(([value, label]) => ({
          value,
          label: label
            ?.toLowerCase()
            .replace(/\b(\w)/g, (x) => x.toUpperCase())
            .trim()
        }));

        setLoadType(newLoadTypeOptions);
      }
    };

    fetchOriginOptions();
    fetchRouteCodeOptions();
    fetchLoadTypeOptions();
  }, []);

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

  const closeFilter = () => {
    setActiveFilter(false);
    setSeeAll(true);
    // setMultiselectValue({});
  };

  // const handleResetFilter = () => {
  //   // Check if there are any filter values entered
  //   if (
  //     Object.keys(filterInfo).length === 0 &&
  //     Object.keys(filterValues).length === 0 &&
  //     Object.keys(multiselectValue).length === 0
  //   ) {
  //     // If no filter values are entered, do not make the API call
  //     setActiveFilter(false);
  //     setState([
  //       {
  //         startDate: new Date(),
  //         endDate: null,
  //         key: "selection"
  //       }
  //     ]);
  //     setSelectedDate({});
  //     setActiveCalendar(false);
  //   } else {
  //     // If filter values are entered, reset without making the API call
  //     delete filterInfo?.origin_city_list;
  //     delete filterInfo?.destination_city_list;
  //     delete filterInfo?.route_list;
  //     delete filterInfo?.trip_start_date;
  //     delete filterInfo?.distance;
  //     delete filterInfo?.load_type;
  //     delete filterInfo?.cost_range;
  //     setFilterInfo({});
  //     setFilterValues({});
  //     setMultiselectValue({});
  //     setActiveFilter(false);
  //     setState([
  //       {
  //         startDate: new Date(),
  //         endDate: null,
  //         key: "selection"
  //       }
  //     ]);
  //     setSelectedDate({});
  //     setActiveCalendar(false);
  //     setFilterActive(null);
  //     setResetSlider((prev) => !prev);
  //   }
  // };

  const handleResetFilter = () => {
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
    delete filterInfo.origin_city_list;
    delete filterInfo.destination_city_list;
    delete filterInfo.route_list;
    delete filterInfo.trip_start_date;
    delete filterInfo.distance;
    delete filterInfo.load_type;
    delete filterInfo.cost_range;
    setFilterInfo({});

    setActiveCalendar(false);
    setActiveFilter(false);
    setFilterActive(null);
    setResetSlider((prev) => !prev);
  };

  const openCalendar = () => {
    setActiveCalendar((prev) => !prev);
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

  const clearDate = () => {
    setActiveCalendar(false);
    setSelectedDate({});
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
            filterTitle="Origin"
            selected={originCount}
            id="1"
            filterActive={filterActive}
            setFilterActive={setFilterActive}
            selectedCount={multiselectValue?.origin_city_list}
          >
            <MultiSelect
              originCount={originCount}
              setOriginCount={setOriginCount}
              addFilterValue={(value) =>
                addFilterValue(value, "origin_city_list")
              }
              multiselectValue={multiselectValue}
              selectKey={"origin_city_list"}
              apiOptions={originOptions}
              apiCallFunction={getOriginOptions}
              placeholderData={"Search for origin city"}
              setSeeAll={setSeeAll}
              seeAll={seeAll}
            />
          </FilterCard>
          <FilterCard
            filterTitle="Destination"
            id="2"
            filterActive={filterActive}
            setFilterActive={setFilterActive}
            selectedCount={multiselectValue?.destination_city_list}
          >
            <MultiSelect
              addFilterValue={(value) =>
                addFilterValue(value, "destination_city_list")
              }
              multiselectValue={multiselectValue}
              selectKey={"destination_city_list"}
              placeholderData={"Search for destination"}
              apiOptions={originOptions}
              apiCallFunction={getOriginOptions}
              setSeeAll={setSeeAll}
              seeAll={seeAll}
            />
          </FilterCard>
          <FilterCard
            filterTitle="Trip Date"
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
                      onChange={(item) => handleChange(item, "trip_start_date")}
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
          <FilterCard
            filterTitle="Route Code"
            id="4"
            filterActive={filterActive}
            setFilterActive={setFilterActive}
            selectedCount={multiselectValue?.route_list}
          >
            <MultiSelect
              originCount={originCount}
              setOriginCount={setOriginCount}
              addFilterValue={(value) => addFilterValue(value, "route_list")}
              multiselectValue={multiselectValue}
              selectKey={"route_list"}
              apiOptions={routeCodeOption}
              apiCallFunction={getRouteCodeOptions}
              placeholderData={"Search for route code"}
              setSeeAll={setSeeAll}
              seeAll={seeAll}
            />
          </FilterCard>
          <FilterCard
            filterTitle="Load Type"
            id="5"
            filterActive={filterActive}
            setFilterActive={setFilterActive}
            selectedCount={multiselectValue?.load_type}
          >
            <MultiSelect
              originCount={originCount}
              setOriginCount={setOriginCount}
              addFilterValue={(value) => addFilterValue(value, "load_type")}
              multiselectValue={multiselectValue}
              selectKey={"load_type"}
              apiCallFunction={getLoadType}
              apiOptions={loadType}
              placeholderData={"Search for load type"}
              setSeeAll={setSeeAll}
              seeAll={seeAll}
            />
          </FilterCard>

          <FilterCard
            filterTitle="Distance"
            id="6"
            filterActive={filterActive}
            setFilterActive={setFilterActive}
          >
            <SliderRange
              spanValue="Km"
              addFilterValue={(value) => addFilterValue(value, "distance")}
              multiselectValue={multiselectValue}
              selectKey={"distance"}
              resetSlider={resetSlider}
            />
          </FilterCard>

          <FilterCard
            filterTitle="Cost"
            id="7"
            filterActive={filterActive}
            setFilterActive={setFilterActive}
          >
            <SliderRange
              spanValue="₹"
              addFilterValue={(value) => addFilterValue(value, "cost_range")}
              multiselectValue={multiselectValue}
              selectKey={"cost_range"}
              resetSlider={resetSlider}
            />
          </FilterCard>
        </div>
      </div>
      <div className="tripFilterButtons">
        <button onClick={handleResetFilter}>Reset</button>
        <button onClick={applyFilters}>Apply Filters</button>
      </div>
    </div>
  );
};

export default TripFilter;
