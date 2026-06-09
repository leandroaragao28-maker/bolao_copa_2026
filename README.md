# ⚽ Bolão Copa 2026 — Guia de Implantação

## Arquitetura

```
GitHub Pages (HTML estático)               Google Apps Script (backend)
──────────────────────────────────         ──────────────────────────────
index.html        ← página inicial         Code.gs  ← toda a lógica
inscricao.html    ← inscrição + pix    ↔   (Web App publicado como API)
palpites.html     ← palpites
ranking.html      ← ranking público
minha-pontuacao.html ← pontuação pessoal
regulamento.html  ← regras do bolão
admin.html        ← painel do admin
style.css         ← estilos globais
config.js         ← configurações
```

**Banco de dados:** Google Sheets com 3 abas criadas automaticamente:
- `Participantes` — cadastro, status de pagamento e data de aprovação
- `Palpites` — palpites de cada participante por jogo
- `Resultados` — placares reais lançados pelo administrador

---

## PASSO 1 — Criar a Planilha Google Sheets

1. Acesse [sheets.google.com](https://sheets.google.com)
2. Crie uma nova planilha em branco
3. Renomeie para **"Bolão Copa 2026"**
4. Copie o **ID da planilha** da URL — é a sequência entre `/d/` e `/edit`:
   ```
   https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit
   ```
   > ⚠️ Copie **apenas o ID**, não a URL completa.

---

## PASSO 2 — Configurar o Google Apps Script

1. Acesse [script.google.com](https://script.google.com)
2. Clique em **"Novo projeto"**
3. Apague o código padrão e cole todo o conteúdo de `Code.gs`
4. Na linha 8, substitua pelo ID copiado no Passo 1:
   ```javascript
   const SPREADSHEET_ID = 'SEU_ID_AQUI';
   ```
5. Na linha 9, troque pela senha que o admin usará para acessar o painel:
   ```javascript
   const ADMIN_PASSWORD = 'sua_senha_segura';
   ```
6. Salve o projeto (Ctrl+S) e dê um nome (ex: "Bolão Copa 2026")

### Inicializar as abas da planilha
1. No menu superior do Apps Script, selecione a função `inicializarPlanilha`
2. Clique em **Executar**
3. Na primeira execução, o Google pedirá autorização — clique em **Autorizar** e siga os passos. Isso é normal e necessário para que o script acesse a planilha.
4. Confirme que as abas `Participantes`, `Palpites` e `Resultados` foram criadas na planilha.

### Publicar como Web App
1. Clique em **Implantar → Nova implantação**
2. Em "Tipo", selecione **Web App**
3. Configure:
   - **Execute como:** Eu (seu e-mail)
   - **Quem tem acesso:** Qualquer pessoa
4. Clique em **Implantar**
5. Copie a **URL do Web App** — formato:
   ```
   https://script.google.com/macros/s/SEU_ID_DEPLOYMENT/exec
   ```

> ⚠️ **Após qualquer alteração no `Code.gs`**, é necessário criar uma **nova implantação** (Implantar → Nova implantação) para que as mudanças entrem em vigor. Editar o código sem reimplantar não atualiza a API.

---

## PASSO 3 — Configurar o `config.js`

Abra `config.js` e preencha os campos obrigatórios:

```javascript
const CONFIG = {
  API_URL: 'COLE_A_URL_DO_WEB_APP_AQUI', // ← URL gerada no Passo 2
  VALOR_INSCRICAO: 50.00,
  PIX_CHAVE: 'SEU_CPF_OU_CHAVE_PIX',     // ← CPF, e-mail, telefone ou chave aleatória
  PIX_NOME: 'Seu Nome',                   // ← sem acentos, máximo 25 caracteres
  PIX_CIDADE: 'Sua Cidade',              // ← sem acentos, máximo 15 caracteres
};
```

**Sobre a chave Pix:**
- CPF pode ser informado com ou sem formatação: `123.456.789-09` ou `12345678909`
- O sistema remove pontos e traços automaticamente
- O QR Code é gerado via API externa ([gerarqrcodepix.com.br](https://gerarqrcodepix.com.br)), mais confiável que geração local

---

## PASSO 4 — Publicar no GitHub Pages

1. Crie um repositório no GitHub (pode ser público ou privado)
2. Faça upload de **todos** os arquivos:
   - `index.html`
   - `inscricao.html`
   - `palpites.html`
   - `ranking.html`
   - `minha-pontuacao.html`
   - `regulamento.html`
   - `admin.html`
   - `style.css`
   - `config.js`
3. Acesse **Settings → Pages**
4. Em **Source**, selecione a branch `main` e pasta `/ (root)`
5. Clique em **Save**
6. Em alguns minutos o site estará disponível em:
   ```
   https://seuusuario.github.io/nome-do-repositorio/
   ```

> A página inicial é `index.html`. Compartilhe o link raiz com os participantes.

---

## Fluxo de uso

### Para o participante
1. Acessa a página inicial (`index.html`) e clica em **"Quero participar"**
2. Preenche nome, e-mail e WhatsApp na tela de inscrição
3. Recebe um **código de participante** (ex: `BP123456`) — deve guardar este código
4. Realiza o pagamento de **R$ 50,00** via Pix usando o QR Code gerado
5. Pode preencher seus palpites imediatamente, mesmo antes da aprovação
6. Após o admin confirmar o pagamento, a pontuação passa a ser contabilizada no ranking
7. Acompanha sua pontuação jogo a jogo em **"Minha Pontuação"**

### Para o administrador
1. Acessa `admin.html` e faz login com a senha configurada
2. **Aba Participantes:** visualiza inscrições, confirma recebimentos no Pix e clica em **Aprovar**
3. **Aba Resultados:** após cada jogo, lança o placar real — o ranking atualiza automaticamente
4. **Aba Resumo:** visão geral da classificação, total arrecadado e premiação estimada

---

## Sistema de pontuação

A pontuação é baseada exclusivamente em acertar o **número de gols de cada time**, não apenas o resultado.

| Situação | Pontos |
|---|:---:|
| Acertou os gols dos dois times (placar exato) | **15** |
| Acertou os gols do time vencedor | **10** |
| Resultado real foi empate e acertou os gols de um dos times | **7,5** |
| Acertou os gols do time perdedor | **5** |
| Nenhum gol acertado | **0** |
| Jogo sem palpite registrado | — |

**Regra importante:** em empates, acertar que "seria empate" sem acertar nenhum placar individual vale **zero** pontos. Ex: resultado 1×1, palpite 2×2 = 0 pts.

**Pontuação máxima possível:** 72 jogos × 15 pts = **1.080 pontos**

### Critérios de desempate (em ordem)
1. Maior número de placares exatos (15 pts)
2. Maior número de acertos do vencedor (10 pts)
3. Maior número de acertos em empates (7,5 pts)
4. Maior número de acertos do perdedor (5 pts)
5. Maior número de palpites preenchidos
6. Data/hora de inscrição (quem se inscreveu primeiro)
7. Se ainda empatados: prêmio dividido igualmente

---

## Premiação

- 🥇 **1º lugar:** 60% do total arrecadado
- 🥈 **2º lugar:** 30% do total arrecadado
- 🛠 **Organização:** 10% do total arrecadado

| Participantes | Arrecadado | 🥇 1º lugar | 🥈 2º lugar |
|:---:|:---:|:---:|:---:|
| 10 | R$ 500 | R$ 300 | R$ 150 |
| 20 | R$ 1.000 | R$ 600 | R$ 300 |
| 30 | R$ 1.500 | R$ 900 | R$ 450 |
| 50 | R$ 2.500 | R$ 1.500 | R$ 750 |

---

## Travas de edição de palpites

- Palpites podem ser editados **a qualquer momento antes do início de cada jogo**
- Ao apitar o jogo, o campo trava automaticamente (ícone 🔒 no card)
- O sistema salva apenas os palpites de jogos ainda não iniciados
- Palpites de jogos já iniciados não são sobrescritos ao clicar em "Salvar"

---

## Dúvidas frequentes

**O QR Code não está aparecendo.**
O QR Code é gerado via API externa (gerarqrcodepix.com.br). Verifique se a chave Pix está configurada corretamente no `config.js`. O código copia-e-cola continua disponível mesmo sem o QR Code.

**O participante pode preencher palpites antes de pagar?**
Sim. Os palpites ficam salvos e passam a ser contabilizados automaticamente quando o admin aprovar o pagamento. Nenhuma ação adicional é necessária.

**Como o participante recupera o código de acesso?**
Na página inicial, clicando em "Esqueci meu código" e informando o e-mail cadastrado.

**Preciso reimplantar o Apps Script após cada alteração no código?**
Sim, sempre. No Apps Script: Implantar → Nova implantação. Editar o código sem reimplantar não atualiza a API em produção.

**Posso usar Firebase Hosting em vez de GitHub Pages?**
Sim, sem nenhuma alteração nos arquivos. Faça o deploy normalmente pelo Firebase CLI.

**O bolão cobre apenas a fase de grupos?**
Sim. São 72 jogos da fase de grupos (12 grupos × 6 jogos cada). Apenas o placar dos 90 minutos regulamentares é considerado — não há prorrogação ou pênaltis nessa fase.
