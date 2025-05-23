# MariStudy - Plataforma de Estudos Inteligente

## 📖 Sobre o Projeto

MariStudy é uma plataforma moderna de estudos desenvolvida com Next.js, oferecendo uma experiência de aprendizado interativa e personalizada. O projeto utiliza tecnologias de ponta para criar um ambiente de estudo eficiente e agradável.

## 💝 Inspiração

Este projeto nasceu de um propósito especial: ajudar uma amiga em sua jornada para conquistar o sonho de ingressar em medicina. A plataforma foi desenvolvida pensando em criar uma ferramenta que pudesse tornar o processo de estudos mais eficiente e organizado, especialmente para quem está se preparando para vestibulares concorridos como medicina.

A estrutura hierárquica de módulos e o sistema de sessões de estudo foram pensados especificamente para permitir uma organização eficiente do conteúdo, facilitando a revisão e o acompanhamento do progresso nos estudos.

## ✨ Destaques

- **Interface Moderna**: Desenvolvida com Next.js 15 e TailwindCSS
- **Editor Rico**: Integração com TipTap para edição de conteúdo avançada
- **Autenticação Segura**: Sistema de autenticação com NextAuth.js
- **Tema Escuro/Claro**: Suporte a múltiplos temas com next-themes
- **UI Componentes**: Biblioteca robusta de componentes com Radix UI
- **Banco de Dados**: Integração com Prisma para gerenciamento de dados
- **Drag and Drop**: Funcionalidades interativas com @hello-pangea/dnd
- **Gráficos e Visualizações**: Suporte a visualizações com Recharts
- **Validação de Formulários**: Integração com React Hook Form e Zod

## 🚀 Como Rodar

### Pré-requisitos

- Node.js (versão LTS recomendada)
- npm, yarn ou pnpm
- Docker (opcional, para ambiente de desenvolvimento)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/emsmoraes/memarizza
cd maristudy
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
DATABASE_URL="sua_url_do_banco_de_dados"
NEXTAUTH_SECRET="seu_secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

5. Acesse a aplicação em `http://localhost:3000`


## 🔧 Tecnologias Principais

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **UI**: Radix UI, TipTap Editor
- **Autenticação**: NextAuth.js
- **Banco de Dados**: Prisma
- **Estilização**: TailwindCSS
- **Formulários**: React Hook Form, Zod
- **Gráficos**: Recharts
- **Utilitários**: Moment.js, UUID


## 🎯 Desafios Técnicos e Soluções

### Estrutura Hierárquica de Módulos
Um dos maiores desafios do projeto foi implementar uma estrutura de árvore para os módulos de estudo, permitindo:
- Módulos pai e submodules (relacionamento recursivo)
- Clonagem de módulos mantendo a hierarquia
- Controle de acesso público/privado
- Rastreamento de progresso por usuário

A solução foi implementada através de um modelo de dados relacional no Prisma:
```prisma
model Module {
  id          String   @id @default(cuid())
  name        String
  description String?
  userId      String
  parentId    String?
  public      Boolean? @default(true)
  clones      Int?     @default(0)
  
  parent     Module?    @relation("ModuleHierarchy", fields: [parentId], references: [id])
  submodules Module[]   @relation("ModuleHierarchy")
  // ... outros campos
}
```

### Gerenciamento de Estado de Sessão
Outro desafio significativo foi o gerenciamento do estado das sessões de estudo, que inclui:
- Controle de progresso em tempo real
- Gerenciamento de respostas
- Sistema de revelação de respostas
- Persistência de estado entre navegações

A solução implementada utiliza um reducer personalizado:
```typescript
export type State = {
  currentQuestionIndex: number;
  answers: Record<string, string[]>;
  revealed: Record<string, boolean>;
};

// Ações como:
// - SET_CURRENT_QUESTION
// - ANSWER_QUESTION
// - SET_QUESTION_REVEAL
// - SET_ALL_QUESTIONS_REVEAL
// - CLEAR_ALL_ANSWERS
```

### Sistema de Sessões de Estudo
O projeto implementa um sistema robusto de sessões que permite:
- Múltiplas sessões simultâneas
- Rastreamento de progresso por sessão
- Persistência de respostas
- Ordenação personalizada de questões

```prisma
model ModuleSession {
  id        String   @id @default(cuid())
  userId    String
  progress  Float    @default(0)
  completed Boolean  @default(false)
  // ... outros campos
}
```
