import React, { useRef } from 'react';
import { useCV } from '../../context/CVContext';
import { useReactToPrint } from 'react-to-print';

const CVPreview: React.FC = () => {
  const { cvData } = useCV();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: `${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV`,
    // @ts-ignore - type definitions are incorrect for react-to-print
    content: () => printRef.current,
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div ref={printRef} className="flex items-center justify-center min-h-[400px] text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">CV Preview</h2>
          <p className="text-gray-600">
            Preview coming soon...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            We're working on making your CV look amazing!
          </p>
          <button
            onClick={(e) => {
              e.preventDefault();
              handlePrint();
            }}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Print CV
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVPreview;
