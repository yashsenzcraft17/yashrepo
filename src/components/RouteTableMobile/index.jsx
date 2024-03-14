import profitHigh from "assets/images/tripDashboard/profit.svg";
import LossArrow from "assets/images/statusCard/lossArrow.svg";
import responsiveLine from "assets/images/tripDashboard/responsiveLineLogo.svg";
import "components/RouteTableMobile/routeTableMobile.scss";

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)?.toLowerCase();
};

const RouteTableMobile = ({
  storeResponse,
  getRoundedValue,
  getRoundedPercentage,
  getFormattedDistance
}) => {
  const trendValue = storeResponse?.Top_routes?.trend;
  const trendClassName =
    trendValue < 0 ? "negativePercentage" : "positivePercentage";

  const trendImage = trendValue < 0 ? LossArrow : profitHigh;
  const absoluteTrendValue = Math.round(Math.abs(trendValue));

  return (
    <section className="tripDashboardMobile">
      <div className="tripDashboardTableTitle">
        <h3>Top 10 Routes & Cost saved</h3>
        <div className="tripDashboardTablePrice">
          <span className="tripDashboardTablePriceNumber">
            {`${getRoundedValue(storeResponse?.Top_routes?.total_cost_saved)}`}
          </span>

          <div className={trendClassName}>
            <img src={trendImage} alt="image" />
            {getRoundedPercentage(absoluteTrendValue)}
          </div>
        </div>
      </div>

      <div className="tripDashboardMobileData">
        {storeResponse?.Top_routes?.table.map((route, index) => (
          <div key={index} className="tripDashboardMobileDataCost">
            <div className="tripDashboardMobileResponsive">
              <div className="tripDashboardMobileContent">
                <h5>Route Code:</h5>
                <span className="tripDashboardMobileContentCode">{`${route.route_code}`}</span>
              </div>

              <div className="tripDashboardMobileContent">
                <h5>Cost Saved:</h5>
                {route.cost_saved !== "" ? (
                  route.cost_saved >= 0 ? (
                    <span className="tripDashboardTableSpecial">
                      {getRoundedValue(route.cost_saved)}
                    </span>
                  ) : (
                    <span className="tripDashboardTableError">
                      {getRoundedValue(route.cost_saved)}
                    </span>
                  )
                ) : (
                  <span>-</span>
                )}
              </div>
            </div>

            <div className="tripDashboardMobileDistance">
              <img src={responsiveLine} alt="responsiveDot" />
              <span className="tripDashboardMobileKilometer">
                {getFormattedDistance(route.distance)}
              </span>
            </div>

            <div className="tripDashboardMobileText">
              <span className="tripDashboardMobileCountry">{`${capitalizeFirstLetter(
                route.origin
              )}`}</span>
              <span className="tripDashboardMobileCountry">{`${capitalizeFirstLetter(
                route.destination
              )}`}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RouteTableMobile;
