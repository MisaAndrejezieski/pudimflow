// backend/server.js
// PudimFlow API - Versão estável com rotas de programação

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

console.log('🚀 Iniciando servidor PudimFlow...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ definida' : '❌ INDEFINIDA');

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados (Neon)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
});

// Testar conexão
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Erro fatal ao conectar no banco:', err.message);
        process.exit(1);
    }
    console.log('✅ Conectado ao PostgreSQL (Neon)');
    release();
});

// ============================================
// INICIALIZAÇÃO DAS TABELAS
// ============================================

async function initDatabase() {
    // Tabela de produção diária
    await pool.query(`
        CREATE TABLE IF NOT EXISTS producao_diaria (
            id SERIAL PRIMARY KEY,
            data DATE DEFAULT CURRENT_DATE UNIQUE,
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
            observacoes TEXT,
            programacao TEXT,
            meta FLOAT DEFAULT 0,
            criado_em TIMESTAMP DEFAULT NOW()
        );
    `);

    // Tabela de programação semanal
    await pool.query(`
        CREATE TABLE IF NOT EXISTS programacao_semanal (
            id SERIAL PRIMARY KEY,
            semana_inicio DATE NOT NULL,
            data DATE NOT NULL,
            dia_semana VARCHAR(10) NOT NULL,
            linha VARCHAR(10) NOT NULL,
            produto_codigo VARCHAR(20) NOT NULL,
            produto_nome VARCHAR(200) NOT NULL,
            meta_kg FLOAT DEFAULT 0,
            criado_em TIMESTAMP DEFAULT NOW(),
            atualizado_em TIMESTAMP DEFAULT NOW(),
            UNIQUE(semana_inicio, data, linha, produto_codigo)
        );
    `);

    // Criar índices para performance
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_programacao_semana ON programacao_semanal(semana_inicio);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_programacao_data ON programacao_semanal(data);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_producao_data ON producao_diaria(data);`);

    console.log('✅ Banco de dados inicializado (tabelas e índices)');
}

// ============================================
// ROTAS DE PRODUÇÃO DIÁRIA
// ============================================

// Salvar produção do dia (POST)
app.post('/api/producao', async (req, res) => {
    try {
        const data = req.body;
        const hoje = new Date().toISOString().split('T')[0];
        
        const totalEstantes = (data.brascopEstantes || 0) + (data.seracEstantes || 0);
        const totalKg = (data.brascopKg || 0) + (data.seracKg || 0);
        const totalPerdas = (data.brascopPerdas || 0) + (data.seracPerdas || 0);
        
        const result = await pool.query(`
            INSERT INTO producao_diaria (
                data, brascop_estantes, brascop_kg, brascop_paradas, brascop_perdas,
                serac_estantes, serac_kg, serac_paradas, serac_perdas,
                total_estantes, total_kg, total_perdas,
                bpf_ok, bpf_observacao, falhas, reclamacoes,
                dss_realizado, dss_tema, quase_acidente,
                etiqueta_azul, etiqueta_vermelha, etiqueta_fechada, observacoes,
                programacao, meta
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
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
                observacoes = EXCLUDED.observacoes,
                programacao = EXCLUDED.programacao,
                meta = EXCLUDED.meta
        `, [
            hoje, data.brascopEstantes || 0, data.brascopKg || 0, data.brascopParadas || '', data.brascopPerdas || 0,
            data.seracEstantes || 0, data.seracKg || 0, data.seracParadas || '', data.seracPerdas || 0,
            totalEstantes, totalKg, totalPerdas,
            data.bpfOk || false, data.bpfObservacao || '', data.falhas || '', data.reclamacoes || '',
            data.dssRealizado || false, data.dssTema || '', data.quaseAcidente || '',
            data.etiquetaAzul || '', data.etiquetaVermelha || '', data.etiquetaFechada || '', data.observacoes || '',
            data.programacao || '', data.meta || 0
        ]);
        
        res.json({ success: true, message: 'Produção salva com sucesso', id: result.rows[0]?.id });
    } catch (error) {
        console.error('Erro ao salvar produção:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Buscar produção de hoje
app.get('/api/producao/hoje', async (req, res) => {
    try {
        const hoje = new Date().toISOString().split('T')[0];
        const result = await pool.query(`
            SELECT 
                id, data,
                COALESCE(brascop_estantes, 0) AS "brascopEstantes",
                COALESCE(brascop_kg, 0) AS "brascopKg",
                COALESCE(brascop_paradas, '') AS "brascopParadas",
                COALESCE(brascop_perdas, 0) AS "brascopPerdas",
                COALESCE(serac_estantes, 0) AS "seracEstantes",
                COALESCE(serac_kg, 0) AS "seracKg",
                COALESCE(serac_paradas, '') AS "seracParadas",
                COALESCE(serac_perdas, 0) AS "seracPerdas",
                COALESCE(total_estantes, 0) AS "totalEstantes",
                COALESCE(total_kg, 0) AS "totalKg",
                COALESCE(total_perdas, 0) AS "totalPerdas",
                COALESCE(bpf_ok, false) AS "bpfOk",
                COALESCE(bpf_observacao, '') AS "bpfObservacao",
                COALESCE(falhas, '') AS falhas,
                COALESCE(reclamacoes, '') AS reclamacoes,
                COALESCE(dss_realizado, false) AS "dssRealizado",
                COALESCE(dss_tema, '') AS "dssTema",
                COALESCE(quase_acidente, '') AS "quaseAcidente",
                COALESCE(etiqueta_azul, '') AS "etiquetaAzul",
                COALESCE(etiqueta_vermelha, '') AS "etiquetaVermelha",
                COALESCE(etiqueta_fechada, '') AS "etiquetaFechada",
                COALESCE(observacoes, '') AS observacoes,
                COALESCE(programacao, '') AS programacao,
                COALESCE(meta, 0) AS meta
            FROM producao_diaria 
            WHERE data = $1
        `, [hoje]);
        
        if (result.rows.length > 0) {
            res.json({ success: true, data: result.rows[0] });
        } else {
            res.json({ success: true, data: null });
        }
    } catch (error) {
        console.error('Erro ao buscar produção de hoje:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Buscar produção por data específica
app.get('/api/producao/:data', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                id, data,
                COALESCE(brascop_estantes, 0) AS "brascopEstantes",
                COALESCE(brascop_kg, 0) AS "brascopKg",
                COALESCE(brascop_paradas, '') AS "brascopParadas",
                COALESCE(brascop_perdas, 0) AS "brascopPerdas",
                COALESCE(serac_estantes, 0) AS "seracEstantes",
                COALESCE(serac_kg, 0) AS "seracKg",
                COALESCE(serac_paradas, '') AS "seracParadas",
                COALESCE(serac_perdas, 0) AS "seracPerdas",
                COALESCE(total_estantes, 0) AS "totalEstantes",
                COALESCE(total_kg, 0) AS "totalKg",
                COALESCE(total_perdas, 0) AS "totalPerdas",
                COALESCE(bpf_ok, false) AS "bpfOk",
                COALESCE(bpf_observacao, '') AS "bpfObservacao",
                COALESCE(falhas, '') AS falhas,
                COALESCE(reclamacoes, '') AS reclamacoes,
                COALESCE(dss_realizado, false) AS "dssRealizado",
                COALESCE(dss_tema, '') AS "dssTema",
                COALESCE(quase_acidente, '') AS "quaseAcidente",
                COALESCE(etiqueta_azul, '') AS "etiquetaAzul",
                COALESCE(etiqueta_vermelha, '') AS "etiquetaVermelha",
                COALESCE(etiqueta_fechada, '') AS "etiquetaFechada",
                COALESCE(observacoes, '') AS observacoes,
                COALESCE(programacao, '') AS programacao,
                COALESCE(meta, 0) AS meta
            FROM producao_diaria 
            WHERE data = $1
        `, [req.params.data]);
        
        if (result.rows.length > 0) {
            res.json({ success: true, data: result.rows[0] });
        } else {
            res.json({ success: true, data: null });
        }
    } catch (error) {
        console.error('Erro ao buscar produção:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Buscar histórico dos últimos 30 dias
app.get('/api/historico', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                id, data,
                COALESCE(total_estantes, 0) AS "totalEstantes",
                COALESCE(total_kg, 0) AS "totalKg",
                COALESCE(total_perdas, 0) AS "totalPerdas",
                COALESCE(brascop_estantes, 0) AS "brascopEstantes",
                COALESCE(brascop_kg, 0) AS "brascopKg",
                COALESCE(serac_estantes, 0) AS "seracEstantes",
                COALESCE(serac_kg, 0) AS "seracKg"
            FROM producao_diaria 
            ORDER BY data DESC 
            LIMIT 30
        `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// ROTAS DE PROGRAMAÇÃO SEMANAL
// ============================================

// Salvar programação da semana inteira
app.post('/api/programacao/semana', async (req, res) => {
    try {
        const { semana_inicio, itens } = req.body;
        
        if (!semana_inicio || !itens || !Array.isArray(itens)) {
            return res.status(400).json({ success: false, error: 'Dados inválidos' });
        }
        
        // Iniciar transação
        await pool.query('BEGIN');
        
        // Deletar programação existente da semana
        await pool.query('DELETE FROM programacao_semanal WHERE semana_inicio = $1', [semana_inicio]);
        
        // Inserir novos itens
        for (const item of itens) {
            await pool.query(`
                INSERT INTO programacao_semanal (
                    semana_inicio, data, dia_semana, linha, 
                    produto_codigo, produto_nome, meta_kg
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [
                semana_inicio, item.data, item.dia_semana, item.linha,
                item.produto_codigo, item.produto_nome, item.meta_kg
            ]);
        }
        
        await pool.query('COMMIT');
        res.json({ success: true, message: 'Programação salva com sucesso' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Erro ao salvar programação:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Buscar programação da semana
app.get('/api/programacao/semana/:data', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM programacao_semanal 
            WHERE semana_inicio = $1 
            ORDER BY data, linha, produto_codigo
        `, [req.params.data]);
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Erro ao buscar programação da semana:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Buscar programação de um dia específico
app.get('/api/programacao/dia/:data', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM programacao_semanal 
            WHERE data = $1 
            ORDER BY linha, produto_codigo
        `, [req.params.data]);
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Erro ao buscar programação do dia:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Buscar todas as programações (com paginação)
app.get('/api/programacao', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        
        const result = await pool.query(`
            SELECT DISTINCT semana_inicio, MIN(data) as inicio, MAX(data) as fim,
                   COUNT(*) as total_itens
            FROM programacao_semanal 
            GROUP BY semana_inicio 
            ORDER BY semana_inicio DESC 
            LIMIT $1 OFFSET $2
        `, [limit, offset]);
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Erro ao buscar programações:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Deletar programação de uma semana
app.delete('/api/programacao/semana/:data', async (req, res) => {
    try {
        await pool.query('DELETE FROM programacao_semanal WHERE semana_inicio = $1', [req.params.data]);
        res.json({ success: true, message: 'Programação removida com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar programação:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// ROTAS DE ETIQUETAS (SIM)
// ============================================

// Buscar etiquetas (azuis/vermelhas) por data
app.get('/api/etiquetas/:data', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT etiqueta_azul, etiqueta_vermelha, etiqueta_fechada 
            FROM producao_diaria 
            WHERE data = $1
        `, [req.params.data]);
        
        if (result.rows.length > 0) {
            res.json({ success: true, data: result.rows[0] });
        } else {
            res.json({ success: true, data: { etiqueta_azul: '', etiqueta_vermelha: '', etiqueta_fechada: '' } });
        }
    } catch (error) {
        console.error('Erro ao buscar etiquetas:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ 
            status: 'ok', 
            timestamp: new Date().toISOString(),
            database: 'connected',
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            timestamp: new Date().toISOString(),
            database: 'disconnected',
            error: error.message
        });
    }
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3000;

initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 PudimFlow API rodando na porta ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
        console.log(`📋 Rotas disponíveis:`);
        console.log(`   POST   /api/producao`);
        console.log(`   GET    /api/producao/hoje`);
        console.log(`   GET    /api/producao/:data`);
        console.log(`   GET    /api/historico`);
        console.log(`   POST   /api/programacao/semana`);
        console.log(`   GET    /api/programacao/semana/:data`);
        console.log(`   GET    /api/programacao/dia/:data`);
        console.log(`   GET    /api/etiquetas/:data`);
        console.log(`   GET    /health`);
    });
});