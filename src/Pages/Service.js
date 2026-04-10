import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, MoreVertical, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const Service = () => {

    const SERVICE_API = process.env.REACT_APP_SERVICES_URL;
    const CATEGORY_API = process.env.REACT_APP_CATEGORY_URL;
    const navigate = useNavigate();
    const menuRef = useRef(null);
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
      // Pagination state
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(30);

// Handle page change
const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

// Handle rows per page change
const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0); // Reset to first page
};
      // Get paginated data
const paginatedServices = ServiceTemplates.slice(
  page * rowsPerPage,
  page * rowsPerPage + rowsPerPage
);
      const [tempIdget, setTempIdGet] = useState("");
      const [openMenuId, setOpenMenuId] = useState(null);
        const toggleMenu = (event, _id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
  };
    const handleMenuClose = () => {
    setOpenMenuId(null);
    setTempIdGet(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        handleMenuClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
      const handleEdit = (_id) => {

        navigate("/servicesUpdate/" + _id);
      };
     
    const handleDelete = (_id) => {
        // Show a confirmation prompt
        const isConfirmed = window.confirm("Are you sure you want to delete this service?");
        
        // Proceed with deletion if confirmed
        if (isConfirmed) {
          const requestOptions = {
            method: "DELETE",
            redirect: "follow",
          };
          const url = `${SERVICE_API}/workflow/services/servicetemplate/`;
          fetch(url + _id, requestOptions)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to delete item");
              }
              return response.json();
            })
            .then((result) => {
              console.log(result);
              toast.success("Item deleted successfully");
              handleMenuClose()
              fetchServicesData(); // Refresh data
            })
            .catch((error) => {
              console.error(error);
              toast.error("Failed to delete item");
            });
        }
      };
      
    
    const totalPages = Math.ceil(ServiceTemplates.length / rowsPerPage);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-slate-900">Services</h1>
                <button
                    onClick={() => setIsNewDrawerOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md active:scale-[0.98]"
                >
                    <Plus className="h-4 w-4" />
                    Create Service
                </button>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20 gap-3">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                        <span className="text-sm text-slate-500">Loading services...</span>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/80">
                                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Description</th>
                                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Rate</th>
                                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Rate Type</th>
                                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
                                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right w-20"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginatedServices.map((row, idx) => (
                                        <tr key={row._id} className={`transition-colors hover:bg-indigo-50/40 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                                            <td className="px-5 py-3.5">
                                                <button onClick={() => handleEdit(row._id)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
                                                    {row.serviceName}
                                                </button>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-slate-600 max-w-[200px] truncate">{row.description}</td>
                                            <td className="px-5 py-3.5 text-sm text-slate-700 font-medium">{row.rate}</td>
                                            <td className="px-5 py-3.5">
                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">{row.ratetype}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-slate-600">{row.category?.categoryName || ""}</td>
                                            <td className="px-5 py-3.5 text-right">
                                                <div className="relative inline-block" ref={openMenuId === row._id ? menuRef : null}>
                                                    <button
                                                        onClick={(e) => toggleMenu(e, row._id)}
                                                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                    {openMenuId === row._id && (
                                                        <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg animate-in fade-in slide-in-from-top-1">
                                                            <button onClick={() => { handleEdit(row._id); handleMenuClose(); }} className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Edit</button>
                                                            <button onClick={() => { handleDelete(row._id); handleMenuClose(); }} className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Delete</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {ServiceTemplates.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">No services found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span>Rows per page:</span>
                                <select
                                    value={rowsPerPage}
                                    onChange={handleChangeRowsPerPage}
                                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {[30, 40, 50, 60, 100].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                                <span className="ml-2">{page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, ServiceTemplates.length)} of {ServiceTemplates.length}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={(e) => handleChangePage(e, page - 1)} disabled={page === 0} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button onClick={(e) => handleChangePage(e, page + 1)} disabled={page >= totalPages - 1} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed">
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Create Service Drawer */}
            {isNewDrawerOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={handleNewDrawerClose} />
                    <div className="relative w-full max-w-[650px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-slate-900">Create Service</h2>
                            <button onClick={handleNewDrawerClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Drawer Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Service Name</label>
                                <input
                                    type="text"
                                    placeholder="Service Name"
                                    onChange={(e) => setservicename(e.target.value)}
                                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                                <input
                                    type="text"
                                    placeholder="Description"
                                    onChange={(e) => setdiscription(e.target.value)}
                                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Rate</label>
                                    <input
                                        type="text"
                                        placeholder="Rate"
                                        value={rate}
                                        onChange={handleRateChange}
                                        className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Rate Type</label>
                                    <select
                                        value={selectedOption?.value || ''}
                                        onChange={(e) => {
                                            const opt = options.find(o => o.value === e.target.value);
                                            handleRateTypeChange(null, opt);
                                        }}
                                        className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                                    >
                                        <option value="">Select Rate Type</option>
                                        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Tax Toggle */}
                            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3">
                                <span className="text-sm font-medium text-slate-700">Tax</span>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={service}
                                    onClick={() => handleServiceWitch(!service)}
                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${service ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                >
                                    <span className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${service ? 'translate-x-4' : 'translate-x-0.5'}`} />
                                </button>
                            </div>

                            {/* Category Section */}
                            <div className="pt-2">
                                <h3 className="text-base font-semibold text-slate-900 mb-3">Category</h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Category Name</label>
                                    <select
                                        value={selectedCategory?.value || ''}
                                        onChange={(e) => {
                                            const opt = categoryoptions.find(o => o.value === e.target.value);
                                            handleCategoryChange(null, opt || null);
                                        }}
                                        className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                                    >
                                        <option value="">Select Category</option>
                                        {categoryoptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setCategoryFormOpen(true)}
                                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create category
                                </button>
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="flex items-center gap-3 border-t border-slate-200 px-6 py-4">
                            <button onClick={createservicetemp} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">Save</button>
                            <button onClick={handleNewDrawerClose} className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Category Drawer */}
            {isCategoryFormOpen && (
                <div className="fixed inset-0 z-[60] flex justify-end">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCategoryFormClose} />
                    <div className="relative w-full max-w-[500px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
                        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
                            <button onClick={handleCategoryFormClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <h2 className="text-lg font-semibold text-slate-900">Create Category</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category Name</label>
                            <input
                                type="text"
                                placeholder="Category Name"
                                value={categorycreate || ''}
                                onChange={(e) => setcategorycreate(e.target.value)}
                                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            />
                        </div>
                        <div className="flex items-center gap-3 border-t border-slate-200 px-6 py-4">
                            <button onClick={createCategory} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">Create</button>
                            <button onClick={handleCategoryFormClose} className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Service