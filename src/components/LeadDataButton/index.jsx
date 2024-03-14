import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "components/Skeleton";
import useScreenMobile from "hooks/useScreenMobile";
// import { getWindowWidth } from "utils/window";
// import { toast } from "react-toastify";

import rejectedIcon from "assets/images/LeadDetails/rejectedMobile.svg";
import saveIcon from "assets/images/LeadDetails/saveMobile.svg";
import closeImg from "assets/images/LeadDetails/Close.svg";

import "components/LeadDataButton/leadDataButton.scss";

const LeadDataButton = ({ loading, handleSubmit, formValues, updateFlag }) => {
  const [showPopUp, setShowPopUp] = useState(false);

  const isMobile = useScreenMobile({ size: 992 });

  const isDisabled =
    formValues?.reject_reason?.length &&
    formValues?.reject_reason !== "Please Select...";

  const navigate = useNavigate();

  const handleClick = () => {
    setShowPopUp(!showPopUp);
    navigate("/marketing-lead-listing");
  };

  const handlePostToCRM = () => {
    handleSubmit(formValues, "postToCRM", updateFlag?.SUBMIT);

    // Show toast message for postToCRM
    // toast.success(
    //   <>
    //     <span className="formSuccessMsg">Values updated successfully</span>
    //   </>,
    //   {
    //     position:
    //       getWindowWidth() <= 768
    //         ? toast.POSITION.BOTTOM_CENTER
    //         : toast.POSITION.TOP_RIGHT,
    //     toastId: "1"
    //   }
    // );
  };

  return (
    <section className="leadButton">
      {loading ? (
        <Skeleton width={"100%"} height={44} />
      ) : (
        <>
          {isMobile ? (
            <div className="leadButtonResponsive">
              <img
                src={rejectedIcon}
                alt="icon"
                disabled={isDisabled}
                style={{
                  cursor: !isDisabled ? "default" : "pointer",
                  opacity: !isDisabled ? "0.5" : "1",
                  pointerEvents: !isDisabled ? "none" : "inherit"
                }}
                onClick={() =>
                  handleSubmit(formValues, "reject", updateFlag?.REJECTED)
                }
              />
              <img
                src={saveIcon}
                alt="icon"
                onClick={() => {
                  if (!isDisabled) {
                    handleSubmit(formValues, "reject", updateFlag?.REJECTED);
                  }
                }}
              />
              <button
                className="leadButtonResponsiveBtn"
                onClick={handlePostToCRM}
                disabled={isDisabled}
                style={{
                  cursor: isDisabled ? "default" : "pointer",
                  opacity: isDisabled ? "0.5" : "1"
                }}
              >
                {loading ? <div className="formSpinner"></div> : "Post to CRM"}
              </button>
            </div>
          ) : (
            <div
              className={`${
                window.location.pathname === "/marketing-lead-listing/lead"
                  ? " hidden"
                  : "withRejectedButton"
              }`}
            >
              <button
                className="leadButtonTypesCancel"
                onClick={() => setShowPopUp(!showPopUp)}
              >
                {loading ? <div className="formSpinner"></div> : "Cancel"}
              </button>

              <div className="leadButtonTypesMultiple">
                {window.location.pathname ===
                "/marketing-lead-listing/lead" ? null : (
                  <button
                    className="leadButtonTypesRejected"
                    disabled={!isDisabled}
                    style={{
                      cursor: !isDisabled ? "default" : "pointer",
                      opacity: !isDisabled ? "0.5" : "1"
                    }}
                    onClick={() =>
                      handleSubmit(formValues, "reject", updateFlag?.REJECTED)
                    }
                  >
                    {loading ? <div className="formSpinner"></div> : "Reject"}
                  </button>
                )}
                <button
                  onClick={() =>
                    handleSubmit(formValues, "saveAsDraft", updateFlag?.DRAFT)
                  }
                  className="leadButtonTypesSaveAsDraft"
                >
                  {loading ? (
                    <div className="formSpinner"></div>
                  ) : (
                    "Save as draft"
                  )}
                </button>
                <button
                  className="leadButtonTypesPostToCRM"
                  onClick={() =>
                    handleSubmit(formValues, "postToCRM", updateFlag?.SUBMIT)
                  }
                  disabled={isDisabled}
                  style={{
                    cursor: isDisabled ? "default" : "pointer",
                    opacity: isDisabled ? "0.5" : "1"
                  }}
                >
                  {loading ? (
                    <div className="formSpinner"></div>
                  ) : (
                    "Post to CRM"
                  )}
                </button>
              </div>

              {/* showPopUp */}
              {showPopUp && (
                <div className="leadButtonBg">
                  <div className="leadButtonBgColor">
                    <div className="leadButtonCancel">
                      <h2 className="leadButtonCancelHeading">
                        Discard changes
                      </h2>
                      <p className="leadButtonCancelPara">
                        Are you sure you want to discard the changes you made?
                      </p>

                      <div className="leadButtonCancelBtns">
                        <button
                          className="leadButtonCancelBtn"
                          onClick={() => setShowPopUp(!showPopUp)}
                        >
                          Cancel
                        </button>
                        <button
                          className="leadButtonCancelSaveBtn"
                          onClick={handleClick}
                        >
                          Discard
                        </button>
                      </div>

                      <img
                        className="leadButtonCancelCloseImg"
                        src={closeImg}
                        alt="closeImg"
                        onClick={() => setShowPopUp(!showPopUp)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default LeadDataButton;
