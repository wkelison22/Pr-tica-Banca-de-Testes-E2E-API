#  Atividade Avaliativa Prática: Banca de Testes E2E & API (Módulo 12: Perfil & Segurança)

Este repositório contém a suíte de testes automatizados de ponta a ponta (E2E) desenvolvida para a validação do Módulo 12 (Admin: Moderação de Usuários & RBAC) da plataforma **Loja QA**, utilizando boas práticas de mercado e padrões exigidos em automação de qualidade de software.

##  O que o projeto contém

* **Testes E2E (Playwright + TypeScript):** Fluxos automatizados cobrindo os cenários críticos de autenticação, atualização de dados cadastrais, gerenciamento de endereços e segurança da conta no Módulo 12.
* **Padrão Page Object Model (POM):** Arquitetura estruturada para separar a lógica das páginas dos scripts de teste, garantindo alta manutenibilidade e legibilidade.
* **Seletores Semânticos e Resilientes:** Aplicação rigorosa de seletores baseados em acessibilidade e funções nativas do Playwright (`getByRole`, `getByLabel`, `getByPlaceholder`), evitando dependência de classes dinâmicas frágeis.
* **Boas Práticas de QA:** Ausência total de esperas arbitrárias (`waitForTimeout`), utilizando asserções dinâmicas e o sistema de *auto-waiting* nativo do framework.

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
  npm install
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
  Para confirma se todas as ferramentas foram confinguradas corretamente do navegador visível:
  
 * **Usando YARN:**
```bash
  yarn playwright test --headed
  ```
  
 * **Usando NPX:**
 ```bash
  npx playwright test --headed
 ```


## Execução dos Testes 

Após a instalação das dependências e dos navegadores, os testes podem ser executados de diferentes formas, conforme a necessidade.

### 1. Executar todos os testes (modo headless)

Roda toda a suíte sem abrir o navegador, modo ideal para validação rápida e para CI.

* **Usando NPX ou YARN:**
```bash
npx playwright test externo-api.spec.ts
```

**Evidência da execução:**

<img width="1917" height="1020" alt="execucao-headless" src="https://github.com/user-attachments/assets/89aca43b-6cf4-44d0-99c0-87ca1ece93a7" />


---

### 2. Executar com o navegador visível (modo headed)

Permite acompanhar visualmente cada passo da automação.

* **Usando NPX ou YARN:**
```bash
npx playwright test Steam-externo-e2e.spec.ts --headed
```

**Evidência da execução:**

<img width="1917" height="1017" alt="image" src="https://github.com/user-attachments/assets/de6799ec-a684-4f68-ac28-0a90247d68fc" />


### 4. Executar em modo interativo (UI Mode)

Abre a interface gráfica do Playwright, que permite executar, pausar e depurar os testes com linha do tempo.

* **Usando NPX ou YARN:**
```bash
npx playwright test Steam-externo-e2e.spec.ts --ui
```

**Evidência da execução:**

<img width="1917" height="1017" alt="image" src="https://github.com/user-attachments/assets/4d4aa690-bce1-414c-9805-6d3f9d38ab0d" />


---

### 5. Visualizar o relatório de resultados

Ao final da execução, o Playwright gera um relatório HTML com o status de cada teste (aprovado, falho ou ignorado), o tempo de execução e os detalhes de cada passo.

* **Usando NPX ou YARN:**
```bash
npx playwright show-report
```

**Evidência do relatório:**

<img width="1917" height="973" alt="image" src="https://github.com/user-attachments/assets/f26a65ca-68c6-45c1-8fe0-9d9da8c15d20" />


---

### Resultado esperado

Ao final da execução, todos os testes devem ser exibidos como **aprovados (passed)** no terminal e no relatório HTML, confirmando que os fluxos automatizados do Módulo 12 (Admin: Moderação de Usuários & RBAC) da plataforma **Loja QA** estão funcionando conforme o esperado.

 
  

  




 
