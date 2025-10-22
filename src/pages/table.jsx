import { useEffect, useState, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../core/api";
import classes from "./table.module.css";

const Table = () => {
  const { lightMode } = useContext(AuthContext);

  const [tableHTML1, setTableHTML1] = useState(null);
  const [tableHTML2, setTableHTML2] = useState(null);
  const [tableHTML3, setTableHTML3] = useState(null);

  const tableRef1 = useRef(null);
  const tableRef2 = useRef(null);
  const tableRef3 = useRef(null);

  useEffect(() => {
    api
      .get("api/chess-table")
      .then((res) => setTableHTML1(res.data))
      .catch(console.error);

    api
      .get("api/chess-table-2")
      .then((res) => setTableHTML2(res.data))
      .catch(console.error);

    api
      .get("api/chess-table-3")
      .then((res) => setTableHTML3(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (tableRef1.current) {
      const homeTeam = Array.from(tableRef1.current.querySelectorAll("a")).find((a) =>
        a.textContent.includes("Chrudim")
      );
      homeTeam?.classList.add(classes.homeTeam);
      const anchors = tableRef1.current.querySelectorAll("a");
      anchors.forEach((a) => a.setAttribute("target", "_blank"));
    }
    if (tableRef2.current) {
      const homeTeam = Array.from(tableRef2.current.querySelectorAll("a")).find((a) =>
        a.textContent.includes("Chrudim")
      );
      homeTeam?.classList.add(classes.homeTeam);
      const anchors = tableRef2.current.querySelectorAll("a");
      anchors.forEach((a) => a.setAttribute("target", "_blank"));
    }
    if (tableRef3.current) {
      const homeTeam = Array.from(tableRef3.current.querySelectorAll("a")).find((a) =>
        a.textContent.includes("Chrudim")
      );
      homeTeam?.classList.add(classes.homeTeam);
      const anchors = tableRef3.current.querySelectorAll("a");
      anchors.forEach((a) => a.setAttribute("target", "_blank"));
    }
  }, [tableHTML1, tableHTML2, tableHTML3]);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex flex-col items-center w-[min(120rem,80%)] p-10 rounded-lg shadow-lg my-20 [&>*]:my-20 ${
          lightMode ? "bg-stone-300/90 shadow-black/50" : "bg-black/80 shadow-yellow-100/50"
        }`}>
        <div className="flex flex-col items-center">
          <h2
            className={`text-[3rem] xl:text-[4rem] font-bold mb-10 underline hover:scale-110 ${
              lightMode ? "hover:text-black" : "hover:text-yellow-200"
            }`}>
            <a href="https://www.chess.cz/soutez/3291" target="_blank" rel="noopener noreferrer">
              Krajský přebor I
            </a>
          </h2>
          {tableHTML1 ? (
            <div
              className={`${classes.customChessTable} ${
                lightMode ? classes.customChessTableLight : classes.customChessTableDark
              }`}
              ref={tableRef1}>
              <div dangerouslySetInnerHTML={{ __html: tableHTML1 }} />
            </div>
          ) : (
            <p>Načítání tabulky...</p>
          )}
        </div>
        <div className="flex flex-col items-center">
          <h2
            className={`text-[3rem] xl:text-[4rem] font-bold mb-10 underline hover:scale-110 ${
              lightMode ? "hover:text-black" : "hover:text-yellow-200"
            }`}>
            <a href="https://www.chess.cz/soutez/3293" target="_blank" rel="noopener noreferrer">
              Krajský přebor II západ
            </a>
          </h2>
          {tableHTML2 ? (
            <div
              className={`${classes.customChessTable} ${
                lightMode ? classes.customChessTableLight : classes.customChessTableDark
              }`}
              ref={tableRef2}>
              <div dangerouslySetInnerHTML={{ __html: tableHTML2 }} />
            </div>
          ) : (
            <p>Načítání tabulky...</p>
          )}
        </div>
        <div className="flex flex-col items-center">
          <h2
            className={`text-[3rem] xl:text-[4rem] font-bold mb-10 underline hover:scale-110 ${
              lightMode ? "hover:text-black" : "hover:text-yellow-200"
            }`}>
            <a href="https://www.chess.cz/soutez/3295" target="_blank" rel="noopener noreferrer">
              Krajská soutěž západ
            </a>
          </h2>
          {tableHTML3 ? (
            <div
              className={`${classes.customChessTable} ${
                lightMode ? classes.customChessTableLight : classes.customChessTableDark
              }`}
              ref={tableRef3}>
              <div dangerouslySetInnerHTML={{ __html: tableHTML3 }} />
            </div>
          ) : (
            <p>Načítání tabulky...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Table;
