/**
 * Função auxiliar para obter o caminho correto para recursos
 * Isso garante que os recursos funcionem tanto localmente quanto no GitHub Pages
 */
export const getAssetPath = (path) => {
  return `${process.env.PUBLIC_URL}${path}`;
};