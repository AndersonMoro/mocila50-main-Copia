// Configuração para diferentes ambientes
const isGitHubPages = window.location.hostname.includes('github.io');

const config = {
  // Base URL para recursos
  publicUrl: isGitHubPages ? '/arm-mochila' : '',
  
  // Configurações de rota
  routePrefix: isGitHubPages ? '#' : '',
  
  // Outras configurações específicas do ambiente
  isProduction: process.env.NODE_ENV === 'production',
  isGitHubPages: isGitHubPages
};

export default config;