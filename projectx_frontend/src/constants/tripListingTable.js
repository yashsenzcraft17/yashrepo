import StatusTag from "components/StatusTag";

const CustomHeader = ({ text }) => {
  const splitHeaderText = (text) => {
    return text?.split(" ").map((word, index) => <div key={index}>{word}</div>);
  };

  return <div>{splitHeaderText(text)}</div>;
};

export const TripListingTable = [
  {
    Header: "Trip ID",
    accessor: "trip_id",
    Cell: (row) => {
      // return "#" + row?.value.substr(row?.value.length - 4);
      return row?.value;
    }
  },
  {
    Header: "Start Date",
    accessor: "start_date",
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
    Header: <CustomHeader text="Route Code" />,
    accessor: "route_code"
  },
  // {
  //   Header: "Description",
  //   accessor: "route_desc",
  //   Cell: (row) => {
  //     return (
  //       <div className="tripListTableHeaderValue" title={row?.value}>
  //         <span className="tripListTableHeaderValueData">{row?.value}</span>
  //       </div>
  //     );
  //   }
  // },
  {
    Header: <CustomHeader text="Route Origin" />,
    accessor: "origin",
    Cell: ({ value }) => {
      return value?.toLowerCase().replace(/\b(\w)/g, (x) => x.toUpperCase());
    }
  },
  {
    Header: <CustomHeader text="Route Destination" />,
    accessor: "destination",
    Cell: ({ value }) => {
      return value?.toLowerCase().replace(/\b(\w)/g, (x) => x.toUpperCase());
    }
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }) => <StatusTag value={value} />
  },
  {
    Header: <CustomHeader text="Load Type" />,
    accessor: "load_type",
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
    Header: <CustomHeader text="Distance (Km)" />,
    accessor: "distance",
    Cell: ({ value }) => <div className="tripListTableDistance">{value}</div>
  },
  {
    Header: (
      <div className="tripListTableDistance">
        Rec. Fuel <br />
        Vol. (L)
      </div>
    ),
    accessor: "fuel_vol",
    Cell: ({ value }) => (
      <div className="tripListTableDistance">
        {value === "None" ? "-" : Math.round(value)}
      </div>
    )
  }
  // {
  //   Header: <div className="tripListTableDistance">Total Rec. Cost</div>,
  //   accessor: "cost",
  //   Cell: ({ value }) => (
  //     <div className="tripListTableDistance">
  //       {value === "None" ? "-" : "₹" + Math.round(value)}
  //     </div>
  //   )
  // }
];
