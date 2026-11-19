import { test, expect } from '../../fixtures/auth.fixture';
import { AdminPage } from '../../pages/AdminPage';

// E2E-05 - Bloqueia um usuário, valida a rejeição do login e restaura a conta.
test('E2E-05 - Bloquear, impedir login e restaurar usuário', async ({
  page,
  browser,
  testUser,
}) => {
  const adminPage = new AdminPage(page);
  const { email, password } = testUser;

  // Cria uma segunda sessão independente para simular o usuário.
  const userPage = await browser.newPage();

  let restorationNeeded = false;

  try {
    // Administrador acessa o gerenciamento de usuários.
    await adminPage.login();
    await adminPage.openAdministration();
    await adminPage.openUsers();

    const searchField = page.getByPlaceholder('Buscar por nome ou e-mail...');

    await searchField.fill(email);

    const userCard = page.getByRole('article').filter({
      hasText: email,
    });

    const roleSelect = userCard.locator('select[data-field="role"]');

    await expect(userCard).toBeVisible();

    // Confirma que a conta começa como Cliente.
    await expect(roleSelect).toHaveValue('user');

    // Marca que a restauração será necessária antes de tentar bloquear.
    restorationNeeded = true;

    // Administrador bloqueia a conta pela interface.
    await adminPage.updateUserRole(email, 'blocked');

    await expect(roleSelect).toHaveValue('blocked');

    console.log('E2E-05: usuário bloqueado pela interface.');

    // Usuário tenta entrar em uma sessão independente.
    await userPage.goto(
      'https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/login.html'
    );

    await userPage.locator('#email').fill(email);
    await userPage.locator('#password').fill(password);

    await userPage.getByRole('button', { name: 'Entrar' }).click();

    // Confirma que o acesso foi rejeitado.
    await expect(userPage.locator('#errorMessage')).toBeVisible();

    await expect(userPage.locator('#errorMessage')).toContainText(
      'Usuário bloqueado'
    );

    await expect(userPage).toHaveURL(/login\.html/);

    await expect
      .poll(() => userPage.evaluate(() => localStorage.getItem('token')))
      .toBeNull();

    console.log('E2E-05: login do usuário bloqueado impedido.');
  } finally {
    try {
      if (restorationNeeded) {
        await adminPage.updateUserRole(email, 'user');

        await expect(
          page
            .getByRole('article')
            .filter({ hasText: email })
            .locator('select[data-field="role"]')
        ).toHaveValue('user');

        console.log('E2E-05: usuário restaurado para CLIENTE.');
      }
    } finally {
      await userPage.close();
    }
  }
});