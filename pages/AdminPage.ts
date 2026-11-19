import { Page, expect } from '@playwright/test';

// Reúne as ações administrativas utilizadas nos testes E2E.
export class AdminPage {
  constructor(private page: Page) {}

  // Realiza o login administrativo e aguarda o acesso ao painel.
  async login(
    adminEmail = process.env.ADMIN_EMAIL || 'admin@system.com',
    adminPassword = process.env.ADMIN_LOGIN_PASSWORD || 'AdminPassword123'
  ) {
    await this.page.goto(
      'https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/login.html'
    );

    await this.page.locator('#email').fill(adminEmail);

    await this.page
      .getByPlaceholder('Mínimo de 8 caracteres')
      .fill(adminPassword);

    await Promise.all([
      this.page.waitForURL('**/painel.html'),
      this.page.getByRole('button', { name: 'Entrar' }).click(),
    ]);

    await this.page.waitForLoadState('domcontentloaded');
  }

  // Acessa a área de administração.
  async openAdministration() {
    await this.page.getByText('Administração', { exact: true }).click();
  }

  // Abre o gerenciamento de usuários, se ainda não estiver ativo.
  async openUsers() {
    const usersTab = this.page.locator('button[data-tab="users"]');

    await usersTab.waitFor({ state: 'visible' });

    if (
      !(await usersTab.evaluate((element) =>
        element.classList.contains('active')
      ))
    ) {
      await usersTab.click();
    }

    await this.page
      .getByPlaceholder('Buscar por nome ou e-mail...')
      .waitFor({ state: 'visible' });
  }

  // Aplica o filtro de usuários bloqueados.
  async filterBlockedUsers() {
    await this.page.locator('#adminUserRole').selectOption('blocked');
  }

  // Altera o perfil de acesso de um usuário específico e aguarda a atualização.
  async updateUserRole(email: string, role: 'user' | 'blocked') {
    const userCard = this.page.getByRole('article').filter({
      hasText: email,
    });

    const roleSelect = userCard.locator('select[data-field="role"]');

    // Expande o cartão caso o campo de edição esteja recolhido.
    if (!(await roleSelect.isVisible())) {
      await userCard.getByText(email, { exact: true }).click();
    }

    await roleSelect.selectOption(role);

    const saveButton = userCard.getByRole('button', {
      name: 'Salvar Alterações',
    });

    await saveButton.waitFor({
      state: 'visible',
    });

    await saveButton.click();

    await expect(roleSelect).toHaveValue(role);
  }
}