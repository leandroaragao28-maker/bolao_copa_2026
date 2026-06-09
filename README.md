# ⚽ Bolão Copa 2026 — Guia de Implantação

## Arquitetura

```
GitHub Pages (HTML estático)          Google Apps Script (backend)
─────────────────────────────         ──────────────────────────────
index.html    ← inscrição             Code.gs  ← toda a lógica
palpites.html ← palpites         ↔   (Web App publicado como API)
ranking.html  ← ranking público
admin.html    ← painel admin
style.css
config.js
```

**Banco de dados:** Google Sheets com 3 abas:
- `Participantes` — cadastro + status de pagamento
- `Palpites` — palpites de cada participante
- `Resultados` — placares reais lançados pelo admin

---

## PASSO 1 — Criar a Planilha Google Sheets

1. Acesse [sheets.google.com](https://sheets.google.com)
2. Crie uma nova planilha em branco
3. Renomeie para **"Bolão Copa 2026"**
4. Copie o **ID da planilha** da URL:
   `https://docs.google.com/spreadsheets/d/**SEU_ID_AQUI**/edit`

---

## PASSO 2 — Configurar o Google Apps Script

1. Acesse [script.google.com](https://script.google.com)
2. Clique em **"Novo projeto"**
3. Apague o código padrão e cole todo o conteúdo de `Code.gs`
4. **Substitua** na linha 8:
   ```javascript
   const SPREADSHEET_ID = 'COLE_SEU_ID_AQUI';
   ```
5. **Opcionalmente**, troque a senha admin (linha 9):
   ```javascript
   const ADMIN_PASSWORD = 'sua_senha_aqui';
   ```
6. Salve o projeto (Ctrl+S) e dê um nome (ex: "Bolão Copa 2026")

### Inicializar as abas da planilha:
1. No menu do Apps Script, selecione a função `inicializarPlanilha`
2. Clique em **Executar**
3. Autorize o acesso à planilha quando solicitado

### Publicar como Web App:
1. Clique em **Implantar → Nova implantação**
2. Tipo: **Web App**
3. Configurar:
   - Execute como: **Eu (seu e-mail)**
   - Quem tem acesso: **Qualquer pessoa**
4. Clique em **Implantar**
5. Copie a **URL do Web App** (formato: `https://script.google.com/macros/s/.../exec`)

---

## PASSO 3 — Configurar os arquivos HTML

Abra `config.js` e preencha:

```javascript
const CONFIG = {
  API_URL: 'COLE_A_URL_DO_WEB_APP_AQUI',  // ← passo 2
  PIX_CHAVE: 'seu.email@gmail.com',        // ← sua chave Pix
  PIX_NOME: 'SS&B Construtora',
  PIX_CIDADE: 'Caucaia',
};
```

---

## PASSO 4 — Publicar no GitHub Pages

1. Crie um repositório no GitHub (pode ser privado)
2. Suba todos os arquivos da pasta `bolao-copa-2026/`:
   - `index.html`
   - `palpites.html`
   - `ranking.html`
   - `admin.html`
   - `style.css`
   - `config.js`
3. Acesse **Settings → Pages**
4. Em **Source**, selecione a branch `main` e pasta `/root`
5. Clique em **Save**
6. Em alguns minutos, seu site estará em: `https://seuusuario.github.io/nome-do-repo/`

---

## Fluxo de uso

### Para o participante:
1. Acessa `index.html` → preenche nome, e-mail, WhatsApp
2. Recebe QR Code Pix para pagamento de R$ 50,00
3. Guarda o código de participante (ex: **BP123456**)
4. Aguarda confirmação via WhatsApp
5. Após aprovação, acessa `palpites.html` com o código
6. Preenche o placar dos 72 jogos e salva

### Para o administrador:
1. Acessa `admin.html`
2. Faz login com a senha configurada
3. **Aba Participantes:** aprova pagamentos conforme recebe no Pix
4. **Aba Resultados:** lança o placar real após cada jogo
5. **Aba Resumo:** acompanha o andamento geral

---

## Pontuação

| Situação | Pontos |
|---|---|
| Placar exato (ex: 2×1 e foi 2×1) | **15 pts** |
| Acertou o vencedor (mas não o placar) | **10 pts** |
| Acertou o empate (mas não o placar) | **7,5 pts** |
| Acertou o placar de um dos times | **5 pts** |

---

## Premiação

- 🥇 Campeão: **60%** do total arrecadado
- 🥈 Vice-campeão: **30%** do total arrecadado
- 🛠 Organização: **10%** do total arrecadado

*Exemplo: 20 participantes × R$ 50 = R$ 1.000 → Campeão leva R$ 600*

---

## Dúvidas frequentes

**O QR Code Pix funciona automaticamente?**
O QR Code é gerado localmente no navegador do participante (Pix estático). O pagamento vai direto para sua conta. A confirmação é manual pelo admin na aba "Participantes".

**Posso mudar os palpites?**
Sim, até o início do primeiro jogo. Ao salvar novamente, os palpites anteriores são substituídos.

**E se o Apps Script pedir autorização?**
Na primeira execução, o Google solicita que você autorize o acesso à planilha. Clique em "Autorizar" e siga os passos — é normal.

**Posso usar com Firebase em vez de GitHub Pages?**
Sim. Faça o deploy dos mesmos arquivos HTML no Firebase Hosting — nenhuma mudança de código necessária.
