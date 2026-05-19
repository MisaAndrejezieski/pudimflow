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