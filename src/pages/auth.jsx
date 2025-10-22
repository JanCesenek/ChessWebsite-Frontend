import { useState, useContext, useEffect } from "react";
import Login from "../components/login";
import Signup from "../components/signup";
import { AuthContext } from "../context/AuthContext";
import { api } from "../core/api";
import { useUpdate } from "../hooks/use-update";
import Button from "../components/button";
import ArticleDetail from "../components/articleDetail";
import Article from "../components/article";

const Auth = () => {
  const [newAccount, setNewAccount] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [detail, setDetail] = useState(false);

  const { curUser, logOut, notifyContext } = useContext(AuthContext);

  const { data: uData, refetch: uRefetch, isLoading: uLoading } = useUpdate("/users");
  const { data: aData, refetch: aRefetch, isLoading: aLoading } = useUpdate("/articles");

  const articleOwner = uData?.find((user) => user.username === curUser);

  const ownArticles = aData?.filter((article) => article.userID === articleOwner?.id);

  useEffect(() => {
    const fetchAll = async () => {
      await uRefetch();
      await aRefetch();
    };
    fetchAll();
  }, []);

  const removeBearerToken = () => {
    delete api.defaults.headers.common["Authorization"];
  };

  const handleLogOut = () => {
    removeBearerToken();
    logOut();
    setNewAccount(!newAccount);
  };

  const deleteArticle = async (id) => {
    if (window.confirm("Opravdu chcete tento článek smazat?")) {
      setSubmitting(true);
      await api
        .delete(`/articles/${id}`)
        .then(async () => {
          await aRefetch();
          notifyContext("Článek byl úspěšně smazán", "success");
        })
        .catch((err) => {
          console.log(`Delete req - ${err}`);
          notifyContext("Oops, něco se pokazilo", "error");
        })
        .finally(() => {
          setSubmitting(false);
          setDetail(false);
        });
    }
  };

  const loading = uLoading || aLoading;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`flex flex-col items-center w-full ${
        submitting && "pointer-events-none opacity-70"
      }`}>
      {curUser ? (
        <div className="flex flex-col items-center w-full">
          {detail ? (
            <ArticleDetail
              id={detail?.id}
              title={detail?.title}
              owner={detail?.owner}
              content={detail?.content}
              time={detail?.time}
              image={detail?.image}
              own
              back={() => setDetail(false)}
              remove={() => deleteArticle(detail?.id)}
              refetch={aRefetch}
            />
          ) : (
            <div className="flex flex-col items-center w-full [&>*]:my-10">
              {ownArticles?.map((el) => {
                const owner = `${articleOwner?.firstName} ${articleOwner?.lastName}`;
                return (
                  <Article
                    key={el.id}
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
          )}
          <Button msg={"Odhlásit se"} click={handleLogOut} classes="my-20" />
        </div>
      ) : newAccount ? (
        <Signup swap={() => setNewAccount(false)} />
      ) : (
        <Login swap={() => setNewAccount(true)} />
      )}
    </div>
  );
};

export default Auth;
