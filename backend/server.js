// backend/server.js
// Servidor Node.js + Express para o PudimFlow

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROTAS DE PRODUÇÃO
// ============================================

// Salvar produção do dia
app.post('/api/producao', async (req, res) => {
  try {
    const dados = req.body;
    
    // Calcula totais automaticamente
    const totalEstantes = (dados.brascopEstantes || 0) + (dados.seracEstantes || 0);
    const totalKg = (dados.brascopKg || 0) + (dados.seracKg || 0);
    const totalPerdas = (dados.brascopPerdas || 0) + (dados.seracPerdas || 0);
    
    const producao = await prisma.producaoDiaria.create({
      data: {
        brascopEstantes: dados.brascopEstantes || 0,
        brascopKg: dados.brascopKg || 0,
        brascopParadas: dados.brascopParadas || '',
        brascopPerdas: dados.brascopPerdas || 0,
        seracEstantes: dados.seracEstantes || 0,
        seracKg: dados.seracKg || 0,
        seracParadas: dados.seracParadas || '',
        seracPerdas: dados.seracPerdas || 0,
        totalEstantes,
        totalKg,
        totalPerdas,
        // Qualidade
        bpfOk: dados.bpfOk || false,
        bpfObservacao: dados.bpfObservacao || '',
        falhas: dados.falhas || '',
        reclamacoes: dados.reclamacoes || '',
        // Segurança
        dssRealizado: dados.dssRealizado || false,
        dssTema: dados.dssTema || '',
        quaseAcidente: dados.quaseAcidente || '',
        // SIM
        etiquetaAzul: dados.etiquetaAzul || '',
        etiquetaVermelha: dados.etiquetaVermelha || '',
        etiquetaFechada: dados.etiquetaFechada || '',
        verAgirAntes: dados.verAgirAntes || '',
        verAgirDepois: dados.verAgirDepois || ''
      }
    });
    
    res.json({ success: true, data: producao });
  } catch (error) {
    console.error('Erro ao salvar produção:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Buscar produção de uma data específica
app.get('/api/producao/:data', async (req, res) => {
  try {
    const data = new Date(req.params.data);
    const inicioDia = new Date(data.setHours(0, 0, 0, 0));
    const fimDia = new Date(data.setHours(23, 59, 59, 999));
    
    const producao = await prisma.producaoDiaria.findFirst({
      where: {
        data: {
          gte: inicioDia,
          lte: fimDia
        }
      }
    });
    
    res.json({ success: true, data: producao });
  } catch (error) {
    console.error('Erro ao buscar produção:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Buscar produção do dia atual
app.get('/api/producao/hoje', async (req, res) => {
  try {
    const hoje = new Date();
    const inicioDia = new Date(hoje.setHours(0, 0, 0, 0));
    const fimDia = new Date(hoje.setHours(23, 59, 59, 999));
    
    let producao = await prisma.producaoDiaria.findFirst({
      where: {
        data: {
          gte: inicioDia,
          lte: fimDia
        }
      }
    });
    
    // Se não existe registro para hoje, retorna vazio
    if (!producao) {
      producao = {
        brascopEstantes: 0,
        brascopKg: 0,
        brascopParadas: '',
        brascopPerdas: 0,
        seracEstantes: 0,
        seracKg: 0,
        seracParadas: '',
        seracPerdas: 0,
        totalEstantes: 0,
        totalKg: 0,
        totalPerdas: 0,
        bpfOk: false,
        bpfObservacao: '',
        falhas: '',
        reclamacoes: '',
        dssRealizado: false,
        dssTema: '',
        quaseAcidente: '',
        etiquetaAzul: '',
        etiquetaVermelha: '',
        etiquetaFechada: '',
        verAgirAntes: '',
        verAgirDepois: ''
      };
    }
    
    res.json({ success: true, data: producao });
  } catch (error) {
    console.error('Erro ao buscar produção de hoje:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Listar todo o histórico
app.get('/api/historico', async (req, res) => {
  try {
    const historico = await prisma.producaoDiaria.findMany({
      orderBy: { data: 'desc' },
      take: 30
    });
    res.json({ success: true, data: historico });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 PudimFlow API rodando na porta ${PORT}`);
});