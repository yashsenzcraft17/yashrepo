import React from "react";
import Skeleton from "components/Skeleton/index";
import { getWindowWidth } from "utils/window";

import "./chartCard.scss";

const ChartCard = ({ heading, children, loading, height = 282 }) => {
  return (
    <div className="chartCard" style={{ height: height }}>
      <div className="chartCardHeading">
        {loading ? (
          <Skeleton height={"19"} width={"90px"} />
        ) : (
          <h3>{heading}</h3>
        )}
      </div>
      {loading ? (
        <Skeleton height={"236"} width={"100%"} />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            maxWidth: getWindowWidth() <= 768 ? "none" : 600,
            position: "relative"
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default ChartCard;
