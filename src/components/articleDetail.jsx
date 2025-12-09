import { useState, useContext, useEffect } from "react";
import parse, { domToReact } from "html-react-parser";
import ChessboardPreview from "./chessboardPreview";
import { generateHTML, generateJSON } from "@tiptap/react";
import { editorExtensions } from "./editor";
import { MdEditSquare, MdDelete } from "react-icons/md";
import { IoIosTime, IoIosCloseCircle } from "react-icons/io";
import { FaRegHourglassHalf } from "react-icons/fa6";
import Editor from "./editor";
import Button from "./button";
import { api } from "../core/api";
import { AuthContext } from "../context/AuthContext";
import dayjs from "dayjs";

const ArticleDetail = ({ id, title, owner, image, time, content, own, back, remove, refetch }) => {
  const [edit, setEdit] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [fullScreen, setFullScreen] = useState(false);

  const [newContent, setNewContent] = useState(content);
  const [newTitle, setNewTitle] = useState(title);

  const { lightMode, notifyContext } = useContext(AuthContext);

  const formattedDate = dayjs(time).format("D.M.YYYY H:mm");

  let htmlContent = "";
  try {
    const jsonContent = typeof content === "string" ? JSON.parse(content) : content;
    htmlContent = generateHTML(jsonContent, editorExtensions);
  } catch {
    htmlContent = content;
  }

  // Custom parser to replace chess game blocks
  const options = {
    replace: (domNode) => {
      if (domNode.name === "div" && domNode.attribs && domNode.attribs.class === "chess-game") {
        try {
          const game = JSON.parse(domNode.children[0].data);
          return (
            <div className="flex justify-center my-4">
              <ChessboardPreview
                moves={game.moves}
                white={game.white}
                black={game.black}
                result={game.result}
                defaultMove={game?.defaultMove}
              />
            </div>
          );
        } catch {
          return <pre>{domToReact(domNode.children)}</pre>;
        }
      }
    },
  };

  const editContent = async () => {
    setSubmitting(true);

    let contentToSave = newContent;
    // Defensive: ensure it's always JSON
    if (typeof contentToSave === "string") {
      try {
        contentToSave = JSON.parse(contentToSave);
      } catch {
        contentToSave = generateJSON(contentToSave, editorExtensions);
      }
    }

    await api
      .patch(`/articles/${id}`, {
        title: newTitle,
        content: JSON.stringify(contentToSave),
      })
      .then(async () => {
        await refetch();
        notifyContext("Úspěšně upraveno", "success");
      })
      .catch((err) => {
        console.log(`Patch req - ${err}`);
        notifyContext("Úprava se nezdařila", "error");
      })
      .finally(() => {
        setSubmitting(false);
        setEdit(false);
        setFullScreen(false);
        back();
      });
  };

  let initialContent = content;
  try {
    initialContent = typeof content === "string" ? JSON.parse(content) : content;
  } catch {
    // fallback: convert HTML to JSON
    initialContent = generateJSON(content, editorExtensions);
  }

  useEffect(() => {
    const articleElement = document.querySelector(".article-detail-container"); // Adjust class or ID as needed
    if (articleElement) {
      const topOffset = articleElement.offsetTop;
      window.scrollTo(0, topOffset);
    }
  }, []);

  return (
    <div
      className={`flex relative flex-col items-center rounded-md shadow-lg p-20 w-[min(150rem,80%)] text-[2rem] article-detail-container ${
        lightMode ? "bg-stone-300/90 shadow-black" : "bg-black/80 shadow-yellow-100/50"
      } "my-20" ${
        fullScreen && `fullscreen-editor ${lightMode ? "fullscreen-light" : "fullscreen-dark"}`
      } ${submitting && "pointer-events-none opacity-70"}`}>
      {edit ? (
        <>
          <div className="flex items-center my-5 [&>*]:px-2">
            <label htmlFor="newTitle">Název: </label>
            <input
              type="text"
              id="newTitle"
              name="newTitle"
              className={`bg-transparent border shadow-md focus:outline-none rounded-md ${
                lightMode
                  ? "border-black/20 shadow-black/50 focus:shadow-black"
                  : " border-yellow-100/20 shadow-yellow-100/50 focus:shadow-yellow-100"
              }`}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <Editor
            content={initialContent}
            setContent={setNewContent}
            fullScreen={fullScreen}
            toggleFullScreen={() => setFullScreen(!fullScreen)}
          />
          <div className="flex items-center justify-around w-2/3">
            {!fullScreen && (
              <Button
                msg="Zpět"
                click={() => setEdit(false)}
                disabled={submitting}
                classes={submitting && "hover:cursor-not-allowed opacity-50"}
              />
            )}
            <Button
              msg={
                submitting ? (
                  <div className="flex items-center">
                    <span>Ukládání změn...</span>
                    <FaRegHourglassHalf className="animate-spin ml-2" />
                  </div>
                ) : (
                  "Uložit změny"
                )
              }
              click={editContent}
              disabled={submitting}
              classes={submitting && "hover:cursor-not-allowed opacity-50"}
            />
          </div>
        </>
      ) : (
        <>
          {" "}
          <h1 className="text-[5rem] font-extrabold">{title}</h1>
          <div className="absolute top-[2rem] left-[2rem] text-[1.2rem] font-bold flex items-center">
            <IoIosTime className="mr-2" />
            <span>Datum vytvoření: {formattedDate}</span>
          </div>
          <h3 className="text-[1.5rem]">Autor: {owner}</h3>
          {own && (
            <div className="absolute flex items-center top-5 right-5 gap-2 text-[5rem]">
              <MdEditSquare className="hover:cursor-pointer" onClick={() => setEdit(true)} />
              <MdDelete className="text-red-500 hover:cursor-pointer" onClick={remove} />
            </div>
          )}
          {!own && (
            <IoIosCloseCircle
              className="absolute top-[3rem] right-[3rem] text-[3rem] md:text-[5rem] hover:cursor-pointer opacity-50 hover:opacity-100"
              onClick={back}
            />
          )}
          {image && (
            <img
              src={image}
              alt="Article image"
              className="max-w-[min(80%,100rem)] max-h-[min(80%,100rem)] my-10 rounded-lg"
            />
          )}
          <div
            className={`mt-5 pt-20 w-full border-t text-[1.5rem] md:text-[2rem] font-['Roboto_Mono',monospace] ${
              lightMode ? "border-stone-700/50" : "border-yellow-100/20"
            }`}>
            {parse(htmlContent, options)}
          </div>
          {own && (
            <div className="flex justify-center w-full border-t border-yellow-100/20 mt-10">
              <Button msg="Zpět" click={back} classes="mt-10" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ArticleDetail;
