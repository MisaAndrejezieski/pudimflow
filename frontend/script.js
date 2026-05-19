// frontend/script.js
// PudimFlow - Funções compartilhadas

// Configuração da API
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://pudimflow-api.onrender.com/api';

// Função para mostrar loading
function showLoading(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        const originalHtml = el.innerHTML;
        el.innerHTML = '<div class="loading-spinner"></div>';
        return originalHtml;
    }
    return null;
}

// Função para esconder loading
function hideLoading(elementId, originalHtml) {
    const el = document.getElementById(elementId);
    if (el && originalHtml !== null) {
        el.innerHTML = originalHtml;
    }
}

// Função para mostrar mensagem temporária
function showMessage(message, type = 'success', duration = 3000) {
    const msgDiv = document.getElementById('globalMessage') || (() => {
        const div = document.createElement('div');
        div.id = 'globalMessage';
        div.style.position = 'fixed';
        div.style.top = '1rem';
        div.style.right = '1rem';
        div.style.zIndex = '9999';
        document.body.appendChild(div);
        return div;
    })();
    
    msgDiv.className = `alert alert-${type}`;
    msgDiv.innerHTML = message;
    msgDiv.style.display = 'block';
    
    setTimeout(() => {
        msgDiv.style.display = 'none';
    }, duration);
}

// Função para salvar dados genéricos
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

// Função para buscar dados
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

// Função para formatar números
function formatarNumero(valor, decimal = false) {
    if (decimal) {
        return parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return parseInt(valor).toLocaleString('pt-BR');
}

// Função para formatar data
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

// Função para validar campos obrigatórios
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

// Função para limpar formulário
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

// Função para alternar dark mode (global)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Função para carregar preferência de dark mode
function loadDarkModePreference() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
    }
}

// Função para atualizar data/hora no footer
function updateDateTime() {
    const el = document.getElementById('ultimaAtualizacao');
    if (el) {
        el.textContent = new Date().toLocaleString('pt-BR');
    }
}

// Verificar conectividade com o backend
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

// Inicializar quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    loadDarkModePreference();
    updateDateTime();
    
    // Atualizar data/hora a cada minuto
    setInterval(updateDateTime, 60000);
    
    // Verificar conectividade
    checkBackendHealth().then(isOnline => {
        if (!isOnline) {
            showMessage('⚠️ Conectividade com o servidor pode estar limitada', 'warning', 5000);
        }
    });
});

// Exportar funções para uso global (quando necessário)
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
    checkBackendHealth
};