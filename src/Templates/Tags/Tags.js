import React, { useState, useEffect, useMemo, useContext } from 'react';
import './tag.css'
import { toast } from 'react-toastify';
import { LoginContext } from "../../Sidebar/Context/Context";
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '../../components/ui/sheet';
import { MoreVertical, Pencil, Trash2, Loader2, ChevronLeft, ChevronRight, Plus, Search, Settings, X, Tag, AlertCircle } from 'lucide-react';
const Tags = () => {

 const { logindata } = useContext(LoginContext);
 console.log("janavi",logindata)
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;

  const [tags, setTags] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [tagidget, setTagidGet] = useState("");
  const [getId, setGetId] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [tagid, settagidData] = useState();

  // const colors = ["#EE4B2B", "#FFAC1C", "#32CD32", "#008000", "#0000FF", "#BF40BF", "#F72798"];
  // const colors = ["#fd3241", "#f9b5ac", "#ac6400", "#ff7e39", "#ffea00", "#94ecbe", "#2e8b57", "#76ac1e", "#3cbb50", "#9ed8db", "#0299bb", "#0af4b8", "#466efb", "#0496ff", "#b9c1ff",
  //   "#e1b1ff", "#9d33d0", "#d834f5", "#ff54b6", "#1d3354", "#767b91", "#8f8f8f", "#c7c7c7", "#9a657e", "#616468", "#511dff", "#85c7db", "#8cd1ff", "#0aefff", "#d4ff00", "#a1ff0a", "#00f43d", "#ffc100",
  //   "#cdc6a5", "#fed6b1", "#e5dfdf", "#ffeaa7"
  // ];

  const colors = ["#0d6efd", "#6c757d","#198754","#dc3545","#ffc107","#0dcaf0","#FF5722","#212529"];
  const [loading, setLoading] = useState(true); // Loader state
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true); // Start loader

    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await fetch(`${TAGS_API}/tags/accountcountoftag/account`);
      const data = await response.json();
      setTags(data.tagCounts);
      

    } catch (error) {
      console.error("Error fetching data:", error);
    }
    finally {
      // Wait for the fetch and the 3-second timer to complete
      await loaderDelay;
      setLoading(false); // Stop loader
    }
  };

  const generateOptions = (inputValue) => {
    return colors.map((tagColour, index) => ({
      value: `${inputValue.toLowerCase()}-${index}`,
      tagName: inputValue,
      tagColour: tagColour,
    }));
  };



  const handleChange = (event) => {
    const value = event.target.value;
    const selectedOption = options.find(option => option.tagColour === value);
    setSelectedOption(selectedOption);
  };

  // const handleChange = (event, newValue) => {
  //   setSelectedOption(newValue);
  // };

  const handleUpdateDrawerOpen = () => {
    setIsUpdateDrawerOpen(true);
  };

  const handleUpdateDrawerClose = () => {
    setIsUpdateDrawerOpen(false);
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
    // if (!isManageTagsAllowed) {
    //   alert('You are a restricted user and cannot perform this action.');
    // } else {
    //   setIsDrawerOpen(true);
    // }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const selectWidth = inputValue ? `${inputValue.length * 5 + 10}px` : '';

  const handleEdit = async (_id) => {
    setGetId(_id);
    setOpenMenuId(false);
    const response = await fetch(`${TAGS_API}/tags/` + _id);
    if (!response.ok) {
      throw new Error('Failed to fetch tag data');
    }
    const data = await response.json();
    const tag = data.tag;
    settagidData(tag);
    setInputValue(tag.tagName);
    const newOptions = generateOptions(tag.tagName);
    setOptions(newOptions);

    // Set the selected option based on the fetched tag
    const selectedTag = newOptions.find(option => option.tagColour === tag.tagColour);
    setSelectedOption(selectedTag || null);
  };


  const handleInputChange = (inputValue) => {
    setInputValue(inputValue);
    console.log(inputValue)
    const newOptions = generateOptions(inputValue);
    setOptions(newOptions);

    // If editing an existing tag, update the selectedOption to reflect the input change
    if (isUpdateDrawerOpen && selectedOption) {
      const updatedOption = newOptions.find(option => option.tagName === selectedOption.tagName);
      if (updatedOption) {
        setSelectedOption(updatedOption);
      }
    }
  };

  const [tagNameError, setTagNameError] = useState('');
  const [tagColourError, setTagColourError] = useState('');
  const validateForm = () => {
    let isValid = true;
    if (!inputValue) {
      setTagNameError("Tag Name can't be blank");
      // toast.error("Name can't be blank");
      isValid = false;
    } else {
      setTagNameError('');
    }

     // Validate Tag Colour
  if (!selectedOption) {
    setTagColourError("Tag Colour can't be blank");
    isValid = false;
  } else {
    setTagColourError('');
  }
    return isValid;
  }
  console.log(tagidget);
  const handleDelete = (_id) => {
    console.log("hgh",_id)
    // Show a confirmation prompt
    const isConfirmed = window.confirm("Are you sure you want to delete this tag?");

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      setGetId(_id);
      setOpenMenuId(false);
      const requestOptions = {
        method: "DELETE",
        redirect: "follow"
      };
      fetch(`${TAGS_API}/tags/` + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete tagdata');
          }
          return response.json();
        })
        .then((result) => {
          console.log(result);
          toast.success('Tagdata deleted successfully');
          handleMenuClose()
          fetchData();
          setOpenMenuId(false);
        })
        .catch((error) => {
          console.error(error);
          toast.error('Failed to delete tagdata');
        });
    }
  };
  const [tempIdget, setTempIdGet] = useState("");
   const toggleMenu = (event, _id) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(_id);
    setTempIdGet(_id);
  };
    const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
    setTempIdGet(null);
  };
  const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
    
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (!event.target.closest(".menu-container")) {
  //       setOpenMenuId(null);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);
  
  const handleClear = () => {
    setInputValue("");
    setSelectedOption(null);
    setOptions([]);
    handleDrawerClose();
  };


  const handleSubmit = () => {
    // Prevent form submission if validation fails
    if (!validateForm()) {
        return; 
    } 
    setLoading(true); // Start loader
    // Proceed only if an option is selected
    if (selectedOption) {
        const { tagName, tagColour } = selectedOption;
        sendApiData(tagName, tagColour);
    }

    // Clear the form regardless of selection
    handleClear();
};


  const sendApiData = (tagName, tagColour) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      tagName: tagName,
      tagColour: tagColour,
    });
    console.log(raw)
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(`${TAGS_API}/tags/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result && result.message === "Tag with this TagName already exists") {
          toast.success('Tag with this TagName already exists');
          // fetchData();
        } else {
          toast.success("Tag data sent successfully!");
          fetchData();

          setTags([...tags, { tagName, tagColour }]);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      })
      .finally(() => setLoading(false)); // Stop loader
  };

  const handleUpdatesumbit = () => {
    

    if (selectedOption) {
      const { tagColour } = selectedOption;
      UpdatedTag(inputValue, tagColour);
    }
  };

  const UpdatedTag = (tagName, tagColour) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      tagName: tagName,
      tagColour: tagColour
    });
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    fetch(`${TAGS_API}/tags/` + getId, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        toast.success('Tag Updated successfully');
        fetchData();
        handleClear();
        setOpenMenuId(false);
        handleUpdateDrawerClose();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleFormClose = () => {
    handleUpdateDrawerClose();
  };


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30); // Default rows per page

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const [searchTerm, setSearchTerm] = useState(""); // New state for search

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset pagination on search
  };
   // Filter tags based on search term
   const filteredTags = tags.filter((tag) =>
    tag.tagName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Slice data for pagination after filtering
  const paginatedTags = filteredTags.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
 // Slice data for pagination
//  const paginatedTags = tags.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-800">Tags</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search tags..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          <Button onClick={handleDrawerOpen}>
            <Plus className="mr-2 h-4 w-4" /> Add Tag
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Tag</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Accounts</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Archived</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Pending Tasks</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Completed Tasks</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 hidden xl:table-cell">Pipelines</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 w-20 text-right">
                    <Settings className="h-4 w-4 ml-auto text-slate-400" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedTags.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">No tags found.</td>
                  </tr>
                ) : (
                  paginatedTags.map((row) => (
                    <tr key={row._id} className="group transition-colors hover:bg-slate-50/70">
                      <td className="px-5 py-3">
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm"
                          style={{ backgroundColor: row.tagColour }}
                        >
                          {row.tagName}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-600">{row.count}</td>
                      <td className="px-5 py-3 text-sm text-slate-600 hidden md:table-cell">{row.archivedAccounts}</td>
                      <td className="px-5 py-3 text-sm text-slate-600 hidden lg:table-cell">{row.pendingTasks}</td>
                      <td className="px-5 py-3 text-sm text-slate-600 hidden lg:table-cell">{row.completedTasks}</td>
                      <td className="px-5 py-3 text-sm text-slate-600 hidden xl:table-cell">{row.pipelines}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={(event) => toggleMenu(event, row._id)}
                            className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {openMenuId === row._id && (
                            <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg animate-in fade-in-0 zoom-in-95">
                              <button
                                onClick={() => { handleEdit(tempIdget); handleUpdateDrawerOpen(); handleMenuClose(); }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                <Pencil className="h-3.5 w-3.5" /> Edit
                              </button>
                              <button
                                onClick={() => { handleDelete(tempIdget); }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredTags.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/40 px-5 py-3">
              <p className="text-xs text-slate-500">
                Showing <span className="font-semibold text-slate-700">{page * rowsPerPage + 1}</span>–<span className="font-semibold text-slate-700">{Math.min((page + 1) * rowsPerPage, filteredTags.length)}</span> of{" "}
                <span className="font-semibold text-slate-700">{filteredTags.length}</span>
              </p>
              <div className="flex items-center gap-2">
                <select
                  value={rowsPerPage}
                  onChange={(e) => handleChangeRowsPerPage({ target: { value: e.target.value } })}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[5, 10, 25, 50].map((opt) => (
                    <option key={opt} value={opt}>{opt} / page</option>
                  ))}
                </select>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleChangePage(null, page - 1)}
                    disabled={page === 0}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="min-w-[3rem] text-center text-xs font-medium text-slate-600">
                    {page + 1} / {Math.max(1, Math.ceil(filteredTags.length / rowsPerPage))}
                  </span>
                  <button
                    onClick={() => handleChangePage(null, page + 1)}
                    disabled={(page + 1) * rowsPerPage >= filteredTags.length}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== CREATE TAG SHEET ===== */}
      <Sheet open={isDrawerOpen} onOpenChange={(open) => { if (!open) handleDrawerClose(); }}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-blue-500" /> Create Tag
            </SheetTitle>
            <SheetDescription>Add a new tag with a name and color.</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Tag Name"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                className={tagNameError ? 'border-red-400 focus-visible:ring-red-400' : ''}
              />
              {tagNameError && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                  <AlertCircle className="h-3 w-3" /> {tagNameError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              {selectedOption && (
                <div className="mb-2">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
                    style={{ backgroundColor: selectedOption.tagColour }}
                  >
                    {selectedOption.tagName || inputValue}
                  </span>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      const opt = options.find(o => o.tagColour === color) || { value: `${inputValue}-${color}`, tagName: inputValue, tagColour: color };
                      setSelectedOption(opt);
                      if (color) setTagColourError('');
                    }}
                    className={`h-8 w-8 rounded-full border-2 transition-all hover:scale-110 ${selectedOption?.tagColour === color ? 'border-slate-800 ring-2 ring-offset-2 ring-slate-400' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {tagColourError && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                  <AlertCircle className="h-3 w-3" /> {tagColourError}
                </p>
              )}
            </div>
          </div>

          <SheetFooter className="mt-8 flex gap-3 sm:justify-start">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={loading}>
              Clear
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* ===== EDIT TAG SHEET ===== */}
      <Sheet open={isUpdateDrawerOpen} onOpenChange={(open) => { if (!open) handleUpdateDrawerClose(); }}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-blue-500" /> Edit Tag
            </SheetTitle>
            <SheetDescription>Update the tag name and color.</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Tag Name"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              {selectedOption && (
                <div className="mb-2">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
                    style={{ backgroundColor: selectedOption.tagColour }}
                  >
                    {selectedOption.tagName || inputValue}
                  </span>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      const opt = options.find(o => o.tagColour === color) || { value: `${inputValue}-${color}`, tagName: inputValue, tagColour: color };
                      setSelectedOption(opt);
                    }}
                    className={`h-8 w-8 rounded-full border-2 transition-all hover:scale-110 ${selectedOption?.tagColour === color ? 'border-slate-800 ring-2 ring-offset-2 ring-slate-400' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="mt-8 flex gap-3 sm:justify-start">
            <Button onClick={handleUpdatesumbit}>Save</Button>
            <Button variant="outline" onClick={handleFormClose}>Cancel</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Tags;

