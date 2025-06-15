
export const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    requirements: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    }
  };
};

export const validateName = (name: string) => {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name.trim());
};

export const validateForm = (formData: any, type: 'signin' | 'signup') => {
  const newErrors: Record<string, string> = {};

  // Email validation
  if (!formData.email) {
    newErrors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    newErrors.email = 'Please enter a valid email address';
  }

  // Password validation
  if (!formData.password) {
    newErrors.password = 'Password is required';
  } else if (type === 'signup') {
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      const missingRequirements = [];
      if (!passwordValidation.requirements.minLength) missingRequirements.push('8+ characters');
      if (!passwordValidation.requirements.hasUpperCase) missingRequirements.push('uppercase letter');
      if (!passwordValidation.requirements.hasLowerCase) missingRequirements.push('lowercase letter');
      if (!passwordValidation.requirements.hasNumbers) missingRequirements.push('number');
      if (!passwordValidation.requirements.hasSpecialChar) missingRequirements.push('special character');
      
      newErrors.password = `Password must contain: ${missingRequirements.join(', ')}`;
    }
  }

  if (type === 'signup') {
    // Import validation here to avoid circular dependencies
    const { validateKenyanPhone } = require('@/utils/phoneValidation');
    
    // Full name validation
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (!validateName(formData.fullName)) {
      newErrors.fullName = 'Full name must be 2-50 characters, letters only';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Mandatory phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validateKenyanPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid Kenyan phone number (e.g., +254712345678, 0712345678)';
    }

    // User type validation
    if (!formData.userType) {
      newErrors.userType = 'Please select your role';
    }
  }

  return newErrors;
};
