import React from "react";

import NoDataImg from "assets/images/NoData/noDataImg.png";

import "containers/NoData/noData.scss";
import { Link } from "../../../node_modules/react-router-dom/dist/index";

const NoData = () => {
  return (
    <section className="noData">
      <div className="noDataSection">
        <img src={NoDataImg} alt="NoDataImg" />
        <h3>Uh-oh! Something went wrong.</h3>
        <button>
          <Link to={"/dashboard"}>Go Back</Link>
        </button>
      </div>
    </section>
  );
};

export default NoData;
