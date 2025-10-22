import MainNavigation from "../components/mainNavigation";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet } from "react-router-dom";
import { FaChess, FaCopyright } from "react-icons/fa";
import classes from "./root.module.css";
import logo from "/flamebulb.svg";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Root = () => {
  const { lightMode } = useContext(AuthContext);

  return (
    <div
      className={`flex flex-col w-full min-h-screen ${
        lightMode ? "text-stone-800" : "text-yellow-100"
      } ${lightMode ? classes.lightMode : classes.darkMode}`}>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={lightMode ? "light" : "dark"}
        transition={Flip}
        style={{ fontSize: "1.5rem" }}
      />
      <div className={`flex w-full justify-center items-center py-20 font-bold`}>
        <div
          className={`flex items-center rounded-md p-10 shadow-lg text-[5rem] xl:text-[8rem] ${
            lightMode
              ? "text-black bg-stone-300/80 shadow-black"
              : "text-yellow-100 bg-black/70 shadow-yellow-100/50"
          }`}>
          <FaChess className="mr-20" />
          <h1>TJ ŠO Chrudim</h1>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <MainNavigation />
      </div>
      <Outlet />
      <div
        className={`w-full h-[4rem] flex justify-center items-center text-[1rem] mt-20 ${
          lightMode ? "bg-stone-300/80" : "bg-black/80"
        }`}>
        <div className="flex items-center [&>*]:mx-1">
          <FaCopyright />
          <p>|</p>
          <img src={logo} alt="logo" className="w-[1.5rem]" />
          <p>Jan Česenek 2025</p>
          <p>|</p>
          <p>Všechna práva vyhrazena</p>
          <p>|</p>
          <a
            href="https://jancesenek.dev"
            className={`underline font-black ${lightMode ? "text-black" : "text-yellow-200"}`}
            target="_blank"
            rel="noopener noreferrer">
            jancesenek.dev
          </a>
        </div>
      </div>
    </div>
  );
};

export default Root;
