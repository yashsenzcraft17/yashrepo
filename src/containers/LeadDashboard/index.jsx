import React, { useEffect, useState } from "react";
import { format, subYears } from "date-fns";
import "jspdf-autotable";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { EncryptStorage } from "encrypt-storage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

import { getLeadDashboardData } from "services/leadDashboard";

import DashboardHeader from "components/DashboardHeader";
import StatusCard from "components/StatusCard";

import LeadCaptured from "components/Charts/LeadCaptured/index";
import ChannelVsLead from "components/Charts/ChannelVsLead/index";
import LeadStatus from "components/Charts/LeadStatus/index";
import LeadType from "components/Charts/LeadType/index";
import AgeingLeads from "components/Charts/AgeingLeads/index";
import TouchlessChart from "components/Charts/LeadTouchless/index";

import { getWindowWidth } from "utils/window";
import { leadXlExportData } from "services/leadXLSheet";

import CardLogo from "assets/images/statusCard/leads.svg";
import CardLogo2 from "assets/images/statusCard/postedLeads.svg";
import CardLogo3 from "assets/images/statusCard/postedLeadPerc.svg";
import CardLogo4 from "assets/images/statusCard/ageing.svg";
import LossArrow from "assets/images/statusCard/lossArrow.svg";
import ProfitArrow from "assets/images/statusCard/profitArrow.svg";
import Logo from "assets/images/header/logo.svg";

import "containers/LeadDashboard/leadDashboard.scss";

const LeadDashboard = () => {
  const currentDate = new Date();
  const lastYearDate = subYears(currentDate, 1);
  const formatDate = (date) => format(date, "yyyy-MM-dd");

  const [leadResponse, setLeadResponse] = useState({});
  const [filterDate, setFilterDate] = useState({
    startDate: formatDate(lastYearDate),
    endDate: formatDate(currentDate)
  });
  const [exportLoading, setExportLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [openExport, setOpenExport] = useState(false);
  // const [leadData, setLeadData] = useState({});
  // const currencySymbol = storeResponse?.summary?.currency;
  const currencySymbol = "INR";
  // getTheRoundedValue
  const getRoundedValue = (numericValue, value) => {
    if (
      isNaN(numericValue) ||
      numericValue === null ||
      numericValue === undefined ||
      numericValue === ""
    ) {
      return "-";
    }

    if (value === 0) {
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

  const encryptStorage = new EncryptStorage("senzcraft123#", {
    prefix: ""
  });

  const token = encryptStorage.getItem("authToken");
  const profileData = encryptStorage.getItem("authData");
  const { data } = profileData;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommonDashboardData = async () => {
      const response = await getLeadDashboardData(
        {
          email: data?.email,
          start_date: filterDate?.startDate,
          end_date: filterDate?.endDate,
          role_id: String(data?.role_id)
        },
        token
      );

      if (response?.status === 200) {
        setLeadResponse(response?.data?.data);
        encryptStorage?.setItem("authToken", response?.data?.token);
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
    };
    fetchCommonDashboardData();
  }, [filterDate]);

  const finalData = [
    {
      id: 1,
      title: "No. OF LEADS",
      value: leadResponse?.summary?.no_of_leads?.value,
      progress: "10%",
      progressColor: "#DA0000",
      background:
        "linear-gradient(70deg, #D148ED -2.45%, #FB56E5 105.86%), #FFF",
      cardLogo: CardLogo,
      arrow: LossArrow,
      trend: leadResponse?.summary?.no_of_leads?.trend === 0 && null,
      bgClass: "tripsColor"
    },
    {
      id: 2,
      title: "No. of Posted Leads",
      value: leadResponse?.summary?.no_of_posted_leads?.value,
      progress: "70.5%",
      progressColor: "#31A93E",
      background: "linear-gradient(250deg, #82A6ED -20.05%, #667DF4 104.72%)",
      cardLogo: CardLogo2,
      arrow: ProfitArrow,
      trend: leadResponse?.summary?.no_of_posted_leads?.trend === 0 && null,
      bgClass: "fuelColor"
    },
    {
      id: 3,
      title: "% Posted Leads",
      value: leadResponse?.summary?.posted_leads?.value + "%",
      progress: leadResponse?.summary?.posted_leads?.value,
      progressColor: "#31A93E",
      background: "linear-gradient(68deg, #4FA8EE -10.81%, #55BADE 114.37%)",
      cardLogo: CardLogo3,
      arrow: ProfitArrow,
      trend: leadResponse?.summary?.posted_leads?.trend === 0 && null,
      bgClass: "completedColor"
    },
    {
      id: 4,
      title: "no. of ageing leads",
      value: leadResponse?.summary?.no_of_ageing?.value,

      progress: getRoundedValue(
        leadResponse?.summary?.no_of_ageing?.value,
        "cost_saved"
      ),
      progressColor: "#31A93E",
      background:
        "linear-gradient(70deg, #ED4E9F -20.72%, #FC6D7A 101.99%), #FFF",
      cardLogo: CardLogo4,
      arrow: ProfitArrow,
      trend: leadResponse?.summary?.no_of_ageing?.trend === 0 && null,
      bgClass: "ongoingColor"
    }
  ];

  const getRoundedPercentage = (numericValue = 10.2) => {
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

    doc.save("lead_data_" + today + ".pdf");
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

  async function createPdf({ doc, elements, heading, logoDataUrl }) {
    let top = 17.9;
    const padding = 2.5;
    const spaceBetweenRows = 10; // Adjust the value as needed

    for (let i = 0; i < elements.length; i++) {
      const el = elements.item(i);

      const scale = el.classList.contains("custom-chart")
        ? window.innerWidth >= 768
          ? 0.35
          : 0.22
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

  const exportClickedXL = async () => {
    setExportLoading(false);
    setOpenExport(false);
    const LeadXLData = await leadXlExportData(
      {
        email: data?.email,
        start_date: filterDate?.startDate,
        end_date: filterDate?.endDate,
        role_id: String(data?.role_id)
      },
      token
    );
    setExportLoading(true);
    downloadExcel(LeadXLData?.data?.data);
  };

  function downloadExcel(data) {
    // const litreSymbol = "Ltrs";
    // const currencySymbol = data?.length > 0 ? data[0].currency : "INR";

    if (data?.length > 0) {
      let today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();

      today = dd + "/" + mm + "/" + yyyy;
      const name = today;
      const tableToExport = data.map((row) => ({
        "Record ID": row?.record_id,
        "Contacted On": row?.contacted_on,
        "Created On": row?.created_on,
        Organization: row?.organization,
        Industry: row?.industry,
        Name: row?.name,
        ["Email"]: row?.email,
        ["Mobile"]: row?.mobile,
        Country: row?.country,
        State: row?.state,
        Zone: row?.zone,
        "Awareness Info": row?.awareness_info,
        "Other Lead Source": row?.other_lead_source,
        Status: row?.lead_capture_status,
        "Product Interest": row?.product_interest,
        "Product Name": row?.product_name,
        "Product Type": row?.product_type,
        Remark: row?.remarks
      }));

      if (tableToExport?.length) {
        const headers = [
          "Record ID",
          "Contacted On",
          "Created On",
          "Organization",
          "Industry",
          "Name",
          "Email",
          "Mobile",
          "Country",
          "State",
          "Zone",
          "Awareness Info",
          "Other Lead Source",
          "Status",
          "Product Interest",
          "Product Name",
          "Product Type",
          "Remark"
        ];

        const columnWidths = [
          10, 12, 12, 40, 10, 28, 28, 15, 15, 15, 15, 15, 15, 15, 12, 12, 12, 35
        ];

        // Generate rowHeights dynamically based on the number of rows
        const rowHeights = Array(tableToExport.length).fill(20);

        const headerHeight = 25;

        createExcel(
          tableToExport,
          "lead_data" + name + ".xlsx",
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

  return (
    <React.Fragment>
      <DashboardHeader
        title={"Lead Dashboard"}
        setFilterDate={setFilterDate}
        exportLoading={exportLoading}
        setOpenExport={setOpenExport}
        openExport={openExport}
        exportClicked={exportMultipleChartsToPdf}
        exportClickedXL={exportClickedXL}
      />
      <section className="leadDashboard custom-chart">
        <div className="leadDashboardCard">
          {finalData?.map((item, i) => (
            <StatusCard
              value={item}
              key={i}
              loading={loading}
              getRoundedPercentage={getRoundedPercentage}
            />
          ))}
        </div>

        <div className="leadChartContainer">
          <LeadCaptured filterDate={filterDate} loading={loading} />
          <ChannelVsLead
            chartData={leadResponse?.chart?.channel_vs_lead}
            loading={loading}
          />
        </div>
        <div className="leadChartContainer">
          <LeadStatus
            chartData={leadResponse?.chart?.lead_by_status}
            loading={loading}
          />
          <TouchlessChart
            chartData={leadResponse?.chart?.touchless}
            loading={loading}
          />
        </div>
        <div className="leadChartContainer">
          <AgeingLeads
            chartData={leadResponse?.chart?.ageing_leads}
            loading={loading}
          />
          <LeadType
            chartData={leadResponse?.chart?.lead_type}
            loading={loading}
          />
        </div>
      </section>
    </React.Fragment>
  );
};

export default LeadDashboard;
