// ============================================================
// BOLÃO DA COPA 2026 — Google Apps Script Backend
// ============================================================
// Instruções:
// 1. Abra script.google.com
// 2. Crie um novo projeto e cole este código
// 3. Substitua SPREADSHEET_ID pelo ID da sua planilha
// 4. Faça o deploy como Web App (Execute as: Me, Who has access: Anyone)
// 5. Copie a URL do Web App e cole em config.js nos arquivos HTML
// ============================================================

const SPREADSHEET_ID = 'SEU_SPREADSHEET_ID_AQUI'; // ← substitua isso
const ADMIN_PASSWORD = 'bolao2026admin'; // ← troque por uma senha segura

// ────────────────────────────────────────────────────────────
// JOGOS DA FASE DE GRUPOS — Copa 2026
// Fonte: regulamento da folha do bolão
// ────────────────────────────────────────────────────────────
const JOGOS = [
  // Grupo A
  { id: 1,  data: '2026-06-11', hora: '16h', time1: 'MEX', time2: 'AFS', grupo: 'A' },
  { id: 2,  data: '2026-06-11', hora: '23h', time1: 'COR', time2: 'TCH', grupo: 'A' },
  { id: 3,  data: '2026-06-18', hora: '13h', time1: 'TCH', time2: 'AFS', grupo: 'A' },
  { id: 4,  data: '2026-06-18', hora: '22h', time1: 'MEX', time2: 'COR', grupo: 'A' },
  { id: 5,  data: '2026-06-24', hora: '22h', time1: 'TCH', time2: 'MEX', grupo: 'A' },
  { id: 6,  data: '2026-06-24', hora: '22h', time1: 'AFS', time2: 'COR', grupo: 'A' },
  // Grupo B
  { id: 7,  data: '2026-06-12', hora: '16h', time1: 'CAN', time2: 'BOS', grupo: 'B' },
  { id: 8,  data: '2026-06-12', hora: '16h', time1: 'QAT', time2: 'SUI', grupo: 'B' },
  { id: 9,  data: '2026-06-18', hora: '16h', time1: 'SUI', time2: 'BOS', grupo: 'B' },
  { id: 10, data: '2026-06-19', hora: '1h',  time1: 'CAN', time2: 'QAT', grupo: 'B' },
  { id: 11, data: '2026-06-24', hora: '13h', time1: 'SUI', time2: 'CAN', grupo: 'B' },
  { id: 12, data: '2026-06-24', hora: '16h', time1: 'BOS', time2: 'QAT', grupo: 'B' },
  // Grupo C
  { id: 13, data: '2026-06-13', hora: '19h', time1: 'BRA', time2: 'MAR', grupo: 'C' },
  { id: 14, data: '2026-06-13', hora: '22h', time1: 'HAI', time2: 'ESC', grupo: 'C' },
  { id: 15, data: '2026-06-19', hora: '15h', time1: 'ESC', time2: 'MAR', grupo: 'C' },
  { id: 16, data: '2026-06-19', hora: '21h30', time1: 'BRA', time2: 'HAI', grupo: 'C' },
  { id: 17, data: '2026-06-24', hora: '19h', time1: 'ESC', time2: 'BRA', grupo: 'C' },
  { id: 18, data: '2026-06-24', hora: '19h', time1: 'MAR', time2: 'HAI', grupo: 'C' },
  // Grupo D
  { id: 19, data: '2026-06-12', hora: '22h', time1: 'EUA', time2: 'PAR', grupo: 'D' },
  { id: 20, data: '2026-06-13', hora: '1h',  time1: 'AUS', time2: 'TUR', grupo: 'D' },
  { id: 21, data: '2026-06-20', hora: '0h',  time1: 'TUR', time2: 'PAR', grupo: 'D' },
  { id: 22, data: '2026-06-20', hora: '16h', time1: 'EUA', time2: 'AUS', grupo: 'D' },
  { id: 23, data: '2026-06-25', hora: '23h', time1: 'TUR', time2: 'EUA', grupo: 'D' },
  { id: 24, data: '2026-06-25', hora: '23h', time1: 'PAR', time2: 'AUS', grupo: 'D' },
  // Grupo E
  { id: 25, data: '2026-06-14', hora: '14h', time1: 'ALE', time2: 'CUR', grupo: 'E' },
  { id: 26, data: '2026-06-14', hora: '20h', time1: 'CDM', time2: 'EQU', grupo: 'E' },
  { id: 27, data: '2026-06-20', hora: '17h', time1: 'ALE', time2: 'CDM', grupo: 'E' },
  { id: 28, data: '2026-06-20', hora: '2h',  time1: 'EQU', time2: 'CUR', grupo: 'E' },
  { id: 29, data: '2026-06-25', hora: '17h', time1: 'CUR', time2: 'CDM', grupo: 'E' },
  { id: 30, data: '2026-06-25', hora: '17h', time1: 'EQU', time2: 'ALE', grupo: 'E' },
  // Grupo F
  { id: 31, data: '2026-06-14', hora: '17h', time1: 'HOL', time2: 'JAP', grupo: 'F' },
  { id: 32, data: '2026-06-14', hora: '23h', time1: 'SUE', time2: 'TUN', grupo: 'F' },
  { id: 33, data: '2026-06-20', hora: '23h', time1: 'TUN', time2: 'JAP', grupo: 'F' },
  { id: 34, data: '2026-06-20', hora: '14h', time1: 'HOL', time2: 'SUE', grupo: 'F' },
  { id: 35, data: '2026-06-25', hora: '20h', time1: 'TUN', time2: 'HOL', grupo: 'F' },
  { id: 36, data: '2026-06-25', hora: '20h', time1: 'JAP', time2: 'SUE', grupo: 'F' },
  // Grupo G
  { id: 37, data: '2026-06-15', hora: '16h', time1: 'BEL', time2: 'EGI', grupo: 'G' },
  { id: 38, data: '2026-06-15', hora: '16h', time1: 'IRA', time2: 'NZE', grupo: 'G' },
  { id: 39, data: '2026-06-21', hora: '16h', time1: 'BEL', time2: 'IRA', grupo: 'G' },
  { id: 40, data: '2026-06-21', hora: '22h', time1: 'NZE', time2: 'EGI', grupo: 'G' },
  { id: 41, data: '2026-06-27', hora: '22h', time1: 'NZE', time2: 'BEL', grupo: 'G' },
  { id: 42, data: '2026-06-27', hora: '0h',  time1: 'EGI', time2: 'IRA', grupo: 'G' },
  // Grupo H
  { id: 43, data: '2026-06-15', hora: '15h', time1: 'ESP', time2: 'CAB', grupo: 'H' },
  { id: 44, data: '2026-06-15', hora: '15h', time1: 'ARS', time2: 'URU', grupo: 'H' },
  { id: 45, data: '2026-06-21', hora: '15h', time1: 'ESP', time2: 'ARS', grupo: 'H' },
  { id: 46, data: '2026-06-21', hora: '19h', time1: 'URU', time2: 'CAB', grupo: 'H' },
  { id: 47, data: '2026-06-26', hora: '2h',  time1: 'URU', time2: 'ESP', grupo: 'H' },
  { id: 48, data: '2026-06-26', hora: '2h',  time1: 'CAB', time2: 'ARS', grupo: 'H' },
  // Grupo I
  { id: 49, data: '2026-06-16', hora: '16h', time1: 'FRA', time2: 'SEN', grupo: 'I' },
  { id: 50, data: '2026-06-16', hora: '19h', time1: 'IRQ', time2: 'NOR', grupo: 'I' },
  { id: 51, data: '2026-06-22', hora: '19h', time1: 'FRA', time2: 'IRQ', grupo: 'I' },
  { id: 52, data: '2026-06-22', hora: '23h', time1: 'NOR', time2: 'SEN', grupo: 'I' },
  { id: 53, data: '2026-06-26', hora: '16h', time1: 'NOR', time2: 'FRA', grupo: 'I' },
  { id: 54, data: '2026-06-26', hora: '16h', time1: 'SEN', time2: 'IRQ', grupo: 'I' },
  // Grupo J
  { id: 55, data: '2026-06-16', hora: '16h', time1: 'ARG', time2: 'AGL', grupo: 'J' },
  { id: 56, data: '2026-06-17', hora: '1h',  time1: 'AUT', time2: 'JOR', grupo: 'J' },
  { id: 57, data: '2026-06-22', hora: '22h', time1: 'ARG', time2: 'AUT', grupo: 'J' },
  { id: 58, data: '2026-06-23', hora: '0h',  time1: 'JOR', time2: 'AGL', grupo: 'J' },
  { id: 59, data: '2026-06-27', hora: '23h', time1: 'JOR', time2: 'ARG', grupo: 'J' },
  { id: 60, data: '2026-06-27', hora: '23h', time1: 'AGL', time2: 'AUT', grupo: 'J' },
  // Grupo K
  { id: 61, data: '2026-06-17', hora: '14h', time1: 'POR', time2: 'RDC', grupo: 'K' },
  { id: 62, data: '2026-06-17', hora: '20h', time1: 'UZB', time2: 'COL', grupo: 'K' },
  { id: 63, data: '2026-06-23', hora: '14h', time1: 'POR', time2: 'UZB', grupo: 'K' },
  { id: 64, data: '2026-06-23', hora: '23h', time1: 'COL', time2: 'RDC', grupo: 'K' },
  { id: 65, data: '2026-06-27', hora: '20h30',time1:'COL', time2: 'POR', grupo: 'K' },
  { id: 66, data: '2026-06-27', hora: '20h30',time1:'RDC', time2: 'UZB', grupo: 'K' },
  // Grupo L
  { id: 67, data: '2026-06-17', hora: '17h', time1: 'ING', time2: 'CRO', grupo: 'L' },
  { id: 68, data: '2026-06-17', hora: '20h', time1: 'GAN', time2: 'PAN', grupo: 'L' },
  { id: 69, data: '2026-06-23', hora: '17h', time1: 'ING', time2: 'GAN', grupo: 'L' },
  { id: 70, data: '2026-06-23', hora: '20h', time1: 'PAN', time2: 'CRO', grupo: 'L' },
  { id: 71, data: '2026-06-27', hora: '20h', time1: 'PAN', time2: 'ING', grupo: 'L' },
  { id: 72, data: '2026-06-27', hora: '18h', time1: 'CRO', time2: 'GAN', grupo: 'L' },
];

// ────────────────────────────────────────────────────────────
// PONTUAÇÃO
// ────────────────────────────────────────────────────────────
function calcularPontos(palp1, palp2, real1, real2) {
  palp1 = parseInt(palp1); palp2 = parseInt(palp2);
  real1 = parseInt(real1); real2 = parseInt(real2);
  if (isNaN(palp1) || isNaN(palp2) || isNaN(real1) || isNaN(real2)) return 0;

  const acertouTime1 = palp1 === real1;
  const acertouTime2 = palp2 === real2;
  const realFoiEmpate = real1 === real2;

  // 15 pts — Acertou os dois placares (placar exato)
  if (acertouTime1 && acertouTime2) return 15;

  // 7,5 pts — Real foi empate e acertou o placar de um dos times
  if (realFoiEmpate && (acertouTime1 || acertouTime2)) return 7.5;

  // 10 pts — Real não foi empate e acertou o placar do vencedor
  // Vencedor é time1 (real1 > real2): acertouTime1
  // Vencedor é time2 (real2 > real1): acertouTime2
  if (real1 > real2 && acertouTime1) return 10;
  if (real2 > real1 && acertouTime2) return 10;

  // 5 pts — Real não foi empate e acertou apenas o placar do perdedor
  if (real1 > real2 && acertouTime2) return 5;
  if (real2 > real1 && acertouTime1) return 5;

  return 0;
}

// ────────────────────────────────────────────────────────────
// INICIALIZAR PLANILHA
// ────────────────────────────────────────────────────────────
function inicializarPlanilha() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // Aba Participantes
  let abaPart = ss.getSheetByName('Participantes');
  if (!abaPart) {
    abaPart = ss.insertSheet('Participantes');
    abaPart.getRange(1, 1, 1, 7).setValues([
      ['ID', 'Nome', 'Email', 'Whatsapp', 'Status', 'DataInscricao', 'DataPagamento']
    ]);
  }

  // Aba Palpites
  let abaPalp = ss.getSheetByName('Palpites');
  if (!abaPalp) {
    abaPalp = ss.insertSheet('Palpites');
    abaPalp.getRange(1, 1, 1, 5).setValues([
      ['ParticipanteID', 'JogoID', 'Gols1', 'Gols2', 'DataRegistro']
    ]);
  }

  // Aba Resultados
  let abaRes = ss.getSheetByName('Resultados');
  if (!abaRes) {
    abaRes = ss.insertSheet('Resultados');
    abaRes.getRange(1, 1, 1, 4).setValues([
      ['JogoID', 'Gols1', 'Gols2', 'DataRegistro']
    ]);
  }

  return { ok: true, msg: 'Planilha inicializada com sucesso.' };
}

// ────────────────────────────────────────────────────────────
// ENTRY POINT — doPost
// ────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const { action } = body;
    let resultado;

    if (action === 'inscrever')          resultado = inscrever(body);
    else if (action === 'verificarID')   resultado = verificarParticipante(body.id);
    else if (action === 'salvarPalpites') resultado = salvarPalpites(body);
    else if (action === 'getRanking')    resultado = getRanking();
    else if (action === 'getJogos')      resultado = { ok: true, jogos: JOGOS };
    else if (action === 'adminLogin')    resultado = adminLogin(body.senha);
    else if (action === 'getParticipantes') resultado = getParticipantes(body.senha);
    else if (action === 'aprovarParticipante') resultado = aprovarParticipante(body);
    else if (action === 'salvarResultado')     resultado = salvarResultado(body);
    else if (action === 'getResultados')       resultado = getResultados(body.senha);
    else if (action === 'getMinhaPontuacao')   resultado = getMinhaPontuacao(body.id);
    else if (action === 'getMeusPalpites')     resultado = getMeusPalpites(body.id);
    else if (action === 'buscarPorEmail')      resultado = buscarPorEmail(body.email);
    else if (action === 'inicializar')         resultado = inicializarPlanilha();
    else resultado = { ok: false, msg: 'Ação desconhecida.' };

    return ContentService
      .createTextOutput(JSON.stringify(resultado))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, msg: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const action = e.parameter.action;
  let resultado;
  if (action === 'getRanking')   resultado = getRanking();
  else if (action === 'getJogos') resultado = { ok: true, jogos: JOGOS };
  else resultado = { ok: false, msg: 'Use POST.' };
  return ContentService
    .createTextOutput(JSON.stringify(resultado))
    .setMimeType(ContentService.MimeType.JSON);
}

// ────────────────────────────────────────────────────────────
// INSCRIÇÃO
// ────────────────────────────────────────────────────────────
function inscrever(body) {
  const { nome, email, whatsapp } = body;
  if (!nome || !email || !whatsapp) return { ok: false, msg: 'Preencha todos os campos.' };

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const aba = ss.getSheetByName('Participantes');
  if (!aba) return { ok: false, msg: 'Planilha não inicializada.' };

  const dados = aba.getDataRange().getValues();
  // Verificar email duplicado
  for (let i = 1; i < dados.length; i++) {
    if (dados[i][2] === email) {
      return { ok: false, msg: 'Este e-mail já está inscrito.', id: dados[i][0] };
    }
  }

  const id = 'BP' + String(Date.now()).slice(-6);
  const agora = new Date().toISOString();
  aba.appendRow([id, nome, email, whatsapp, 'PENDENTE', agora, '']);
  return { ok: true, id, msg: 'Inscrição realizada! Aguarde confirmação do pagamento.' };
}

// ────────────────────────────────────────────────────────────
// VERIFICAR PARTICIPANTE
// ────────────────────────────────────────────────────────────
function verificarParticipante(id) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const aba = ss.getSheetByName('Participantes');
  if (!aba) return { ok: false, msg: 'Planilha não inicializada.' };
  const dados = aba.getDataRange().getValues();
  for (let i = 1; i < dados.length; i++) {
    if (dados[i][0] === id) {
      return {
        ok: true,
        id: dados[i][0],
        nome: dados[i][1],
        email: dados[i][2],
        status: dados[i][4]
      };
    }
  }
  return { ok: false, msg: 'Participante não encontrado.' };
}

// ────────────────────────────────────────────────────────────
// SALVAR PALPITES
// ────────────────────────────────────────────────────────────
function salvarPalpites(body) {
  const { id, palpites } = body;
  if (!id || !palpites) return { ok: false, msg: 'Dados inválidos.' };

  // Qualquer participante inscrito pode salvar palpites
  // A pontuação só é contabilizada no ranking após aprovação do pagamento
  const part = verificarParticipante(id);
  if (!part.ok) return part;

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const aba = ss.getSheetByName('Palpites');
  const agora = new Date().toISOString();

  // Remover palpites anteriores deste participante
  const dados = aba.getDataRange().getValues();
  for (let i = dados.length - 1; i >= 1; i--) {
    if (dados[i][0] === id) aba.deleteRow(i + 1);
  }

  // Inserir novos palpites
  palpites.forEach(p => {
    aba.appendRow([id, p.jogoId, p.gols1, p.gols2, agora]);
  });

  return { ok: true, msg: 'Palpites salvos com sucesso!' };
}

// ────────────────────────────────────────────────────────────
// RANKING
// ────────────────────────────────────────────────────────────
function getRanking() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const abaPart = ss.getSheetByName('Participantes');
  const abaPalp = ss.getSheetByName('Palpites');
  const abaRes  = ss.getSheetByName('Resultados');
  if (!abaPart || !abaPalp || !abaRes) return { ok: false, msg: 'Planilha não inicializada.' };

  const participantes = abaPart.getDataRange().getValues();
  const palpites      = abaPalp.getDataRange().getValues();
  const resultados    = abaRes.getDataRange().getValues();

  // Montar mapa de resultados reais
  const mapResultados = {};
  for (let i = 1; i < resultados.length; i++) {
    mapResultados[resultados[i][0]] = { gols1: resultados[i][1], gols2: resultados[i][2] };
  }

  // Montar mapa de palpites por participante
  const mapPalpites = {};
  for (let i = 1; i < palpites.length; i++) {
    const pid = palpites[i][0];
    if (!mapPalpites[pid]) mapPalpites[pid] = {};
    mapPalpites[pid][palpites[i][1]] = { gols1: palpites[i][2], gols2: palpites[i][3] };
  }

  const ranking = [];
  let totalArrecadado = 0;

  for (let i = 1; i < participantes.length; i++) {
    const [pid, nome, , , status] = participantes[i];
    if (status === 'APROVADO') totalArrecadado += 50;
    if (status !== 'APROVADO') continue;

    let pontos = 0;
    let jogosComPalpite = 0;
    const detalhe = [];

    JOGOS.forEach(jogo => {
      const palp = (mapPalpites[pid] || {})[jogo.id];
      const real = mapResultados[jogo.id];
      if (palp) {
        jogosComPalpite++;
        if (real) {
          const pts = calcularPontos(palp.gols1, palp.gols2, real.gols1, real.gols2);
          pontos += pts;
          detalhe.push({ jogoId: jogo.id, palp, real, pts });
        }
      }
    });

    ranking.push({ id: pid, nome, pontos, jogosComPalpite });
  }

  ranking.sort((a, b) => b.pontos - a.pontos);
  // Adicionar posição
  ranking.forEach((r, idx) => { r.posicao = idx + 1; });

  const jogosComResultado = Object.keys(mapResultados).length;
  const totalParticipantes = ranking.length;

  return {
    ok: true,
    ranking,
    totalParticipantes,
    totalArrecadado,
    premiacao: {
      campeao: totalArrecadado * 0.6,
      vice: totalArrecadado * 0.3,
      organizacao: totalArrecadado * 0.1
    },
    jogosComResultado,
    totalJogos: JOGOS.length
  };
}

// ────────────────────────────────────────────────────────────
// ADMIN — Login
// ────────────────────────────────────────────────────────────
function adminLogin(senha) {
  if (senha === ADMIN_PASSWORD) return { ok: true };
  return { ok: false, msg: 'Senha incorreta.' };
}

// ────────────────────────────────────────────────────────────
// ADMIN — Listar participantes
// ────────────────────────────────────────────────────────────
function getParticipantes(senha) {
  if (senha !== ADMIN_PASSWORD) return { ok: false, msg: 'Acesso negado.' };
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const aba = ss.getSheetByName('Participantes');
  if (!aba) return { ok: false, msg: 'Planilha não inicializada.' };
  const dados = aba.getDataRange().getValues();
  const lista = [];
  for (let i = 1; i < dados.length; i++) {
    lista.push({
      id: dados[i][0], nome: dados[i][1], email: dados[i][2],
      whatsapp: dados[i][3], status: dados[i][4],
      dataInscricao: dados[i][5], dataPagamento: dados[i][6]
    });
  }
  return { ok: true, participantes: lista };
}

// ────────────────────────────────────────────────────────────
// ADMIN — Aprovar participante
// ────────────────────────────────────────────────────────────
function aprovarParticipante(body) {
  const { senha, id, status } = body;
  if (senha !== ADMIN_PASSWORD) return { ok: false, msg: 'Acesso negado.' };
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const aba = ss.getSheetByName('Participantes');
  const dados = aba.getDataRange().getValues();
  for (let i = 1; i < dados.length; i++) {
    if (dados[i][0] === id) {
      aba.getRange(i + 1, 5).setValue(status);
      if (status === 'APROVADO') aba.getRange(i + 1, 7).setValue(new Date().toISOString());
      return { ok: true, msg: `Participante ${status}.` };
    }
  }
  return { ok: false, msg: 'Participante não encontrado.' };
}

// ────────────────────────────────────────────────────────────
// ADMIN — Salvar resultado real
// ────────────────────────────────────────────────────────────
function salvarResultado(body) {
  const { senha, jogoId, gols1, gols2 } = body;
  if (senha !== ADMIN_PASSWORD) return { ok: false, msg: 'Acesso negado.' };
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const aba = ss.getSheetByName('Resultados');
  const dados = aba.getDataRange().getValues();
  const agora = new Date().toISOString();
  for (let i = 1; i < dados.length; i++) {
    if (dados[i][0] === jogoId) {
      aba.getRange(i + 1, 2, 1, 3).setValues([[gols1, gols2, agora]]);
      return { ok: true, msg: 'Resultado atualizado.' };
    }
  }
  aba.appendRow([jogoId, gols1, gols2, agora]);
  return { ok: true, msg: 'Resultado registrado.' };
}

// ────────────────────────────────────────────────────────────
// ADMIN — Listar resultados registrados
// ────────────────────────────────────────────────────────────
function getResultados(senha) {
  if (senha !== ADMIN_PASSWORD) return { ok: false, msg: 'Acesso negado.' };
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const aba = ss.getSheetByName('Resultados');
  if (!aba) return { ok: true, resultados: [] };
  const dados = aba.getDataRange().getValues();
  const lista = {};
  for (let i = 1; i < dados.length; i++) {
    lista[dados[i][0]] = { gols1: dados[i][1], gols2: dados[i][2] };
  }
  return { ok: true, resultados: lista };
}

// ────────────────────────────────────────────────────────────
// PARTICIPANTE — Conferência da própria pontuação
// ────────────────────────────────────────────────────────────
function getMinhaPontuacao(id) {
  if (!id) return { ok: false, msg: 'ID não informado.' };

  const part = verificarParticipante(id);
  if (!part.ok) return part;

  // Participante pode ver seus palpites independente do status
  // pagamentoAprovado controla se a pontuação é exibida ou não
  const pagamentoAprovado = part.status === 'APROVADO';

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const abaPalp = ss.getSheetByName('Palpites');
  const abaRes  = ss.getSheetByName('Resultados');
  if (!abaPalp || !abaRes) return { ok: false, msg: 'Planilha não inicializada.' };

  // Mapa palpites do participante
  const dadosPalp = abaPalp.getDataRange().getValues();
  const meusPalpites = {};
  for (let i = 1; i < dadosPalp.length; i++) {
    if (dadosPalp[i][0] === id) {
      meusPalpites[dadosPalp[i][1]] = { gols1: dadosPalp[i][2], gols2: dadosPalp[i][3] };
    }
  }

  // Mapa resultados reais
  const dadosRes = abaRes.getDataRange().getValues();
  const resultados = {};
  for (let i = 1; i < dadosRes.length; i++) {
    resultados[dadosRes[i][0]] = { gols1: dadosRes[i][1], gols2: dadosRes[i][2] };
  }

  // Montar detalhamento por jogo
  let totalPontos = 0;
  const jogosDetalhe = JOGOS.map(jogo => {
    const palp = meusPalpites[jogo.id];
    const real = resultados[jogo.id];
    let pts = null;
    let status = 'pendente';

    if (palp && real && pagamentoAprovado) {
      // Só calcula pontuação se pagamento aprovado
      pts = calcularPontos(palp.gols1, palp.gols2, real.gols1, real.gols2);
      totalPontos += pts;
      if (pts === 15)        status = 'cheio';
      else if (pts === 10)   status = 'vencedor';
      else if (pts === 7.5)  status = 'empate';
      else if (pts === 5)    status = 'perdedor';
      else                   status = 'zero';
    } else if (palp && real && !pagamentoAprovado) {
      // Tem palpite e resultado mas pagamento pendente — mostra como aguardando
      status = 'pendente_pagamento';
    } else if (!palp) {
      status = 'sem_palpite';
    }

    return {
      id: jogo.id, data: jogo.data, hora: jogo.hora,
      grupo: jogo.grupo, time1: jogo.time1, time2: jogo.time2,
      palp: palp || null, real: real || null, pts, status
    };
  });

  // Posição no ranking (só existe se aprovado)
  let posicao = null, totalParticipantes = 0;
  if (pagamentoAprovado) {
    const ranking = getRanking();
    if (ranking.ok) {
      totalParticipantes = ranking.totalParticipantes;
      const entry = ranking.ranking.find(r => r.id === id);
      if (entry) posicao = entry.posicao;
    }
  }

  return {
    ok: true,
    participante: { id: part.id, nome: part.nome, status: part.status },
    pagamentoAprovado,
    totalPontos,
    posicao,
    totalParticipantes,
    jogos: jogosDetalhe,
    totalPalpites: Object.keys(meusPalpites).length,
    jogosApurados: Object.keys(resultados).length
  };
}

// ────────────────────────────────────────────────────────────
// PARTICIPANTE — Buscar palpites próprios
// ────────────────────────────────────────────────────────────
function getMeusPalpites(id) {
  if (!id) return { ok: false, msg: 'ID não informado.' };
  const part = verificarParticipante(id);
  if (!part.ok) return part;

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const aba = ss.getSheetByName('Palpites');
  if (!aba) return { ok: true, palpites: [] };

  const dados = aba.getDataRange().getValues();
  const lista = [];
  for (let i = 1; i < dados.length; i++) {
    if (dados[i][0] === id) {
      lista.push({ jogoId: dados[i][1], gols1: dados[i][2], gols2: dados[i][3] });
    }
  }
  return { ok: true, palpites: lista };
}

// ────────────────────────────────────────────────────────────
// PARTICIPANTE — Recuperar código por e-mail
// ────────────────────────────────────────────────────────────
function buscarPorEmail(email) {
  if (!email) return { ok: false, msg: 'E-mail não informado.' };
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const aba = ss.getSheetByName('Participantes');
  if (!aba) return { ok: false, msg: 'Planilha não inicializada.' };
  const dados = aba.getDataRange().getValues();
  for (let i = 1; i < dados.length; i++) {
    if (String(dados[i][2]).toLowerCase() === email.toLowerCase()) {
      return { ok: true, id: dados[i][0], nome: dados[i][1], status: dados[i][4] };
    }
  }
  return { ok: false, msg: 'E-mail não encontrado. Verifique ou faça nova inscrição.' };
}
