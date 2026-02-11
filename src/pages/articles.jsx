import { useRef, useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { GiClick } from "react-icons/gi";
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
  const [category, setCategory] = useState("");
  const [round, setRound] = useState("");
  const [teams, setTeams] = useState("");
  const [season, setSeason] = useState("");
  const [image, setImage] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [addArticle, setAddArticle] = useState(false);

  const [filter, setFilter] = useState("");
  const [filterRound, setFilterRound] = useState("");
  const [filterTeams, setFilterTeams] = useState("");
  const [filterSeason, setFilterSeason] = useState("");

  const [detail, setDetail] = useState(false);

  const [showStream, setShowStream] = useState(false);

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

  const resetFilter = () => {
    setFilter("");
    setFilterRound("");
    setFilterTeams("");
    setFilterSeason("");
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
      category,
      round,
      teams,
      season,
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
      {!addArticle &&
        !detail &&
        (showStream ? (
          <div className="flex flex-col items-center w-full my-10">
            <Article announcement close={() => setShowStream(false)} />
          </div>
        ) : (
          <div
            className={`flex items-center mb-28 p-5 shadow-md [&>*]:mx-2 ${
              lightMode ? "bg-stone-300/90 shadow-black" : "bg-black shadow-yellow-100"
            }`}>
            <p className="text-[1.5rem]">Živý přenos domácích utkání zde:</p>
            <GiClick
              className="hover:cursor-pointer animate-pulse text-[4rem]"
              onClick={() => setShowStream(true)}
            />
          </div>
        ))}
      {userData && !detail && !showStream && (
        <Button
          msg={addArticle ? "Zavřít editor" : "Přidat článek"}
          click={() => setAddArticle(!addArticle)}
          classes="my-10"
        />
      )}
      {!addArticle && !detail && !showStream && (
        <div
          className={`flex flex-col md:flex-row items-center p-5 my-20 shadow-md [&>*]:mx-2 text-[1.5rem] ${
            lightMode ? "bg-stone-300/90 shadow-black" : "bg-black shadow-yellow-100"
          }`}>
          <div className="flex items-center my-5 [&>*]:px-2">
            <label htmlFor="category">Kategorie:</label>
            <select
              name="category"
              id="category"
              className={`px-5 border shadow-md rounded-md focus:outline-none ${
                lightMode
                  ? "border-black/20 shadow-black/50 [&>*]:bg-stone-300/90"
                  : "border-yellow-100/20 shadow-yellow-100/50 [&>*]:bg-black"
              }`}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}>
              <option value="">---</option>
              <option value="2. liga">2. liga</option>
              <option value="KP1">KP1</option>
              <option value="KP2">KP2</option>
            </select>
          </div>
          <div className="flex items-center my-5 [&>*]:px-2">
            <label htmlFor="filterRound">Kolo: </label>
            <select
              name="filterRound"
              id="filterRound"
              className={`px-5 border shadow-md rounded-md focus:outline-none ${
                lightMode
                  ? "border-black/20 shadow-black/50 [&>*]:bg-stone-300/90"
                  : "border-yellow-100/20 shadow-yellow-100/50 [&>*]:bg-black"
              }`}
              value={filterRound}
              onChange={(e) => setFilterRound(e.target.value)}>
              <option value="">---</option>
              <option value="1.">1.</option>
              <option value="2.">2.</option>
              <option value="3.">3.</option>
              <option value="4.">4.</option>
              <option value="5.">5.</option>
              <option value="6.">6.</option>
              <option value="7.">7.</option>
              <option value="8.">8.</option>
              <option value="9.">9.</option>
              <option value="10.">10.</option>
              <option value="11.">11.</option>
            </select>
          </div>
          <div className="flex items-center my-5 [&>*]:px-2">
            <label htmlFor="filterTeams">Týmy: </label>
            <input
              type="text"
              id="filterTeams"
              name="filterTeams"
              className={`bg-transparent border shadow-md focus:outline-none rounded-md ${
                lightMode
                  ? "border-black/20 shadow-black/50 focus:shadow-black"
                  : " border-yellow-100/20 shadow-yellow-100/50 focus:shadow-yellow-100"
              }`}
              value={filterTeams}
              onChange={(e) => setFilterTeams(e.target.value)}
            />
          </div>
          <div className="flex items-center my-5 [&>*]:px-2">
            <label htmlFor="filterSeason">Sezóna:</label>
            <select
              name="filterSeason"
              id="filterSeason"
              className={`px-5 border shadow-md rounded-md focus:outline-none ${
                lightMode
                  ? "border-black/20 shadow-black/50 [&>*]:bg-stone-300/90"
                  : "border-yellow-100/20 shadow-yellow-100/50 [&>*]:bg-black"
              }`}
              value={filterSeason}
              onChange={(e) => setFilterSeason(e.target.value)}>
              <option value="">---</option>
              <option value="2024/2025">2024/2025</option>
              <option value="2025/2026">2025/2026</option>
              <option value="2026/2027">2026/2027</option>
            </select>
          </div>
          <Button
            msg="Reset"
            classes="mx-0 md:!mx-10 my-5 md:my-0 !text-[1.5rem]"
            click={resetFilter}
          />
        </div>
      )}
      {addArticle && !showStream && (
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
          <div className="flex items-center [&>*]:px-5 text-[2rem] md:text-[3rem]">
            <label htmlFor="category">Kategorie:</label>
            <select
              name="category"
              id="category"
              className={`px-5 border shadow-md rounded-md focus:outline-none ${
                lightMode
                  ? "border-black/20 shadow-black/50 [&>*]:bg-stone-300/90"
                  : "border-yellow-100/20 shadow-yellow-100/50 [&>*]:bg-black"
              }`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}>
              <option value="">---</option>
              <option value="2. liga">2. liga</option>
              <option value="KP1">KP1</option>
              <option value="KP2">KP2</option>
            </select>
          </div>
          <div className="flex items-center my-5 [&>*]:px-5 text-[2rem] md:text-[3rem]">
            <label htmlFor="round">Kolo:</label>
            <select
              name="round"
              id="round"
              className={`px-5 border shadow-md rounded-md focus:outline-none ${
                lightMode
                  ? "border-black/20 shadow-black/50 [&>*]:bg-stone-300/90"
                  : "border-yellow-100/20 shadow-yellow-100/50 [&>*]:bg-black"
              }`}
              value={round}
              onChange={(e) => setRound(e.target.value)}>
              <option value="">---</option>
              <option value="1.">1.</option>
              <option value="2.">2.</option>
              <option value="3.">3.</option>
              <option value="4.">4.</option>
              <option value="5.">5.</option>
              <option value="6.">6.</option>
              <option value="7.">7.</option>
              <option value="8.">8.</option>
              <option value="9.">9.</option>
              <option value="10.">10.</option>
              <option value="11.">11.</option>
            </select>
          </div>
          <div className="flex items-center my-5 [&>*]:px-5 text-[2rem] md:text-[3rem]">
            <label htmlFor="teams">Týmy:</label>
            <input
              type="text"
              id="teams"
              name="teams"
              className={`bg-transparent border shadow-md focus:outline-none rounded-md ${
                lightMode
                  ? "border-black/20 shadow-black/50 focus:shadow-black"
                  : " border-yellow-100/20 shadow-yellow-100/50 focus:shadow-yellow-100"
              }`}
              value={teams}
              onChange={(e) => setTeams(e.target.value)}
            />
          </div>
          <div className="flex items-center my-5 [&>*]:px-5 text-[2rem] md:text-[3rem]">
            <label htmlFor="season">Sezóna:</label>
            <select
              name="season"
              id="season"
              className={`px-5 border shadow-md rounded-md focus:outline-none ${
                lightMode
                  ? "border-black/20 shadow-black/50 [&>*]:bg-stone-300/90"
                  : "border-yellow-100/20 shadow-yellow-100/50 [&>*]:bg-black"
              }`}
              value={season}
              onChange={(e) => setSeason(e.target.value)}>
              <option value="">---</option>
              <option value="2024/2025">2024/2025</option>
              <option value="2025/2026">2025/2026</option>
              <option value="2026/2027">2026/2027</option>
            </select>
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
        !showStream &&
        (detail ? (
          <div className="flex justify-center w-full my-20">
            <ArticleDetail
              id={detail?.id}
              title={detail?.title}
              owner={detail?.owner}
              round={detail?.round}
              teams={detail?.teams}
              time={detail?.time}
              content={detail?.content}
              image={detail?.image}
              season={detail?.season}
              back={() => setDetail(false)}
            />
          </div>
        ) : aData?.length > 0 ? (
          <div className="flex flex-col items-center w-full [&>*]:my-10">
            {aData?.map((el) => {
              const ownerFind = uData?.find((user) => user.id === el.userID);
              const owner = `${ownerFind?.firstName} ${ownerFind?.lastName}`;
              const articleTemplate = (
                <Article
                  key={el.id}
                  id={el.id}
                  title={el.title}
                  category={el.category}
                  round={el.round}
                  teams={el.teams}
                  season={el.season}
                  owner={owner}
                  time={el.createdAt}
                  open={() =>
                    setDetail({
                      id: el.id,
                      title: el.title,
                      owner,
                      content: el.content,
                      round: el.round,
                      teams: el.teams,
                      season: el.season,
                      time: el.createdAt,
                      image: el.image,
                    })
                  }
                />
              );
              if (filter) {
                if (filterRound) {
                  if (filterTeams) {
                    if (filterSeason) {
                      if (
                        el.category === filter &&
                        el.round === filterRound &&
                        el.teams?.toLowerCase().includes(filterTeams?.toLowerCase()) &&
                        el.season === filterSeason
                      ) {
                        return articleTemplate;
                      }
                    } else {
                      if (
                        el.category === filter &&
                        el.round === filterRound &&
                        el.teams?.toLowerCase().includes(filterTeams?.toLowerCase())
                      ) {
                        return articleTemplate;
                      }
                    }
                  } else if (!filterTeams && filterSeason) {
                    if (
                      el.category === filter &&
                      el.round === filterRound &&
                      el.season === filterSeason
                    ) {
                      return articleTemplate;
                    }
                  } else {
                    if (el.category === filter && el.round === filterRound) {
                      return articleTemplate;
                    }
                  }
                } else if (filterTeams) {
                  if (filterSeason) {
                    if (
                      el.category === filter &&
                      el.teams?.toLowerCase().includes(filterTeams?.toLocaleLowerCase()) &&
                      el.season === filterSeason
                    ) {
                      return articleTemplate;
                    }
                  } else {
                    if (
                      el.category === filter &&
                      el.teams?.toLowerCase().includes(filterTeams?.toLocaleLowerCase())
                    ) {
                      return articleTemplate;
                    }
                  }
                } else if (filterSeason) {
                  if (el.category === filter && el.season === filterSeason) {
                    return articleTemplate;
                  }
                } else {
                  if (el.category === filter) {
                    return articleTemplate;
                  }
                }
              } else if (filterRound) {
                if (filterTeams) {
                  if (filterSeason) {
                    if (
                      el.round === filterRound &&
                      el.teams?.toLowerCase().includes(filterTeams?.toLocaleLowerCase()) &&
                      el.season === filterSeason
                    ) {
                      return articleTemplate;
                    }
                  } else {
                    if (
                      el.round === filterRound &&
                      el.teams?.toLowerCase().includes(filterTeams?.toLocaleLowerCase())
                    ) {
                      return articleTemplate;
                    }
                  }
                } else if (filterSeason) {
                  if (el.round === filterRound && el.season === filterSeason) {
                    return articleTemplate;
                  }
                } else {
                  if (el.round === filterRound) {
                    return articleTemplate;
                  }
                }
              } else if (filterTeams) {
                if (filterSeason) {
                  if (
                    el.teams?.toLowerCase().includes(filterTeams?.toLocaleLowerCase()) &&
                    el.season === filterSeason
                  ) {
                    return articleTemplate;
                  }
                } else {
                  if (el.teams?.toLowerCase().includes(filterTeams?.toLocaleLowerCase())) {
                    return articleTemplate;
                  }
                }
              } else if (filterSeason) {
                if (el.season === filterSeason) {
                  return articleTemplate;
                }
              } else return articleTemplate;
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
