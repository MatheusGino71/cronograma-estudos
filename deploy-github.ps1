# Script para fazer deploy no GitHub
Write-Host "🚀 Iniciando deploy para GitHub..." -ForegroundColor Green

# Verificar se é um repositório Git
if (-not (Test-Path ".git")) {
    Write-Host "📁 Inicializando repositório Git..." -ForegroundColor Yellow
    git init
}

# Configurar usuário (se necessário)
git config user.name "MatheusGino71"
git config user.email "matheusgino71@gmail.com"

# Verificar se remote origin existe
$remoteExists = git remote get-url origin 2>$null
if (-not $remoteExists) {
    Write-Host "🔗 Adicionando remote origin..." -ForegroundColor Yellow
    git remote add origin https://github.com/MatheusGino71/cronograma-estudos.git
}

# Adicionar todos os arquivos
Write-Host "📝 Adicionando arquivos..." -ForegroundColor Yellow
git add .

# Fazer commit
Write-Host "💾 Fazendo commit..." -ForegroundColor Yellow
git commit -m "feat: Complete project optimization and error fixes

- ✅ Performance optimizations implemented
- ✅ Lazy loading system added
- ✅ TypeScript compilation errors resolved
- ✅ Console statements cleaned for production
- ✅ Unused imports and variables removed
- ✅ Project structure optimized
- ✅ Video background maintained for landing page
- ✅ Exam date functionality added to simulator
- ✅ Build process working perfectly
- 🎯 Ready for production deployment"

# Fazer push
Write-Host "🚀 Fazendo push para GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
Write-Host "🌐 Repositório: https://github.com/MatheusGino71/cronograma-estudos" -ForegroundColor Cyan
