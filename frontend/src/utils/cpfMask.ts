/**
 * Formats raw string or numbers into Brazilian standard CPF mask: 000.000.000-00
 */
export const applyCpfMask = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '').slice(0, 11);

  if (digitsOnly.length <= 3) {
    return digitsOnly;
  }
  if (digitsOnly.length <= 6) {
    return `${digitsOnly.slice(0, 3)}.${digitsOnly.slice(3)}`;
  }
  if (digitsOnly.length <= 9) {
    return `${digitsOnly.slice(0, 3)}.${digitsOnly.slice(3, 6)}.${digitsOnly.slice(6)}`;
  }
  return `${digitsOnly.slice(0, 3)}.${digitsOnly.slice(3, 6)}.${digitsOnly.slice(6, 9)}-${digitsOnly.slice(9, 11)}`;
};

/**
 * Strips all non-digit characters from a CPF string.
 */
export const cleanCpf = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};

/**
 * Validates Brazilian CPF checksum locally on the client.
 */
export const isValidCpf = (cpf: string): boolean => {
  const cleaned = cleanCpf(cpf);

  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i), 10) * (10 - i);
  }
  let firstRemainder = (sum * 10) % 11;
  if (firstRemainder === 10 || firstRemainder === 11) firstRemainder = 0;
  if (firstRemainder !== parseInt(cleaned.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i), 10) * (11 - i);
  }
  let secondRemainder = (sum * 10) % 11;
  if (secondRemainder === 10 || secondRemainder === 11) secondRemainder = 0;
  if (secondRemainder !== parseInt(cleaned.charAt(10), 10)) return false;

  return true;
};
