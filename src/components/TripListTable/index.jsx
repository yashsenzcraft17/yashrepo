import React from "react";
import Select from "react-select";
// import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

import Table from "components/Table";
import TripListTableMobile from "components/TripListTableMobile";
import LeadlistTableMobile from "components/LeadListTableMobile";

import { getWindowWidth } from "utils/window";

import searchImg from "assets/images/TripListing/search.svg";
import filterImg from "assets/images/TripListing/filter.svg";
import NoDataImg from "assets/images/TripListing/noDataImg.png";

// TODO
// import PlusIcon from "assets/images/LeadListing/plusIcon.svg";

import "components/TripListTable/tripListTable.scss";
import Skeleton from "components/Skeleton";

const TripListTable = ({
  originalData,
  setActiveFilter,
  filteredData,
  handleResetFilter,
  setCurrentPage,
  currentPage,
  itemsPerPage,
  setItemsPerPage,
  loading,
  setSearchData,
  filterInfo,
  serverError,
  searchResult,
  searchData,
  columns,
  navigateId,
  handleRowClick,
  searchPlaceholder,
  sortHead,
  isSecondTable
}) => {
  // let debounceTimer;

  // const navigate = useNavigate();

  const itemsPerPageOptions = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 30, label: "30" }
  ];

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
    navigateId;
  };

  // TODO
  // const handleNewLead = () => {
  //   navigate("/marketing-lead-listing/lead");
  // };

  const handleItemsPerPageChange = (selectedOption) => {
    setItemsPerPage(selectedOption.value);
    setCurrentPage(currentPage);
  };

  const filterActive = () => {
    setActiveFilter(true);
  };

  const searchList = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    } else {
      setCurrentPage(1);
      setSearchData(e?.target?.value);
    }
  };

  const isMobileView = getWindowWidth() <= 992;

  // const pageCount = searchData ? searchResult : originalData?.total_page_count;
  const pageCount = searchData
    ? Math.ceil(searchResult / itemsPerPage)
    : originalData?.total_page_count;

  const customSelectStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#C3ECF4" : "#fff",
      color: state.isSelected ? "#3A4243" : "#3A4243",
      "&:hover": {
        backgroundColor: "#C3ECF4"
      }
    })
  };

  return (
    <section className="tripList">
      {/* create a search bar */}
      <div className="tripListSearchBar">
        <div className="tripListBox">
          <form className="tripListBoxForm">
            <img src={searchImg} alt="searchImg" />
            <input
              className="tripListBoxInputField"
              type="text"
              placeholder={searchPlaceholder}
              onChange={searchList}
              onKeyDown={searchList}
              value={searchData}
            />
          </form>
        </div>

        <div className="tripListClearFilter">
          {Object?.keys(filterInfo)?.length > 0 && (
            <p className="tripListClearFilterText" onClick={handleResetFilter}>
              Reset Filter
            </p>
          )}
          <div className="tripListFilter" onClick={filterActive}>
            <img src={filterImg} alt="filterLogo" />
            <h5 className="tripListFilterBox">Filter</h5>
            <span className="tripListFilterSpan">
              {Object?.keys(filterInfo)?.length}
            </span>
          </div>

          {/* TODO */}
          {/* {window.location.pathname === "/marketing-lead-listing" && (
            <button className="addNewLead" onClick={handleNewLead}>
              <img src={PlusIcon} alt="PlusIcon" /> Add New Lead
            </button>
          )} */}
        </div>
      </div>

      {!loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "10px"
          }}
        >
          {[...Array(10)].map((_, index) => (
            <Skeleton key={index} width={"100%"} height={"48"} />
          ))}
        </div>
      )}

      {serverError && filteredData?.length > 0 && loading && (
        <div className="tripListEmpty">
          <img src={NoDataImg} alt="NoDataImg" />
          <div className="tripListEmptyMsg">
            <h3>Oops! Something went wrong</h3>
          </div>
        </div>
      )}

      {filteredData?.length === 0 && loading ? (
        <div className="tripListEmpty">
          <img src={NoDataImg} alt="NoDataImg" />
          <div className="tripListEmptyMsg">
            <h3>Oops, looks like there&apos;s no data!</h3>
          </div>
        </div>
      ) : (
        <>
          {getWindowWidth() <= 992 ? (
            <>
              {window.location.pathname === "/tripListing" && (
                <div className="tripListMobileTable">
                  {filteredData?.map((item, index) => (
                    <TripListTableMobile
                      key={index}
                      data={item}
                      handleClick={handleRowClick}
                    />
                  ))}
                </div>
              )}

              {window.location.pathname === "/marketing-lead-listing" && (
                <div className="tripListMobileTable">
                  {filteredData?.map((item, index) => (
                    <LeadlistTableMobile
                      key={index}
                      data={item}
                      handleClick={handleRowClick}
                    />
                  ))}

                  {/* TODO */}
                  {/* <div className="tripListMobileTableOverlay">
                    <button onClick={handleNewLead}>
                      <img src={PlusIcon} alt="PlusIcon" /> Add New Lead
                    </button>
                  </div> */}
                </div>
              )}
            </>
          ) : (
            !serverError &&
            loading && (
              <Table
                columns={columns}
                data={filteredData || []}
                onRowClick={handleRowClick}
                sort="Start Date"
                sortHead={sortHead}
                isSecondTable={isSecondTable}
              />
            )
          )}

          <div className="tripListEntriesInfo">
            {searchData ? (
              <>
                {searchResult > 10 && (
                  <div className="tripListEntriesInfoPara">
                    Showing{" "}
                    <Select
                      options={itemsPerPageOptions}
                      value={{ value: itemsPerPage, label: `${itemsPerPage}` }}
                      onChange={handleItemsPerPageChange}
                      menuPlacement="top"
                      styles={customSelectStyles}
                    />
                    of {searchResult} entries
                  </div>
                )}
              </>
            ) : (
              <>
                {originalData?.total_record_count > 10 && (
                  <div className="tripListEntriesInfoPara">
                    Showing{" "}
                    <Select
                      options={itemsPerPageOptions}
                      value={{ value: itemsPerPage, label: `${itemsPerPage}` }}
                      onChange={handleItemsPerPageChange}
                      menuPlacement="top"
                      styles={customSelectStyles}
                    />
                    of{" "}
                    {searchData
                      ? searchResult
                      : originalData?.total_record_count}{" "}
                    entries
                  </div>
                )}{" "}
              </>
            )}

            <div className="tripListPagiNation">
              {pageCount > 1 && (
                <ReactPaginate
                  prevRel={null}
                  initialPage={0}
                  disableInitialCallback={false}
                  breakLabel="..."
                  nextLabel={<span>&gt;</span>}
                  pageRangeDisplayed={isMobileView ? 2 : 3}
                  pageCount={pageCount}
                  onPageChange={handlePageChange}
                  activeClassName="activePagination"
                  forcePage={currentPage - 1}
                  renderOnZeroPageCount={null}
                  pageClassName="hideNumber"
                  disabledLinkClassName="hidePage"
                  // currentPage === 0 || currentPage === pageCount - 1
                  // ? "hidePage"
                  // : "showNumber"

                  previousLabel={<span>&lt;</span>}
                />
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default TripListTable;
