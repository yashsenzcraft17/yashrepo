import { useEffect } from "react";

import "components/TripListingNavBar/tripListingNavBar.scss";

import searchImg from "assets/images/TripListing/search.svg";
import filterImg from "assets/images/TripListing/filter.svg";
import badgeIcon from "assets/images/TripListing/badge.svg";

const TripListingNavBar = ({
  navBarData,
  setActiveTab,
  activeTab,
  setActiveFilter,
  setSearchData,
  setTripStatus,
  searchData,
  setFilterInfo,
  filterInfo,
  setFilterValues,
  setMultiselectValue,
  setCurrentPage
}) => {
  // let debounceTimer;

  const handleTabClick = (status) => {
    localStorage.setItem("status", JSON.stringify(status));
    localStorage.removeItem("filterData");
    localStorage.removeItem("multiselectValue");
    setActiveTab(status?.data);
    setTripStatus([status?.statusId]);
    setCurrentPage(1);
    setSearchData("");
    delete filterInfo?.origin_city_list;
    delete filterInfo?.destination_city_list;
    delete filterInfo?.route_list;
    delete filterInfo?.trip_start_date;
    delete filterInfo?.distance;
    delete filterInfo?.load_type;
    delete filterInfo?.cost_range;
    setFilterInfo({});
    setFilterValues({});
    setMultiselectValue({});
  };

  useEffect(() => {
    const statusStore = JSON.parse(localStorage.getItem("status"));
    setActiveTab(statusStore?.data || "All");
    setTripStatus([statusStore?.statusId || "0"]);
  }, []);

  const filterActive = () => {
    setActiveFilter(true);
  };

  const searchList = (e) => {
    // clearTimeout(debounceTimer);
    // debounceTimer = setTimeout(() => {
    //   setSearchData(e?.target?.value);
    // }, 500);
    setCurrentPage(1);
    setSearchData(e?.target?.value);
  };

  return (
    <section className="tripListNavBar">
      <div className="tripListNavBarList">
        <div className="tripListNavBarTitle">
          {navBarData.map((value, index) => (
            <div
              key={index}
              className={`tripListNavBarContent ${
                activeTab === value?.data ? "activeTab" : ""
              }`}
              onClick={() => handleTabClick(value)}
            >
              <span className="tripListNavBarData">{value?.label}</span>
              <label className="tripListNavBarCount">{value?.count || 0}</label>
            </div>
          ))}
        </div>

        <div className="tripListNavBarSearch">
          <div className="tripListBox tripListNavBarListBox">
            <form className="tripListBoxForm">
              <img src={searchImg} alt="searchImg" />
              <input
                className="tripListBoxInputField"
                type="text"
                placeholder="Search"
                onChange={searchList}
                value={searchData}
              />
            </form>
          </div>

          <div
            className="tripListFilter "
            onClick={filterActive}
            style={{ border: Object?.keys(filterInfo)?.length === 0 && "none" }}
          >
            <img src={filterImg} alt="filterLogo" />
            {Object?.keys(filterInfo)?.length > 0 && (
              <img
                className="tripListFilterBadge"
                src={badgeIcon}
                alt="badgeIcon"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripListingNavBar;
