import { test, expect } from '@playwright/test';
import { SteamPage } from '../../pages/SteamPage';

const JOGO = 'Plants vs. Zombies GOTY Edition';

test.use({ locale: 'pt-BR' });

test('Adicionar e remover "Plants vs. Zombies GOTY Edition" do carrinho', async ({ page, context }) => {
  test.setTimeout(60_000);
  const steamPage = new SteamPage(page);

  // Pré-condição: contexto limpo e idioma forçado em português
  await context.addCookies([
    { name: 'Steam_Language', value: 'brazilian', domain: 'store.steampowered.com', path: '/' },
  ]);

  // Dado que o usuário acessa a loja e seleciona o jogo
  await steamPage.acessarLoja();
  await steamPage.buscarESelecionarJogo(JOGO);

  // Quando adiciona ao carrinho e navega para a tela do carrinho
  await steamPage.adicionarAoCarrinhoEVerCarrinho(JOGO);
  await expect(page).toHaveURL(/\/cart/);
  await expect(page.getByText(JOGO).first()).toBeVisible();

  // Então ao remover o item, o carrinho deve ficar vazio
  const botaoRemover = steamPage.obterBotaoRemover(JOGO);

  await expect(async () => {
    if (await botaoRemover.isVisible()) {
      await botaoRemover.click({ timeout: 2000 });
    }
    await expect(steamPage.mensagemVazio).toBeVisible({ timeout: 3000 });
  }).toPass({ timeout: 20000 });

  await expect(botaoRemover).toBeHidden();
});