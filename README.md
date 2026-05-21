# 🍮 PudimFlow

## Sistema de Gestão de Produção para Turno da Noite

---

## 📋 Sobre o Projeto

O **PudimFlow** é um sistema web desenvolvido especificamente para o **Turno da Noite** da produção de pudins. 
Ele substitui o caderno de anotações e planilhas manuais por uma interface digital, intuitiva e acessível 
via celular, tablet ou computador.

**Desenvolvido para:** Misa Andrejezieski  
**Turno:** Noite (21:40 - 05:00)  
**Linhas de produção:** TREPKO (Brascop) e SERAC

---

## 🚀 Funcionalidades

| Módulo | Funcionalidades |
|--------|-----------------|
| **Dashboard** | Visão geral do turno, produção por linha (Brascop/Serac), cálculo de etiquetas para resselagem, checklist personalizado do líder, alerta de meia-noite, lembrete do GA (Grupo Autônomo) |
| **Programação** | Planejamento semanal de produção com datas, produtos e metas. Armazenamento em JSON (4 semanas de histórico). |
| **SIM** | Sistema de Ideias e Melhorias baseado no modelo Toyota. Etiquetas Azuis (resolvidas pela equipe) e Vermelhas (manutenção necessária), com prioridades, filtros e histórico. |
| **Preparação** | Controle de preparação da massa com 9 formulações de produtos (Pudim, Brigadeirão, Manjar, Morango, Beijinho). Controle de CIP do tanque (5 etapas) e controle de bateladas da máquina (CIP a cada 4 bateladas). Rastreabilidade de lotes. |
| **Troca de Turno** | Registro completo da produção (envasado/resselagem), paradas, perdas, tanques de preparo, desvios. Gráfico de produtividade por máquina. Resumo do turno com cópia rápida. |

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) | - |
| **Backend** | Node.js + Express | 18.x |
| **Banco de Dados** | PostgreSQL (Neon.tech) | 15.x |
| **Deploy Front** | Vercel | - |
| **Deploy Back** | Render | - |
| **Versionamento** | Git + GitHub | - |

---

## 📁 Estrutura do Projeto
pudimflow/
├── frontend/
│ ├── index.html # Dashboard principal
│ ├── programacao.html # Programação semanal
│ ├── sim.html # SIM (Etiquetas + GA)
│ ├── preparacao.html # Preparação do produto
│ ├── troca-turno.html # Troca de turno
│ ├── style.css # Estilos globais
│ └── script.js # Funções compartilhadas
├── backend/
│ ├── server.js # API Node.js
│ ├── package.json # Dependências
│ └── .env # Variáveis de ambiente
├── historico_producao/ # Histórico em JSON (4 semanas)
├── .gitattributes
├── .gitignore
└── README.md


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

2. Configure o backend
bash
cd backend
npm install
npm install cors

3. Configure o arquivo .env
env
DATABASE_URL="postgresql://usuario:senha@seu-host.neon.tech/neondb?sslmode=require"
PORT=3000

4. Inicie o servidor
bash
node server.js
# ou com nodemon para desenvolvimento
npx nodemon server.js