import React, { useState } from "react";
import { Link } from "react-router-dom";

import Button from "components/Button";

import "components/PageNotFound/pageNotFound.scss";

import pageNotFoundImg from "assets/images/PageNotFound/404Error.png";

const PageNotFound = () => {
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    setLoading(true);
    localStorage.setItem("activeMenu", "Dashboard");
    localStorage.removeItem("activeSubMenu");
    localStorage.removeItem("activeChildParent");

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="errorPage">
      <img src={pageNotFoundImg} alt="pageNotFound" />
      <h4>Page Not Found</h4>
      <p>The resource requested could not be found at this time</p>

      <Link to="/dashboard">
        <Button
          className="formButton errorPageBtn"
          onClick={handleButtonClick}
          disabled={loading}
        >
          {loading ? <div className="formSpinner"></div> : "Go To Dashboard"}
        </Button>
      </Link>
    </section>
  );
};

export default PageNotFound;
