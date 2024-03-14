import React, { useEffect, useRef, useState } from "react";

import ChartContainer from "components/ChartContainer";
import StatusCard from "components/StatusCard";
import Skeleton from "components/Skeleton";

import Arrow from "assets/images/header/downArrow.svg";
import CardLogo from "assets/images/statusCard/statusCardImage.svg";
import CardLogo2 from "assets/images/statusCard/statusCardImage2.svg";
import CardLogo3 from "assets/images/statusCard/statusCardImage3.svg";
import CardLogo4 from "assets/images/statusCard/statusCardImage4.svg";
import LossArrow from "assets/images/statusCard/lossArrow.svg";
import ProfitArrow from "assets/images/statusCard/profitArrow.svg";

import "./dashboardModule.scss";

const DashboardModule = ({
  moduleTitle,
  onClick,
  chartBtn,
  loading,
  index,
  isOpen,
  data,
  checkCount,
  setCheckCount
}) => {
  const moduleRef = useRef();

  const chartData = data?.trend_chart;
  const summaryData = data?.summary;
  const currency = data?.summary?.currency;

  const [cardData, setCardData] = useState([
    {
      id: 1,
      keyword: "transaction_volume",
      title: "Transaction volume",
      titleColor: "#677787",
      value: "0",
      valueColor: "#3A4243",
      trend: "2.5%",
      background: "#FFF",
      cardLogo: CardLogo,
      arrow: LossArrow
    },
    {
      id: 2,
      keyword: "time_saved",
      title: "time saved",
      titleColor: "#677787",
      value: "0h",
      valueColor: "#3A4243",
      trend: "70.5%",
      background: "#FFF",
      cardLogo: CardLogo2,
      arrow: ProfitArrow
    },
    {
      id: 3,
      keyword: "cost_saved",
      title: "cost saved",
      titleColor: "#677787",
      value: "0",
      valueColor: "#3A4243",
      trend: "70.5%",
      background: "#FFF",
      cardLogo: CardLogo3,
      arrow: ProfitArrow
    },
    {
      id: 4,
      keyword: "touchless",
      title: "touchless %",
      titleColor: "#677787",
      value: "0",
      valueColor: "#3A4243",
      trend: "70.5%",
      background: "#FFF",
      cardLogo: CardLogo4,
      arrow: ProfitArrow
    }
  ]);
  // Formats a given value as Indian currency.
  const formatIndianCurrency = (value, currency) => {
    if (isNaN(value)) {
      return "";
    }

    if (value > 99999 && value <= 999999) {
      const checkedNumber =
        new Intl.NumberFormat("es-US", {
          style: "currency",
          currency: currency,
          maximumFractionDigits: 0
        }).format(value / 1000) + "k";

      return checkedNumber.replace("INR", "₹");
    } else if (value > 999999) {
      const formattedNumber =
        new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: currency,
          maximumFractionDigits: 0
        }).format(value / 1000000) + "M";

      return formattedNumber.replace("INR", "₹");
    }

    const formattedNumber = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0
    }).format(value);

    return formattedNumber;
  };

  // useEffect hook that updates the card data based on the summary data.
  useEffect(() => {
    const updatedData = cardData.map((card) => {
      const keyword = card.keyword;
      const apiInfo = summaryData ? summaryData[keyword] : "";

      if (apiInfo) {
        let updatedValue = apiInfo.value;
        const updatedTrend = `${apiInfo.trend}%`;

        if (keyword === "cost_saved") {
          updatedValue = formatIndianCurrency(
            apiInfo.value,
            summaryData?.currency
          );
        } else if (keyword === "touchless") {
          updatedValue = `${Math.floor(apiInfo.value)}%`;
        } else if (keyword === "time_saved") {
          updatedValue = `${Math.floor(apiInfo.value / 60)}h`;
        }

        return {
          ...card,
          value: updatedValue,
          trend: updatedTrend
        };
      }

      return card;
    });
    setCardData(updatedData);
  }, [summaryData]);

  useEffect(() => {
    index > 0 && setCheckCount(true);
  }, []);

  return (
    <div className="module">
      <div
        className={`moduleTitle ${checkCount && "moduleTitleActive"}`}
        onClick={() => onClick(index)}
      >
        {loading ? (
          <Skeleton height={"24"} width={"130px"} />
        ) : (
          <h3>{moduleTitle}</h3>
        )}
        {!loading && <label></label>}
        {checkCount ? (
          <span
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
            }}
          >
            {!loading && <img src={Arrow} alt="Arrow" />}
          </span>
        ) : (
          ""
        )}
      </div>

      <div
        className="moduleData"
        style={{
          height: isOpen ? moduleRef?.current?.scrollHeight + "px" : "0"
        }}
        ref={moduleRef}
      >
        <div className="moduleDataCards">
          {cardData?.map((item, i) => (
            <StatusCard
              key={i}
              value={item}
              colored={false}
              loading={loading}
            />
          ))}
        </div>

        <ChartContainer
          chartBtn={chartBtn}
          chartData={chartData}
          loading={loading}
          currency={currency}
        />
      </div>
    </div>
  );
};

export default DashboardModule;
