import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Button from "./button";
import { MdOutlineReplayCircleFilled } from "react-icons/md";
import { BiSolidSkipPreviousCircle, BiSolidSkipNextCircle } from "react-icons/bi";
import { FaCircleArrowUp } from "react-icons/fa6";

const ChessboardPreview = ({ moves, white, black, result, defaultMove = 0 }) => {
  const { lightMode } = useContext(AuthContext);

  const [currentMove, setCurrentMove] = useState(defaultMove);

  const [variationMode, setVariationMode] = useState(false); // true if replaying a variation
  const [activeVariation, setActiveVariation] = useState(null);
  const [activeVariationIdx, setActiveVariationIdx] = useState(0); // { moves: [...], parentIdx: ... }
  const [variationMoveIdx, setVariationMoveIdx] = useState(0);

  const [whiteTurn, setWhiteTurn] = useState(defaultMove % 2 === 0);

  const moveRefs = useRef([]);

  useEffect(() => {
    if (!variationMode) {
      // Main line
      const ref = moveRefs.current[currentMove];
      if (ref) ref.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else if (variationMode && activeVariation) {
      // Variation line
      const ref = moveRefs.current[`var-${activeVariation?.parentIdx}-${variationMoveIdx}`];
      if (ref) ref.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentMove, variationMoveIdx, variationMode]);

  useEffect(() => {
    setCurrentMove(defaultMove);
    setWhiteTurn(defaultMove % 2 === 0);
  }, [defaultMove]); // true if it's white's turn

  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push([
      moves[i], // White
      moves[i + 1] || {}, // Black (may be undefined)
    ]);
  }

  const getFen = () => {
    const game = new Chess();
    if (variationMode && activeVariation) {
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

  const getVariationMove = (variation, mIdx, idx, color, vIdx) => {
    setVariationMode(true);
    setActiveVariation({
      moves: variation,
      parentIdx: color === "black" ? idx * 2 + 1 : idx * 2,
    });
    setActiveVariationIdx(vIdx);
    setVariationMoveIdx(mIdx + 1);
    setWhiteTurn(color === "black" ? mIdx % 2 === 0 : mIdx % 2 === 1);
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

  return (
    <div
      className={`my-8 p-20 shadow w-[40rem] md:w-[60rem] 2xl:w-[80rem] rounded-md select-none ${
        lightMode ? "text-black" : "text-yellow-100"
      }`}>
      {/* Player info */}
      <div className="flex flex-col items-center mb-10 [&>*]:my-2 p-5 text-[1.5rem]">
        <h1 className="text-[2rem] italic font-extrabold">
          {white} - {black}
        </h1>
      </div>
      <div className="flex">
        <Chessboard position={getFen()} />
        <div
          className={`w-[2rem] h-[2rem] self-end ml-2 ${
            whiteTurn
              ? `bg-white ${lightMode && "border-2 border-black"}`
              : `bg-black ${!lightMode && "border-2 border-white"}`
          }`}></div>
      </div>
      {/* Buttons navigating the game */}
      <div className="my-10 flex justify-center gap-2">
        {!variationMode ? (
          <>
            <Button
              click={() => {
                setCurrentMove(Math.max(currentMove - 1, 0));
                setWhiteTurn(!whiteTurn);
              }}
              disabled={currentMove === 0}
              msg={<BiSolidSkipPreviousCircle className="p-2 text-[5rem]" />}
            />
            <Button
              click={() => {
                setCurrentMove(0);
                setWhiteTurn(true);
              }}
              disabled={currentMove === 0}
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
          </>
        ) : (
          <>
            <Button
              click={() => {
                setVariationMoveIdx(Math.max(variationMoveIdx - 1, 0));
                setWhiteTurn(!whiteTurn);
              }}
              disabled={variationMoveIdx === 0}
              msg={<BiSolidSkipPreviousCircle className="p-2 text-[5rem]" />}
            />
            <Button
              click={() => {
                setVariationMoveIdx(0);
                setWhiteTurn(true);
              }}
              msg={<MdOutlineReplayCircleFilled className="p-2 text-[5rem]" />}
            />
            <Button
              click={() => {
                setVariationMoveIdx(Math.min(variationMoveIdx + 1, activeVariation.moves.length));
                setWhiteTurn(!whiteTurn);
              }}
              disabled={variationMoveIdx === activeVariation.moves.length}
              msg={<BiSolidSkipNextCircle className="p-2 text-[5rem]" />}
            />
            <Button
              click={() => {
                setVariationMode(false);
                setCurrentMove(activeVariation.parentIdx + 1);
                setWhiteTurn(activeVariation.parentIdx % 2 === 1);
                setActiveVariation(null);
                setVariationMoveIdx(0);
              }}
              msg={<FaCircleArrowUp className="p-2 text-[5rem]" />}
            />
          </>
        )}
      </div>
      {/* Move annotation */}
      <div className="mt-4 flex flex-col gap-2 max-h-[30rem] overflow-y-scroll">
        {movePairs.map(([white, black], idx) => (
          <div
            key={idx}
            className={`flex gap-2 text-[1.5rem] ${
              (white.variations || black.variations || white.comment || black.comment) &&
              "flex-col gap-10"
            }`}>
            <div className="flex items-baseline">
              <span className="font-bold mr-2">{idx + 1}.</span>
              {/* White move */}
              <button
                className={`px-2 py-1 rounded hover:cursor-pointer whitespace-nowrap ${
                  variationMode && "opacity-70 pointer-events-none"
                } ${
                  currentMove === idx * 2 + 1 && !variationMode
                    ? `${lightMode ? "bg-stone-800 text-white" : "bg-yellow-300 text-black"}`
                    : `${lightMode ? "bg-stone-600 text-white" : "bg-gray-800"}`
                }`}
                ref={(el) => (moveRefs.current[idx * 2 + 1] = el)}
                onClick={() => {
                  setCurrentMove(idx * 2 + 1);
                  setWhiteTurn(false);
                }}>
                {toCzechSAN(white?.san)}
                {white?.strength && (
                  <span className={`ml-1 ${moveColor(white.strength)}`}>{white.strength}</span>
                )}
              </button>
              {white?.comment && (
                <span className={`italic mx-5 ${lightMode ? "text-stone-700" : "text-yellow-200"}`}>
                  "{white.comment}"
                </span>
              )}
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
                      const isLast = mIdx === variation.length - 1;
                      return (
                        <span key={mIdx} className="mx-2">
                          {mIdx % 2 === 0 && <span className="font-bold mr-2">{tempIndex}.</span>}
                          <span
                            className={`whitespace-nowrap hover:cursor-pointer ${
                              variationMode &&
                              variationMoveIdx - 1 === mIdx &&
                              activeVariationIdx === vIdx &&
                              activeVariation &&
                              activeVariation.parentIdx === idx * 2 &&
                              `p-2 rounded-md ${lightMode ? "bg-stone-200" : "bg-yellow-300"}`
                            }`}
                            ref={(el) => (moveRefs.current[`var-${idx * 2}-${mIdx}`] = el)}
                            onClick={() => getVariationMove(variation, mIdx, idx, "white", vIdx)}>
                            {toCzechSAN(varMove.san)}
                            {varMove.strength && (
                              <span className={moveColor(varMove.strength)}>
                                {varMove.strength}
                              </span>
                            )}
                          </span>
                          {varMove.comment && (
                            <span className="italic text-yellow-700 ml-2">"{varMove.comment}"</span>
                          )}
                          {isLast && <span className="font-bold ml-2">)</span>}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            {/* Black move */}
            {black?.san && (
              <>
                <div className="flex items-baseline">
                  {(white?.variations || white?.comment || black?.variations || black?.comment) && (
                    <span className="font-bold mr-2">{idx + 1}...</span>
                  )}
                  <button
                    className={`px-2 py-1 rounded hover:cursor-pointer whitespace-nowrap ${
                      variationMode && "opacity-70 pointer-events-none"
                    } ${
                      currentMove === idx * 2 + 2 && !variationMode
                        ? `${lightMode ? "bg-stone-800 text-white" : "bg-yellow-300 text-black"}`
                        : `${lightMode ? "bg-stone-600 text-white" : "bg-gray-800"}`
                    }`}
                    ref={(el) => (moveRefs.current[idx * 2 + 2] = el)}
                    onClick={() => {
                      setCurrentMove(idx * 2 + 2);
                      setWhiteTurn(true);
                    }}>
                    {toCzechSAN(black?.san)}
                    {black?.strength && (
                      <span className={`ml-1 ${moveColor(black.strength)}`}>{black.strength}</span>
                    )}
                  </button>
                  {black?.comment && (
                    <span
                      className={`italic mx-5 ${lightMode ? "text-stone-700" : "text-yellow-200"}`}>
                      "{black.comment}"
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  {black?.variations &&
                    black.variations.map((variation, vIdx) => {
                      let tempIndex = 0;
                      return (
                        <div key={vIdx} className="mx-5 flex flex-wrap items-center">
                          <span className="font-bold">(</span>
                          {variation.map((varMove, mIdx) => {
                            if (mIdx === 0) tempIndex = mIdx + idx + 1;
                            else if (mIdx % 2 === 1) tempIndex++;
                            const isLast = mIdx === variation.length - 1;
                            return (
                              <span key={mIdx} className="mx-2">
                                {mIdx === 0 && (
                                  <span className="font-bold mr-2">{tempIndex}...</span>
                                )}
                                {mIdx % 2 === 1 && (
                                  <span className="font-bold mr-2">{tempIndex}.</span>
                                )}
                                <span
                                  className={`whitespace-nowrap hover:cursor-pointer ${
                                    variationMode &&
                                    variationMoveIdx - 1 === mIdx &&
                                    activeVariationIdx === vIdx &&
                                    activeVariation &&
                                    activeVariation.parentIdx === idx * 2 + 1 &&
                                    "bg-yellow-300"
                                  }`}
                                  ref={(el) =>
                                    (moveRefs.current[`var-${idx * 2 + 1}-${mIdx}`] = el)
                                  }
                                  onClick={() =>
                                    getVariationMove(variation, mIdx, idx, "black", vIdx)
                                  }>
                                  {toCzechSAN(varMove.san)}
                                  {varMove.strength && (
                                    <span className={moveColor(varMove.strength)}>
                                      {varMove.strength}
                                    </span>
                                  )}
                                </span>
                                {varMove.comment && (
                                  <span className="italic text-yellow-700 ml-2">
                                    "{varMove.comment}"
                                  </span>
                                )}
                                {isLast && <span className="font-bold ml-2">)</span>}
                              </span>
                            );
                          })}
                          <span className="font-bold whitespace-nowrap">)</span>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </div>
        ))}
        {result && (
          <div
            className={`mt-4 text-[2rem] font-bold self-center ${
              lightMode ? "text-stone-700" : "text-yellow-200"
            }`}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChessboardPreview;
