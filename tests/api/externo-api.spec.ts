import { test, expect, APIRequestContext } from '@playwright/test';

// Função para eu so chamar elas no test e facilitar o processo 
async function buscarNaAppleStore(request: APIRequestContext, termoDeBusca: string) {
    const resposta = await request.get(`https://itunes.apple.com/search?term=${termoDeBusca}&entity=software`);
    const corpoJson = await resposta.json();
    
    return { resposta, corpoJson };
}

test.describe("Desafio extra de api: Apple iTunes Store", () => {

    test('deve procurar um aplicativo valido e retornar um json', async ({ request }) => {
        // chamando a funcao
        const { resposta, corpoJson } = await buscarNaAppleStore(request, 'minecraft&limit=1');

        // Exibindo no console as interacoes

        console.log("teste do caminho feliz");
        console.log("Status code retornado: ", resposta.status());
         console.log("Nome do aplicativo retornado: ", corpoJson.results[0].trackName);
        console.log("Desenvolvedora: ", corpoJson.results[0].artistName);
    
        
        // validacoes do playwright

        expect(resposta.status()).toBe(200);
        expect(corpoJson.resultCount).toBe(1);
        expect(corpoJson.results[0].kind).toBe('software');
    });

    test('deve procurar por um aplicativo invalido e retornar lista vazia', async ({ request }) => {
        //chamando a funcao 

        const { resposta, corpoJson } = await buscarNaAppleStore(request, 'appquenaoexiste12345');

        // Exibindo no console as interacoes

        console.log("teste do caminho triste");
        console.log("Status code retornado: ", resposta.status());
        console.log("Quantidade de resultados mostrados: ", corpoJson.resultCount);


        // validacoes do playwright

        expect(resposta.status()).toBe(200);
        expect(corpoJson.resultCount).toBe(0);
         expect(corpoJson.results.length).toBe(0);

    });

});