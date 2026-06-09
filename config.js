// config.js — Configuração compartilhada do Bolão Copa 2026
// ⚠️ Substitua a URL abaixo pela URL do seu Web App do Google Apps Script

const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbyZEHNn7NmtJk1IMUfiKSVbpMcTie2ZrIG2cygqj6I_MhBWdZjtR8gJibIRL4AMn-FsRg/exec',
  BOLAO_NOME: 'Bolão da Copa 2026',
  VALOR_INSCRICAO: 50.00,
  PIX_CHAVE: '76889726391',      // ← CPF sem pontos e traço: ex: 12345678901
  PIX_NOME: 'Bolão Copa 2026',    // ← nome do beneficiário (sem acentos, max 25 chars)
  PIX_CIDADE: 'Tabuleiro do Norte',          // ← cidade (sem acentos, max 15 chars)
};

// ── Bandeiras por sigla ─────────────────────────────────────
const BANDEIRAS = {
  MEX:'🇲🇽', AFS:'🇿🇦', COR:'🇰🇷', TCH:'🇨🇿', CAN:'🇨🇦', BOS:'🇧🇦',
  QAT:'🇶🇦', SUI:'🇨🇭', BRA:'🇧🇷', MAR:'🇲🇦', HAI:'🇭🇹', ESC:'🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  EUA:'🇺🇸', PAR:'🇵🇾', AUS:'🇦🇺', TUR:'🇹🇷', ALE:'🇩🇪', CUR:'🇨🇼',
  CDM:'🇨🇩', EQU:'🇪🇨', HOL:'🇳🇱', JAP:'🇯🇵', SUE:'🇸🇪', TUN:'🇹🇳',
  BEL:'🇧🇪', EGI:'🇪🇬', IRA:'🇮🇷', NZE:'🇳🇿', ESP:'🇪🇸', CAB:'🇨🇻',
  ARS:'🇦🇷', URU:'🇺🇾', FRA:'🇫🇷', SEN:'🇸🇳', IRQ:'🇮🇶', NOR:'🇳🇴',
  ARG:'🇦🇷', AGL:'🇦🇴', AUT:'🇦🇹', JOR:'🇯🇴', POR:'🇵🇹', RDC:'🇨🇩',
  UZB:'🇺🇿', COL:'🇨🇴', ING:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', CRO:'🇭🇷', GAN:'🇬🇭', PAN:'🇵🇦',
};

// ── Nomes por sigla ─────────────────────────────────────────
const NOMES = {
  MEX:'México', AFS:'África do Sul', COR:'Coreia do Sul', TCH:'República Tcheca',
  CAN:'Canadá', BOS:'Bósnia', QAT:'Catar', SUI:'Suíça', BRA:'Brasil',
  MAR:'Marrocos', HAI:'Haiti', ESC:'Escócia', EUA:'EUA', PAR:'Paraguai',
  AUS:'Austrália', TUR:'Turquia', ALE:'Alemanha', CUR:'Curaçao', CDM:'Congo',
  EQU:'Equador', HOL:'Holanda', JAP:'Japão', SUE:'Suécia', TUN:'Tunísia',
  BEL:'Bélgica', EGI:'Egito', IRA:'Irã', NZE:'Nova Zelândia', ESP:'Espanha',
  CAB:'Cabo Verde', ARS:'Argentina', URU:'Uruguai', FRA:'França', SEN:'Senegal',
  IRQ:'Iraque', NOR:'Noruega', ARG:'Argentina', AGL:'Angola', AUT:'Áustria',
  JOR:'Jordânia', POR:'Portugal', RDC:'Rep. D. Congo', UZB:'Uzbequistão',
  COL:'Colômbia', ING:'Inglaterra', CRO:'Croácia', GAN:'Gana', PAN:'Panamá',
};

// ── Loading overlay ─────────────────────────────────────────
let _loadingCount = 0;
function _mostrarLoading() {
  if (++_loadingCount === 1) {
    let el = document.getElementById('loading-overlay');
    if (!el) {
      el = document.createElement('div');
      el.id = 'loading-overlay';
      el.innerHTML = '<div class="loading-spinner"></div><span class="loading-texto">Carregando…</span>';
      document.body.appendChild(el);
    }
    el.classList.add('visivel');
  }
}
function _esconderLoading() {
  if (--_loadingCount <= 0) {
    _loadingCount = 0;
    const el = document.getElementById('loading-overlay');
    if (el) el.classList.remove('visivel');
  }
}

// ── API helper ──────────────────────────────────────────────
async function api(body) {
  _mostrarLoading();
  try {
    const r = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify(body),
      redirect: 'follow'
    });
    return await r.json();
  } finally {
    _esconderLoading();
  }
}

// ── Formatar data ───────────────────────────────────────────
function formatarData(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// ── Toast ───────────────────────────────────────────────────
function toast(msg, tipo = 'info') {
  const t = document.createElement('div');
  t.className = 'toast toast-' + tipo;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3500);
}

// ── Gerar payload Pix Copia-e-Cola (EMV estático) ──────────
// Compatível com chave CPF, CNPJ, e-mail, telefone e chave aleatória
function gerarPixCopiaECola(chave, nome, cidade, valor, txid) {
  // Remove formatação de CPF/CNPJ (pontos, traços, barras)
  chave = chave.replace(/[.\-\/]/g, '').trim();

  function campo(id, val) {
    const len = String(val.length).padStart(2, '0');
    return id + len + val;
  }

  function crc16(str) {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  }

  // ID 26 — Merchant Account Information (padrão BCB/PIX)
  const gui             = campo('00', 'BR.GOV.BCB.PIX');
  const pixKey          = campo('01', chave);
  const merchantAccInfo = campo('26', gui + pixKey);

  // ID 62 — Additional Data Field (txid: apenas alfanumérico, max 25 chars)
  const txidLimpo = txid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 25);
  const addData   = campo('62', campo('05', txidLimpo));

  // Nome e cidade sem acentos (exigência BCB para compatibilidade)
  const nomeLimpo   = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 25);
  const cidadeLimpa = cidade.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 15);

  let payload =
    campo('00', '01')          +   // Payload format indicator
    merchantAccInfo            +   // Chave Pix
    campo('52', '0000')        +   // Merchant category code
    campo('53', '986')         +   // Moeda BRL
    campo('54', valor.toFixed(2)) + // Valor
    campo('58', 'BR')          +   // País
    campo('59', nomeLimpo)     +   // Nome do recebedor
    campo('60', cidadeLimpa)   +   // Cidade
    addData                    +   // TxID
    '6304';                        // CRC placeholder

  return payload + crc16(payload);
}
