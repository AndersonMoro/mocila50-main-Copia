/**
 * Capitaliza a primeira letra de uma string
 * @param {string} string - A string a ser capitalizada
 * @returns {string} A string com a primeira letra maiúscula
 */
export function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}