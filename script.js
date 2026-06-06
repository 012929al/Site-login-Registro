// Gerenciador de Estado da UI
const UI = {
    loginBox: document.getElementById('loginBox'),
    registerBox: document.getElementById('registerBox'),
    toRegister: document.getElementById('toRegister'),
    toLogin: document.getElementById('toLogin'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    loginEmail: document.getElementById('loginEmail'),
    loginPassword: document.getElementById('loginPassword'),
    rememberMe: document.getElementById('rememberMe') // Novo elemento
};

// Alternar Telas
const toggleForms = (showRegister) => {
    if (showRegister) {
        UI.loginBox.classList.add('hidden');
        UI.registerBox.classList.remove('hidden');
    } else {
        UI.registerBox.classList.add('hidden');
        UI.loginBox.classList.remove('hidden');
    }
};

UI.toRegister.addEventListener('click', (e) => { e.preventDefault(); toggleForms(true); });
UI.toLogin.addEventListener('click', (e) => { e.preventDefault(); toggleForms(false); });

// Banco de Dados Local (LocalStorage)
const DB = {
    getUsers() {
        return JSON.parse(localStorage.getItem('app_users')) || {};
    },
    saveUsers(usersObj) {
        localStorage.setItem('app_users', JSON.stringify(usersObj));
    }
};

// Cadastro Corrigido
UI.registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;

    const users = DB.getUsers();

    if (users[email]) {
        alert('Este e-mail já está registrado.');
        return;
    }

    users[email] = { name, password };
    DB.saveUsers(users);

    alert('Cadastro realizado com sucesso!');
    
    UI.registerForm.reset();
    
    UI.loginEmail.value = email;
    UI.loginPassword.value = "";
    UI.loginPassword.focus();
    
    toggleForms(false);
});

// Login com funcionalidade "Lembrar de mim"
UI.loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const email = UI.loginEmail.value.trim().toLowerCase();
    const password = UI.loginPassword.value;

    if (!email || !password) return;

    const users = DB.getUsers();
    const user = users[email];

    if (user && user.password === password) {
        // --- LOGICA DO LEMBRAR DE MIM ---
        if (UI.rememberMe.checked) {
            localStorage.setItem('remembered_email', email); // Salva o email
        } else {
            localStorage.removeItem('remembered_email'); // Remove se o usuário desmarcou
        }

        // Salva a sessão ativa para o dashboard
        localStorage.setItem('usuario_logado', user.name);
        
        alert(`Olá, ${user.name}! Login feito com sucesso. Redirecionando...`);
        window.location.href = "dashboard.html"; 
    } else {
        alert('E-mail ou senha incorretos.');
    }
});

// Função para gerenciar a troca de abas sem recarregar a página
function switchTab(event, tabName) {
    // Evita o comportamento padrão do link de rolar a página abruptamente
    if(event) {
        event.preventDefault();
    }

    // Seleciona todas as seções de conteúdo
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove a classe ativa de todos os links de navegação
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Ativa a aba clicada e o respectivo botão na navbar
    const activeTab = document.getElementById(`${tabName}-tab`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    if(event && event.target) {
        event.target.classList.add('active');
    }
}

// Monitora alterações na Hash da URL caso o usuário use botões avançados
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'downloads') {
        const dlLink = document.querySelector('a[href="#downloads"]');
        switchTab({ preventDefault: () => {}, target: dlLink }, 'downloads');
    }
});

// --- NOVO: VERIFICAR SE EXISTE LOGIN SALVO AO CARREGAR A PÁGINA ---
window.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
        UI.loginEmail.value = savedEmail;
        UI.rememberMe.checked = true; // Deixa a caixinha marcada
    }
});
