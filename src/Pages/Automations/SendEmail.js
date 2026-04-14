
// SendEmail.js
import React from 'react';
import Select from 'react-select';
import { AiOutlineSearch } from 'react-icons/ai';
import { IoMdArrowRoundBack } from 'react-icons/io';
import makeAnimated from 'react-select/animated';
import { Button } from '../../components/ui/button';

const SendEmail = ({
  isConditionsFormOpen,
  handleGoBack,
  handleAddConditions,
  selectedTags,
  selectedTagElements,
  emailTemplateOptions,
  selectedEmailTemplate,
  handleEmailTemplateChange,
  tempSelectedTags,
  handleCheckboxChange,
  filteredTags,
  isAnyCheckboxChecked,
  handleAddTags,
  searchTerm,
  handleSearchChange,
}) => {
  return (
    <>
      <div className="pt-5 space-y-4">
        <div className="ml-2">
          <p className="text-sm mb-1">Select template</p>
          <Select
            className="select-dropdown"
            placeholder="Select template"
            options={emailTemplateOptions}
            components={makeAnimated()}
            isSearchable
            isClearable
            onChange={handleEmailTemplateChange}
            value={selectedEmailTemplate}
          />
        </div>

        {selectedTags.length > 0 && (
          <div className="ml-2 flex items-center gap-2 flex-wrap">
            <span className="text-sm">Only for:</span>
            {selectedTagElements}
          </div>
        )}

        <div className="ml-2">
          <button
            onClick={handleAddConditions}
            className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            Add conditions
          </button>
        </div>
      </div>

      {/* Conditions drawer */}
      {isConditionsFormOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/30" onClick={handleGoBack} />
          <div className="ml-auto relative z-50 w-full max-w-[550px] bg-white h-full overflow-y-auto shadow-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={handleGoBack}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <IoMdArrowRoundBack size={22} color="blue" />
              </button>
              <h2 className="text-lg font-semibold">Add conditions</h2>
            </div>

            <p className="text-sm text-gray-700 mb-3">
              Apply automation only for accounts with these tags
            </p>

            <div className="relative mb-4">
              <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1 mb-4">
              {filteredTags.map(tag => (
                <div key={tag._id} className="flex items-center gap-3 border-b border-gray-200 pb-2">
                  <input
                    type="checkbox"
                    checked={tempSelectedTags.includes(tag)}
                    onChange={() => handleCheckboxChange(tag)}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                  <span
                    className="text-xs font-medium text-white px-3 py-1 rounded-full"
                    style={{ backgroundColor: tag.tagColour }}
                  >
                    {tag.tagName}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button disabled={!isAnyCheckboxChecked} onClick={handleAddTags}>
                Add
              </Button>
              <Button variant="outline" onClick={handleGoBack}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SendEmail;