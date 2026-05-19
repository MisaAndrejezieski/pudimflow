# 🍮 PudimFlow

## Sistema de Gestão de Produção para Turno da Noite

---

## 📋 Sobre o Projeto

O **PudimFlow** é um sistema web desenvolvido especificamente para o **Turno da Noite** da produção de pudins. Ele substitui o caderno de anotações e planilhas manuais por uma interface digital, intuitiva e acessível via celular ou computador.

### Problemas que resolve

| Problema | Solução |
|----------|---------|
| Anotações manuais em caderno | Registro digital com timestamp |
| Cálculos manuais de produção | Totais calculados automaticamente |
| Perda de informações no handover | Dados persistentes no banco |
| Dificuldade para gerar relatórios | Exportação com um clique |
| Checklist esquecido | Interface organizada por módulos |

---

## 🚀 Funcionalidades

| Módulo | Funcionalidades |
|--------|-----------------|
| **Dashboard** | Visão geral do turno, cards de resumo, checklist do líder |
| **Produção** | Controle Brascop/Trepko e Serac, estantes, kg, paradas, perdas, tanques |
| **Qualidade** | BPF checklist, falhas, reclamações do consumidor |
| **Segurança** | DSS (tema, participantes), registro de quase acidentes |
| **SIM** | Etiquetas Azuis/Vermelhas, Ver e Agir (antes/depois) |
| **Relatórios** | Histórico, busca por data, exportação Excel, copiar resumo |

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| **Frontend** | HTML5, CSS3, JavaScript | - |
| **Backend** | Node.js + Express | 18.x |
| **Banco de Dados** | PostgreSQL (Neon.tech) | 15.x |
| **ORM** | Prisma | 5.x |
| **Deploy Front** | Vercel | - |
| **Deploy Back** | Render | - |
| **Versionamento** | Git + GitHub | - |

---

## 📁 Estrutura do Projeto
pudimflow/
│
├── frontend/
│ ├── index.html (Dashboard)
│ ├── producao.html (Produção)
│ ├── qualidade.html (Qualidade)
│ ├── seguranca.html (Segurança)
│ ├── sim.html (SIM)
│ ├── relatorios.html (Relatórios)
│ ├── style.css (Estilos com Dark Mode)
│ └── script.js (Funções compartilhadas)
│
├── backend/
│ ├── server.js (API Node.js)
│ ├── prisma/
│ │ └── schema.prisma (Modelo do banco)
│ └── .env (Variáveis de ambiente)
│
└── README.md (Documentação)

---

## 🔧 Instalação Local

### Pré-requisitos

- Node.js 18+ instalado
- Conta no [Neon.tech](https://neon.tech) (banco de dados gratuito)
- Git instalado

### Passo a Passo

#### 1. Clone o repositório

```bash
git clone https://github.com/MisaAndrejezieski/pudimflow.git
cd pudimflow
cd backend
npm init -y
npm install express @prisma/client prisma dotenv
npm install -D nodemon
3. Configure o arquivo .env
env
DATABASE_URL="postgresql://usuario:senha@seu-host.neon.tech/neondb?sslmode=require"
PORT=3000
4. Execute as migrations do Prisma
bash
npx prisma generate
npx prisma db push
5. Inicie o servidor
bash
node server.js
# ou com nodemon para desenvolvimento
npx nodemon server.js
6. Abra o frontend
Localmente: abra os arquivos HTML no navegador

Ou use um servidor local: npx serve frontend

☁️ Deploy em Produção
Backend (Render)
Acesse render.com

Conecte com GitHub

"New Web Service" → selecione o repositório

Configure:

Build Command: npm install && npx prisma generate

Start Command: node server.js

Adicione variável de ambiente DATABASE_URL (do Neon)

Frontend (Vercel)
Acesse vercel.com

Conecte com GitHub

Importe o repositório

Configure:

Build Command: (nenhum, é HTML puro)

Output Directory: frontend

Deploy automático a cada push

📊 API Endpoints
Método	Endpoint	Descrição
POST	/api/producao	Salvar produção do turno
GET	/api/producao/hoje	Buscar produção do dia
GET	/api/producao/:data	Buscar produção por data
GET	/api/historico	Listar últimos 30 dias
🎨 Design
Tema: Light/Dark Mode automático (prefers-color-scheme)

Fontes: Inter (Google Fonts)

Responsivo: Mobile-first, adaptado para celular e desktop

Animações: Hover effects, loading spinner, fade in

📝 Checklist diário do Líder
Horário	Atividade	Módulo
21:40	Chegada e início do turno	Dashboard
21:40-22:00	Handover com turno anterior	-
22:00-22:30	Planejamento e programação	Produção
22:30-23:00	Verificação de pessoal e matéria prima	Qualidade
23:00-00:00	Produção e etiquetas	Produção
00:00-00:30	Revezamento da equipe	-
00:30-01:00	Lançamento de desvios	Qualidade
01:00-05:00	Operação e melhorias	SIM
05:00	Handover para turno da manhã	Relatórios
🔜 Melhorias Futuras (Roadmap)
Autenticação de usuários (JWT)

Múltiplos turnos (manhã/tarde/noite)

Dashboard do gestor (visão consolidada)

Envio automático de relatórios por email

Gráficos e estatísticas avançadas

Aplicativo mobile (PWA)

Integração com leitores de código de barras

👤 Autor
Misa Andrejezieski

GitHub: @MisaAndrejezieski

📄 Licença
Este projeto é de uso interno da Lactalis (Unidade de Pudins).

🙏 Agradecimentos
Equipe do turno da noite pelo apoio e feedback

Líderes dos turnos manhã/tarde pela colaboração

Gestão da Lactalis pelo suporte ao projeto

📞 Suporte
Em caso de dúvidas ou problemas:

Verificar conectividade com o banco de dados

Verificar logs no Render

Entrar em contato com o desenvolvedor

🍮 PudimFlow - Transformando café em código, e código em produtividade.

text

---

## ✅ AGORA SIM, TUDO PRONTO!

| Arquivo | Status |
|---------|--------|
| `backend/prisma/schema.prisma` | ✅ |
| `backend/server.js` | ✅ |
| `backend/.env` | ✅ |
| `frontend/style.css` | ✅ |
| `frontend/script.js` | ✅ |
| `frontend/index.html` | ✅ |
| `frontend/producao.html` | ✅ |
| `frontend/qualidade.html` | ✅ |
| `frontend/seguranca.html` | ✅ |
| `frontend/sim.html` | ✅ |
| `frontend/relatorios.html` | ✅ |
| `README.md` | ✅ |

---

## 🚀 Próximos passos para você:

1. **Instalar dependências do backend:**
```bash
cd backend
npm init -y
npm install express @prisma/client prisma dotenv
Gerar cliente Prisma:

bash
npx prisma generate
npx prisma db push
Rodar localmente:

bash
node server.js
Testar no navegador: Abrir frontend/index.html

Fazer deploy no Render + Vercel