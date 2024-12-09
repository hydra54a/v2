// FormTemplatesPage.jsx
import React, { useState } from 'react';
import styles from '../styles/FormTemplatesPage.module.css';
import {
  ChevronDown,
  Search,
  Menu,
  Grid,
  MoreVertical,
  FilePlus,
  Filter,
  X,
  Copy,
  Link as LinkIcon,
  QrCode,
  Star,
  Edit,
  Share,
  Archive,
  Delete,
  Code,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

const FormTemplatesPage = () => {
  const [viewMode, setViewMode] = useState('list');
  const [activeTab, setActiveTab] = useState('viewAll');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedFormTypes, setSelectedFormTypes] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [copyright, setCopyright] = useState('no');
  const [activeForm, setActiveForm] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [association, setAssociation] = useState('');
  const [formType, setFormType] = useState('');
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [shareModalTab, setShareModalTab] = useState('groups');
  const [selectedFormForShare, setSelectedFormForShare] = useState(null);

  const navigate = useNavigate();

  const handleCategoryKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (categoryInput.trim()) {
        setCategories([...categories, categoryInput.trim()]);
        setCategoryInput('');
      }
    }
  };

  const removeCategory = (categoryToRemove) => {
    setCategories(categories.filter((cat) => cat !== categoryToRemove));
  };

  const metrics = {
    applications: 58,
    surveys: 34,
    registries: 10,
  };

  // const organizationId = 26; // Replace with the actual organization ID or fetch dynamically
  const [forms, setForms] = useState([]);
  const [formOwner, setFormOwner] = useState([]);
  // Fetch forms by organization ID
  // useEffect(() => {
  //   const fetchForms = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:5001/forms/organization/${organizationId}`
  //       );
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch forms');
  //       }
  //       const data = await response.json();
  //       setForms(data.forms || []); // Assuming the API returns a `forms` array
  //       
  //     } catch (error) {
  //       console.error('Error fetching forms:', error.message);
  //     }
  //   };

  //   fetchForms();
  // }, [organizationId]);
  
  useEffect(() => {
    const fetchFormsAndDetails = async () => {
      try {
        // Retrieve userId from localStorage
        const userId = JSON.parse(localStorage.getItem("userData")).user.id;
        if (!userId) {
          console.error('User ID not found in localStorage.');
          return;
        }
  
        // Fetch organization ID using userId
        const orgResponse = await axios.get(`http://localhost:5001/account/get-organization-by-user/${userId}`);
        const organizationId = orgResponse.data.organization[0].id;
        if (!organizationId) {
          console.error(`Organization ID not found for the user with id ${userId}.`);
          return;
        }
  
        // Fetch forms for the organization
        const formsResponse = await axios.get(`http://localhost:5001/forms/organization/${organizationId}`);
        setForms(formsResponse.data.forms);
        
        // Fetch user and organization details for each form
        const ownerPromises = formsResponse.data.forms.map(async (form) => {
          const userId = form.user_id; // Assuming forms have a `user_id` field
          const [userResponse] = await Promise.all([
            axios.get(`http://localhost:5001/account/get-user-details-by-id/${userId}`) ]);
  
          return {
            formId: form.id,
            firstName: userResponse.data.user.firstname,
            lastName: userResponse.data.user.lastname,
            organizationName: orgResponse.data.organization[0].name,
          };
        });
  
        const owners = await Promise.all(ownerPromises);
  
        // Map user details and organization names to form IDs
        const ownerMap = owners.reduce((acc, owner) => {
          acc[owner.formId] = {
            fullName: `${owner.firstName} ${owner.lastName}`,
            organizationName: owner.organizationName,
          };
          return acc;
        }, {});
  
        setFormOwner(ownerMap);
        
        
      } catch (error) {
        console.error('Error fetching forms, user, or organization details:', error);
      }
    };
  
    fetchFormsAndDetails();
  }, []);

  const organizations = [
    { name: 'Fields Middle School', type: 'School', access: 'Full Access' },
    { name: '100 Black Men', type: 'Organization', access: 'Full Access' },
    { name: 'North High School', type: 'School', access: 'Full Access' },
    { name: 'Vines High School', type: 'School', access: 'Full Access' }
  ];

  const handleActionClick = (formId, event) => {
    event.stopPropagation();
    setShowActionMenu(showActionMenu === formId ? null : formId);
  };
  
  const handleShareClick = (form) => {
    setSelectedFormForShare(form);
    setIsShareModalOpen(true);
    setShowActionMenu(null);
  };

  const handleToFormGeneratorPage = () => {
    const formMetadata = {
      formType: selectedFormTypes.join(', '), // Convert array to comma-separated string
      title: title,
      description: description,
      association: association,
      categories: categories.join(', '), // Convert array to comma-separated string
  };
  localStorage.setItem('formMetadata', JSON.stringify(formMetadata));
   // Log the entire object
  navigate('/dashboard/form-generator');
  };

  const ActionMenu = ({ form }) => (
    <div className={styles.actionMenu}>
      <button className={styles.actionMenuItem} onClick={() => console.log('Favorite')}>
        <Star size={16} />
        <span>Favorites</span>
      </button>
      <button className={styles.actionMenuItem} onClick={() =>navigate('/dashboard/form-editor', {state: {formID: form.id}})}>
        <Edit size={16} />
        <span>Edit Form</span>
      </button>
      <button className={styles.actionMenuItem} onClick={() => console.log('Duplicate')}>
        <Copy size={16} />
        <span>Duplicate</span>
      </button>
      <button className={styles.actionMenuItem} onClick={() => handleShareClick(form)}>
        <Share size={16} />
        <span>Share</span>
      </button>
      <button className={styles.actionMenuItem} onClick={() => console.log('Archive')}>
        <Archive size={16} />
        <span>Archive</span>
      </button>
      <button className={styles.actionMenuItem} onClick={() => console.log('Delete')}>
        <Delete size={16} />
        <span>Delete</span>
      </button>
    </div>
  );

  const ShareModal = ({ isOpen, onClose, form }) => {
    if (!isOpen) return null;

    return (
      <div className={styles.modalOverlay}>
        <div className={`${styles.modalContent} ${styles.shareModalContent}`}>
          <div className={styles.shareModalHeader}>
            <div className={styles.shareTabs}>
              <button
                className={`${styles.shareTab} ${shareModalTab === 'groups' ? styles.activeShareTab : ''}`}
                onClick={() => setShareModalTab('groups')}
              >
                Groups
              </button>
              <button
                className={`${styles.shareTab} ${shareModalTab === 'members' ? styles.activeShareTab : ''}`}
                onClick={() => setShareModalTab('members')}
              >
                Members
              </button>
            </div>
            <button className={styles.closeButton} onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className={styles.shareModalBody}>
            <h2 className={styles.shareTitle}>
              Share or Give Access to "{form?.title || 'Untitled Form'}"
            </h2>
            
            <p className={styles.subtitle}>Who would you like to give access to?</p>

            <div className={styles.shareSearchContainer}>
              <div className={styles.searchWrapper}>
                <Search className={styles.shareSearchIcon} />
                <input
                  type="text"
                  placeholder="Organization's Name"
                  className={styles.shareSearchInput}
                />
              </div>
              <button className={styles.accessTypeButton}>
                Full Access
                <ChevronDown size={16} />
              </button>
              <button className={styles.shareButton}>
                Share
              </button>
            </div>

            <p className={styles.listTitle}>Organizations who have rights to view this form.</p>

            <div className={styles.organizationsList}>
              {organizations.map((org, index) => (
                <div key={index} className={styles.organizationItem}>
                  <div className={styles.orgInfo}>
                    <div className={styles.orgAvatar} />
                    <div className={styles.orgDetails}>
                      <p className={styles.orgName}>{org.name}</p>
                      <p className={styles.orgType}>{org.type}</p>
                    </div>
                  </div>
                  <button className={styles.orgAccessButton}>
                    Full Access
                    <ChevronDown size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.sectionAccess}>
              <h3>Section Title</h3>
              <button className={styles.sectionAccessButton}>
                <Lock size={16} />
                Restricted
                <ChevronDown size={16} />
              </button>
              <p className={styles.sectionAccessDescription}>
                Only people with access can open with link.
              </p>
            </div>

            <div className={styles.shareActions}>
              <button className={styles.shareActionButton}>
                <LinkIcon size={16} />
                Copy link
              </button>
              <button className={styles.shareActionButton}>
                <Code size={16} />
                Get embed
              </button>
              <button className={styles.shareActionButton}>
                <LinkIcon size={16} />
                Link to Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1 className={styles.title}>Form Templates</h1>
        <button
          className={styles.createButton}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <FilePlus size={20} />
          Create Form
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Description and Metrics */}
      <div className={styles.subheader}>
        <p className={styles.description}>
          Create new form templates and easily view all existing templates
        </p>
        <div className={styles.metrics}>
          <span className={styles.metric}>
            {metrics.applications} Total Applications
          </span>
          <span className={styles.metric}>{metrics.surveys} Total Surveys</span>
          <span className={styles.metric}>
            {metrics.registries} Total Registries
          </span>
        </div>
      </div>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.viewTabs}>
          <button
            className={`${styles.viewTab} ${styles.viewTabLeft} ${
              activeTab === 'viewAll' ? styles.activeTab : ''
            }`}
            onClick={() => setActiveTab('viewAll')}
          >
            View All
          </button>
          <button
            className={`${styles.viewTab} ${styles.viewTabRight} ${
              activeTab === 'favorites' ? styles.activeTab : ''
            }`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
        </div>

        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
          />
        </div>

        <div className={styles.viewControls}>
          <button className={styles.filterButton}>
            <Filter size={16} />
            Filters
          </button>
          <div className={styles.viewButtonGroup}>
            <button
              className={`${styles.viewButton} ${styles.viewButtonLeft} ${
                viewMode === 'list' ? styles.activeView : ''
              }`}
              onClick={() => setViewMode('list')}
            >
              <Menu size={20} />
            </button>
            <button
              className={`${styles.viewButton} ${styles.viewButtonRight} ${
                viewMode === 'grid' ? styles.activeView : ''
              }`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Form List */}
      <div className={styles.formList}>
        <div className={styles.listHeader}>
          <div className={styles.headerCell}>
            <input type="checkbox" className={styles.checkbox} />
            Title
          </div>
          <div className={styles.headerCell}>Type</div>
          <div className={styles.headerCell}>Owner</div>
          <div className={styles.headerCell}>Association</div>
          <div className={styles.headerCell}>Last Modified</div>
          <div className={styles.headerCell}>Categories</div>
          <div className={styles.headerCell}></div>
        </div>

        {forms.map((form) => (
          <div key={form.id} className={styles.formRow}>
            <div className={styles.cell}>
              <input type="checkbox" className={styles.checkbox} />
              <div className={styles.titleInfo}>
                <span className={styles.formTitle}>{form.title}</span>
                <span className={styles.status}>{form.status}</span>
              </div>
            </div>
            <div className={styles.cell}>
              <span className={`${styles.type} ${styles[form.form_type.toLowerCase()]}`}>
                {form.form_type}
              </span>
            </div>
            <div className={styles.cell}>
              <div className={styles.owner}>
                <div className={styles.avatarPlaceholder}></div>
                <div className={styles.ownerInfo}>
                  <span>{formOwner[form.id]?.organizationName}</span>
                   
                  <span className={styles.organization}>
                     {formOwner[form.id]?.fullName} 
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.cell}>{form.association}</div>
            <div className={styles.cell}>
              <div className={styles.modifiedInfo}>
              <span>{new Date(form.updated_at).toLocaleDateString('en-US')}</span>
              <span className={styles.timestamp} >{new Date(form.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EST</span>
              {/* <span> placeholder </span> */}
                {/* <span className={styles.timestamp}>placeholder</span> */}
                {/* <span className={styles.timestamp}>{form.lastModified}</span> */}
              </div>
            </div>
            <div className={styles.cell}>
              <div className={styles.categories}>
                {form.categories}
                {/* {form.categories.map((category, index) => (
                  <span key={index} className={styles.category}>
                    {category}
                  </span>
                ))} */}
              </div>
            </div>
            <div className={styles.cell}>
              <div className={styles.actionWrapper}>
                <button
                  className={styles.actionButton}
                  onClick={(e) => handleActionClick(form.id, e)}
                >
                  <MoreVertical size={16} />
                </button>
                {showActionMenu === form.id && <ActionMenu form={form} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <span className={styles.pageInfo}>Page 1 of 6</span>
        <div className={styles.pageControls}>
          <button className={styles.pageButton} disabled>
            Previous
          </button>
          <button className={styles.pageButton}>Next</button>
        </div>
      </div>

      {/* Create Form Modal */}
      {isCreateModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>New Form Information</h2>
              <button
                className={styles.closeButton}
                onClick={() => setIsCreateModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Form Type</label>
                <div className={styles.formTypeButtons}>
                  <button
                    type="button"
                    className={`${styles.typeButton} ${
                      selectedFormTypes.includes('survey') ? styles.survey : ''
                    }`}
                    onClick={() => {
                      setSelectedFormTypes((prev) =>
                        prev.includes('survey')
                          ? prev.filter((type) => type !== 'survey')
                          : [...prev, 'survey']
                      );
                    }}
                  >
                    Survey
                  </button>
                  <button
                    type="button"
                    className={`${styles.typeButton} ${
                      selectedFormTypes.includes('application')
                        ? styles.application
                        : ''
                    }`}
                    onClick={() => {
                      setSelectedFormTypes((prev) =>
                        prev.includes('application')
                          ? prev.filter((type) => type !== 'application')
                          : [...prev, 'application']
                      );
                    }}
                  >
                    Application
                  </button>
                  <button
                    type="button"
                    className={`${styles.typeButton} ${
                      selectedFormTypes.includes('registry')
                        ? styles.registry
                        : ''
                    }`}
                    onClick={() => {
                    setSelectedFormTypes((prev) =>
                      prev.includes('registry')
                        ? prev.filter((type) => type !== 'registry')
                        : [...prev, 'registry']
                    );
                  }}
                >
                  Registry
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className={styles.formGroup}>
              <label>Categories</label>
              <div className={styles.categoryInputWrapper}>
                {categories.map((category, index) => (
                  <span key={index} className={styles.categoryTag}>
                    {category}
                    <button
                      type="button"
                      onClick={() => removeCategory(category)}
                      className={styles.removeTag}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyDown={handleCategoryKeyDown}
                  placeholder={
                    categories.length === 0
                      ? 'Type and press Enter to add categories'
                      : ''
                  }
                  className={styles.categoryInput}
                  required
                />
              </div>
            </div>

            {/* Association */}
            <div className={styles.formGroup}>
              <label>Association</label>
              <input
                type="text"
                value={association}
                onChange={(e) => setAssociation(e.target.value)}
                className={styles.input}
                placeholder="Untitled"
                required
              />
            </div>

            {/* Form Title */}
            <div className={styles.formGroup}>
              <label>Form Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
                placeholder="Untitled"
                required
              />
            </div>

            {/* Form Description */}
            <div className={styles.formGroup}>
              <label>Form Description</label>
              <textarea className={styles.textarea} rows={4} 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            
            </div>

            {/* Copyright Protection */}
            <div className={styles.formGroup}>
              <label>Is this form under copyright protection?</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="copyright"
                    value="yes"
                    checked={copyright === 'yes'}
                    onChange={(e) => setCopyright(e.target.value)}
                    
                  />
                  Yes
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="copyright"
                    value="no"
                    checked={copyright === 'no'}
                    onChange={(e) => setCopyright(e.target.value)}
                  />
                  No
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.continueButton}
                onClick={handleToFormGeneratorPage}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Share Modal */}
    <ShareModal
      isOpen={isShareModalOpen}
      onClose={() => setIsShareModalOpen(false)}
      form={selectedFormForShare}
    />
  </div>
);
};

export default FormTemplatesPage;