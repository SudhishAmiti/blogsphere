import { toast } from 'react-toastify';

export const handleApiError = (error) => {
  const defaultMessage = 'An error occurred. Please try again.';
  
  if (!error.data) {
    toast.error(defaultMessage);
    return;
  }
  
  if (typeof error.data === 'string') {
    toast.error(error.data);
    return;
  }
  
  if (error.data.detail) {
    toast.error(error.data.detail);
    return;
  }
  
  // Handle validation errors which are usually in the format { field: [error_messages] }
  const errorMessages = [];
  
  Object.entries(error.data).forEach(([field, messages]) => {
    if (Array.isArray(messages)) {
      messages.forEach((message) => {
        errorMessages.push(`${field}: ${message}`);
      });
    } else if (typeof messages === 'string') {
      errorMessages.push(`${field}: ${messages}`);
    }
  });
  
  if (errorMessages.length > 0) {
    errorMessages.forEach((message) => {
      toast.error(message);
    });
  } else {
    toast.error(defaultMessage);
  }
};