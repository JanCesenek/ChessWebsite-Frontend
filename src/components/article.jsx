import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { BsHourglassSplit } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { IoIosTime, IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from "react-icons/io";
import { MdCancel, MdEditSquare } from "react-icons/md";
import { api } from "../core/api";
import Button from "./button";
import dayjs from "dayjs";

const Article = ({
  title,
  category,
  round,
  teams,
  season,
  owner,
  time,
  open,
  announcement,
  close,
  date,
  url,
  name,
  edit,
  setEdit,
  auth,
  refetch,
  linkData,
}) => {
  const { lightMode, notifyContext } = useContext(AuthContext);
  const formattedDate = time && dayjs(time).format("D.M.YYYY H:mm");

  const [newDate, setNewDate] = useState(date);
  const [newUrl, setNewUrl] = useState(url);
  const [newName, setNewName] = useState(name);
  const [saveNew, setSaveNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [matchList, setMatchList] = useState(false);

  const updateLink = async () => {
    setSubmitting(true);

    if (saveNew) {
      await api
        .post("/link", { date: newDate, url: newUrl, name: newName })
        .then(async () => {
          await refetch();
          notifyContext("Link saved to archive successfully!", "success");
        })
        .catch((err) => {
          console.log(`Post req - ${err}`);
          notifyContext("Failed to save link to archive!", "error");
        });
    }

    await api
      .patch("/link/1", { date: newDate, url: newUrl, name: newName })
      .then(async () => {
        await refetch();
        notifyContext("Link updated successfully!", "success");
      })
      .catch((err) => {
        console.log(`Patch req - ${err}`);
        notifyContext("Failed to update link!", "error");
      })
      .finally(() => {
        setSubmitting(false);
        setEdit();
      });
  };

  const hardClose = () => {
    close();
    edit && setEdit();
  };

  return (
    <div
      className={`flex relative flex-col items-center p-10 shadow-lg ${
        !announcement && "hover:cursor-pointer hover:scale-110"
      } w-[min(100rem,80%)] rounded-lg bg-gradient-to-r ${
        lightMode
          ? "from-stone-500/80 via-white/80 to-stone-500/80 shadow-black/50 hover:shadow-black text-black"
          : "from-yellow-100/30 via-black/80 to-yellow-100/30 shadow-yellow-100/50 hover:shadow-yellow-100"
      } ${submitting && "pointer-events-none opacity-50"}`}
      onClick={open}>
      {/* Single link */}
      {announcement && (
        <div className="flex flex-col font-['Roboto_Mono',monospace] text-[3rem] p-10">
          <p className="font-bold underline mb-5">
            <span>Příští živý přenos domácího utkání:</span>
          </p>
          {edit ? (
            <>
              <div className="flex text-[2rem] mt-10 mb-2">
                <label htmlFor="date" className="min-w-[15rem]">
                  Datum a čas:
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  id="date"
                  className={`bg-transparent border shadow-md focus:outline-none rounded-md ${
                    lightMode
                      ? "border-black/20 shadow-black/50 focus:shadow-black"
                      : "border-yellow-100/20 shadow-yellow-100/50 focus:shadow-yellow-100"
                  }`}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <div className="flex text-[2rem] my-2">
                <label htmlFor="url" className="min-w-[15rem]">
                  URL:
                </label>
                <input
                  type="text"
                  name="url"
                  id="url"
                  className={`bg-transparent border shadow-md focus:outline-none rounded-md ${
                    lightMode
                      ? "border-black/20 shadow-black/50 focus:shadow-black"
                      : "border-yellow-100/20 shadow-yellow-100/50 focus:shadow-yellow-100"
                  }`}
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>
              <div className="flex text-[2rem] my-2">
                <label htmlFor="name" className="min-w-[15rem]">
                  Jméno:
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className={`bg-transparent border shadow-md focus:outline-none rounded-md ${
                    lightMode
                      ? "border-black/20 shadow-black/50 focus:shadow-black"
                      : "border-yellow-100/20 shadow-yellow-100/50 focus:shadow-yellow-100"
                  }`}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="flex items-center text-[2rem] mb-10 mt-2">
                <label htmlFor="saveNew" className="min-w-[15rem]">
                  Přidat do archivu:
                </label>
                <input
                  type="checkbox"
                  name="saveNew"
                  id="saveNew"
                  className={`bg-transparent focus:outline-none rounded-md ml-5`}
                  value={saveNew}
                  onChange={(e) => setSaveNew(e.target.checked)}
                />
              </div>
              <Button
                msg={
                  submitting ? (
                    <div className="flex items-center [&>*]:mx-2">
                      <div>Ukládám...</div>
                      <BsHourglassSplit className="animate-spin" />
                    </div>
                  ) : (
                    "Uložit"
                  )
                }
                classes="self-center"
                click={updateLink}
                disabled={!(date && url && name) || submitting}
              />
              <Button msg="Zrušit" classes="self-center mt-5" click={setEdit} />
            </>
          ) : (
            <>
              <div className="flex flex-col">
                <p>{dayjs(date).format("D.M.YYYY H:mm")}</p>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <p
                    className={`font-bold ${lightMode ? "hover:text-red-600" : "hover:text-amber-600"}`}>
                    {name}
                  </p>
                </a>
                {auth && (
                  <span>
                    <MdEditSquare className="hover:cursor-pointer ml-2" onClick={setEdit} />
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      )}
      {/* Multiple links - list of live broadcasts */}
      {announcement && (
        <div className="flex flex-col text-[2rem] mt-20">
          <p className="flex items-center font-black underline text-[4rem] [&>*]:mx-2">
            <span>Archiv domácích zápasů:</span>
            {matchList ? (
              <IoIosArrowDropupCircle
                className="animate-pulse hover:cursor-pointer"
                onClick={() => setMatchList(false)}
              />
            ) : (
              <IoIosArrowDropdownCircle
                className="animate-pulse hover:cursor-pointer"
                onClick={() => setMatchList(!matchList)}
              />
            )}
          </p>
          {matchList &&
            linkData?.map((link) => {
              const { id, date, url, name } = link;
              if (id !== 1) {
                return (
                  <a key={id} href={url} target="_blank" rel="noopener noreferrer">
                    <div
                      className={`flex flex-col my-5 border p-5 rounded-lg shadow-md ${lightMode ? "border-black/20 shadow-black/50 hover:bg-white" : "border-yellow-100/20 shadow-yellow-100/50 hover:bg-black"}`}>
                      <p>{dayjs(date).format("D.M.YYYY H:mm")}</p>
                      <p className="font-bold">{name}</p>
                    </div>
                  </a>
                );
              }
            })}
        </div>
      )}
      {round && teams && season && (
        <div
          className={`w-full relative flex flex-col mb-5 border-b ${lightMode ? "border-black/5" : "border-yellow-100/5"}`}>
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
          <div className="flex absolute top-2 right-2 items-center [&>*]:mx-2 my-2">
            <FaCalendarAlt className="text-[1.2rem] xl:text-[1.8rem]" />
            <h4 className="text-[1rem] xl:text-[1.5rem] font-['Roboto_Mono',monospace]">
              {season}
            </h4>
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
        <MdCancel
          className="absolute top-5 right-5 cursor-pointer text-[3rem]"
          onClick={hardClose}
        />
      )}
    </div>
  );
};

export default Article;
