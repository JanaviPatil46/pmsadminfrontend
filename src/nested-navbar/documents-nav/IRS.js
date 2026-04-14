import React from 'react';
import { MdSettingsInputAntenna } from "react-icons/md";
import { Link } from 'react-router-dom';

const IRS = () => {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-800">IRS Transcripts</h2>
        <p className="text-xs text-gray-400 mt-0.5">Connect your organization to request IRS transcripts</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <MdSettingsInputAntenna className="text-gray-300" style={{ width: 36, height: 36 }} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-600">No connected organizations</p>
          <p className="text-xs text-gray-400 mt-1">You need to connect an organization to request IRS transcripts</p>
        </div>
        <Link
          to="https://la.www4.irs.gov/secureaccess/ui/?TYPE=33554433&REALMOID=06-0006787c-6ad2-12ca-aad1-7c2b0ad00000&GUID=&SMAUTHREASON=0&METHOD=GET&SMAGENTNAME=-SM-u0ktItgVFneUJDzkQ7tjvLYXyclDooCJJ7%2bjXGjg3YC5id2x9riHE98hoVgd1BBv&TARGET=-SM-HTTPS%3a%2f%2fla%2ewww4%2eirs%2egov%2fesrv%2fconsent%2foauth%3fclientId%3dae717e7c--03ee--41ef--bee2--4ff0e81ff36a%26env%3dLIVE"
          target="_blank"
          rel="noreferrer"
        >
          <button
            type="button"
            className="rounded-lg px-5 py-2 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] transition-colors"
          >
            Connect to IRS
          </button>
        </Link>
      </div>
    </div>
  );
};

export default IRS;