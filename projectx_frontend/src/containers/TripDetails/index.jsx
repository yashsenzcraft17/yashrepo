import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { EncryptStorage } from "encrypt-storage";

import TripSummary from "components/TripSummary";
import Savings from "components/Savings";
import FuelStops from "components/FuelStops";
import TripMap from "components/TripMap";

import { TRIP_MAP } from "services/apiUrl";
import { getTripDetailData } from "services/tripDetail";
import { getTripDetails } from "services/tripDetails";

import { getWindowWidth } from "utils/window";

import logo from "assets/images/TripListing/greaterThanSymbol.svg";
import goBackLogo from "assets/images/TripListing/goBack.svg";

import "containers/TripDetails/tripDetails.scss";

const TripDetails = () => {
  const { tripId } = useParams();
  const decodedTripId = decodeURIComponent(tripId);

  const encryptStorage = new EncryptStorage("senzcraft123#", {
    prefix: ""
  });

  const [tripDetails, setTripDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [recommendedPoints, setRecommendedPoints] = useState([]);
  const [route, setRoute] = useState({ origin: "", destination: "" });
  const [waypoints, setWaypoints] = useState([]);
  const [savingsData, setSavingsData] = useState([]);

  const navigate = useNavigate();

  const token = encryptStorage.getItem("authToken");

  const profileData = encryptStorage.getItem("authData");
  const { data: profileInfo } = profileData;

  useEffect(() => {
    const profileData = encryptStorage.getItem("authData");
    const { data } = profileData;

    const fetchTripDashboardData = async () => {
      const response = await getTripDetails(
        {
          email: data.email,
          role_id: String(data.role_id),
          trip_id: decodedTripId
        },
        token
      );

      if (response?.status === 200) {
        encryptStorage?.setItem("authToken", response?.data?.token);

        setTripDetails(response);

        const receivedSavingsData = response?.data?.data?.savings;
        setSavingsData(receivedSavingsData);

        // setSomethingWrongStatus(false);
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
        setLoading(false);
      }
    };

    const getMapsData = async () => {
      const body = {
        email: profileInfo.email,
        trip_id: decodedTripId,
        record_id: "",
        role_id: String(profileInfo.role_id)
      };

      try {
        const res = await getTripDetailData(TRIP_MAP, body, token);
        setWaypoints(res?.data?.data?.waypoints);
        setRoute({
          origin: res?.data?.data?.origin,
          destination: res?.data?.data?.destination
        });
        setRecommendedPoints(res?.data?.data?.recommendation);
        setMapLoading(false);

        if (res?.status === 401) {
          toast.error(
            <>
              <span className="formAPIError">
                {res?.data?.err_msg ||
                  "Session Expired, Redirecting to login page"}
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
          navigate("/");
          setMapLoading(false);
        }

        if (res?.response?.status === 500) {
          setMapLoading(false);
          // toast.error(
          //   <>
          //     <span className="formAPIError">{res?.data?.err_msg || ""}</span>
          //     <span className="formAPIError">
          //       {res?.data?.err_msg ||
          //         "Session Expired, Redirecting to login page"}
          //     </span>
          //   </>,
          //   {
          //     position:
          //       getWindowWidth() <= 768
          //         ? toast.POSITION.BOTTOM_CENTER
          //         : toast.POSITION.TOP_RIGHT,
          //     toastId: "abc"
          //   }
          // );
        }
      } catch (error) {
        setMapLoading(false);
      }
    };

    getMapsData();
    fetchTripDashboardData();
  }, [decodedTripId]);

  const commonCurrency = tripDetails?.data?.data?.currency;
  const savingsCurrency = tripDetails?.data?.data?.savings?.currency;

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
      currency: commonCurrency || defaultCurrencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
      notation: "compact"
    });
    const million = formatter.format(roundedValue);

    return million;
  };

  // getFormattedDistance
  const getFormattedDistance = (numericValue) => {
    // Check if the numericValue is not provided or is not a valid number
    if (
      isNaN(numericValue) ||
      numericValue === null ||
      numericValue === undefined ||
      numericValue === ""
    ) {
      return "-";
    }
    const roundedValue = Math.round(numericValue);

    const formatter = Intl.NumberFormat("en", {
      minimumFractionDigits: 0,
      maximumFractionDigits: roundedValue % 1 === 0 ? 0 : 2
    });

    const formattedDistance = formatter.format(roundedValue);

    return `${formattedDistance} km`;
  };

  // getFormattedCapacity
  const getFormattedCapacity = (numericValue) => {
    // Check if the numericValue is not provided or is not a valid number
    if (
      isNaN(numericValue) ||
      numericValue === null ||
      numericValue === undefined ||
      numericValue === ""
    ) {
      return "-";
    }

    const roundedValue = Math.round(numericValue);

    const formatter = Intl.NumberFormat("en", {
      minimumFractionDigits: 0,
      maximumFractionDigits: roundedValue % 1 === 0 ? 0 : 2
    });

    const formattedCapacity = formatter.format(roundedValue);

    return `${formattedCapacity} L`;
  };

  // getFormattedFuelEfficiency
  const getFormattedFuelEfficiency = (numericValue) => {
    // Check if the numericValue is not provided or is not a valid number
    if (
      isNaN(numericValue) ||
      numericValue === null ||
      numericValue === undefined ||
      numericValue === ""
    ) {
      return "-";
    }
    const roundedValue = Math.round(numericValue);

    const formatter = Intl.NumberFormat("en", {
      minimumFractionDigits: 0,
      maximumFractionDigits: roundedValue % 1 === 0 ? 0 : 2
    });

    const formattedEfficiency = formatter.format(roundedValue);

    return `${formattedEfficiency} Km/L`;
  };

  // getFormattedFuelLiter
  const getFormattedFuelLiter = (numericValue) => {
    // Check if the numericValue is not provided or is not a valid number
    if (
      isNaN(numericValue) ||
      numericValue === null ||
      numericValue === undefined ||
      numericValue === ""
    ) {
      return "-";
    }
    const roundedValue = Math.round(numericValue);

    const formatter = Intl.NumberFormat("en", {
      minimumFractionDigits: 0,
      maximumFractionDigits: roundedValue % 1 === 0 ? 0 : 2
    });

    const formattedEfficiency = formatter.format(roundedValue);

    return `${formattedEfficiency} L / hour`;
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

  return (
    <>
      <div className="trip">
        <div className="tripDetailsBreadCrumbsMobile">
          <Link to={"/tripListing"}>
            <img src={goBackLogo} alt="goBackLogo" />
          </Link>
          <h4>Trip Details</h4>
        </div>

        <div className="tripDetailsBreadCrumbs">
          <div className="tripDetailsBreadCrumbsContent">
            <Link to={"/tripListing"}>
              <span className="tripDetailsBreadCrumbsData">Trip Listing</span>{" "}
            </Link>
            <img src={logo} alt="logo" />
            <label>Trip Details</label>
          </div>
          <div className="tripDetailsBreadCrumbsPara">
            <p>Trip Details</p>
          </div>
        </div>

        <div className="tripSection">
          <div className="tripDetails">
            <TripSummary
              summaryData={tripDetails?.data?.data?.summary}
              getRoundedValue={getRoundedValue}
              getFormattedCapacity={getFormattedCapacity}
              getFormattedFuelEfficiency={getFormattedFuelEfficiency}
              getFormattedDistance={getFormattedDistance}
              getFormattedFuelLiter={getFormattedFuelLiter}
              loading={loading}
              recommendedPoints={recommendedPoints}
              route={route}
              waypoints={waypoints}
            />
            {profileInfo?.role_name === "Fleet Manager" && !!savingsData && (
              <Savings
                savingsData={savingsData}
                getRoundedValue={getRoundedValue}
                getFormattedCapacity={getFormattedCapacity}
                getRoundedPercentage={getRoundedPercentage}
                loading={loading}
              />
            )}
            <FuelStops
              fuelStopsData={tripDetails?.data?.data?.recommendations}
              currencySymbol={savingsCurrency}
              loading={loading}
            />
          </div>
          <div className="tripRouteMap">
            <TripMap
              recommendedPoints={recommendedPoints}
              route={route}
              waypoints={waypoints}
              loading={mapLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TripDetails;
