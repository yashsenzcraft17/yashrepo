import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { EncryptStorage } from "encrypt-storage";
import { toast } from "react-toastify";

import TripListingNavBar from "components/TripListingNavBar";
import TripListTable from "components/TripListTable";
import TripFilter from "components/TripFilter";

import { TripListingTable } from "constants/tripListingTable";

import { getTripListData } from "services/tripList";

import { getWindowWidth } from "utils/window";

// import { TripListingUIData } from "constants/tripListing";

import "containers/TripListing/tripListing.scss";

// import goBackLogo from "assets/images/TripListing/goBack.svg";
import logo from "assets/images/TripListing/greaterThanSymbol.svg";

const TripListing = () => {
  const [originalData, setOriginalData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  // const [prevPage, setPrevPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [multiselectValue, setMultiselectValue] = useState({});
  const [activeTab, setActiveTab] = useState("All");
  const [activeFilter, setActiveFilter] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [activeCalendar, setActiveCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState({});
  const [searchData, setSearchData] = useState("");
  const [loading, setLoading] = useState(false);
  const [notFiltered, setNotFiltered] = useState({});
  const [filterInfo, setFilterInfo] = useState({});
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [tripStatus, setTripStatus] = useState(["0"]);
  const [serverError, setServerError] = useState(false);
  const [resetSlider, setResetSlider] = useState(false);
  const [filterActive, setFilterActive] = useState(null);
  const [storeSearchResult, setStoreSearchResult] = useState();
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection"
    }
  ]);
  const encryptStorage = new EncryptStorage("senzcraft123#", {
    prefix: ""
  });

  const token = encryptStorage.getItem("authToken");
  const profileData = encryptStorage.getItem("authData");
  const { data } = profileData;
  const navigate = useNavigate();
  const columns = useMemo(() => TripListingTable, []);

  const totalCount = filteredData?.length;

  const navBarClickingData = originalData?.trip_status_count;

  const formattedData = {
    All: navBarClickingData?.All || 0,
    Running: navBarClickingData?.Running || 0,
    Scheduled: navBarClickingData?.Scheduled || 0,
    Completed: navBarClickingData?.Completed || 0,
    Cancelled: navBarClickingData?.Cancelled || 0
  };

  const navBarData = [
    {
      data: "All",
      label: "All",
      // count: totalCount
      count: formattedData?.All,
      statusId: "0"
    },
    {
      data: "Running",
      label: "Running",
      // count: filteredData.filter((item) => item.status === "In-progress").length
      count: formattedData?.Running,
      statusId: "2"
    },
    {
      data: "Scheduled",
      label: "Scheduled",
      // count: filteredData.filter((item) => item.status === "Scheduled").length
      count: formattedData?.Scheduled,
      statusId: "1"
    },
    {
      data: "Completed",
      label: "Completed",
      // count: filteredData.filter((item) => item.status === "Completed").length
      count: formattedData?.Completed,
      statusId: "3"
    },
    {
      data: "Cancelled",
      label: "Cancelled",
      // count: filteredData.filter((item) => item.status === "Completed").length
      count: formattedData?.Cancelled,
      statusId: "4"
    }
  ];

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      getData();
    }, 500);
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [activeTab, currentPage, itemsPerPage, searchData, tripStatus]);

  useEffect(() => {
    if (Object.keys(filterInfo).length || isFilterApplied) {
      const debounceTimer = setTimeout(() => {
        getData();
      }, 500);

      if (!Object.keys(filterInfo).length && isFilterApplied) {
        setIsFilterApplied(false);
      }

      return () => {
        clearTimeout(debounceTimer);
      };
    }
  }, [filterInfo]);

  useEffect(() => {
    // Update count or related state after API call
  }, [storeSearchResult, activeTab]);

  useEffect(() => {
    const filterStore = JSON.parse(localStorage.getItem("filterData"));
    setFilterInfo(filterStore || {});
    setSelectedDate({
      startDate: filterStore?.trip_start_date?.from,
      endDate: filterStore?.trip_start_date?.to
    });
    setIsFilterApplied(true);
    const multiselectValue = localStorage.getItem("multiselectValue");
    setMultiselectValue(JSON.parse(multiselectValue));
  }, []);

  useEffect(() => {
    localStorage.setItem("multiselectValue", JSON.stringify(multiselectValue));
  }, [multiselectValue]);

  const getData = async () => {
    setLoading(false);

    const tripList = await getTripListData(
      {
        email: data?.email,
        search_string: searchData,
        current_page_no: currentPage,
        record_per_page: itemsPerPage?.toString(),
        ...(tripStatus[0] === "0" ? {} : { trip_status: tripStatus }),
        filter_info: filterInfo,
        role_id: String(data?.role_id)
      },
      token
    );
    if (tripList?.response?.status === 401) {
      toast.error(
        <>
          <span className="formAPIError">
            {data?.err_msg || "Session Expired, Redirecting to login page"}
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
      navigate("/");
    }

    if (tripList?.status === 200) {
      encryptStorage?.setItem("authToken", tripList?.data?.token);
      setServerError(false);
    }

    if (tripList?.response?.status === 500) {
      setServerError(true);
    }

    setLoading(true);

    if (searchData.length > 0) {
      if (originalData?.trip_status_count) {
        const updatedData = {
          ...originalData,
          trip_status_count: {
            ...originalData.trip_status_count,
            [activeTab]: tripList?.data?.data?.trip_status_count[activeTab]
          }
        };
        const searchResultCount =
          tripList?.data?.data?.trip_status_count[activeTab];

        setStoreSearchResult(searchResultCount);
        setOriginalData(updatedData);
      }
    } else {
      setOriginalData(tripList?.data?.data);
    }

    if (tripStatus[0] === "0") {
      setFilteredData(
        tripList?.data?.data?.records.length > 0
          ? tripList?.data?.data?.records
          : []
      );
    } else {
      setFilteredData(tripList?.data?.data?.records);
    }
    // else {
    //   const filtered = tripList?.data?.data?.records?.filter(
    //     (item) => item.status === activeTab
    //   );
    //   setFilteredData(filtered?.length > 0 ? filtered : []);
    // }
  };
  // useEffect(() => {
  //   setCurrentPage(prevPage);
  // }, [prevPage]);

  const addFilterValue = (value, key) => {
    // Handle date inputs (calendar)
    if (key === "trip_start_date") {
      const formattedStartDate = value.selection.startDate
        ? format(value.selection.startDate, "yyyy-MM-dd")
        : "";
      const formattedEndDate = value.selection.endDate
        ? format(value.selection.endDate, "yyyy-MM-dd")
        : "";

      setMultiselectValue((pre) => ({
        ...pre,
        [key]: formattedStartDate,
        endDate: formattedEndDate
      }));

      setFilterValues((pre) => ({
        ...pre,
        [key]: formattedStartDate,
        trip_start_date: { from: formattedStartDate, to: formattedEndDate }
      }));
      setNotFiltered((pre) => ({
        ...pre,
        trip_start_date: { from: formattedStartDate, to: formattedEndDate }
      }));
    } else if (key === "cost_range" || key === "distance") {
      const filterKey = key === "cost_range" ? "cost_range" : "distance";

      setNotFiltered((prev) => ({
        ...prev,
        [filterKey]: {
          min: String(value?.data?.min),
          max: String(value?.data?.max)
        }
      }));
    } else {
      // Handle other inputs
      setNotFiltered((prevNotFiltered) => {
        const updatedNotFiltered = { ...prevNotFiltered };
        const result = Array?.isArray(value)
          ? value.map((item) => item?.value?.toString())
          : [value.toString()];

        if (result.length > 0 && result[0] !== "0") {
          updatedNotFiltered[key] = result;
        } else {
          delete updatedNotFiltered[key];
        }

        return updatedNotFiltered;
      });

      if (value.length) {
        setMultiselectValue((pre) => ({
          ...pre,
          [key]: value
        }));

        const values = Array?.isArray(value)
          ? value.map((item) => item?.value)
          : [value.value];

        setFilterValues((prevFilterValues) => ({
          ...prevFilterValues,
          [key]: values
        }));
      } else {
        const values = { ...filterValues };
        delete values[key];
        setFilterValues(values);

        const selectValue = { ...multiselectValue };
        delete selectValue[key];
        setMultiselectValue(selectValue);
      }

      // Handle kms slider
      // if (key === "distance" || key === "cost") {
      //   setMultiselectValue((pre) => ({
      //     ...pre,
      //     [key]: value,
      //   }));

      //   setFilterValues((pre) => ({
      //     ...pre,
      //     [key]: {
      //       min: value[0],
      //       max: value[1],
      //     },
      //   }));
      // } else {
      //   setFilterValues((pre) => ({
      //     ...pre,
      //     [key]: Array.isArray(value) ? [value[0]?.value] : [value.value],
      //   }));
      // }
    }
  };

  const applyFilters = () => {
    // Check if there are any filters applied
    if (Object.keys(notFiltered)?.length > 0) {
      localStorage.setItem("filterData", JSON.stringify(notFiltered));
      setFilterInfo(notFiltered);
      setActiveFilter(false);
      setIsFilterApplied(true);
    } else {
      // No filters applied, do not make the API call
      setActiveFilter(false);
    }
  };

  const handleResetFilter = () => {
    localStorage.removeItem("filterData");
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

  const handleRowClick = (data, type) => {
    let id;
    if (type === "TRIP_MOBILE") {
      id = data;
    } else {
      id = data?.values.trip_id;
    }

    // const tripId = row?.values?.trip_id;
    const encodedTripId = encodeURIComponent(id);
    navigate(`/tripListing/${encodedTripId}`);
  };

  const navigateId = () => {
    navigate("/tripListing");
  };

  return (
    <div className="tripListing">
      {/* breadCrumbs mobile */}
      <div className="tripDetailsBreadCrumbsMobile">
        {/* <Link to={"/tripListing"}>
          <img src={goBackLogo} alt="goBackLogo" />
        </Link> */}
        <h4>Trip Listing</h4>
      </div>

      {/* breadCrumbs */}
      <div className="tripDetailsBreadCrumbs">
        <div className="tripDetailsBreadCrumbsContent">
          <Link to={"/tripListing"}>
            <span className="tripDetailsBreadCrumbsData">
              Transport Operation
            </span>{" "}
          </Link>
          <img src={logo} alt="logo" />
          <label className="tripDetailsBreadCrumbsHeading">Trip Listing</label>
        </div>
        <div className="tripDetailsBreadCrumbsPara">
          <p>Trip Listing</p>
        </div>
      </div>

      <TripListingNavBar
        navBarData={navBarData}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        totalCount={totalCount}
        filteredData={filteredData}
        setActiveFilter={setActiveFilter}
        setSearchData={setSearchData}
        setTripStatus={setTripStatus}
        searchData={searchData}
        setFilterInfo={setFilterInfo}
        filterInfo={filterInfo}
        setFilterValues={setFilterValues}
        setMultiselectValue={setMultiselectValue}
        setCurrentPage={setCurrentPage}
      />

      <TripListTable
        setOriginalData={setOriginalData}
        originalData={originalData?.pagination}
        setActiveFilter={setActiveFilter}
        filteredData={filteredData}
        handleResetFilter={handleResetFilter}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        setItemsPerPage={setItemsPerPage}
        itemsPerPage={itemsPerPage}
        loading={loading}
        setSearchData={setSearchData}
        filterInfo={filterInfo}
        serverError={serverError}
        searchData={searchData}
        searchResult={storeSearchResult}
        columns={columns}
        handleRowClick={handleRowClick}
        navigateId={navigateId}
        searchPlaceholder="Search for trip id, route code, city (origin)"
        sortHead="start_date"
        isSecondTable={true}
      />
      <TripFilter
        setActiveFilter={setActiveFilter}
        activeFilter={activeFilter}
        filterValues={filterValues}
        addFilterValue={addFilterValue}
        applyFilters={applyFilters}
        setFilterValues={setFilterValues}
        multiselectValue={multiselectValue}
        setMultiselectValue={setMultiselectValue}
        setActiveCalendar={setActiveCalendar}
        activeCalendar={activeCalendar}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        state={state}
        setState={setState}
        setFilterInfo={setFilterInfo}
        filterInfo={filterInfo}
        notFiltered={notFiltered}
        setResetSlider={setResetSlider}
        resetSlider={resetSlider}
        setNotFiltered={setNotFiltered}
        setFilterActive={setFilterActive}
        filterActive={filterActive}
        setIsFilterApplied={setIsFilterApplied}
      />
    </div>
  );
};

export default TripListing;
