import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { SideSheet } from "../../components/ui/side-sheet";
import { FormSection } from "../../components/ui/form-layout";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
const clientFacingSchema = z.object({
  clientfacingName: z.string().min(1, "Name is required"),
  clientfacingdescription: z.string().min(1, "Description is required").max(200, "Description must be 200 characters or less"),
  clientfacingColour: z.string().min(1, "Please select a color"),
});

const Clientfacing = () => {
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
  const [clientFacingJobs, setClientFacingJobs] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const [jobId, setJobId] = useState(null);

  const createForm = useForm({
    resolver: zodResolver(clientFacingSchema),
    defaultValues: { clientfacingName: "", clientfacingdescription: "", clientfacingColour: "" },
  });

  const editForm = useForm({
    resolver: zodResolver(clientFacingSchema),
    defaultValues: { clientfacingName: "", clientfacingdescription: "", clientfacingColour: "" },
  });

  

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

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => { setIsDrawerOpen(false); createForm.reset(); };
  const handleNewDrawerOpen = () => setIsNewDrawerOpen(true);
  const handleNewDrawerClose = () => { setIsNewDrawerOpen(false); editForm.reset(); };

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
  const createJobFacing = (data) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify(data);
    const requestOptions = { method: "POST", headers: myHeaders, body: raw, redirect: "follow" };
    fetch(`${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        fetchData();
        handleDrawerClose();
        toast.success("Client Facing Job created successfully");
      })
      .catch((error) => console.error(error));
  };

  const updateJobFacing = async (data) => {
    console.log(jobId);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify(data);

    const requestOptions = { method: "PATCH", headers: myHeaders, body: raw, redirect: "follow" };
    console.log(jobId);
    fetch(`${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${jobId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        fetchData();
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
      const requestOptions = {
        method: "DELETE",
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

  const handleEdit = async (id) => {
    console.log(id);
    handleNewDrawerOpen();
    try {
      const response = await fetch(`${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${id}`);
      const data = await response.json();
      console.log("Fetched job data:", data);
      const s = data.clientfacingjobstatuses;
      setJobId(s._id);
      editForm.reset({
        clientfacingName: s.clientfacingName,
        clientfacingdescription: s.clientfacingdescription,
        clientfacingColour: s.clientfacingColour,
      });
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };
  const [globalFilter, setGlobalFilter] = useState("");

  const clientFacingColumns = useMemo(() => [
    {
      id: "color",
      header: "Color",
      size: 60,
      enableSorting: false,
      cell: ({ row }) => (
        <span
          className="inline-block h-4 w-4 rounded-full border border-border/50 shrink-0"
          style={{ backgroundColor: row.original.clientfacingColour }}
        />
      ),
    },
    {
      accessorKey: "clientfacingName",
      header: "Name",
      cell: ({ getValue, row }) => (
        <button
          onClick={() => handleEdit(row.original._id)}
          className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors text-left"
        >
          {getValue()}
        </button>
      ),
    },
    {
      accessorKey: "clientfacingdescription",
      header: "Description",
      cell: ({ getValue }) => (
        <span className="text-xs text-muted-foreground truncate block max-w-[300px]">{getValue() || "—"}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      size: 80,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => handleEdit(row.original._id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => deleteJobFacing(row.original._id)}
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
    <div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Button size="sm" onClick={handleDrawerOpen}>
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Create New Status
          </Button>
        </div>

        <DataTableToolbar globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
        <DataTable
          columns={clientFacingColumns}
          data={clientFacingJobs}
          loading={loading}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          enableRowSelection={false}
          getRowId={(row) => row._id}
          emptyMessage="No client-facing statuses found"
          emptyDescription="Create your first status to get started"
          pageSize={25}
        />

        {/* ===== CREATE SHEET ===== */}
        <SideSheet
          open={isDrawerOpen}
          onOpenChange={(open) => !open && handleDrawerClose()}
          title="Create Client-Facing Job Status"
          description="Add a new status visible to clients"
          size="md"
          hideDefaultFooter
          footer={
            <>
              <Button type="button" variant="ghost" size="sm" onClick={handleDrawerClose}>Cancel</Button>
              <Button type="submit" size="sm" form="create-clientfacing-form">Submit</Button>
            </>
          }
        >
          <Form {...createForm}>
            <form id="create-clientfacing-form" onSubmit={createForm.handleSubmit(createJobFacing)} className="space-y-6">
              <FormSection title="Status Details">
                <div className="flex items-start gap-4">
                  <FormField
                    control={createForm.control}
                    name="clientfacingColour"
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <select
                              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              {...field}
                              style={{ color: field.value || undefined }}
                            >
                              <option value="">Select</option>
                              {colors.map((color) => (
                                <option key={color} value={color} style={{ color, fontWeight: "bold" }}>
                                  ● {color}
                                </option>
                              ))}
                            </select>
                            {field.value && (
                              <div className="absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border border-border" style={{ backgroundColor: field.value }} />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="clientfacingName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={createForm.control}
                  name="clientfacingdescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Status description for client" maxLength={200} rows={5} className="resize-none" {...field} />
                      </FormControl>
                      <p className="text-xs text-muted-foreground text-right">{(field.value || "").length}/200</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>
            </form>
          </Form>
        </SideSheet>

        {/* ===== EDIT SHEET ===== */}
        <SideSheet
          open={isNewDrawerOpen}
          onOpenChange={(open) => !open && handleNewDrawerClose()}
          title="Update Client-Facing Job Status"
          description="Edit the details of this status"
          size="md"
          hideDefaultFooter
          footer={
            <>
              <Button type="button" variant="ghost" size="sm" onClick={handleNewDrawerClose}>Cancel</Button>
              <Button type="submit" size="sm" form="edit-clientfacing-form">Save Changes</Button>
            </>
          }
        >
          <Form {...editForm}>
            <form id="edit-clientfacing-form" onSubmit={editForm.handleSubmit(updateJobFacing)} className="space-y-6">
              <FormSection title="Status Details">
                <div className="flex items-start gap-4">
                  <FormField
                    control={editForm.control}
                    name="clientfacingColour"
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <select
                              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              {...field}
                              style={{ color: field.value || undefined }}
                            >
                              <option value="">Select</option>
                              {colors.map((color) => (
                                <option key={color} value={color} style={{ color, fontWeight: "bold" }}>
                                  ● {color}
                                </option>
                              ))}
                            </select>
                            {field.value && (
                              <div className="absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border border-border" style={{ backgroundColor: field.value }} />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="clientfacingName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={editForm.control}
                  name="clientfacingdescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Status description for client" maxLength={200} rows={5} className="resize-none" {...field} />
                      </FormControl>
                      <p className="text-xs text-muted-foreground text-right">{(field.value || "").length}/200</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>
            </form>
          </Form>
        </SideSheet>
      </div>
    </div>
  );
};

export default Clientfacing;

