// Chave para o localStorage
const STORAGE_KEY = 'devweb_conference_items';

// Estado inicial da aplicação
let items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// 1. CARREGAMENTO E PERSISTÊNCIA (localStorage)
function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// 2. CADASTRAR / ADICIONAR ITEM
function addItem(event) {
    event.preventDefault();

    const titulo = document.getElementById('item-titulo').value.trim();
    const categoria = document.getElementById('item-categoria').value;
    const palestrante = document.getElementById('item-palestrante').value.trim();
    const data = document.getElementById('item-data').value;

    // Validação simples
    if (!titulo || !categoria || !data) {
        showFeedback('Preencha todos os campos obrigatórios!', 'error');
        return;
    }

    const newItem = {
        id: Date.now().toString(), // ID único baseado no timestamp
        titulo,
        categoria,
        palestrante: palestrante || 'A definir',
        data,
        status: 'Confirmado'
    };

    items.push(newItem);
    saveToLocalStorage();
    renderList(items);
    showFeedback('Item cadastrado com sucesso!', 'success');
    
    document.getElementById('form-item').reset();
}

// 3. LISTAR DINAMICAMENTE E RENDERIZAR NO DOM
function renderList(dataArray) {
    const container = document.getElementById('items-container');
    if (!container) return;

    container.innerHTML = '';

    if (dataArray.length === 0) {
        container.innerHTML = `<p class="empty-msg">Nenhum item encontrado.</p>`;
        return;
    }

    dataArray.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="card-info">
                <h3>${item.titulo}</h3>
                <span class="badge ${item.categoria}">${item.categoria}</span>
                <p><strong>Palestrante:</strong> ${item.palestrante}</p>
                <p><strong>Data:</strong> ${item.data}</p>
            </div>
            <div class="card-actions">
                <button onclick="viewDetails('${item.id}')" class="btn-details">Detalhes</button>
                <button onclick="openEditModal('${item.id}')" class="btn-edit">Editar</button>
                <button onclick="deleteItem('${item.id}')" class="btn-delete">Excluir</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// 4. VISUALIZAR DETALHES (Utilizando Modal)
function viewDetails(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const modal = document.getElementById('details-modal');
    const content = document.getElementById('modal-details-content');
    
    content.innerHTML = `
        <h2>${item.titulo}</h2>
        <p><strong>Categoria:</strong> ${item.categoria}</p>
        <p><strong>Palestrante / Responsável:</strong> ${item.palestrante}</p>
        <p><strong>Data / Horário:</strong> ${item.data}</p>
        <p><strong>Status:</strong> ${item.status}</p>
    `;
    
    modal.style.display = 'block';
}

// 5. EDITAR REGISTRO
function openEditModal(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;

    // Preenche um formulário de edição (pode ser o mesmo modal ou redirecionamento)
    const novoTitulo = prompt("Editar Título:", item.titulo);
    if (novoTitulo === null) return; // Cancelado

    item.titulo = novoTitulo.trim();
    saveToLocalStorage();
    renderList(items);
    showFeedback('Item atualizado com sucesso!', 'success');
}

// 6. EXCLUIR REGISTRO
function deleteItem(id) {
    if (confirm("Deseja realmente excluir este item?")) {
        items = items.filter(i => i.id !== id);
        saveToLocalStorage();
        renderList(items);
        showFeedback('Item excluído com sucesso!', 'success');
    }
}

// 7. PESQUISAR ITENS
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = items.filter(item => 
            item.titulo.toLowerCase().includes(term) || 
            item.palestrante.toLowerCase().includes(term)
        );
        renderList(filtered);
    });
}

// 8. FILTRAR ITENS (por Categoria)
function setupFilter() {
    const filterSelect = document.getElementById('filter-categoria');
    if (!filterSelect) return;

    filterSelect.addEventListener('change', (e) => {
        const category = e.target.value;
        if (category === 'todos') {
            renderList(items);
        } else {
            const filtered = items.filter(item => item.categoria === category);
            renderList(filtered);
        }
    });
}

// 9. ORDENAR ITENS (Alfabética / Data)
function setupSort() {
    const sortSelect = document.getElementById('sort-select');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        
        let sorted = [...items];
        if (sortBy === 'titulo') {
            sorted.sort((a, b) => a.titulo.localeCompare(b.titulo));
        } else if (sortBy === 'data') {
            sorted.sort((a, b) => new Date(a.data) - new Date(b.data));
        }

        renderList(sorted);
    });
}

// 10. CONSUMO DE API PÚBLICA (Exemplo: Importar dados de API de Livros/Palestras ou Dados Abertos)
async function fetchExternalData() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
        const externalData = await response.json();

        // Mapeia os dados da API para o formato do sistema da Conferência
        const apiItems = externalData.map((post, index) => ({
            id: `api_${post.id}`,
            titulo: post.title.substring(0, 30),
            categoria: index % 2 === 0 ? 'Palestra' : 'Workshop',
            palestrante: `Convidado API ${post.userId}`,
            data: '2026-11-15',
            status: 'Externo'
        }));

        // Adiciona à lista caso não existam
        apiItems.forEach(apiItem => {
            if (!items.some(i => i.id === apiItem.id)) {
                items.push(apiItem);
            }
        });

        saveToLocalStorage();
        renderList(items);
        showFeedback('Dados externos integrados com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao consumir API:', error);
        showFeedback('Não foi possível carregar os dados externos.', 'error');
    }
}

// Feedback visual na tela
function showFeedback(message, type) {
    let feedbackEl = document.getElementById('form-feedback');
    if (!feedbackEl) {
        feedbackEl = document.createElement('div');
        feedbackEl.id = 'form-feedback';
        document.body.prepend(feedbackEl);
    }
    feedbackEl.className = `feedback ${type}`;
    feedbackEl.textContent = message;
    
    setTimeout(() => {
        feedbackEl.textContent = '';
        feedbackEl.className = '';
    }, 3000);
}

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    renderList(items);
    setupSearch();
    setupFilter();
    setupSort();

    const form = document.getElementById('form-item');
    if (form) {
        form.addEventListener('submit', addItem);
    }

    const btnApi = document.getElementById('btn-fetch-api');
    if (btnApi) {
        btnApi.addEventListener('click', fetchExternalData);
    }
});