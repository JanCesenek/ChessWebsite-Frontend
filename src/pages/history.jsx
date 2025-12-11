import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const History = () => {
  const { lightMode } = useContext(AuthContext);

  return (
    <div className="min-h-screen">
      <div className="flex justify-center items-center text-[3rem] font-['Roboto_Mono',monospace]">
        <p
          className={`p-5 rounded-md shadow-md border max-w-[80%] ${
            lightMode
              ? "bg-white/80 border-black/20 shadow-black/50"
              : "bg-black/80 border-yellow-100/20 shadow-yellow-100/50"
          }`}>
          Obsah bude zanedlouho doplněn, stránka je ve fázi vývoje.
        </p>
      </div>
    </div>
  );
};

export default History;
