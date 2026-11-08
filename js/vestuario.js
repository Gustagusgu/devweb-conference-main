/**
 * Lógica da tela de Vestuário - Meu Inventário
 * Manipulação de localStorage, CRUD, Filtros e Consumo de API
 */

const STORAGE_KEY = 'meu_inventario_items';

// Itens padrão de vestuário caso o localStorage não possua itens nesta categoria
const defaultVestuario = [
    {
        id: 'vest_1',
        titulo: 'Jaqueta Jeans Vintage',
        categoria: 'Vestuário',
        subcategoria: 'Casacos',
        tamanho: 'M',
        dono: 'Rafael Costa',
        estado: 'Conservado',
        descricao: 'Jaqueta jeans azul clássica, tamanho M, perfeita para dias frios.'
    },
    {
        id: 'vest_2',
        titulo: 'Vestido de Festa Longo',
        categoria: 'Vestuário',
        subcategoria: 'Vestidos',
        tamanho: 'P',
        dono: 'Marina Alves',
        estado: 'Seminovo',
        descricao: 'Vestido longo azul-marinho, usado apenas uma vez em formatura.'
    },
    {
        id: 'vest_3',
        titulo: 'Casaco Sobretudo Preto',
        categoria: 'Vestuário',
        subcategoria: 'Casacos',
        tamanho: 'G',
        dono: 'Gustavo Sa',
        estado: 'Bom estado',
        descricao: 'Sobretudo de lã sintética preto, ideal para viagens ou inverno rigoroso.'
    }
];

let items = [];

// Carrega os itens salvos ou insere os padrões de vestuário
function loadItems() {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    // Se não houver itens cadastrados de vestuário, inclui os padrões
    const vestuarioItems = stored.filter(item => item.categoria === 'Vestuário');
    
    if (vestuarioItems.length === 0 && stored.length === 0) {
        items = defaultVestuario;
        saveToLocalStorage(items);
    } else {
        items = stored;
    }
}

function saveToLocalStorage(dataArray) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataArray));
}

// Renderiza a lista de peças de vestuário no DOM
function renderVestuario(dataArray) {
    const container = document.getElementById('vestuario-container');
    if (!container) return;

    // Filtra apenas itens da categoria Vestuário
    const vestuarioList = dataArray.filter(item => item.categoria === 'Vestuário');

    container.innerHTML = '';

    if (vestuarioList.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 20px;">Nenhuma peça de vestuário encontrada.</p>`;
        return;
    }

    vestuarioList.forEach(item => {
        const article = document.createElement('article');
        article.className = 'item-card';
        article.innerHTML = `
            <div class="item-art art-shirt" aria-hidden="true" style="background: #eef2f6; padding: 20px; text-align: center; border-radius: 6px 6px 0 0;">
                <span class="art-label" style="font-size: 0.8rem; color: #555; font-weight: bold;">TAMANHO: ${item.tamanho || 'M'}</span>
                <div class="shirt-shape" style="font-size: 2.5rem; margin-top: 5px;">♧</div>
            </div>
            <div class="item-body" style="padding: 15px; background: #fff; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 6px 6px;">
                <div class="item-meta" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span class="category-pill" style="background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">${item.subcategoria || 'Vestuário'}</span>
                    <span class="availability" style="font-size: 0.85rem; color: #2e7d32;">● Disponível</span>
                </div>
                <h3 style="margin: 5px 0; font-size: 1.1rem;">${item.titulo}</h3>
                <p class="item-description" style="color: #666; font-size: 0.9rem; margin-bottom: 12px;">${item.descricao || 'Sem descrição cadastrada.'}</p>
                <div class="item-owner" style="font-size: 0.85rem; color: #444; margin-bottom: 15px;">
                    <span><strong>Dono:</strong> ${item.dono || 'Anônimo'} • <strong>Estado:</strong> ${item.estado || 'Bom'}</span>
                </div>
                <div class="item-actions" style="display: flex; gap: 8px;">
                    <button class="button button-card" onclick="viewDetails('${item.id}')" style="flex: 1;">Ver Detalhes</button>
                    <button class="icon-button" onclick="editItem('${item.id}')" title="Editar peça" style="padding: 6px 10px; cursor: pointer;">✎</button>
                    <button class="icon-button danger" onclick="deleteItem('${item.id}')" title="Excluir peça" style="padding: 6px 10px; cursor: pointer; color: #d32f2f;">⌫</button>
                </div>
            </div>
        `;
        container.appendChild(article);
    });
}

// Visualizar detalhes no Modal
function viewDetails(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const modal = document.getElementById('details-modal');
    const content = document.getElementById('modal-details-content');

    content.innerHTML = `
        <h2 style="margin-top:0;">${item.titulo}</h2>
        <p><strong>Categoria:</strong> ${item.categoria} (${item.subcategoria || 'Geral'})</p>
        <p><strong>Tamanho:</strong> ${item.tamanho || 'Não especificado'}</p>
        <p><strong>Responsável/Dono:</strong> ${item.dono}</p>
        <p><strong>Estado de Conservação:</strong> ${item.estado || 'Bom estado'}</p>
        <p><strong>Descrição:</strong> ${item.descricao || 'Nenhuma descrição fornecida.'}</p>
    `;
    modal.style.display = 'block';
}

// Editar Item
function editItem(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const novoTitulo = prompt("Editar nome da peça:", item.titulo);
    if (novoTitulo === null) return;

    item.titulo = novoTitulo.trim();
    saveToLocalStorage(items);
    renderVestuario(items);
}

// Excluir Item
function deleteItem(id) {
    if (confirm("Tem certeza que deseja remover esta peça do inventário?")) {
        items = items.filter(i => i.id !== id);
        saveToLocalStorage(items);
        renderVestuario(items);
    }
}

// Configurar Pesquisa em Tempo Real
function setupSearch() {
    const searchInput = document.getElementById('search-vestuario');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = items.filter(item => 
            item.categoria === 'Vestuário' && (
                item.titulo.toLowerCase().includes(term) || 
                (item.dono && item.dono.toLowerCase().includes(term)) ||
                (item.tamanho && item.tamanho.toLowerCase().includes(term))
            )
        );
        renderVestuario(filtered);
    });
}

// Configurar Filtros (Subcategoria e Tamanho)
function setupFilters() {
    const filterSub = document.getElementById('filter-subcategoria');
    const filterTam = document.getElementById('filter-tamanho');

    function applyFilters() {
        const subVal = filterSub ? filterSub.value : 'todos';
        const tamVal = filterTam ? filterTam.value : 'todos';

        const filtered = items.filter(item => {
            if (item.categoria !== 'Vestuário') return false;
            
            const matchSub = (subVal === 'todos') || (item.subcategoria === subVal);
            const matchTam = (tamVal === 'todos') || (item.tamanho === tamVal);

            return matchSub && matchTam;
        });

        renderVestuario(filtered);
    }

    if (filterSub) filterSub.addEventListener('change', applyFilters);
    if (filterTam) filterTam.addEventListener('change', applyFilters);
}

// Configurar Ordenação
function setupSort() {
    const sortSelect = document.getElementById('sort-vestuario');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        let vestuarioOnly = items.filter(i => i.categoria === 'Vestuário');

        if (sortBy === 'nome') {
            vestuarioOnly.sort((a, b) => a.titulo.localeCompare(b.titulo));
        } else if (sortBy === 'tamanho') {
            vestuarioOnly.sort((a, b) => (a.tamanho || '').localeCompare(b.tamanho || ''));
        }

        renderVestuario(vestuarioOnly);
    });
}

// Consumir API Pública Externa (FakeStore API - Roupas Masculinas/Femininas)
async function fetchVestuarioAPI() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/category/men\'s clothing?limit=3');
        const apiData = await response.json();

        apiData.forEach((product, index) => {
            const newItem = {
                id: `api_vest_${product.id}`,
                titulo: product.title.substring(0, 25),
                categoria: 'Vestuário',
                subcategoria: index % 2 === 0 ? 'Camisas' : 'Casacos',
                tamanho: index % 2 === 0 ? 'M' : 'G',
                dono: 'Parceiro API Externa',
                estado: 'Novo',
                descricao: product.description.substring(0, 80) + '...'
            };

            // Evita duplicados
            if (!items.some(i => i.id === newItem.id)) {
                items.push(newItem);
            }
        });

        saveToLocalStorage(items);
        renderVestuario(items);
        alert('Peças de vestuário importadas da API externa com sucesso!');
    } catch (error) {
        console.error('Erro ao consumir API de vestuário:', error);
        alert('Não foi possível carregar os dados da API externa.');
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadItems();
    renderVestuario(items);
    setupSearch();
    setupFilters();
    setupSort();

    const btnAPI = document.getElementById('btn-fetch-vestuario-api');
    if (btnAPI) {
        btnAPI.addEventListener('click', fetchVestuarioAPI);
    }
});