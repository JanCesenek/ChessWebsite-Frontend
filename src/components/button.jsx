import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Button = ({ msg, click, disabled, classes }) => {
  const { lightMode } = useContext(AuthContext);

  return (
    <button
      className={`flex items-center [&>*]:mx-2 rounded-md text-[2rem] shadow-lg hover:cursor-pointer px-5 py-2 border ${
        lightMode
          ? "border-black/20 bg-stone-200/50 text-black shadow-black hover:bg-black hover:text-white"
          : "border-yellow-100/15 bg-black text-yellow-100 shadow-yellow-100/50 hover:bg-yellow-100 hover:text-black"
      } ${classes} ${disabled && "pointer-events-none opacity-50"}`}
      onClick={click}
      disabled={disabled}>
      {msg}
    </button>
  );
};

export default Button;
