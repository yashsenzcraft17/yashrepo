import React, { useEffect, useRef, useState } from "react";

import StatusTag from "components/StatusTag";

import "components/LeadDetailsCard/leadDetailsCard.scss";

import downArrow from "assets/images/LeadDetails/downArrow.svg";
import useScreenMobile from "hooks/useScreenMobile";

const LeadDetailsCard = ({
  image,
  title,
  children,
  setIsActive,
  isActive,
  setIsActiveId,
  isActiveId,
  commonId,
  leadData,
  communication,
  channel
}) => {
  const formRef = useRef(null);
  const [formHeight, setFormHeight] = useState(56);

  const isMobile = useScreenMobile({ size: 768 });

  useEffect(() => {
    if (formRef.current) {
      setFormHeight(
        isActive && isActiveId === commonId ? formRef.current.scrollHeight : 56
      );
    }
  }, [isActive, isActiveId, children]);

  const handleClick = () => {
    setIsActiveId(commonId);
  };

  return (
    <div
      className="leadCard"
      style={{
        height: isMobile ? formHeight : "auto",
        overflow: isMobile ? "hidden" : "unset",
        transition: "all 0.3s ease-in-out"
      }}
      ref={formRef}
    >
      <div className="leadCardLogo">
        <div className="leadCardHeading">
          <div className="leadCardHeadingData">
            {image && (
              <img className="leadCardHeadingDataImg" src={image} alt="image" />
            )}
            <h2 className="leadCardHeadingDataHeaderText">
              {title} {channel ? <span>{channel}</span> : ""}
            </h2>{" "}
          </div>

          <div className="leadCardArrows">
            <div className="leadCardArrowsStatusMsg">
              <StatusTag value={leadData?.lead_status} />
            </div>

            <div className="leadCardAccordion" onClick={handleClick}>
              <img
                style={{
                  transform:
                    isActive && isActiveId === commonId
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  transition: "all 0.5s ease"
                }}
                src={downArrow}
                alt="image"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="leadCardForm">{children}</div>
    </div>
  );
};

export default LeadDetailsCard;
