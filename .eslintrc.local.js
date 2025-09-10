// Script para corrigir problemas TypeScript comuns
// Execute: npm run lint:fix

module.exports = {
  rules: {
    // Permitir 'any' em contextos específicos onde é necessário
    '@typescript-eslint/no-explicit-any': 'off',
    
    // Permitir variáveis não utilizadas que começam com _
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],
    
    // Permitir escape de caracteres em JSX
    'react/no-unescaped-entities': 'off',
    
    // Configurações específicas para desenvolvimento
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
  }
};
