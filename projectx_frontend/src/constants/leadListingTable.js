import StatusTag from "components/StatusTag";

const CustomHeader = ({ text }) => {
  const splitHeaderText = (text) => {
    return text?.split(" ").map((word, index) => <div key={index}>{word}</div>);
  };

  return <div>{splitHeaderText(text)}</div>;
};

const EmailCell = ({ value }) => {
  const truncatedEmail =
    value?.length > 20 ? `${value?.slice(0, 20)}...` : value;

  return (
    <div
      style={{ width: "100%" }}
      className="tripListTableHeaderValue"
      title={value}
    >
      <span className="tripListTableHeaderValueData">{truncatedEmail}</span>
    </div>
  );
};

const MobileCell = ({ value }) => {
  const truncatedEmail =
    value?.length > 13 ? `${value?.slice(0, 13)}...` : value;

  return (
    <div
      style={{ width: "100%" }}
      className="tripListTableHeaderValue"
      title={value}
    >
      <span className="tripListTableHeaderValueData">{truncatedEmail}</span>
    </div>
  );
};

export const LeadListingTable = [
  {
    Header: "Lead Type",
    accessor: "lead_type",
    Cell: (row) => {
      // return "#" + row?.value.substr(row?.value.length - 4);
      return row?.value
        ?.split(" ")
        .map((word, index) => <div key={index}>{word}</div>);
    }
  },
  {
    Header: "Contacted Date",
    accessor: "contacted_date",
    Cell: (row) => {
      if (row?.value !== "None") {
        const inputDate = new Date(row?.value);
        const options = {
          day: "2-digit",
          month: "short",
          year: "2-digit"
        };
        return inputDate.toLocaleDateString("en-GB", options);
      } else {
        return "-";
      }
    }
  },
  {
    Header: <CustomHeader text="Company" />,
    accessor: "company",
    Cell: (row) => {
      return (
        <span style={{ width: "80px", display: "block", margin: "0 auto" }}>
          {row?.value}
        </span>
      );
    }
  },
  {
    Header: <CustomHeader text="Name" />,
    accessor: "name",
    Cell: (row) => {
      return (
        <span style={{ width: "85px", display: "block", margin: "0 auto" }}>
          {row?.value}
        </span>
      );
    }
  },
  {
    Header: <CustomHeader text="Email" />,
    accessor: "email",
    Cell: EmailCell
  },
  {
    Header: "Mobile",
    accessor: "mobile",
    Cell: MobileCell
  },
  {
    Header: <CustomHeader text="Country" />,
    accessor: "country",
    Cell: (row) => {
      return (
        <div className="tripListTableHeaderCut" title={row?.value}>
          <span className="tripListTableHeaderCutData">
            <CustomHeader
              text={row?.value
                ?.toLowerCase()
                .replace(/\b(\w)/g, (x) => x.toUpperCase())}
            />
          </span>
        </div>
      );
    }
  },
  {
    Header: <CustomHeader text="Channel" />,
    accessor: "channel",
    Cell: ({ value }) => <div className="tripListTableDistance">{value}</div>
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }) => <StatusTag value={value} />
  }
];
