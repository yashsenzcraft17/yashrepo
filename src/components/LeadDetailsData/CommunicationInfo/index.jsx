import { parse, format } from "date-fns";

import Skeleton from "components/Skeleton";

import "components/LeadDetailsData/CommunicationInfo/communicationInfo.scss";

import noDataLogo from "assets/images/LeadDetails/noDataLogo.svg";
import LeadDetailsCard from "components/LeadDetailsCard/index";

import ReceiverIcon from "assets/images/LeadDetails/receiverIcon.svg";
import ReplyIcon from "assets/images/LeadDetails/replyIcon.svg";
import { useEffect, useState } from "react";

const CommunicationInfo = ({
  leadData,
  loading,
  setIsActiveId,
  isActiveId,
  setIsActive,
  isActive
}) => {
  const [jsonValue, setJsonValue] = useState({});
  // const whatsappData = [
  //   { sender: "x1", date_time: "d1", msg: "hi" },
  //   { sender: "y1", date_time: "d2", msg: "hello" },
  //   { sender: "x2", date_time: "d3", msg: "how are you" },
  //   { sender: "y2", date_time: "d3", msg: "im fine" }
  // ];

  useEffect(() => {
    if (leadData?.other_info?.other_lead_source === "e-Mail") {
      const parseValue = JSON.parse(leadData?.communication_info?.about_img);
      setJsonValue(parseValue);
    }
    if (leadData?.other_info?.other_lead_source === "WhatsApp") {
      const parseValue = JSON.parse(leadData?.communication_info?.about_img);
      setJsonValue(parseValue);
    }
  }, [
    leadData?.other_info?.other_lead_source,
    leadData?.communication_info?.about_img
  ]);

  useEffect(() => {
    // Parse and format the date when jsonValue.date changes
    const parsedDate = parse(
      jsonValue.date,
      "EEEE, MMMM dd, yyyy h:mm:ss a",
      new Date()
    );

    if (!isNaN(parsedDate.getTime())) {
      const formattedDate = format(parsedDate, "MMM dd, yyyy, h:mm a");
      // Update the state with the formatted date
      setJsonValue((prevState) => ({
        ...prevState,
        date: formattedDate
      }));
    } else {
      console.error("Invalid date string");
    }
  }, [jsonValue.date]);

  return (
    <>
      <LeadDetailsCard
        title="Communication Info"
        setIsActive={setIsActive}
        isActive={isActive}
        setIsActiveId={setIsActiveId}
        isActiveId={isActiveId}
        commonId="5"
        communication={true}
        channel={leadData?.other_info?.other_lead_source}
      >
        <div className="communicationInfo">
          {
            // Event

            loading ? (
              <Skeleton width={"300px"} height={300} />
            ) : (
              leadData?.other_info?.other_lead_source === "Event" &&
              (typeof leadData?.communication_info?.img_url === "string" ? (
                <>
                  <img
                    className="communicationInfoImage"
                    src={leadData?.communication_info?.img_url}
                    alt="image"
                  />
                  <p className="communicationInfoImageParagraph">
                    {leadData?.communication_info?.about_img}
                  </p>
                </>
              ) : (
                <div className="communicationInfoNoData">
                  <img
                    className="communicationInfoImg"
                    src={noDataLogo}
                    alt="image"
                  />
                  <h4 className="communicationInfoImgText">
                    No Communication yet!
                  </h4>
                  <p className="communicationInfoImgPara">
                    The communications from different channels would appear here
                  </p>
                </div>
              ))
            )
          }
          {
            // Chatbot
            leadData?.other_info?.other_lead_source === "Chatbot" &&
              (leadData?.communication_info?.about_img !== null ? (
                <p className="communicationInfoChatbot">
                  {leadData?.communication_info?.about_img}
                </p>
              ) : (
                <div className="communicationInfoNoData">
                  <img
                    className="communicationInfoImg"
                    src={noDataLogo}
                    alt="image"
                  />
                  <h4 className="communicationInfoImgText">
                    No Communication yet!
                  </h4>
                  <p className="communicationInfoImgPara">
                    The communications from different channels would appear here
                  </p>
                </div>
              ))
          }

          {leadData?.other_info?.other_lead_source === "WhatsApp" &&
            (typeof jsonValue?.data === "object" ? (
              <div className="communicationInfoWhatsapp">
                {jsonValue?.data?.map((message, index) => (
                  <div
                    key={index}
                    className={`chatMsg ${
                      message.customer === 0 ? "senderMsg" : "receiverMsg"
                    }`}
                  >
                    {message.customer === 0 && (
                      <>
                        <img src={ReceiverIcon} alt="SenderIcon" />
                        <div className="senderMsgDetails">
                          <p>{message.msg}</p>
                          <span>{message.date_time}</span>
                        </div>
                      </>
                    )}
                    {message.customer === 1 && (
                      <>
                        <div className="receiverMsgDetails">
                          <p>{message.msg}</p>
                          <span>{message.date_time}</span>
                        </div>
                        <img src={ReplyIcon} alt="ReceiverIcon" />
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="communicationInfoNoData">
                <img
                  className="communicationInfoImg"
                  src={noDataLogo}
                  alt="image"
                />
                <h4 className="communicationInfoImgText">
                  No Communication yet!
                </h4>
                <p className="communicationInfoImgPara">
                  The communications from different channels would appear here
                </p>
              </div>
            ))}

          {
            // Mail
            leadData?.other_info?.other_lead_source === "e-Mail" &&
              (typeof jsonValue === "object" ? (
                <div className="communicationInfoMail">
                  <h4>{jsonValue.subject}</h4>
                  <div className="communicationInfoMailContent">
                    <div className="mailTitle">
                      <h5>{jsonValue.sender_name} </h5>
                      <p>
                        {jsonValue.mail_id} <span>{jsonValue.date}</span>
                      </p>
                    </div>
                    <div className="mailContent">
                      <p>{jsonValue.body}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="communicationInfoNoData">
                  <img
                    className="communicationInfoImg"
                    src={noDataLogo}
                    alt="image"
                  />
                  <h4 className="communicationInfoImgText">
                    No Communication yet!
                  </h4>
                  <p className="communicationInfoImgPara">
                    The communications from different channels would appear here
                  </p>
                </div>
              ))
          }
        </div>
      </LeadDetailsCard>
    </>
  );
};

export default CommunicationInfo;
