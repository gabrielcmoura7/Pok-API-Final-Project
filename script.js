document.addEventListener('DOMContentLoaded', () => {
    // 1. Selecionar elementos do DOM
    const searchButton = document.getElementById('search-button');
    const pokemonInput = document.getElementById('pokemon-input');
    const pokemonInfoDiv = document.getElementById('pokemon-info');
    const searchHistory = []; 
    const historyListElement = document.getElementById('history-list');

    // 2. Adicionar um "ouvinte de evento" ao botão de busca
    searchButton.addEventListener('click', () => {
        // Obter o valor do input e formatá-lo (minúsculas)
        const pokemonNameOrId = pokemonInput.value.toLowerCase().trim();
        
        // Chamar a função de busca
        if (pokemonNameOrId) {
            fetchPokemon(pokemonNameOrId);
        } else {
            pokemonInfoDiv.innerHTML = '<p>Por favor, digite o nome ou ID do Pokémon.</p>';
        }
    });

    // 3. Função principal para buscar o Pokémon na API
    async function fetchPokemon(query) {
        // Limpar a área de informações e mostrar "Carregando..."
        pokemonInfoDiv.innerHTML = '<ul><li><p>Carregando...</p></li></ul>';
        
        try {
            // Montar a URL da PokeAPI
            const apiUrl = `https://pokeapi.co/api/v2/pokemon/${query}`;
            
            // Fazer a requisição (requer conhecimento de Promises e async/await)
            const response = await fetch(apiUrl);
            
            // Checar se a resposta foi um erro 404 (Pokémon não encontrado)
            if (!response.ok) {
                // Lançar um erro para o bloco catch lidar
                throw new Error('Pokémon não encontrado!');
            }
            
            // Converter a resposta para JSON
            const data = await response.json();
            
            // 4. Exibir os dados do Pokémon
            displayPokemon(data);

            if (!searchHistory.includes(data.name)) {
                searchHistory.push(data.name);
                displayHistory(); 
            }

        } catch (error) {
            // Exibir mensagem de erro
            console.error('Erro ao buscar Pokémon:', error);
            pokemonInfoDiv.innerHTML = `<p style="color: red;">Erro: ${error.message}</p>`;
        }

       
    }
       
     
   function displayHistory() {
        historyListElement.innerHTML = '';

        searchHistory.forEach(pokemonName => {
            const listItem = document.createElement('li');
            listItem.textContent = pokemonName;
            
           
            listItem.classList.add('history-item');

            
            listItem.addEventListener('click', () => {
                fetchPokemon(pokemonName); 
            });

            historyListElement.appendChild(listItem);
        });
    }


    // ... (seu código anterior continua igual) ...

    // Mapeamento: Nome do tipo -> Nome da classe CSS
    const typeClasses = {
        fire: 'bg-fire',
        water: 'bg-water',
        electric: 'bg-electric',
        psychic: 'bg-psychic',
        ground: 'bg-ground',
        grass: 'bg-grass',
        fairy: 'bg-fairy',
    };

  function displayPokemon(pokemon) {
        // --- 1. LÓGICA DE CORES (Que fizemos antes) ---
        const mainType = pokemon.types[0].type.name;
        const cssClass = typeClasses[mainType] || 'bg-default';
        
        pokemonInfoDiv.className = 'pokemon-card'; 
        pokemonInfoDiv.classList.add(cssClass);

        // --- 2. FORMATAR TIPOS ---
        const types = pokemon.types
            .map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1))
            .join(', ');

        // --- 3. NOVA LÓGICA: GERAR BARRAS DE ESTATÍSTICAS ---
        let statsHtml = '<div class="stats-container"><h3>Estatísticas Base</h3>';
        
        pokemon.stats.forEach(statItem => {
            const statName = statItem.stat.name.replace('-', ' '); // Troca 'special-attack' por 'special attack'
            const statValue = statItem.base_stat;
            
            // Cálculo da porcentagem (Max teórico 255)
            const widthPercent = (statValue / 255) * 100;

            // Criando o HTML de uma linha (Nome + Barra + Valor)
            statsHtml += `
                <div class="stat-row">
                    <span class="stat-name">${statName}</span>
                    <div class="stat-bar-bg">
                        <div class="stat-bar-fill" style="width: ${widthPercent}%;"></div>
                    </div>
                    <span class="stat-value">${statValue}</span>
                </div>
            `;
        });
        
        statsHtml += '</div>'; // Fecha o container das stats

        // --- 4. MONTAGEM FINAL DO HTML ---
        const htmlContent = `
            <h2>${pokemon.name} (#${pokemon.id})</h2>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
            
            <p><strong>Tipo(s):</strong> ${types}</p>
            <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
            <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
            
            ${statsHtml}
        `;
        
        pokemonInfoDiv.innerHTML = htmlContent;
    }

    // --- CÓDIGO NOVO PARA RECEBER O CLIQUE DA OUTRA PÁGINA ---
    
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonFromUrl = urlParams.get('pokemon');

    if (pokemonFromUrl) {
     
        const input = document.getElementById('pokemon-input');
        const btn = document.getElementById('search-button');
        
        input.value = pokemonFromUrl;
        btn.click();
    }

});