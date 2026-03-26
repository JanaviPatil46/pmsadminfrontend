import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { FormPage, FormSection, FormField, FormRow, FormDrawer, FormDrawerFooter } from "../components/ui/form-layout";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Plus } from "lucide-react";
const ServiceUpdate = () => {
  const [isHovered, setIsHovered] = useState(false);
  const CATEGORY_API = process.env.REACT_APP_CATEGORY_URL;
  const { id } = useParams();
  const [isCategoryFormOpen, setCategoryFormOpen] = useState(false);
  const handleCategoryFormClose = () => {
    setCategoryFormOpen(false);
  };
  const options = [
    // { label: "Select Rate Type", value: "" },
    { label: "Item", value: "item" },
    { label: "Hour", value: "hour" },
  ];
  const [service, setService] = useState(false);
  const handleServiceWitch = (checked) => {
    setService(checked);
  };
  const handleRateTypeChange = (event, newValue) => {
    setSelectedOption(newValue);
    console.log("Selected rate type:", newValue);
  };
  // category create

  // category create
  const [primaryColor, setPrimaryColor] = useState("#00ACC1");
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
      console.log(data);
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
      categoryName: categorycreate,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${CATEGORY_API}/workflow/category/newcategory`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
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
  };
  const [categorycreate, setcategorycreate] = useState();

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const SERVICE_API = process.env.REACT_APP_SERVICES_URL;
  const [templateData, setTemplateData] = useState(null);

  const [rate, setrate] = useState("$ 0.00");
  const handleRateChange = (e) => {
    // Remove the dollar sign and any non-numeric characters, and keep the input as a number
    const value = e.target.value.replace(/[^0-9.]/g, "");

    // Update the rate, ensuring it includes the $ symbol
    setrate(`$ ${value}`);
  };
  const [servicename, setservicename] = useState("");
  const [discription, setdiscription] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  useEffect(() => {
    fetchidwiseData();
  }, []);

  //get id wise template Record

  const fetchidwiseData = async () => {
    try {
      // const url = `${API_KEY}/workflow/servicetemplate/`;
      const url = `${SERVICE_API}/workflow/services/servicetemplate/servicetemplatebyid/`;
      const response = await fetch(url + id);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data);
      setTemplateData(data.serviceTemplate);
      setservicename(data.serviceTemplate.serviceName);

      setdiscription(data.serviceTemplate.description);
      setrate(data.serviceTemplate.rate);
      setSelectedOption({
        value: data.serviceTemplate.ratetype,
        label: data.serviceTemplate.ratetype,
      });
      setService(data.serviceTemplate.tax);
      const categoryName = {
        value: data.serviceTemplate.category._id,
        label: data.serviceTemplate.category.categoryName,
      };
      setSelectedCategory(categoryName);
      console.log(categoryName);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const navigate = useNavigate();
  const updateservicetemp = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      serviceName: servicename,
      description: discription,
      rate: rate,
      ratetype: selectedOption.value,
      tax: service,
      category: selectedCategory ? selectedCategory.value : null,
      active: "true",
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${SERVICE_API}/workflow/services/servicetemplate/${templateData._id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success("ServiceTemplate Updated successfully");
        navigate("/firmtemp/service");
      })
      .catch((error) => {
        console.log(error);
        const errorMessage =
          error.response && error.response.message
            ? error.response.message
            : "Failed to update invoice";
        toast.error(errorMessage);
      });
  };

  const handleBack = () => {
    navigate("/firmtemp/service");
  };
  return (
    <FormPage
      title="Edit Service"
      actions={
        <>
          <Button variant="outline" onClick={handleBack}>Cancel</Button>
          <Button onClick={updateservicetemp}>Save</Button>
        </>
      }
    >
      <form>
        <FormSection title="Service Details">
          <FormField label="Service Name">
            <Input
              placeholder="Service Name"
              value={servicename}
              onChange={(e) => setservicename(e.target.value)}
            />
          </FormField>
          <FormField label="Description">
            <Input
              placeholder="Description"
              value={discription}
              onChange={(e) => setdiscription(e.target.value)}
            />
          </FormField>
          <FormRow cols={2}>
            <FormField label="Rate">
              <Input
                placeholder="Rate"
                value={rate}
                onChange={handleRateChange}
              />
            </FormField>
            <FormField label="Rate Type">
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedOption?.value || ""}
                onChange={(e) => {
                  const opt = options.find(o => o.value === e.target.value);
                  handleRateTypeChange(null, opt);
                }}
              >
                <option value="">Select Rate Type</option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </FormField>
          </FormRow>
          <div className="flex items-center justify-between mt-2">
            <Label className="text-sm">Tax</Label>
            <Switch checked={service} onCheckedChange={handleServiceWitch} />
          </div>
        </FormSection>

        <FormSection title="Category">
          <FormField label="Category Name">
            <select
              className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={selectedCategory?.value || ""}
              onChange={(e) => {
                const opt = categoryoptions.find(o => o.value === e.target.value);
                handleCategoryChange(null, opt || null);
              }}
            >
              <option value="">Select Category</option>
              {categoryoptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </FormField>
          <Button type="button" variant="outline" size="sm" onClick={setCategoryFormOpen} className="mt-2">
            <Plus className="h-4 w-4 mr-1" /> Create category
          </Button>
        </FormSection>
      </form>

      <FormDrawer open={isCategoryFormOpen} onClose={handleCategoryFormClose} title="Create Category" width="md">
        <FormSection>
          <FormField label="Category Name">
            <Input
              placeholder="Category Name"
              value={categorycreate}
              onChange={(e) => setcategorycreate(e.target.value)}
            />
          </FormField>
        </FormSection>
        <FormDrawerFooter>
          <Button variant="outline" onClick={handleCategoryFormClose}>Cancel</Button>
          <Button onClick={createCategory}>Create</Button>
        </FormDrawerFooter>
      </FormDrawer>
    </FormPage>
  );
};

export default ServiceUpdate;
