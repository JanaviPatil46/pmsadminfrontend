


import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const OrganizerPreview = () => {
    const location = useLocation();
    const { data } = location.state || {};
    const organizerName = data?.organizerName || 'Organizer';
    const sections = data?.sections || [];
    const [startDate, setStartDate] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    console.log("preview organizer of sections", sections)
    const handleStartDateChange = (value) => {
        setStartDate(value);
    };

    const handleNext = () => {
        if (activeStep < totalSteps - 1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    };

    const handleDropdownChange = (event) => {
        const selectedIndex = event.target.value;
        setActiveStep(selectedIndex);
    };

    const [radioValues, setRadioValues] = useState({});
    const [checkboxValues, setCheckboxValues] = useState({});
    const [answeredElements, setAnsweredElements] = useState({});

    const handleRadioChange = (value, elementText) => {
        setRadioValues((prevValues) => ({
            ...prevValues,
            [elementText]: value,
        }));
        setAnsweredElements((prevAnswered) => ({
            ...prevAnswered,
            [elementText]: true,
        }));
    };

    const handleCheckboxChange = (value, elementText) => {
        setCheckboxValues((prevValues) => ({
            ...prevValues,
            [elementText]: {
                ...prevValues[elementText],
                [value]: !prevValues[elementText]?.[value],
            },
        }));
        setAnsweredElements((prevAnswered) => ({
            ...prevAnswered,
            [elementText]: true,
        }));
    };

    const [selectedValue, setSelectedValue] = useState(null);
    const handleChange = (event, elementText) => {
        setSelectedValue(event.target.value);
        setAnsweredElements((prevAnswered) => ({
            ...prevAnswered,
            [elementText]: true,
        }));
    };

    const [inputValues, setInputValues] = useState({});
    const handleInputChange = (event, elementText) => {
        const { value } = event.target;
        setInputValues((prevValues) => ({
            ...prevValues,
            [elementText]: value,
        }));
        setAnsweredElements((prevAnswered) => ({
            ...prevAnswered,
            [elementText]: true,
        }));
    };

    const [selectedDropdownValue, setSelectedDropdownValue] = useState('');
    const handleDropdownValueChange = (event, elementText) => {
        setSelectedDropdownValue(event.target.value);
        setAnsweredElements((prevAnswered) => ({
            ...prevAnswered,
            [elementText]: true,
        }));
    };

    const stripHtmlTags = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.innerText || tempDiv.textContent || '';
    };

    const shouldShowElement = (element) => {
        if (!element.questionsectionsettings?.conditional) return true;

        const condition = element.questionsectionsettings?.conditions?.[0];
        if (condition && condition.question && condition.answer) {
            return condition.answer === radioValues[condition.question];
        }
        return true;
    };

    const totalElements = sections[activeStep]?.formElements.length || 0;
    const answeredCount = sections[activeStep]?.formElements.filter(
        (element) => answeredElements[element.text]
    ).length || 0;

    // Check whether to display the section
    const shouldShowSection = (section) => {
        if (!section.sectionsettings?.conditional) return true;

        const condition = section.sectionsettings?.conditions?.[0];
        if (condition && condition.question && condition.answer) {
            return condition.answer === radioValues[condition.question];
        }
        return true;
    };
    // const getVisibleSections = () => {
    //     return sections.filter(shouldShowSection);
    // };
    const getVisibleSections = () => sections.filter(shouldShowSection);
   
    const visibleSections = getVisibleSections();
    const totalSteps = visibleSections.length;

    const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-3 focus:outline-none focus:ring-2 focus:ring-ring bg-white";
    const progressPct = totalSteps > 0 ? ((activeStep + 1) / totalSteps) * 100 : 0;

    return (
        <div>
            {/* Preview banner */}
            <div className="flex items-center justify-between border-2 border-blue-400 bg-blue-200 rounded-xl px-4 py-3 mb-5">
                <div>
                    <p className="font-bold text-sm text-blue-900">Preview mode</p>
                    <p className="text-sm text-blue-800">The client sees your organizer like this</p>
                </div>
                <Button variant="outline" size="sm">Back to edit</Button>
            </div>

            <p className="text-base font-medium mb-3">{organizerName}</p>

            {/* Section dropdown */}
            <select
                value={activeStep}
                onChange={handleDropdownChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-ring bg-white"
            >
                {visibleSections.map((section, index) => (
                    <option key={index} value={index}>
                        {section.text} ({answeredCount}/{totalElements})
                    </option>
                ))}
            </select>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-5">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                />
            </div>

            {/* Section elements */}
            {visibleSections.map((section, sectionIndex) =>
                sectionIndex === activeStep && (
                    <div key={section.text}>
                        {section.formElements.map((element) =>
                            shouldShowElement(element) && (
                                <div key={element.text} className="mb-4">

                                    {(element.type === 'Free Entry' || element.type === 'Number' || element.type === 'Email') && (
                                        <div>
                                            <p className="text-lg font-medium mb-2">{element.text}</p>
                                            <textarea
                                                className={inputCls}
                                                rows={3}
                                                placeholder={`${element.type} Answer`}
                                                value={inputValues[element.text] || ''}
                                                onChange={(e) => handleInputChange(e, element.text)}
                                            />
                                        </div>
                                    )}

                                    {element.type === 'Radio Buttons' && (
                                        <div>
                                            <p className="text-lg font-medium mb-2">{element.text}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {element.options.map((option) => (
                                                    <Button
                                                        key={option.text}
                                                        size="sm"
                                                        variant={radioValues[element.text] === option.text ? 'default' : 'outline'}
                                                        onClick={() => handleRadioChange(option.text, element.text)}
                                                    >
                                                        {option.text}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {element.type === 'Checkboxes' && (
                                        <div>
                                            <p className="text-lg font-medium mb-2">{element.text}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {element.options.map((option) => (
                                                    <Button
                                                        key={option.text}
                                                        size="sm"
                                                        variant={checkboxValues[element.text]?.[option.text] ? 'default' : 'outline'}
                                                        onClick={() => handleCheckboxChange(option.text, element.text)}
                                                    >
                                                        {option.text}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {element.type === 'Yes/No' && (
                                        <div>
                                            <p className="text-lg font-medium mb-2">{element.text}</p>
                                            <div className="flex gap-2">
                                                {element.options.map((option) => (
                                                    <Button
                                                        key={option.text}
                                                        size="sm"
                                                        variant={selectedValue === option.text ? 'default' : 'outline'}
                                                        onClick={(event) => handleChange(event, element.text)}
                                                    >
                                                        {option.text}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {element.type === 'Dropdown' && (
                                        <div>
                                            <p className="text-lg font-medium mb-2">{element.text}</p>
                                            <select
                                                value={selectedDropdownValue}
                                                onChange={(event) => handleDropdownValueChange(event, element.text)}
                                                className={inputCls}
                                            >
                                                <option value="">Select an option</option>
                                                {element.options.map((option) => (
                                                    <option key={option.text} value={option.text}>
                                                        {option.text}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {element.type === 'Date' && (
                                        <div>
                                            <p className="text-lg font-medium mb-2">{element.text}</p>
                                            <input
                                                type="date"
                                                value={startDate || ''}
                                                onChange={(e) => {
                                                    handleStartDateChange(e.target.value);
                                                    setAnsweredElements((prev) => ({ ...prev, [element.text]: true }));
                                                }}
                                                className={inputCls}
                                            />
                                        </div>
                                    )}

                                    {element.type === 'File Upload' && (
                                        <div>
                                            <p className="text-lg font-medium mb-2">{element.text}</p>
                                            <div title="Unavailable in preview mode" className="inline-block">
                                                <Button size="sm" disabled>Upload</Button>
                                            </div>
                                        </div>
                                    )}

                                    {element.type === 'Text Editor' && (
                                        <div>
                                            <p className="text-sm text-gray-700">{stripHtmlTags(element.text)}</p>
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                )
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-5">
                <Button variant="outline" disabled={activeStep === 0} onClick={handleBack}>
                    Back
                </Button>
                <Button disabled={activeStep === totalSteps - 1} onClick={handleNext}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default OrganizerPreview;
