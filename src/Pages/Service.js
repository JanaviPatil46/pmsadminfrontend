import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { SideSheet } from '../components/ui/side-sheet';
import { DataTable } from '../components/data-table/data-table';
import { DataTableToolbar } from '../components/data-table/toolbar';

const Service = () => {

    const SERVICE_API = process.env.REACT_APP_SERVICES_URL;
    const CATEGORY_API = process.env.REACT_APP_CATEGORY_URL;
    const navigate = useNavigate();
    const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
    const [servicename, setservicename] = useState("");
    const [discription, setdiscription] = useState("");
    const [rate, setrate] = useState("$ 0.00")

    const [service, setService] = useState(false)
    const [categorycreate, setcategorycreate] = useState();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const handleRateChange = (e) => {
        // Remove the dollar sign and any non-numeric characters, and keep the input as a number
        const value = e.target.value.replace(/[^0-9.]/g, '');
        
        // Update the rate, ensuring it includes the $ symbol
        setrate(`$ ${value}`);
      };
    const handleCategoryChange = (event, newValue) => {
        setSelectedCategory(newValue);
    };
    const handleServiceWitch = (checked) => {
        setService(checked)
    }

    const handleNewDrawerClose = () => {
        setIsNewDrawerOpen(false);
    };


    //category right side form
    const [isCategoryFormOpen, setCategoryFormOpen] = useState(false);
    const handleCategoryFormClose = () => {
        setCategoryFormOpen(false);
    };

    const options = [
        // { label: "Select Rate Type", value: "" },
        { label: "Item", value: "item" },
        { label: "Hour", value: "hour" },
    ];
    const [selectedOption, setSelectedOption] = useState('');

    const handleRateTypeChange = (event, newValue) => {
        setSelectedOption(newValue);
        console.log('Selected rate type:', newValue);
    };
    // category create

    const [categoryData, setCategoryData] = useState([]);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // const url = `${API_KEY}/common/user/`;
            const url = `${CATEGORY_API}/workflow/category/categorys`;
            const response = await fetch(url);
            const data = await response.json();
            console.log(data)
            setCategoryData(data.category);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const categoryoptions = categoryData.map((category) => ({
        value: category._id,
        label: category.categoryName,
    }));
    const createCategory = () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            categoryName: categorycreate
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        const url = `${CATEGORY_API}/workflow/category/newcategory`;
        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result)
                if (result && result.message === "Category created successfully") {
                    toast.success("Category created successfully");
                    handleCategoryFormClose(false);
                    fetchData();
                    setcategorycreate();
                } else {
                    toast.error(result.message || "Failed to create Service Template");
                }
            })
            .catch((error) => console.error(error));

    }


    const createservicetemp = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const raw = JSON.stringify({
          serviceName: servicename,
          description: discription,
          rate: rate,
          ratetype: selectedOption.value,
          tax: service,
          
          category: selectedCategory ? selectedCategory.value : null,
          active: "true"
    
        });
        console.log(raw)
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };
        const url =`${SERVICE_API}/workflow/services/servicetemplate`;
        fetch(url, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result.message)
    
            if (result && result.message === "ServiceTemplate created successfully") {
              toast.success("ServiceTemplate created successfully");
              handleNewDrawerClose();
              fetchServicesData();
              // Clear form fields
              setservicename("");
              setdiscription("");
              setrate("$ 0.00");
              setSelectedOption("");
              setService(false);
              setSelectedCategory(null);
          
    
            } else {
              toast.error(result.message || "Failed to create Service Template");
            }
          })
          .catch((error) => {
            console.log(error)
            const errorMessage = error.response && error.response.message ? error.response.message : "Failed to create invoice";
            toast.error(errorMessage);
          });
      }

    //   service template fetch
    const [ServiceTemplates, setServiceTemplates] = useState([]);
    useEffect(() => {
        fetchServicesData()
      }, [])
    const [loading, setLoading] = useState(true);
      const fetchServicesData = async () => {
        setLoading(true); // Start loader

        const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));
        try {
          const url = `${SERVICE_API}/workflow/services/servicetemplate` ;
    
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Failed to fetch service templates");
          }
          const data = await response.json();
          setServiceTemplates(data.serviceTemplate);
          console.log(data.serviceTemplate)
         
        } catch (error) {
          console.error("Error fetching service templates:", error);
        }
        finally {
          // Wait for the fetch and the 3-second timer to complete
          await loaderDelay;
          setLoading(false); // Stop loader
        }
      };
            const handleEdit = (_id) => {
        navigate("/servicesUpdate/" + _id);
      };

      const handleDelete = (_id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this service?");
        if (isConfirmed) {
          const requestOptions = { method: "DELETE", redirect: "follow" };
          fetch(`${SERVICE_API}/workflow/services/servicetemplate/` + _id, requestOptions)
            .then((response) => {
              if (!response.ok) throw new Error("Failed to delete item");
              return response.json();
            })
            .then(() => {
              toast.success("Item deleted successfully");
              fetchServicesData();
            })
            .catch((error) => {
              console.error(error);
              toast.error("Failed to delete item");
            });
        }
      };

      const [globalFilter, setGlobalFilter] = useState("");

      const serviceColumns = useMemo(() => [
        {
          accessorKey: "serviceName",
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
          accessorKey: "description",
          header: "Description",
          cell: ({ getValue }) => (
            <span className="text-sm text-muted-foreground max-w-[200px] truncate block">{getValue()}</span>
          ),
        },
        {
          accessorKey: "rate",
          header: "Rate",
          cell: ({ getValue }) => (
            <span className="text-sm font-medium text-foreground">{getValue()}</span>
          ),
        },
        {
          accessorKey: "ratetype",
          header: "Rate Type",
          cell: ({ getValue }) => {
            const val = getValue();
            return val ? <Badge variant="secondary">{val}</Badge> : null;
          },
        },
        {
          accessorKey: "category",
          header: "Category",
          cell: ({ getValue }) => (
            <span className="text-sm text-muted-foreground">{getValue()?.categoryName || ""}</span>
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
                <Button size="sm" onClick={() => setIsNewDrawerOpen(true)}>
                    <Plus className="h-3.5 w-3.5 mr-1.5" /> Create Service
                </Button>
            </div>
            <DataTableToolbar globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
            <DataTable
                columns={serviceColumns}
                data={ServiceTemplates}
                loading={loading}
                globalFilter={globalFilter}
                onGlobalFilterChange={setGlobalFilter}
                enableRowSelection={false}
                getRowId={(row) => row._id}
                emptyMessage="No services found"
                emptyDescription="Create your first service to get started"
                pageSize={30}
            />

            {/* Create Service — SideSheet */}
            <SideSheet
                open={isNewDrawerOpen}
                onOpenChange={(v) => !v && handleNewDrawerClose()}
                title="Create Service"
                size="lg"
                confirmLabel="Save"
                cancelLabel="Cancel"
                onConfirm={createservicetemp}
                onCancel={handleNewDrawerClose}
            >
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Service Name</label>
                        <input
                            type="text"
                            placeholder="Service Name"
                            onChange={(e) => setservicename(e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                        <input
                            type="text"
                            placeholder="Description"
                            onChange={(e) => setdiscription(e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Rate</label>
                            <input
                                type="text"
                                placeholder="Rate"
                                value={rate}
                                onChange={handleRateChange}
                                className="flex h-10 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Rate Type</label>
                            <select
                                value={selectedOption?.value || ''}
                                onChange={(e) => {
                                    const opt = options.find(o => o.value === e.target.value);
                                    handleRateTypeChange(null, opt);
                                }}
                                className="flex h-10 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                            >
                                <option value="">Select Rate Type</option>
                                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Tax Toggle */}
                    <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-4 py-3">
                        <span className="text-sm font-medium text-foreground">Tax</span>
                        <Switch checked={service} onCheckedChange={handleServiceWitch} />
                    </div>

                    {/* Category Section */}
                    <div className="pt-2">
                        <h3 className="text-sm font-semibold text-foreground mb-3">Category</h3>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Category Name</label>
                            <select
                                value={selectedCategory?.value || ''}
                                onChange={(e) => {
                                    const opt = categoryoptions.find(o => o.value === e.target.value);
                                    handleCategoryChange(null, opt || null);
                                }}
                                className="flex h-10 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                            >
                                <option value="">Select Category</option>
                                {categoryoptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={() => setCategoryFormOpen(true)}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Create category
                        </button>
                    </div>
                </div>
            </SideSheet>

            {/* Create Category — SideSheet */}
            <SideSheet
                open={isCategoryFormOpen}
                onOpenChange={(v) => !v && handleCategoryFormClose()}
                title="Create Category"
                size="md"
                confirmLabel="Create"
                cancelLabel="Cancel"
                onConfirm={createCategory}
                onCancel={handleCategoryFormClose}
            >
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Category Name</label>
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={categorycreate || ''}
                        onChange={(e) => setcategorycreate(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                    />
                </div>
            </SideSheet>
        </div>
    )
}

export default Service