require('dotenv').config();
const mineflayer = require('mineflayer');
const axios = require('axios');
const mysql = require('mysql2');
const { pathfinder, Movements, goals: { GoalFollow } } = require('mineflayer-pathfinder');
const mcData = require('minecraft-data');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco:', err.message);
    return;
  }
  console.log('✅ Conectado ao banco MariaDB!');
});

const bot = mineflayer.createBot({
  host: process.env.MC_HOST,
  port: parseInt(process.env.MC_PORT),
  username: process.env.MC_USERNAME,
  auth: 'offline',
  version: process.env.MC_VERSION
});

bot.loadPlugin(pathfinder);

const admins = ['007amauri', 'Admin2'];
const botIDCode = Math.floor(1000 + Math.random() * 9000);
let pendingAdminCommand = null;

bot.on('login', () => {
  console.log('🤖 ANNABEL conectada!');
  bot.chat(`Online [BOT_ID:${botIDCode}] - Use 'anna <pergunta>' para falar com a IA Mistral.`);
  const movements = new Movements(bot, mcData(bot.version));
  bot.pathfinder.setMovements(movements);
  anunciarDataEspecial(); // Executa ao logar
});

bot.on('error', err => console.error('🔴 Erro no bot:', err.message));
bot.on('end', () => console.log('❌ Bot desconectada.'));

// 🎉 Função de datas comemorativas
function anunciarDataEspecial() {
  const hoje = new Date();
  const dia = hoje.getDate();
  const mes = hoje.getMonth() + 1;
  const chave = `${dia}-${mes}`;

  const datasEspeciais = {
    '6-11': ['Dia do Técnico em Eletrônica', 'Dia do Designer Gráfico'],
    '15-11': ['Proclamação da República'],
    '20-11': ['Dia da Consciência Negra'],
    '25-12': ['Natal'],
    '1-1': ['Ano Novo'],
    // Adicione mais datas aqui
  };

  if (datasEspeciais[chave]) {
    datasEspeciais[chave].forEach(evento => {
      bot.chat(`📅 Hoje é ${dia}/${mes}! Comemoramos: ${evento}`);
    });

    // Presenteia o jogador mais próximo
    const jogador = findNearestPlayer();
    if (jogador) {
      bot.chat(`🎁 ${jogador}, você ganhou uma maçã encantada por hoje ser especial!`);
      bot.chat(`/give ${jogador} minecraft:enchanted_golden_apple 1`);
    }
  }
}

// 🔍 Utilidades
function executeAdminCommand(cmd) {
  console.log('🔧 Executando comando admin:', cmd);
  bot.chat(`/${cmd}`);
}

function findNearestPlayer() {
  let nearest = null;
  let minDist = Infinity;
  for (const entity of Object.values(bot.entities)) {
    if (entity.type === 'player' && entity.username !== bot.username) {
      const dist = bot.entity.position.distanceTo(entity.position);
      if (dist < minDist) {
        minDist = dist;
        nearest = entity.username;
      }
    }
  }
  return nearest;
}

// 💰 Economia
function getBalance(username) {
  bot.chat(`/balance ${username}`);
}

function buyGoldenApple(username, price) {
  bot.chat(`/balance ${username}`);
  bot.once('messagestr', msg => {
    const match = msg.match(/Saldo de .*?: \$(\d[\d,.]*)/);
    if (!match) return bot.chat(`${username}, erro ao obter saldo.`);
    const balance = parseFloat(match[1].replace(/,/g, ''));
    if (balance >= price) {
      bot.chat(`/eco take ${username} ${price}`);
      db.query(`UPDATE banco SET saldo = saldo + ? WHERE jogador = ?`, [price, username], (err, res) => {
        if (err) {
          console.error('Erro MySQL:', err);
          return bot.chat(`${username}, erro ao registrar no banco.`);
        }
        if (res.affectedRows === 0) {
          db.query(`INSERT INTO banco (jogador, saldo) VALUES (?, ?)`, [username, price]);
        }
        bot.chat(`${username}, você comprou uma maçã dourada por $${price}.`);
      });
      bot.chat(`/give ${username} minecraft:golden_apple 1`);
    } else {
      bot.chat(`${username}, saldo insuficiente: $${balance.toFixed(2)}.`);
    }
  });
}

// 💬 Chat
bot.on('chat', async (username, message) => {
  if (username === bot.username) return;
  const args = message.split(' ');
  const command = args[0].toLowerCase();
  const rest = args.slice(1).join(' ');

  console.log(`[Chat] ${username}: ${message}`);

  if (command === 'anna' || command === '!ia') {
    const prompt = rest.trim();
    if (!prompt) return bot.chat(`${username}, digite algo após 'anna'.`);
    if (prompt.toLowerCase() === 'oi') return bot.chat('Oi! Use "anna <sua pergunta>".');
    bot.chat(`Pensando... (Mistral 7B)`);
    try {
      const res = await axios.post('http://localhost:11434/api/chat', {
        model: 'mistral',
        messages: [{ role: 'user', content: prompt }],
        stream: false
      }, { headers: { 'Content-Type': 'application/json' } });
      const reply = res.data?.message?.content || 'Sem resposta da IA.';
      const lines = reply.match(/.{1,100}/g);
      lines?.forEach(line => bot.chat(`[IA] ${line}`));
    } catch (err) {
      console.error('Erro IA:', err.message);
      bot.chat(`[IA] Erro ao conectar à IA.`);
    }
  }

  else if (command === 'saldo') {
    getBalance(username);
  }

  else if (command === 'maca') {
    buyGoldenApple(username, 500);
  }

  else if (command === '!seguir') {
    const target = bot.players[username]?.entity;
    if (!target) return bot.chat('Não te vejo ou você está longe.');
    bot.chat(`Seguindo você, ${username}!`);
    bot.pathfinder.setGoal(new GoalFollow(target, 1), true);
  }

  else if (command === '!admin' && admins.includes(username)) {
    pendingAdminCommand = rest;
    bot.chat(`${username}, confirme com !confirmar para executar: /${pendingAdminCommand}`);
  }

  else if (command === '!confirmar' && pendingAdminCommand && admins.includes(username)) {
    executeAdminCommand(pendingAdminCommand);
    pendingAdminCommand = null;
  }
});

// 📥 Listener de mensagens
bot.on('messagestr', msg => {
  if (msg.includes("Saldo de") && !msg.includes(bot.username)) {
    const match = msg.match(/Saldo de (.*?): \$(\d[\d,.]*)/);
    if (match) {
      const player = match[1];
      const balance = parseFloat(match[2].replace(/,/g, ''));
      bot.chat(`${player}, seu saldo é: $${balance.toFixed(2)}`);
    }
  }
});