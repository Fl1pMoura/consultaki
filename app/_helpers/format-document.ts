/**
 * Remove todos os caracteres não numéricos de uma string
 */
const removeNonNumeric = (value: string): string => {
  return value.replace(/\D/g, "");
};

/**
 * Formata CPF: XXX.XXX.XXX-XX
 */
const formatCPF = (value: string): string => {
  const numbers = removeNonNumeric(value);

  if (numbers.length <= 3) {
    return numbers;
  }

  if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  }

  if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  }

  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

/**
 * Formata RG: XX.XXX.XXX-X
 */
const formatRG = (value: string): string => {
  const numbers = removeNonNumeric(value);

  if (numbers.length <= 2) {
    return numbers;
  }

  if (numbers.length <= 5) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  }

  if (numbers.length <= 8) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  }

  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}-${numbers.slice(8, 9)}`;
};

/**
 * Formata documento dinamicamente baseado no tamanho:
 * - Até 9 dígitos: RG (XX.XXX.XXX-X)
 * - 10 ou 11 dígitos: CPF (XXX.XXX.XXX-XX)
 */
export const formatDocument = (value: string): string => {
  const numbers = removeNonNumeric(value);

  // CPF tem 11 dígitos
  if (numbers.length >= 10) {
    return formatCPF(numbers);
  }

  // RG tem até 9 dígitos
  return formatRG(numbers);
};

/**
 * Retorna apenas os números do documento formatado
 */
export const unformatDocument = (value: string): string => {
  return removeNonNumeric(value);
};

