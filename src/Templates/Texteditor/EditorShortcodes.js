


import React, { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill Snow theme
import 'quill-emoji/dist/quill-emoji.css'; // Emoji styles
import Quill from 'quill';
import 'quill-emoji';

Quill.register('modules/emoji', require('quill-emoji'));

export default function Editor({ initialContent, onChange }) {
    const [editorContent, setEditorContent] = useState(initialContent || '');
  const [shortcuts, setShortcuts] = useState([]);
  const quillRef = useRef(null); // Reference to Quill editor
 const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [popoverAnchor, setPopoverAnchor] = useState(null);
 useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes("")));
  }, [shortcuts]);
  useEffect(() => {
  if (selectedOption === "contacts" || selectedOption === "account") {
    const accountShortcuts = [
      { title: "Account Shortcodes", isBold: true },
      { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
      // { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
      { title: "Date Shortcodes", isBold: true },
      { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
      { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
      { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
      { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
      { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
      { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
      { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
      { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
      { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
      { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
      { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
      { title: "Last week", isBold: false, value: "LAST_WEEK" },
      { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
      { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
      { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
      { title: "Last_year", isBold: false, value: "LAST_YEAR" },
      { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
      { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
      { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
      { title: "Next week", isBold: false, value: "NEXT_WEEK" },
      { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
      { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
      { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
      { title: "Next year", isBold: false, value: "NEXT_YEAR" },
    ];
    setShortcuts(accountShortcuts);
  }
}, [selectedOption]);


  // useEffect(() => {
  //   // Set shortcuts based on selected option
  //   if (selectedOption === "contacts") {
  //     const contactShortcuts = [
  //       { title: "Account Shortcodes", isBold: true },
  //       { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
  //       { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
  //       { title: "Contact Shortcodes", isBold: true },
  //       { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
  //       { title: "First Name", isBold: false, value: "FIRST_NAME" },
  //       { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
  //       { title: "Last Name", isBold: false, value: "LAST_NAME" },
  //       { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
  //       { title: "Country", isBold: false, value: "COUNTRY" },
  //       { title: "Company name", isBold: false, value: "COMPANY_NAME " },
  //       { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
  //       { title: "City", isBold: false, value: "CITY" },
  //       { title: "State/Province", isBold: false, value: "STATE / PROVINCE" },
  //       { title: "Zip/Postal code", isBold: false, value: "ZIP / POSTAL CODE" },
  //       { title: "Custom field:Email", isBold: false, value: "CONTACT_CUSTOM_FIELD:Email" },
  //       { title: "Date Shortcodes", isBold: true },
  //       { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
  //       { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
  //       { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
  //       { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
  //       { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
  //       { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
  //       { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
  //       { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
  //       { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
  //       { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
  //       { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
  //       { title: "Last week", isBold: false, value: "LAST_WEEK" },
  //       { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
  //       { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
  //       { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
  //       { title: "Last_year", isBold: false, value: "LAST_YEAR" },
  //       { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
  //       { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
  //       { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
  //       { title: "Next week", isBold: false, value: "NEXT_WEEK" },
  //       { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
  //       { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
  //       { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
  //       { title: "Next year", isBold: false, value: "NEXT_YEAR" },
  //     ];
  //     setShortcuts(contactShortcuts);
  //   } else if (selectedOption === "account") {
  //     const accountShortcuts = [
  //       { title: "Account Shortcodes", isBold: true },
  //       { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
  //       { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
  //       { title: "Date Shortcodes", isBold: true },
  //       { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
  //       { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
  //       { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
  //       { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
  //       { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
  //       { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
  //       { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
  //       { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
  //       { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
  //       { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
  //       { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
  //       { title: "Last week", isBold: false, value: "LAST_WEEK" },
  //       { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
  //       { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
  //       { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
  //       { title: "Last_year", isBold: false, value: "LAST_YEAR" },
  //       { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
  //       { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
  //       { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
  //       { title: "Next week", isBold: false, value: "NEXT_WEEK" },
  //       { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
  //       { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
  //       { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
  //       { title: "Next year", isBold: false, value: "NEXT_YEAR" },
  //     ];
  //     setShortcuts(accountShortcuts);
  //   }
  // }, [selectedOption]);

  // Open dropdown at button position
  const handleOpenDropdown = (event) => {
    setPopoverAnchor(event.currentTarget);
  };

  // Close dropdown
  const handleCloseDropdown = () => {
    setPopoverAnchor(null);
  };

  // Insert shortcode into editor at cursor position
  const insertShortcode = (value) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range) {
        editor.insertText(range.index, `[${value}]`);
        editor.setSelection(range.index + value.length + 4); // Move cursor after inserted text
      }
    }
    handleCloseDropdown();
  };
    // Handle content change
    const handleEditorChange = (content) => {
        setEditorContent(content);
        onChange(content); // Call the onChange prop with the current content
    };

    useEffect(() => {
        if (initialContent) {
            setEditorContent(initialContent);
        }
    }, [initialContent]);
  // Toolbar configuration
  const modules = {
    toolbar: {
      container: [
        [{ 'font': [] }, { 'size': [] }],
        [{ 'header': '1' }, { 'header': '2' }, { 'align': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ 'emoji': true }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        ['clean'],
        ['undo', 'redo'],
      ],
    },
    'emoji-toolbar': true,
    'emoji-textarea': false,
    'emoji-shortname': true,
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true,
    },
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'script', 'list', 'bullet', 'indent',
    'color', 'background', 'align',
    'blockquote', 'code-block', 'link', 'image',
    'undo', 'redo', 'emoji'
  ];

  return (
    <div className="[&_.ql-editor]:min-h-[150px] [&_.ql-editor]:h-auto [&_.ql-editor]:overflow-y-visible relative">
      <ReactQuill
        ref={quillRef}
        value={editorContent}
        onChange={(content) => {
          setEditorContent(content);
          onChange(content);
        }}
        modules={modules}
        formats={formats}
        theme="snow"
      />

      {/* Insert Shortcode button */}
      <div className="relative mt-2 mb-1 inline-block">
        <button
          type="button"
          onClick={handleOpenDropdown}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
          Insert Shortcode
        </button>

        {/* Dropdown — fixed to viewport so it never overflows */}
        {Boolean(popoverAnchor) && (() => {
          const rect = popoverAnchor.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          const openUp = spaceBelow < 240;
          return (
            <>
              <div className="fixed inset-0 z-40" onClick={handleCloseDropdown} />
              <div
                className="fixed z-50 w-64 rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5 overflow-hidden"
                style={{
                  left: Math.min(rect.left, window.innerWidth - 272),
                  ...(openUp
                    ? { bottom: window.innerHeight - rect.top + 4, top: "auto" }
                    : { top: rect.bottom + 4 }),
                }}
              >
                <div className="max-h-60 overflow-y-auto overscroll-contain">
                  {filteredShortcuts.length === 0 ? (
                    <p className="px-4 py-6 text-center text-xs text-slate-400">No shortcodes found</p>
                  ) : (
                    filteredShortcuts.map((shortcut, index) => (
                      shortcut.isBold ? (
                        <div key={index} className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-50">
                          {shortcut.title}
                        </div>
                      ) : (
                        <button
                          key={index}
                          type="button"
                          onClick={() => insertShortcode(shortcut.value)}
                          className="flex w-full items-center px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left"
                        >
                          {shortcut.title}
                        </button>
                      )
                    ))
                  )}
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
