import React from "react";
import { useTable, useSortBy } from "react-table";

import rightArrowDown from "assets/images/TripListing/arrowDownBold.svg";
import SortArrow from "assets/images/TripListing/sortIcon.svg";
import SortTop from "assets/images/TripListing/descSorting.svg";
// import SortBottom from "assets/images/TripListing/sortBottom.svg";

const Table = ({
  columns,
  data,
  onRowClick,
  sort,
  sortHead,
  isSecondTable
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        disableSortRemove: true,
        defaultCanSort: true,
        initialState: {
          sortBy: sort ? [{ id: sortHead, desc: isSecondTable }] : []
        }
      },
      useSortBy
    );

  return (
    <table {...getTableProps()} className="tripListTable">
      <thead className="tripListTableHead">
        {headerGroups?.map((headerGroup, index) => (
          <tr
            key={index}
            {...headerGroup.getHeaderGroupProps()}
            className="tripListTableRow"
          >
            {headerGroup?.headers.map((column, index) => (
              <th
                className="tripListTableHeader"
                key={index}
                {...column.getHeaderProps(
                  column.Header === sort ? column.getSortByToggleProps() : {}
                )}
              >
                <div className="startDate">
                  {column.render("Header")}
                  {column.Header === sort && (
                    <img
                      src={column.isSortedDesc ? SortArrow : SortTop}
                      alt="SortArrow"
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody {...getTableBodyProps()} className="tripListTableBody">
        {rows?.map((row, index) => {
          prepareRow(row);
          return (
            <tr
              key={index}
              {...row.getRowProps()}
              className="tripListTableBodyRow"
              onClick={() => onRowClick(row, "TRIP_LIST_DESKTOP")}
            >
              {row.cells?.map((cell, index) => (
                <td
                  key={index}
                  {...cell.getCellProps()}
                  className="tripListTableBodyRowData"
                >
                  {cell.render("Cell")}
                  <div className="logo">
                    <img src={rightArrowDown} alt="rightArrow" />
                  </div>
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
