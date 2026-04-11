import React from "react";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";

const override = css`
  display: block;
  margin: 0 auto;
`;

const LoadingSpinner = ({ text }) => {
  return (
    <div className='m-10 p-10 flex flex-col items-center'>
      <ClipLoader css={override} size={35} color={"#71a311"} loading={true} />
      <p className='mt-4 font-semibold text-[#71a311]'>{text}</p>
    </div>
  );
};

export default LoadingSpinner;
