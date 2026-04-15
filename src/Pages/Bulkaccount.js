



import React, { useState, useEffect,useContext } from 'react';
import { Trash2 } from 'lucide-react';
import { LoginContext } from "../Sidebar/Context/Context";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const defaultClient = {
  accountName: "",
  clientType: "Individual",
  folderTemplate: null,
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  login: true,
  isAlias: false,
  baseEmail: "",
  aliasNumber: 1
};

const ClientFormList = () => {
  // const [clients, setClients] = useState([{ ...defaultClient }]);
  const [createdAccounts, setCreatedAccounts] = useState([]); 
  const [clients, setClients] = useState([{ 
    ...defaultClient,
    aliasConfig: { count: 0, startingNumber: 1 } // Add alias config to each client
  }]);
  const [folderTemplates, setFolderTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aliasCount, setAliasCount] = useState(1);
  const [startingNumber, setStartingNumber] = useState(1);
const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState("");
    useEffect(() => {
    if (logindata?.user?.id) {
      const id = logindata.user.id;
      setLoginUserId(id);
     
    }
  }, [logindata]);
// const API_KEY = "http://127.0.0.1";
// const API_KEY = "http://192.168.1.8";
const API_KEY = "https://www.snptaxes.com"

  useEffect(() => {
    fetchFolderData();
  }, []);

   const fetchFolderData = async () => {
    try {
      const url = `${API_KEY}/foldertemp/folder`;
      const response = await fetch(url);
      const data = await response.json();
      const options = data.folderTemplates.map((folder) => ({
        value: folder._id,
        label: folder.templatename,
      }));
      setFolderTemplates(options);
    } catch (error) {
      console.error("Error fetching folder templates:", error);
    }
  };

 const handleChange = (index, field, value) => {
    const updated = [...clients];
    
    if (field === 'aliasCount') {
      updated[index].aliasConfig.count = Math.max(0, parseInt(value) || 0);
    } else if (field === 'startingNumber') {
      updated[index].aliasConfig.startingNumber = Math.max(1, parseInt(value) || 1);
    } else {
      updated[index][field] = value;
    }
    
    setClients(updated);
  };

  const handleFolderSelect = (index, selectedOption) => {
    const updated = [...clients];
    updated[index].folderTemplate = selectedOption;
    setClients(updated);
  };

  const generateAliasEmail = (baseEmail, number) => {
    if (!baseEmail) return '';
    const [localPart, domain] = baseEmail.split('@');
    return `${localPart}+${number}@${domain}`;
  };


  const addClient = () => {
    const newClient = { 
      ...defaultClient,
      aliasConfig: { count: 0, startingNumber: 1 }
    };
    setClients([...clients, newClient]);
  };
  const addAliasClients = (baseIndex, count,startNumber = 1) => {
    const baseClient = clients[baseIndex];
    if (!baseClient.email.includes('@')) {
      toast.error('Please enter a valid base email first');
      return;
    }

    const newClients = [];
    for (let i = 1; i <= count; i++) {
      const aliasNumber = startNumber  + i;
      newClients.push({
        ...defaultClient,
        isAlias: true,
        baseEmail: baseClient.email,
        aliasNumber,
        email: generateAliasEmail(baseClient.email, aliasNumber),
        accountName: `${baseClient.accountName} ${aliasNumber}`,
        firstName: `${baseClient.firstName}${aliasNumber}`,
        lastName: `${baseClient.lastName}${aliasNumber}`,
        clientType: baseClient.clientType,
        folderTemplate: baseClient.folderTemplate,
        phoneNumber: baseClient.phoneNumber,
      });
    }

    setClients([...clients, ...newClients]);
    setAliasCount(1);
  };

  const removeClient = (index) => {
    const updated = [...clients];
    updated.splice(index, 1);
    setClients(updated);
  };




const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  const newCreatedAccounts = [];
  const failedAccounts = [];
  const startTime = performance.now();

  try {
    // Process all clients (base + generated aliases)
    const allClientsToProcess = clients.flatMap(client => {
      if (client.isAlias) return [];
      
      const aliases = client.aliasConfig?.count > 0 
        ? generateAliases(client, clients.length) 
        : [];
      
      return [client, ...aliases];
    });

    for (const client of allClientsToProcess) {
      const accountStartTime = performance.now();
      let accountId;
      
      try {
        // 1. Create account
        const accountResponse = await fetch(`${API_KEY}/accounts/accountdetails`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientType: client.clientType,
            accountName: client.accountName,
            tags: [],
            teamMember: [],
            foldertemplate: client.folderTemplate?.value || null,
            adminUserId:loginuserid,
            // folderTemplate: "6880af879d336c88c84278e2",
            active: true
          }),
          
        });
console.log("body",accountResponse)
        const accountResult = await accountResponse.json();
        
        if (!accountResponse.ok || !accountResult.success) {
          throw new Error(accountResult.error || accountResult.message || "Failed to create account");
        }

        accountId = accountResult.newAccount?._id;
        if (!accountId) throw new Error("Account created but missing ID");

        // 2. Add folder template if selected
        const folderErrors = [];
        if (client.folderTemplate?.value) {
          try {
            await addFolderTemplate(accountId);
          } catch (folderError) {
            folderErrors.push(`Folder template: ${folderError.message}`);
          }

          try {
            await assignfoldertemp(accountId, client.folderTemplate.value);
          } catch (assignError) {
            folderErrors.push(`Assign template: ${assignError.message}`);
          }
        }

        // 3. Create contact
        let contactError = null;
        try {
          await submitContactsForAccount(accountId, client);
        } catch (err) {
          contactError = err.message;
        }

        const duration = (performance.now() - accountStartTime).toFixed(2);
        newCreatedAccounts.push({
          AccountName: client.accountName,
          Email: client.email,
          CreatedAt: new Date().toLocaleString(),
          DurationMs: duration,
          IsAlias: client.isAlias || false,
          AliasNumber: client.aliasNumber || null,
          Status: contactError || folderErrors.length ? 'Partial Success' : 'Success',
          Errors: [contactError, ...folderErrors].filter(Boolean).join('; ')
        });

        if (contactError) {
          toast.warning(`Account created but contact failed for "${client.accountName}"`);
        }

      } catch (err) {
        const duration = (performance.now() - accountStartTime).toFixed(2);
        failedAccounts.push({
          AccountName: client.accountName,
          Error: err.message,
          DurationMs: duration
        });
        toast.error(`Failed to create account "${client.accountName}": ${err.message}`);
      }
    }

  } catch (err) {
    console.error("Form submission error:", err);
    toast.error(`Submission error: ${err.message}`);
  } finally {
    setLoading(false);
    setCreatedAccounts(prev => [...prev, ...newCreatedAccounts]);
    
    const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);
    const baseCount = clients.filter(c => !c.isAlias).length;
    const aliasCount = newCreatedAccounts.filter(a => a.IsAlias).length;

    if (newCreatedAccounts.length > 0 || failedAccounts.length > 0) {
      console.log("📋 Account Creation Summary:", {
        Success: newCreatedAccounts.length,
        Failed: failedAccounts.length,
        'Base Clients': baseCount,
        'Alias Clients': aliasCount,
        'Total Time (s)': totalTime
      });

      console.table([...newCreatedAccounts, ...failedAccounts]);

      const successMessage = newCreatedAccounts.length 
        ? `Created ${newCreatedAccounts.length} accounts (${baseCount} base + ${aliasCount} aliases) in ${totalTime}s`
        : 'No accounts were created';

      const failMessage = failedAccounts.length 
        ? ` - ${failedAccounts.length} failed` 
        : '';

      toast.success(`${successMessage}${failMessage}`, { autoClose: 5000 });
    }
  }
};
// Helper function to generate aliases
const generateAliases = (baseClient, baseIndex) => {
  const aliases = [];
  const { count, startingNumber } = baseClient.aliasConfig || { count: 0, startingNumber: 1 };
  
  for (let i = 0; i < count; i++) {
    const aliasNumber = startingNumber + i;
    aliases.push({
      ...defaultClient,
      isAlias: true,
      baseEmail: baseClient.email,
      aliasNumber,
      email: generateAliasEmail(baseClient.email, aliasNumber),
      accountName: `${baseClient.accountName} ${aliasNumber}`,
      firstName: `${baseClient.firstName}${aliasNumber}`,
      lastName: `${baseClient.lastName}${aliasNumber}`,
      clientType: baseClient.clientType,
      folderTemplate: baseClient.folderTemplate,
      phoneNumber: baseClient.phoneNumber,
      aliasConfig: { count: 0, startingNumber: 1 } // Aliases shouldn't have their own aliases
    });
  }
  
  return aliases;
};
  const submitContactsForAccount = async (accountId, client) => {
    const contactName = `${client.firstName || ''} ${client.lastName || ''}`.trim();
    const phoneNumbers = client.phoneNumber ? [{
      phone: Number(client.phoneNumber.replace(/\D/g, '')),
      country: "India",
      countryCode: 91
    }] : [];
    
    try {
      const contactPayload = {
        accountid: accountId,
        firstName: client.firstName,
        lastName: client.lastName,
        contactName,
        email: client.email,
        phoneNumbers,
        login: client.login,
      };

      const response = await fetch(`${API_KEY}/contacts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([contactPayload]),
      });

      const data = await response.json();
      const contactIds = data.newContacts.map((contact) => contact._id);
      await updateContactstoAccount(contactIds, accountId);

      if (client.login) {
        const contact = data.newContacts[0];
        await newUser(
          contact.accountid,
          contact.email,
          contact.firstName,
          contact.lastName
        );
      }
    } catch (error) {
      console.error("Error in submitContactsForAccount:", error);
      throw error;
    }
  };

  const updateContactstoAccount = async (contactsIds, accountId) => {
    try {
      const response = await fetch(`${API_KEY}/accounts/accountdetails/${accountId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contacts: contactsIds }),
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to update account with contacts");
      }
    } catch (error) {
      console.error("Error in updateContactstoAccount:", error);
      throw error;
    }
  };

  const addFolderTemplate = async (accountId) => {
    try {
      const response = await fetch(`${API_KEY}/clientdocs/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to add folder template");
      }
    } catch (error) {
      console.error("Error in addFolderTemplate:", error);
      throw error;
    }
  };

  const assignfoldertemp = async (accountId, foldertempId) => {
    try {
      const response = await fetch(`${API_KEY}/clientdocs/accountfoldertemp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId, foldertempId }),
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to assign folder template");
      }
    } catch (error) {
      console.error("Error in assignfoldertemp:", error);
      throw error;
    }
  };

  const newUser = async (accountid, email, firstName, lastName) => {
    try {
      const password = `${firstName}@123`;
      
      const userResponse = await fetch(`${API_KEY}/common/login/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: firstName,
          email,
          password,
          role: "Client",
        }),
      });
      
      const userResult = await userResponse.json();
      if (!userResponse.ok) {
        throw new Error(userResult.message || "Failed to create user");
      }
      
      const userId = userResult._id;
      await updateAcountUserId(userId, accountid);
      await clientalldata(userId, email, firstName, lastName);
      await clientCreatedmail(email, userId);

    } catch (error) {
      console.error("Error in newUser:", error);
      throw error;
    }
  };

  const updateAcountUserId = async (UserId, accountuserid) => {
    try {
      const response = await fetch(`${API_KEY}/accounts/accountdetails/${accountuserid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid: UserId }),
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to update account with user ID");
      }
    } catch (error) {
      console.error("Error in updateAcountUserId:", error);
      throw error;
    }
  };

  const clientalldata = async (userId, email, firstName, lastName) => {
    try {
      const password = `${firstName}@123`;
      const response = await fetch(`${API_KEY}/admin/clientsignup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          userid: userId,
          accountName: `${firstName} ${lastName}`,
          password,
          cpassword: password,
        }),
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to create client profile");
      }
    } catch (error) {
      console.error("Error in clientalldata:", error);
      throw error;
    }
  };

  const clientCreatedmail = async (email, userid) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const url = `${API_KEY}/client/client/updatepassword`;
    const raw = JSON.stringify({
      email: email,
      url: url,
      AccountId: userid,
    });
console.log("email rawe",raw)
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${API_KEY}/clientmail/clientsavedemail/`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

 // New clear function
  const handleClearForm = () => {
    setClients([{ ...defaultClient, aliasConfig: { count: 0, startingNumber: 1 } }]);
    // Don't clear createdAccounts to keep the results visible
  };

  const inputCls = "w-full h-9 rounded-lg border border-border bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-muted disabled:text-muted-foreground";

  return (
  <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
    <h1 className="text-2xl font-bold tracking-tight text-foreground text-center">Add Multiple Clients</h1>

    <form onSubmit={handleSubmit} className="space-y-5">
      {clients.map((client, index) => (
        <div key={index} className="relative rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          {clients.length > 1 && (
            <button
              type="button"
              onClick={() => removeClient(index)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          <div>
            <p className="text-sm font-semibold text-foreground">
              {client.isAlias ? `Alias Client #${client.aliasNumber}` : `Client #${index + 1}`}
              {client.isAlias && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">(Based on Client #{clients.findIndex(c => !c.isAlias) + 1})</span>
              )}
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Account Name <span className="text-destructive">*</span></label>
            <input
              type="text"
              className={inputCls}
              value={client.accountName}
              onChange={(e) => handleChange(index, "accountName", e.target.value)}
              required
              disabled={client.isAlias}
              placeholder="Account Name"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Individual</span>
            <button
              type="button"
              disabled={client.isAlias}
              onClick={() => handleChange(index, "clientType", client.clientType === "Company" ? "Individual" : "Company")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                client.clientType === "Company" ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                client.clientType === "Company" ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
            <span className="text-sm text-muted-foreground">Company</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Folder Template</label>
            <Select
              options={folderTemplates}
              value={client.folderTemplate}
              onChange={(option) => handleFolderSelect(index, option)}
              placeholder="Select template"
              isClearable
              isDisabled={client.isAlias}
              styles={{ control: (base) => ({ ...base, minHeight: '36px', borderRadius: '8px', borderColor: '#e2e8f0', fontSize: '14px' }) }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">First Name <span className="text-destructive">*</span></label>
              <input type="text" className={inputCls} value={client.firstName} onChange={(e) => handleChange(index, "firstName", e.target.value)} required disabled={client.isAlias} placeholder="First Name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Last Name <span className="text-destructive">*</span></label>
              <input type="text" className={inputCls} value={client.lastName} onChange={(e) => handleChange(index, "lastName", e.target.value)} required disabled={client.isAlias} placeholder="Last Name" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Phone Number</label>
            <PhoneInput
              country="in"
              value={client.phoneNumber}
              onChange={(value) => handleChange(index, "phoneNumber", value)}
              inputStyle={{ width: "100%", height: "36px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px" }}
              disabled={client.isAlias}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Email <span className="text-destructive">*</span></label>
            <input type="email" className={inputCls} value={client.email} onChange={(e) => handleChange(index, "email", e.target.value)} required disabled={client.isAlias} placeholder="Email address" />
            {client.isAlias && (
              <p className="text-xs text-muted-foreground mt-1">Alias email automatically generated from base client</p>
            )}
          </div>

          {!client.isAlias && (
            <div className="rounded-xl bg-muted/50 border border-border p-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground">Alias Configuration</p>
              <div className="flex items-end gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Number of Aliases</label>
                  <input
                    type="number"
                    className="w-28 h-9 rounded-lg border border-border bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={client.aliasConfig?.count || 0}
                    onChange={(e) => handleChange(index, "aliasCount", e.target.value)}
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Starting Number</label>
                  <input
                    type="number"
                    className="w-32 h-9 rounded-lg border border-border bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={client.aliasConfig?.startingNumber || 1}
                    onChange={(e) => handleChange(index, "startingNumber", e.target.value)}
                    min={1}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {client.aliasConfig?.count > 0
                  ? `Will create ${client.aliasConfig.count} alias clients on submit (starting from ${client.aliasConfig.startingNumber})`
                  : "No alias clients will be created for this account"}
              </p>
            </div>
          )}
        </div>
      ))}

      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-success px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-success/90 disabled:bg-muted disabled:text-muted-foreground transition-colors min-w-[200px] justify-center"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
          ) : null}
          {loading ? 'Submitting...' : `Submit All Clients (${clients.length} base + ${clients.reduce((s, c) => s + (c.aliasConfig?.count || 0), 0)} aliases)`}
        </button>
        <button
          type="button"
          onClick={handleClearForm}
          className="rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors min-w-[140px]"
        >
          Clear Form
        </button>
      </div>
    </form>

    {createdAccounts.length > 0 && (
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Created Accounts ({createdAccounts.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted">
                {["Account Name","Email","Type","Created At","Time (ms)"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {createdAccounts.map((account, index) => (
                <tr key={index} className="border-b hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{account.AccountName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{account.Email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      account.IsAlias ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                    }`}>{account.IsAlias ? `Alias #${account.AliasNumber}` : 'Base'}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{account.CreatedAt}</td>
                  <td className="px-4 py-3 text-muted-foreground">{account.DurationMs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    <ToastContainer position="bottom-right" autoClose={5000} />
  </div>
);
};

export default ClientFormList;