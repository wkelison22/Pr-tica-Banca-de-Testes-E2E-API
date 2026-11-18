import { test, expect } from '../../fixtures/auth.fixture';
import { AdminPage } from '../../pages/AdminPage';

// E2E-04 - Confere os perfis dos usuários.
test('E2E-04 - Validar perfis de acesso dos usuários', async ({ page }) => {
  const adminPage = new AdminPage(page);

  await adminPage.login();
  await adminPage.openAdministration();
  await adminPage.openUsers();

  // Espera o campo de pesquisa aparecer na tela.
  await expect(
    page.getByPlaceholder('Buscar por nome ou e-mail...')
  ).toBeVisible();

  // Confere se os quatro perfis aparecem na tela.
  await expect(
    page.getByText('Administrador Geral admin@system.com', { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText('Usuário Padrão user@system.com', { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText('Usuário Bloqueado blocked@system.com', { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText('LojaQA Oficial lojista@system.com', { exact: true })
  ).toBeVisible();

  console.log('E2E-04: perfis de acesso identificados corretamente.');
});

// E2E-05 - Bloqueia um usuário e depois libera novamente.
test('E2E-05 - Bloquear e restaurar perfil de usuário', async ({
  page,
  adminApi,
}) => {
  const adminPage = new AdminPage(page);
  const email = 'onaglei@live.co.uk';
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD não encontrada no .env.');
  }

  // Busca na API o usuário que será usado no teste.
  const usersResponse = await adminApi.get('users');
  expect(usersResponse.status()).toBe(200);

  const users = await usersResponse.json();

  const testUser = users.find(
    (user: { _id?: string; email?: string }) => user.email === email
  );

  expect(testUser).toBeTruthy();
  expect(testUser._id).toBeTruthy();

  try {
    // Garante que a conta comece como usuário comum.
    const setupResponse = await adminApi.put(`users/${testUser._id}`, {
      data: {
        role: 'user',
        adminPassword,
      },
    });

    expect(setupResponse.status()).toBe(200);

    const setupData = await setupResponse.json();
    expect(setupData.user.role).toBe('user');

    // Faz o login e acessa a tela de administração.
    await adminPage.login();
    await adminPage.openAdministration();
    await adminPage.openUsers();

    // Confere se o campo de pesquisa está visível.
    await expect(
      page.getByPlaceholder('Buscar por nome ou e-mail...')
    ).toBeVisible();

    await page
      .getByPlaceholder('Buscar por nome ou e-mail...')
      .fill(email);

    const userCard = page.getByRole('article').filter({
      hasText: email,
    });

    await expect(userCard).toBeVisible();

    // Confere se o usuário está com o perfil comum.
    await expect(
      userCard.locator('select[data-field="role"]')
    ).toHaveValue('user');

    // Altera o perfil do usuário para bloqueado pela tela.
    await adminPage.updateUserRole(email, 'blocked');

    await expect(
      userCard.locator('select[data-field="role"]')
    ).toHaveValue('blocked');

    // Confere na API se o bloqueio foi realmente salvo.
    await expect.poll(async () => {
      const verifyResponse = await adminApi.get('users');
      expect(verifyResponse.status()).toBe(200);

      const updatedUsers = await verifyResponse.json();

      const updatedUser = updatedUsers.find(
        (user: { _id?: string; role?: string }) =>
          user._id === testUser._id
      );

      return updatedUser?.role;
    }).toBe('blocked');

    console.log('E2E-05: perfil alterado para BLOQUEADO e confirmado pela API.');

  } finally {
    // Volta o usuário para o perfil comum pela API.
    const restoreResponse = await adminApi.put(`users/${testUser._id}`, {
      data: {
        role: 'user',
        adminPassword,
      },
    });

    expect(restoreResponse.status()).toBe(200);

    const restoreData = await restoreResponse.json();
    expect(restoreData.user.role).toBe('user');

    console.log('E2E-05: perfil restaurado para CLIENTE pela API.');
  }
});

// E2E-06 - Impede que usuários comuns visualizem a área administrativa.
test('E2E-06 - Impedir acesso à Administração por usuário comum', async ({
  page,
}) => {
  await page.goto(
    'https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/login.html'
  );

  await page.locator('#email').fill('user@system.com');
  await page.locator('#password').fill('UserPassword123');

  await Promise.all([
    page.waitForURL('**/painel.html'),
    page.getByRole('button', { name: 'Entrar' }).click(),
  ]);

  // Confirma que o usuário comum acessou seu painel.
  await expect(page.getByRole('link', { name: 'Meu Perfil' })).toBeVisible();

  // Confirma que a área administrativa não está disponível.
  await expect(
    page.getByRole('link', { name: 'Administração' })
  ).toHaveCount(0);

  console.log('E2E-06: usuário comum sem acesso à Administração.');
});

// E2E-07 - Impede que usuários bloqueados façam login.
test('E2E-07 - Impedir login de usuário bloqueado', async ({ page }) => {
  await page.goto(
    'https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/login.html'
  );

  await page.locator('#email').fill('blocked@system.com');
  await page.locator('#password').fill('Blocked123');

  await page.getByRole('button', { name: 'Entrar' }).click();

  // Confirma que o sistema apresentou uma mensagem de erro.
  await expect(page.locator('#errorMessage')).toBeVisible();

  // Confirma que o usuário permaneceu na tela de login.
  await expect(page).toHaveURL(/login\.html/);

  // Confirma que nenhum token de autenticação foi armazenado.
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('token')))
    .toBeNull();

  console.log('E2E-07: login de usuário bloqueado impedido.');
});
