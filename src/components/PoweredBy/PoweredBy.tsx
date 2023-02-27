import React from "react";

const PoweredBy = () => {
  return (
    <>
      <div className="hidden md:block absolute right-4 bottom-3 ">
        <a
          href="https://filecoin.io/"
          target="_blank"
          rel="noreferrer"
          className="underline text-blue-700"
        >
          Powered By Filecoin
        </a>
      </div>
    </>
  );
};

export default PoweredBy;
