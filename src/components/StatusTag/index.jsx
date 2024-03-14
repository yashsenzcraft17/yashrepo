import blueLogo from "assets/images/TripListing/blueEllipses.svg";
import greenEllipsesLogo from "assets/images/TripListing/greenEllipses.svg";
import yellowEllipsesLogo from "assets/images/TripListing/yellowEllipses.svg";
import RedEllipsesLogo from "assets/images/TripListing/redEllipses.svg";

const statusColorMapping = {
  Scheduled: { background: "#FFF8D6", text: "#E0AF00" }, // Yellow
  "Pending Review": { background: "#FFF8D6", text: "#E0AF00" }, // Yellow
  Completed: { background: "#DAF5DD", text: "#31A93E" }, // Green
  Posted: { background: "#DAF5DD", text: "#31A93E" }, // Green
  Running: { background: "#E2ECF9", text: "#1D67CD" }, // Blue
  Existing: { background: "#E2ECF9", text: "#1D67CD" },
  "In Progress": { background: "#E2ECF9", text: "#1D67CD" },
  Cancelled: { background: "#FFDFDF", text: "#DA0000s" }, // Red
  Rejected: { background: "#FFDFDF", text: "#DA0000" } // Red
};

const StatusTag = ({ value }) => {
  if (typeof value !== "string") {
    return <div></div>;
  }

  const statusColorClass = value?.toLowerCase().replace(/\s/g, "");

  return (
    <section>
      <div
        style={{
          backgroundColor: statusColorMapping[value]?.background || "",
          color: statusColorMapping[value]?.text || ""
        }}
        className="tripListTableHeaderLogo"
      >
        <div>
          {value === "Scheduled" && (
            <img
              src={yellowEllipsesLogo}
              alt="Yellow Ellipses"
              className="status-icon"
            />
          )}
          {value === "Pending Review" && (
            <img
              src={yellowEllipsesLogo}
              alt="Yellow Ellipses"
              className="status-icon"
            />
          )}
          {value === "Completed" && (
            <img
              src={greenEllipsesLogo}
              alt="Green Ellipses"
              className="status-icon"
            />
          )}
          {value === "Posted" && (
            <img
              src={greenEllipsesLogo}
              alt="Green Ellipses"
              className="status-icon"
            />
          )}
          {value === "Running" && (
            <img src={blueLogo} alt="Blue Ellipses" className="status-icon" />
          )}
          {value === "Cancelled" && (
            <img
              src={RedEllipsesLogo}
              alt="RedEllipsesLogo"
              className="status-icon"
            />
          )}
          {value === "Rejected" && (
            <img
              src={RedEllipsesLogo}
              alt="RedEllipsesLogo"
              className="status-icon"
            />
          )}
          {value === "Existing" && (
            <img src={blueLogo} alt="blueLogo" className="status-icon" />
          )}
        </div>
        <div className={`tripListTableHeaderColor ${statusColorClass}`}>
          {value}
        </div>
      </div>
    </section>
  );
};

export default StatusTag;
