import { Page, Locator } from "@playwright/test";

export class LoginPage {
    readonly linkLogin: Locator;
    readonly userInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    private page: Page;

    constructor(page: Page) {
        this.page = page;
        // Mapeamento dos elementos da pagina de login
        this.linkLogin = page.locator("#loginLink");
        this.userInput = page.locator("#email"); // Campo de e-mail/usuário
        this.passwordInput = page.locator("#password"); // Campo de senha
        this.loginButton = page.locator("#loginButton, button[type='submit']"); //botao para submeter login
    }

    async acessar() {
        await this.page.goto("https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/loja.html");
    }

    async efetuarLogin(username: string, password: string) {
        // Se a página inicial exibir o botao "Entrar", clica nele 
        if (await this.linkLogin.isVisible()) {
            await this.linkLogin.click();
        }
        
        // Preenche os dados e clica em entrar
        await this.userInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}