import { Loader } from "@googlemaps/js-api-loader";
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../Context";
// import google from "google"

const Locator = () => {
  const { homeAddress } = useContext(Context);

  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  const google = window.google;
  const geocoder = new google.maps.Geocoder();

  const street = homeAddress[2];
  const city = homeAddress[4];
  const state = homeAddress[7];
  const addressString = `${street} ${city} ${state}`;

  const apiKey = "AIzaSyC7kQoX5Lo4Qxe0KS4ZK_ZqYMJKtz0IrVg";

  const loader = new Loader({
    apiKey,
    version: "weekly",
    // ...additionalOptions,
  });

  const geocodinate = () => {
    let map;

    loader.load().then(() => {
      geocoder.geocode({ address: addressString }, function (results, status) {
        if (status == "OK") {
          console.log("geocode success", results);
          map = new google.maps.Map(document.getElementById("map"), {
            center: results[0].geometry.location,
            zoom: 15,
          });
          //   map.setCenter();
          var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
          });
        } else {
          alert(
            "Geocode was not successful for the following reason: " + status
          );
        }
      });
    });
  };

  useEffect(() => {
    geocodinate();
  }, []);

  return (
    <div>
      <div id="map"></div>
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}`}
        async
      ></script>
    </div>
  );
};

export default Locator;
