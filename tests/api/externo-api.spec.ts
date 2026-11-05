import { test, expect, APIRequestContext } from '@playwright/test';

async function buscarNaAppleStore(
    request: APIRequestContext,
    termoDeBusca: string,
    limite?: number
) {
    const resposta = await request.get('https://itunes.apple.com/search', {
        params: {
            term: termoDeBusca,
            entity: 'software',
            ...(limite && { limit: limite }),
        },
    });
    const corpoJson = await resposta.json();

    return { resposta, corpoJson };
}

test.describe("Desafio extra de api: Apple iTunes Store", () => {

    test('deve procurar um aplicativo valido e retornar um json', async ({ request }) => {
        const { resposta, corpoJson } = await buscarNaAppleStore(request, 'minecraft', 1);

        console.log("teste do caminho feliz");
        console.log("Status code retornado: ", resposta.status());
        console.log("Nome do aplicativo retornado: ", corpoJson.results[0].trackName);
        console.log("Desenvolvedora: ", corpoJson.results[0].artistName);

        expect(resposta.status()).toBe(200);
        expect(corpoJson.resultCount).toBe(1);
        expect(corpoJson.results[0].kind).toBe('software');
    });

   test('deve procurar por um aplicativo invalido e nao retornar app correspondente', async ({ request }) => {
    const termoInvalido = 'appquenaoexiste12345';

    const { resposta, corpoJson } = await buscarNaAppleStore(request, termoInvalido);

    console.log("teste do caminho triste");
    console.log("Status code retornado: ", resposta.status());
    console.log("nome procurado na barra de pesquisa: ", termoInvalido);
    console.log("Quantidade de resultados mostrados: ", corpoJson.resultCount);

    // o contrato da API: status 200 e contagem coerente com a lista
    expect(resposta.status()).toBe(200);
    expect(corpoJson.results).toHaveLength(corpoJson.resultCount);

    // nenhum app retornado tem exatamente o nome pesquisado
    for (const app of corpoJson.results) {
        expect(app.trackName.toLowerCase()).not.toBe(termoInvalido);
    }
});

});