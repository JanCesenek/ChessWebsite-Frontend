import { useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Button from "./button";
import { BiSolidSkipPreviousCircle, BiSolidSkipNextCircle } from "react-icons/bi";
import { FaChessBoard } from "react-icons/fa6";
import { MdOutlineReplayCircleFilled } from "react-icons/md";
import { MdPreview } from "react-icons/md";

const STRENGTH_OPTIONS = ["", "??", "?", "?!", "!?", "!", "!!"];

const ChessboardLogic = ({ onInsert, onClose }) => {
  const { lightMode } = useContext(AuthContext);

  const [game, setGame] = useState(new Chess());
  const [moves, setMoves] = useState([]);
  const [comment, setComment] = useState("");
  const [strength, setStrength] = useState("");
  const [currentMove, setCurrentMove] = useState(0);

  const [white, setWhite] = useState("");
  const [black, setBlack] = useState("");
  const [result, setResult] = useState("");

  const [whiteTurn, setWhiteTurn] = useState(true);

  const [isVariationMode, setIsVariationMode] = useState(false);
  const [activeVariation, setActiveVariation] = useState(null);
  const [variationParentIdx, setVariationParentIdx] = useState(null);
  const [variationMoveIdx, setVariationMoveIdx] = useState(0);
  const [variationMoves, setVariationMoves] = useState([]);

  const [defaultMove, setDefaultMove] = useState(0);

  const pgnRef = useRef(null);

  const getFen = () => {
    const game = new Chess();
    if (isVariationMode && activeVariation) {
      // Replay main line up to parentIdx
      for (let i = 0; i < activeVariation.parentIdx; i++) {
        game.move(moves[i].san);
      }
      // Replay variation moves
      for (let i = 0; i < variationMoveIdx; i++) {
        game.move(activeVariation.moves[i].san);
      }
    } else {
      for (let i = 0; i < currentMove; i++) {
        game.move(moves[i].san);
      }
    }
    return game.fen();
  };

  const saveAltLine = () => {
    // Save the variation to the parent move
    const updatedMoves = [...moves];
    if (!updatedMoves[variationParentIdx].variations) {
      updatedMoves[variationParentIdx].variations = [];
    }
    updatedMoves[variationParentIdx].variations.push(variationMoves);
    setMoves(updatedMoves);
    setIsVariationMode(false);
    setVariationParentIdx(null);
    setVariationMoves([]);
    // Reset the board to the main line
    const tempGame = new Chess();
    for (let i = 0; i < currentMove; i++) {
      tempGame.move(updatedMoves[i].san);
    }
    setGame(tempGame);
  };

  const getVariationFen = () => {
    const tempGame = new Chess();
    for (let i = 0; i < variationParentIdx; i++) {
      tempGame.move(moves[i].san);
    }
    for (let i = 0; i < variationMoves.length; i++) {
      tempGame.move(variationMoves[i].san);
    }
    return tempGame.fen();
  };

  const handleVariationMove = (from, to) => {
    const tempGame = new Chess(getVariationFen());
    const move = tempGame.move({ from, to });
    if (move) {
      setVariationMoves([...variationMoves, { san: move.san, comment: "", strength: "" }]);
      setWhiteTurn(!whiteTurn);
    }
  };

  const handleMove = (from, to) => {
    const move = game.move({ from, to });
    if (move) {
      if (isVariationMode) {
        setVariationMoves([...variationMoves, { san: move.san, comment: "", strength: "" }]);
        const tempGame = new Chess(game.fen());
        setGame(tempGame);
        setCurrentMove(variationMoves.length + variationParentIdx + 1);
      } else {
        setMoves([...moves, { san: move.san, comment: "", strength: "" }]);
        setGame(new Chess(game.fen()));
        setCurrentMove(currentMove + 1);
      }
      setWhiteTurn(!whiteTurn);
    }
  };

  const handleAddComment = () => {
    if (isVariationMode) {
      // Add comment/strength to the last move in the variation being created
      if (variationMoves.length > 0) {
        variationMoves[variationMoves.length - 1].comment = comment;
        variationMoves[variationMoves.length - 1].strength = strength;
        setVariationMoves([...variationMoves]);
        setComment("");
        setStrength("");
      }
    } else {
      // Add comment/strength to the last move in the main line
      if (moves.length > 0) {
        moves[currentMove - 1].comment = comment;
        moves[currentMove - 1].strength = strength;
        setMoves([...moves]);
        setComment("");
        setStrength("");
      }
    }
  };

  const handleInsert = () => {
    onInsert({
      moves,
      white,
      black,
      result,
      defaultMove,
    });
    onClose();
    console.log(moves, white, black, result, defaultMove);
  };

  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push([
      moves[i], // White
      moves[i + 1] || {}, // Black (may be undefined)
    ]);
  }

  const deleteLastMove = () => {
    if (moves.length === 0) return;

    if (isVariationMode) {
      // Remove last move in variation mode
      const newVariationMoves = variationMoves.slice(0, -1);
      setVariationMoves(newVariationMoves);
      setCurrentMove(Math.min(currentMove, variationParentIdx + newVariationMoves.length));
      setWhiteTurn(!whiteTurn);
    } else {
      // Remove last move
      const newMoves = moves.slice(0, -1);

      // Create a new Chess instance and replay all moves
      const newGame = new Chess();
      newMoves.forEach((move) => {
        newGame.move(move.san);
      });

      setMoves(newMoves);
      setGame(newGame);
      setCurrentMove(Math.min(currentMove, newMoves.length));
      setWhiteTurn(!whiteTurn);
    }
  };

  const setAltLineForWhite = (idx) => {
    setIsVariationMode(true);
    // Set to position BEFORE this move// One before the white move
    setVariationParentIdx(idx * 2);
    setVariationMoves([]); // Attach to the white move
    const tempGame = new Chess();
    for (let i = 0; i < idx * 2; i++) {
      if (i >= 0) tempGame.move(moves[i].san);
    }
    setGame(tempGame);
    setWhiteTurn(!whiteTurn);
  };

  const setAltLineForBlack = (idx) => {
    setIsVariationMode(true);
    // Set to position BEFORE this move// One before the black move
    setVariationParentIdx(idx * 2 + 1); // Attach to the black move
    const tempGame = new Chess();
    for (let i = 0; i < idx * 2 + 1; i++) {
      tempGame.move(moves[i].san);
    }
    setGame(tempGame);
    setWhiteTurn(!whiteTurn);
  };

  const exitVariationMode = (moveIdx) => {
    setIsVariationMode(false);
    setVariationParentIdx(null);
    setVariationMoves([]);
    setActiveVariation(null);
    setVariationMoveIdx(0);
    setCurrentMove(moveIdx);
    setWhiteTurn(moveIdx % 2 === 0); // true for white, false for black
  };

  const moveColor = (move) => {
    switch (move) {
      case "??":
        return "text-red-600 font-bold";
      case "?":
        return "text-red-500 font-semibold";
      case "?!":
        return "text-orange-500 font-medium";
      case "!?":
        return "text-yellow-500 font-medium";
      case "!":
        return "text-green-500 font-semibold";
      case "!!":
        return "text-green-600 font-bold";
      default:
        break;
    }
  };

  const toCzechSAN = (san) => {
    if (!san) return "";
    return san
      .replace(/K/g, "K") // Král (King) stays K
      .replace(/Q/g, "D") // Dáma (Queen)
      .replace(/R/g, "V") // Věž (Rook)
      .replace(/B/g, "S") // Střelec (Bishop)
      .replace(/N/g, "J"); // Jezdec (Knight)
  };

  const handlePGNImport = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (!file) return;

    const reader = new FileReader();
    console.log(reader);
    reader.onload = (e) => {
      const pgn = e.target.result;
      console.log(typeof pgn);
      console.log("PGN file content:", pgn);
      const chess = new Chess();
      const loaded = chess.loadPgn(pgn);
      console.log("Loaded:", loaded);

      const history = chess.history({ verbose: true });
      console.log("Parsed moves:", history);

      if (history.length === 0) {
        alert("Neplatný PGN soubor!");
        return;
      }

      // Extract moves and metadata
      const movesArr = history.map((move) => ({
        san: move.san,
        comment: "", // You can try to extract comments if needed
        strength: "",
      }));
      console.log("Moves array:", movesArr);

      setMoves(movesArr);
      setGame(new Chess()); // Reset game state
      setCurrentMove(movesArr.length);
      setWhite(chess.header().White || "");
      setBlack(chess.header().Black || "");
      setResult(chess.header().Result || "");
      setWhiteTurn(movesArr.length % 2 === 0);
      setDefaultMove(0);
    };
    reader.readAsText(file);
  };

  const validGame = white && black && result && moves.length > 0;

  return (
    <div
      className={`flex flex-col justify-center p-10 rounded w-[40rem] md:w-[60rem] xl:w-[80rem] border shadow-lg text-[1.5rem] ${
        lightMode
          ? "bg-stone-300 text-stone-800 border-black/50 shadow-black/50"
          : "bg-black text-yellow-100 border-yellow-100/50 shadow-yellow-100/50"
      }`}>
      <div className="flex justify-center items-center w-full">
        <h1 className="text-[4rem] font-bold underline my-10">Vytvoření nové partie</h1>
      </div>
      <div
        className={`w-full p-10 mb-10 rounded-md border flex flex-col [&>*]:my-5 ${
          lightMode ? "border-black/20" : "border-yellow-100/20"
        }`}>
        <div className="flex items-center">
          <label htmlFor="white" className="min-w-[10rem]">
            Bílý:
          </label>
          <input
            type="text"
            id="white"
            name="white"
            className={`border rounded-md shadow-md focus:outline-none p-2 ${
              lightMode
                ? "border-black/50 shadow-black/50 focus:shadow-black"
                : "border-yellow-100/50 shadow-yellow-100/50 focus:shadow-yellow-100"
            }`}
            value={white}
            onChange={(e) => setWhite(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="black" className="min-w-[10rem]">
            Černý:
          </label>
          <input
            type="text"
            id="black"
            name="black"
            className={`border rounded-md shadow-md focus:outline-none p-2 ${
              lightMode
                ? "border-black/50 shadow-black/50 focus:shadow-black"
                : "border-yellow-100/50 shadow-yellow-100/50 focus:shadow-yellow-100"
            }`}
            value={black}
            onChange={(e) => setBlack(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="result" className="min-w-[10rem]">
            Výsledek:
          </label>
          <select
            name="result"
            id="result"
            className={`p-2 rounded-md shadow-md border focus:outline-none ${
              lightMode
                ? "text-black border-black/50 shadow-black/50"
                : "bg-black text-yellow-100 border-yellow-100/50 shadow-yellow-100/50"
            }`}
            value={result}
            onChange={(e) => setResult(e.target.value)}>
            <option value="">---</option>
            <option value="1-0">1-0</option>
            <option value="0-1">0-1</option>
            <option value="1/2">1/2</option>
          </select>
        </div>
      </div>
      {moves.length < 1 && (
        <div className="flex self-center items-center my-20">
          <label
            htmlFor="pgn"
            className={`flex items-center min-w-[15rem] text-[3rem] hover:cursor-pointer border rounded-md p-5 ${
              lightMode ? "border-black/50" : "border-yellow-100/50"
            }`}>
            <FaChessBoard className="mr-2" />
            <span>Nahrát partii</span>
          </label>
          <input
            type="file"
            name="pgn"
            id="pgn"
            accept=".pgn"
            onChange={handlePGNImport}
            className="hidden"
          />
        </div>
      )}
      <div className={`flex ${isVariationMode && "opacity-70 pointer-events-none"}`}>
        <Chessboard position={getFen()} onPieceDrop={handleMove} />
        <div
          className={`w-[2rem] h-[2rem] self-end ml-2 ${
            whiteTurn
              ? `bg-white ${lightMode && "border-2 border-black"}`
              : `bg-black ${!lightMode && "border-2 border-white"}`
          }`}></div>
      </div>
      <div
        className={`my-10 flex gap-2 self-center justify-center w-full ${
          isVariationMode && "opacity-70 pointer-events-none"
        }`}>
        <Button
          click={() => {
            setCurrentMove(Math.max(currentMove - 1, 0));
            setWhiteTurn(!whiteTurn);
          }}
          disabled={currentMove === 0}
          msg={<BiSolidSkipPreviousCircle className="p-2 text-[5rem]" />}
        />
        <Button
          click={() => setCurrentMove(0)}
          disabled={currentMove === 0 || isVariationMode}
          msg={<MdOutlineReplayCircleFilled className="p-2 text-[5rem]" />}
        />
        <Button
          click={() => {
            setCurrentMove(Math.min(currentMove + 1, moves.length));
            setWhiteTurn(!whiteTurn);
          }}
          disabled={currentMove === moves.length}
          msg={<BiSolidSkipNextCircle className="p-2 text-[5rem]" />}
        />
        <Button
          click={() => {
            setDefaultMove(currentMove);
          }}
          disabled={isVariationMode}
          msg={<MdPreview className="p-2 text-[5rem]" />}
        />
      </div>
      <div
        className={`my-10 flex flex-col items-center [&>*]:my-5 py-5 border-y ${
          lightMode ? "border-black/50" : "border-yellow-100/50"
        } ${isVariationMode && "opacity-70 pointer-events-none"}`}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Přidat komentář k poslednímu tahu"
          className="border rounded-md p-5 mr-2 w-full"
        />
        <select
          name="strength"
          id="strength"
          className={`p-5 rounded-md shadow-md focus:outline-none border ${
            lightMode
              ? "text-black border-black/50 shadow-black/50"
              : "text-yellow-100 bg-black border-yellow-100/50 shadow-yellow-100/50"
          }`}
          value={strength}
          onChange={(e) => setStrength(e.target.value)}>
          {STRENGTH_OPTIONS.map((opt) => {
            return (
              <option key={opt} value={opt}>
                {opt || "Normální tah"}
              </option>
            );
          })}
        </select>
        <Button click={handleAddComment} msg={"Přidat komentář/sílu tahu"} />
      </div>
      <div
        className={`flex justify-around flex-wrap gap-y-10 w-full pb-10 border-b ${
          lightMode ? "border-black/50" : "border-yellow-100/50"
        } ${isVariationMode && "opacity-70 pointer-events-none"}`}>
        <Button
          click={handleInsert}
          msg={"Vložit hru"}
          disabled={!validGame}
          classes="!text-[1.5rem]"
        />
        <Button click={onClose} msg={"Zrušit"} classes="!text-[1.5rem]" />
        <Button
          click={deleteLastMove}
          msg={"Smazat poslední tah"}
          disabled={moves.length === 0}
          classes="!text-[1.5rem]"
        />
        {!isVariationMode && (
          <Button
            click={() => {
              if (moves[currentMove - 1]) {
                const updatedMoves = [...moves];
                updatedMoves[currentMove - 1].variations = [];
                setMoves(updatedMoves);
              }
            }}
            msg={"Smazat variantu"}
            disabled={!moves[currentMove - 1]?.variations?.length > 0}
            classes="!text-[1.5rem]"
          />
        )}
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {moves.length !== 0 && (
          <h2 className="text-[2rem] self-center font-bold underline my-5">Tahy:</h2>
        )}
        <div className="flex flex-col">
          {movePairs.map(([white, black], idx) => (
            <div
              key={idx}
              className={`flex flex-wrap items-stretch my-2 ${
                isVariationMode && "opacity-70 pointer-events-none"
              }`}>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="font-bold mr-2">{idx + 1}.</span>
                  {/* White move */}
                  <span
                    className={`flex items-center mr-2 hover:cursor-cell ${
                      currentMove === idx * 2 + 1 && "border border-green-400 p-2"
                    } ${defaultMove === idx * 2 + 1 && "font-black border border-yellow-100 p-2"}`}
                    onClick={() => {
                      setCurrentMove(idx * 2 + 1);
                      setWhiteTurn(false);
                    }}>
                    {toCzechSAN(white?.san)}
                    {white?.strength && (
                      <span className={`ml-1 ${moveColor(white.strength)}`}>{white.strength}</span>
                    )}
                    {white?.comment && (
                      <span className="italic text-yellow-700 ml-1">"{white.comment}"</span>
                    )}
                  </span>
                  <Button
                    click={() => setAltLineForWhite(idx)}
                    msg={<span>&#8595;</span>}
                    classes="!text-[1rem]" // Arrow down
                  />
                </div>
                {white?.variations &&
                  white.variations.map((variation, vIdx) => {
                    let tempIndex = 0;
                    return (
                      <div key={vIdx} className="mx-5 flex flex-wrap items-center">
                        <span className="font-bold">(</span>
                        {variation.map((varMove, mIdx) => {
                          if (mIdx === 0) tempIndex = mIdx + idx + 1;
                          else if (mIdx % 2 === 0) tempIndex++;
                          return (
                            <span key={mIdx} className="mx-2 hover:cursor-pointer">
                              <span className="whitespace-nowrap">
                                {mIdx % 2 === 0 && (
                                  <span className="font-bold mr-2">{tempIndex}.</span>
                                )}
                                {toCzechSAN(varMove.san)}
                                {varMove.strength && (
                                  <span className={moveColor(varMove.strength)}>
                                    {varMove.strength}
                                  </span>
                                )}
                              </span>
                              {varMove.comment && (
                                <span className="italic text-yellow-700 ml-1">
                                  "{varMove.comment}"
                                </span>
                              )}
                            </span>
                          );
                        })}
                        <span className="font-bold">)</span>
                      </div>
                    );
                  })}
              </div>
              {/* Black move */}
              {black?.san && (
                <div className="flex items-center mx-2 hover:cursor-cell">
                  <span
                    className={`flex items-center ${
                      currentMove === idx * 2 + 2 && "border border-green-400 p-2"
                    } ${defaultMove === idx * 2 + 2 && "font-black border border-yellow-100 p-2"}`}
                    onClick={() => {
                      setCurrentMove(idx * 2 + 2);
                      setWhiteTurn(true);
                    }}>
                    {toCzechSAN(black?.san)}
                    {black.strength && (
                      <span className={`ml-1 ${moveColor(black.strength)}`}>{black.strength}</span>
                    )}
                    {black.comment && (
                      <span className="italic text-yellow-700 ml-1">"{black.comment}"</span>
                    )}
                  </span>
                  <Button
                    click={() => setAltLineForBlack(idx)}
                    msg={<span>&#8595;</span>}
                    classes="ml-2 !text-[1rem]"
                  />
                  {black?.variations &&
                    black.variations.map((variation, vIdx) => {
                      let tempIndex = 0;
                      return (
                        <div key={vIdx} className="mx-5 flex flex-wrap items-center">
                          <span className="font-bold">(</span>
                          {variation.map((varMove, mIdx) => {
                            if (mIdx === 0) tempIndex = mIdx + idx + 1;
                            else if (mIdx % 2 === 1) tempIndex++;
                            return (
                              <span key={mIdx} className="mx-2 hover:cursor-pointer">
                                <span className="whitespace-nowrap">
                                  {mIdx === 0 && (
                                    <span className="font-bold mr-2">{tempIndex}...</span>
                                  )}
                                  {mIdx % 2 === 1 && (
                                    <span className="font-bold mr-2">{tempIndex}.</span>
                                  )}
                                  {toCzechSAN(varMove.san)}
                                  {varMove.strength && (
                                    <span className={moveColor(varMove.strength)}>
                                      {varMove.strength}
                                    </span>
                                  )}
                                </span>
                                {varMove.comment && (
                                  <span className="italic text-yellow-700 ml-1">
                                    "{varMove.comment}"
                                  </span>
                                )}
                              </span>
                            );
                          })}
                          <span className="font-bold">)</span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          ))}
          {isVariationMode && (
            <div className="flex flex-col">
              <h2 className="my-5 self-center font-bold">Přidáváte alternativní variantu</h2>
              <div className={`flex`}>
                <Chessboard position={getVariationFen()} onPieceDrop={handleVariationMove} />
                <div
                  className={`w-[2rem] h-[2rem] self-end ml-2 ${
                    whiteTurn ? "bg-white" : "bg-black border-white border-2"
                  }`}></div>
              </div>
              <div className="flex items-center justify-around my-10">
                <Button
                  click={saveAltLine}
                  msg={<span>&#8593; Uložit variantu</span>}
                  disabled={variationMoves?.length === 0}
                />
                <Button
                  click={() => {
                    const moveIdx = activeVariation ? activeVariation.parentIdx + 1 : currentMove;
                    exitVariationMode(moveIdx);
                  }}
                  msg="Zrušit"
                />
                <Button
                  click={deleteLastMove}
                  msg={"Smazat poslední tah"}
                  disabled={moves.length === 0}
                  classes="!text-[1.5rem]"
                />
              </div>
              <div
                className={`my-10 flex flex-col items-center [&>*]:my-5 py-5 border-y ${
                  lightMode ? "border-black/50" : "border-yellow-100/50"
                }`}>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Přidat komentář k poslednímu tahu"
                  className="border rounded-md p-5 mr-2 w-full"
                />
                <select
                  name="strength"
                  id="strength"
                  className={`p-5 rounded-md shadow-md focus:outline-none border ${
                    lightMode
                      ? "text-black border-black/50 shadow-black/50"
                      : "text-yellow-100 bg-black border-yellow-100/50 shadow-yellow-100/50"
                  }`}
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}>
                  {STRENGTH_OPTIONS.map((opt) => {
                    return (
                      <option key={opt} value={opt}>
                        {opt || "Normální tah"}
                      </option>
                    );
                  })}
                </select>
                <Button click={handleAddComment} msg={"Přidat komentář/sílu tahu"} />
              </div>
              <div>
                {variationMoves.map((move, idx) => {
                  const moveNumber = Math.floor(variationParentIdx / 2) + 1 + Math.floor(idx / 2);
                  return (
                    <span key={idx} className="mx-1">
                      <span className="whitespace-nowrap">
                        {idx === 0 && <span className="font-bold mr-2">{moveNumber}...</span>}
                        {idx % 2 === 1 && <span className="font-bold mr-2">{moveNumber}.</span>}
                        {toCzechSAN(move.san)}
                        {move.strength && (
                          <span className={moveColor(move.strength)}>{move.strength}</span>
                        )}
                      </span>
                      {move.comment && (
                        <span className="italic text-yellow-700 ml-1">"{move.comment}"</span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          {result && <div className="mt-4 text-[2rem] font-bold self-center">{result}</div>}
        </div>
      </div>
    </div>
  );
};

export default ChessboardLogic;
