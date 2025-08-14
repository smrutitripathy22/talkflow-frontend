import React from "react";
import { ClipLoader } from "react-spinners";

const Loader = ({ loading = false }) => {
  if (!loading) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex flex-col items-center space-y-4">
        <ClipLoader color="#701a75" size={70} /> {/* fuchsia-500 */}
        <p className="text-fuchsia-900 font-semibold animate-pulse">
          Almost Done... please wait
        </p>
      </div>
    </div>
  );
};

export default Loader;
