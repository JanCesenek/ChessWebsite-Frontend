import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Form } from "react-router-dom";
import { api } from "../core/api";
import { useUpdate } from "../hooks/use-update";
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from "react-icons/fa";
import { FaRegHourglassHalf } from "react-icons/fa6";
import Button from "./button";
import UseInput from "../hooks/use-input";

const Signup = ({ swap }) => {
  const {
    value: firstNameValue,
    isValid: firstNameIsValid,
    hasError: firstNameHasError,
    changeHandler: firstNameChangeHandler,
    blurHandler: firstNameBlurHandler,
    reset: firstNameReset,
  } = UseInput((value) => /^\p{L}+$/u.test(value) && value.length >= 2 && value.length <= 30);

  const {
    value: lastNameValue,
    isValid: lastNameIsValid,
    hasError: lastNameHasError,
    changeHandler: lastNameChangeHandler,
    blurHandler: lastNameBlurHandler,
    reset: lastNameReset,
  } = UseInput((value) => /^\p{L}+$/u.test(value) && value.length >= 2 && value.length <= 30);

  const {
    value: usernameValue,
    isValid: usernameIsValid,
    hasError: usernameHasError,
    changeHandler: usernameChangeHandler,
    blurHandler: usernameBlurHandler,
    reset: usernameReset,
  } = UseInput(
    (value) =>
      value.length >= 6 &&
      value.length <= 16 &&
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value) &&
      /[0-9]/.test(value) &&
      /^[A-Za-z0-9]+$/.test(value)
  );

  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    changeHandler: passwordChangeHandler,
    blurHandler: passwordBlurHandler,
    reset: passwordReset,
  } = UseInput(
    (value) =>
      value.length >= 8 &&
      value.length <= 16 &&
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value) &&
      /[0-9]/.test(value) &&
      /[$&+,:;=?@#|'"<>.⌃*()%!-_]/.test(value)
  );

  const { lightMode, logIn, notifyContext } = useContext(AuthContext);

  const [submitting, setSubmitting] = useState(false);
  const [rules, setRules] = useState(false);

  const [secretValue, setSecretValue] = useState("");

  const { refetch } = useUpdate("/users");

  const addBearerToken = (token) => {
    if (!token) {
      console.log("Token can't be undefined or null.");
      return;
    }
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const resetForm = () => {
    firstNameReset();
    lastNameReset();
    usernameReset();
    passwordReset();
  };

  const createNewUser = async () => {
    const firstName = firstNameValue[0]?.toUpperCase() + firstNameValue?.slice(1).toLowerCase();
    const lastName = lastNameValue[0]?.toUpperCase() + lastNameValue?.slice(1).toLowerCase();

    const postReqPayload = {
      firstName,
      lastName,
      username: usernameValue,
      password: passwordValue,
    };
    setSubmitting(true);
    await api
      .post("/signup", postReqPayload)
      .then(async (res) => {
        await refetch();
        const token = res.data.auth.token;
        localStorage.setItem("token", token);
        logIn(username);
        addBearerToken(token);
        notifyContext("Signed up successfully!", "success");
      })
      .catch((err) => {
        console.log(`Post req - ${err}`);
        notifyContext("Invalid credentials!", "error");
      })
      .finally(() => {
        setSubmitting(false);
        swap();
        resetForm();
      });
  };

  const validForm =
    firstNameIsValid &&
    lastNameIsValid &&
    usernameIsValid &&
    passwordIsValid &&
    secretValue === import.meta.env.VITE_SECRET_VALUE;

  return (
    <div
      className={`w-[80%] sm:w-full min-h-screen flex flex-col items-center rounded-md my-20 sm:my-0 p-10 [&>*]:my-5 [&>*]:rounded-md [&>*]:p-5 ${
        lightMode ? "text-black" : "text-yellow-100"
      } ${submitting && "opacity-70 pointer-events-none"} `}>
      <div
        className={`w-[50rem] flex flex-col items-center p-10 mt-20 [&>*]:my-5 rounded-md shadow-md ${
          lightMode ? "bg-stone-300 shadow-black" : "bg-black shadow-yellow-100"
        }`}>
        <Form className="flex flex-col [&>*]:my-5 text-[2rem]">
          <div className="flex flex-col">
            <h2 className="flex self-center items-center [&>*]:mx-2">
              <span>Pravidla pro vytvoření účtu: {rules ? "(Schovej)" : "(Ukaž)"}</span>
              {rules ? (
                <FaArrowAltCircleUp
                  className="animate-pulse hover:cursor-pointer"
                  onClick={() => setRules(false)}
                />
              ) : (
                <FaArrowAltCircleDown
                  className="animate-bounce hover:cursor-pointer"
                  onClick={() => setRules(true)}
                />
              )}
            </h2>
            {rules && (
              <>
                <p>Jméno/příjmení: pouze písmena povolena, 2-30 znaků</p>
                <p>
                  Uživatelské jméno: bez diakritiky, aspoň jedno velké, jedno malé písmeno a číslo.
                  6-16 znaků
                </p>
                <p>
                  Heslo: bez diakritiky, aspoň jedno velké, jedno malé písmeno, jedno číslo a jeden
                  speciální znak. 8-16 znaků
                </p>
              </>
            )}
          </div>
          <div className="flex justify-between">
            <label htmlFor="firstName">Jméno:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstNameValue}
              onChange={firstNameChangeHandler}
              onBlur={firstNameBlurHandler}
              className={`bg-transparent rounded-md border shadow-md focus:shadow-red-600 focus:outline-none ${
                firstNameHasError && "animate-pulse !border-red-500"
              } ${
                lightMode
                  ? "border-black/20 shadow-black/50"
                  : "border-yellow-100/20 shadow-yellow-100/50"
              } `}
            />
          </div>
          <div className="flex justify-between">
            <label htmlFor="lastName">Příjmení:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastNameValue}
              onChange={lastNameChangeHandler}
              onBlur={lastNameBlurHandler}
              className={`bg-transparent rounded-md border shadow-md focus:shadow-red-600 focus:outline-none ${
                lastNameHasError && "animate-pulse !border-red-500"
              } ${
                lightMode
                  ? "border-black/20 shadow-black/50"
                  : "border-yellow-100/20 shadow-yellow-100/50"
              } `}
            />
          </div>
          <div className="flex justify-between">
            <label htmlFor="username">Uživatelské jméno:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={usernameValue}
              onChange={usernameChangeHandler}
              onBlur={usernameBlurHandler}
              className={`bg-transparent rounded-md border shadow-md focus:shadow-red-600 focus:outline-none ${
                usernameHasError && "animate-pulse !border-red-500"
              } ${
                lightMode
                  ? "border-black/20 shadow-black/50"
                  : "border-yellow-100/20 shadow-yellow-100/50"
              } `}
            />
          </div>
          <div className="flex justify-between">
            <label htmlFor="password">Heslo:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={passwordValue}
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
              className={`bg-transparent rounded-md border shadow-md focus:shadow-red-600 focus:outline-none ${
                passwordHasError && "animate-pulse !border-red-500"
              } ${
                lightMode
                  ? "border-black/20 shadow-black/50"
                  : "border-yellow-100/20 shadow-yellow-100/50"
              } `}
            />
          </div>
          <div className="flex justify-between">
            <label htmlFor="secret">Tajný kód:</label>
            <input
              type="password"
              id="secret"
              name="secret"
              value={secretValue}
              onChange={(e) => setSecretValue(e.target.value)}
              className={`bg-transparent rounded-md border shadow-md focus:shadow-red-600 focus:outline-none ${
                lightMode
                  ? "border-black/20 shadow-black/50"
                  : "border-yellow-100/20 shadow-yellow-100/50"
              } `}
            />
          </div>
          <Button
            msg={
              submitting ? (
                <div className="flex items-center">
                  <span>Vytváření účtu...</span>
                  <FaRegHourglassHalf className="animate-spin ml-2" />
                </div>
              ) : (
                "Vytvořit účet"
              )
            }
            click={createNewUser}
            disabled={!validForm || submitting}
            classes={`${(!validForm || submitting) && "cursor-not-allowed opacity-50"} self-center`}
          />
          <p className="underline hover:cursor-pointer" onClick={swap}>
            Máte již účet? Klikněte zde pro přihlášení.
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
