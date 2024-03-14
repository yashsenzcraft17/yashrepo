import ProfitArrow from "assets/images/statusCard/profitArrow.svg";
import LossArrow from "assets/images/statusCard/lossArrow.svg";

import Skeleton from "components/Skeleton";

import "components/StatusCard/statusCard.scss";

const StatusCard = ({ value, data, loading }) => {
  const trendValue = parseFloat(value?.trend);
  const trendClassName = trendValue < 0 ? "negativeTrend" : "positiveTrend";

  const trendImage = trendValue < 0 ? LossArrow : ProfitArrow;
  const absoluteTrendValue = Math.round(Math.abs(trendValue));

  const finalValue = value?.value !== null ? value?.value : "-";
  const numericValue = finalValue !== "-" ? finalValue : "-";

  return (
    <div className="statusCard" style={{ background: value?.background }}>
      <div className="statusCardImg">
        {loading ? (
          <Skeleton height={"30"} />
        ) : (
          <img src={value?.cardLogo} alt="CardLogo" />
        )}
      </div>
      <div className="statusCardDetails">
        {loading ? (
          <Skeleton violetClr={value?.bgClass} height={"18"} width={"150px"} />
        ) : (
          <p style={{ color: value?.titleColor }}>{value?.title}</p>
        )}
        <label style={{ color: value?.valueColor }}>
          {loading ? (
            <Skeleton
              violetClr={value?.bgClass}
              height={"38"}
              width={"132px"}
            />
          ) : (
            numericValue
          )}
          {loading ? (
            <Skeleton violetClr={value?.bgClass} height={"26"} width={"50px"} />
          ) : (
            numericValue !== "-" &&
            (absoluteTrendValue >= 0 ? (
              <span className={trendClassName}>
                <img src={trendImage} alt="LossArrow" />{" "}
                {`${absoluteTrendValue}%`}
              </span>
            ) : (
              <span className={"emptyTrend"}>-/-</span>
            ))
          )}
        </label>
      </div>
    </div>
  );
};

export default StatusCard;
