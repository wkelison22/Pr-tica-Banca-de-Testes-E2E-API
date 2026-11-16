import { Page, Locator } from '@playwright/test';

export class SteamPage {
  readonly page: Page;
  readonly campoBusca: Locator;
  readonly mensagemVazio: Locator;

  constructor(page: Page) {
    this.page = page;
    this.campoBusca = page.getByRole('combobox', { name: /buscar na loja/i });
    this.mensagemVazio = page.getByText(/o carrinho está vazio/i);
  }

  async acessarLoja() {
    await this.page.goto('https://store.steampowered.com', { waitUntil: 'domcontentloaded' });
  }

  async buscarESelecionarJogo(nomeJogo: string) {
    await this.campoBusca.fill(nomeJogo);
    await this.campoBusca.press('Enter');
    await this.page.getByRole('link', { name: new RegExp(nomeJogo, 'i') }).first().click();
  }

  async adicionarAoCarrinhoEVerCarrinho(nomeJogo: string) {
    await this.page
      .getByRole('region', { name: `Comprar ${nomeJogo}` })
      .getByRole('button', { name: '+ Carrinho' })
      .click();

    await this.page
      .getByRole('dialog')
      .filter({ hasText: 'Adicionado ao carrinho' })
      .getByRole('link', { name: /ver o meu carrinho/i })
      .click({ timeout: 15000 });
  }

  obterBotaoRemover(nomeJogo: string): Locator {
    return this.page.getByRole('button', { name: new RegExp(`^Remover ${nomeJogo}`, 'i') });
  }
}