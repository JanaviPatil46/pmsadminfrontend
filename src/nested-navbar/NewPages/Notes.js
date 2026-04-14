import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Editor from "../../Templates/Texteditor/Editor";
import { useParams } from "react-router-dom";
import { LoginContext } from "../../Sidebar/Context/Context";
import { toast } from "react-toastify";
import { MdPushPin, MdOutlinePushPin, MdArchive, MdUnarchive, MdDelete } from "react-icons/md";

const NoteApp = () => {
  const ACC_NOTE = process.env.REACT_APP_ACCOUNT_NOTE_URL
  const { data } = useParams();
  const [view, setView] = useState("active");
  const [notes, setNotes] = useState([]);
  const [newNoteVisible, setNewNoteVisible] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState("");

  const { logindata } = useContext(LoginContext);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const [loginuserid, setLoginUserId] = useState("");
  const [username, setUsername] = useState("");

  const fetchUserData = async (id) => {
    const myHeaders = new Headers();
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setUsername(result.username);
      });
  };

  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
      fetchUserData(logindata.user.id);
    }
  }, [logindata]);

  const handleFetchNotesByAccId = (accountId) => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${ACC_NOTE}/account/notes/account/${accountId}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        const formattedNotes = response.data.notes.map((note) => ({
          id: note._id,
          text: note.noteData,
          createdBy: note.createdBy,
          time: new Date(note.createdAt).toLocaleDateString("en-US", {
            hour: "2-digit",
                minute: "2-digit",
            hour12: true,
          }),
          editedTime: note.updatedAt
            ? new Date(note.updatedAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : null,
          archived: !note.active,
          pinned: note.pinned || false, // Add pinned status
        }));
        // Sort notes - pinned first, then by creation time
        formattedNotes.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setNotes(formattedNotes);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  };

  useEffect(() => {
    handleFetchNotesByAccId(data);
  }, []);

  const handleViewChange = (event, nextView) => {
    if (nextView !== null) setView(nextView);
  };

  const handleEditorChange = (content) => {
    setNewNoteText(content);
  };

  const handleAddNote = async () => {
    const payload = {
      account: data,
      noteData: newNoteText,
      createdBy: username,
    };

    try {
      const response = await axios.request({
        method: "post",
        url: `${ACC_NOTE}/account/notes/`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(payload),
      });
  setNewNoteText("");
      setNewNoteVisible(false);
      toast.success("Note created successfully")
      handleFetchNotesByAccId(data);
    
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const handleTogglePin = async (noteId) => {
    try {
      // Find the note to get current pinned status
      const note = notes.find((n) => n.id === noteId);
      if (!note) return;

      const response = await axios.request({
        method: "patch",
        url: `${ACC_NOTE}/account/notes/${noteId}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          pinned: !note.pinned,
        }),
      });
      console.log("pinned responce", response);
      // Refresh the notes list
      handleFetchNotesByAccId(data);
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    }
  };

  const handleEditNote = (noteId, noteText) => {
    setEditingNoteId(noteId);
    setEditingNoteText(noteText);
  };

  const handleUpdateNote = async () => {
    if (!editingNoteId) return;

    try {
      const response = await axios.request({
        method: "patch",
        url: `${ACC_NOTE}/account/notes/${editingNoteId}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          noteData: editingNoteText,
        }),
      });

      // Refresh the notes list
      handleFetchNotesByAccId(data);
      setEditingNoteId(null);
      setEditingNoteText("");
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingNoteText("");
  };

  const filteredNotes = notes.filter(
    (note) => note.archived === (view === "archived")
  );
  const handleArchiveNote = async (noteId) => {
    try {
      await axios.request({
        method: "patch",
        url: `${ACC_NOTE}/account/notes/${noteId}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          active: false,
        }),
      });
toast.success("Note archived")
      // Refresh the notes list
      handleFetchNotesByAccId(data);
    } catch (error) {
      console.error("Failed to archive note:", error);
    }
  };

  const handleUnarchiveNote = async (noteId) => {
    try {
      await axios.request({
        method: "patch",
        url: `${ACC_NOTE}/account/notes/${noteId}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          active: true,
        }),
      });
toast.success("Note Restored Successfully")
      // Refresh the notes list
      handleFetchNotesByAccId(data);
    } catch (error) {
      console.error("Failed to unarchive note:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.request({
        method: "delete",
        url: `${ACC_NOTE}/account/notes/${noteId}`,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Refresh the notes list
      handleFetchNotesByAccId(data);
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };
  // 1. State at the top of your component
const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
const [noteToDelete, setNoteToDelete] = useState(null);
const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);

// 2. Handler functions
const handleDeleteClick = (noteId) => {
  setNoteToDelete(noteId);
  setDeleteConfirmationText("");
  setIsDeleteEnabled(false);
  setDeleteConfirmOpen(true); // This should open the dialog
};

const handleDeleteConfirmationChange = (e) => {
  const text = e.target.value;
  setDeleteConfirmationText(text);
  setIsDeleteEnabled(text === "DELETE");
};

const handleConfirmDelete = async () => {
  if (!isDeleteEnabled || !noteToDelete) return;
  
  try {
    await axios.delete(`${ACC_NOTE}/account/notes/${noteToDelete}`);
    handleFetchNotesByAccId(data); // Refresh your notes list
    setDeleteConfirmOpen(false);
  } catch (error) {
    console.error("Failed to delete note:", error);
  }
};
  const saveBtnCls = "rounded-full px-5 py-1.5 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)]";
  const cancelBtnCls = "rounded-full px-5 py-1.5 text-sm font-medium border border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white";

  return (
    <div className="p-6 bg-[#f9fbfd] min-h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center bg-[#e8edf3] rounded-xl p-1.5 gap-1">
          {[{ label: "Active", val: "active" }, { label: "Archived", val: "archived" }].map(({ label, val }) => (
            <button key={val} type="button"
              onClick={() => handleViewChange(null, val)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                view === val ? 'bg-white font-bold text-[var(--color-save-btn)]' : 'text-gray-600'
              }`}
            >{label}</button>
          ))}
        </div>
        <button type="button" onClick={() => setNewNoteVisible(true)} className={saveBtnCls}>
          New note
        </button>
      </div>

      {/* New note editor */}
      {newNoteVisible && (
        <div className="mb-4">
          <Editor onChange={handleEditorChange} content={newNoteText} />
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={handleAddNote} className={saveBtnCls}>Save</button>
            <button type="button" onClick={() => setNewNoteVisible(false)} className={cancelBtnCls}>Cancel</button>
          </div>
        </div>
      )}

      {/* Notes list */}
      <div className="space-y-3">
        {filteredNotes.map((note) => (
          <div key={note.id}
            className={`rounded-lg border bg-white p-4 ${
              note.pinned ? 'border-l-4 border-l-yellow-400 border-gray-200' : 'border-gray-200'
            }`}
          >
            {editingNoteId === note.id ? (
              <div>
                <Editor onChange={setEditingNoteText} initialContent={editingNoteText} />
                <div className="flex gap-2 mt-5">
                  <button type="button" onClick={handleUpdateNote} className={saveBtnCls}>Update</button>
                  <button type="button" onClick={handleCancelEdit} className={cancelBtnCls}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <div
                  className="text-sm text-gray-800 mb-3 [&_img]:max-w-full [&_a]:break-all"
                  dangerouslySetInnerHTML={{ __html: note.text || "No content available" }}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {view === "active" ? (
                      <>
                        <button type="button" onClick={() => handleTogglePin(note.id)}
                          className={`p-1 rounded hover:bg-gray-100 ${
                            note.pinned ? 'text-blue-500' : 'text-gray-400'
                          }`}>
                          {note.pinned ? <MdPushPin size={16} /> : <MdOutlinePushPin size={16} />}
                        </button>
                        <button type="button" onClick={() => handleArchiveNote(note.id)}
                          className="p-1 rounded hover:bg-gray-100 text-gray-400">
                          <MdArchive size={16} />
                        </button>
                        <button type="button" onClick={() => handleEditNote(note.id, note.text)}
                          className="text-sm text-blue-600 cursor-pointer hover:underline">
                          Edit
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => handleUnarchiveNote(note.id)}
                          className="flex items-center gap-1 text-sm text-blue-600 cursor-pointer hover:underline">
                          <MdUnarchive size={16} /> Move to Active
                        </button>
                        <button type="button" onClick={() => handleDeleteClick(note.id)}
                          className="flex items-center gap-1 text-sm text-red-500 cursor-pointer hover:underline">
                          <MdDelete size={16} /> Delete
                        </button>
                      </>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {view === "active"
                      ? `Created by ${note.createdBy} on ${note.time}`
                      : `Archived by ${note.createdBy} on ${note.time}`}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete confirm modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDeleteConfirmOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
            <h2 className="text-base font-semibold mb-2">Delete the note?</h2>
            <p className="text-sm text-gray-600">Are you sure you want to delete this note?</p>
            <p className="text-sm text-gray-600 mt-1">This action is not reversible. If you proceed to delete the note, you will not be able to recover it.</p>
            <p className="text-sm font-medium mt-4 mb-1">To proceed, type <strong>DELETE</strong> below.</p>
            <input
              type="text"
              className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={deleteConfirmationText}
              onChange={handleDeleteConfirmationChange}
              placeholder="Enter DELETE to confirm"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setDeleteConfirmOpen(false)} className={cancelBtnCls}>Cancel</button>
              <button type="button" onClick={handleConfirmDelete} disabled={!isDeleteEnabled}
                className={`rounded-full px-5 py-1.5 text-sm font-medium text-white ${
                  isDeleteEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-red-200 cursor-not-allowed'
                }`}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteApp;
