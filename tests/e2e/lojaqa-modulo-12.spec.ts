import { test, expect } from '../../fixtures/auth.fixture';
import { AdminPage } from '../../pages/AdminPage';

const LOGIN_URL =
  'https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/login.html';

// E2E-05 - Bloqueia um usuário, valida a rejeição do login e restaura a conta.
test('E2E-05 - Bloquear, impedir login e restaurar usuário', async ({
  page,
  browser,
  testUser,
}) => {
  // Firefox e WebKit são mais lentos no GitHub Pages.
  test.setTimeout(60_000);

  const adminPage = new AdminPage(page);
  const { email, password } = testUser;

  // Sessão independente para simular o usuário (contexto isolado do admin).
  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();

  let restorationNeeded = false;

  try {
    // Administrador acessa o gerenciamento de usuários.
    await adminPage.login();
    await adminPage.openAdministration();
    await adminPage.openUsers();

    const searchField = page.getByPlaceholder('Buscar por nome ou e-mail...');
    await searchField.fill(email);

    const userCard = page.getByRole('article').filter({ hasText: email });
    const roleSelect = userCard.locator('select[data-field="role"]');

    await expect(userCard).toBeVisible();

    // Idempotência: se uma execução anterior (ou outro navegador) deixou
    // a conta bloqueada, normaliza o estado antes de começar.
    if ((await roleSelect.inputValue()) !== 'user') {
      await adminPage.updateUserRole(email, 'user');
      await expect(roleSelect).toHaveValue('user');
    }

    // Confirma que a conta começa como Cliente.
    await expect(roleSelect).toHaveValue('user');

    // Marca que a restauração será necessária antes de tentar bloquear.
    restorationNeeded = true;

    // Administrador bloqueia a conta pela interface.
    await adminPage.updateUserRole(email, 'blocked');
    await expect(roleSelect).toHaveValue('blocked');

    console.log('E2E-05: usuário bloqueado pela interface.');

    // Usuário tenta entrar em uma sessão independente.
    await userPage.goto(LOGIN_URL);
    await userPage.locator('#email').fill(email);
    await userPage.locator('#password').fill(password);
    await userPage.getByRole('button', { name: 'Entrar' }).click();

    // Confirma que o acesso foi rejeitado.
    await expect(userPage.locator('#errorMessage')).toBeVisible();
    await expect(userPage.locator('#errorMessage')).toContainText('Usuário bloqueado');
    await expect(userPage).toHaveURL(/login\.html/);

    await expect
      .poll(() => userPage.evaluate(() => localStorage.getItem('token')))
      .toBeNull();

    console.log('E2E-05: login do usuário bloqueado impedido.');
  } finally {
    try {
      if (restorationNeeded && !page.isClosed()) {
        // Restaura sem asserção aqui, para não mascarar o erro original do teste.
        await adminPage.updateUserRole(email, 'user');
        console.log('E2E-05: usuário restaurado para CLIENTE.');
      }
    } finally {
      await userContext.close();
    }
  }
});