---
description: Como fazer o deploy do projeto no Vercel
---

Este guia explica como colocar seu projeto online usando a Vercel.

## Opção 1: Usando a Vercel CLI (Mais Rápido)

Se você não quiser criar um repositório no GitHub agora, pode usar a linha de comando da Vercel.

1.  **Instale a CLI da Vercel** (caso não tenha):
    ```bash
    npm install -g vercel
    ```

2.  **Faça Login na Vercel**:
    ```bash
    vercel login
    ```
    *Siga as instruções no navegador para autorizar.*

3.  **Faça o Deploy**:
    Na pasta do projeto, rode:
    ```bash
    vercel
    ```

4.  **Configure o Projeto**:
    A CLI fará algumas perguntas. Use as configurações padrão (basta dar Enter):
    *   Set up and deploy? [Y/n] **Y**
    *   Which scope do you want to deploy to? **(Seu Usuário)**
    *   Link to existing project? [y/N] **N**
    *   What’s your project’s name? **(Nome do seu projeto)**
    *   In which directory is your code located? **./**
    *   Want to modify these settings? [y/N] **N**

    O Vercel detectará automaticamente que é um projeto Vite e fará o build.

5.  **Deploy de Produção**:
    O comando acima cria uma versão de "Preview". Para lançar em produção (domínio oficial), rode:
    ```bash
    vercel --prod
    ```

---

## Opção 2: Via GitHub (Recomendado)

Essa opção é melhor para manter o histórico e fazer deploys automáticos a cada alteração.

1.  **Repositório Local já Inicializado**:
    Já rodei os comandos `git init`, `git add` e `git commit` para você. O repositório local está pronto.

2.  **Crie um repositório no GitHub**:
    *   Vá em [github.com/new](https://github.com/new).
    *   Dê um nome ao repositório (ex: `obo-dashboard`).
    *   **Não** marque "Initialize with README" ou .gitignore (já temos isso).
    *   Clique em **Create repository**.

3.  **Conecte e Envie o Código**:
    Copie os comandos que aparecem na seção **"…or push an existing repository from the command line"** e rode no seu terminal.
    Geralmente são estes:
    ```bash
    git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git
    git branch -M main
    git push -u origin main
    ```

4.  **Conecte na Vercel**:
    *   Acesse [vercel.com/new](https://vercel.com/new).
    *   Clique em **"Import"** ao lado do seu repositório do GitHub.
    *   Nas configurações de "Build and Output Settings", o Vercel já deve detectar `Vite` automaticamente.
    *   Clique em **Deploy**.

> **Nota:** Já criei um arquivo `vercel.json` na raiz do projeto para garantir que as rotas funcionem corretamente (evitando erro 404 ao recarregar páginas).
