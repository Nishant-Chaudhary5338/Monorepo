import React, { useState } from "react";

const PdfCard = ({ pdfFile, openPdf }) => {
  const fileName = pdfFile
    .replace(/^pdf\//, "")
    .replace(/\.pdf$/, "")
    .replace(/\s*\(\d+\)$/, "");

  return (
    <div
      onClick={() => openPdf(pdfFile)}
      className='w-72 h-60 rounded-md bg-teal-50 shadow-xl flex flex-col m-4 hover:scale-105'
    >
      <h3 className='text-xs px-2 rounded-md mt-2 text-white bg-green-500 self-end pr-2'>
        ONLINE
      </h3>
      <img className='mx-2 w-48' src='assets/policy.jpg' alt='' />
      <div className='flex items-center justify-between mx-2'>
        <p className='text-md mt-6 font-semibold'>{fileName}</p>
      </div>
    </div>
  );
};

export default PdfCard;
