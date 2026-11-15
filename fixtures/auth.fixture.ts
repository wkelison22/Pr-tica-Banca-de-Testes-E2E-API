import { test as base, expect, Page } from "@playwright/test";
import { LoginPage } from "../pages/ModuloXPage"; 
type authFixture = {
    loginPage: LoginPage;
    adminPage: Page;
    clientPage: Page;
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
    }
});

export { expect } from "@playwright/test";