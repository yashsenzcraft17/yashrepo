import React, { useEffect, useState } from "react";
import "jspdf-autotable";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { toast } from "react-toastify";
import { EncryptStorage } from "encrypt-storage";
import { format, isValid, subYears } from "date-fns";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";

import StatusCard from "components/StatusCard";
import DashboardHeader from "components/DashboardHeader";
import LoadChart from "components/LoadChart";
import TripChart from "components/TripChart";
import ReeferChart from "components/ReeferChart";
import FuelChart from "components/FuelChart";
import RouteTable from "components/RouteTable";
import RouteTableMobile from "components/RouteTableMobile";
import { getTripDashboardData } from "services/tripDashboard";
import { exportExcel } from "services/excelSheet";

import { getWindowWidth } from "utils/window";

import CardLogo from "assets/images/statusCard/statusCardImg.svg";
import CardLogo2 from "assets/images/statusCard/statusCardImg2.svg";
import CardLogo3 from "assets/images/statusCard/statusCardImg3.svg";
import CardLogo4 from "assets/images/statusCard/statusCardImg4.svg";
import LossArrow from "assets/images/statusCard/lossArrow.svg";
import ProfitArrow from "assets/images/statusCard/profitArrow.svg";
import OopsErrorImg from "assets/images/PageNotFound/oopsError.png";
import Logo from "assets/images/header/logo.svg";

import "containers/TripDashboard/tripDashboard.scss";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const TripDashboard = () => {
  const currentDate = new Date();
  const lastYearDate = subYears(currentDate, 1);
  const formatDate = (date) => format(date, "yyyy-MM-dd");

  const [loading, setLoading] = useState(true);
  const [somethingWrongStatus, setSomethingWrongStatus] = useState(false);
  const [exportLoading, setExportLoading] = useState(true);
  const [filterDate, setFilterDate] = useState({
    startDate: formatDate(lastYearDate),
    endDate: formatDate(currentDate)
  });
  const [oldFilterDate, setOldFilterDate] = useState({});

  const [storeResponse, setStoreResponse] = useState({});
  const [openExport, setOpenExport] = useState(false);
  const [exportDate, setExportDate] = useState([]);

  const encryptStorage = new EncryptStorage("senzcraft123#", {
    prefix: ""
  });

  // Function to change the first letter capital and remaining small
  const formatHeader = (header) => {
    if (header === "cost_saved") {
      return "Cost Saved";
    }
    if (header === "sl_no") {
      return "Sl . No";
    }

    const words = header?.split("_");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalizedWords.join(" ");
  };

  const startDate = exportDate[0]?.startDate
    ? new Date(exportDate[0]?.startDate)
    : null;
  const endDate = exportDate[0]?.endDate
    ? new Date(exportDate[0]?.endDate)
    : null;

  const isStartDateValid = isValid(startDate);
  const isEndDateValid = isValid(endDate);

  const formattedDate = isStartDateValid
    ? format(startDate, "yyyy-MM-dd")
    : "-";

  const formattedEndDate = isEndDateValid ? format(endDate, "yyyy-MM-dd") : "-";

  const navigate = useNavigate();

  const token = encryptStorage.getItem("authToken");
  const profileData = encryptStorage.getItem("authData");
  const { data } = profileData;

  // useEffect hook that fetches trip dashboard data when the filterDate dependency changes.
  useEffect(() => {
    const fetchTripDashboardData = async () => {
      setLoading(true);

      const isFilterDateChanged =
        filterDate.startDate !== oldFilterDate.startDate ||
        filterDate.endDate !== oldFilterDate.endDate;

      if (isFilterDateChanged) {
        const response = await getTripDashboardData(
          {
            email: data.email,
            start_date: filterDate.startDate,
            end_date: filterDate.endDate,
            role_id: String(data.role_id)
          },
          token
        );

        if (response?.status === 200) {
          setStoreResponse(response?.data?.data);
          encryptStorage?.setItem("authToken", response?.data?.token);
          setSomethingWrongStatus(false);
          setLoading(false);
        }

        if (response?.response?.status === 401) {
          toast.error(
            <>
              <span className="formAPIError">
                {response?.response?.data?.err_msg}
              </span>
            </>,
            {
              position:
                getWindowWidth() <= 768
                  ? toast.POSITION.BOTTOM_CENTER
                  : toast.POSITION.TOP_RIGHT,
              toastId: "abc"
            }
          );

          localStorage.clear();
          navigate("/", { replace: true });
          return;
        }

        setLoading(false);
        setOldFilterDate({ ...filterDate });
      } else {
        setLoading(false);
      }
    };

    fetchTripDashboardData();
  }, [filterDate]);

  // Make the text capital after space
  const capitalizeAfterSpace = (text) => {
    if (typeof text !== "string") {
      return text; // Return unchanged if not a string
    }

    return text
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // make capital for eachWord
  const capitalizeEachWord = (str) => {
    return str
      ?.split(" ")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1)?.toLowerCase();
      })
      .join(" ");
  };

  const currencySymbol = storeResponse?.summary?.currency;

  // getTheRoundedValue
  const getRoundedValue = (numericValue) => {
    if (
      isNaN(numericValue) ||
      numericValue === null ||
      numericValue === undefined ||
      numericValue === ""
    ) {
      return "-";
    }

    if (numericValue === 0) {
      return "0";
    }

    const defaultCurrencyCode = "INR";
    const absoluteValue = Math.abs(numericValue);
    const roundedValue = Math.round(absoluteValue);

    const formatter = Intl.NumberFormat("en", {
      style: "currency",
      currency: currencySymbol || defaultCurrencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
      notation: "compact"
    });
    const million = formatter.format(roundedValue);

    return million;
  };

  // getRoundedPercentageValue
  const getRoundedPercentage = (numericValue) => {
    const absoluteValue = Math.abs(numericValue);
    const roundedValue = Math.round(absoluteValue);

    const formatter = Intl.NumberFormat("en", {
      style: "percent",
      minimumFractionDigits: 0,
      maximumFractionDigits: roundedValue % 1 === 0 ? 0 : 2
    });

    const percentage = formatter.format(roundedValue / 100);

    return percentage;
  };

  // getFormattedDistance
  const getFormattedDistance = (numericValue) => {
    const roundedValue = Math.round(numericValue);

    const formatter = Intl.NumberFormat("en", {
      minimumFractionDigits: 0,
      maximumFractionDigits: roundedValue % 1 === 0 ? 0 : 2
    });

    const formattedDistance = formatter.format(roundedValue);

    return `${formattedDistance} km`;
  };

  const formatNumericValue = (numericValue) => {
    if (
      isNaN(numericValue) ||
      numericValue === null ||
      numericValue === undefined ||
      numericValue === ""
    ) {
      return "-";
    }

    return numericValue;
  };

  const finalData = [
    {
      id: 1,
      title: "No. OF Trips",
      value: formatNumericValue(storeResponse?.summary?.no_of_trips?.value),
      progress: "10%",
      progressColor: "#DA0000",
      background:
        "linear-gradient(70deg, #D148ED -2.45%, #FB56E5 105.86%), #FFF",
      cardLogo: CardLogo,
      arrow: LossArrow,
      trend: storeResponse?.summary?.no_of_trips?.trend,
      bgClass: "tripsColor"
    },
    {
      id: 2,
      title: "fuel cost saved",
      value: getRoundedValue(
        storeResponse?.summary?.cost_saved?.value,
        "cost_saved"
      ),
      progress: "70.5%",
      progressColor: "#31A93E",
      background: "linear-gradient(250deg, #82A6ED -20.05%, #667DF4 104.72%)",
      cardLogo: CardLogo2,
      arrow: ProfitArrow,
      trend: storeResponse?.summary?.cost_saved?.trend,
      bgClass: "fuelColor"
    },
    {
      id: 3,
      title: "Completed trips",
      value: formatNumericValue(storeResponse?.summary?.completed_trips?.value),
      progress: "70.5%",
      progressColor: "#31A93E",
      background: "linear-gradient(68deg, #4FA8EE -10.81%, #55BADE 114.37%)",
      cardLogo: CardLogo3,
      arrow: ProfitArrow,
      trend: storeResponse?.summary?.completed_trips?.trend,
      bgClass: "completedColor"
    },
    {
      id: 4,
      title: "ongoing trips",
      value: formatNumericValue(storeResponse?.summary?.ongoing_trips?.value),
      progress: "70.5%",
      progressColor: "#31A93E",
      background:
        "linear-gradient(70deg, #ED4E9F -20.72%, #FC6D7A 101.99%), #FFF",
      cardLogo: CardLogo4,
      arrow: ProfitArrow,
      trend: storeResponse?.summary?.ongoing_trips?.trend,
      bgClass: "ongoingColor"
    }
  ];

  // Handles the export button click event and initiates the export process.
  const exportClickedXL = async () => {
    setExportLoading(false);
    setOpenExport(false);
    const XLData = await exportExcel(
      {
        email: data?.email,
        start_date: formattedDate,
        end_date: formattedEndDate,
        role_id: String(data?.role_id)
      },
      token
    );
    setExportLoading(true);
    downloadExcel(XLData?.data?.data);
  };

  // Downloads an Excel file with the provided data.
  function downloadExcel(data) {
    const litreSymbol = "Ltrs";
    const currencySymbol = data?.length > 0 ? data[0].currency : "INR";

    if (data?.length > 0) {
      let today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();

      today = dd + "/" + mm + "/" + yyyy;
      const name = today;
      const tableToExport = data.map((row) => ({
        ID: row?.trip_id,
        "Start Date": row?.start_date,
        "Route Code": row?.route_code,
        "Route Description": row?.route_desc,
        "Load Type": row?.load_type,
        [`Rec. Fuel Vol (${litreSymbol})`]: row?.fuel_vol,
        [`Rec. Fuel Price (${currencySymbol})`]: row?.cost
      }));

      if (tableToExport?.length) {
        const headers = [
          "Trip ID",
          "Start Date",
          "Route Code",
          "Route Description",
          "Load Type",
          `Rec. Fuel Vol (${litreSymbol})`,
          `Rec. Fuel Price (${currencySymbol})`
        ];

        const columnWidths = [22, 18, 11, 23, 25, 18, 18];

        // Generate rowHeights dynamically based on the number of rows
        const rowHeights = Array(tableToExport.length).fill(20);

        const headerHeight = 25;

        createExcel(
          tableToExport,
          "trip_data" + name + ".xlsx",
          headers,
          columnWidths,
          rowHeights,
          headerHeight
        );
      }
    } else {
      toast.error(
        <>
          <span className="formErrorMsg">No Data Found</span>
        </>,
        {
          position:
            getWindowWidth() <= 768
              ? toast.POSITION.BOTTOM_CENTER
              : toast.POSITION.TOP_RIGHT,
          toastId: "1"
        }
      );
    }
  }

  // Creates an Excel file with the given data and saves it with the specified file name.
  const createExcel = (
    data,
    fileName,
    headers,
    columnWidths,
    rowHeights,
    headerHeight
  ) => {
    const worksheet = XLSX?.utils?.book_new();

    // Adding headers with width
    if (headers && headers.length > 0) {
      XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

      // Set column widths
      if (columnWidths && columnWidths.length === headers.length) {
        worksheet["!cols"] = columnWidths.map((width) => ({ wch: width }));
      }
    }

    // Set header height
    if (headerHeight) {
      worksheet["!rows"] = worksheet["!rows"] || [];
      worksheet["!rows"][0] = { hpt: headerHeight, hpx: headerHeight * 0.75 };
    }

    // Set row heights
    if (rowHeights && rowHeights.length > 0) {
      rowHeights.forEach((height, index) => {
        worksheet["!rows"] = worksheet["!rows"] || [];
        worksheet["!rows"][index + 1] = { hpt: height, hpx: height * 0.75 };
      });
    }

    XLSX.utils?.sheet_add_json(worksheet, data, {
      origin: "A2",
      skipHeader: true
    });

    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = XLSX?.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true
    });
    const finalData = new Blob([excelBuffer], { type: "xlsx" });
    saveAs(finalData, fileName ?? "Invoice.xlsx");
  };

  // Export multiple charts to a PDF document.
  async function exportMultipleChartsToPdf() {
    setExportLoading(false);
    setOpenExport(false);
    const doc = new jsPDF("p", "px");

    const elements = document.getElementsByClassName("custom-chart");

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    // const hh = String(today.getHours()).padStart(2, "0");
    // const min = String(today.getMinutes()).padStart(2, "0");

    today = `${dd}/${mm}/${yyyy}`;

    const logoDataUrl = await getImageDataUrl(Logo);

    await createPdf({
      doc,
      elements,
      // heading: `${today} - ${hh}:${min}`,
      heading: `Filtered date: ${filterDate?.startDate} - ${filterDate?.endDate}`,
      logoDataUrl
    });

    doc.save("trip_data" + today + ".pdf");
  }

  // Function to convert image to data URL
  async function getImageDataUrl(imageSrc) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const dataUrl = canvas.toDataURL("image/png");
        resolve(dataUrl);
      };
      img.src = imageSrc;
    });
  }

  // Creates a PDF document with the given elements, heading, and logo data URL.
  async function createPdf({ doc, elements, heading, logoDataUrl }) {
    let top = 17.9;
    const padding = 2.5;
    const spaceBetweenRows = 10; // Adjust the value as needed

    for (let i = 0; i < elements?.length; i++) {
      const el = elements.item(i);

      const scale = el.classList.contains("custom-chart")
        ? window.innerWidth >= 768
          ? 0.35
          : 0.31
        : 1;

      // Check if a heading is provided and add it at the top of each page
      if (i === 0 && heading) {
        if (window.innerWidth < 768) {
          // Add heading
          doc.setFontSize(10);
          doc.setTextColor(23, 27, 28);

          const pageWidth = doc.internal.pageSize.getWidth();
          // Align the heading to the right side
          const headingWidth =
            doc.getStringUnitWidth(heading) * doc.internal.getFontSize();
          doc.text(pageWidth - headingWidth - padding, top - 5, heading);

          top += 10; // Increase top to leave space below the heading
        }

        if (logoDataUrl) {
          const logoWidth = 50;
          const logoHeight = 20;

          doc.addImage(
            logoDataUrl,
            "png",
            padding,
            top - 5,
            logoWidth,
            logoHeight
          );
          top += logoHeight + 5;
        }
      }

      let elHeight = el.offsetHeight * scale - padding;
      let elWidth = el.offsetWidth * scale - padding;

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Check if the element exceeds the current page height
      if (top + elHeight > pageHeight) {
        doc.addPage();
        top = 5;

        // Add the heading at the top of each new page
        if (heading) {
          doc.setFontSize(14);
          doc.setTextColor(0, 0, 0);
          const headingWidth =
            doc.getStringUnitWidth(heading) * doc.internal.getFontSize();
          doc.text(pageWidth - headingWidth - padding, top - 5, heading);
          top += 10; // Increase top to leave space below the heading
        }
      }

      // Check if the element width exceeds the page width
      if (elWidth > pageWidth) {
        elWidth = pageWidth - padding;
      }

      if (elHeight > pageHeight) {
        elHeight = pageHeight - padding;
      }

      if (el.classList.contains("custom-chart")) {
        // Convert Chart.js chart to image using html2canvas
        const chartImage = await html2canvas(el);
        const chartDataUrl = chartImage.toDataURL("image/png");

        // Add the chart image to the PDF
        doc.addImage(
          chartDataUrl,
          "PNG",
          padding,
          top,
          elWidth,
          elHeight,
          `image${i}`
        );
      } else {
        // For non-chart elements, continue using existing code
        const imgData = await htmlToImage.toPng(el);

        doc.addImage(
          imgData,
          "PNG",
          padding,
          top,
          elWidth,
          elHeight,
          `image${i}`
        );
      }

      top += elHeight + padding + spaceBetweenRows;
    }
    setExportLoading(true);
  }

  return (
    <React.Fragment>
      <DashboardHeader
        exportClicked={exportMultipleChartsToPdf}
        exportClickedXL={exportClickedXL}
        title={"Trip Dashboard"}
        setFilterDate={setFilterDate}
        exportLoading={exportLoading}
        setOpenExport={setOpenExport}
        openExport={openExport}
        setExportDate={setExportDate}
      />
      <section className="tripDashboard">
        <div
          className="tripDashboardCard custom-chart"
          style={{ paddingBottom: "20px" }}
        >
          {finalData?.map((item, i) => (
            <StatusCard
              value={item}
              key={i}
              loading={loading}
              getRoundedPercentage={getRoundedPercentage}
              // style={{ paddingBottom: "20px" }}
            />
          ))}
        </div>

        <div className="lineChartContainer custom-chart">
          <TripChart
            getWindowWidth={getWindowWidth}
            loading={loading}
            filterDate={filterDate}
          />
          <FuelChart
            getWindowWidth={getWindowWidth}
            loading={loading}
            filterDate={filterDate}
          />
        </div>

        <div className="dashboardRouteTable custom-chart">
          <div className="tripDashboardTableRoute">
            <LoadChart
              getWindowWidth={getWindowWidth}
              loading={loading}
              chartData={storeResponse?.chart?.load_type_chart}
            />
            <ReeferChart
              getWindowWidth={getWindowWidth}
              loading={loading}
              chartData={storeResponse?.chart?.reefer_chart}
            />
          </div>

          <div className="tripDashboardTableSecond">
            {getWindowWidth() <= 768 ? (
              <RouteTableMobile
                getRoundedValue={getRoundedValue}
                storeResponse={storeResponse}
                getFormattedDistance={getFormattedDistance}
                getRoundedPercentage={getRoundedPercentage}
              />
            ) : (
              <RouteTable
                getRoundedValue={getRoundedValue}
                storeResponse={storeResponse}
                loading={loading}
                capitalizeAfterSpace={capitalizeAfterSpace}
                formatHeader={formatHeader}
                capitalizeEachWord={capitalizeEachWord}
                getFormattedDistance={getFormattedDistance}
                getRoundedPercentage={getRoundedPercentage}
              />
            )}
          </div>
        </div>

        {somethingWrongStatus && (
          <div className="somethingWrong">
            <img src={OopsErrorImg} alt="OopsErrorImg" />
            <h3>Oops, Something went wrong!</h3>
          </div>
        )}
      </section>
    </React.Fragment>
  );
};

export default TripDashboard;
