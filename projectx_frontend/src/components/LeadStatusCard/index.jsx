import { useEffect, useState } from "react";

import "components/LeadStatusCard/leadStatusCard.scss";

import downImg from "assets/images/LeadDetails/downArrow.svg";
import StatusTag from "components/StatusTag";

const LeadStatusCard = ({
  leadData,
  selectedRecordList,
  formValues,
  setSelectedOption,
  selectedOption
}) => {
  const [popup, setPopup] = useState(false);

  const openPopup = () => {
    if (leadData === "Posted" || leadData === "Rejected") {
      setPopup((prev) => !prev);
    }
    setPopup((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    const exportBtn = event.target.closest("#leadStatusDropdownOptions");
    if (!exportBtn && !event.target.closest("#leadStatusDropdown")) {
      setPopup(false);
    }
  };

  const optionSelected = (data) => {
    setSelectedOption(data);
    setPopup(false);
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedOption({ id: formValues?.lead_type || "" });
  }, [formValues]);

  return (
    <section className="leadStatus">
      <div className="leadStatusDetails">
        {/* firstSetDiv */}
        <div className="leadStatusDropdown" id="leadStatusDropdown">
          <h3>Lead Record Type:</h3>

          <div
            className="leadStatusDropdownSelect"
            style={{
              cursor:
                leadData === "Posted" || leadData === "Rejected"
                  ? "default"
                  : "pointer"
            }}
            onClick={openPopup}
          >
            <p>{selectedOption.id}</p>
            <img
              style={{
                transform: popup && "rotate(180deg)",
                transition: "all 0.4s ease"
              }}
              src={downImg}
              alt="downImg"
            />
          </div>
          {popup && (
            <div
              className="leadStatusDropdownOptions"
              id="leadStatusDropdownOptions"
            >
              {Object.entries(selectedRecordList?.lead_record_type).map(
                ([id, value]) => (
                  <span
                    key={id}
                    onClick={() => optionSelected({ id, value })}
                    className={id === selectedOption.id ? "optionSelected" : ""}
                  >
                    {id}
                  </span>
                )
              )}
            </div>
          )}
        </div>

        <div className="leadStatusDetailsStatusMsg">
          <StatusTag value={leadData} />
        </div>
      </div>
    </section>
  );
};

export default LeadStatusCard;
