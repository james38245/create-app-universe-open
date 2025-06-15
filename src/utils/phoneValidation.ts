
export const validateKenyanPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\s+/g, '');
  const kenyanPhoneRegex = /^(\+254|254|0)?([17]\d{8})$/;
  return kenyanPhoneRegex.test(cleanPhone);
};

export const formatKenyanPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.startsWith('0')) {
    return '+254' + cleanPhone.substring(1);
  } else if (cleanPhone.startsWith('254')) {
    return '+' + cleanPhone;
  } else if (cleanPhone.startsWith('+254')) {
    return cleanPhone;
  }
  
  // Assume it's a local number without country code
  if (cleanPhone.length === 9 && (cleanPhone.startsWith('7') || cleanPhone.startsWith('1'))) {
    return '+254' + cleanPhone;
  }
  
  return phone; // Return original if format is unclear
};

export const isValidKenyanOperator = (phone: string): boolean => {
  const formatted = formatKenyanPhone(phone);
  const number = formatted.replace('+254', '');
  
  // Safaricom: 7xx xxx xxx (70x, 71x, 72x, 74x, 75x, 76x, 79x)
  // Airtel: 7xx xxx xxx (73x, 78x)
  // Telkom: 7xx xxx xxx (77x)
  // Equitel: 7xx xxx xxx (76x)
  const validPrefixes = ['70', '71', '72', '73', '74', '75', '76', '77', '78', '79'];
  
  return validPrefixes.some(prefix => number.startsWith(prefix));
};
