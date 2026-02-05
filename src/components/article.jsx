import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { BsHourglassSplit } from "react-icons/bs";
import { RiTeamFill } from "react-icons/ri";
import { IoIosTime } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import dayjs from "dayjs";

const Article = ({ title, category, round, teams, owner, time, open, announcement, close }) => {
  const { lightMode } = useContext(AuthContext);
  const formattedDate = time ? dayjs(time).format("D.M.YYYY H:mm") : "";

  return (
    <div
      className={`flex relative flex-col items-center p-10 shadow-lg ${
        !announcement && "hover:cursor-pointer hover:scale-110"
      } w-[min(100rem,80%)] rounded-lg bg-gradient-to-r ${
        lightMode
          ? "from-stone-500/80 via-white/80 to-stone-500/80 shadow-black/50 hover:shadow-black text-black"
          : "from-yellow-100/30 via-black/80 to-yellow-100/30 shadow-yellow-100/50 hover:shadow-yellow-100"
      }`}
      onClick={open}>
      {announcement && (
        <div className="flex flex-col font-['Roboto_Mono',monospace] text-[3rem] p-10">
          <p>Příští živý přenos domácího utkání:</p>
          <p>23/11 od 10:05</p>
          <p className="self-center mt-5 animate-pulse text-[4rem] underline">
            <a
              href="https://lichess.org/broadcast/chrudim-svitavy/round-1/a5v09Nkf#boards"
              target="_blank"
              rel="noopener noreferrer">
              Odkaz zde
            </a>
          </p>
        </div>
      )}
      {round && teams && (
        <div
          className={`w-full flex flex-col mb-5 border-b ${lightMode ? "border-black/5" : "border-yellow-100/5"}`}>
          <div className="flex items-center [&>*]:mx-2 my-2">
            <BsHourglassSplit className="text-[1.2rem] xl:text-[1.8rem]" />
            <h4 className="text-[1rem] xl:text-[1.5rem] font-['Roboto_Mono',monospace]">
              {round} kolo
            </h4>
          </div>
          <div className="flex items-center [&>*]:mx-2 my-2">
            <RiTeamFill className="text-[1.2rem] xl:text-[1.8rem]" />
            <h4 className="text-[1rem] xl:text-[1.5rem] font-['Roboto_Mono',monospace]">{teams}</h4>
          </div>
        </div>
      )}
      {category && (
        <div
          className={`w-full flex justify-center border-b pb-5 ${
            lightMode ? "border-black/20" : "border-yellow-100/20"
          }`}>
          <h3 className="text-[2rem] italic xl:text-[3rem]">{category}</h3>
        </div>
      )}
      {title && (
        <div
          className={`w-full flex justify-center border-b py-5 ${
            lightMode ? "border-black/20" : "border-yellow-100/20"
          }`}>
          <h2 className="text-[3.5rem] xl:text-[5rem] font-bold">{title}</h2>
        </div>
      )}
      {owner && <span className="text-[1.5rem] xl:text-[2rem] mt-10 mb-5">Autor: {owner}</span>}
      {time && (
        <span className="flex items-center text-[0.8rem] xl:text-[1.2rem]">
          <IoIosTime className="mr-2" />
          <span>Datum vytvoření: {formattedDate}</span>
        </span>
      )}
      {announcement && (
        <MdCancel className="absolute top-5 right-5 cursor-pointer text-[3rem]" onClick={close} />
      )}
    </div>
  );
};

export default Article;
