import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { IoIosTime } from "react-icons/io";
import dayjs from "dayjs";

const Article = ({ title, owner, time, open, announcement }) => {
  const { lightMode } = useContext(AuthContext);
  const formattedDate = time ? dayjs(time).format("D.M.YYYY H:mm") : "";

  return (
    <div
      className={`flex flex-col items-center p-5 shadow-lg hover:cursor-pointer ${
        !announcement && "hover:scale-110"
      } w-[min(80rem,80%)] rounded-lg bg-gradient-to-r ${
        lightMode
          ? "from-stone-500/80 via-white/80 to-stone-500/80 shadow-black/50 hover:shadow-black text-black"
          : "from-yellow-100/30 via-black/80 to-yellow-100/30 shadow-yellow-100/50 hover:shadow-yellow-100"
      }`}
      onClick={open}>
      {announcement && (
        <div className="flex flex-col font-['Roboto_Mono',monospace] text-[3rem] p-10">
          <p>Příští živý přenos domácího utkání:</p>
          <p>23/11 od 10:05</p>
          <p className="self-center mt-5 animate-pulse text-[4rem]">
            <a href="https://lichess.org" target="_blank" rel="noopener noreferrer">
              Odkaz zde
            </a>
          </p>
        </div>
      )}
      {title && <h2 className="text-[4rem] xl:text-[6rem]">{title}</h2>}
      {owner && <span className="text-[2rem] xl:text-[3rem] my-5">Autor: {owner}</span>}
      {time && (
        <span className="flex items-center text-[0.8rem] xl:text-[1.2rem]">
          <IoIosTime className="mr-2" />
          <span>Datum vytvoření: {formattedDate}</span>
        </span>
      )}
    </div>
  );
};

export default Article;
