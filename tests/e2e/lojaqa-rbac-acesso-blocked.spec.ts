import { test, expect } from '@playwright/test';
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

  console.log('Perfis de acesso identificados corretamente.');
});

// E2E-06 - Impede o login de usuário bloqueado.
test('E2E-06 - Impedir login de usuário bloqueado', async ({ page }) => {
  await page.goto(
    'https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/login.html'
  );

  // Confirma que a tela de login foi carregada.
  await expect(
    page.getByRole('heading', { name: 'Acesso à LojaQA' })
  ).toBeVisible();

  await page.locator('#email').fill('blocked@system.com');

  await page
    .getByPlaceholder('Mínimo de 8 caracteres')
    .fill('Blocked123');

  // Tenta autenticar com a conta bloqueada.
  await page.getByRole('button', { name: 'Entrar' }).click();

  // Aguarda e valida a mensagem de bloqueio.
  await expect(
    page.getByText('Usuário bloqueado. Tentativa 1 de 3.', {
      exact: true,
    })
  ).toBeVisible({ timeout: 10000 });

  // Confirma que o usuário permanece na tela de login.
  await expect(page).toHaveURL(/login\.html/);

  await expect(
    page.getByRole('heading', { name: 'Acesso à LojaQA' })
  ).toBeVisible();

  console.log('E2E-06: acesso do usuário bloqueado impedido.');
});
