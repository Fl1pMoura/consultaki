<div align="center">

# 🏥 Consultaki

**Sistema completo de gestão de consultas médicas**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📋 Sobre o Projeto

O **Consultaki** é uma plataforma moderna e completa para gestão de consultas médicas, desenvolvida com as mais recentes tecnologias do ecossistema React. O sistema permite que clínicas gerenciem médicos, pacientes e agendamentos de forma eficiente e intuitiva, com um dashboard rico em métricas e visualizações.

### ✨ Principais Funcionalidades

- 🔐 **Autenticação Segura** - Sistema de autenticação com BetterAuth (email/senha e magic link)
- 🏥 **Gestão de Clínicas** - Cadastro e gerenciamento de múltiplas clínicas
- 👨‍⚕️ **Gestão de Médicos** - Cadastro de médicos com especialidades, horários de disponibilidade e preços
- 👤 **Gestão de Pacientes** - Cadastro completo de pacientes com dados pessoais e histórico
- 📅 **Agendamento de Consultas** - Sistema completo de agendamento com status (pendente, confirmado, cancelado)
- 📊 **Dashboard Analítico** - Visualizações e métricas em tempo real:
  - Receita total
  - Número de consultas
  - Total de pacientes e médicos
  - Gráficos de consultas por período
  - Top médicos mais consultados
  - Distribuição por especialidades
- 📸 **Upload de Imagens** - Integração com AWS S3 para armazenamento de imagens
- 🎨 **Interface Moderna** - UI construída com shadcn/ui e Tailwind CSS
- 📱 **Responsivo** - Totalmente adaptável para diferentes tamanhos de tela

---

## 🛠️ Stack Tecnológica

### Frontend

- **Next.js 16** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização utilitária
- **shadcn/ui** - Componentes UI acessíveis
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Recharts** - Visualizações e gráficos
- **TanStack Query** - Gerenciamento de estado servidor
- **TanStack Table** - Tabelas de dados avançadas

### Backend

- **Next.js Server Actions** - API routes e server actions
- **next-safe-action** - Type-safe server actions
- **BetterAuth** - Autenticação moderna e segura
- **PostgreSQL** - Banco de dados relacional
- **Drizzle ORM** - ORM type-safe
- **AWS S3** - Armazenamento de arquivos

### Ferramentas de Desenvolvimento

- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Husky** - Git hooks
- **Commitlint** - Padronização de commits
- **Commitizen** - Commits interativos

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **pnpm** ou **npm** ([pnpm Installation](https://pnpm.io/installation))
- **Conta AWS** (para upload de imagens no S3) - _Opcional para desenvolvimento local_

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/consultaki.git
cd consultaki
```

### 2. Instale as dependências

```bash
pnpm install
# ou
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/consultaki"

# Autenticação
BETTER_AUTH_SECRET="sua-chave-secreta-aqui"
BETTER_AUTH_URL="http://localhost:3000"

# AWS S3 (Opcional para desenvolvimento)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="sua-access-key"
AWS_SECRET_ACCESS_KEY="sua-secret-key"
AWS_S3_BUCKET_NAME="nome-do-bucket"
```

> **Nota:** Para gerar uma chave secreta segura, você pode usar:
>
> ```bash
> openssl rand -base64 32
> ```

### 4. Configure o banco de dados

Execute as migrações do Drizzle:

```bash
pnpm drizzle-kit push
# ou
npx drizzle-kit push
```

### 5. Inicie o servidor de desenvolvimento

```bash
pnpm dev
# ou
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📁 Estrutura do Projeto

```
consultaki/
├── app/                          # App Router do Next.js
│   ├── (protected)/             # Rotas protegidas
│   │   ├── dashboard/           # Dashboard principal
│   │   ├── appointments/        # Gestão de consultas
│   │   ├── doctors/             # Gestão de médicos
│   │   ├── patients/            # Gestão de pacientes
│   │   ├── clinics/             # Gestão de clínicas
│   │   └── _components/         # Componentes compartilhados
│   ├── _actions/                # Server Actions
│   ├── _data/                   # Funções de acesso a dados
│   ├── _helpers/                # Funções auxiliares
│   ├── _providers/              # Providers React
│   ├── api/                     # API Routes
│   └── auth/                    # Páginas de autenticação
├── components/                   # Componentes UI (shadcn/ui)
│   └── ui/
├── db/                          # Configuração do banco
│   ├── schema.ts               # Schema do Drizzle
│   └── index.ts                # Instância do Drizzle
├── lib/                         # Bibliotecas e configurações
│   ├── auth.ts                 # Configuração BetterAuth
│   └── utils.ts                # Utilitários
└── public/                      # Arquivos estáticos
```

---

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia servidor de desenvolvimento

# Produção
pnpm build        # Cria build de produção
pnpm start        # Inicia servidor de produção

# Qualidade de Código
pnpm lint         # Executa ESLint

# Banco de Dados
pnpm drizzle-kit push     # Aplica mudanças no schema
pnpm drizzle-kit studio  # Abre Drizzle Studio (GUI)
pnpm drizzle-kit generate # Gera migrações

# Git
pnpm commit       # Commit interativo (Commitizen)
```

---

## 🔧 Configuração Adicional

### AWS S3 Setup

Para habilitar o upload de imagens, você precisa:

1. Criar um bucket S3 na AWS
2. Configurar as credenciais IAM com permissões de leitura/escrita
3. Configurar as variáveis de ambiente conforme mostrado acima

Consulte os arquivos `AWS_S3_SETUP.md` e `S3_PRESIGNED_UPLOAD_SETUP.md` para mais detalhes.

### Banco de Dados

O projeto usa **Drizzle ORM** para gerenciar o schema do banco. As migrações estão em `drizzle/`.

Para visualizar o banco de dados de forma visual:

```bash
pnpm drizzle-kit studio
```

---

## 🎨 Padrões de Código

O projeto segue padrões rigorosos de qualidade:

- **TypeScript** estrito em todo o código
- **kebab-case** para nomes de arquivos e pastas
- **Componentes reutilizáveis** seguindo DRY
- **Server Actions** type-safe com `next-safe-action`
- **Validação** com Zod em todos os formulários
- **Commits** seguindo Conventional Commits

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Sinta-se à vontade para:

1. Fazer um Fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

### Padrão de Commits

Este projeto usa [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação, ponto e vírgula faltando, etc
- `refactor:` Refatoração de código
- `test:` Adição de testes
- `chore:` Mudanças em build, dependências, etc

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👨‍💻 Autor

**Felipe Moura**

- [GitHub](https://github.com/Fl1pMoura/consultaki)
- [LinkedIn](https://www.linkedin.com/in/felipe-moura-384a95270/)

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework incrível
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI de alta qualidade
- [Drizzle ORM](https://orm.drizzle.team/) - ORM type-safe
- [BetterAuth](https://www.better-auth.com/) - Autenticação moderna
- Todos os mantenedores das bibliotecas open-source utilizadas

---

<div align="center">

**Desenvolvido com ❤️ usando Next.js e TypeScript**

</div>
