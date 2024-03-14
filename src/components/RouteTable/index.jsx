import Skeleton from "components/Skeleton";

import profitHigh from "assets/images/tripDashboard/profit.svg";
import LossArrow from "assets/images/statusCard/lossArrow.svg";
import noDataImg from "assets/images/tripDashboard/noData.png";

import "components/RouteTable/routeTable.scss";

const RouteTable = ({
  loading,
  storeResponse,
  getRoundedValue,
  formatHeader,
  capitalizeAfterSpace,
  getRoundedPercentage,
  getFormattedDistance,
  capitalizeEachWord
}) => {
  const staticTableHeaders = [
    "sl_no",
    "route_code",
    "origin",
    "destination",
    "distance",
    "cost_saved"
  ];

  const trendValue = storeResponse?.Top_routes?.trend;
  const trendClassName =
    trendValue < 0 ? "negativePercentage" : "positivePercentage";

  const trendImage = trendValue < 0 ? LossArrow : profitHigh;
  const absoluteTrendValue = Math.round(Math.abs(trendValue));

  return (
    <section className="tripDashboardTable tripDashboardTableHeight">
      {!loading &&
        storeResponse?.Top_routes?.table &&
        storeResponse?.Top_routes?.table?.length > 0 && (
          <div className="tripDashboardTableTitle">
            {loading ? (
              <Skeleton height={"18"} width={"180px"} />
            ) : (
              <h3>Top 10 Routes & Cost saved</h3>
            )}

            <div className="tripDashboardTablePrice">
              {loading ? (
                <Skeleton height={"31"} width={"81px"} />
              ) : (
                <span className="tripDashboardTablePriceNumber">
                  {`${getRoundedValue(
                    storeResponse?.Top_routes?.total_cost_saved
                  )}`}
                </span>
              )}

              {loading ? (
                <Skeleton width={"49px"} height={"18"} />
              ) : (
                <div className={trendClassName}>
                  <img src={trendImage} alt="image" />
                  {getRoundedPercentage(absoluteTrendValue)}
                </div>
              )}
            </div>
          </div>
        )}

      <table className="tripDashboardTableList">
        <thead>
          {loading ? (
            <tr>
              <td colSpan={staticTableHeaders.length + 1}>
                <Skeleton height={"37"} width={"480px"} />
              </td>
            </tr>
          ) : (
            <tr>
              {staticTableHeaders.map((header, index) => (
                <th className="tripDashboardTableRowData" key={index}>
                  {formatHeader(header)}
                </th>
              ))}
            </tr>
          )}
        </thead>

        <tbody>
          {storeResponse?.Top_routes?.table &&
          storeResponse.Top_routes.table.length > 0 ? (
            storeResponse.Top_routes.table.map((rowData, index) => (
              <tr className="tripDashboardTableRow" key={index}>
                {staticTableHeaders.map((header, columnIndex) => (
                  <td
                    className={`${
                      header === "cost_saved"
                        ? rowData.cost_saved >= 0
                          ? "tripDashboardTableSpecial"
                          : "tripDashboardTableError"
                        : ""
                    }`}
                    key={columnIndex}
                  >
                    {header === "cost_saved" ? (
                      <span
                        className={`tripDashboardTable${
                          rowData.cost_saved >= 0 ? "Special" : "Error"
                        }`}
                      >
                        {`${getRoundedValue(rowData.cost_saved)}`}
                      </span>
                    ) : header === "distance" ? (
                      <span>{getFormattedDistance(rowData[header])}</span>
                    ) : header === "origin" || header === "destination" ? (
                      <span>{capitalizeEachWord(rowData[header])}</span>
                    ) : (
                      <span>{capitalizeAfterSpace(rowData[header])}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={staticTableHeaders.length + 6}>
                {loading ? (
                  <Skeleton height={"37"} width={"480px"} />
                ) : (
                  <div className="tripDashboardTableNoData">
                    <img src={noDataImg} alt="noData" />
                    <span>Data Not Found</span>
                  </div>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default RouteTable;
