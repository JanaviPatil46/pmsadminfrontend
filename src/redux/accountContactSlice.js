

// accountContactSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialContact = {
  firstName: "",
  middleName: "",
  lastName: "",
  contactName: "",
  companyName: "",
  note: "",
  ssn: "",
  tags: [],
  country: "",
  streetAddress: "",
  city: "",
  state: "",
  postalCode: "",
  email: "",
  phoneNumbers: [""],
  
};

const initialState = {
  accountData: {
    accountName: "",
    clientType: "Individual",
    companyName: "",
    tags: [],
    teamMember: [],
    folderTemp: "",
    country: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
  },
  contacts: [], // ✅ manually added contacts
  selectedContacts: [], // ✅ existing contacts selected from backend
};

const accountContactSlice = createSlice({
  name: "accountContact",
  initialState,
  reducers: {
    setAccountData: (state, action) => {
      state.accountData = { ...state.accountData, ...action.payload };
    },

    setContactData: (state, action) => {
      const { index, data } = action.payload;
      state.contacts[index] = { ...state.contacts[index], ...data };
    },

    addContact: (state) => {
      state.contacts.push({ ...initialContact });
    },

    removeContact: (state, action) => {
      state.contacts.splice(action.payload, 1);
    },

    addPhoneNumber: (state, action) => {
      state.contacts[action.payload].phoneNumbers.push("");
    },

    updatePhoneNumber: (state, action) => {
      const { contactIndex, phoneIndex, value } = action.payload;
      state.contacts[contactIndex].phoneNumbers[phoneIndex] = value;
    },

    removePhoneNumber: (state, action) => {
      const { contactIndex, phoneIndex } = action.payload;
      state.contacts[contactIndex].phoneNumbers.splice(phoneIndex, 1);
    },

    updateContactField: (state, action) => {
      const { index, field, value } = action.payload;
      state.contacts[index][field] = value;
    },

    // New reducers for selected contacts
    addSelectedContacts: (state, action) => {
      state.selectedContacts = [...state.selectedContacts, ...action.payload];
    },

    removeSelectedContact: (state, action) => {
      state.selectedContacts.splice(action.payload, 1);
    },
    updateSelectedContactField: (state, action) => {
   const { index, field, value } = action.payload;
   state.selectedContacts[index][field] = value;
}
,
  // updateSelectedContactField: (state, action) => {
  //     const { index, field, value } = action.payload;
  //     if (state.selectedContacts[index]) {
  //       state.selectedContacts[index][field] = value;
  //     }},
   
    // 🔹 reducers for tags, team members, and folder template
    setTags: (state, action) => {
      state.accountData.tags = action.payload;
    },
    setTeamMembers: (state, action) => {
      state.accountData.teamMember = action.payload;
    },
    setFolderTemplate: (state, action) => {
      state.accountData.folderTemp = action.payload;
    },
    setContactCountry: (state, action) => {
  const { index, country } = action.payload;
  state.contacts[index].country = country;
},

 // Add this new reducer:
    setSelectedContacts: (state, action) => {
      state.selectedContacts = action.payload.map(contact => ({
        ...contact,
        login:contact.login,
        emailSync:contact.emailSync,
        notify:contact.notify
        // existingUser: contact.existingUser || false,
        // existingContact: contact.existingContact || false
      }));
    },
   
    setContactTags: (state, action) => {
  const { index, tags } = action.payload;
  state.contacts[index].tags = tags;
},
    resetForm: () => initialState,
  },
});

export const {
  setAccountData,
  setContactData,
  addContact,
  removeContact,
  addPhoneNumber,
  updatePhoneNumber,
  removePhoneNumber,
  resetForm,
  updateContactField,
  addSelectedContacts,
  removeSelectedContact,
  updateSelectedContactField,
  setTags,
  setTeamMembers,
  setFolderTemplate,setContactTags,setContactCountry,setSelectedContacts
} = accountContactSlice.actions;

export default accountContactSlice.reducer;
