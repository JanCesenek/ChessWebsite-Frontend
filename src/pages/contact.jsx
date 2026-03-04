import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Contact = () => {
  const { lightMode } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div
        className={`flex flex-col items-center w-[min(120rem,80%)] p-10 rounded-lg shadow-lg my-20 [&>*]:my-20 ${
          lightMode ? "bg-stone-300/90 shadow-black/50" : "bg-black/80 shadow-yellow-100/50"
        }`}>
        <div className="flex flex-col md:flex-row items-center">
          <MapContainer
            className="!w-[30rem] !h-[15rem] md:!w-[60rem] md:!h-[30rem] !text-black rounded-lg"
            center={[49.9517543, 15.7912005]}
            zoom={17}
            scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[49.9517543, 15.7912005]}>
              <Popup>Hrací místnost</Popup>
            </Marker>
          </MapContainer>
          <div className="ml-10 text-[1.8rem] italic">
            <p>Adresa hrací místnosti: Čs. Partyzánů 13, 537 01, Chrudim IV</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
