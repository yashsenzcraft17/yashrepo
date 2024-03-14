import React, { useState } from "react";

import Sidebar from "components/Sidebar";

import "routes/authRoutes.scss";
import Header from "components/Header";
import { useLocation } from "react-router-dom";

const AuthRoutes = (props) => {
  const { children, header, sidebar } = props;
  const [collapse, setCollapse] = useState(false);

  const location = useLocation();

  // Check if the pathname includes '/tripListing'
  const isInTripListing = location.pathname.includes("/tripListing");

  return (
    <div className={`parentAuthRoutes ${!collapse && "changeDashboardSize"}`}>
      {header && (
        <div className="parentAuthRoutesHeader">
          <Header setCollapse={setCollapse} collapse={collapse} />
        </div>
      )}
      <div
        className="authRoutes"
        style={{
          height: isInTripListing ? "100%" : "auto"
        }}
      >
        {sidebar && (
          <div
            className={`authRoutes-sidebar ${
              collapse ? "sidebarExpanded" : "sidebarCollapsed"
            } ${collapse ? "sidebarExpandedPhn" : "sidebarCollapsedPhn"}`}
          >
            <Sidebar collapse={collapse} setCollapse={setCollapse} />
          </div>
        )}
        <div className="authRoutesChildren">{children}</div>
      </div>
    </div>
  );
};

export default AuthRoutes;
