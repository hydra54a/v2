import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, CardActions, Button, TextField, InputLabel, Grid} from '@mui/material';
import '../styles/groupsPage.css';
import { Trash2, Pencil, Settings, ChevronUp, ChevronDown, UserMinus } from 'lucide-react';
import { ArrowTurnDownRightIcon } from '@heroicons/react/20/solid';
import { getCsrfToken } from './groupsFunctions';

const GroupsPage = () => {
  const [activeTab, setActiveTab] = useState('groups');
  const [visibleIndices, setVisibleIndices] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const formRef = useRef(null);
  const [formType, setFormType] = useState('');
  const [groupName, setGroupName] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [jwt, setJwt] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroup] = useState('');
  const [orgEmails, setOrgEmails] = useState([]);
  const [error, setError] = useState('');
  const [orgId, setOrgId] = useState('');
  const [orgName, setOrgName] = useState('');
  const [subgroupName, setSubgroupName] = useState('');
  const [emailsFilter, setEmailsFilter] = useState('');
  const [capacity, setCapacity] = useState('');
  const [templateNames, setTemplateNames] = useState(['Attendance', 'Grades']);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const { csrfVal, valid } = await getCsrfToken();

      if (valid) {
        setCsrfToken(csrfVal);
      } else {
        setError(csrfVal);
      }
    }

    fetchCsrfToken();
    setJwt(localStorage.getItem('token'));

  }, []);

  useEffect(() => {
    if (csrfToken && jwt) {
      const getOrgIdName = async () => {
        //setup req data
        const requestData = {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken,
            'Authorization': `Bearer ${jwt}`,
          },
        };

        //route name a bit off, but gets org id & name
        try {
          const response = await fetch('http://localhost:5001/groups/allGroups', requestData);
          const data = await response.json();
          setOrgId(data.organizationId);
          setOrgName(data.name);
        } catch (error) {
          setError('Failed to get organization id and name');
        }
      };

      getOrgIdName();
    }
  }, [jwt, csrfToken]);

  useEffect(() => {
    if (orgId && csrfToken) {
      const getEmails = async () => {
        //setup req data
        const requestData = {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
        };

        //req
        var response = null;
        try {
          response = await fetch(`http://localhost:5001/groups/allEmails/${orgId}`, requestData);
        } catch (error) {
          console.error('Error fetching event types data:', error);
        }
        var data = await response.json();
        
        data = await [...new Set(data.split(',').map(email => email.trim()).filter(email => email !== ''))];
        setOrgEmails(data);
      };
    
      getEmails();
    }
  }, [csrfToken, showAddForm, activeTab]);


  const getGroups = async () => {
    //setup req data
    const requestData = {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    };

    //req
    var response = null;
    try {
      response = await fetch(`http://localhost:5001/groups/${orgId}`, requestData);
    } catch (error) {
      console.error('Error fetching event types data:', error);
    }
    const data = await response.json();
    setGroups(data);
  };
  useEffect(() => {
    if (orgId && csrfToken) {
      getGroups();
    }
  }, [showAddForm, orgId]);

  const getFormTitles = async () => {
    //setup req data
    const requestData = {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    };

    //req
    var response = null;
    try {
      response = await fetch(`http://localhost:5001/forms/organization/${orgId}`, requestData);
    } catch (error) {
      console.error('Error fetching event types data:', error);
    }
    const data = await response.json();
    //filters out titles from form data
    const titles = data.forms.map((form) => form.title).filter(title => title);
    //

    //remove duplicates using set & assign val to template names
    const removeDuplicate = new Set([...templateNames, ...titles]);
    setTemplateNames([...removeDuplicate]);
    //
  };
  useEffect(() => {
    if (orgId && csrfToken) {
      getFormTitles();
    }
  }, [showEditForm, showAddForm, orgId]);

  const handleToggle = (index) => {
    setVisibleIndices((prevIndices) =>
      prevIndices.includes(index)
        ? prevIndices.filter(i => i !== index)
        : [...prevIndices, index]
    );
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleAddGroupClick = () => {
    setShowAddForm((prev) => !prev);
  };

  const handleClickOutsideAdd = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setShowAddForm(false);
      setError('');
    }
  };

  const handleFormTypeChange = (event) => {
    setFormType(event.target.value);
  };

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleSelectedGroupChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedEmails(orgEmails);
    } else {
      setSelectedEmails([]);
    }
  };

  const handleEmailChange = (email) => {
    setSelectedEmails((prevSelected) => {
      if (prevSelected.includes(email)) {
        return prevSelected.filter((e) => e !== email);
      } else {
        return [...prevSelected, email];
      }
    });
  };

  const handleEmailsFilterChange = (event) => {
    setEmailsFilter(event.target.value);
  };

  const filteredEmails = orgEmails.filter((email) =>
    email.toLowerCase().includes(emailsFilter.toLowerCase())
  );

  const handleCapacityChange = (event) => {
    setCapacity(event.target.value);
  };

  const createGroup = async (event) => {
    //prevent reload page
    event.preventDefault();

    var capacityVal = capacity;

    //boundary check
    if (capacity === '') {
      capacityVal = '-1';
    }

    //setup req data
    const requestData = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify( {organization_id: orgId, name: groupName, subgroups: "", user_emails: "", form_type: formType, capacity: capacityVal} ),
    };
    
    //req
    var response = null;
    try {
      response = await fetch('http://localhost:5001/groups/create', requestData);
    } catch (error) {
      console.error('Error fetching event types data:', error);
    }
    const data = await response.json();
    if (data.message === "Group created successfully") {
      console.log(data.message)
      //clear and close form
      setGroupName('');
      setSelectedEmails([]);
      setFormType('');
      setError('');
      setShowAddForm(false);
    }
    else {
      setError(data.message);
    }
  };

  const handleAddEmails = async (groupId) => {
    //id -> group
    let group = null;
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].id == groupId) {
        group = groups[i];
        break;
      }
    }

    //add new emails w/o duplicates
    const existingEmails = group.user_emails ? group.user_emails.split(", ") : [];
    const newEmails = selectedEmails;
    const updatedEmails = [...new Set([...existingEmails, ...newEmails])];

    //setup req data
    const requestData = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify( {id: group.id, organization_id: orgId, name: group.name, subgroups: group.subgroups, user_emails: updatedEmails.join(", "), form_type: group.form_type, capacity: group.capacity} ),
    };
    
    //req
    var response = null;
    try {
      response = await fetch('http://localhost:5001/groups/create', requestData);
    } catch (error) {
      console.error('Error fetching event types data:', error);
    }
    const data = await response.json();
    if (data.message === "Group created successfully") {
      console.log(data.message + "(updated)")
    }
    else {
      setError(data.message);
    }

    getGroups();
  };

  const handleRemoveEmails = async (groupId) => {
    //id -> group
    let group = null;
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].id == groupId) {
        group = groups[i];
        break;
      }
    }

    //add new emails w/o duplicates
    const existingEmails = group.user_emails ? group.user_emails.split(", ") : [];
    const removeEmails = selectedEmails;
    const updatedEmails = existingEmails.filter(email => !removeEmails.includes(email));

    //setup req data
    const requestData = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify( {id: group.id, organization_id: orgId, name: group.name, subgroups: group.subgroups, user_emails: updatedEmails.join(", "), form_type: group.form_type, capacity: group.capacity} ),
    };
    
    //req
    var response = null;
    try {
      response = await fetch('http://localhost:5001/groups/create', requestData);
    } catch (error) {
      console.error('Error fetching event types data:', error);
    }
    const data = await response.json();
    if (data.message === "Group created successfully") {
      console.log(data.message + "(updated)")
    }
    else {
      setError(data.message);
    }

    getGroups();
  };

  const handleAddSubgroup = async (group, subgroupName) => {
    //setup subgroups str
    var subgroupsStr = group.subgroups
    if (subgroupsStr === "") {
      subgroupsStr = subgroupName
    } else {
      subgroupsStr = subgroupsStr + ", " + subgroupName
    }

    //setup req data
    const requestData = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify( {id: group.id, organization_id: orgId, name: group.name, subgroups: subgroupsStr, user_emails: group.user_emails, form_type: group.form_type, capacity: group.capacity} ),
    };
    
    //req
    var response = null;
    try {
      response = await fetch('http://localhost:5001/groups/create', requestData);
    } catch (error) {
      console.error('Error fetching event types data:', error);
    }
    const data = await response.json();
    if (data.message === "Group created successfully") {
      console.log(data.message)
    }
    else {
      setError(data.message);
    }

    getGroups();
  };

  const handleDeleteGroup = async (groupId) => {
  
      //setup req data
      const requestData = {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
      };
      
      //req
      var response = null;
      try {
        response = await fetch(`http://localhost:5001/groups/delete/${groupId}`, requestData);
      } catch (error) {
        console.error('Error fetching event types data:', error);
      }
      const data = await response.json();
      if (data.message === "Group deleted successfully") {
        console.log(data.message)
      }
      else {
        setError(data.message);
      }
  
      getGroups();
  };

  const handleDeleteSubgroup = async (group, subgroupName) => {
    //setup subgroups str
    var subgroupsStr = group.subgroups;
    var subgroupsArray = subgroupsStr.split(',').map(s => s.trim());
    var index = subgroupsArray.indexOf(subgroupName);
    if (index !== -1) {
        subgroupsArray.splice(index, 1);
    }
    subgroupsStr = subgroupsArray.join(', ');

    //setup req data
    const requestData = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify( {id: group.id, organization_id: orgId, name: group.name, subgroups: subgroupsStr, user_emails: group.user_emails, form_type: group.form_type, capacity: group.capacity} ),
    };
    
    //req
    var response = null;
    try {
      response = await fetch('http://localhost:5001/groups/create', requestData);
    } catch (error) {
      console.error('Error fetching event types data:', error);
    }
    const data = await response.json();
    if (data.message === "Group created successfully") {
      console.log(data.message)
    }
    else {
      setError(data.message);
    }

    getGroups();
  };

  const handleEditGroupClick = () => {
    setShowEditForm((prev) => !prev);
  };

  const handleClickOutsideEdit = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setShowEditForm(false);
      setError('');
      setSubgroupName('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideAdd);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideAdd);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideEdit);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideEdit);
    };
  }, []);

  const displaySubgroups = (subgroupName, indentLevel = 10, displayedSubgroups = new Set()) => {
    //prevent page breaking by making sure groups has valid val
    if (!Array.isArray(groups)) {
      return null;
    }

    //recursive display for subgroups, uses list of displayed subgroups to prevent infinite loop
    return (
      <>
        {groups.filter((subgroupGroup) => subgroupGroup.name === subgroupName)
          .map((subgroupGroup) => (
            <div key={subgroupGroup.name} style={{ marginLeft: `${indentLevel}px`, marginTop: '5px' }}>
              {subgroupGroup.subgroups &&
                subgroupGroup.subgroups.split(',').map((nestedSubgroup) => {

                  const trimmedSubgroup = nestedSubgroup.trim();

                  //displayed subgroups logic
                  if (displayedSubgroups.has(trimmedSubgroup)) {
                    return null;
                  }
                  displayedSubgroups.add(trimmedSubgroup);

                  //display subgroup line & recursive call
                  return (
                    <div key={trimmedSubgroup} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography variant="body1" style={{ color: "#000", display: 'flex', alignItems: 'center' }}>
                          <svg width="20" height="20" fill="#6C6C6C" aria-hidden="true">
                            <ArrowTurnDownRightIcon fill="#6C6C6C" />
                          </svg>
                          {trimmedSubgroup}
                        </Typography>
                        <Button
                          variant="outlined"
                          style={{ borderRadius: "10px", backgroundColor: '#FFFFFF', color: '#000', border: 'none',
                          outline: 'none', minWidth: "0px", width: '30px', height: '30px', marginLeft: 'auto',
                          padding: '5px', boxShadow: 'none' }}
                          onClick={() => handleDeleteSubgroup(subgroupGroup, trimmedSubgroup)}>
                          <Trash2 size={16} color="black" />
                        </Button>
                      </div>

                      <div style={{ marginLeft: '20px' }}>
                        {displaySubgroups(trimmedSubgroup, indentLevel, displayedSubgroups)}
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
      </>
    );
  };

  return (
    <div>
      <header className="tabs-header">
        <nav className="tab-menu">
          <ul>
            <li onClick={() => handleTabClick('groups')} className={activeTab === 'groups' ? 'active' : ''}>
              Groups
            </li>
            <li onClick={() => handleTabClick('summary & users')} className={activeTab === 'summary & users' ? 'active' : ''}>
              Summary & Users
            </li>
            <li onClick={() => handleTabClick('settings')} className={activeTab === 'settings' ? 'active' : ''}>
              <Settings size={24} />
            </li>
          </ul>
        </nav>
      </header>

      <div className="tab-spacing">
        {activeTab === 'groups' && (
          <div className="tab-content">
            <h3 className="organization-header">{orgName ? orgName : 'Loading...(jwt may be expired, re-login)'}</h3>
            <h1 className="title-header">Groups</h1>
            <div className="card-container">
              {/* Add Groups Card Start */}
              <Card className="info-card" style={{width: '50vh', height: '50vh', overflowY: 'auto' }} elevation={3}>
                <CardActions
                  style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  <Button variant="contained" style={{ borderRadius: "10px", backgroundColor: '#FDAE62', 
                  color: '#000', fontWeight: 'bold', margin: 0 }} fullWidth onClick={handleAddGroupClick}>
                    + Add Group
                  </Button>
                  {/* Start of Add Group Input Form */}
                  {showAddForm && (
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
                    width: '115%', position: 'fixed', top: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000, left: "-8px"}}>
                      <form ref={formRef}
                        onSubmit={createGroup}
                        style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px',
                        backgroundColor: '#FFF', borderRadius: '10px' }}>
                        <h2 class="details-header" style={{display: 'flex'}}>Add Group</h2>
                        <div style={{color: 'red'}}>{error}</div>
                        <InputLabel>Select a Form</InputLabel>
                        <select value={formType} onChange={handleFormTypeChange} required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                          <option value="" disabled>Select a Form</option>
                          {templateNames.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                          ))}
                        </select>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <InputLabel style={{marginBottom: "10px"}}>Group Name</InputLabel>
                            <TextField value={groupName} onChange={handleGroupNameChange}
                              variant="outlined" label="Group Name"/>
                          </Grid>
                          <Grid item xs={6}>
                            <InputLabel style={{ marginBottom: '10px' }}>Enter Capacity (Optional)</InputLabel>
                            <TextField value={capacity} onChange={handleCapacityChange}
                              variant="outlined" label="Capacity"/>
                          </Grid>
                        </Grid>
                        <Button 
                          type="submit" 
                          variant="contained" 
                          style={{borderRadius: "10px", backgroundColor: '#FFB347', color: '#000',
                            textTransform: 'none'}}>
                          + Add Group
                        </Button>
                      </form>
                    </div>
                  )}
                  {/* End of Add Group Input Form */}
                  {templateNames.map((template, index) => (
                    <div key={index} style={{ position: 'relative', marginBottom: '10px', width: '100%', margin: 0}}>
                      <Button variant="contained" onClick={() => handleToggle(index)}
                      style={{borderRadius: "10px", backgroundColor: '#D3D3D3', color: '#000' }}
                      fullWidth>
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        width: '100%', textTransform: 'none' }}>
                          <span>{template}</span>
                          <span style={{ display: 'flex', alignItems: 'center', marginTop: '1px' }}>
                          {visibleIndices.includes(index) ? <ChevronUp size={20} color="black" /> : <ChevronDown size={20} color="black" />}</span>
                        </span>
                      </Button>
                      <Button variant="outlined"
                      style={{position: 'absolute', right: '20%', borderRadius: "10px",
                      backgroundColor: 'rgba(211, 211, 211, 0.8)', color: '#6C6C6C', border: 'none',
                      minWidth: "0px", width: '30px', height: '30px', marginTop: '3px', padding: '5px',
                      outline: 'none', boxShadow: 'none' }}
                      onClick={handleEditGroupClick}>
                        <Pencil size={16} color="black" />
                      </Button>
                      {/* Start of Edit Group Input Form */}
                      {showEditForm && (
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
                        width: '118%', position: 'fixed', top: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        zIndex: 2000}}>
                          <form ref={formRef}
                            style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px',
                            backgroundColor: '#FFF', borderRadius: '10px', width: '514px', height: '600px',
                            overflowY: 'auto'}}>
                            <h2 class="details-header" style={{display: 'flex'}}>Edit Group Details</h2>
                            <div style={{color: 'red'}}>{error}</div>
                            <select value={formType} onChange={handleFormTypeChange} required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                              <option value="" disabled>Select a Form</option>
                              {templateNames.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                              ))}
                            </select>
                            {formType && (
                              <div style={{ marginTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="h8" style={{ color: "#6C6C6C", fontSize: "13px" }}>Group(s) Name</Typography>
                                  <Typography variant="h8" style={{ color: "#6C6C6C", fontSize: "13px", marginRight: "70px" }}>Capacity</Typography>
                                </div>
                                {groups.filter(group => group.form_type === formType).length > 0 ? (
                                  groups.filter(group => group.form_type === formType).map((group, groupIndex, filteredGroups) => (
                                    <div key={group.name} style={{ marginTop: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <Typography variant="body1" style={{ color: "#000" }}>{group.name}</Typography>
                                      <div style={{marginLeft: 'auto', width: '3vw', textAlign: 'right'}}>
                                        {group.capacity >= 0 ? group.capacity : 'N/A'}
                                      </div>
                                      <Button variant="outlined"
                                        style={{borderRadius: "10px",
                                        backgroundColor: '#FFFFFF', color: '#000', border: 'none', outline: 'none',
                                        minWidth: "0px", width: '30px', height: '30px', marginTop: '3px', marginLeft: 'auto',
                                        padding: '5px', marginLeft: '2.8vw', boxShadow: 'none'}}
                                        onClick={() => handleDeleteGroup(group.id)}>
                                        <Trash2 size={16} color="black"/>
                                      </Button>
                                    </div>
                                    {group.subgroups && group.subgroups.length > 0 && (
                                      <div style={{ marginLeft: '20px', marginTop: '5px' }}>
                                        {group.subgroups.split(',').map(subgroup => {
                                          const trimmedSubgroup = subgroup.trim(); // Trim the subgroup name

                                          return (
                                            <div key={trimmedSubgroup}>
                                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="body1" style={{ color: "#000" }}>
                                                  <svg width="20" height="20" fill="#6C6C6C" aria-hidden="true">
                                                    <ArrowTurnDownRightIcon fill="#6C6C6C" />
                                                  </svg>
                                                  {trimmedSubgroup}
                                                </Typography>
                                                <Button
                                                  variant="outlined"
                                                  style={{borderRadius: "10px", backgroundColor: '#FFFFFF', color: '#000',
                                                    border: 'none', outline: 'none', minWidth: "0px", width: '30px',
                                                    height: '30px', marginTop: '3px', marginLeft: 'auto', boxShadow: 'none',
                                                    padding: '5px'}}
                                                  onClick={() => handleDeleteSubgroup(group, trimmedSubgroup)}>
                                                  <Trash2 size={16} color="black" />
                                                </Button>
                                              </div>

                                              <div style={{ marginLeft: '20px' }}>
                                                {displaySubgroups(trimmedSubgroup)}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                      <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <select
                                        onChange={(e) => setSubgroupName(e.target.value)}
                                        style={{ marginRight: '8px', padding: '4px 8px', borderRadius: '4px',
                                        border: '1px solid #ccc', fontSize: '12px', outline: 'none', 
                                        width: 'auto' }}>
                                        <option value="">Select a subgroup</option>
                                        {groups.map((group) => (
                                          <option key={group.name} value={group.name}>
                                            {group.name}
                                          </option>
                                        ))}
                                      </select>
                                        <button style={{ backgroundColor: 'white', color: 'grey', border: 'none',
                                          borderRadius: '10px', cursor: 'pointer', outline: 'none', boxShadow: 'none',
                                          transition: 'background-color 0.3s', fontSize: '12px', padding: '4px 8px',
                                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}
                                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#D3D3D3')}
                                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                                          onClick={(e) => {e.preventDefault();
                                            handleAddSubgroup(group, subgroupName)}}>
                                          + add subgroup
                                        </button>
                                      </div>
                                      {groupIndex < filteredGroups.length - 1 && (
                                        <hr style={{ margin: '10px 0', border: '1px solid #D3D3D3' }} />
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <Typography variant="body1" style={{ color: '#777' }}>No matching groups found.</Typography>
                                )}
                              </div>
                            )}
                          </form>
                        </div>
                      )}
                      {/* End of Edit Group Input Form */}
                      {visibleIndices.includes(index) && (
                          <Typography variant="body1" style={{ marginTop: '10px' }}>
                            {groups.filter(group => group.form_type === template)
                              .map(group => (
                                <div key={group.name} style={{ marginTop: '10px' }}>
                                  <Typography variant="body1" style={{ color: '#000' }}>
                                    {group.name}
                                  </Typography>
                                  {group.subgroups && group.subgroups.length > 0 && (
                                    <div style={{ marginLeft: '20px', marginTop: '5px' }}>
                                      {group.subgroups.split(',').map(subgroup => {
                                        const subgroupGroup = groups.find(g => g.name === subgroup.trim());

                                        return (
                                          <Typography variant="body1" key={subgroup.trim()} style={{ color: '#000' }}>
                                            <svg width="20" height="20" fill="#6C6C6C" aria-hidden="true">
                                              <ArrowTurnDownRightIcon fill="#6C6C6C" />
                                            </svg>
                                            {subgroup.trim()}
                                            {subgroupGroup && subgroupGroup.subgroups ? (
                                              <Typography variant="body1" key={subgroup.trim()} style={{ color: '#000', marginLeft: '3.5vh' }}>
                                                <svg width="20" height="20" fill="#6C6C6C" aria-hidden="true">
                                                  <ArrowTurnDownRightIcon fill="#6C6C6C" />
                                                </svg>
                                                ...
                                              </Typography>
                                            ) : (null)}
                                          </Typography>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              ))
                            }
                          </Typography>
                        )}
                    </div>
                  ))}
                </CardActions>
              </Card>
              {/* Add Groups Card End */}
              {/* groups/capacity card start */}
              <Card className="info-card" style={{ width: '180vh', height: '60vh', marginLeft: '2.5vh',
              marginRight: '1vh', overflowY: 'auto' }}
                elevation={3}>
                <CardContent>
                  <h1 className="details-header">Details</h1>
                  <Card style={{ width: '49.6vw', height: '6vh', backgroundColor: '#FDAE62',
                  margin: '0vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                  elevation={3}>
                    <div style={{ flex: '0 0 auto', marginLeft: '1.2vw' }}>Template</div>
                    <div style={{flex: '1 1 auto', display: 'flex', justifyContent: 'space-between'}}>
                        <div style={{ marginLeft: '14vw' }}>Completed</div>
                        <div>Available</div>
                        <div style={{ marginRight: '4vw' }}>Capacity</div>
                    </div>
                  </Card>
                  {templateNames.length > 0 ? (
                    templateNames.map((template, index) => (
                      <>
                        {/* template section */}
                        <Card key={index} style={{ backgroundColor: '#D3D3D3', padding: '2.5vh', textAlign: 'left', 
                          height: '7vh', width: '49.6vw' }} elevation={0}>
                          <Typography variant="body1" style={{ color: "#000", marginTop: '-0.5vh' }}>
                            {template}
                          </Typography>
                          <div style={{flex: '1 1 auto', display: 'flex', justifyContent: 'space-between',
                            marginTop: '-2.8vh'}}>
                            <div style={{ marginLeft: '20.4vw' }}>
                              ...
                            </div>
                            <div style={{ marginLeft: '0.5vw' }}>
                              ...
                            </div>
                            <div style={{ marginRight: '0.8vw', width: '5vw' }}>
                              {groups.filter(group => group.form_type === template)
                                .reduce((sum, group) => sum + (group.capacity >= 0 ? group.capacity : 0), 0)}
                            </div>
                          </div>
                        </Card>

                        {/* groups for template section */}
                        {groups.filter(group => group.form_type === template).length > 0 && (
                          groups.filter(group => group.form_type === template).map((group, groupIndex, arr) => (
                            <Card key={`group-${groupIndex}`} style={{ backgroundColor: 'white', marginBottom: '1vh',
                              padding: '1.5vh', borderBottom: groupIndex < arr.length - 1 ? '1px solid #ccc' : 'none',
                              borderRadius: '0', height: '5vh', width: '49.6vw'}} elevation={0}>
                              <Typography variant="body2" style={{ color: "#000" }}>
                                {group.name}
                              </Typography>
                              <div style={{flex: '1 1 auto', display: 'flex', justifyContent: 'space-between',
                                marginTop: '-3vh'}}>
                                <div style={{ marginLeft: '20.9vw' }}>
                                  ...
                                </div>
                                <div style={{ marginLeft: '0.4vw' }}>
                                  ...
                                </div>
                                <div style={{ marginRight: '1.3vw', width: '5vw' }}>
                                  {group.capacity >= 0 ? group.capacity : "N/A"}
                                </div>
                              </div>
                            </Card>
                          ))
                        )}
                      </>
                    ))
                  ) : (
                    <div style={{backgroundColor: '#D3D3D3', padding: '2.5vh', borderRadius: '10px', textAlign: 'center'}}>
                      <Typography variant="body1" style={{ color: "#000" }}>
                        No templates available.
                      </Typography>
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* groups/capacity card end */}
            </div>
          </div>
        )}
        {/* Summary & Users Tab */}
        {activeTab === 'summary & users' && (
          <div className="tab-content">
            <h3 className="organization-header">{orgName ? orgName : 'Loading...(jwt may be expired, re-login)'}</h3>
            <h1 className="title-header">Summary & Users</h1>
            <div className="card-container" style={{display: 'grid', gridTemplateRows: 'auto auto'}}>
              {/* Summary Card Start */}
              <Card style={{width: '72vw', height: '70vh', overflowY: 'auto' }} elevation={3}>
                <h1 className='organization-header' style={{marginLeft: '1vw', color: 'black'}}>Overall Summary</h1>
                {/* header section */}
                <Card style={{ width: '70vw', height: '6vh', margin: '0vh', backgroundColor: '#F26E21',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '1vw'}}
                  elevation={3}>
                    <div style={{flex: '1 1 auto', display: 'flex', justifyContent: 'space-between'}}>
                        <div style={{ marginLeft: '2vw' }}>Group</div>
                        <div>Sub Group</div>
                        <div>Count</div>
                        <div>Available</div>
                        <div style={{ marginRight: '2vw' }}>Group Count</div>
                    </div>
                </Card>
                {/* group info section */}
                {groups.map((group, index) => (
                  <Card
                    key={group.id}
                    style={{
                      width: '70vw', height: '8vh', margin: '0vh', backgroundColor: index % 2 === 0 ? 'white' : '#f0f0f0',
                      color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '1vw'}}
                      elevation={0}>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridGap: '10vw',
                      alignItems: 'center', justifyItems: 'center'}}>
                      <div style={{ marginLeft: '4vw', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', 
                        width: '7vw'}}>{group.name}</div>
                      <div style={{ marginLeft: '-2.5vw', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', 
                        width: '7vw' }}>{group.subgroups}</div>
                      <div style={{ marginLeft: '0vw', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', 
                        width: '7vw' }}>{group.capacity}</div>
                      <div style={{ marginLeft: '-2vw', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', 
                        width: '7vw' }}>
                        {group.capacity - group.user_emails.split(',').filter(email => email.trim()).length}
                      </div>
                      <div style={{ marginLeft: '0vw', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', 
                        width: '7vw' }}>{group.user_emails.split(',').filter(email => email.trim()).length}</div>
                    </div>
                  </Card>
                ))}
              </Card>
              {/* Summary Card End */}
              {/* User Card Start */}
              <Card style={{width: '72vw', height: '70vh', overflowY: 'auto' }} elevation={3}>
                <h1 className='organization-header' style={{marginLeft: '1vw', color: 'black'}}>Organization Users</h1>
                {/* Input Section Start */}
                <Card style={{ width: '70vw', height: '15vh', margin: '0vh', backgroundColor: 'white',
                  color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '1vw'}}
                  elevation={0}>
                    <TextField value={emailsFilter} onChange={handleEmailsFilterChange}
                      variant="outlined"
                      label="User Email"
                      sx={{ height: '1vh', mt: '-10vh' }}/>
                    <div style={{flex: '1 1 auto', display: 'flex', justifyContent: 'space-between'}}>
                      <div>
                        <select id="group-select" value={selectedGroupId} onChange={handleSelectedGroupChange}
                          style={{height: '4vh', fontSize: '2vh', padding: '0.2rem', width: '8vw', marginLeft: '30vw',
                            marginTop: '-1vh' }}>
                          <option value="" disabled>Select Group</option>
                          {groups.map((group, index) => (
                            <option key={index} value={group.id}>
                              {group.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Button style={{backgroundColor: '#F26E21', marginTop: '-1vh'}}
                      onClick={(e) => {e.preventDefault();
                        handleAddEmails(selectedGroupId)}}>Add Selected Users</Button>
                      <Button style={{backgroundColor: '#F26E21', marginTop: '-1vh'}}
                      onClick={(e) => {e.preventDefault();
                        handleRemoveEmails(selectedGroupId)}}><UserMinus size={20} color="white"/></Button>
                    </div>
                </Card>
                {/* Input Section End */}
                {/* Title Section Start */}
                <Card style={{ width: '70vw', height: '6vh', margin: '0vh', backgroundColor: '#F26E21',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '1vw',
                  marginTop: '1vh'}}
                  elevation={3}>
                    <div>
                      <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange}/>
                    </div>
                    <div style={{flex: '1 1 auto', display: 'flex', justifyContent: 'space-between'}}>
                        <div style={{ marginLeft: '2vw' }}>Status</div>
                        <div>User Email</div>
                        <div>Group(s)</div>
                        <div style={{ marginRight: '30vw' }}>...</div>
                    </div>
                </Card>
                {/* Title Section End */}
                {/* Selection Section Start */}
                {filteredEmails.map((orgEmail, index) => (
                  <Card key={index} style={{width: '70vw', height: '8vh', margin: '0vh',
                    backgroundColor: index % 2 === 0 ? 'white' : '#f0f0f0', color: 'black', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', marginLeft: '1vw'}}
                    elevation={0}>
                    <div>
                      <input type="checkbox" checked={selectedEmails.includes(orgEmail)}
                        onChange={() => handleEmailChange(orgEmail)}/>
                    </div>
                    <div style={{flex: '1 1 auto', display: 'flex', justifyContent: 'space-between'}}>
                      <div style={{ marginLeft: '2vw' }}>...</div>
                      <div style={{overflow: 'hidden', textOverflow: 'ellipsis', width:  '10vw', marginLeft: '8.2vw'}}>
                        {orgEmail}
                      </div>
                      <div style={{overflow: 'hidden', textOverflow: 'ellipsis', width: '10vw', whiteSpace: 'nowrap',
                        marginLeft: '1vw'
                      }}>
                        {groups.filter(group => group.user_emails.includes(orgEmail))
                          .map((group, index, arr) => (
                            <span key={index}>
                              {group.name}
                              {index < arr.length - 1 && ', '}
                            </span>
                          ))}
                      </div>
                      <div style={{ marginRight: '30vw' }}>...</div>
                    </div>
                  </Card>
                ))}
                {/* Selection Section End */}
              </Card>
              {/* User Card End */}
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="tab-content">
            <h3 className="organization-header">{orgName ? orgName : 'Loading...(jwt may be expired, re-login)'}</h3>
            <h1 className="title-header">Settings</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsPage;
