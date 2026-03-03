import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const History = () => {
  const { lightMode } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div
        className={`flex flex-col items-center w-[min(120rem,80%)] p-10 rounded-lg shadow-lg my-20 [&>*]:my-20 ${
          lightMode ? "bg-stone-300/90 shadow-black/50" : "bg-black/80 shadow-yellow-100/50"
        }`}>
        <h1 className="text-[5rem] font-bold underline">Historie chrudimského šachu</h1>
        <div
          className={`flex flex-col items-center [&>*]:my-5 text-[2rem] ${lightMode ? "text-stone-800" : "text-yellow-600"} italic`}>
          <a
            href="/history/Kronika1896_1952.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:font-bold hover:scale-125">
            Kronika 1896 - 1952
          </a>
          <a
            href="/history/Kronika1953_1975.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:font-bold hover:scale-125">
            Kronika 1953 - 1975
          </a>
          <a
            href="/history/Kronika1977_1978.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:font-bold hover:scale-125">
            Kronika 1977 - 1978
          </a>
          <a
            href="/history/Kronika1978_1979.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:font-bold hover:scale-125">
            Kronika 1978 - 1979
          </a>
          <a
            href="/history/Kronika1979_1980.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:font-bold hover:scale-125">
            Kronika 1979 - 1980
          </a>
          <a
            href="/history/Kronika1980_1981.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:font-bold hover:scale-125">
            Kronika 1980 - 1981
          </a>
          <a
            href="/history/Kronika1982_1994.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:font-bold hover:scale-125">
            Kronika 1982 - 1994
          </a>
          <a
            href="/history/Kronika1999_2000.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:font-bold hover:scale-125">
            Kronika 1999 - 2000
          </a>
          <a
            href="/history/Kronika2002_2003.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:font-bold hover:scale-125">
            Kronika 2002 - 2003
          </a>
          <a
            href="/history/Kronika2003_2004.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:font-bold hover:scale-125">
            Kronika 2003 - 2004
          </a>
          <a
            href="/history/Kronika2004_2005.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:font-bold hover:scale-125">
            Kronika 2004 - 2005
          </a>
          <a
            href="/history/Kronika2005_2006.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:font-bold hover:scale-125">
            Kronika 2005 - 2006
          </a>
          <a
            href="/history/Kronika2006_2007.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:font-bold hover:scale-125">
            Kronika 2006 - 2007
          </a>
          <a
            href="/history/Kronika2014_2015.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:font-bold hover:scale-125">
            Kronika 2014 - 2015
          </a>
          <a
            href="/history/Kronika2015_2016.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:font-bold hover:scale-125">
            Kronika 2015 - 2016
          </a>
          <a
            href="/history/Kronika2016_2017.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:font-bold hover:scale-125">
            Kronika 2016 - 2017
          </a>
        </div>
      </div>
    </div>
  );
};

export default History;
