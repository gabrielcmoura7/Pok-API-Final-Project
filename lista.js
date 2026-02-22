document.addEventListener('DOMContentLoaded', () => {
    // 1. Pegando os elementos da tela nova
    const grid = document.getElementById('pokedex-grid');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn2 = document.getElementById('next-btn-2');
    const prevBtn2 = document.getElementById('prev-btn-2');

    // 2. Configurações da API
    let offset = 0;      
    const limit = 150;  

    // 3. Função que busca a lista
    async function fetchList() {
        grid.innerHTML = '<p>Carregando...</p>';
        
        try {
            const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
            const response = await fetch(url);
            const data = await response.json();

            // Limpa a tela
            grid.innerHTML = '';

            // Para cada pokemon, cria um card
            data.results.forEach(pokemon => {
                createCard(pokemon);
            });

            // Atualiza os botões (se é pagina 1, desativa o botão Anterior)
            prevBtn.disabled = offset === 0;
            prevBtn2.disabled = offset === 0;

        } catch (error) {
            console.error(error);
            grid.innerHTML = '<p>Erro ao carregar lista.</p>';
        }
    }

    // 4. Função que desenha o card
    function createCard(pokemon) {
        // Pega o ID da URL do pokemon (ex: .../pokemon/25/)
        const parts = pokemon.url.split('/');
        const id = parts[parts.length - 2]; 
        const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

        const card = document.createElement('div');
        card.classList.add('pokemon-card-mini');

        card.innerHTML = `
            <img src="${imgUrl}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <span>#${id}</span>
        `;

        // O CLIQUE MÁGICO:
        // Quando clica, volta para a index.html (../) levando o nome do pokemon
        card.addEventListener('click', () => {
            window.location.href = `../index.html?pokemon=${pokemon.name}`;
        });

        grid.appendChild(card);
    }

    // 5. Configurar os botões de Próximo e Anterior
    function goNext() {
        offset += limit; // Soma 150
        fetchList();
        window.scrollTo(0, 0); // Sobe a tela
    }

    function goPrev() {
        if (offset >= limit) {
            offset -= limit; // Subtrai 150
            fetchList();
            window.scrollTo(0, 0);
        }
    }

    // Adiciona os eventos de clique nos botões
    nextBtn.addEventListener('click', goNext);
    nextBtn2.addEventListener('click', goNext);
    prevBtn.addEventListener('click', goPrev);
    prevBtn2.addEventListener('click', goPrev);

    // Começa tudo
    fetchList();
});