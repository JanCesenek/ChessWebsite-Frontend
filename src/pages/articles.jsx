import { useRef, useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ImCross } from "react-icons/im";
import { BsFillFileImageFill } from "react-icons/bs";
import { FaRegHourglassHalf } from "react-icons/fa6";
import Button from "../components/button";
import Editor, { editorExtensions } from "../components/editor";
import supabase from "../core/supabase";
import { api } from "../core/api";
import { useUpdate } from "../hooks/use-update";
import { v4 as uuid } from "uuid";
import ArticleDetail from "../components/articleDetail";
import Article from "../components/article";

const Articles = () => {
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [addArticle, setAddArticle] = useState(false);

  const [detail, setDetail] = useState(false);

  const { data: aData, refetch: aRefetch, isLoading: aIsLoading } = useUpdate("/articles");
  const { data: uData, refetch: uRefetch, isLoading: uIsLoading } = useUpdate("/users");

  const { lightMode, curUser, notifyContext } = useContext(AuthContext);

  const userData = uData?.find((user) => user.username === curUser);
  const userID = userData?.id;

  useEffect(() => {
    const refetchData = async () => {
      await aRefetch();
      await uRefetch();
    };
    refetchData();
  }, []);

  const resetData = () => {
    setTitle("");
    setImage(null);
    setContent("");
    setSubmitting(false);
    fullScreen && setFullScreen(false);
    setAddArticle(false);
    fileInputRef.current.value = null;
  };

  const createArticle = async () => {
    const uniqueID = uuid();

    const handleUpload = async () => {
      const { data, error } = await supabase.storage
        .from("chess")
        .upload(`articles/${uniqueID}`, image, {
          cacheControl: "3600",
          upsert: false,
        });

      const { data: getData, error: getError } = await supabase.storage
        .from("chess")
        .list("articles");

      if (error) {
        console.log("Error uploading file...", error);
      } else {
        console.log("File uploaded!", data.path);
      }

      if (getError) {
        console.log("Error listing files...", getError);
      } else {
        console.log("Files listed!", getData);
      }
    };
    image && (await handleUpload());

    const postReqPayload = {
      userID,
      title,
      image: image
        ? `https://jwylvnqdlbtbmxsencfu.supabase.co/storage/v1/object/public/chess/articles/${uniqueID}`
        : `https://jwylvnqdlbtbmxsencfu.supabase.co/storage/v1/object/public/chess/articles/chessAmbience.jpg`,
      content: JSON.stringify(content),
    };

    setSubmitting(true);

    await api
      .post("/articles", postReqPayload)
      .then(async () => {
        await aRefetch();
        notifyContext("Article created successfully!", "success");
      })
      .catch((err) => {
        console.log(`Post req - ${err}`);
        notifyContext("Failed to create article!", "error");
      })
      .finally(() => {
        setSubmitting(false);
        resetData();
      });
  };

  const validForm = title && content;

  return (
    <div className={`flex flex-col items-center ${submitting && "pointer-events-none opacity-70"}`}>
      {!addArticle && (
        <div className="flex flex-col items-center w-full my-10">
          <Article announcement />
        </div>
      )}
      {userData && (
        <Button
          msg={addArticle ? "Zavřít editor" : "Přidat článek"}
          click={() => setAddArticle(!addArticle)}
          classes="my-10"
        />
      )}
      {addArticle && (
        <div
          className={`flex flex-col relative shadow-lg ${
            lightMode ? "bg-stone-300/90 shadow-black" : "bg-black shadow-yellow-100"
          } items-center rounded-md shadow-md w-[min(150rem,90%)] my-20 [&>*]:my-10 ${
            fullScreen && `fullscreen-editor ${lightMode ? "fullscreen-light" : "fullscreen-dark"}`
          }`}>
          {fullScreen && (
            <ImCross
              className="absolute top-10 right-10 cursor-pointer"
              onClick={() => setFullScreen(false)}
            />
          )}
          <h1 className="text-[4rem]">Tvorba nového článku</h1>
          <div className="flex items-center [&>*]:px-5 text-[2rem] md:text-[3rem]">
            <label htmlFor="title">Název:</label>
            <input
              type="text"
              name="title"
              id="title"
              className={`bg-transparent border shadow-md focus:outline-none rounded-md px-5 ${
                lightMode
                  ? "border-black/20 shadow-black/50 focus:shadow-black"
                  : "border-yellow-100/20 shadow-yellow-100/50 focus:shadow-yellow-100"
              }`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <label
              htmlFor="image"
              className="flex items-center min-w-[15rem] text-[2rem] hover:cursor-pointer">
              <BsFillFileImageFill className="mr-2" />
              <span>{image ? image?.name : "Nahrát obrázek"}</span>
            </label>
            <input
              type="file"
              name="image"
              id="image"
              size="10"
              className="hidden"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              ref={fileInputRef}
            />
          </div>

          <Editor
            content={content}
            setContent={setContent}
            fullScreen={fullScreen}
            toggleFullScreen={() => setFullScreen(!fullScreen)}
            editorExtensions={editorExtensions}
          />
          <Button
            msg={
              submitting ? (
                <div className="flex items-center">
                  <span>Vkládám...</span>
                  <FaRegHourglassHalf className="animate-spin ml-2" />
                </div>
              ) : (
                "Vložit článek"
              )
            }
            disabled={!validForm || submitting}
            click={createArticle}
            classes={(!validForm || submitting) && "opacity-50 cursor-not-allowed"}
          />
        </div>
      )}
      {!addArticle &&
        (detail ? (
          <div className="flex justify-center w-full my-20">
            <ArticleDetail
              id={detail?.id}
              title={detail?.title}
              owner={detail?.owner}
              time={detail?.time}
              content={detail?.content}
              image={detail?.image}
              back={() => setDetail(false)}
            />
          </div>
        ) : aData?.length > 0 ? (
          <div className="flex flex-col items-center w-full [&>*]:my-10">
            {aData?.map((el) => {
              const ownerFind = uData?.find((user) => user.id === el.userID);
              const owner = `${ownerFind?.firstName} ${ownerFind?.lastName}`;
              return (
                <Article
                  key={el.id}
                  id={el.id}
                  title={el.title}
                  owner={owner}
                  time={el.createdAt}
                  open={() =>
                    setDetail({
                      id: el.id,
                      title: el.title,
                      owner,
                      content: el.content,
                      time: el.createdAt,
                      image: el.image,
                    })
                  }
                />
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center text-[3rem] font-['Roboto_Mono',monospace] my-20">
            <p>Žádné články k zobrazení. Obsah bude brzy doplněn!</p>
          </div>
        ))}
    </div>
  );
};

export default Articles;
