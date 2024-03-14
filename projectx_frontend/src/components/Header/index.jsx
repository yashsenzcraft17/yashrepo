import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EncryptStorage } from "encrypt-storage";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import useScreenMobile from "hooks/useScreenMobile";

import Profile from "components/Profile";

import { getWindowWidth } from "utils/window";

import Logo from "assets/images/header/logo.svg";
import Bell from "assets/images/header/bell.svg";
import ProfileIcon from "assets/images/header/profile.svg";
import DownArrow from "assets/images/header/downArrow.svg";
import Hamburger from "assets/images/header/hamburger.svg";
import HideArrow from "assets/images/header/hideSidebarArrow.svg";

import profileLogo from "assets/images/header/profileLogo.svg";
import supportLogo from "assets/images/header/supportLogo.svg";
import signOutLogo from "assets/images/header/signoutLogo.svg";

import "components/Header/header.scss";
import Skeleton from "components/Skeleton/index";

const Header = ({ setCollapse, collapse }) => {
  const [authData, setAuthData] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [detailsMenu, setDetailsMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMobile = useScreenMobile({ size: 768 });

  const profileClick = () => {
    setOpenProfile(true);
    isMobile && document.querySelector("body").classList.add("no-scroll");
  };

  const openDetailsMenu = () => {
    setDetailsMenu(true);
  };

  const handleClick = (event) => {
    if (!event.target.closest("#headerPopup")) {
      setDetailsMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.clear();

    toast.success(
      <>
        <span className="formSuccessMsg">Successfully signed out</span>
      </>,
      {
        position:
          getWindowWidth() <= 768
            ? toast.POSITION.BOTTOM_CENTER
            : toast.POSITION.TOP_RIGHT,
        toastId: "1"
      }
    );
    navigate("/");
  };

  useEffect(() => {
    const encryptStorage = new EncryptStorage("senzcraft123#", {
      prefix: ""
    });

    const storedAuthData = encryptStorage?.getItem("authData");

    if (storedAuthData) {
      setAuthData(storedAuthData?.data);
      setLoading(true);
    }
  }, []);
  return (
    <div className="headerContainer">
      <header className="header">
        <div className="headerLogo">
          <Link to={"/dashboard"}>
            <img
              className={`companyLogo ${collapse ? "logoPhn" : ""}`}
              src={Logo}
              alt="logo"
            />
          </Link>
          <img
            onClick={() => setCollapse((prev) => !prev)}
            className="hamburger"
            src={collapse ? HideArrow : Hamburger}
            alt="Hamburger"
            id="hamburger"
          />
        </div>
        <div className="headerProfile">
          <span className="bell">
            <img src={Bell} alt="bell" />
          </span>
          <div
            className="headerProfileDetails"
            onClick={openDetailsMenu}
            id="headerPopup"
          >
            <div
              className="dpImgContainer"
              style={{
                height: 32,
                width: 32,
                borderRadius: 100,
                overflow: "hidden"
              }}
            >
              {!loading ? (
                <Skeleton height={"30"} width={"87px"} />
              ) : (
                <img
                  src={authData?.photo_url ? authData?.photo_url : ProfileIcon}
                  alt="profileLoco"
                />
              )}
              <img
                src={authData?.photo_url ? authData?.photo_url : ProfileIcon}
                alt="profileLoco"
              />
            </div>
            <div className="headerProfileName">
              {!loading ? (
                <Skeleton height={"18"} width={"87px"} />
              ) : (
                <span>{authData?.name || "-"}</span>
              )}
              {!loading ? (
                <Skeleton height={"14"} width={"87px"} />
              ) : (
                <p>{authData?.role_name || "-"}</p>
              )}
            </div>
            <img
              src={DownArrow}
              alt="DownArrow"
              className="downArrow"
              style={{
                transform: detailsMenu ? "rotate(180deg)" : "rotate(0deg)"
              }}
            />
            {/* Profile details menu */}
            <div
              className="headerProfileDetailsMenu"
              id="headerProfileDetailsMenu"
              style={{ display: detailsMenu ? "flex" : "none" }}
            >
              <span onClick={profileClick}>
                <img src={profileLogo} alt="profileLogo" /> Profile
              </span>
              <span>
                <img src={supportLogo} alt="supportLogo" /> Support
              </span>

              <span onClick={handleSignOut}>
                <img src={signOutLogo} alt="signOutLogo" /> Sign Out
              </span>
            </div>
          </div>
        </div>
      </header>
      {/* Profile details sidebar */}
      <Profile openProfile={openProfile} setOpenProfile={setOpenProfile} />
    </div>
  );
};

export default Header;
