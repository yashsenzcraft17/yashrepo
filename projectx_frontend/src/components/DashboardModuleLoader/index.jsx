import React, { useRef } from "react";

import ChartContainer from "components/ChartContainer";
import StatusCard from "components/StatusCard";
import Skeleton from "components/Skeleton";

import Arrow from "assets/images/header/downArrow.svg";

import "components/dashboardModule/dashboardModule.scss";

const DashboardModuleLoader = ({
  moduleTitle,
  onClick,
  chartBtn,
  cardData,
  loading,
  chartData,
  index,
  isOpen,
  checkCount
}) => {
  const moduleRef = useRef();

  return (
    <div className="module">
      <div className="moduleTitle" onClick={() => onClick(index)}>
        {loading && <Skeleton height={"24"} width={"130px"} />}
        {!loading && <label></label>}
        {checkCount && !loading && (
          <span
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
            }}
          >
            <img src={Arrow} alt="Arrow" />
          </span>
        )}
      </div>

      <div className="moduleData" ref={moduleRef}>
        <div className="moduleDataCards">
          {cardData?.map((item, i) => (
            <StatusCard
              key={i}
              value={item}
              colored={false}
              loading={loading}
            />
          ))}
        </div>

        <ChartContainer
          chartBtn={chartBtn}
          chartData={chartData}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DashboardModuleLoader;
