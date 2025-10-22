import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaUserSlash } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { FaSun, FaMoon } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

const MainNavigation = () => {
  const { curUser, lightMode, toggleLightAndDark } = useContext(AuthContext);

  const [hovered, setHovered] = useState(false);

  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav
      className={`flex justify-around items-center w-[min(150rem,80%)] text-[3rem] xl:text-[4rem] my-20 font-["Scope_One",serif] ${
        lightMode ? " text-stone-700" : "text-yellow-100"
      } to-150% to-transparent py-10`}>
      <div className="w-full hidden md:flex justify-around items-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? `underline ${lightMode ? "text-stone-800" : "text-yellow-200"} font-black`
              : "hover:font-black hover:scale-110"
          }>
          Články
        </NavLink>
        <NavLink
          to="soutez"
          className={({ isActive }) =>
            isActive
              ? `underline ${lightMode ? "text-stone-800" : "text-yellow-200"} font-black`
              : "hover:font-black hover:scale-110"
          }>
          Soutěž
        </NavLink>
        <NavLink
          to="historie"
          className={({ isActive }) =>
            isActive
              ? `underline ${lightMode ? "text-stone-800" : "text-yellow-200"} font-black`
              : "hover:font-black hover:scale-110"
          }>
          Historie
        </NavLink>
        <NavLink
          to="kontakt"
          className={({ isActive }) =>
            isActive
              ? `underline ${lightMode ? "text-stone-800" : "text-yellow-200"} font-black`
              : "hover:font-black hover:scale-110"
          }>
          Kontakt
        </NavLink>
        <NavLink
          to="auth"
          className={({ isActive }) =>
            isActive
              ? `underline ${
                  lightMode ? "text-stone-800" : "text-yellow-200"
                } font-black text-[2rem]`
              : "text-[2rem] hover:font-black hover:scale-110"
          }>
          {curUser ? (
            <div className="flex items-center">
              <FaUser className="mr-5" />
              <span>{curUser}</span>
            </div>
          ) : (
            <div className="flex items-center">
              <FaUserSlash className="mr-5" />
            </div>
          )}
        </NavLink>
        <div className="flex items-center">
          {(!hovered && lightMode) || (hovered && !lightMode) ? (
            <FaSun
              className={`text-[2.5rem] hover:cursor-pointer ${
                lightMode ? "text-stone-800" : "text-yellow-100"
              } ${hovered && "animate-pulse hover:scale-150"}`}
              onClick={toggleLightAndDark}
              onMouseOver={() => setHovered(true)}
              onMouseOut={() => setHovered(false)}
            />
          ) : (
            <FaMoon
              className={`text-[2.5rem] hover:cursor-pointer ${
                lightMode ? "text-stone-800" : "text-yellow-100"
              } ${hovered && "animate-pulse hover:scale-150"}`}
              onClick={toggleLightAndDark}
              onMouseOver={() => setHovered(true)}
              onMouseOut={() => setHovered(false)}
            />
          )}
        </div>
      </div>
      <div className="w-full flex md:hidden justify-around items-center">
        <div className="relative">
          <GiHamburgerMenu
            className="text-[3rem] hover:cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <div
              className={`absolute top-full left-[-5rem] mt-2 flex flex-col [&>*]:my-2 px-20 z-50 shadow-md rounded-md ${
                lightMode ? "bg-stone-300 shadow-black/50" : "bg-black shadow-yellow-100/50"
              }`}>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `underline ${lightMode ? "text-stone-800" : "text-yellow-200"} font-black`
                    : ""
                }
                to="/"
                onClick={() => setShowMenu(false)}>
                Články
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `underline ${lightMode ? "text-stone-800" : "text-yellow-200"} font-black`
                    : ""
                }
                to="soutez"
                onClick={() => setShowMenu(false)}>
                Soutěž
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `underline ${lightMode ? "text-stone-800" : "text-yellow-200"} font-black`
                    : ""
                }
                to="historie"
                onClick={() => setShowMenu(false)}>
                Historie
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `underline ${lightMode ? "text-stone-800" : "text-yellow-200"} font-black`
                    : ""
                }
                to="kontakt"
                onClick={() => setShowMenu(false)}>
                Kontakt
              </NavLink>
            </div>
          )}
        </div>
        <NavLink
          to="auth"
          className={({ isActive }) =>
            isActive
              ? `underline ${
                  lightMode ? "text-stone-800" : "text-yellow-200"
                } font-black text-[2rem]`
              : "text-[2rem] hover:font-black hover:scale-110"
          }>
          {curUser ? (
            <div className="flex items-center">
              <FaUser className="mr-5" />
              <span>{curUser}</span>
            </div>
          ) : (
            <div className="flex items-center">
              <FaUserSlash className="mr-5" />
            </div>
          )}
        </NavLink>
        <div className="flex items-center">
          {lightMode ? (
            <FaSun
              className={`text-[2.5rem] hover:cursor-pointer ${
                lightMode ? "text-stone-800" : "text-yellow-100"
              }`}
              onClick={toggleLightAndDark}
            />
          ) : (
            <FaMoon
              className={`text-[2.5rem] hover:cursor-pointer ${
                lightMode ? "text-stone-800" : "text-yellow-100"
              }`}
              onClick={toggleLightAndDark}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
