// backend/server.js
// PudimFlow API - Versão sem Prisma (usando pg)

const express = require('express');
const { Client } = require('pg');

const app = express();
app.use(express.json());

// Conexão com o banco
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect();

// Criar tabela se não existir
async function initDatabase() {
  await client.query(`
    CREATE TABLE IF NOT EXISTS producao_diaria (
      id SERIAL PRIMARY KEY,
      data DATE DEFAULT CURRENT_DATE,
      brascop_estantes INTEGER DEFAULT 0,
      brascop_kg FLOAT DEFAULT 0,
      brascop_paradas TEXT DEFAULT '',
      brascop_perdas INTEGER DEFAULT 0,
      serac_estantes INTEGER DEFAULT 0,
      serac_kg FLOAT DEFAULT 0,
      serac_paradas TEXT DEFAULT '',
      serac_perdas INTEGER DEFAULT 0,
      total_estantes INTEGER DEFAULT 0,
      total_kg FLOAT DEFAULT 0,
      total_perdas INTEGER DEFAULT 0,
      bpf_ok BOOLEAN DEFAULT false,
      bpf_observacao TEXT,
      falhas TEXT,
      reclamacoes TEXT,
      dss_realizado BOOLEAN DEFAULT false,
      dss_tema TEXT,
      quase_acidente TEXT,
      etiqueta_azul TEXT,
      etiqueta_vermelha TEXT,
      etiqueta_fechada TEXT,
      ver_agir_antes TEXT,
      ver_agir_depois TEXT,
      criado_em TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('✅ Banco de dados inicializado');
}

// ============================================
// ROTAS DA API
// ============================================

// Salvar produção
app.post('/api/producao', async (req, res) => {
  try {
    const data = req.body;
    const hoje = new Date().toISOString().split('T')[0];
    
    const totalEstantes = (data.brascopEstantes || 0) + (data.seracEstantes || 0);
    const totalKg = (data.brascopKg || 0) + (data.seracKg || 0);
    const totalPerdas = (data.brascopPerdas || 0) + (data.seracPerdas || 0);
    
    await client.query(`
      INSERT INTO producao_diaria (
        data, brascop_estantes, brascop_kg, brascop_paradas, brascop_perdas,
        serac_estantes, serac_kg, serac_paradas, serac_perdas,
        total_estantes, total_kg, total_perdas,
        bpf_ok, bpf_observacao, falhas, reclamacoes,
        dss_realizado, dss_tema, quase_acidente,
        etiqueta_azul, etiqueta_vermelha, etiqueta_fechada,
        ver_agir_antes, ver_agir_depois
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12,
        $13, $14, $15, $16,
        $17, $18, $19,
        $20, $21, $22,
        $23, $24
      )
      ON CONFLICT (data) DO UPDATE SET
        brascop_estantes = EXCLUDED.brascop_estantes,
        brascop_kg = EXCLUDED.brascop_kg,
        brascop_paradas = EXCLUDED.brascop_paradas,
        brascop_perdas = EXCLUDED.brascop_perdas,
        serac_estantes = EXCLUDED.serac_estantes,
        serac_kg = EXCLUDED.serac_kg,
        serac_paradas = EXCLUDED.serac_paradas,
        serac_perdas = EXCLUDED.serac_perdas,
        total_estantes = EXCLUDED.total_estantes,
        total_kg = EXCLUDED.total_kg,
        total_perdas = EXCLUDED.total_perdas,
        bpf_ok = EXCLUDED.bpf_ok,
        bpf_observacao = EXCLUDED.bpf_observacao,
        falhas = EXCLUDED.falhas,
        reclamacoes = EXCLUDED.reclamacoes,
        dss_realizado = EXCLUDED.dss_realizado,
        dss_tema = EXCLUDED.dss_tema,
        quase_acidente = EXCLUDED.quase_acidente,
        etiqueta_azul = EXCLUDED.etiqueta_azul,
        etiqueta_vermelha = EXCLUDED.etiqueta_vermelha,
        etiqueta_fechada = EXCLUDED.etiqueta_fechada,
        ver_agir_antes = EXCLUDED.ver_agir_antes,
        ver_agir_depois = EXCLUDED.ver_agir_depois
    `, [
      hoje, data.brascopEstantes || 0, data.brascopKg || 0, data.brascopParadas || '', data.brascopPerdas || 0,
      data.seracEstantes || 0, data.seracKg || 0, data.seracParadas || '', data.seracPerdas || 0,
      totalEstantes, totalKg, totalPerdas,
      data.bpfOk || false, data.bpfObservacao || '', data.falhas || '', data.reclamacoes || '',
      data.dssRealizado || false, data.dssTema || '', data.quaseAcidente || '',
      data.etiquetaAzul || '', data.etiquetaVermelha || '', data.etiquetaFechada || '',
      data.verAgirAntes || '', data.verAgirDepois || ''
    ]);
    
    res.json({ success: true, message: 'Salvo com sucesso' });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Buscar produção de hoje
app.get('/api/producao/hoje', async (req, res) => {
  try {
    const hoje = new Date().toISOString().split('T')[0];
    const result = await client.query(`
      SELECT * FROM producao_diaria WHERE data = $1
    `, [hoje]);
    
    if (result.rows.length > 0) {
      const row = result.rows[0];
      res.json({ success: true, data: {
        id: row.id,
        brascopEstantes: row.brascop_estantes,
        brascopKg: row.brascop_kg,
        brascopParadas: row.brascop_paradas,
        brascopPerdas: row.brascop_perdas,
        seracEstantes: row.serac_estantes,
        seracKg: row.serac_kg,
        seracParadas: row.serac_paradas,
        seracPerdas: row.serac_perdas,
        totalEstantes: row.total_estantes,
        totalKg: row.total_kg,
        totalPerdas: row.total_perdas,
        bpfOk: row.bpf_ok,
        bpfObservacao: row.bpf_observacao,
        falhas: row.falhas,
        reclamacoes: row.reclamacoes,
        dssRealizado: row.dss_realizado,
        dssTema: row.dss_tema,
        quaseAcidente: row.quase_acidente,
        etiquetaAzul: row.etiqueta_azul,
        etiquetaVermelha: row.etiqueta_vermelha,
        etiquetaFechada: row.etiqueta_fechada,
        verAgirAntes: row.ver_agir_antes,
        verAgirDepois: row.ver_agir_depois
      }});
    } else {
      res.json({ success: true, data: null });
    }
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Buscar produção por data
app.get('/api/producao/:data', async (req, res) => {
  try {
    const result = await client.query(`
      SELECT * FROM producao_diaria WHERE data = $1
    `, [req.params.data]);
    
    if (result.rows.length > 0) {
      const row = result.rows[0];
      res.json({ success: true, data: {
        id: row.id,
        brascopEstantes: row.brascop_estantes,
        brascopKg: row.brascop_kg,
        brascopParadas: row.brascop_paradas,
        brascopPerdas: row.brascop_perdas,
        seracEstantes: row.serac_estantes,
        seracKg: row.serac_kg,
        seracParadas: row.serac_paradas,
        seracPerdas: row.serac_perdas,
        totalEstantes: row.total_estantes,
        totalKg: row.total_kg,
        totalPerdas: row.total_perdas,
        bpfOk: row.bpf_ok,
        bpfObservacao: row.bpf_observacao,
        falhas: row.falhas,
        reclamacoes: row.reclamacoes,
        dssRealizado: row.dss_realizado,
        dssTema: row.dss_tema,
        quaseAcidente: row.quase_acidente,
        etiquetaAzul: row.etiqueta_azul,
        etiquetaVermelha: row.etiqueta_vermelha,
        etiquetaFechada: row.etiqueta_fechada,
        verAgirAntes: row.ver_agir_antes,
        verAgirDepois: row.ver_agir_depois
      }});
    } else {
      res.json({ success: true, data: null });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Histórico
app.get('/api/historico', async (req, res) => {
  try {
    const result = await client.query(`
      SELECT * FROM producao_diaria ORDER BY data DESC LIMIT 30
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 PudimFlow API rodando na porta ${PORT}`);
  });
});