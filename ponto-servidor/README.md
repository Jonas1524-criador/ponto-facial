# Ponto Facial com Servidor

Esta versão salva os dados na nuvem, então qualquer celular consegue ver os mesmos funcionários e relatórios.

## Como publicar o servidor (grátis)

### Opção recomendada: Render.com

1. Crie conta em https://render.com
2. Clique em **New +** → **Web Service**
3. Conecte seu repositório GitHub (ou faça upload dos arquivos)
4. Configurações:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Clique em **Create Web Service**
6. Espere o deploy. No final aparece uma URL tipo:
   `https://ponto-facial-xxxx.onrender.com`

### Depois de publicar

No arquivo `public/index.html`, procure a linha:

```javascript
const API = 'https://SEU-SERVIDOR.onrender.com';
```

Troque pela URL real do seu servidor no Render e faça commit.

## Estrutura

- `server.js` → backend
- `package.json` → dependências
- `public/index.html` → frontend (hospede no GitHub Pages ou no próprio Render)

## Funcionalidades

- Cadastro facial de funcionários
- Bater ponto com GPS
- Fila offline (salva local e envia quando voltar a internet)
- Admin com senha
- Cartão de ponto e relatório por funcionário
- Dados compartilhados entre todos os celulares
