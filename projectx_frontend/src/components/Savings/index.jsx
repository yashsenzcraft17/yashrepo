import React, { useRef, useState } from "react";
import Skeleton from "components/Skeleton";

import CardLogo from "assets/images/Savings/savingsCardLogo.svg";
import ProfitArrow from "assets/images/Savings/profitArrow.svg";
import ExtendArrow from "assets/images/Savings/expandArrowPhn.svg";

import "components/Savings/savings.scss";

const Savings = ({
  savingsData,
  getRoundedValue,
  getFormattedCapacity,
  getRoundedPercentage,
  loading
}) => {
  const [cardActive, setCardActive] = useState(false);

  const savingsList = [
    {
      label: "Rec. Total Fuel",
      value:
        getFormattedCapacity(savingsData?.savings?.reco_total_fuel_vol) || "-"
    },
    {
      label: "Baseline Total Fuel",
      value:
        getFormattedCapacity(savingsData?.savings?.baseline_total_fuel_vol) ||
        "-"
    },
    {
      label: "Rec. Total Price",
      value: getRoundedValue(savingsData?.savings?.reco_total_cost) || "-"
    },
    {
      label: "Baseline Price",
      value: getRoundedValue(savingsData?.savings?.baseline_total_cost) || "-"
    }
  ];

  const savings = useRef();

  const handleClick = () => {
    setCardActive((prev) => !prev);
  };

  return (
    <div
      className="savings"
      style={{
        height: cardActive ? savings.current.scrollHeight + "px" : "90px"
      }}
      ref={savings}
    >
      <div className="savingsTitle">
        <div className="savingsTitleMain">
          <img src={CardLogo} alt="CardLogo" />
          <h2>Savings Section</h2>
        </div>

        {loading ? (
          <Skeleton width={"100px"} height={"20"} />
        ) : (
          <span onClick={handleClick}>
            {/* <p>Show{cardActive ? " less" : " more"}</p> */}
            <p style={{ opacity: cardActive ? "1" : "0" }}>Show less</p>
            <p style={{ opacity: cardActive ? "0" : "1" }}>Show more</p>
          </span>
        )}

        <div className="extendArrowPhn" onClick={handleClick}>
          <img
            style={{
              transform: cardActive ? "rotate(180deg)" : "rotate(0deg)"
            }}
            src={ExtendArrow}
            alt="ExtendArrow"
          />
        </div>
      </div>
      <div className="savingsDetails">
        <div className="savingsDetailsFuelPrice">
          <p>Saved Fuel Price</p>
          {/* <div className="amount">
            {loading ? (
              <Skeleton width={"100px"} height={"20"} />
            ) : isNaN(getRoundedPercentage(savingsData?.savings?.trend)) ||
              isNaN(getRoundedValue(savingsData?.savings?.saved_fuel_cost)) ? (
              <>
                <h3>-</h3>
              </>
            ) : (
              <>
                <h3>
                  {getRoundedValue(
                    savingsData?.savings?.saved_fuel_cost || "-"
                  )}
                </h3>
                <span>
                  <img src={ProfitArrow} alt="ProfitArrow" />
                  {getRoundedPercentage(savingsData?.trend || "-")}
                </span>
              </>
            )}
          </div> */}
          <div className="amount">
            {loading ? (
              <Skeleton width={"100px"} height={"20"} />
            ) : (
              <>
                <h3>
                  {getRoundedValue(
                    savingsData?.savings?.saved_fuel_cost || "-"
                  )}
                </h3>
                {savingsData?.savings?.trend !== "" ? (
                  <span>
                    <img src={ProfitArrow} alt="ProfitArrow" />
                    {getRoundedPercentage(savingsData?.savings?.trend) || "-"}
                  </span>
                ) : (
                  ""
                )}
              </>
            )}
          </div>
        </div>

        <div className="savingsDetailsList">
          {savingsList.map((item, i) => (
            <div key={i} className="savingsDetailsListDetails">
              <p>{item?.label}</p>
              {loading ? (
                <Skeleton width={"100px"} height={"20"} />
              ) : (
                <span>{item?.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Savings;
