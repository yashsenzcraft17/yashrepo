import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EncryptStorage } from "encrypt-storage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

import TripListingNavBar from "components/TripListingNavBar";
import TripListTable from "components/TripListTable";
import LeadFilter from "components/LeadFilter";

import { LeadListingTable } from "constants/leadListingTable";
// import { LeadListingData } from "constants/leadListingData";
import { getLeadListData } from "services/leadList";

import { getWindowWidth } from "utils/window";

import logo from "assets/images/TripListing/greaterThanSymbol.svg";

import "containers/LeadListing/leadListing.scss";

const LeadListing = () => {
  const [originalData, setOriginalData] = useState();
  const [activeTab, setActiveTab] = useState("All");
  const [filteredData, setFilteredData] = useState([]);
  const [activeFilter, setActiveFilter] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [tripStatus, setTripStatus] = useState(["0"]);
  const [notFiltered, setNotFiltered] = useState({});
  const [filterInfo, setFilterInfo] = useState({});
  const [multiselectValue, setMultiselectValue] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValues, setFilterValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState({});
  const [activeCalendar, setActiveCalendar] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [serverError, setServerError] = useState(false);
  const [storeSearchResult, setStoreSearchResult] = useState();
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  // const [notFiltered, setNotFiltered] = useState({});
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

  const navBarClickingData = originalData?.lead_status_count;

  const formattedData = {
    all: navBarClickingData?.All || 0,
    pendingReview:
      navBarClickingData && navBarClickingData["Pending Review"]
        ? navBarClickingData["Pending Review"]
        : 0,
    posted: navBarClickingData?.Posted || 0,
    rejected: navBarClickingData?.Rejected || 0,
    existing: navBarClickingData?.Existing || 0
  };

  const navBarData = [
    {
      data: "All",
      label: "All",
      // count: totalCount
      count: formattedData?.all || 0,
      statusId: "0"
    },
    {
      data: "Pending Review",
      label: "Pending Review",
      // count: filteredData.filter((item) => item.status === "In-progress").length
      count: formattedData?.pendingReview || 0,
      statusId: "2"
    },
    {
      data: "Posted",
      label: "Posted",
      // count: filteredData.filter((item) => item.status === "Scheduled").length
      count: formattedData?.posted || 0,
      statusId: "4"
    },
    {
      data: "Rejected",
      label: "Rejected",
      // count: filteredData.filter((item) => item.status === "Completed").length
      count: formattedData?.rejected || 0,
      statusId: "5"
    },
    {
      data: "Existing",
      label: "Existing",
      count: formattedData?.existing || 0,
      statusId: "6"
    }
  ];

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      getLeadData();
    }, 500);
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [currentPage, tripStatus, searchData, itemsPerPage]);

  useEffect(() => {
    if (Object.keys(filterInfo).length || isFilterApplied) {
      const debounceTimer = setTimeout(() => {
        getLeadData();
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

  const getLeadData = async () => {
    let payload = {
      email: data?.email,
      // search_string: searchData,
      current_page_no: currentPage,
      record_per_page: itemsPerPage?.toString(),
      // lead_status: tripStatus,
      // filter_info: filterInfo,
      role_id: String(data?.role_id)
    };
    if (searchData) {
      payload = { ...payload, search_string: searchData };
    }
    if (tripStatus[0] !== "0") {
      payload = { ...payload, lead_status: tripStatus };
    }
    if (Object.keys(filterInfo).length) {
      payload = { ...payload, filter_info: filterInfo };
    }
    setLoading(false);
    const leadList = await getLeadListData(
      // {
      //   email: data?.email,
      //   // search_string: searchData,
      //   current_page_no: currentPage,
      //   record_per_page: itemsPerPage?.toString(),
      //   // lead_status: tripStatus,
      //   // filter_info: filterInfo,
      //   role_id: String(data?.role_id)
      // },
      payload,
      token
    );
    if (leadList?.response?.status === 401) {
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

    if (leadList?.status === 200) {
      encryptStorage?.setItem("authToken", leadList?.data?.token);
      setServerError(false);
    }

    if (leadList?.response?.status === 500) {
      setServerError(true);
    }

    setLoading(true);

    if (searchData?.length > 0) {
      if (originalData?.lead_status_count) {
        const updatedData = {
          ...originalData,
          lead_status_count: {
            ...originalData?.lead_status_count,
            [activeTab]: leadList?.data?.data?.lead_status_count[activeTab]
          }
        };

        const searchResultCount =
          leadList?.data?.data?.lead_status_count[activeTab];

        setStoreSearchResult(searchResultCount);
        setOriginalData(updatedData);
      }
    } else {
      setOriginalData(leadList?.data?.data);
    }

    if (tripStatus[0] === "0") {
      setFilteredData(
        leadList?.data?.data?.records?.length > 0
          ? leadList?.data?.data?.records
          : []
      );
    } else {
      setFilteredData(leadList?.data?.data?.records);
    }
  };

  const columns = useMemo(() => LeadListingTable, []);

  const applyFilters = () => {
    // Check if there are any filters applied
    if (Object.keys(notFiltered)?.length > 0) {
      localStorage.setItem("filterData", JSON.stringify(notFiltered));
      setFilterInfo(notFiltered);
      setActiveFilter(false);
      setIsFilterApplied(true);
      setCurrentPage(1);
    } else {
      // No filters applied, do not make the API call
      setActiveFilter(false);
    }
  };

  useEffect(() => {
    const filterStore = JSON.parse(localStorage.getItem("filterData"));
    setFilterInfo(filterStore || {});
    setSelectedDate({
      startDate: filterStore?.contact_date?.from,
      endDate: filterStore?.contact_date?.to
    });
    setIsFilterApplied(true);
    // Retrieve the existing notFiltered state
    const existingNotFiltered = { ...notFiltered };

    // Merge the existing filters with the ones loaded from local storage
    const mergedFilters = { ...existingNotFiltered, ...filterStore };
    setNotFiltered(mergedFilters);
    const multiselectValue = localStorage.getItem("multiselectValue");
    setMultiselectValue(JSON.parse(multiselectValue));
  }, []);

  useEffect(() => {
    localStorage.setItem("multiselectValue", JSON.stringify(multiselectValue));
  }, [multiselectValue]);

  const addFilterValue = (value, key) => {
    // Handle date inputs (calendar)
    if (key === "contacted_date") {
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
        contact_date: { from: formattedStartDate, to: formattedEndDate }
      }));
      setNotFiltered((pre) => ({
        ...pre,
        contact_date: { from: formattedStartDate, to: formattedEndDate }
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
    }
  };

  const handleResetFilter = () => {
    delete filterInfo.lead_type_list;
    delete filterInfo.channel_list;
    delete filterInfo.contact_date;
    setFilterInfo({});
    localStorage.removeItem("filterData");
    setFilterValues({});
    setMultiselectValue({});
    setActiveFilter(false);
    setState([
      {
        startDate: new Date(),
        endDate: null,
        key: "selection"
      }
    ]);

    setSelectedDate({});

    setActiveCalendar(false);
  };

  const navigate = useNavigate();

  const handleRowClick = (data, type) => {
    let id;
    if (type === "LEAD_MOBILE") {
      id = data;
    } else {
      id = data?.original.record_id;
    }

    // const tripId = row?.original?.lead_id;
    const encodedTripId = encodeURIComponent(id);
    navigate(`/marketing-lead-listing/lead/${encodedTripId}`);
  };

  const navigateId = () => {
    navigate("/marketing-lead-listing");
  };

  return (
    <div className="leadListing">
      <div className="tripDetailsBreadCrumbsMobile">
        <h4>Lead Listing</h4>
      </div>

      {/* breadCrumbs */}
      <div className="tripDetailsBreadCrumbs">
        <div className="tripDetailsBreadCrumbsContent">
          <Link to={"/tripListing"}>
            <span className="tripDetailsBreadCrumbsData">Lead Management</span>{" "}
          </Link>
          <img src={logo} alt="logo" />
          <label className="tripDetailsBreadCrumbsHeading">Lead Listing</label>
        </div>
        <div className="tripDetailsBreadCrumbsPara">
          <p>Lead Listing</p>
        </div>
      </div>

      <TripListingNavBar
        navBarData={navBarData}
        setActiveTab={setActiveTab}
        // originalData={originalData?.trip_status_count}
        activeTab={activeTab}
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
        columns={columns}
        handleRowClick={handleRowClick}
        navigateId={navigateId}
        searchResult={storeSearchResult}
        searchPlaceholder="Search by Name, Company Name"
        sortHead="contacted_date"
        isSecondTable={true}
      />

      <LeadFilter
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
        setIsFilterApplied={setIsFilterApplied}
        setNotFiltered={setNotFiltered}
      />
    </div>
  );
};

export default LeadListing;
