# BotAnnabelMinecraft
BotAnnabelMinecraft

# 🛠️ Requisitos de Instalação
Para que seu bot funcione, você precisa de quatro componentes principais:

Node.js: O ambiente de execução do JavaScript.

Módulos Node.js (npm): As bibliotecas do seu código.

Ollama: Para rodar o modelo Mistral 7B.

MariaDB/MySQL: Seu banco de dados.

Passo 1: Instalar Node.js e Git
Se você ainda não tem, instale o Node.js (versão 18+ ou 20+ recomendada).

Passo 2: Configurar a Pasta do Bot
Crie uma nova pasta para o seu projeto (ex: bot-annabel).

Dentro dessa pasta, crie um arquivo chamado package.json com o seguinte conteúdo:


Absolutamente! Vou refazer o código completo do seu bot Mineflayer (agora com o Mistral 7B configurado) e detalhar exatamente o que você precisa instalar para que ele funcione.

🛠️ Requisitos de Instalação
Para que seu bot funcione, você precisa de quatro componentes principais:

Node.js: O ambiente de execução do JavaScript.

Módulos Node.js (npm): As bibliotecas do seu código.

Ollama: Para rodar o modelo Mistral 7B.

MariaDB/MySQL: Seu banco de dados.

Passo 1: Instalar Node.js e Git
Se você ainda não tem, instale o Node.js (versão 18+ ou 20+ recomendada).

Passo 2: Configurar a Pasta do Bot
Crie uma nova pasta para o seu projeto (ex: bot-annabel).

Dentro dessa pasta, crie um arquivo chamado package.json com o seguinte conteúdo:

      JSON

      {
        "name": "bot-annabel-mineflayer",
        "version": "1.0.0",
        "description": "Bot de Minecraft com IA e integração MySQL",
        "main": "index.js",
        "scripts": {
          "start": "node index.js"
        },
        "dependencies": {
          "axios": "^1.6.8",
          "mineflayer": "^4.19.0",
          "mineflayer-pathfinder": "^2.4.2",
          "minecraft-data": "^3.55.0",
          "mysql2": "^3.9.7"
        }
      }

Dentro dessa pasta, crie um arquivo chamado .env com o seguinte conteúdo:

      # .env
      DB_HOST=100.107.34.48
      DB_USER=annabot
      DB_PASS=senhaforte123
      DB_NAME=banco

      MC_HOST=100.107.34.48
      MC_PORT=25565
      MC_USERNAME=ANNABEL
      MC_VERSION=1.20

      
Execute o seguinte comando no terminal, dentro da pasta do projeto, para instalar todas as dependências:

Bash

npm install
Passo 3: Configurar o Ollama
Instale o Ollama: Baixe e instale o Ollama em sua máquina a partir do site oficial (https://ollama.com/).

Baixe o Modelo Mistral: Abra um terminal e execute:

Bash

ollama pull mistral
Inicie o Serviço (se necessário): O Ollama geralmente inicia o serviço de API automaticamente, mas se você precisar iniciá-lo manualmente (para garantir que a porta 11434 esteja aberta), use:

Bash

ollama serve
Passo 4: Configurar o MariaDB/MySQL
Garanta que seu servidor MariaDB/MySQL (debian.tail561849.ts.net) esteja acessível. Você precisa ter um banco de dados chamado banco e, idealmente, uma tabela (ex: jogadores) para registrar os saldos, embora o seu código atual pareça usar a tabela banco com a coluna saldo e jogador.

<img width="1099" height="580" alt="image" src="https://github.com/user-attachments/assets/ea9c3251-5dd6-4290-bba7-69fe752d3f3f" />

<img width="1101" height="599" alt="image" src="https://github.com/user-attachments/assets/a870a4f0-511e-4b0c-9e04-bb6670d8c71f" />

<img width="744" height="569" alt="image" src="https://github.com/user-attachments/assets/ab465d3d-ed86-4dfc-ad55-e93481845a47" />



