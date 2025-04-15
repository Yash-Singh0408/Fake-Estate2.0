import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import Pin from "../pin/Pin";
import { useEffect, useState } from "react";

function FlyToLocation({ lat, lng }) {
  const map = useMap();

  useEffect(() => {
    map.setView([0, 0], 1); // Start from a world view
    setTimeout(() => {
      map.flyTo([lat, lng], 13, {
        duration: 2.5,
        easeLinearity: 0.25,
      });
    }, 1200); 
  }, [lat, lng, map]);

  return null;
}

function Map({ items }) {
  const isSingle = items.length === 1;

  return (
    <MapContainer
      center={isSingle ? [0, 0] : [40.7128, -74.006]}
      zoom={isSingle ? 2 : 5}
      scrollWheelZoom={true}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {isSingle && (
        <FlyToLocation lat={items[0].latitude} lng={items[0].longitude} />
      )}

      {items.map((item) => (
        <Pin key={item.id} item={item} />
      ))}
    </MapContainer>
  );
}

export default Map;
