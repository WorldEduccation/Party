# 📦 Guia Completo de Deploy do PartyLink no Vercel

## 🚀 Pré-requisitos

1. **Conta no GitHub**
   - Acesse: https://github.com
   - Crie uma conta gratuita

2. **Conta no Vercel**
   - Acesse: https://vercel.com
   - Faça login com sua conta GitHub

3. **Firebase Console**
   - Acesse: https://console.firebase.google.com
   - Configure seu projeto Firebase

## 📋 Passo a Passo para Deploy

### 1️⃣ Preparar o Projeto Firebase

1. **Acesse o Firebase Console**: https://console.firebase.google.com
2. **Crie um novo projeto**:
   - Nome do projeto: `partylink-app`
   - Desabilite Google Analytics (opcional)
3. **Configure Authentication**:
   - Vá em `Authentication > Sign-in method`
   - Habilite `Google` como provedor
   - Clique em `Save`
4. **Configure domínios autorizados**:
   - Em `Authentication > Settings > Authorized domains`
   - Adicione: `localhost`, `your-app.vercel.app` (substitua pelo seu domínio)
5. **Pegue as configurações**:
   - Vá em `Project Settings > General`
   - Na seção "Your apps", clique no ícone web `</>`
   - Copie os valores de `apiKey`, `projectId`, e `appId`

### 2️⃣ Subir Código para o GitHub

1. **Criar repositório no GitHub**:
   ```bash
   # No seu terminal local
   git init
   git add .
   git commit -m "Initial PartyLink commit"
   ```

2. **Conectar com GitHub**:
   - Crie um novo repositório no GitHub
   - Nome sugerido: `partylink-app`
   - Público ou privado (sua escolha)

3. **Push para GitHub**:
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/partylink-app.git
   git branch -M main
   git push -u origin main
   ```

### 3️⃣ Deploy no Vercel

1. **Acessar Vercel Dashboard**:
   - Vá para: https://vercel.com/dashboard
   - Clique em `New Project`

2. **Importar do GitHub**:
   - Selecione seu repositório `partylink-app`
   - Clique em `Import`

3. **Configurar Environment Variables**:
   - Na seção "Environment Variables", adicione:
   ```
   VITE_FIREBASE_API_KEY=sua_api_key_aqui
   VITE_FIREBASE_PROJECT_ID=seu_project_id_aqui
   VITE_FIREBASE_APP_ID=seu_app_id_aqui
   NODE_ENV=production
   ```

4. **Configurações de Build**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Deploy**:
   - Clique em `Deploy`
   - Aguarde o processo de build (2-3 minutos)

### 4️⃣ Configurar Domínio Firebase

1. **Voltar ao Firebase Console**
2. **Atualizar domínios autorizados**:
   - Pegue sua URL do Vercel (ex: `https://partylink-app-abc123.vercel.app`)
   - Adicione em `Authentication > Settings > Authorized domains`

### 5️⃣ Configurar Domínio Personalizado (Opcional)

**Opção 1: Vercel Pro (Pago)**
- No dashboard Vercel, vá em `Domains`
- Adicione seu domínio personalizado

**Opção 2: Domínio Gratuito**
1. **Freenom** (domínios .tk, .ml, .ga, .cf):
   - Acesse: https://freenom.com
   - Registre um domínio gratuito
   - Configure os nameservers para Vercel

2. **GitHub Pages + Cloudflare** (alternativa):
   - Use GitHub Pages com domínio personalizado
   - Configure Cloudflare para SSL

## 🔧 Arquivos de Configuração Incluídos

### `vercel.json`
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "functions": {
    "server/index.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🎯 URLs Importantes

- **Seu App**: `https://seu-app.vercel.app`
- **Firebase Console**: https://console.firebase.google.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/seu-usuario/partylink-app

## 🛠️ Solução de Problemas

### Erro de Build
- Verifique se todas as environment variables estão configuradas
- Confirme que o Firebase está configurado corretamente

### Erro de Authentication
- Verifique se o domínio está nos "Authorized domains" do Firebase
- Confirme as environment variables do Firebase

### Erro 404 nas Rotas
- Verifique se o `vercel.json` está configurado corretamente
- Confirme se as rotas estão funcionando localmente

## 🎉 Pronto!

Seu PartyLink estará disponível em:
`https://seu-app.vercel.app`

**Features funcionando**:
✅ Autenticação Google via Firebase
✅ Upload e visualização de vídeos
✅ Sistema de filtros
✅ Tema claro/escuro
✅ Design responsivo
✅ Integração Telegram

## 💡 Próximos Passos

1. **Customizar domínio**
2. **Adicionar analytics**
3. **Configurar banco de dados persistente**
4. **Implementar notificações**
5. **Adicionar mais recursos sociais**