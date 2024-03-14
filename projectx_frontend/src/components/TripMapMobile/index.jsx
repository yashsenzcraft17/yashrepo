import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow
} from "@react-google-maps/api";
import { DirectionsRenderer } from "@react-google-maps/api";
import { getRoundedValue } from "utils/numbers";

import circleMarker from "assets/images/map/circleMarker.svg";
import mapStartPoint from "assets/images/map/originPin.svg";
import mapEndPoint from "assets/images/map/pinLocation.svg";
import toolTipImage from "assets/images/map/toolTipImage.svg";

const containerStyle = {
  width: "100%",
  height: "100%"
};

const TripMapMobile = ({ waypoints, recommendedPoints, route, loading }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBnGIQ1sXS6bcIat5P6KdTYhYUDtVXydos"
  });

  const [map, setMap] = React.useState(null);
  const [directions, setDirections] = useState("");
  const [selectedMarker, setSelectedMarker] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.setZoom(100);
    // map.fitBounds(bounds);

    setMap(map);
  }, []);

  const directionsCallback = (response) => {
    if (response !== null && response.status === "OK") {
      setDirections(response);
    } else {
      console.error("Error fetching directions", response);
    }
  };

  useEffect(() => {
    if (isLoaded && map && !loading) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: {
            lat: Number(route?.origin?.lat_value),
            lng: Number(route?.origin?.long_value)
          },
          destination: {
            lat: Number(route?.destination?.lat_value),
            lng: Number(route?.destination?.long_value)
          },
          travelMode: window.google.maps.TravelMode.DRIVING,
          waypoints: waypoints?.slice(0, 20).map((wp) => {
            return {
              location: {
                lat: Number(wp?.lat_value),
                lng: Number(wp?.long_value)
              }
            };
          })
        },
        directionsCallback
      );
    }
  }, [isLoaded, map, waypoints, loading]);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const mapOptions = {
    streetViewControl: false,
    fullscreenControl: false
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };
  console.log({ waypoints, recommendedPoints, route, loading });
  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      // center={center}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptions}
    >
      {directions && (
        <>
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true
              // markerOptions: {
              //   icon: {
              //     url: circleMarker,
              //     scaledSize: new window.google.maps.Size(30, 30),
              //     origin: new window.google.maps.Point(0, 0),
              //     anchor: new window.google.maps.Point(15, 15)
              //   }
              // }
            }}
          />
        </>
      )}

      {recommendedPoints?.slice(0, 20).map((wp, i) => {
        // console.log(wp);
        return (
          <Marker
            key={i}
            position={{
              lat: Number(wp?.lat_value),
              lng: Number(wp?.long_value)
            }}
            onClick={() =>
              handleMarkerClick({
                lat: Number(wp?.lat_value),
                lng: Number(wp?.long_value)
              })
            }
            icon={{
              url: circleMarker,
              scaledSize: new window.google.maps.Size(20, 20),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15)
            }}
          />
        );
      })}

      {/* Marker for start point */}
      <Marker
        position={{
          lat: Number(route?.origin?.lat_value),
          lng: Number(route?.origin?.long_value)
        }}
        onClick={() =>
          handleMarkerClick({
            lat: Number(route?.origin?.lat_value),
            lng: Number(route?.origin?.long_value)
          })
        }
        icon={{
          url: mapStartPoint,
          scaledSize: new window.google.maps.Size(32, 32),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(15, 15)
        }}
      >
        {/* InfoWindow for start point */}
        {selectedMarker &&
          selectedMarker.lat === Number(route?.origin?.lat_value) &&
          selectedMarker.lng === Number(route?.origin?.long_value) && (
            <InfoWindow
              position={selectedMarker}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                <div className="mapTooltipBodyText">
                  <h4>Origin</h4>
                  <p>
                    {route?.origin?.description
                      ?.toLowerCase()
                      .replace(/\b(\w)/g, (x) => x.toUpperCase())
                      .trim()}
                  </p>
                </div>
              </div>
            </InfoWindow>
          )}
      </Marker>

      {/* Marker for end point */}
      <Marker
        position={{
          lat: Number(route?.destination?.lat_value),
          lng: Number(route?.destination?.long_value)
        }}
        onClick={() =>
          handleMarkerClick({
            lat: Number(route?.destination?.lat_value),
            lng: Number(route?.destination?.long_value)
          })
        }
        icon={{
          url: mapEndPoint,
          scaledSize: new window.google.maps.Size(32, 32),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(15, 15)
        }}
      >
        {/* InfoWindow for end point */}
        {selectedMarker &&
          selectedMarker.lat === Number(route?.destination?.lat_value) &&
          selectedMarker.lng === Number(route?.destination?.long_value) && (
            <InfoWindow
              position={selectedMarker}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                <div className="mapTooltipBodyText">
                  <h4>Destination</h4>
                  <p>
                    {route?.destination?.description
                      ?.toLowerCase()
                      .replace(/\b(\w)/g, (x) => x.toUpperCase())
                      .trim()}
                  </p>
                </div>
              </div>
            </InfoWindow>
          )}
      </Marker>

      {recommendedPoints?.map((item, i) => {
        const markerPosition = {
          lat: Number(item?.lat_value),
          lng: Number(item?.long_value)
        };

        return (
          selectedMarker &&
          selectedMarker.lat === markerPosition.lat &&
          selectedMarker.lng === markerPosition.lng && (
            <InfoWindow
              key={i}
              position={selectedMarker}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                <div className="mapTooltipHead">
                  <img src={toolTipImage} alt="toolTipImage" />
                  <div className="mapTooltipHeadText">
                    <h3>{item.fuel_station}</h3>
                    <p>{item.location}</p>
                  </div>
                </div>

                <div className="mapTooltipBody">
                  <div className="mapTooltipBodyText">
                    <h4>Fuel</h4>
                    <p>{item.fuel}L</p>
                  </div>
                  <div className="mapTooltipBodyText">
                    <h4>Total Cost</h4>
                    <p>{getRoundedValue(item.total_cost)}</p>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )
        );
      })}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default React.memo(TripMapMobile);
