import { createContext, useState, useEffect } from "react";
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Success from "../audio/Success.mp3";
import Error from "../audio/Error.mp3";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [lightMode, setLightMode] = useState(false);

  const [curUser, setCurUser] = useState(localStorage.getItem("curUser"));

  useEffect(() => {
    setLightMode(lightMode);
    document.body.classList.toggle("light", lightMode);
    document.body.classList.toggle("dark", !lightMode);
  }, [lightMode]);

  useEffect(() => {
    const handleStorageChange = () => {
      setCurUser(localStorage.getItem("curUser"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const logIn = (username) => {
    localStorage.setItem("curUser", username);
    setCurUser(username);
  };

  const logOut = () => {
    localStorage.clear();
    setCurUser(null);
  };

  const toggleLightAndDark = () => {
    setLightMode(!lightMode);
  };

  const notifyContext = (msg, state) => {
    if (state === "success") {
      const audio = new Audio(Success);
      audio.play();
      toast.success(msg, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: lightMode ? "light" : "dark",
        transition: Flip,
      });
    } else if (state === "error") {
      const audio = new Audio(Error);
      audio.play();
      toast.error(msg, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: lightMode ? "light" : "dark",
        transition: Flip,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{ curUser, logIn, logOut, lightMode, toggleLightAndDark, notifyContext }}>
      {children}
    </AuthContext.Provider>
  );
};
