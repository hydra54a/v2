import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Sidebar } from './Sidebar';
import { FormElements } from './FormElements';
import axios from 'axios';
import { ArrowLeft, Copy, MoreVertical, Trash, GripVertical } from 'lucide-react';
import '../styles/FormBuilder.css';
import {useLocation, useNavigate} from 'react-router-dom';


const FormEditor = () => { // Assume formId is passed as a prop
  const [formTitle, setFormTitle] = useState('');
  const [formElements, setFormElements] = useState([]);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({
    input: false,
    contact: false,
    field: false,
  });
  const [selectedElement, setSelectedElement] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const navigate = useNavigate();

  // Fetch form data and pre-fill the editor
  const formId = useLocation().state?.formID;
  
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/forms/${formId}`);
        const formData = response.data;

        

        // Populate form elements based on fields
        const populatedFields = formData.form.fields.map((field) => ({
          id: `${field.type}-${Date.now()}-${field.id}`, // Ensure unique ID
          type: field.type,
          title: field.label || 'Untitled',
          placeholder: field.placeholder || null,
          required: !!field.required,
          options: Array.isArray(field.options) ? field.options : null, // Use options as-is if it's an array
          position: field.position || 0,
        }));
        setFormTitle(formData.form.title);
        setOriginalFormData(formData);
        setFormElements(populatedFields);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    if (formId) {
      fetchFormData();
    }
  }, [formId]);

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(formElements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFormElements(items);
  };

  const updateElement = (elementId, updates) => {
    setFormElements((prev) =>
      prev.map((element) =>
        element.id === elementId ? { ...element, ...updates } : element
      )
    );
  };

  const toggleRequired = (elementId) => {
    setFormElements((prev) =>
      prev.map((element) =>
        element.id === elementId ? { ...element, required: !element.required } : element
      )
    );
  };

  const createBaseElement = (type) => ({
    id: `${type}-${Date.now()}`,
    type,
    required: false,
    title: getDefaultTitle(type),
    isEditing: false
  });

  const getDefaultTitle = (type) => {
    const titles = {
      name: 'Name',
      email: 'Email Address',
      phone: 'Phone Number',
      address: 'Address',
      'single-line': 'Single Line Text',
      'multi-lines': 'Multi Line Text',
      single: 'Single Choice',
      multi: 'Multiple Choice',
      dropdown: 'Dropdown',
      date: 'Date',
      time: 'Time',
      rating: 'Rating',
      upload: 'File Upload',
      link: 'Link',
      header: 'Header',
      subheader: 'Subheader',
      text: 'Text',
      image: 'Image',
    };
    return titles[type] || 'Untitled Question';
  };

  const handleAddElement = (type) => {
    let newElement;

    switch (type) {

      case 'header':
        newElement = {
          ...createBaseElement(type),
          content: {
            title: 'Section Header',
            description: 'Add a description here'
          }
        };
        break;

      case 'subheader':
        newElement = {
          ...createBaseElement(type),
          content: {
            text: 'Subheader Text'
          }
        };
        break;

      case 'text':
        newElement = {
          ...createBaseElement(type),
          content: {
            text: 'Add your text content here'
          },
          style: {
            align: 'left',
            size: 'normal'
          }
        };
        break;

      case 'image':
        newElement = {
          ...createBaseElement(type),
          content: {
            url: '',
            alt: 'Image description',
            caption: 'Image caption'
          },
          style: {
            width: '100%',
            alignment: 'center'
          }
        };
        break;

      case 'add-all':
        const contactFields = ['name', 'email', 'phone', 'address'];
        const timestamp = Date.now();
        const newElements = contactFields.map((fieldType, index) => ({
          ...createBaseElement(fieldType),
          id: `${fieldType}-${timestamp}-${index}`,
          ...(fieldType === 'name' && {
            nameFields: {
              firstName: true,
              middleName: false,
              lastName: true,
              suffix: false
            }
          }),
          ...(fieldType === 'phone' && {
            phoneType: 'mobile',
            placeholder: 'Enter phone number'
          }),
          ...(fieldType === 'email' && {
            placeholder: 'Enter email address'
          }),
          ...(fieldType === 'address' && {
            addressFields: {
              line1: '',
              line2: '',
              city: '',
              state: '',
              zipCode: ''
            }
          })
        }));
        setFormElements(prev => [...prev, ...newElements]);
        return;

      case 'name':
        newElement = {
          ...createBaseElement(type),
          nameFields: {
            firstName: true,
            middleName: false,
            lastName: true,
            suffix: false
          }
        };
        break;

      case 'email':
        newElement = {
          ...createBaseElement(type),
          placeholder: 'Enter email address'
        };
        break;

      case 'phone':
        newElement = {
          ...createBaseElement(type),
          phoneType: 'mobile',
          placeholder: 'Enter phone number'
        };
        break;

      case 'address':
        newElement = {
          ...createBaseElement(type),
          addressFields: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            zipCode: ''
          }
        };
        break;

      case 'single':
      case 'multi':
      case 'dropdown':
        newElement = {
          ...createBaseElement(type),
          options: ['Option 1', 'Option 2', 'Option 3'],
          allowEdit: true,
          isEditing: false
        };
        break;

      case 'single-line':
        newElement = {
          ...createBaseElement(type),
          placeholder: 'Single line answer text'
        };
        break;

      case 'multi-lines':
        newElement = {
          ...createBaseElement(type),
          placeholder: 'Multi line answer text',
          rows: 4
        };
        break;

      case 'date':
        newElement = {
          ...createBaseElement(type),
          dateFormat: 'MM/DD/YYYY',
          allowFutureDates: true,
          allowPastDates: true
        };
        break;

      case 'time':
        newElement = {
          ...createBaseElement(type),
          timeFormat: '24',
          intervals: 15
        };
        break;

      case 'rating':
        newElement = {
          ...createBaseElement(type),
          maxRating: 5,
          currentRating: 0,
          allowHalf: false
        };
        break;

      case 'upload':
        newElement = {
          ...createBaseElement(type),
          allowedTypes: ['image/*', 'application/pdf'],
          maxSize: 5,
          maxFiles: 1
        };
        break;

      case 'link':
        newElement = {
          ...createBaseElement(type),
          placeholder: 'Enter URL',
          validateURL: true
        };
        break;

      default:
        newElement = createBaseElement(type);
    }

    setFormElements(prev => [...prev, newElement]);
  };

  const deleteElement = (elementId) => {
    setFormElements((prev) => prev.filter((element) => element.id !== elementId));
    if (selectedElement === elementId) setSelectedElement(null);
    setShowActionMenu(null);
  };

  const duplicateElement = (elementId) => {
    const elementToDuplicate = formElements.find((el) => el.id === elementId);
    if (!elementToDuplicate) return;

    const newElement = {
      ...elementToDuplicate,
      id: `${elementToDuplicate.type}-${Date.now()}`,
      title: `${elementToDuplicate.title} (Copy)`,
    };

    const index = formElements.findIndex((el) => el.id === elementId);
    const updatedElements = [...formElements];
    updatedElements.splice(index + 1, 0, newElement);
    setFormElements(updatedElements);
    setShowActionMenu(null);
  };

  const ActionMenu = ({ element }) => (
    <div className="action-menu">
      <button 
        className="action-item"
        onClick={() => duplicateElement(element.id)}
      >
        <Copy size={16} />
        <span>Duplicate</span>
      </button>
      <button 
        className="action-item"
        onClick={() => deleteElement(element.id)}
      >
        <Trash size={16} />
        <span>Delete</span>
      </button>
    </div>
  );

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('http://localhost:5001/csrf-token', {
        withCredentials: true, // Enable sending and receiving cookies
      });
      const csrfToken = response.data.csrfToken;

      if (!csrfToken) {
        throw new Error('CSRF token not found in the response.');
      }

      localStorage.setItem('csrfToken', csrfToken); // Store it in localStorage for later use
      return csrfToken;
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error.message);
      alert('Failed to fetch CSRF token. Please reload the page.');
      return null;
    }
  };

  // Function to ensure CSRF token is set with a timeout
  const ensureCsrfToken = async (timeout = 5000) => {
    const startTime = Date.now();

    while (!localStorage.getItem('csrfToken')) {
      if (Date.now() - startTime >= timeout) {
        throw new Error('Timeout exceeded while waiting for CSRF token.');
      }
      await new Promise((resolve) => setTimeout(resolve, 100)); // Poll every 100ms
    }

    return localStorage.getItem('csrfToken');
  };

  const saveForm = async () => {
    try {
      // Fetch CSRF token
      await fetchCsrfToken();
  
      // Ensure CSRF token is set, with a timeout
      const csrfToken = await ensureCsrfToken();
      if (!csrfToken) {
        return;
      }
  
  
      // Prepare final form object with unchanged fields from fetched data
      const finalFormObject = {
        user_id: originalFormData.user_id, // Unchanged
        organization_id: originalFormData.organization_id, // Unchanged
        form_type: originalFormData.form_type, // Unchanged
        categories: originalFormData.categories, // Unchanged
        association: originalFormData.association, // Unchanged
        title: formTitle, // Unchanged
        description: originalFormData.description, // Unchanged
        copyright_protected: originalFormData.copyright_protected || false, // Unchanged
        fields: formElements.map((element, index) => ({
          type: element.type,
          label: element.title,
          placeholder: element.placeholder || null,
          required: element.required || false,
          options: element.options ? JSON.stringify(element.options) : null,
          position: index + 1,
        })),
      };
  
      // Send POST request using fetch
      
      
  
      const saveResponse = await fetch(`http://localhost:5001/forms/${formId}`, {
        method: "PUT",
        credentials: "include", // Include credentials (cookies)
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken, // Send the CSRF token in the header
        },
        body: JSON.stringify(finalFormObject), // Include the final form object in the body
      });
  
      if (!saveResponse.ok) {
        throw new Error(`${saveResponse.statusText} (${saveResponse.status})`);
      }
  
      const result = await saveResponse.json();
      
      alert('Form saved successfully!');
    } catch (error) {
      console.error('Error saving form:', error.message);
      alert(`Error saving form: ${error.message}`);
    }
  };
  
  return (
    <div className="form-builder">
      <Sidebar 
        onAddElement={handleAddElement} // Handle adding elements if needed
        collapsedSections={collapsedSections}
        toggleSection={toggleSection}
      />
      
      <div className="form-builder-content">
        <header className="form-builder-header">
          <div className="header-title">
            <button className="back-button"  onClick = {()=>navigate('/dashboard/FormTemplates') }>
              <ArrowLeft size={20} />
            </button>
            <input
        type="text"
        className="form-title-input"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)} // Bind input to formTitle state
        placeholder="Enter form title"
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          border: 'none',
          borderBottom: '1px solid #ccc',
          outline: 'none',
          width: '80%',
        }}
      />
          </div>
          <div className="header-actions">
            <button className="btn" onClick = {()=>navigate('/dashboard/FormTemplates') }>Cancel</button>
            <button className="btn" onClick={saveForm}>Save</button>
         <button className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed" disabled>Publish</button> 
          </div>
        </header>

        <div className="form-builder-main">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="form-elements">
              {(provided, snapshot) => (
                <div 
                  className={`form-container ${snapshot.isDraggingOver ? 'dropping' : ''}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {formElements.map((element, index) => (
                    <Draggable
                      key={element.id}
                      draggableId={element.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="draggable-element"
                        >
                          <div className="element-drag-container">
                            <div {...provided.dragHandleProps} className="drag-handle">
                              <GripVertical size={20} />
                            </div>
                            <div className="element-content">
                              <FormElements
                                element={element}
                                isSelected={selectedElement === element.id}
                                setSelectedElement={setSelectedElement}
                                showActionMenu={showActionMenu}
                                setShowActionMenu={setShowActionMenu}
                                ActionMenu={ActionMenu}
                                onToggleRequired={toggleRequired}
                                onUpdateElement={updateElement}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default FormEditor;
