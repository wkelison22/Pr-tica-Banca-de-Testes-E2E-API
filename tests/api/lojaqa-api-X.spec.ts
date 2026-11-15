import { test, expect } from '@playwright/test';

test.describe('Testes de API e Resposta HTTP - LojaQA', () => {

  test('Deve verificar se a pagina principal responde com Status 200 OK', async ({ request }) => {
    // Faz uma requisição GET para a URL principal do sistema
    const response = await request.get('https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/loja.html');
    
    // Valida se o status code retornado é exatamente 200
    expect(response.status()).toBe(200);
    
    // Valida se o content type retornado e do tipo text/html, indicando que e uma pagina web html
    expect(response.headers()['content-type']).toContain('text/html');
  });

  test('Deve verificar se a rota de catalogo responde com sucesso', async ({ request }) => {
    // Faz uma requisição GET simulando o acesso à âncora/rota do catálogo
    const response = await request.get('https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/loja.html#catalogo');
    
    // Confirma que a página está acessível e respondendo
    expect(response.status()).toBe(200);
  });

  //aqui vamos fazer um teste de caminho triste
test.describe('Testes de Caminho Triste (Sad Path) - API / HTTP', () => {

  test('Deve retornar Status 404 ao tentar acessar uma pagina ou rota inexistente', async ({ request }) => {
    // Tentamos acessar um arquivo ou caminho que não existe no projeto do professor
    const response = await request.get('https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/pagina-que-nao-existe.html');
    
    // O caminho triste valida que o servidor respondeu com o código de erro adequado (404 Not Found)
    expect(response.status()).toBe(404);
  });

});
});