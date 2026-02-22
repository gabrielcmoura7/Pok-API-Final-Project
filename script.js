document.addEventListener('DOMContentLoaded', () => {
    
    const searchButton = document.getElementById('search-button');
    const pokemonInput = document.getElementById('pokemon-input');
    const pokemonInfoDiv = document.getElementById('pokemon-info');
    const searchHistory = []; 
    const historyListElement = document.getElementById('history-list');

   
    searchButton.addEventListener('click', () => {
        
        const pokemonNameOrId = pokemonInput.value.toLowerCase().trim();
        
        
        if (pokemonNameOrId) {
            fetchPokemon(pokemonNameOrId);
        } else {
            pokemonInfoDiv.innerHTML = '<p>Por favor, digite o nome ou ID do Pokémon.</p>';
        }
    });

   
    async function fetchPokemon(query) {
        
        pokemonInfoDiv.innerHTML = '<ul><li><p>Carregando...</p></li></ul>';
        
        try {
            
            const apiUrl = `https://pokeapi.co/api/v2/pokemon/${query}`;
            
            
            const response = await fetch(apiUrl);
            
            
            if (!response.ok) {
                
                throw new Error('Pokémon não encontrado!');
            }
            
            
            const data = await response.json();
            
           
            displayPokemon(data);

            if (!searchHistory.includes(data.name)) {
                searchHistory.push(data.name);
                displayHistory(); 
            }

        } catch (error) {
           
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
        
        const mainType = pokemon.types[0].type.name;
        const cssClass = typeClasses[mainType] || 'bg-default';
        
        pokemonInfoDiv.className = 'pokemon-card'; 
        pokemonInfoDiv.classList.add(cssClass);

      
        const types = pokemon.types
            .map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1))
            .join(', ');

        
        let statsHtml = '<div class="stats-container"><h3>Estatísticas Base</h3>';
        
        pokemon.stats.forEach(statItem => {
            const statName = statItem.stat.name.replace('-', ' '); // Troca 'special-attack' por 'special attack'
            const statValue = statItem.base_stat;
            
           
            const widthPercent = (statValue / 255) * 100;

          
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
        
        statsHtml += '</div>'; 

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

    
    
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonFromUrl = urlParams.get('pokemon');

    if (pokemonFromUrl) {
     
        const input = document.getElementById('pokemon-input');
        const btn = document.getElementById('search-button');
        
        input.value = pokemonFromUrl;
        btn.click();
    }

});