import {
  test as base,
  expect,
  Page,
  request as playwrightRequest,
  APIRequestContext,
} from '@playwright/test';

import { LoginPage } from '../pages/ModuloXPage';

type TestUserCredentials = {
  email: string;
  password: string;
};

type authFixture = {
  loginPage: LoginPage;
  adminPage: Page;
  clientPage: Page;
  adminApi: APIRequestContext;
  testUser: TestUserCredentials;
};

export const test = base.extend<authFixture>({
  // Fixture para a tela de login limpa
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.acessar();
    await use(loginPage);
  },

  // Fixture para o perfil Administrador
  adminPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.acessar();
    await loginPage.efetuarLogin('admin@system.com', 'AdminPassword123');
    await page.waitForURL(/painel\.html/);
    await use(page);
  },

  // Fixture para o perfil Cliente / Usuário Comum
  clientPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.acessar();
    await loginPage.efetuarLogin('cliente@system.com', 'ClientPassword123');
    await page.waitForURL(/dashboard\.html/);
    await use(page);
  },

  // Credenciais do usuário alvo para testes de bloqueio/restauração
  testUser: async ({}, use) => {
    await use({
      email: process.env.LOJAQA_TEST_USER_EMAIL || 'onaglei@live.co.uk',
      password: process.env.LOJAQA_TEST_USER_PASSWORD || '12345678',
    });
  },

  // Fixture para operações administrativas pela API
  adminApi: async ({}, use) => {
    const baseURL = process.env.BASE_URL;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_LOGIN_PASSWORD;

    if (!baseURL || !email || !password) {
      throw new Error('Configurações administrativas não encontradas no .env.');
    }

    const loginContext = await playwrightRequest.newContext({ baseURL });

    try {
      const loginResponse = await loginContext.post('login', {
        data: { email, password },
      });

      expect(loginResponse.status()).toBe(200);

      const loginData = await loginResponse.json();
      const token = loginData.token;

      expect(token).toBeTruthy();

      const adminApi = await playwrightRequest.newContext({
        baseURL,
        extraHTTPHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      try {
        await use(adminApi);
      } finally {
        await adminApi.dispose();
      }
    } finally {
      await loginContext.dispose();
    }
  },
});

export { expect } from '@playwright/test';