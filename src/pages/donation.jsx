import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Donation = () => {
  const { lightMode } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div
        className={`flex flex-col items-center w-[min(120rem,80%)] p-10 rounded-lg shadow-lg my-20 text-[2.5rem] [&>*]:my-20 ${
          lightMode ? "bg-stone-300/90 shadow-black/50" : "bg-black/80 shadow-yellow-100/50"
        }`}>
        <h2>
          Národní sportovní agentura, poskytla v roce 2026 finanční dotaci TJ Chrudim, z. s. Sp. Zn.
          NSA-00798/2025/2608 ve výši 76700,- Kč. Účel dotace - zajištění materiálního zabezpečení a
          trenérské podpory mladých šachistů.
        </h2>
      </div>
    </div>
  );
};

export default Donation;
