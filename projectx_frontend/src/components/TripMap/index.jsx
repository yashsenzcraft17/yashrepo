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
import mapStartEndPoint from "assets/images/map/pinLocation.svg";
import StartPoint from "assets/images/map/originPin.svg";
import toolTipImage from "assets/images/map/toolTipImage.svg";

import "./tripMap.scss";

const containerStyle = {
  width: "100%",
  height: "100%"
};

const TripMap = ({
  waypoints,
  recommendedPoints,
  route,
  loading,
  serverError
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBnGIQ1sXS6bcIat5P6KdTYhYUDtVXydos"
  });

  const [map, setMap] = React.useState(null);
  const [directions, setDirections] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const splitWaypoints = (waypoints, maxWaypointsPerGroup = 22) => {
    const groups = [];
    for (let i = 0; i < waypoints?.length; i += maxWaypointsPerGroup) {
      const group = waypoints.slice(i, i + maxWaypointsPerGroup);

      // Add origin to the first waypoint of the group
      if (i === 0) {
        group[0] = {
          lat_value: route?.origin?.lat_value,
          long_value: route?.origin?.long_value
        };
      }

      // Add destination to the last waypoint of the group
      if (i + maxWaypointsPerGroup >= waypoints?.length) {
        group[group.length - 1] = {
          lat_value: route?.destination?.lat_value,
          long_value: route?.destination?.long_value
        };
      }

      groups.push(group);
    }

    return groups;
  };

  /**
   * useEffect hook that fetches directions using the Google Maps Directions Service
   * when the necessary dependencies are loaded and updated.
   */
  useEffect(() => {
    if (isLoaded && map && !loading) {
      const directionsService = new window.google.maps.DirectionsService();
      const waypointGroups = splitWaypoints(waypoints);

      const mainOrigin = {
        lat: Number(route?.origin?.lat_value),
        lng: Number(route?.origin?.long_value)
      };

      const mainDestination = {
        lat: Number(route?.destination?.lat_value),
        lng: Number(route?.destination?.long_value)
      };

      if (waypointGroups.length === 1) {
        directionsService.route(
          {
            origin: mainOrigin,
            destination: mainDestination,
            travelMode: window.google.maps.TravelMode.DRIVING,
            waypoints: waypointGroups[0].map((wp) => ({
              location: {
                lat: Number(wp?.lat_value),
                lng: Number(wp?.long_value)
              }
            }))
          },
          (response, status) => {
            if (status === "OK") {
              setDirections((prevDirections) => [...prevDirections, response]);
            } else {
              console.error("Error fetching directions", response);
            }
          }
        );

        return;
      }

      for (let i = 0; i < waypointGroups.length; i++) {
        const origin = {
          lat: Number(waypointGroups[i][0]?.lat_value),
          lng: Number(waypointGroups[i][0]?.long_value)
        };

        const destination = {
          lat: Number(
            waypointGroups[i][waypointGroups[i].length - 1]?.lat_value
          ),
          lng: Number(
            waypointGroups[i][waypointGroups[i].length - 1]?.long_value
          )
        };

        directionsService.route(
          {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
            waypoints: waypointGroups[i].map((wp) => ({
              location: {
                lat: Number(wp?.lat_value),
                lng: Number(wp?.long_value)
              }
            }))
          },
          (response, status) => {
            if (status === "OK") {
              setDirections((prevDirections) => [...prevDirections, response]);
            } else {
              console.error("Error fetching directions", response);
            }
          }
        );
      }
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

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptions}
    >
      {directions && (
        <>
          {directions.map((direction, index) => {
            return (
              <DirectionsRenderer
                key={index}
                directions={direction}
                options={{
                  suppressMarkers: true
                }}
              />
            );
          })}
        </>
      )}

      {recommendedPoints?.slice(0, 20).map((wp, i) => {
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
          url: StartPoint,
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
                      .toLowerCase()
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
          url: mapStartEndPoint,
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
                      .toLowerCase()
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

export default React.memo(TripMap);
