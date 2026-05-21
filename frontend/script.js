// ============================================
// PUDIMFLOW - SCRIPT COMPARTILHADO
// Versão: 3.0 - Funções globais do sistema
// ============================================

// --------------------------------------------
// CONFIGURAÇÃO DA API
// --------------------------------------------
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://pudimflow.onrender.com/api';

// --------------------------------------------
// FUNÇÕES DE LOADING
// --------------------------------------------
function showLoading(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        const originalHtml = el.innerHTML;
        el.innerHTML = '<div class="loading-spinner"></div>';
        return originalHtml;
    }
    return null;
}

function hideLoading(elementId, originalHtml) {
    const el = document.getElementById(elementId);
    if (el && originalHtml !== null) {
        el.innerHTML = originalHtml;
    }
}

// --------------------------------------------
// MENSAGENS GLOBAIS
// --------------------------------------------
function showMessage(message, type = 'success') {
    let msgDiv = document.getElementById('globalMessage');
    
    if (!msgDiv) {
        msgDiv = document.createElement('div');
        msgDiv.id = 'globalMessage';
        msgDiv.style.position = 'fixed';
        msgDiv.style.top = '80px';
        msgDiv.style.right = '20px';
        msgDiv.style.zIndex = '9999';
        msgDiv.style.padding = '12px 20px';
        msgDiv.style.borderRadius = '12px';
        msgDiv.style.fontSize = '0.85rem';
        msgDiv.style.fontWeight = '500';
        msgDiv.style.display = 'none';
        msgDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        document.body.appendChild(msgDiv);
    }
    
    msgDiv.className = `alert-${type}`;
    msgDiv.innerHTML = message;
    msgDiv.style.display = 'block';
    
    setTimeout(() => {
        msgDiv.style.display = 'none';
    }, 3000);
}

// --------------------------------------------
// REQUISIÇÕES HTTP
// --------------------------------------------
async function salvarDados(endpoint, dados) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        const result = await response.json();
        
        if (result.success) {
            showMessage('Dados salvos com sucesso!', 'success');
            return { success: true, data: result.data };
        } else {
            throw new Error(result.error || 'Erro ao salvar');
        }
    } catch (error) {
        showMessage('Erro: ' + error.message, 'danger');
        return { success: false, error: error.message };
    }
}

async function buscarDados(endpoint) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        const result = await response.json();
        
        if (result.success) {
            return { success: true, data: result.data };
        } else {
            throw new Error(result.error || 'Erro ao buscar');
        }
    } catch (error) {
        console.error('Erro:', error);
        return { success: false, error: error.message };
    }
}

// --------------------------------------------
// FORMATAÇÃO
// --------------------------------------------
function formatarNumero(valor, decimal = false) {
    if (decimal) {
        return parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return parseInt(valor).toLocaleString('pt-BR');
}

function formatarData(data, formato = 'brasileiro') {
    const d = new Date(data);
    if (formato === 'brasileiro') {
        return d.toLocaleDateString('pt-BR');
    }
    if (formato === 'completo') {
        return d.toLocaleString('pt-BR');
    }
    return d.toISOString().split('T')[0];
}

// --------------------------------------------
// VALIDAÇÃO DE CAMPOS
// --------------------------------------------
function validarCampos(ids) {
    for (const id of ids) {
        const el = document.getElementById(id);
        if (el && !el.value) {
            showMessage(`Campo ${id} é obrigatório`, 'warning');
            el.focus();
            return false;
        }
    }
    return true;
}

function limparFormulario(ids) {
    for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
            if (el.type === 'checkbox') {
                el.checked = false;
            } else if (el.type === 'number') {
                el.value = 0;
            } else {
                el.value = '';
            }
        }
    }
}

// --------------------------------------------
// DARK MODE
// --------------------------------------------
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function loadDarkModePreference() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
    }
}

// --------------------------------------------
// DATA/HORA
// --------------------------------------------
function updateDateTime() {
    const el = document.getElementById('ultimaAtualizacao');
    if (el) {
        el.textContent = new Date().toLocaleString('pt-BR');
    }
}

function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function gerarDatasSemana(dataInicio) {
    const start = new Date(dataInicio);
    const datas = [];
    for (let i = 0; i < 7; i++) {
        const data = new Date(start);
        data.setDate(start.getDate() + i);
        datas.push(data.toISOString().split('T')[0]);
    }
    return datas;
}

// --------------------------------------------
// CONECTIVIDADE
// --------------------------------------------
async function checkBackendHealth() {
    try {
        const response = await fetch(`${API_URL.replace('/api', '')}/health`, {
            method: 'GET',
            timeout: 5000
        });
        return response.ok;
    } catch (error) {
        console.warn('Backend offline:', error);
        return false;
    }
}

// --------------------------------------------
// EXPORTAÇÃO DE FORMATAÇÃO DE PRODUTOS
// --------------------------------------------
const produtosConfig = {
    'Pudim Leite Batavo': { massaG: 85, caldaG: 15, totalG: 100, validadeDias: 43 },
    'Pudim Leite Itambé': { massaG: 90, caldaG: 10, totalG: 100, validadeDias: 43 },
    'Pudim Leite Chandelle': { massaG: 90, caldaG: 10, totalG: 100, validadeDias: 43 },
    'Brigadeiro Batavo': { massaG: 90, caldaG: 0, totalG: 90, validadeDias: 48 },
    'Brigadeiro Itambé': { massaG: 90, caldaG: 0, totalG: 90, validadeDias: 48 },
    'Brigadeiro Chandelle': { massaG: 90, caldaG: 0, totalG: 90, validadeDias: 48 },
    'Beijinho Chandelle': { massaG: 90, caldaG: 0, totalG: 90, validadeDias: 48 },
    'Manjar Coco Batavo': { massaG: 75, caldaG: 15, totalG: 90, validadeDias: 43 },
    'Romeu e Julieta Itambé': { massaG: 90, caldaG: 10, totalG: 100, validadeDias: 43 }
};

function calcularDataValidade(dias, dataBaseStr) {
    const data = new Date(dataBaseStr);
    data.setDate(data.getDate() + dias);
    return data.toLocaleDateString('pt-BR');
}

function getProdutoConfig(nomeProduto) {
    return produtosConfig[nomeProduto] || produtosConfig['Pudim Leite Batavo'];
}

// --------------------------------------------
// INICIALIZAÇÃO GLOBAL
// --------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    loadDarkModePreference();
    updateDateTime();
    
    // Atualizar data/hora a cada minuto
    setInterval(updateDateTime, 60000);
    
    // Verificar conectividade
    checkBackendHealth().then(isOnline => {
        if (!isOnline) {
            showMessage('⚠️ Conectividade com o servidor pode estar limitada', 'warning');
        }
    });
});

// --------------------------------------------
// EXPORTAÇÃO PARA USO GLOBAL
// --------------------------------------------
window.PudimFlow = {
    API_URL,
    showLoading,
    hideLoading,
    showMessage,
    salvarDados,
    buscarDados,
    formatarNumero,
    formatarData,
    validarCampos,
    limparFormulario,
    toggleDarkMode,
    loadDarkModePreference,
    updateDateTime,
    checkBackendHealth,
    getMonday,
    gerarDatasSemana,
    getProdutoConfig,
    calcularDataValidade,
    produtosConfig
};