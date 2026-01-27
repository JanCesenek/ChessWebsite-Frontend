import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Form } from "react-router-dom";
import { api } from "../core/api";
import Button from "./button";
import { FaRegHourglassHalf } from "react-icons/fa6";

const Login = ({ swap }) => {
  const { lightMode, logIn, notifyContext } = useContext(AuthContext);

  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addBearerToken = (token) => {
    if (!token) {
      console.log("Token can't be undefined or null!");
      return;
    }
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const handleLogIn = async () => {
    setSubmitting(true);
    await api
      .post("/login", { username: loginDetails?.username, password: loginDetails?.password })
      .then((res) => {
        const token = res.data.auth.token;
        localStorage.setItem("token", token);
        logIn(loginDetails?.username);
        addBearerToken(token);
        notifyContext("Úspěšně přihlášen!", "success");
      })
      .catch((err) => {
        console.log(`Invalid credentials - ${err}`);
        notifyContext("Špatné údaje!", "error");
      })
      .finally(() => {
        setSubmitting(false);
        swap();
      });
  };

  return (
    <div
      className={`w-[80%] sm:w-full min-h-screen flex flex-col items-center my-20 sm:my-0 p-10 [&>*]:my-5 [&>*]:rounded-md [&>*]:p-5 ${
        submitting && "opacity-70 pointer-events-none"
      } `}>
      <div className="w-[50rem]">
        <Form
          className={`flex flex-col items-center p-10 mt-20 [&>*]:my-5 rounded-md shadow-md text-[1.7rem] ${
            lightMode
              ? "bg-stone-300 text-black shadow-black"
              : "bg-black text-yellow-100 shadow-yellow-100"
          } `}>
          <div className="w-full flex justify-between">
            <label htmlFor="username">Uživatelské jméno:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={loginDetails.username}
              onChange={handleChange}
              className={`bg-transparent rounded-md border shadow-md focus:outline-none ${
                lightMode
                  ? "border-black/20 shadow-black/50 focus:shadow-black"
                  : "border-yellow-100/20 shadow-yellow-100/50 focus:shadow-yellow-100"
              }`}
            />
          </div>
          <div className="w-full flex justify-between">
            <label htmlFor="password">Heslo:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginDetails.password}
              onChange={handleChange}
              className={`bg-transparent rounded-md border shadow-md focus:outline-none ${
                lightMode
                  ? "border-black/20 shadow-black/50 focus:shadow-black"
                  : "border-yellow-100/20 shadow-yellow-100/50 focus:shadow-yellow-100"
              }`}
            />
          </div>
          <Button
            msg={
              submitting ? (
                <div className="flex items-center">
                  <span>Přihlašování...</span>
                  <FaRegHourglassHalf className="animate-spin ml-2" />
                </div>
              ) : (
                "Přihlásit se"
              )
            }
            click={handleLogIn}
            disabled={submitting || (!loginDetails.username && !loginDetails.password)}
            classes={
              (submitting || (!loginDetails.username && !loginDetails.password)) &&
              "cursor-not-allowed opacity-50"
            }
          />
          <p className="underline hover:cursor-pointer" onClick={swap}>
            Nemáte účet? Klikněte zde pro registraci.
          </p>
          <p className={lightMode ? "text-red-600" : "text-yellow-400"}>
            Účet slouží pouze k vytváření/spravování článků, nic pro běžné uživatele.
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Login;
