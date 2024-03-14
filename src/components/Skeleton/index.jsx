import React from "react";

import "components/Skeleton/skeleton.scss";

const Skeleton = ({
  height,
  width,
  margin,
  skeletonTwo,
  widthTwo,
  heightTwo,
  marginTwo,
  violetClr
}) => {
  return (
    <div style={{ padding: "2px 0", display: "flex", alignItems: "center" }}>
      {skeletonTwo && (
        <div
          style={{
            widthTwo: widthTwo || "100%",
            heightTwo: heightTwo + "px",
            marginTwo: marginTwo || "0"
          }}
          className="skeleton skeletonSidebar"
        ></div>
      )}
      <div
        style={{
          width: width || "100%",
          height: height + "px",
          margin: margin || "0"
        }}
        className={`skeleton ${violetClr}`}
      ></div>
    </div>
  );
};

export default Skeleton;
