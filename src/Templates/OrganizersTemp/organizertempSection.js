import React, { useState, useEffect, useRef } from "react";
import { HiOutlineDuplicate } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";
import { Upload, GripVertical } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";
import Quill from "quill";
import "quill-emoji";
import { useDrag, useDrop } from "react-dnd";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
Quill.register("modules/emoji", require("quill-emoji"));

const ItemTypes = {
  QUESTION: "question",
  OPTION: "option",
};

const DraggableQuestion = ({ id, index, moveQuestion, children }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.QUESTION,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.QUESTION,
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveQuestion(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`mb-2 rounded bg-white flex ${
        isDragging ? "opacity-50 border-2 border-dashed border-blue-400" : "border border-gray-200"
      } p-2`}
    >
      <GripVertical className="h-4 w-4 text-gray-400 cursor-move mr-2 mt-1 shrink-0" />
      {children}
    </div>
  );
};

const DraggableOption = ({ id, index, moveOption, children, elementId }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.OPTION,
    item: { id, index, elementId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.OPTION,
    hover(item, monitor) {
      if (!ref.current) return;
      if (item.elementId !== elementId) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveOption(elementId, dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex items-center mb-2 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <GripVertical className="h-4 w-4 text-gray-400 cursor-move mr-2 shrink-0" />
      {children}
    </div>
  );
};

const Section = ({
  sections,
  section,
  onDelete,
  onUpdate,
  onDuplicate,
  onSaveFormData,
  onSaveSectionData,
}) => {
  console.log("selected section", section);
  const [text, setText] = useState(section.text);
  const [formElements, setFormElements] = useState(section.formElements || []);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [queDrawerOpen, setQueDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [repeateButton, setRepeateButton] = useState(false);
  const [conditionButton, setConditionButton] = useState(false);
  const [prefilledButton, setPrefilledButton] = useState(false);
  const [descriptionButton, setDescriptionButton] = useState(false);
  const [descriptionText, setDescriptionText] = useState("");
  const [mode, setMode] = useState("Any");
  const [sectionMode, setSectionMode] = useState("Any");
  const [repeatButtonName, setRepeatButtonName] = useState("Repeat Section");

  const [queConditionButton, setQueConditionButton] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState([
    { question: "", questionId: null, answer: "", optionvalue: false },
  ]);
  const [requiredButton, setRequiredButton] = useState(false);
  const [sectionQuestionAnswers, setSectionQuestionAnswers] = useState([
    { question: "", questionId: null, answer: "", optionvalue: false },
  ]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [sectionConditionBadge, setSectionConditionBadge] = useState(false);
  const moveQuestion = (dragIndex, hoverIndex) => {
    const draggedItem = formElements[dragIndex];
    const newFormElements = [...formElements];

    newFormElements.splice(dragIndex, 1);
    newFormElements.splice(hoverIndex, 0, draggedItem);

    setFormElements(newFormElements);
    onUpdate(section.id, text, newFormElements);
  };

  const moveOption = (elementId, dragIndex, hoverIndex) => {
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId && element.options) {
        const draggedOption = element.options[dragIndex];
        const newOptions = [...element.options];

        newOptions.splice(dragIndex, 1);
        newOptions.splice(hoverIndex, 0, draggedOption);

        return { ...element, options: newOptions };
      }
      return element;
    });

    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleSectionSave = () => {
    // Construct the sectionSettings object
    const sectionsettings = {
      // id: selectedSectionId,
      sectionRepeatingMode: repeateButton,
      buttonName: repeateButton ? repeatButtonName : "", // You can store the text input value instead of hardcoding it
      conditional: conditionButton,
      mode: sectionMode,

      conditions: conditionButton
        ? sectionQuestionAnswers.map((qa, index) => ({
            question: selectedSectionQuestions[index]?.text || "",
            questionId: selectedSectionQuestions[index]?.id || null,
            answer: selectedSectionAnswers[index] || "",
            optionvalue: false,
          }))
        : [],

      // conditions: conditionButton ? questionAnswers : [], // assuming questionAnswers is an array of {question, answer} objects
    };
    console.log("bnvfhgdsfhds section settings", sectionsettings);

    if (onSaveSectionData) {
      onSaveSectionData(sectionsettings);
      console.log("updated Section Settings:", sectionsettings);
      setSectionConditionBadge(sectionsettings.conditional);
      console.log(sectionsettings.conditional);
      toggleDrawer(false);
      setRepeateButton(false);
      setRepeatButtonName("");
      setConditionButton(false);
      setSectionMode("");
      setSelectedSectionQuestions([]);
      setSelectedSectionAnswers([]);
      setSectionQuestionAnswers([]);
    }
  };

  const clearForm = () => {
    setRequiredButton(false);
    setPrefilledButton(false);
    setQueConditionButton(false);
    setDescriptionButton(false);
    setDescriptionText("");
    setSelectedQuestions([]); // Clear selected questions
    setSelectedAnswers([]); // Clear selected answers
    setMode("Any"); // Reset mode to default value
    setQuestionAnswers([]);
  };
  const [questionsAnswersMap, setQuestionsAnswersMap] = useState({});

  const handleSave = () => {
    if (selectedElement) {
      const formData = {
        required: requiredButton,
        prefilled: prefilledButton,
        conditional: queConditionButton,
        mode: mode,

        conditions: queConditionButton
          ? questionAnswers.map((qa, index) => ({
              question: selectedQuestions[index]?.text || "",
              questionId: selectedQuestions[index]?.id || null,
              answer: selectedAnswers[index] || "",
              optionvalue: false,
            }))
          : [],
        descriptionEnabled: descriptionButton,
        description: descriptionButton ? descriptionText : "", // Save descriptionText only if descriptionButton is enabled
      };

      // Update questionsAnswersMap with current state values
      setQuestionsAnswersMap((prev) => ({
        ...prev,
        [selectedElement.id]: {
          questionAnswers: questionAnswers, // Ensure questionAnswers are stored correctly
          description: descriptionText, // Save the description
        },
      }));

      // Optionally log or save formData
      onSaveFormData(selectedElement.id, formData);

      // const updatedFormElements = formElements.map((element) => (element.id === selectedElement.id ? { ...element, questionsectionsettings: formData } : element));
      // console.log("Updated formElements:", updatedFormElements);
      const updatedFormElements = formElements.map((element) =>
        element.id === selectedElement.id
          ? { ...element, questionsectionsettings: formData }
          : element
      );
      setFormElements(updatedFormElements); // Update form elements in state
      console.log("updated", updatedFormElements);
      // Clear form and close drawer
      clearForm();
      setQueDrawerOpen(false);
    } else {
      console.error("No element selected");
    }
  };

  useEffect(() => {
    if (selectedElement) {
      const { questionsectionsettings } = selectedElement;

      setRequiredButton(questionsectionsettings?.required || false);
      setPrefilledButton(questionsectionsettings?.prefilled || false);
      setQueConditionButton(questionsectionsettings?.conditional || false);
      setDescriptionButton(
        questionsectionsettings?.descriptionEnabled || false
      );
      setDescriptionText(questionsectionsettings?.description || "");
      setMode(questionsectionsettings?.mode || "Any");

      const conditions = questionsectionsettings?.conditions || [];
      const questions = conditions.map(
        (cond) => formElements.find((el) => el.id === cond.questionId) || null
      );
      const answers = conditions.map((cond) => cond.answer || null);

      setQuestionAnswers(conditions);
      setSelectedQuestions(questions);
      setSelectedAnswers(answers);
    }
  }, [selectedElement]);

  const handleRequiredButton = (checked) => {
    setRequiredButton(checked);
  };
  const handleDescriptionButton = (checked) => {
    setDescriptionButton(checked);
  };
  const handlePrefilledButton = (checked) => {
    setPrefilledButton(checked);
  };
  const handleAddQuestionAnswer = () => {
    setQuestionAnswers([
      ...questionAnswers,
      { question: "", questionId: null, answer: "", optionvalue: false },
    ]);
  };

  const handleAddSectionQuestionAnswer = () => {
    setSectionQuestionAnswers([
      ...sectionQuestionAnswers,
      { question: "", questionId: null, answer: "", optionvalue: false },
    ]);
  };

  const handleRemoveQuestionAnswer = (index) => {
    const updatedList = questionAnswers.filter((_, i) => i !== index);
    setQuestionAnswers(updatedList);

    const updatedSectionList = sectionQuestionAnswers.filter(
      (_, i) => i !== index
    );
    setSectionQuestionAnswers(updatedSectionList);
  };
  const handleRepeateButton = (checked) => {
    setRepeateButton(checked);
  };
  const handleConditionButton = (checked) => {
    setConditionButton(checked);
  };
  const handleQueConditionButton = (checked) => {
    setQueConditionButton(checked);
  };
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  const [selectedSection, setSelectedSection] = useState();
  //  setSelectedSection(section);

  const [selectedSectionData, setSelectedSectionData] = useState(null);

  //  Update the badge state when updatedSection changes
  useEffect(() => {
    setSectionConditionBadge(section?.sectionsettings?.conditional);
  }, [section]);
  const handleSectionSettingsClick = () => {
    const updatedSection = sections.find((sec) => sec.id === section.id);
    console.log("Latest Section Data:", updatedSection); // Check if settings are updated
    toggleDrawer(true);
    if (updatedSection && updatedSection.sectionsettings) {
      setSelectedSectionData(updatedSection);
      setSelectedSectionId(updatedSection.id);
      setRepeateButton(
        updatedSection.sectionsettings.sectionRepeatingMode || false
      );
      setRepeatButtonName(
        updatedSection.sectionsettings.buttonName || "Repeat Section"
      );
      setConditionButton(updatedSection.sectionsettings.conditional || false);
      // setSectionConditionBadge(updatedSection.sectionsettings.conditional)
      setSectionMode(updatedSection.sectionsettings.mode || "Any");
      console.log(
        "updatedSection.sectionsettings",
        updatedSection.sectionsettings
      );
      const conditions = updatedSection.sectionsettings.conditions || [];
      setSectionQuestionAnswers(conditions);

      const questions = conditions.map(
        (cond) =>
          getAllQuestions().find((q) => q.id === cond.questionId) || null
      );
      const answers = conditions.map((cond) => cond.answer || null);

      setSelectedSectionQuestions(questions);
      setSelectedSectionAnswers(answers);
      console.log("answers", answers);
    }
  };

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };
  const getAllQuestions = () => {
    return sections.flatMap((section) =>
      section.formElements.filter(
        (element) =>
          element.type === "Radio Buttons" ||
          element.type === "Checkboxes" ||
          element.type === "Dropdown"
      )
    );
  };
const getAllQuestionsGrouped = () => {
  const allQuestions = [];
  
  sections.forEach((section) => {
    const sectionQuestions = section.formElements.filter(
      (element) =>
        element.type === "Radio Buttons" ||
        element.type === "Checkboxes" ||
        element.type === "Dropdown"
    );
    
    // Add section property to each question
    sectionQuestions.forEach((question) => {
      allQuestions.push({
        ...question,
        sectionName: section.text || `Section ${section.id}`,
        sectionId: section.id
      });
    });
  });
  
  return allQuestions;
};
  const handleSettingsClick = (elementId) => {
    const updatedElement = formElements.find(
      (element) => element.id === elementId
    );
    if (updatedElement) {
      setSelectedElement(updatedElement);
      setQueDrawerOpen(true);

      // Get the questionsectionsettings
      const questionSectionSettings = updatedElement.questionsectionsettings;

      // Log or use the questionsectionsettings
      console.log("Question Section Settings:", questionSectionSettings);

      // You can now use the questionsectionsettings as needed
    }
  };

  useEffect(() => {
    setText(section.text);
    setFormElements(section.formElements);
  }, [section]);

  const handleDelete = () => {
    onDelete(section.id);
  };
  const handleDuplicate = () => {
    onDuplicate(section.id);
  };
  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    onUpdate(section.id, newText, formElements);
  };

  const handleAddFormElement = (type) => {
    const newElement = {
      type,
      id: Date.now(),
      sectionid: section.id,
      options: [],
      text: "",
      questionsectionsettings: {
        required: false,
        prefilled: false,
        conditional: false, // Set conditional to true
        mode: "",
        conditions: [
          {
            question: "",
            questionId: null,
            answer: "",
            optionvalue: false,
          },
        ],
        descriptionEnabled: false,
        description: "",
      },
    };
    const updatedFormElements = [...formElements, newElement];
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
    // setDropdownVisible(false);
    setAnchorEl(null);
  };

  const handleDeleteFormElement = (id) => {
    const updatedFormElements = formElements.filter(
      (element) => element.id !== id
    );
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleAddOption = (elementId) => {
    const newOption = { id: Date.now(), text: "" };
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId) {
        return { ...element, options: [...(element.options || []), newOption] };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleOptionChange = (elementId, optionId, newText) => {
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId) {
        const updatedOptions = element.options.map((option) => {
          if (option.id === optionId) {
            return { ...option, text: newText };
          }
          return option;
        });
        return { ...element, options: updatedOptions };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleDeleteOption = (elementId, optionId) => {
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId) {
        const updatedOptions = element.options.filter(
          (option) => option.id !== optionId
        );
        return { ...element, options: updatedOptions };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleCheckboxTextChange = (elementId, newText) => {
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId) {
        return { ...element, text: newText };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleElementTextChange = (elementId, newText) => {
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId) {
        return { ...element, text: newText };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleQuillChange = (elementId, newText) => {
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId) {
        return { ...element, text: newText };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };
  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }], // Font family and size
      [{ header: "1" }, { header: "2" }, { align: [] }],
      ["bold", "italic", "underline", "strike"], // Formatting options
      [{ script: "sub" }, { script: "super" }], // Subscript/Superscript
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      [{ color: [] }, { background: [] }], // Text color and highlight
      ["blockquote", "code-block"], // Blockquote and code
      ["link", "image"], // Links and images
      [{ emoji: true }],
      [{ indent: "-1" }, { indent: "+1" }], // Indent/unindent
      ["clean"], // Remove formatting
      ["undo", "redo"], // Undo/Redo
    ],
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true,
    },
    "emoji-toolbar": true,
    "emoji-textarea": false,
    "emoji-shortname": true,
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "script",
    "list",
    "bullet",
    "indent",
    "color",
    "background",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "undo",
    "redo",
    "emoji",
  ];

  const renderOptions = (element, type = "text") => {
    return (
      <div className="mt-1">
        {element.options &&
          element.options.map((option, index) => (
            <DraggableOption
              key={option.id}
              id={option.id}
              index={index}
              moveOption={moveOption}
              elementId={element.id}
            >
              {(type === "radio" || type === "Yes/No") && (
                <input
                  type="radio"
                  name={`radio-${element.id}`}
                  className="mr-2 shrink-0"
                  readOnly
                />
              )}
              {type === "checkbox" && (
                <input
                  type="checkbox"
                  name={`checkbox-${element.id}`}
                  className="mr-2 shrink-0"
                  readOnly
                />
              )}
              <input
                type="text"
                placeholder="Option"
                value={option.text}
                className="organizer-input-label flex-1 rounded border border-gray-200 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) =>
                  handleOptionChange(element.id, option.id, e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => handleDeleteOption(element.id, option.id)}
                className="ml-1 rounded p-1 text-red-400 hover:bg-red-50 transition-colors"
              >
                <RiDeleteBinLine className="h-4 w-4" />
              </button>
            </DraggableOption>
          ))}
        <button
          type="button"
          onClick={() => handleAddOption(element.id)}
          className="mt-2 rounded-full bg-[var(--color-save-btn)] px-4 py-1.5 text-sm text-white hover:bg-[var(--color-save-hover-btn)] transition-colors"
        >
          Add Option
        </button>
      </div>
    );
  };

  const renderFormElement = (element) => {

    const conditionalBadge = element.questionsectionsettings?.conditional && (
      <span className="ml-2 shrink-0 rounded-full bg-green-600 px-2 py-0.5 text-xs text-white">
        Conditional
      </span>
    );

    const requiredQuestion = element.questionsectionsettings?.required && (
      <span className="ml-0.5 text-red-500">*</span>
    );

    const settingsButton = (
      <button
        type="button"
        onClick={() => handleSettingsClick(element.id)}
        className="ml-1 shrink-0 rounded p-1 text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <IoSettingsOutline className="h-4 w-4" />
      </button>
    );

    const deleteButton = (
      <button
        type="button"
        onClick={() => handleDeleteFormElement(element.id)}
        className="ml-1 shrink-0 rounded p-1 text-red-400 hover:bg-red-50 transition-colors"
      >
        <RiDeleteBinLine className="h-4 w-4" />
      </button>
    );

    const simpleElementRow = (label, placeholder, onChangeFn) => (
      <div className="mb-2 w-full">
        <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder={placeholder}
            value={element.text}
            className="flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={onChangeFn || ((e) => handleElementTextChange(element.id, e.target.value))}
          />
          {conditionalBadge}
          {requiredQuestion}
          {settingsButton}
          {deleteButton}
        </div>
      </div>
    );

    switch (element.type) {
      case "Free Entry":
        return simpleElementRow("Free Entry", "Free Entry");

      case "Email":
        return simpleElementRow("Email", "Email");

      case "Number":
        return simpleElementRow("Number", "Number");

      case "Date":
        return simpleElementRow("Date", "Date");

      case "Radio Buttons":
        return (
          <div className="mb-2 w-full">
            <p className="text-xs font-medium text-gray-500 mb-1">Radio Button:</p>
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="Radio Buttons"
                value={element.text}
                className="flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => handleElementTextChange(element.id, e.target.value)}
              />
              {conditionalBadge}
              {requiredQuestion}
              {settingsButton}
              {deleteButton}
            </div>
            {renderOptions(element, "radio")}
          </div>
        );

      case "Checkboxes":
        return (
          <div className="mb-2 w-full">
            <p className="text-xs font-medium text-gray-500 mb-1">Checkbox:</p>
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="Checkboxes"
                value={element.text}
                className="flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => handleCheckboxTextChange(element.id, e.target.value)}
              />
              {conditionalBadge}
              {requiredQuestion}
              {settingsButton}
              {deleteButton}
            </div>
            {renderOptions(element, "checkbox")}
          </div>
        );

      case "Dropdown":
        return (
          <div className="mb-2 w-full">
            <p className="text-xs font-medium text-gray-500 mb-1">Dropdown:</p>
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="Dropdown"
                value={element.text}
                className="flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => handleCheckboxTextChange(element.id, e.target.value)}
              />
              {conditionalBadge}
              {requiredQuestion}
              {settingsButton}
              {deleteButton}
            </div>
            {renderOptions(element)}
          </div>
        );

      case "Yes/No":
        return (
          <div className="mb-2 w-full">
            <p className="text-xs font-medium text-gray-500 mb-1">Yes/No:</p>
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="Yes/No"
                value={element.text}
                className="flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => handleElementTextChange(element.id, e.target.value)}
              />
              {conditionalBadge}
              {requiredQuestion}
              {settingsButton}
              {deleteButton}
            </div>
            {renderOptions(element, "Yes/No")}
          </div>
        );

      case "File Upload":
        return (
          <div className="mb-2 w-full">
            <p className="text-xs font-medium text-gray-500 mb-1">File Upload:</p>
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="File Upload"
                value={element.text}
                className="flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => handleElementTextChange(element.id, e.target.value)}
              />
              {conditionalBadge}
              {requiredQuestion}
              {settingsButton}
              {deleteButton}
            </div>
            <button
              type="button"
              disabled
              className="mt-2 flex items-center gap-1.5 rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-400 cursor-not-allowed"
            >
              <Upload className="h-4 w-4" /> Upload files
            </button>
          </div>
        );

      case "Text Editor":
        return (
          <div className="mt-4 flex items-start gap-1">
            <div className="flex-1">
              <ReactQuill
                theme="snow"
                value={element.text}
                modules={modules}
                formats={formats}
                onChange={(newText) => handleQuillChange(element.id, newText)}
              />
            </div>
            {deleteButton}
          </div>
        );

      default:
        return null;
    }
  };
  const getRadioButtonOptions = () => {
    return sections.flatMap((section) =>
      section.formElements
        // .filter(element => element.type === 'Radio Buttons')
        .filter(
          (element) =>
            element.type === "Radio Buttons" ||
            element.type === "Checkboxes" ||
            element.type === "Dropdown"
        )
        .map((element) => element.text)
    );
  };

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(questionAnswers.length).fill(null)
  );

  const [selectedSectionQuestions, setSelectedSectionQuestions] = useState(
    Array(sectionQuestionAnswers.length).fill(null)
  );
  const [selectedSectionAnswers, setSelectedSectionAnswers] = useState(
    Array(sectionQuestionAnswers.length).fill(null)
  );

  const getAnswerOptions = (questionElement) => {
    if (!questionElement) return [];
    return questionElement.options?.map((option) => option.text) || [];
  };

  const handleQuestionSelect = (value, index) => {
    const allQuestions = getAllQuestionsGrouped();
    const selectedQuestion = allQuestions.find((q) => q.id === value?.id);

    const updatedQuestions = [...selectedQuestions];
    updatedQuestions[index] = selectedQuestion;
    setSelectedQuestions(updatedQuestions);

    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[index] = null;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSectionQuestionSelect = (value, index) => {
    const allQuestions = getAllQuestionsGrouped();
    const selectedQuestion = allQuestions.find((q) => q.id === value?.id);

    const updatedQuestions = [...selectedSectionQuestions];
    updatedQuestions[index] = selectedQuestion;
    setSelectedSectionQuestions(updatedQuestions);

    const updatedAnswers = [...selectedSectionAnswers];
    updatedAnswers[index] = null;
    setSelectedSectionAnswers(updatedAnswers);
  };
  useEffect(() => {
    if (selectedElement) {
      const { questionsectionsettings } = selectedElement;

      setRequiredButton(questionsectionsettings?.required || false);
      setPrefilledButton(questionsectionsettings?.prefilled || false);
      setQueConditionButton(questionsectionsettings?.conditional || false);
      setDescriptionButton(
        questionsectionsettings?.descriptionEnabled || false
      );
      setDescriptionText(questionsectionsettings?.description || "");
      setMode(questionsectionsettings?.mode || "Any");

      const conditions = questionsectionsettings?.conditions || [];
      const questions = conditions.map(
        (cond) => formElements.find((el) => el.id === cond.questionId) || null
      );
      const answers = conditions.map((cond) => cond.answer || null);

      setQuestionAnswers(conditions);
      setSelectedQuestions(questions);
      console.log("selectedquestion", questions);
      setSelectedAnswers(answers);
    }
  }, [selectedElement]);

  return (
    <div className="relative mb-4 rounded-lg border border-gray-300 bg-white p-4">
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Section text"
          className="flex-1 rounded border border-gray-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {sectionConditionBadge && (
          <span className="ml-2 shrink-0 rounded-full bg-green-600 px-2 py-0.5 text-xs text-white">
            Conditional
          </span>
        )}
        <div className="flex items-center ml-2">
          <button
            type="button"
            onClick={handleDuplicate}
            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <HiOutlineDuplicate className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleSectionSettingsClick}
            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <IoSettingsOutline className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded p-1.5 text-red-400 hover:bg-red-50 transition-colors"
          >
            <RiDeleteBinLine className="h-4 w-4" />
          </button>
        </div>
        {Boolean(anchorEl) && (
          <div className="absolute right-4 top-14 z-50 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {[
              "Free Entry",
              "Email",
              "Number",
              "Date",
              "Radio Buttons",
              "Checkboxes",
              "Dropdown",
              "Yes/No",
              "File Upload",
            ].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => { handleAddFormElement(type); setAnchorEl(null); }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {formElements.map((element, index) => (
        <DraggableQuestion
          key={element.id}
          id={element.id}
          index={index}
          moveQuestion={moveQuestion}
        >
          {renderFormElement(element)}
        </DraggableQuestion>
      ))}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          className="rounded-full bg-[var(--color-save-btn)] px-4 py-1.5 text-sm text-white hover:bg-[var(--color-save-hover-btn)] transition-colors"
        >
          Questions
        </button>
        <button
          type="button"
          onClick={() => handleAddFormElement("Text Editor")}
          className="rounded-full border border-[var(--color-border-cancel-btn)] px-4 py-1.5 text-sm text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white hover:border-transparent transition-colors"
        >
          Text Block
        </button>
      </div>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => toggleDrawer(false)} />
          <div className="ml-auto relative z-50 w-full max-w-[800px] bg-white h-full overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-base font-semibold">Section Settings</h3>
                <p className="text-sm text-gray-500 mt-0.5">{text}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleDrawer(false)}
                className="rounded p-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <IoMdClose className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={repeateButton}
                    onChange={(e) => handleRepeateButton(e.target.checked)}
                  />
                  <div className="h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-blue-600 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4" />
                </label>
                <span className="text-base font-medium">Allow client to repeat</span>
              </div>
              {repeateButton && (
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Button name (maximum 25 characters)</label>
                  <input
                    type="text"
                    value={repeatButtonName}
                    onChange={(e) => setRepeatButtonName(e.target.value)}
                    maxLength={25}
                    className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={conditionButton}
                    onChange={(e) => handleConditionButton(e.target.checked)}
                  />
                  <div className="h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-blue-600 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4" />
                </label>
                <span className="text-base font-medium">Conditional</span>
              </div>
              {conditionButton && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Conditions</span>
                    <button
                      type="button"
                      onClick={handleAddSectionQuestionAnswer}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Add
                    </button>
                  </div>
                  <hr className="border-gray-200" />
                  <div>
                    <label className="text-sm text-gray-600">Mode</label>
                    <select
                      value={sectionMode}
                      onChange={(e) => setSectionMode(e.target.value)}
                      className="mt-1 w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="Any">Any</option>
                      <option value="All">All</option>
                    </select>
                  </div>
                  {sectionQuestionAnswers.map((qa, index) => (
                    <div key={index} className="flex items-start gap-3 mt-2">
                      <div className="w-64">
                        <label className="text-xs text-gray-500">Question</label>
                        <select
                          value={selectedSectionQuestions[index]?.id || ""}
                          onChange={(e) => {
                            const q = getAllQuestionsGrouped().find((q) => String(q.id) === e.target.value);
                            handleSectionQuestionSelect(q, index);
                          }}
                          className="mt-1 w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          <option value="">Select question</option>
                          {getAllQuestionsGrouped().map((q) => (
                            <option key={q.id} value={q.id}>{q.text} ({q.sectionName})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Answer</label>
                        <select
                          value={selectedSectionAnswers[index] || ""}
                          onChange={(e) => {
                            const updatedAnswers = [...selectedSectionAnswers];
                            updatedAnswers[index] = e.target.value;
                            setSelectedSectionAnswers(updatedAnswers);
                          }}
                          className="mt-1 rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          <option value="">Select answer</option>
                          {getAnswerOptions(selectedSectionQuestions[index]).map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestionAnswer(index)}
                        className="mt-6 rounded p-1 text-red-400 hover:bg-red-50"
                      >
                        <RiDeleteBinLine className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSectionSave}
                  className="rounded-full bg-[var(--color-save-btn)] px-5 py-1.5 text-sm text-white hover:bg-[var(--color-save-hover-btn)] transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => toggleDrawer(false)}
                  className="rounded-full border border-[var(--color-border-cancel-btn)] px-5 py-1.5 text-sm text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white hover:border-transparent transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {queDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setQueDrawerOpen(false)} />
          <div className="ml-auto relative z-50 w-full max-w-[600px] bg-white h-full overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              {selectedElement && (
                <h3 className="text-base font-semibold">{selectedElement.text}</h3>
              )}
              <button
                type="button"
                onClick={() => setQueDrawerOpen(false)}
                className="rounded p-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <IoMdClose className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Required */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-3 mb-2">
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={requiredButton}
                      onChange={(e) => handleRequiredButton(e.target.checked)}
                    />
                    <div className="h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-blue-600 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                  <span className="text-base font-medium">Required</span>
                </div>
                <hr className="border-gray-200 mb-2" />
                <p className="text-sm text-gray-500">It is mandatory to respond to this question to submit the organizer</p>
              </div>

              {/* Pre-Filled */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-3 mb-2">
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={prefilledButton}
                      onChange={(e) => handlePrefilledButton(e.target.checked)}
                    />
                    <div className="h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-blue-600 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                  <span className="text-base font-medium">Pre-Filled</span>
                </div>
                <hr className="border-gray-200 mb-2" />
                <p className="text-sm text-gray-500">If asked before, answer pre-populates from previous organizer</p>
              </div>

              {/* Conditional */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-3 mb-2">
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={queConditionButton}
                      onChange={(e) => handleQueConditionButton(e.target.checked)}
                    />
                    <div className="h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-blue-600 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                  <span className="text-base font-medium">Conditional</span>
                </div>
                <hr className="border-gray-200 mb-2" />
                <p className="text-sm text-gray-500">Ask question only in certain scenarios</p>
                {queConditionButton && (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Conditions</span>
                      <button
                        type="button"
                        onClick={handleAddQuestionAnswer}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Add
                      </button>
                    </div>
                    <hr className="border-gray-200" />
                    <div>
                      <label className="text-sm text-gray-600">Mode</label>
                      <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        className="mt-1 w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="Any">Any</option>
                        <option value="All">All</option>
                      </select>
                    </div>
                    {questionAnswers.map((qa, index) => (
                      <div key={index} className="flex items-start gap-3 mt-2">
                        <div className="w-64">
                          <label className="text-xs text-gray-500">Question</label>
                          <select
                            value={selectedQuestions[index]?.id || ""}
                            onChange={(e) => {
                              const q = getAllQuestionsGrouped().find((q) => String(q.id) === e.target.value);
                              handleQuestionSelect(q, index);
                            }}
                            className="mt-1 w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          >
                            <option value="">Select question</option>
                            {getAllQuestionsGrouped().map((q) => (
                              <option key={q.id} value={q.id}>{q.text} ({q.sectionName})</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Answer</label>
                          <select
                            value={selectedAnswers[index] || ""}
                            onChange={(e) => {
                              const updatedAnswers = [...selectedAnswers];
                              updatedAnswers[index] = e.target.value;
                              setSelectedAnswers(updatedAnswers);
                            }}
                            className="mt-1 rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          >
                            <option value="">Select answer</option>
                            {getAnswerOptions(selectedQuestions[index]).map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestionAnswer(index)}
                          className="mt-6 rounded p-1 text-red-400 hover:bg-red-50"
                        >
                          <RiDeleteBinLine className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-3 mb-2">
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={descriptionButton}
                      onChange={(e) => handleDescriptionButton(e.target.checked)}
                    />
                    <div className="h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-blue-600 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                  <span className="text-base font-medium">Description</span>
                </div>
                <hr className="border-gray-200 mb-2" />
                <p className="text-sm text-gray-500">Add instructional text to help clients answer your question</p>
                {descriptionButton && (
                  <div className="mt-3">
                    <label className="text-sm text-gray-600">Description</label>
                    <textarea
                      rows={4}
                      placeholder="Description"
                      value={descriptionText}
                      onChange={(e) => setDescriptionText(e.target.value)}
                      className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-full bg-[var(--color-save-btn)] px-5 py-1.5 text-sm text-white hover:bg-[var(--color-save-hover-btn)] transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setQueDrawerOpen(false)}
                  className="rounded-full border border-[var(--color-border-cancel-btn)] px-5 py-1.5 text-sm text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white hover:border-transparent transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section;

// const renderOptions = (element, type = "text") => {
//   return (
//     <Box>
//       {element.options &&
//         element.options.map((option) => (
//           <Box
//             key={option.id}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               marginBottom: "8px",
//             }}
//           >
//             {type === "radio" ? (
//               <Input
//                 type="radio"
//                 name={`radio-${element.id}`}
//                 sx={{ marginRight: "8px" }}
//               />
//             ) : type === "checkbox" ? (
//               <Input
//                 type="checkbox"
//                 name={`checkbox-${element.id}`}
//                 sx={{ marginRight: "8px" }}
//               />
//             ) : type === "Yes/No" ? (
//               <Input
//                 type="radio"
//                 name={`radio-${element.id}`}
//                 sx={{ marginRight: "8px" }}
//               />
//             ) : null}

//             <TextField
//               variant="outlined"
//               placeholder="Option"
//               value={option.text}
//               size="small"
//               margin="normal"
//               fullWidth
//               className="organizer-input-label"
//               onChange={(e) =>
//                 handleOptionChange(element.id, option.id, e.target.value)
//               }
//             />
//             <IconButton
//               onClick={() => handleDeleteOption(element.id, option.id)}
//             >
//               <RiDeleteBinLine />
//             </IconButton>
//           </Box>
//         ))}
//       <Button
//         variant="contained"
//         onClick={() => handleAddOption(element.id)}
//         sx={{
//           backgroundColor: "var(--color-save-btn)", // Normal background

//           "&:hover": {
//             backgroundColor: "var(--color-save-hover-btn)", // Hover background color
//           },
//           borderRadius: "15px",
//         }}
//       >
//         Add Option
//       </Button>
//     </Box>
//   );
// };

// const renderFormElement = (element) => {
//   switch (element.type) {
//     case "Free Entry":
//       return (
//         <>
//           <Typography>Free Entry</Typography>
//           <Box
//             key={element.id}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               marginBottom: "8px",
//             }}
//           >
//             <TextField
//               variant="outlined"
//               placeholder="Free Entry"
//               value={element.text}
//               size="small"
//               margin="normal"
//               fullWidth
//               sx={{ backgroundColor: "#fff" }}
//               onChange={(e) =>
//                 handleElementTextChange(element.id, e.target.value)
//               }
//             />
//             {element.questionsectionsettings?.conditional && (
//               <Box
//                 style={{
//                   backgroundColor: "green",
//                   color: "white",
//                   borderRadius: "10px",
//                   padding: "4px 8px",
//                   fontSize: "12px",
//                   marginLeft: "8px",
//                 }}
//               >
//                 Conditional
//               </Box>
//             )}
//             <IconButton onClick={() => handleSettingsClick(element.id)}>
//               <IoSettingsOutline />
//             </IconButton>

//             <IconButton onClick={() => handleDeleteFormElement(element.id)}>
//               <RiDeleteBinLine />
//             </IconButton>
//           </Box>
//         </>
//       );
//     case "Email":
//       return (
//         <>
//           <Typography>Email</Typography>
//           <Box
//             key={element.id}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               marginBottom: "8px",
//             }}
//           >
//             <TextField
//               variant="outlined"
//               placeholder="Email"
//               value={element.text}
//               size="small"
//               margin="normal"
//               fullWidth
//               onChange={(e) =>
//                 handleElementTextChange(element.id, e.target.value)
//               }
//               sx={{ backgroundColor: "#fff" }}
//             />
//             <IconButton onClick={() => handleSettingsClick(element.id)}>
//               <IoSettingsOutline />
//             </IconButton>
//             {element.questionsectionsettings?.conditional && (
//               <span
//                 style={{
//                   backgroundColor: "green",
//                   color: "white",
//                   borderRadius: "10px",
//                   padding: "4px 8px",
//                   fontSize: "12px",
//                   marginLeft: "8px",
//                 }}
//               >
//                 Conditional
//               </span>
//             )}
//             <IconButton onClick={() => handleDeleteFormElement(element.id)}>
//               <RiDeleteBinLine />
//             </IconButton>
//           </Box>
//         </>
//       );
//     case "Number":
//       return (
//         <>
//           <Typography>Number</Typography>
//           <Box
//             key={element.id}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               marginBottom: "8px",
//             }}
//           >
//             <TextField
//               variant="outlined"
//               placeholder="Number"
//               value={element.text}
//               size="small"
//               margin="normal"
//               fullWidth
//               onChange={(e) =>
//                 handleElementTextChange(element.id, e.target.value)
//               }
//               sx={{ backgroundColor: "#fff" }}
//             />
//             <IconButton onClick={() => handleSettingsClick(element.id)}>
//               <IoSettingsOutline />
//             </IconButton>
//             {element.questionsectionsettings?.conditional && (
//               <span
//                 style={{
//                   backgroundColor: "green",
//                   color: "white",
//                   borderRadius: "10px",
//                   padding: "4px 8px",
//                   fontSize: "12px",
//                   marginLeft: "8px",
//                 }}
//               >
//                 Conditional
//               </span>
//             )}
//             <IconButton onClick={() => handleDeleteFormElement(element.id)}>
//               <RiDeleteBinLine />
//             </IconButton>
//           </Box>
//         </>
//       );
//     case "Date":
//       return (
//         <>
//           <Typography>Date</Typography>
//           <Box
//             key={element.id}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               marginBottom: "8px",
//             }}
//           >
//             <TextField
//               variant="outlined"
//               placeholder="Date"
//               value={element.text}
//               size="small"
//               margin="normal"
//               fullWidth
//               onChange={(e) =>
//                 handleElementTextChange(element.id, e.target.value)
//               }
//               sx={{ backgroundColor: "#fff" }}
//             />
//             <IconButton onClick={() => handleSettingsClick(element.id)}>
//               <IoSettingsOutline />
//             </IconButton>
//             {element.questionsectionsettings?.conditional && (
//               <span
//                 style={{
//                   backgroundColor: "green",
//                   color: "white",
//                   borderRadius: "10px",
//                   padding: "4px 8px",
//                   fontSize: "12px",
//                   marginLeft: "8px",
//                 }}
//               >
//                 Conditional
//               </span>
//             )}
//             <IconButton onClick={() => handleDeleteFormElement(element.id)}>
//               <RiDeleteBinLine />
//             </IconButton>
//           </Box>
//         </>
//       );
//     case "Radio Buttons":
//       return (
//         <Box key={element.id} sx={{ marginBottom: "8px" }}>
//           <Typography>Radio Button:</Typography>
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             {/* <Input type="radio" name={`radio-${element.id}`} sx={{ marginRight: "4px" }} /> */}
//             <TextField
//               variant="outlined"
//               placeholder="Radio Buttons"
//               value={element.text}
//               size="small"
//               margin="normal"
//               fullWidth
//               onChange={(e) =>
//                 handleElementTextChange(element.id, e.target.value)
//               }
//               sx={{ backgroundColor: "#fff" }}
//             />
//             <IconButton onClick={() => handleSettingsClick(element.id)}>
//               <IoSettingsOutline />
//             </IconButton>
//             {element.questionsectionsettings?.conditional && (
//               <span
//                 style={{
//                   backgroundColor: "green",
//                   color: "white",
//                   borderRadius: "10px",
//                   padding: "4px 8px",
//                   fontSize: "12px",
//                   marginLeft: "8px",
//                 }}
//               >
//                 Conditional
//               </span>
//             )}
//             <IconButton onClick={() => handleDeleteFormElement(element.id)}>
//               <RiDeleteBinLine />
//             </IconButton>
//           </Box>
//           {renderOptions(element, "radio")}
//         </Box>
//       );
//     case "Checkboxes":
//       return (
//         <Box key={element.id} sx={{ marginBottom: "8px" }}>
//           <Typography>Checkbox:</Typography>
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             {/* <Input type="checkbox" name={`checkbox-${element.id}`} sx={{ marginRight: "4px" }} /> */}
//             <TextField
//               variant="outlined"
//               placeholder="Checkboxes"
//               value={element.text}
//               size="small"
//               margin="normal"
//               fullWidth
//               onChange={(e) =>
//                 handleCheckboxTextChange(element.id, e.target.value)
//               }
//               sx={{ backgroundColor: "#fff" }}
//             />
//             <IconButton onClick={() => handleSettingsClick(element.id)}>
//               <IoSettingsOutline />
//             </IconButton>
//             {element.questionsectionsettings?.conditional && (
//               <span
//                 style={{
//                   backgroundColor: "green",
//                   color: "white",
//                   borderRadius: "10px",
//                   padding: "4px 8px",
//                   fontSize: "12px",
//                   marginLeft: "8px",
//                 }}
//               >
//                 Conditional
//               </span>
//             )}
//             <IconButton onClick={() => handleDeleteFormElement(element.id)}>
//               <RiDeleteBinLine />
//             </IconButton>
//           </Box>
//           {renderOptions(element, "checkbox")}
//         </Box>
//       );
//     case "Dropdown":
//       return (
//         <Box key={element.id} sx={{ marginBottom: "8px" }}>
//           <Typography>Dropdown:</Typography>
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <TextField
//               variant="outlined"
//               placeholder="Dropdown"
//               value={element.text}
//               size="small"
//               margin="normal"
//               fullWidth
//               onChange={(e) =>
//                 handleCheckboxTextChange(element.id, e.target.value)
//               }
//               sx={{ backgroundColor: "#fff" }}
//             />
//             <IconButton onClick={() => handleSettingsClick(element.id)}>
//               <IoSettingsOutline />
//             </IconButton>
//             {element.questionsectionsettings?.conditional && (
//               <span
//                 style={{
//                   backgroundColor: "green",
//                   color: "white",
//                   borderRadius: "10px",
//                   padding: "4px 8px",
//                   fontSize: "12px",
//                   marginLeft: "8px",
//                 }}
//               >
//                 Conditional
//               </span>
//             )}
//             <IconButton onClick={() => handleDeleteFormElement(element.id)}>
//               <RiDeleteBinLine />
//             </IconButton>
//           </Box>
//           {renderOptions(element)}
//         </Box>
//       );

//     case "Yes/No":
//       return (
//         <Box key={element.id} sx={{ marginBottom: "8px" }}>
//           <Typography>Yes/No:</Typography>
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <TextField
//               variant="outlined"
//               placeholder="Yes/No"
//               value={element.text}
//               size="small"
//               margin="normal"
//               fullWidth
//               onChange={(e) =>
//                 handleElementTextChange(element.id, e.target.value)
//               }
//               sx={{ backgroundColor: "#fff" }}
//             />
//             <IconButton onClick={() => handleSettingsClick(element.id)}>
//               <IoSettingsOutline />
//             </IconButton>
//             {element.questionsectionsettings?.conditional && (
//               <span
//                 style={{
//                   backgroundColor: "green",
//                   color: "white",
//                   borderRadius: "10px",
//                   padding: "4px 8px",
//                   fontSize: "12px",
//                   marginLeft: "8px",
//                 }}
//               >
//                 Conditional
//               </span>
//             )}
//             <IconButton onClick={() => handleDeleteFormElement(element.id)}>
//               <RiDeleteBinLine />
//             </IconButton>
//           </Box>
//           {renderOptions(element, "Yes/No")}
//         </Box>
//       );

//     case "File Upload":
//       return (
//         <Box key={element.id}>
//           <Typography>File Upload:</Typography>
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <TextField
//               variant="outlined"
//               placeholder="File Upload"
//               value={element.text}
//               size="small"
//               margin="normal"
//               fullWidth
//               onChange={(e) =>
//                 handleElementTextChange(element.id, e.target.value)
//               }
//               sx={{ backgroundColor: "#fff" }}
//             />
//             <IconButton onClick={() => handleSettingsClick(element.id)}>
//               <IoSettingsOutline />
//             </IconButton>
//             {element.questionsectionsettings?.conditional && (
//               <span
//                 style={{
//                   backgroundColor: "green",
//                   color: "white",
//                   borderRadius: "10px",
//                   padding: "4px 8px",
//                   fontSize: "12px",
//                   marginLeft: "8px",
//                 }}
//               >
//                 Conditional
//               </span>
//             )}
//             <IconButton onClick={() => handleDeleteFormElement(element.id)}>
//               <RiDeleteBinLine />
//             </IconButton>
//           </Box>
//           <Button
//             component="label"
//             role={undefined}
//             variant="outlined"
//             disabled
//             tabIndex={-1}
//             startIcon={<CloudUploadIcon />}
//           >
//             Upload files
//           </Button>
//         </Box>
//       );
//     case "Text Editor":
//       return (
//         <Box
//           key={element.id}
//           sx={{ marginTop: "16px", display: "flex", alignItems: "center" }}
//         >
//           <ReactQuill
//             theme="snow"
//             value={element.text}
//             modules={modules} // Set the custom modules
//             formats={formats} // Set the allowed formats
//             onChange={(newText) => handleQuillChange(element.id, newText)}
//           />

//           <IconButton onClick={() => handleDeleteFormElement(element.id)}>
//             <RiDeleteBinLine />
//           </IconButton>
//         </Box>
//       );
//     default:
//       return null;
//   }
// };
