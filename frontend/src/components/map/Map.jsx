import { MapContainer,  TileLayer, } from 'react-leaflet'
import './map.scss'
import 'leaflet/dist/leaflet.css'
import Pin from '../pin/Pin'


function Map({items}) {

  return (
    <MapContainer center={[40.7128, -74.0060]} zoom={5} scrollWheelZoom={false} className='map'>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {items.map(item=>(
      <Pin key={item.id} item={item}/>
    ))}
  </MapContainer>
  )
}

export default Map



















// import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
// import { useEffect } from "react";
// import "./map.scss";
// import "leaflet/dist/leaflet.css";

// const MapEffect = ({ position, zoom }) => {
//   const map = useMap();

//   useEffect(() => {
//     setTimeout(() => {
//       map.flyTo(position, zoom, {
//         duration: 2, // Smooth transition in 2 seconds
//       });
//     }, 1000);
//   }, [map, position, zoom]);

//   return null;
// };

// function Map() {
//   const propertyLocation = [51.505, -0.09]; // Your target location

//   return (
//     <MapContainer
//       center={[20, 0]} // Start with a global view
//       zoom={3}
//       scrollWheelZoom={false}
//       className="map"
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
      
//       <Marker position={propertyLocation}>
//         <Popup>A pretty CSS3 popup. <br /> Easily customizable.</Popup>
//       </Marker>

//       {/* Zoom animation effect */}
//       <MapEffect position={propertyLocation} zoom={14} />
//     </MapContainer>
//   );
// }

// export default Map;
