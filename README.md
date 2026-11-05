#  Atividade Avaliativa Prática: Banca de Testes E2E & API (Módulo 12: Perfil & Segurança)

Este repositório contém a suíte de testes automatizados de ponta a ponta (E2E) desenvolvida para a validação do Módulo 11 (Gestão de Perfil, Alteração de Endereço e Senha) da plataforma **Loja QA**, utilizando boas práticas de mercado e padrões exigidos em automação de qualidade de software.


##  O que o projeto contém

* **Testes E2E (Playwright + TypeScript):** Fluxos automatizados cobrindo os cenários críticos de autenticação, atualização de dados cadastrais, gerenciamento de endereços e segurança da conta no Módulo 11.
* **Padrão Page Object Model (POM):** Arquitetura estruturada para separar a lógica das páginas dos scripts de teste, garantindo alta manutenibilidade e legibilidade.
* **Seletores Semânticos e Resilientes:** Aplicação rigorosa de seletores baseados em acessibilidade e funções nativas do Playwright (`getByRole`, `getByLabel`, `getByPlaceholder`), evitando dependência de classes dinâmicas frágeis.
* **Boas Práticas de QA:** Ausência total de esperas arbitrárias (`waitForTimeout`), utilizando asserções dinâmicas e o sistema de *auto-waiting* nativo do framework.

---

##  Como Preparar o Ambiente

Para clonar e configurar o projeto em sua máquina local, certifique-se de ter o **Node.js** instalado e siga os passos abaixo:

### 1. Clonar o repositório e instalar as dependências
Abra o seu terminal na pasta do projeto e execute um dos gerenciadores de pacotes (Yarn ou NPM):

 * **Usando Yarn (Recomendado):**
  ```bash
  yarn install
   ```
  
 * **Usando NPM (Segunda opção recomendada):**
```bash
  yarn install
   ```
   
 ### 2. Instalar os Navegadores do Playwright
​ O Playwright precisa fazer o download dos executáveis dos navegadores (Chromium, Firefox, WebKit) para rodar a automação:

 * **Usando YARN:**
 ```bash
  yarn playwright install
   ```
   
 * **Usando NPX:**
  ```bash
  npx playwright install
   ```

  ### 3. Validar a instalação
  Para confirma a se todas as ferramentas foram confinguradas corretamente do navegador visível:
  
 * **Usando YARN:**
```bash
  yarn playwright test --headed
  ```
  
 * **Usando NPX:**
 ```bash
  npx playwright test --headed
 ```
  

  




 
