import React, { useState } from 'react';
import { 
  MoreVertical, 
  ChevronDown,
  CircleDot,
  CheckSquare,
  Star,
  Upload,
  Link2,
  Calendar,
  Clock,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';

export const FormElements = ({ 
  element, 
  isSelected, 
  setSelectedElement,
  showActionMenu,
  setShowActionMenu,
  ActionMenu,
  onToggleRequired,
  onUpdateElement
}) => {
  // Add state for all input fields
  const [formState, setFormState] = useState({
    title: element.title || '',
    question: '',
    options: element.options || [],
    content: element.content || { title: '', description: '' },
    nameFields: element.nameFields || {
      firstName: false,
      middleName: false,
      lastName: false,
      suffix: false
    },
    nameValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: ''
    },
    phoneType: element.phoneType || 'mobile',
    placeholder: element.placeholder || '',
    required: element.required || false,
    rating: element.rating || 0,
    singleLineText: '',
    multiLineText: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: ''
    },
    imageUrl: '',
    imageAlt: '',
    imageCaption: '',
    url: '',
    uploadedFile: null,
    headerText: '',
    subheaderText: '',
    textContent: '',
    textAlignment: 'left',
    textSize: 'normal'
  });

  const [isEditingQuestion, setIsEditingQuestion] = useState(false);

  const updateFormState = (field, value) => {
    setFormState(prev => {
      const newState = { ...prev, [field]: value };
      onUpdateElement(element.id, { [field]: value });
      return newState;
    });
  };

  const updateNestedState = (parent, field, value) => {
    setFormState(prev => {
      const newState = {
        ...prev,
        [parent]: {
          ...prev[parent],
          [field]: value
        }
      };
      onUpdateElement(element.id, { [parent]: newState[parent] });
      return newState;
    });
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    setShowActionMenu(showActionMenu === element.id ? null : element.id);
  };

  const handleQuestionChange = (value) => {
    updateFormState('title', value);
  };

  const addOption = () => {
    const newOptions = [...(formState.options || []), `Option ${(formState.options || []).length + 1}`];
    updateFormState('options', newOptions);
  };

  const removeOption = (index) => {
    const newOptions = formState.options.filter((_, i) => i !== index);
    updateFormState('options', newOptions);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formState.options];
    newOptions[index] = value;
    updateFormState('options', newOptions);
  };

  const OptionsList = ({ type = 'radio' }) => (
    <div className="options-list">
      {(formState.options || []).map((option, index) => (
        <div key={index} className="option-item">
          {type === 'radio' ? (
            <CircleDot size={16} className="text-gray-400" />
          ) : (
            <CheckSquare size={16} className="text-gray-400" />
          )}
          <input
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            className="option-input"
            placeholder={`Option ${index + 1}`}
          />
          <button 
            className="remove-option"
            onClick={() => removeOption(index)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <div className="form-actions" style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Required
          <input
            type="checkbox"
            checked={formState.required}
            onChange={(e) => updateFormState('required', e.target.checked)}
            style={{ marginLeft: '4px' }}
          />
        </div>
        <button 
          className="add-option"
          onClick={addOption}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#f59e0b',
            color: 'white',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          Add Option
        </button>
      </div>
    </div>
  );

  const ElementWrapper = ({ children, type = element.type }) => (
    <div 
      className={`form-card ${isSelected ? 'selected' : ''}`}
      onClick={() => setSelectedElement(element.id)}
    >
      <div className="element-header">
        <input
          type="text"
          className="form-input"
          value={formState.title || ''}
          onChange={(e) => handleQuestionChange(e.target.value)}
          placeholder="Enter question..."
          style={{
            border: isSelected ? '1px solid #fc9a3b' : '1px solid transparent',
            borderRadius: '4px',
            padding: '4px 8px'
          }}
        />
        <button className="more-button" onClick={handleMoreClick}>
          <MoreVertical size={16} />
        </button>
        {showActionMenu === element.id && <ActionMenu element={element} />}
      </div>
      <div className="form-card-content">
        {children}
      </div>
    </div>
  );
  

  const RequiredToggle = () => (
    <div className="form-actions" style={{ 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        Required
        <input
          type="checkbox"
          checked={element.required}
          onChange={() => onToggleRequired(element.id)}
          style={{ marginLeft: '4px' }}
        />
      </div>
      {element.options && (
        <button 
          className="add-option"
          onClick={addOption}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#f59e0b',
            color: 'white',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          Add Option
        </button>
      )}
    </div>
  );
  

  switch (element.type) {
    case 'header':
      return (
        <ElementWrapper title="Header">
          <div className="form-field">
            <input
              type="text"
              className="form-input header-input"
              value={formState.headerText}
              onChange={(e) => updateFormState('headerText', e.target.value)}
              placeholder="Section Header"
            />
            <textarea
              className="form-textarea"
              value={formState.content.description}
              onChange={(e) => updateNestedState('content', 'description', e.target.value)}
              placeholder="Section Description"
            />
          </div>
        </ElementWrapper>
      );

    case 'subheader':
      return (
        <ElementWrapper title="Subheader">
          <div className="form-field">
            <input
              type="text"
              className="form-input subheader-input"
              value={formState.subheaderText}
              onChange={(e) => updateFormState('subheaderText', e.target.value)}
              placeholder="Subheader Text"
            />
          </div>
        </ElementWrapper>
      );

    case 'text':
      return (
        <ElementWrapper title="Text">
          <div className="form-field">
            <textarea
              className="form-textarea"
              value={formState.textContent}
              onChange={(e) => updateFormState('textContent', e.target.value)}
              placeholder="Add your text content here"
              rows={4}
            />
            <div className="text-controls">
              <select
                value={formState.textAlignment}
                onChange={(e) => updateFormState('textAlignment', e.target.value)}
                className="form-select"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
              <select
                value={formState.textSize}
                onChange={(e) => updateFormState('textSize', e.target.value)}
                className="form-select"
              >
                <option value="small">Small</option>
                <option value="normal">Normal</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </ElementWrapper>
      );

    case 'image':
      return (
        <ElementWrapper title="Image">
          <div className="form-field">
            <input
              type="text"
              className="form-input"
              value={formState.imageUrl}
              onChange={(e) => updateFormState('imageUrl', e.target.value)}
              placeholder="Image URL"
            />
            <input
              type="text"
              className="form-input"
              value={formState.imageAlt}
              onChange={(e) => updateFormState('imageAlt', e.target.value)}
              placeholder="Image Alt Text"
            />
            <input
              type="text"
              className="form-input"
              value={formState.imageCaption}
              onChange={(e) => updateFormState('imageCaption', e.target.value)}
              placeholder="Image Caption"
            />
            <select
              value={formState.imageAlignment}
              onChange={(e) => updateFormState('imageAlignment', e.target.value)}
              className="form-select"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </ElementWrapper>
      );

    case 'name':
      return (
        <ElementWrapper>
          <div className="name-field-container">
            <div className="name-field-options">
              {Object.entries(formState.nameFields).map(([field, enabled]) => (
                <div key={field} className="name-option">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => {
                      updateNestedState('nameFields', field, !enabled);
                    }}
                  />
                  <span>{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              ))}
            </div>
            <div className="name-inputs">
              {Object.entries(formState.nameFields).map(([field, enabled]) => 
                enabled && (
                  <input
                    key={field}
                    type="text"
                    placeholder={`${field.replace(/([A-Z])/g, ' $1').trim()}`}
                    className="form-input"
                    value={formState.nameValues[field]}
                    onChange={(e) => updateNestedState('nameValues', field, e.target.value)}
                  />
                )
              )}
            </div>
            <div className="form-actions" style={{ 
              display: 'flex',
              alignItems: 'center',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Required
                <input
                  type="checkbox"
                  checked={formState.required}
                  onChange={(e) => updateFormState('required', e.target.checked)}
                  style={{ marginLeft: '4px' }}
                />
              </div>
            </div>
          </div>
        </ElementWrapper>
      );

    case 'email':
      return (
        <ElementWrapper>
          <div className="form-field">
            <input
              type="email"
              className="form-input"
              value={formState.email}
              onChange={(e) => updateFormState('email', e.target.value)}
              placeholder="Email address"
            />
            <div className="form-actions" style={{ 
              display: 'flex',
              alignItems: 'center',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Required
                <input
                  type="checkbox"
                  checked={formState.required}
                  onChange={(e) => updateFormState('required', e.target.checked)}
                  style={{ marginLeft: '4px' }}
                />
              </div>
            </div>
          </div>
        </ElementWrapper>
      );

    case 'phone':
      return (
        <ElementWrapper>
          <div className="form-field">
            <div className="phone-field-container">
              <div className="phone-type">
                <label>Type</label>
                <div className="select-wrapper">
                  <select
                    className="form-select"
                    value={formState.phoneType}
                    onChange={(e) => updateFormState('phoneType', e.target.value)}
                  >
                    <option value="mobile">Mobile</option>
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                  </select>
                  <ChevronDown size={16} />
                </div>
              </div>
              <input
                type="tel"
                className="form-input"
                value={formState.phone}
                onChange={(e) => updateFormState('phone', e.target.value)}
                placeholder="Phone number"
              />
            </div>
            <div className="form-actions" style={{ 
              display: 'flex',
              alignItems: 'center',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Required
                <input
                  type="checkbox"
                  checked={formState.required}
                  onChange={(e) => updateFormState('required', e.target.checked)}
                  style={{ marginLeft: '4px' }}
                />
              </div>
            </div>
          </div>
        </ElementWrapper>
      );

    case 'address':
      return (
        <ElementWrapper>
          <div className="address-field">
            <div className="address-row">
              <div className="input-group">
                <label>Address Line 1</label>
                <input
                  type="text"
                  className="form-input"
                  value={formState.address.line1}
                  onChange={(e) => updateNestedState('address', 'line1', e.target.value)}
                />
              </div>
            </div>
            <div className="address-row">
              <div className="input-group">
                <label>Address Line 2</label>
                <input
                  type="text"
                  className="form-input"
                  value={formState.address.line2}
                  onChange={(e) => updateNestedState('address', 'line2', e.target.value)}
                />
              </div>
            </div>
            <div className="address-row three-cols">
              <div className="input-group">
                <label>City</label>
                <input
                  type="text"
                  className="form-input"
                  value={formState.address.city}
                  onChange={(e) => updateNestedState('address', 'city', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>State</label>
                <input
                  type="text"
                  className="form-input"
                  value={formState.address.state}
                  onChange={(e) => updateNestedState('address', 'state', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Zip/Postal Code</label>
                <input
                  type="text"
                  className="form-input"
                  value={formState.address.zip}
                  onChange={(e) => updateNestedState('address', 'zip', e.target.value)}
                />
              </div>
            </div>
            <div className="form-actions" style={{ 
              display: 'flex',
              alignItems: 'center',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Required
                <input
                  type="checkbox"
                  checked={formState.required}
                  onChange={(e) => updateFormState('required', e.target.checked)}
                  style={{ marginLeft: '4px' }}
                />
              </div>
            </div>
          </div>
        </ElementWrapper>
      );

    case 'radio':
      return (
        <ElementWrapper>
          <div className="form-field">
            <OptionsList type="radio" />
          </div>
        </ElementWrapper>
      );

    case 'multi':
      return (
        <ElementWrapper>
          <div className="form-field">
            <OptionsList type="checkbox" />
          </div>
        </ElementWrapper>
      );

    case 'dropdown':
      return (
        <ElementWrapper>
          <div className="form-field">
            <div className="select-wrapper">
              <select className="form-select">
                <option value="">Select an option</option>
                {formState.options?.map((option, index) => (
                  <option key={index}>{option}</option>
                ))}
              </select>
              <ChevronDown size={16} />
            </div>
            <div className="dropdown-options">
              <h4>Options</h4>
              <OptionsList type="radio" />
            </div>
          </div>
        </ElementWrapper>
      );

    case 'single-line':
      return (
        <ElementWrapper>
          <div className="form-field">
            <input
              type="text"
              className="form-input"
              value={formState.singleLineText}
              onChange={(e) => updateFormState('singleLineText', e.target.value)}
              placeholder="Single line text"
            />
            <div className="form-actions" style={{ 
              display: 'flex',
              alignItems: 'center',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Required
                <input
                  type="checkbox"
                  checked={formState.required}
                  onChange={(e) => updateFormState('required', e.target.checked)}
                  style={{ marginLeft: '4px' }}
                />
              </div>
            </div>
          </div>
        </ElementWrapper>
      );

    case 'multi-lines':
      return (
        <ElementWrapper>
          <div className="form-field">
            <textarea
              className="form-textarea"
              value={formState.multiLineText}
              onChange={(e) => updateFormState('multiLineText', e.target.value)}
              placeholder="Multi line text"
              rows={4}
            />
            <div className="form-actions" style={{ 
              display: 'flex',
              alignItems: 'center',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Required
                <input
                  type="checkbox"
                  checked={formState.required}
                  onChange={(e) => updateFormState('required', e.target.checked)}
                  style={{ marginLeft: '4px' }}
                />
              </div>
            </div>
          </div>
        </ElementWrapper>
      );

    case 'date':
      return (
        <ElementWrapper>
          <div className="form-field">
            <div className="date-input-container">
              <Calendar className="input-icon" size={16} />
              <input
                type="date"
                className="form-input"
                value={formState.date}
                onChange={(e) => updateFormState('date', e.target.value)}
              />
            </div>
            <div className="form-actions" style={{ 
              display: 'flex',
              alignItems: 'center',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Required
                <input
                  type="checkbox"
                  checked={formState.required}
                  onChange={(e) => updateFormState('required', e.target.checked)}
                  style={{ marginLeft: '4px' }}
                />
              </div>
            </div>
          </div>
        </ElementWrapper>
      );
      
      case 'time':
        return (
          <ElementWrapper>
            <div className="form-field">
              <div className="time-input-container">
                <Clock className="input-icon" size={16} />
                <input
                  type="time"
                  className="form-input"
                  value={formState.time}
                  onChange={(e) => updateFormState('time', e.target.value)}
                />
              </div>
              <div className="form-actions" style={{ 
                display: 'flex',
                alignItems: 'center',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Required
                  <input
                    type="checkbox"
                    checked={formState.required}
                    onChange={(e) => updateFormState('required', e.target.checked)}
                    style={{ marginLeft: '4px' }}
                  />
                </div>
              </div>
            </div>
          </ElementWrapper>
        );
  
      case 'rating':
        return (
          <ElementWrapper>
            <div className="form-field">
              <div className="rating-container">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    className={`rating-star ${value <= formState.rating ? 'active' : ''}`}
                    onClick={() => updateFormState('rating', value)}
                  >
                    <Star size={24} />
                  </button>
                ))}
              </div>
              <div className="form-actions" style={{ 
                display: 'flex',
                alignItems: 'center',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Required
                  <input
                    type="checkbox"
                    checked={formState.required}
                    onChange={(e) => updateFormState('required', e.target.checked)}
                    style={{ marginLeft: '4px' }}
                  />
                </div>
              </div>
            </div>
          </ElementWrapper>
        );
  
      case 'upload':
        return (
          <ElementWrapper>
            <div className="form-field">
              <div className="upload-container">
                <input
                  type="file"
                  className="file-input"
                  id={`upload-${element.id}`}
                  onChange={(e) => updateFormState('uploadedFile', e.target.files[0])}
                />
                <label htmlFor={`upload-${element.id}`} className="upload-button">
                  <Upload size={16} />
                  <span>Choose File</span>
                </label>
                <span className="file-name">
                  {formState.uploadedFile ? formState.uploadedFile.name : 'No file chosen'}
                </span>
              </div>
              <div className="form-actions" style={{ 
                display: 'flex',
                alignItems: 'center',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Required
                  <input
                    type="checkbox"
                    checked={formState.required}
                    onChange={(e) => updateFormState('required', e.target.checked)}
                    style={{ marginLeft: '4px' }}
                  />
                </div>
              </div>
            </div>
          </ElementWrapper>
        );
  
      case 'link':
        return (
          <ElementWrapper>
            <div className="form-field">
              <div className="link-input-container">
                <Link2 className="input-icon" size={16} />
                <input
                  type="url"
                  className="form-input"
                  value={formState.url}
                  onChange={(e) => updateFormState('url', e.target.value)}
                  placeholder="Enter URL"
                />
              </div>
              <div className="form-actions" style={{ 
                display: 'flex',
                alignItems: 'center',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Required
                  <input
                    type="checkbox"
                    checked={formState.required}
                    onChange={(e) => updateFormState('required', e.target.checked)}
                    style={{ marginLeft: '4px' }}
                  />
                </div>
              </div>
            </div>
          </ElementWrapper>
        );
  
      default:
        return null;
    }
  };
  
  export default FormElements;