import React from 'react';
import { 
  Type, 
  ImageIcon, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Plus,
  Circle,
  CircleDot,
  ChevronDown,
  AlignLeft,
  Calendar,
  Clock,
  Star,
  Upload,
  Link as LinkIcon,
  ChevronUp
} from 'lucide-react';

export const Sidebar = ({ onAddElement, collapsedSections = {}, toggleSection }) => {
  // Add default values to prevent undefined errors
  const handleSectionToggle = (sectionName) => {
    if (toggleSection) {
      toggleSection(sectionName);
    }
  };

  const inputTypes = [
    { icon: Type, label: 'Header', type: 'header' },
    { icon: Type, label: 'Subheader', type: 'subheader' },
    { icon: AlignLeft, label: 'Text', type: 'text' },
    { icon: ImageIcon, label: 'Image', type: 'image' },
  ];

  const contactFields = [
    { icon: User, label: 'Name', type: 'name' },
    { icon: Mail, label: 'Email', type: 'email' },
    { icon: Phone, label: 'Phone', type: 'phone' },
    { icon: MapPin, label: 'Address', type: 'address' },
    { icon: Plus, label: 'Add All', type: 'add-all' },
  ];

  const fieldTypes = [
    { icon: CircleDot, label: 'Single', type: 'single' },
    { icon: Circle, label: 'Multi', type: 'multi' },
    { icon: ChevronDown, label: 'Dropdown', type: 'dropdown' },
    { icon: AlignLeft, label: 'Single Lines', type: 'single-line' },
    { icon: AlignLeft, label: 'Multi Lines', type: 'multi-lines' },
    { icon: Calendar, label: 'Date', type: 'date' },
    { icon: Clock, label: 'Time', type: 'time' },
    { icon: Star, label: 'Rating', type: 'rating' },
    { icon: Upload, label: 'Upload', type: 'upload' },
    { icon: LinkIcon, label: 'Link', type: 'link' },
  ];

  const renderFieldButton = ({ icon: Icon, label, type }) => (
    <button
      key={type}
      className="field-button"
      onClick={() => onAddElement && onAddElement(type)}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <div 
          className="section-header"
          onClick={() => handleSectionToggle('input')}
        >
          <span>Input</span>
          {collapsedSections.input ? 
            <ChevronDown size={20} /> : 
            <ChevronUp size={20} />
          }
        </div>
        {!collapsedSections.input && (
          <div className="field-grid">
            {inputTypes.map(renderFieldButton)}
          </div>
        )}
      </div>

      <div className="sidebar-section">
        <div 
          className="section-header"
          onClick={() => handleSectionToggle('contact')}
        >
          <span>Contact Field Types</span>
          {collapsedSections.contact ? 
            <ChevronDown size={20} /> : 
            <ChevronUp size={20} />
          }
        </div>
        {!collapsedSections.contact && (
          <div className="field-grid">
            {contactFields.map(renderFieldButton)}
          </div>
        )}
      </div>

      <div className="sidebar-section">
        <div 
          className="section-header"
          onClick={() => handleSectionToggle('field')}
        >
          <span>Field Types</span>
          {collapsedSections.field ? 
            <ChevronDown size={20} /> : 
            <ChevronUp size={20} />
          }
        </div>
        {!collapsedSections.field && (
          <div className="field-grid">
            {fieldTypes.map(renderFieldButton)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;