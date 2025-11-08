import dayjs from "dayjs";

/**
 * Remove todos os caracteres não numéricos de uma string
 */
const removeNonNumeric = (value: string): string => {
  return value.replace(/\D/g, "");
};

/**
 * Formata data no padrão dd/mm/yyyy
 * Exemplo: 01012000 -> 01/01/2000
 */
export const formatDate = (value: string): string => {
  const numbers = removeNonNumeric(value);

  if (numbers.length <= 2) {
    return numbers;
  }

  if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  }

  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
};

/**
 * Converte string formatada (dd/mm/yyyy) para Date
 */
export const parseDateString = (value: string): Date | null => {
  const numbers = removeNonNumeric(value);

  if (numbers.length !== 8) {
    return null;
  }

  const day = parseInt(numbers.slice(0, 2), 10);
  const month = parseInt(numbers.slice(2, 4), 10) - 1; // month é 0-indexed
  const year = parseInt(numbers.slice(4, 8), 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return null;
  }

  const date = new Date(year, month, day);

  // Valida se a data é válida
  if (
    date.getDate() !== day ||
    date.getMonth() !== month ||
    date.getFullYear() !== year
  ) {
    return null;
  }

  return date;
};

/**
 * Formata Date para string dd/mm/yyyy
 */
export const formatDateToString = (date: Date | null | undefined): string => {
  if (!date) {
    return "";
  }

  return dayjs(date).format("DD/MM/YYYY");
};

/**
 * Retorna apenas os números da data formatada
 */
export const unformatDate = (value: string): string => {
  return removeNonNumeric(value);
};

