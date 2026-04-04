import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FormDrawer, FormDrawerFooter, FormSection, FormField } from "../../components/ui/form-layout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Pencil, Trash2, Circle, Loader2 } from "lucide-react";
const Clientfacing = () => {
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
  const [clientFacingJobs, setClientFacingJobs] = useState([]);
  const [clientFacingName, setClientFacingName] = useState("");

  const [clientFacingDescription, setClientFacingDescription] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");

  

  const colors = [
    "#0d6efd",
    "#6c757d",
    "#198754",
    "#dc3545",
    "#ffc107",
    "#0dcaf0",
    "#FF5722",
    "#212529",
  ];
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  

 

  const handleNewDrawerOpen = (jobId) => {
    console.log("Opening drawer for job ID:", jobId); // Log the job ID
    setIsNewDrawerOpen(true);
  };

  const handleNewDrawerClose = () => {
    setIsNewDrawerOpen(false);
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };
  const [loading, setLoading] = useState(true);
  // const fetchData = async () => {
  const fetchData = async () => {
    setLoading(true);
    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await fetch(
        `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setClientFacingJobs(data.clientFacingJobStatues); // Ensure data is set correctly
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      await loaderDelay;
      setLoading(false); // Stop loader
    }
  };

  // useEffect to fetch jobs when the component mounts
  useEffect(() => {
    fetchData();
  }, []);
  const [errors, setErrors] = useState({
  name: "",
  description: "",
  color: ""
});

const validateForm = () => {
  let valid = true;
  let newErrors = { name: "", description: "", color: "" };

  if (!selectedColor) {
    newErrors.color = "Please select a color";
    valid = false;
  }
  if (!clientFacingName.trim()) {
    newErrors.name = "Name is required";
    valid = false;
  }
  if (!clientFacingDescription.trim()) {
    newErrors.description = "Description is required";
    valid = false;
  } else if (clientFacingDescription.length > 200) {
    newErrors.description = "Description must be 200 characters or less";
    valid = false;
  }

  setErrors(newErrors);
  return valid;
};

  // const createJobFacing = () => {
  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");

  //   const raw = JSON.stringify({
  //     clientfacingName: clientFacingName,
  //     clientfacingColour: selectedColor,
  //     clientfacingdescription: clientFacingDescription,
  //   });

  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };

  //   fetch(
  //     `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`,
  //     requestOptions
  //   )
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log(result);
  //       fetchData();
  //       handleClearTemp();
  //       handleDrawerClose();
  //       toast.success("Client Facing Jobs created successfully");
  //     })
  //     .catch((error) => console.error(error));
  // };

 const createJobFacing = () => {
  if (!validateForm()) return; // stop if invalid

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    clientfacingName: clientFacingName.trim(),
    clientfacingColour: selectedColor,
    clientfacingdescription: clientFacingDescription.trim(),
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      fetchData();
      // handleClearTemp();
      handleDrawerClose();
       setClientFacingName("");
    setClientFacingDescription("");
    setSelectedColor("");
      toast.success("Client Facing Job created successfully");
    })
    .catch((error) => console.error(error));
};


  const handleClearTemp = () => {
    setClientFacingName("");
    setClientFacingDescription("");
    setSelectedColor("");
    handleDrawerClose();
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
     setClientFacingName("");
    setClientFacingDescription("");
    setSelectedColor("");
    setErrors({
  name: "",
  description: "",
  color: ""
})
  };
  const handleupdateclientstatus = () => {
    updateJobFacing(jobId);
  };

  const updateJobFacing = async (jobId) => {
    console.log(jobId);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      clientfacingName: clientFacingName,
      clientfacingColour: selectedColor,
      clientfacingdescription: clientFacingDescription,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(jobId);
    fetch(
      `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${jobId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        fetchData();
        handleClearTemp();
        handleNewDrawerClose();
        toast.success("Client Facing Jobs Updated successfully");
      })
      .catch((error) => console.error(error));
  };

  const deleteJobFacing = async (jobId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this client facing job?"
    );

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        clientfacingName: clientFacingName,
        clientfacingColour: selectedColor,
        clientfacingdescription: clientFacingDescription,
      });

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${jobId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          fetchData();
          toast.success("Item deleted successfully");
        })
        .catch((error) => console.error(error));
    }
  };
  //

  const handleEdit = async (jobId) => {
    console.log(jobId);
    handleNewDrawerOpen(jobId);
    try {
      const response = await fetch(
        `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${jobId}`
      );
      const data = await response.json();
      console.log("Fetched job data:", data);
      setJobId(data.clientfacingjobstatuses._id);
      setSelectedColor(data.clientfacingjobstatuses.clientfacingColour);
      console.log(data.clientfacingjobstatuses.clientfacingColour);
      setClientFacingName(data.clientfacingjobstatuses.clientfacingName);
      setClientFacingDescription(
        data.clientfacingjobstatuses.clientfacingdescription
      );
      console.log(data.clientfacingjobstatuses.clientfacingdescription);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };
  console.log(jobId);
  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button onClick={handleDrawerOpen}>
            Create status
          </Button>
        </div>

        {/* Display Current Status */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="space-y-3">
      {clientFacingJobs.map((job) => (
              <div
          key={job._id}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Circle
                    className="h-5 w-5 shrink-0"
                    fill={job.clientfacingColour}
                    stroke={job.clientfacingColour}
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{job.clientfacingName}</p>
                    <p className="text-xs text-muted-foreground">{job.clientfacingdescription}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(job._id)}
                    className="rounded-md p-2 text-primary transition-colors hover:bg-primary/10"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteJobFacing(job._id)}
                    className="rounded-md p-2 text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== CREATE DRAWER ===== */}
        <FormDrawer
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          title="Create Client-Facing Job Status"
          width="md"
        >
          <FormSection title="Status Details">
            <div className="flex items-start gap-4">
              <FormField label="Color" error={errors.color} className="w-1/3">
                <div className="relative">
                  <select
                    className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={selectedColor}
                        onChange={(e) => {
      setSelectedColor(e.target.value);
      if (e.target.value) {
                        setErrors((prev) => ({ ...prev, color: "" }));
                      }
                    }}
                    style={{ color: selectedColor || undefined }}
                  >
                    <option value="">Select</option>
                        {colors.map((color) => (
                      <option key={color} value={color} style={{ color: color, fontWeight: "bold" }}>
                        ● {color}
                      </option>
                    ))}
                  </select>
                  {selectedColor && (
                    <div
                      className="absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border border-border"
                      style={{ backgroundColor: selectedColor }}
                    />
                  )}
                </div>
              </FormField>

              <FormField label="Name" error={errors.name} className="flex-1">
                <Input
                      placeholder="Enter a name"
                      value={clientFacingName}
                      onChange={(e) => {
    setClientFacingName(e.target.value);
    if (e.target.value.trim()) {
                      setErrors((prev) => ({ ...prev, name: "" }));
    }
  }}
                    error={!!errors.name}
                />
              </FormField>
            </div>

            <FormField label="Status Description" error={errors.description}>
              <textarea
                className="flex min-h-[120px] w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
  placeholder="Status description for client"
                maxLength={200}
  rows={5}
  value={clientFacingDescription}
   onChange={(e) => {
    setClientFacingDescription(e.target.value);
    if (e.target.value.trim() && e.target.value.length <= 200) {
                    setErrors((prev) => ({ ...prev, description: "" }));
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {clientFacingDescription.length}/200
              </p>
            </FormField>
          </FormSection>

          <FormDrawerFooter>
            <Button variant="outline" onClick={handleClearTemp}>Cancel</Button>
            <Button onClick={createJobFacing}>Submit</Button>
          </FormDrawerFooter>
        </FormDrawer>

        {/* ===== EDIT DRAWER ===== */}
        <FormDrawer
          open={isNewDrawerOpen}
          onClose={handleNewDrawerClose}
          title="Update Client-Facing Job Status"
          width="md"
        >
          <FormSection title="Status Details">
            <div className="flex items-start gap-4">
              <FormField label="Color" className="w-1/3">
                <div className="relative">
                  <select
                    className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={selectedColor}
                        onChange={handleColorChange}
                    style={{ color: selectedColor || undefined }}
                  >
                    <option value="">Select</option>
                        {colors.map((color) => (
                      <option key={color} value={color} style={{ color: color, fontWeight: "bold" }}>
                        ● {color}
                      </option>
                    ))}
                  </select>
                  {selectedColor && (
                    <div
                      className="absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border border-border"
                      style={{ backgroundColor: selectedColor }}
                    />
                  )}
                </div>
              </FormField>

              <FormField label="Name" className="flex-1">
                <Input
                      placeholder="Enter a name"
                      value={clientFacingName}
                      onChange={(e) => setClientFacingName(e.target.value)}
                    />
              </FormField>
            </div>

            <FormField label="Status Description">
              <textarea
                className="flex min-h-[120px] w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
  placeholder="Status description for client"
                maxLength={200}
  rows={5}
  value={clientFacingDescription}
  onChange={(e) => setClientFacingDescription(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {clientFacingDescription.length}/200
              </p>
            </FormField>
          </FormSection>

          <FormDrawerFooter>
            <Button variant="outline" onClick={handleNewDrawerClose}>Cancel</Button>
            <Button onClick={handleupdateclientstatus}>Submit</Button>
          </FormDrawerFooter>
        </FormDrawer>
      </div>
    </div>
  );
};

export default Clientfacing;

