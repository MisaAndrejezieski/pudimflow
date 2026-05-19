const express = require('express');
const { Client } = require('pg');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_mLxbg3UKaAP5@ep-bitter-lake-ajanohhr-pooler.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require"
});

client.connect();

async function initDatabase() {
    await client.query(`
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
    console.log('✅ Banco de dados inicializado');
}

// ============================================
// SALVAR PRODUÇÃO
// ============================================
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
        
        res.json({ success: true, message: 'Salvo com sucesso' });
    } catch (error) {
        console.error('Erro ao salvar:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// BUSCAR PRODUÇÃO DE HOJE (camelCase)
// ============================================
app.get('/api/producao/hoje', async (req, res) => {
    try {
        const hoje = new Date().toISOString().split('T')[0];
        const result = await client.query(`
            SELECT 
                id,
                data,
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

// ============================================
// BUSCAR PRODUÇÃO POR DATA
// ============================================
app.get('/api/producao/:data', async (req, res) => {
    try {
        const result = await client.query(`
            SELECT 
                id,
                data,
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
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// HISTÓRICO (camelCase)
// ============================================
app.get('/api/historico', async (req, res) => {
    try {
        const result = await client.query(`
            SELECT 
                id,
                data,
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
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// ROTAS DE PROGRAMAÇÃO SEMANAL
// ============================================
app.post('/api/programacao', async (req, res) => {
    try {
        const { programacao } = req.body;
        await client.query(`DELETE FROM programacao_semanal`);
        for (const item of programacao) {
            await client.query(`
                INSERT INTO programacao_semanal (dia, produto, meta, observacao, dia_semana)
                VALUES ($1, $2, $3, $4, $5)
            `, [item.dia, item.produto, item.meta, item.observacao, item.diaSemana]);
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/programacao', async (req, res) => {
    try {
        const result = await client.query(`SELECT * FROM programacao_semanal ORDER BY dia_semana`);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
const PORT = 3000;
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 PudimFlow API rodando na porta ${PORT}`);
    });
});