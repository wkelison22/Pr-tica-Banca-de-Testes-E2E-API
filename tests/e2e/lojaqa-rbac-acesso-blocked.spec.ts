import { test, expect } from '../../fixtures/auth.fixture';
import { AdminPage } from '../../pages/AdminPage';

// E2E-04 - Valida os perfis de acesso dos usuários.
test('E2E-04 - Validar perfis de acesso dos usuários', async ({ page }) => {
  const adminPage = new AdminPage(page);

  await adminPage.login();
  await adminPage.openAdministration();
  await adminPage.openUsers();

  // Aguarda o carregamento da listagem de usuários.
  await expect(
    page.getByPlaceholder('Buscar por nome ou e-mail...')
  ).toBeVisible({ timeout: 10000 });

  // Verifica a presença dos quatro perfis de acesso.
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

// E2E-05 - Bloqueia e restaura o perfil de um usuário.
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

  // Consulta a API para localizar o ID da conta de teste.
  const usersResponse = await adminApi.get('users');
  expect(usersResponse.status()).toBe(200);

  const users = await usersResponse.json();

  const testUser = users.find(
    (user: { _id?: string; email?: string }) => user.email === email
  );

  expect(testUser).toBeTruthy();
  expect(testUser._id).toBeTruthy();

  try {
    // Prepara a conta com o perfil CLIENTE.
    const setupResponse = await adminApi.put(`users/${testUser._id}`, {
      data: {
        role: 'user',
        adminPassword,
      },
    });

    expect(setupResponse.status()).toBe(200);

    const setupData = await setupResponse.json();
    expect(setupData.user.role).toBe('user');

    // Executa a alteração pela interface administrativa.
    await adminPage.login();
    await adminPage.openAdministration();
    await adminPage.openUsers();

    await page
      .getByPlaceholder('Buscar por nome ou e-mail...')
      .fill(email);

    const userCard = page.getByRole('article').filter({
      hasText: email,
    });

    await expect(userCard).toBeVisible({ timeout: 10000 });

    // Confirma o perfil inicial na interface.
    await expect(
      userCard.locator('select[data-field="role"]')
    ).toHaveValue('user');

    // Bloqueia o usuário pela interface.
    await adminPage.updateUserRole(email, 'blocked');

    await expect(
      userCard.locator('select[data-field="role"]')
    ).toHaveValue('blocked', { timeout: 10000 });

    // Confirma pela API que o bloqueio foi persistido.
    await expect.poll(async () => {
      const verifyResponse = await adminApi.get('users');
      expect(verifyResponse.status()).toBe(200);

      const updatedUsers = await verifyResponse.json();

      const updatedUser = updatedUsers.find(
        (user: { _id?: string; role?: string }) =>
          user._id === testUser._id
      );

      return updatedUser?.role;
    }, { timeout: 10000 }).toBe('blocked');

    console.log('E2E-05: perfil alterado para BLOQUEADO e confirmado pela API.');

  } finally {
    // Restaura o perfil da conta para CLIENTE pela API.
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
