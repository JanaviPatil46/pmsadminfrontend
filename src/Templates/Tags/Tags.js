import React, { useState, useEffect, useMemo, useContext } from 'react';
import { toast } from 'react-toastify';
import { LoginContext } from "../../Sidebar/Context/Context";
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { SideSheet } from '../../components/ui/side-sheet';
import { Pencil, Trash2, Loader2, Plus, Tag, AlertCircle } from 'lucide-react';
import { DataTable } from '../../components/data-table/data-table';
import { DataTableToolbar } from '../../components/data-table/toolbar';
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
  const [getId, setGetId] = useState("");
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
  const handleDelete = (_id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this tag?");
    if (isConfirmed) {
      setGetId(_id);
      fetch(`${TAGS_API}/tags/` + _id, { method: "DELETE", redirect: "follow" })
        .then((response) => {
          if (!response.ok) throw new Error('Failed to delete tagdata');
          return response.json();
        })
        .then(() => {
          toast.success('Tag deleted successfully');
          fetchData();
        })
        .catch((error) => {
          console.error(error);
          toast.error('Failed to delete tag');
        });
    }
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
        handleUpdateDrawerClose();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleFormClose = () => {
    handleUpdateDrawerClose();
  };


  const [globalFilter, setGlobalFilter] = useState("");

  const tagColumns = useMemo(() => [
    {
      accessorKey: "tagName",
      header: "Tag",
      cell: ({ getValue, row }) => (
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm"
          style={{ backgroundColor: row.original.tagColour }}
        >
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: "count",
      header: "Accounts",
      cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{getValue()}</span>,
    },
    {
      accessorKey: "archivedAccounts",
      header: "Archived",
      cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{getValue()}</span>,
    },
    {
      accessorKey: "pendingTasks",
      header: "Pending Tasks",
      cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{getValue()}</span>,
    },
    {
      accessorKey: "completedTasks",
      header: "Completed Tasks",
      cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{getValue()}</span>,
    },
    {
      accessorKey: "pipelines",
      header: "Pipelines",
      cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{getValue()}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      size: 80,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => { handleEdit(row.original._id); handleUpdateDrawerOpen(); }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDelete(row.original._id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button size="sm" onClick={handleDrawerOpen}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Tag
        </Button>
      </div>
      <DataTableToolbar globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
      <DataTable
        columns={tagColumns}
        data={tags}
        loading={loading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        enableRowSelection={false}
        getRowId={(row) => row._id}
        emptyMessage="No tags found"
        emptyDescription="Create your first tag to get started"
        pageSize={30}
      />

      {/* ===== CREATE TAG — SideSheet ===== */}
      <SideSheet
        open={isDrawerOpen}
        onOpenChange={(v) => !v && handleDrawerClose()}
        title="Create Tag"
        description="Add a new tag with a name and color."
        size="md"
        confirmLabel={loading ? undefined : "Submit"}
        cancelLabel="Clear"
        onConfirm={handleSubmit}
        onCancel={handleClear}
        isSubmitting={loading}
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Tag Name"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className={tagNameError ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {tagNameError && (
              <p className="flex items-center gap-1 text-xs text-destructive mt-1">
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
                  className={`h-8 w-8 rounded-full border-2 transition-all hover:scale-110 ${
                    selectedOption?.tagColour === color
                      ? 'border-foreground ring-2 ring-offset-2 ring-border'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {tagColourError && (
              <p className="flex items-center gap-1 text-xs text-destructive mt-1">
                <AlertCircle className="h-3 w-3" /> {tagColourError}
              </p>
            )}
          </div>
        </div>
      </SideSheet>

      {/* ===== EDIT TAG — SideSheet ===== */}
      <SideSheet
        open={isUpdateDrawerOpen}
        onOpenChange={(v) => !v && handleUpdateDrawerClose()}
        title="Edit Tag"
        description="Update the tag name and color."
        size="md"
        confirmLabel="Save"
        cancelLabel="Cancel"
        onConfirm={handleUpdatesumbit}
        onCancel={handleFormClose}
      >
        <div className="space-y-5">
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
                  className={`h-8 w-8 rounded-full border-2 transition-all hover:scale-110 ${
                    selectedOption?.tagColour === color
                      ? 'border-foreground ring-2 ring-offset-2 ring-border'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </SideSheet>
    </div>
  );
};

export default Tags;

