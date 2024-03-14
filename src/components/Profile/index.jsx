import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EncryptStorage } from "encrypt-storage";
import useScreenMobile from "hooks/useScreenMobile";

import { profileDetails } from "constants/profileDetails";

import { toast } from "react-toastify";

import SignOut from "components/icons/profile/signOut";

import { getWindowWidth } from "utils/window";

import Close from "assets/images/profile/close.svg";
import ProfileLogo from "assets/images/header/profile.svg";

import "components/Profile/profile.scss";

const Profile = ({ openProfile, setOpenProfile }) => {
  const [authData, setAuthData] = useState(null);
  const [userValue, setUserValue] = useState([]);
  const isMobile = useScreenMobile({ size: 768 });

  useEffect(() => {
    if (authData) {
      const updatedValues = profileDetails?.map((item) => {
        if (item?.key === "userId") {
          return {
            key: "userId",
            title: "User ID",
            value: "TS1212213"
          };
        }
        return {
          ...item,
          value: authData[item?.key]
        };
      });
      setUserValue([...updatedValues]);
    }
  }, [authData]);

  const profileClose = () => {
    setOpenProfile(false);
    isMobile && document.querySelector("body").classList.remove("no-scroll");
  };

  const navigate = useNavigate();

  const handleBack = (e) => {
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
        toastId: "1",
        onClose: () => {
          // handle close logic here without calling preventDefault
          navigate("/");
        }
      }
    );
  };

  useEffect(() => {
    const encryptStorage = new EncryptStorage("senzcraft123#", {
      prefix: ""
    });

    const storedAuthData = encryptStorage?.getItem("authData");

    if (storedAuthData) {
      setAuthData(storedAuthData?.data);
    }
  }, []);

  const handleClick = (event) => {
    const profilePopup = event.target.closest("#headerProfileDetailsMenu");

    if (
      !profilePopup &&
      !event.target.closest("#profile") &&
      !event.target.closest(".Toastify__toast-body")
    ) {
      setOpenProfile(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div
      className="profile"
      id="profile"
      style={{ right: openProfile ? "0" : "-100%" }}
    >
      <h3 className="profileHeadPhn">
        Profile <img src={Close} alt="Close" onClick={profileClose} />
      </h3>
      <div className="profileRole">
        <h3>
          Profile <img src={Close} alt="Close" onClick={profileClose} />
        </h3>
        <div className="profileRoleImgDetails">
          <div className="profileRoleImgDetailsContainer">
            <img
              src={authData?.photo_url ? authData?.photo_url : ProfileLogo}
              alt="ProfileLogo"
            />
          </div>

          <p>{authData?.name || "-"}</p>
          <span>{authData?.role_name || "-"}</span>
        </div>
      </div>
      <div className="profileDetails">
        <div className="profileDetailsSection">
          {userValue?.map((data, i) => (
            <div className="profileDetailsSectionPoints" key={i}>
              <span>{data?.title || "-"}</span>
              <p>{data?.value || "-"}</p>
            </div>
          ))}
        </div>
        <button onClick={handleBack}>
          Sign Out <SignOut />{" "}
        </button>
      </div>
    </div>
  );
};

export default Profile;
