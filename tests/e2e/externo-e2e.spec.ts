import { test, expect } from '@playwright/test';

const JOGO = 'Plants vs. Zombies GOTY Edition';

test.use({ locale: 'pt-BR' });

test('Adicionar e remover "Plants vs. Zombies GOTY Edition" do carrinho', async ({ page, context }) => {
  test.setTimeout(60_000);

  // Pré-condição: contexto novo (carrinho vazio) e loja em português
  await context.addCookies([
    { name: 'Steam_Language', value: 'brazilian', domain: 'store.steampowered.com', path: '/' },
  ]);

  // Dado que o usuário acessa a página inicial da loja Steam
  await page.goto('https://store.steampowered.com', { waitUntil: 'domcontentloaded' });

  // Quando ele pesquisa pelo jogo na barra de busca
  const campoBusca = page.getByRole('combobox', { name: /buscar na loja/i });
  await campoBusca.fill(JOGO);
  await campoBusca.press('Enter');

  // E seleciona o jogo correspondente na lista de resultados
  await page.locator('span.title', { hasText: JOGO }).first().click();

  // E clica no botão "+ Carrinho" na página do jogo
  await page
    .getByRole('region', { name: `Comprar ${JOGO}` })
    .getByRole('button', { name: '+ Carrinho' })
    .click();

  // E acessa a tela do carrinho de compras
  await page
    .getByRole('dialog')
    .filter({ hasText: 'Adicionado ao carrinho' })
    .getByRole('link', { name: /ver o meu carrinho/i })
    .click({ timeout: 15000 });
  await expect(page).toHaveURL(/\/cart/);
  await expect(page.getByText(JOGO).first()).toBeVisible();

  // E clica na opção "Remover" do item adicionado
  const botaoRemover = page.getByRole('button', { name: /^Remover Plants vs\. Zombies GOTY Edition/i });
  const mensagemVazio = page.getByText(/o carrinho está vazio/i);

  // Então a mensagem de carrinho vazio deve ser exibida (repete o clique se for perdido)
  await expect(async () => {
    if (await botaoRemover.isVisible()) {
      await botaoRemover.click({ timeout: 2000 });
    }
    await expect(mensagemVazio).toBeVisible({ timeout: 3000 });
  }).toPass({ timeout: 20000 });

  // E o jogo não deve mais aparecer na lista
  await expect(page.getByText(JOGO)).toHaveCount(0);
});