import React, { useRef, useState } from "react";
// import useScreenMobile from "hooks/useScreenMobile";
import { format } from "date-fns";
import MinimizeCardArrow from "assets/images/FuelStationCard/minimizeArrow.svg";
import "components/FuelStationCard/fuelStationCard.scss";
const FuelStationCard = ({
  data,
  setHeight,
  getRoundedValue,
  loading,
  setCardActive
}) => {
  // const isMobile = useScreenMobile({ size: 768 });
  const [activeCard, setActiveCard] = useState(null);
  const stationCard = useRef();
  const formattedDate = format(new Date(data?.date), "dd MMM yyyy");
  const openCard = (id) => {
    setActiveCard((prevId) => (prevId === id ? null : id));
    setCardActive((prev) => !prev);
    // setHeight(stationCard.current.scrollHeight);
  };
  // const getCardHeight = () => {
  //   if (isMobile) {
  //     return "133px";
  //   } else {
  //     return "89px";
  //   }
  // };
  // useEffect(() => {
  //   setHeight((prev) => {
  //     return activeCard === data?.id
  //       ? prev + stationCard.current.scrollHeight
  //       : prev - stationCard.current.scrollHeight <= 60
  //         ? 60
  //         : prev - stationCard.current.scrollHeight - 60;
  //   });
  // }, [activeCard]);
  return (
    <div
      className="stationCard"
      // style={{ transition: "height 0.3s ease-in-out"
      // style={{
      //   height:
      //     activeCard === data?.id
      //       ? stationCard.current.scrollHeight + "px"
      //       : getCardHeight()
      // }}
      // ref={stationCard}
    >
      <div className="stationCardMain">
        <div
          className="stationCardTitle"
          style={{
            borderBottom: activeCard !== data?.id && "none",
            paddingBottom: activeCard === data?.id ? "16px" : ""
          }}
        >
          <div className="stationCardTitleParent">
            <div className="stationName">
              <h3>{data?.fuelPumpName}</h3>
              <p>{data?.place}</p>
            </div>
            <div className="cardArrowPhn" onClick={() => openCard(data?.id)}>
              <img
                className={`rotateArrow ${
                  activeCard === data?.id ? "rotateArrowActive" : ""
                }`}
                src={MinimizeCardArrow}
                alt="MinimizeCardArrow"
              />
            </div>
          </div>
          <div className="fuel">
            <div className="fuelTotalCost">
              <p>Total Cost</p>
              <span>
                {getRoundedValue(data?.cost, 1, data?.currencySymbol)}
              </span>
            </div>
            <div className="fuelTariffDate">
              <p>Fuel Tariff Date</p>
              <span>{formattedDate}</span>
            </div>
            <div className="minimizeArrow" onClick={() => openCard(data?.id)}>
              <img
                className={`rotateArrow ${
                  activeCard === data?.id ? "rotateArrowActive" : ""
                }`}
                src={MinimizeCardArrow}
                alt="MinimizeCardArrow"
              />
            </div>
          </div>
        </div>
        <div
          className="stationDetails"
          ref={stationCard}
          style={{
            height:
              activeCard === data?.id
                ? stationCard.current.scrollHeight + "px"
                : 0,
            margin: activeCard === data?.id ? "16px 0 0 0" : "0",
            // margin: activeCard === data?.id ? "0 0 0 0" : "0",
            overflow: activeCard === data?.id ? "visible" : "hidden"
          }}
        >
          {data.fuelStationDetails.map((item, i) => (
            <div key={i} className="stationDetailsPoints">
              <p>{item?.label}</p>
              <span>
                {item.label === "Distance from Origin"
                  ? `${item.value} km`
                  : item.label === "Volume to Refill"
                    ? `${item.value} L`
                    : item.label === "Fuel Rate"
                      ? getRoundedValue(item.value, 1, data?.currencySymbol)
                      : item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FuelStationCard;
