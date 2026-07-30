const normalizeWhitespace = (value) => value.replace(/\s+/g, " ").trim();

export const validateCheckoutForm = (values = {}) => {
  const sanitizedValues = {
    country: normalizeWhitespace(values.country || ""),
    address: normalizeWhitespace(values.address || ""),
    phoneNumber: normalizeWhitespace(values.phoneNumber || ""),
  };

  const errors = {};

  if (!sanitizedValues.country) {
    errors.country = "Country is required.";
  } else if (!/^[A-Za-z ]{2,50}$/.test(sanitizedValues.country)) {
    errors.country = "Country must contain only letters and spaces (2-50 characters).";
  }

  if (!sanitizedValues.address) {
    errors.address = "Address is required.";
  } else if (sanitizedValues.address.length < 10) {
    errors.address = "Address must be at least 10 characters long.";
  } else if (!/\s/.test(sanitizedValues.address) || /^\d+$/.test(sanitizedValues.address)) {
    errors.address = "Address must be more than a single word and cannot be only numbers.";
  }

  if (!sanitizedValues.phoneNumber) {
    errors.phoneNumber = "Phone number is required.";
  } else if (!/^[0-9]{11}$/.test(sanitizedValues.phoneNumber)) {
    errors.phoneNumber = "Phone number must contain exactly 11 digits.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedValues,
  };
};
