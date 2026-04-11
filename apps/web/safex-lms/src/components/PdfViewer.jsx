import React, { useEffect } from 'react';

const PdfViewer = ({ pdfFile, closePdf }) => {
  useEffect(() => {
    const iframe = document.getElementById('pdfIframe');
    if (iframe) {
      iframe.onload = () => {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const script = document.createElement('script');
        script.innerHTML = `
          document.addEventListener('contextmenu', event => event.preventDefault());
        `;
        iframeDocument.head.appendChild(script);
      };
    }
  }, []);

  const disableClicks = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <div className='fixed top-0 left-0 z-10 flex items-center justify-center w-full h-full bg-black bg-opacity-70'>
      <div className='relative p-6 bg-white rounded shadow-lg' style={{ width: '80%', height: '80%' }}>
        <iframe
          id="pdfIframe"
          src={`/public/${pdfFile}#toolbar=0&navpanes=0`}
          title='PDF Viewer'
          style={{ border: 'none', height: '100%', width: '100%' }}
          className='w-full h-96'
          scrolling="yes"
        ></iframe>
        <div
          className='absolute top-0 left-0 w-full h-full pointer-events-none'
          onClick={disableClicks}
        ></div>
        <button
          className='absolute px-2 py-1 text-white bg-red-500 rounded top-2 right-2'
          onClick={closePdf}
        >
          Close PDF
        </button>
      </div>
    </div>
  );
};

export default PdfViewer;
