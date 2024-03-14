import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useScreenMobile from "hooks/useScreenMobile";
import { EncryptStorage } from "encrypt-storage";

// api
import { sidebarData } from "services/sidebar";

import { getWindowWidth } from "utils/window";

// import { sidebarMenu } from "constants/sidebarMenu";

import SubmenuActive from "assets/images/sidebar/submenuActive.svg";

import Arrow from "components/icons/sidebar/arrow";
import Collapse from "components/icons/sidebar/collapse";
import TransportIcon from "components/icons/sidebar/transportIcon";
import DashboardIcon from "components/icons/sidebar/dashboardIcon";
import Finance from "components/icons/sidebar/finance";
import Marketing from "components/icons/sidebar/marketing";

import DashboardIconActive from "components/icons/sidebar/dashboardIconActive";
import TransportIconActive from "components/icons/sidebar/transportIconActive";
import FinanceIconActive from "components/icons/sidebar/financeIconActive";
import MarketingIconActive from "components/icons/sidebar/marketingIconActive";

import Skeleton from "components/Skeleton";
import SubMenuActive from "components/icons/sidebar/subMenuActive";

import "components/Sidebar/sidebar.scss";

const Sidebar = ({ collapse, setCollapse }) => {
  const [menuExpand, setMenuExpand] = useState(null);

  const encryptStorage = new EncryptStorage("senzcraft123#", {
    prefix: ""
  });

  const [activeMenu, setActiveMenu] = useState(
    encryptStorage.getItem("activeMenu") || "Dashboard"
  );
  const [activeSubMenu, setActiveSubMenu] = useState(
    encryptStorage.getItem("activeSubMenu")
  );
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subChildMenu, setSubChildMenu] = useState(false);
  const [lastChild, setLastChild] = useState(
    encryptStorage.getItem("activeChildParent")
  );
  const profileData = encryptStorage.getItem("authData");
  const { data } = profileData;
  const isMobile = useScreenMobile({ size: 1150 });
  const location = useLocation();

  const openMenu = (i) => {
    setMenuExpand((prev) => (prev === i ? null : i));
  };

  const expand = () => {
    setCollapse((prev) => !prev);
  };

  const menuClicked = (i, route) => {
    setActiveMenu(i);
    encryptStorage.setItem("activeMenu", i);
    setActiveSubMenu(null);
    setLastChild(null);
    encryptStorage.setItem("activeSubMenu", "");
    isMobile && setCollapse(false);
    localStorage.removeItem("status");
    localStorage.removeItem("multiselectValue");
    localStorage.removeItem("filterData");
  };

  const childMenuSelected = (i, id) => {
    setActiveSubMenu(i);
    encryptStorage.setItem("activeSubMenu", i);
    setActiveMenu(id);
    setMenuExpand(null);
    setLastChild(null);
    +encryptStorage.setItem("activeMenu", id);
    isMobile && setCollapse(false);
    localStorage.removeItem("status");
    localStorage.removeItem("multiselectValue");
    localStorage.removeItem("filterData");
  };

  const handleClick = (event) => {
    if (getWindowWidth() <= 768) {
      const buttonClicked = event.target.closest("#hamburger");
      if (!buttonClicked && !event.target.closest("#sidebar")) {
        setCollapse(false);
      }
    }
  };

  const childMenuParent = () => {
    setMenuExpand(false);
    setSubChildMenu((prev) => !prev);
  };

  const childSubMenu = (data, parent, childParent) => {
    setMenuExpand(false);
    setLastChild(data);
    setActiveMenu(parent);
    setActiveSubMenu(childParent);
    isMobile && setCollapse(false);

    encryptStorage.setItem("activeMenu", parent);
    encryptStorage.setItem("activeSubMenu", childParent);
    encryptStorage.setItem("activeChildParent", childParent);
    localStorage.removeItem("status");
    localStorage.removeItem("multiselectValue");
    localStorage.removeItem("filterData");
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const sideMenuData = await sidebarData({
          email: data?.email,
          // role_id: String(data?.role_id),
          role_id: String(data?.role_id)
        });
        // setApiData(data?.data);
        if (sideMenuData.status) setLoading(false);
        parseSidebarList(sideMenuData.data);
      } catch (error) {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // Parses the sidebar list item and extracts relevant information such as menu labels,icons, routes, and child menus.
  const parseSidebarList = (item) => {
    // route mapping
    const iconMapping = {
      Dashboard: <DashboardIcon />,
      Transportation: <TransportIcon />,
      Finance: <Finance />,
      Marketing: <Marketing />
    };
    const iconActiveMapping = {
      Dashboard: <DashboardIconActive />,
      Transportation: <TransportIconActive />,
      Finance: <FinanceIconActive />,
      Marketing: <MarketingIconActive />
    };
    const routeMapping = {
      Dashboard: "/dashboard",
      Transportation: "/transportation",
      Finance: "/finance",
      Marketing: "/marketing"
    };

    const parseValue = Object.keys(item).map((key) => {
      const menuTitle = item[key].menu_label;
      const icon = iconMapping[menuTitle] || null;
      const iconActive = iconActiveMapping[menuTitle] || null;
      const route = routeMapping[menuTitle] || null;

      return {
        id: 2,
        menu_label: item[key].menu_label,
        expand: Object.keys(item[key].child_menu).length !== 0,
        icon: icon,
        iconActive: iconActive,
        route: route,
        child_menu: Object.keys(item[key].child_menu).length !== 0 && [
          Object.keys(item[key].child_menu).map((subData) => {
            const subMenuTitle = item[key].child_menu[subData].menu_label;
            const subMenuMapping = {
              Dashboard: "/trip-dashboard",
              Listing: "/tripListing",
              "Lead Management": "/marketing-lead-dashboard"
            };
            const subRoute = subMenuMapping[subMenuTitle] || "/coming";
            return {
              id: 2.1,
              subMenuTitle: item[key].child_menu[subData].menu_label,
              subMenuRoute: subRoute,
              subChild: Object.keys(item[key].child_menu[subData].child_menu)
                .length !== 0 && [
                Object.keys(item[key].child_menu[subData].child_menu).map(
                  (subChild) => {
                    const subMenuChildMap = {
                      Dashboard: "/marketing-lead-dashboard",
                      Listing: "/marketing-lead-listing"
                    };
                    const subChildMenuTitle =
                      item[key].child_menu[subData].child_menu[subChild]
                        .menu_label;
                    const subChildMenu =
                      subMenuChildMap[subChildMenuTitle] || "/coming";
                    return {
                      subMenuChild:
                        item[key].child_menu[subData].child_menu[subChild]
                          .menu_label,
                      subChildMenuRoute: subChildMenu
                    };
                  }
                )
              ]
            };
          })
        ]
      };
    });
    setApiData(parseValue);
  };

  // Mapping of routes to menu items and sub-menu items.
  const routeToMenuMapping = {
    "/dashboard": { menu: "Dashboard", subMenu: "" },
    "/finance": { menu: "Finance", subMenu: "" },
    "/trip-dashboard": { menu: "Transportation", subMenu: "Dashboard" },
    "/tripListing": { menu: "Transportation", subMenu: "Listing" },
    "/marketing-lead-dashboard": {
      menu: "Marketing",
      subMenu: "Lead Management",
      subMenuChild: "Dashboard"
    },
    "/marketing-lead-listing": {
      menu: "Marketing",
      subMenu: "Lead Management",
      subMenuChild: "Listing"
    }
  };

  // const handlePopState = () => {
  //   const savedActiveMenu = localStorage.getItem("activeMenu");
  //   const savedActiveSubMenu = localStorage.getItem("activeSubMenu");
  //   const savedLastChildMenu = localStorage.getItem("activeChildParent");

  //   const { menu, subMenu, subMenuChild } =
  //     routeToMenuMapping[window.location.pathname] || {};

  //   setActiveMenu(menu || savedActiveMenu || "");
  //   setActiveSubMenu(subMenu || savedActiveSubMenu || "");
  //   setLastChild(subMenuChild || savedLastChildMenu || "");
  // };

  // useEffect(() => {
  //   window.addEventListener("popstate", handlePopState);

  //   return () => {
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, []);

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    // Save to local storage
    encryptStorage.setItem("activeMenu", activeMenu);

    encryptStorage.setItem("activeSubMenu", activeSubMenu);

    encryptStorage.setItem("activeChildParent", lastChild);

    // Set the active states from local storage
    const savedActiveMenu = encryptStorage.getItem("activeMenu");

    const savedActiveSubMenu = encryptStorage.getItem("activeSubMenu");

    const savedChildParent = encryptStorage.getItem("activeChildParent");

    setActiveMenu(savedActiveMenu);
    setActiveSubMenu(savedActiveSubMenu);
    setLastChild(savedChildParent);
  }, [activeMenu, activeSubMenu, lastChild]);

  useEffect(() => {
    // Set the collapse state based on window width
    getWindowWidth() <= 1150 ? setCollapse(false) : setCollapse(true);
  }, []);

  useEffect(() => {
    // Handle tab change when URL changes
    handleTabChange();
  }, [location.pathname]);

  // const handleTabChange = () => {
  //   const { menu, subMenu, subMenuChild } =
  //     routeToMenuMapping[location.pathname] || {};

  //   setActiveMenu(menu || "");
  //   setActiveSubMenu(subMenu || "");
  //   setLastChild(subMenuChild || "");
  // };
  const handleTabChange = () => {
    const currentPath = window.location.pathname;

    // Iterate through the routeToMenuMapping to find a match
    Object.keys(routeToMenuMapping).forEach((route) => {
      const { menu, subMenu, subMenuChild } = routeToMenuMapping[route];

      if (currentPath.startsWith(route)) {
        setActiveMenu(menu);
        setActiveSubMenu(subMenu);
        setLastChild(subMenuChild);
      }
    });
  };

  return (
    <aside className="sidebar" id="sidebar">
      {/* If sidebar is collapsed, then we will reduce the width of the sidebar */}
      <ul
        className="sidebarMenu"
        style={{ width: collapse ? "204px" : "60px" }}
      >
        {loading &&
          Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton
                key={i}
                height={"28"}
                width={"70%"}
                margin={"6px auto"}
                skeletonTwo={true}
                widthTwo={"10%"}
                heightTwo={"20px"}
              />
            ))}

        {apiData.map((data, k) => (
          // expand is a boolean, if expand is true then that have child_menu.
          <React.Fragment key={k}>
            {data.expand ? (
              <li
                onClick={() => openMenu(k)}
                className={`subMenuParent ${collapse ? "" : "menuCollapsed"}`}
                style={{
                  height: menuExpand === k ? "auto" : "46px",
                  overflow: collapse ? "hidden" : "visible"
                }}
              >
                <span
                  className={`subMenuParentLogo ${
                    collapse ? "" : "collapsed"
                  } ${
                    activeMenu === data?.menu_label ? "subMenuParentActive" : ""
                  }`}
                >
                  {activeMenu === data?.menu_label
                    ? data?.iconActive
                    : data.icon}
                  {/* if collapse is true then only we will show the options */}
                  {collapse ? <p>{data.menu_label}</p> : ""}

                  {/* If collapse is true then we will show arrow */}
                  {collapse ? (
                    <label
                      style={{
                        transform:
                          menuExpand === k ? "rotate(180deg)" : "rotate(0deg"
                      }}
                    >
                      <Arrow />
                    </label>
                  ) : (
                    <ul className="subMenuItems">
                      <span>{data.menu_label}</span>
                      {/* Mapping the child_menu (Hover popup list in collapsed state) */}
                      {data.child_menu &&
                        !collapse &&
                        data.child_menu.map((item) =>
                          item.map((value, valKey) => (
                            <React.Fragment key={valKey}>
                              {value.subChild ? (
                                <>
                                  <li
                                    className={`subMenuChildParent collapseFalseHoverTitle ${
                                      activeSubMenu === value?.subMenuTitle
                                        ? "subMenuSelected"
                                        : ""
                                    }`}
                                  >
                                    <label onClick={childMenuParent}>
                                      <div
                                        style={{ top: "9px", left: "-18px" }}
                                        className={`subMenuSelectedIcon ${
                                          activeSubMenu === value?.subMenuTitle
                                            ? "subMenuSelectedIconActive"
                                            : ""
                                        }`}
                                      >
                                        <SubMenuActive />
                                      </div>
                                      {value?.subMenuTitle}
                                    </label>
                                  </li>
                                  <div className="subMenuChildPop">
                                    {value?.subChild &&
                                      value?.subChild[0].map((child, key) => (
                                        <div
                                          key={key}
                                          className="subMenuChildPopItem"
                                          // style={{
                                          //   height: subChildMenu ? "auto" : "0px"
                                          // }}
                                        >
                                          <Link to={child?.subChildMenuRoute}>
                                            <p
                                              onClick={() =>
                                                childSubMenu(
                                                  child?.subMenuChild,
                                                  data?.menu_label,
                                                  value?.subMenuTitle
                                                )
                                              }
                                              style={{
                                                fontWeight:
                                                  lastChild ===
                                                  child?.subMenuChild
                                                    ? "600"
                                                    : "400"
                                              }}
                                            >
                                              {child?.subMenuChild}
                                            </p>
                                          </Link>
                                          <div
                                            style={{
                                              top: "15px",
                                              left: "-10px"
                                            }}
                                            className={`subMenuSelectedIcon ${
                                              lastChild === child?.subMenuChild
                                                ? "subMenuSelectedIconActive"
                                                : ""
                                            }`}
                                          >
                                            <SubMenuActive />
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </>
                              ) : (
                                <Link to={value?.subMenuRoute}>
                                  <li
                                    onClick={() =>
                                      childMenuSelected(
                                        value?.subMenuTitle,
                                        data?.menu_label
                                      )
                                    }
                                    className={`${
                                      activeSubMenu === value?.subMenuTitle
                                        ? "subMenuSelected"
                                        : ""
                                    }`}
                                  >
                                    <img
                                      style={{ left: "6px" }}
                                      src={
                                        activeSubMenu === value?.subMenuTitle
                                          ? SubmenuActive
                                          : ""
                                      }
                                      alt=""
                                    />
                                    {value?.subMenuTitle}
                                  </li>
                                </Link>
                              )}
                            </React.Fragment>
                          ))
                        )}
                    </ul>
                  )}
                </span>
                <ul>
                  {/* Mapping the child_menu */}
                  {data.child_menu &&
                    collapse &&
                    data.child_menu.map((item) =>
                      item.map((value, val) => (
                        // Mapping submenu of child_menu (if condition is true)
                        <React.Fragment key={val}>
                          {value.subChild ? (
                            <>
                              <li
                                className={`subMenuChildParent ${
                                  activeSubMenu === value?.subMenuTitle
                                    ? "subMenuSelected"
                                    : ""
                                }`}
                                onClick={childMenuParent}
                              >
                                <label to={value?.subMenuRoute}>
                                  <div
                                    style={{ top: "-4px", left: "-12px" }}
                                    className={`subMenuSelectedIcon ${
                                      activeSubMenu === value?.subMenuTitle
                                        ? "subMenuSelectedIconActive"
                                        : ""
                                    }`}
                                  >
                                    <SubMenuActive />
                                  </div>
                                  {value?.subMenuTitle}
                                  <span
                                    style={{
                                      transform: subChildMenu
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                      padding: "0"
                                    }}
                                  >
                                    <Arrow />
                                  </span>
                                </label>
                              </li>
                              <div
                                className="subMenuChildPop"
                                style={{
                                  height: subChildMenu ? "auto" : "0px"
                                }}
                              >
                                {value?.subChild &&
                                  value?.subChild[0].map((child, childKey) => (
                                    <div
                                      key={childKey}
                                      className="subMenuChildPopItem"
                                      onClick={() =>
                                        childSubMenu(
                                          child?.subMenuChild,
                                          data?.menu_label,
                                          value?.subMenuTitle
                                        )
                                      }
                                    >
                                      <Link to={child?.subChildMenuRoute}>
                                        <p
                                          style={{
                                            fontWeight:
                                              lastChild === child?.subMenuChild
                                                ? "600"
                                                : "400"
                                          }}
                                        >
                                          {child?.subMenuChild}
                                        </p>
                                      </Link>
                                      <div
                                        style={{ top: "5px", left: "-4px" }}
                                        className={`subMenuSelectedIcon ${
                                          lastChild === child?.subMenuChild
                                            ? "subMenuSelectedIconActive"
                                            : ""
                                        }`}
                                      >
                                        <SubMenuActive />
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </>
                          ) : (
                            <Link to={value?.subMenuRoute}>
                              <li
                                onClick={() =>
                                  childMenuSelected(
                                    value?.subMenuTitle,
                                    data?.menu_label
                                  )
                                }
                                className={`${
                                  activeSubMenu === value?.subMenuTitle
                                    ? "subMenuSelected"
                                    : ""
                                }`}
                              >
                                <div
                                  className={`subMenuSelectedIcon ${
                                    activeSubMenu === value?.subMenuTitle
                                      ? "subMenuSelectedIconActive"
                                      : ""
                                  }`}
                                >
                                  <SubMenuActive />
                                </div>
                                {value?.subMenuTitle}
                              </li>
                            </Link>
                          )}
                        </React.Fragment>
                      ))
                    )}
                </ul>
              </li>
            ) : (
              // Showing options menu without (expand false)
              <Link to={data?.route}>
                <li
                  className={`sidebarMenuMain ${
                    collapse ? "" : "menuCollapsed"
                  }`}
                >
                  <span
                    className={`${collapse ? "" : "collapsed"} ${
                      activeMenu === data?.menu_label ? "selectedMenu" : ""
                    }`}
                    onClick={() => menuClicked(data?.menu_label, data?.route)}
                  >
                    {activeMenu === data?.menu_label
                      ? data?.iconActive
                      : data?.icon}
                    {collapse ? <p>{data.menu_label}</p> : ""}
                  </span>{" "}
                </li>
              </Link>
            )}
          </React.Fragment>
        ))}
      </ul>
      {/* Showing collapse button at the bottom of the screen */}
      <span
        onClick={expand}
        className={`sidebarCollapse ${collapse ? "" : "collapsed"}`}
      >
        <span
          style={{ transform: collapse ? "rotate(0deg)" : "rotate(180deg)" }}
        >
          <Collapse />
        </span>{" "}
        <p style={{ width: collapse ? "100px" : "0px" }}>
          {collapse ? "Collapse" : ""}
        </p>
      </span>
    </aside>
  );
};

export default Sidebar;
