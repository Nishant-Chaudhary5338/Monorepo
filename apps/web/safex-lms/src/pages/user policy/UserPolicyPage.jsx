import React, { useEffect, useState } from "react";
import PdfCard from "../../components/PdfCard";
import PdfViewer from "../../components/PdfViewer";

const UserPolicyPage = () => {
  const [selectedPdf, setSelectedPdf] = useState(null);

  const pdfFiles = [
    "pdf/Acceptable Usage Policy (1).pdf",
    "pdf/Change Management Policy (1).pdf",
    "pdf/Data Breach Notification Procedure (1).pdf",
    "pdf/Data Retention Policy (1).pdf",
    "pdf/Data Security Clause (1).pdf",
    "pdf/Identity & Access Management (1).pdf",
    "pdf/Incident Management Policy (1).pdf",
    "pdf/Information Security Policy (1).pdf",
    "pdf/IT Asset Disposal Policy (1).pdf",
  ];

  const openPdf = (pdfFile) => {
    setSelectedPdf(pdfFile);
  };

  const closePdf = () => {
    setSelectedPdf(null);
  };

  useEffect(() => {
    const disableRightClick = (e) => {
      e.preventDefault();
    };
    window.addEventListener("contextmenu", disableRightClick);
    return () => {
      window.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  return (
    <div>
      <div className='p-4 m-4 text-4xl font-semibold w-72'>Policies</div>
      <div className='flex flex-wrap'>
        {pdfFiles.map((pdfFile, index) => (
          <PdfCard key={index} pdfFile={pdfFile} openPdf={openPdf} />
        ))}
      </div>
      {selectedPdf && <PdfViewer pdfFile={selectedPdf} closePdf={closePdf} />}
    </div>
  );
};

export default UserPolicyPage;
