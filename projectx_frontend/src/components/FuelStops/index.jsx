import React, { useEffect, useRef, useState } from "react";
import useScreenMobile from "hooks/useScreenMobile";
import FuelStationCard from "components/FuelStationCard";
import CardLogo from "assets/images/statusCard/statusCardImg2.svg";
// import NoDataImg from "assets/images/TripListing/noDataImg.png";
import ExpandArrow from "assets/images/Savings/expandArrowPhn.svg";
import "components/FuelStops/fuelStops.scss";
import Skeleton from "components/Skeleton";
const FuelStops = ({ fuelStopsData, currencySymbol, loading }) => {
  const isDataAvailable = fuelStopsData && fuelStopsData.length > 0;
  // Check if fuelStopsData is truthy, otherwise use an empty array
  const fuelStation = (fuelStopsData || []).map((station) => ({
    id: station.name,
    fuelPumpName: station.name || "-",
    place: station.place || "-",
    cost: station.total_cost || 0,
    date: station.fuel_tariff_date || 0,
    stationCode: station.station_code || "-",
    distanceFromOrigin: station.distance_from_origin || 0,
    volumeToRefill: station.volume_refill || 0,
    fuelRate: station.fuel_rate || 0,
    fuelStationDetails: [
      {
        label: "Station Code",
        value: station.station_code || "-"
      },
      {
        label: "Distance from Origin",
        value: station.distance_from_origin || "-"
      },
      {
        label: "Volume to Refill",
        value: station.volume_refill || "-"
      },
      {
        label: "Fuel Rate",
        value: station.fuel_rate || "-"
      }
    ]
  }));
  // getTheRoundedValue
  const getRoundedValue = (numericValue) => {
    if (
      isNaN(numericValue) ||
      numericValue === null ||
      numericValue === undefined ||
      numericValue === ""
    ) {
      return "-";
    }
    if (numericValue === 0) {
      return "0";
    }
    const defaultCurrencyCode = "INR";
    const absoluteValue = Math.abs(numericValue);
    const roundedValue = Math.round(absoluteValue);
    const formatter = Intl.NumberFormat("en", {
      style: "currency",
      currency: currencySymbol || defaultCurrencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
      notation: "compact"
    });
    const million = formatter.format(roundedValue);
    return million;
  };
  const isMobile = useScreenMobile({ size: 768 });
  const [fuelCardActive, setFuelCardActive] = useState(false);
  const [cardActive, setCardActive] = useState(false);
  // const [viewAll, setViewAll] = useState(false);
  const fuelStops = useRef();
  const cardsWrapRef = useRef();
  const [fuelCardHeight, setFuelCardHeight] = useState("90px");
  const handleClick = () => {
    // if (fuelCardActive) {
    //   fuelStops.current.style.height = "90px";
    //   setTimeout(() => {
    //     setFuelCardActive((prev) => !prev);
    //   }, 500);
    //   return;
    // }
    setFuelCardActive((prev) => !prev);
  };
  // const viewFull = () => {
  //   setViewAll((prev) => !prev);
  // };
  useEffect(() => {
    if (fuelCardActive) {
      setTimeout(() => {
        setFuelCardHeight(cardsWrapRef?.current?.scrollHeight + 110 + "px");
      }, 200);
    } else {
      setFuelCardHeight("90px");
    }
  }, [cardActive, fuelCardActive]);

  return (
    <div
      className="fuelStops"
      style={{
        height: fuelCardHeight
      }}
      ref={fuelStops}
    >
      <div className="fuelStopsTitle">
        <div className="fuelStopsTitleMain">
          <img src={CardLogo} alt="CardLogo" />
          <h2>Recommended Fuelling Stops ({fuelStopsData?.length})</h2>
        </div>
        {isDataAvailable && (
          <>
            {loading ? (
              <Skeleton width={"100px"} height={"20"} />
            ) : (
              <span onClick={handleClick}>
                <p style={{ opacity: fuelCardActive ? "1" : "0" }}>Show less</p>
                <p style={{ opacity: fuelCardActive ? "0" : "1" }}>Show more</p>
              </span>
            )}
          </>
        )}
        {isMobile && fuelStopsData?.length > 0 && (
          <div className="expandIcon" onClick={handleClick}>
            <img
              style={{
                transform: fuelCardActive ? "rotate(180deg)" : "rotate(0deg)"
              }}
              src={ExpandArrow}
              alt="ExpandArrow"
            />
          </div>
        )}
      </div>
      <div className="fuelStopsCards" ref={cardsWrapRef}>
        <div className="fuelStopsCardsParent">
          {!isMobile ? (
            <>
              {fuelStation?.map((item) => (
                <FuelStationCard
                  key={item?.id}
                  data={item}
                  getRoundedValue={getRoundedValue}
                  loading={loading}
                  setCardActive={setCardActive}
                />
              ))}
            </>
          ) : (
            <>
              {fuelStation?.map((item) => (
                <FuelStationCard
                  key={item?.id}
                  data={item}
                  getRoundedValue={getRoundedValue}
                  loading={loading}
                  setCardActive={setCardActive}
                />
              ))}
            </>
          )}
        </div>
        {/* {isMobile && fuelStopsData?.length > 0 && (
          <>
            {loading ? (
              <Skeleton width={"100px"} height={"20"} />
            ) : (
              <>
                <span className="fuelStopsViewAll" onClick={viewFull}>
                  {viewAll ? "View less" : "View all"}
                </span>
              </>
            )}
          </>
        )} */}
      </div>
    </div>
  );
};
export default FuelStops;
