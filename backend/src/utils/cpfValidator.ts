/**
 * Utility functions to sanitize, format, and mathematically validate Brazilian CPF numbers.
 * Adheres to single-responsibility principle (Clean Code).
 */

export const cleanCPF = (cpf: string): string => {
  if (!cpf) return '';
  return cpf.replace(/\D/g, '');
};

export const formatCPF = (cpf: string): string => {
  const cleaned = cleanCPF(cpf);
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export interface CPFValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Validates a Brazilian CPF using standard modulo 11 checksum algorithm.
 */
export const isValidCPF = (cpf: string): boolean => {
  const result = validateCPFDetailed(cpf);
  return result.isValid;
};

/**
 * Validates a Brazilian CPF with detailed diagnostics.
 */
export const validateCPFDetailed = (cpf: string): CPFValidationResult => {
  if (!cpf || typeof cpf !== 'string') {
    return { isValid: false, errorMessage: 'CPF number is required.' };
  }

  const cleaned = cleanCPF(cpf);

  // Must be exactly 11 numeric digits
  if (cleaned.length !== 11) {
    return {
      isValid: false,
      errorMessage: `CPF must contain exactly 11 digits (provided ${cleaned.length}).`,
    };
  }

  // Reject sequences with all identical digits (e.g., 000.000.000-00, 111.111.111-11, etc.)
  if (/^(\d)\1{10}$/.test(cleaned)) {
    return {
      isValid: false,
      errorMessage: 'Invalid CPF: repetitive sequence of identical digits is prohibited.',
    };
  }

  // Validate 1st verification digit (modulo 11)
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i), 10) * (10 - i);
  }
  let firstRemainder = (sum * 10) % 11;
  if (firstRemainder === 10 || firstRemainder === 11) {
    firstRemainder = 0;
  }
  if (firstRemainder !== parseInt(cleaned.charAt(9), 10)) {
    return {
      isValid: false,
      errorMessage: 'Invalid CPF: first verification check digit mismatch.',
    };
  }

  // Validate 2nd verification digit (modulo 11)
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i), 10) * (11 - i);
  }
  let secondRemainder = (sum * 10) % 11;
  if (secondRemainder === 10 || secondRemainder === 11) {
    secondRemainder = 0;
  }
  if (secondRemainder !== parseInt(cleaned.charAt(10), 10)) {
    return {
      isValid: false,
      errorMessage: 'Invalid CPF: second verification check digit mismatch.',
    };
  }

  return { isValid: true };
};
