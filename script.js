const cryptoList = document.getElementById('crypto-list');
const btnAtualizar = document.querySelector('button');

/* Lista de moedas para buscar na API */
const moedas = [
    { id: 'BTC', nome: 'Bitcoin' },
    { id: 'ETH', nome: 'Ethereum' },
    { id: 'SOL', nome: 'Solana' },
    { id: 'ADA', nome: 'Cardano' }
];

/* Função para buscar os dados do Mercado Bitcoin */
async function buscarPrecos() {
    // Mensagem de carregando
    cryptoList.innerHTML = '<div class="loader">Sincronizando...</div>';
    
    try {
        // Faz as requisições de todas as moedas ao mesmo tempo
        const promessas = moedas.map(async (moeda) => {
            const res = await fetch(`https://www.mercadobitcoin.net/api/${moeda.id}/ticker/`);
            const data = await res.json();
            
            return {
                nome: moeda.nome,
                simbolo: moeda.id,
                preco: parseFloat(data.ticker.last)
            };
        });

        const resultados = await Promise.all(promessas);

        // Limpa a tela antes de mostrar os preços
        cryptoList.innerHTML = '';

        // Cria o HTML de cada card de moeda
        resultados.forEach(coin => {
            const card = `
                <div class="coin-card">
                    <div class="coin-info">
                        <p class="coin-name">${coin.nome}</p>
                        <p class="coin-symbol">${coin.simbolo}</p>
                    </div>
                    <div class="coin-price">
                        R$ ${coin.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
            `;
            cryptoList.innerHTML += card;
        });

    } catch (error) {
        // Mostra mensagem de erro caso a API falhe
        console.error(error);
        cryptoList.innerHTML = '<p style="color: #ff4d4d">Erro ao conectar com o servidor. Tente novamente.</p>';
    }
}

/* Chama a função assim que a página abre */
buscarPrecos();

/* Atualiza os dados automaticamente a cada 30 segundos */
setInterval(buscarPrecos, 30000);