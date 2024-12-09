export const getDefaultLabel = (type) => {
    switch (type) {
      case 'header': return 'Header';
      case 'subheader': return 'Subheader';
      case 'text': return 'Text';
      case 'name': return 'Name';
      case 'email': return 'Email Address';
      case 'phone': return 'Phone Number';
      case 'address': return 'Address';
      case 'single': return 'Single Choice';
      case 'multi': return 'Multiple Choice';
      case 'dropdown': return 'Dropdown';
      case 'single-line': return 'Single Line Text';
      case 'multi-line': return 'Multi Line Text';
      case 'date': return 'Date';
      case 'time': return 'Time';
      case 'rating': return 'Rating';
      case 'upload': return 'File Upload';
      case 'link': return 'Link';
      default: return 'Untitled';
    }
  };
  
  export const getDefaultPlaceholder = (type) => {
    switch (type) {
      case 'email': return 'Enter email address';
      case 'phone': return 'Enter phone number';
      case 'single-line': return 'Single line answer text';
      case 'multi-line': return 'Multi line answer text';
      case 'link': return 'Enter URL';
      default: return '';
    }
  };
  
  export const validateField = (type, value) => {
    switch (type) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'phone':
        return /^\+?[\d\s-]{10,}$/.test(value);
      default:
        return true;
    }
  };