/**
 * Remove todos os caracteres não numéricos de uma string
 */
export const removeNonNumeric = (value: string): string => {
  return value.replace(/\D/g, "");
};

/**
 * Formata telefone no padrão PT-BR: XX XXXXX-XXXX ou XX XXXX-XXXX
 * Exemplo: 16991981104 -> 16 99198-1104
 * Exemplo: 1633334444 -> 16 3333-4444
 */
export const formatPhone = (value: string): string => {
  const numbers = removeNonNumeric(value);

  if (!numbers) {
    return "";
  }

  if (numbers.length <= 2) {
    return numbers;
  }

  if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }

  if (numbers.length <= 10) {
    // Telefone fixo: XX XXXX-XXXX
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }

  // Para celular com 11 dígitos: XX XXXXX-XXXX
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

/**
 * Retorna apenas os números do telefone formatado
 */
export const unformatPhone = (value: string): string => {
  return removeNonNumeric(value);
};
