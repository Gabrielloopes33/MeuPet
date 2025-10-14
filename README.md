# 🐾 MeuPet - Sistema de Gerenciamento de Pets

<div align="center">
  <img src="./assets/images/icon.png" alt="MeuPet Logo" width="120" />
  
  ### Aplicativo Mobile Completo para Gerenciamento de Pets e Serviços Veterinários
  
  [![React Native](https://img.shields.io/badge/React_Native-0.81.4-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-54.0.12-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![NestJS](https://img.shields.io/badge/NestJS-11.0.1-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
</div>

---

## 📋 Sobre o Projeto

**MeuPet** é uma solução mobile completa e moderna desenvolvida com React Native e Expo para gerenciamento de pets, agendamentos veterinários e localização de serviços pet. O projeto demonstra domínio de tecnologias atuais do mercado, arquitetura bem estruturada e implementação de boas práticas de desenvolvimento.

Este é um projeto **full-stack** que inclui aplicativo mobile nativo (iOS/Android) e uma API REST robusta construída com NestJS, TypeORM e PostgreSQL.

### 🎯 Funcionalidades Principais

- **Gerenciamento de Pets**: Cadastro completo de pets com fotos, informações detalhadas e histórico
- **Sistema de Autenticação**: Login/registro seguro com JWT e armazenamento criptografado
- **Agendamentos**: Sistema de calendário para consultas, banhos e tosas
- **Localização de Serviços**: Integração com mapas para encontrar pet shops, clínicas veterinárias e serviços próximos
- **Perfil de Usuário**: Gerenciamento de dados pessoais e preferências
- **Interface Responsiva**: Design moderno com tema claro/escuro automático

---

## 🚀 Tecnologias e Ferramentas

### **Frontend Mobile**

#### Framework e Runtime
- **React Native 0.81.4** - Framework para desenvolvimento mobile nativo
- **Expo 54.0.12** - Plataforma de desenvolvimento com ferramentas avançadas
- **Expo Router 6.0.8** - Sistema de navegação baseado em arquivos (file-based routing)
- **React 19.1.0** - Biblioteca JavaScript para interfaces de usuário

#### Linguagem e Tipagem
- **TypeScript 5.9.2** - Superset JavaScript com tipagem estática forte
- **Strict Mode** habilitado para máxima segurança de tipos

#### Estilização e UI
- **NativeWind 4.2.1** - Tailwind CSS para React Native
- **Tailwind CSS 3.4.17** - Framework CSS utility-first
- **Expo Linear Gradient** - Gradientes nativos para designs modernos
- **React Native Reanimated 4.1.1** - Animações fluidas de alta performance

#### Gerenciamento de Estado
- **Context API** - Gerenciamento de estado global nativo do React
  - `AuthContext` - Controle de autenticação e sessões
  - `PetContext` - Gerenciamento de dados de pets
  - `AppointmentContext` - Controle de agendamentos
- **React Hooks** - useState, useEffect, useContext, custom hooks

#### Armazenamento Local
- **Expo Secure Store** - Armazenamento criptografado para tokens JWT
- **AsyncStorage** - Persistência local de dados não-sensíveis

#### Integração com Recursos Nativos
- **Expo Image Picker** - Captura e seleção de fotos da galeria/câmera
- **Expo Location** - Geolocalização e serviços baseados em localização
- **React Native Maps** - Integração completa com mapas nativos
- **Expo Camera Permissions** - Gerenciamento de permissões nativas

#### Comunicação com API
- **Axios 1.12.2** - Cliente HTTP com interceptors configurados
- **API REST** - Comunicação com backend via endpoints RESTful

#### Navegação
- **Expo Router** - Roteamento baseado em estrutura de arquivos
- **React Navigation** - Navegação nativa integrada
- **Rotas Tipadas** - Type-safe routing com TypeScript

---

### **Backend (API REST)**

#### Framework e Arquitetura
- **NestJS 11.0.1** - Framework Node.js progressivo e modular
- **TypeScript 5.7.3** - Desenvolvimento backend type-safe
- **Arquitetura Modular** - Separação clara de responsabilidades

#### Banco de Dados e ORM
- **PostgreSQL 14** - Banco de dados relacional robusto
- **TypeORM 0.3.27** - ORM moderno com suporte a migrations
- **Migrations** - Controle de versionamento do banco de dados
- **Data Source Pattern** - Configuração centralizada de conexão

#### Autenticação e Segurança
- **Passport JWT 4.0.1** - Estratégia de autenticação JWT
- **@nestjs/passport** - Integração Passport com NestJS
- **@nestjs/jwt** - Geração e validação de tokens JWT
- **bcrypt 6.0.0** - Hash de senhas com salt
- **Guards** - Proteção de rotas com JWT Auth Guard
- **Strategies** - JWT Strategy para validação de tokens

#### Validação e Transformação
- **class-validator 0.14.2** - Validação declarativa de DTOs
- **class-transformer 0.5.1** - Transformação e serialização de objetos
- **Pipes** - Validação automática de entrada de dados

#### Documentação
- **Swagger/OpenAPI** - Documentação automática da API
- **@nestjs/swagger 11.2.0** - Decorators para documentação

#### DevOps e Infraestrutura
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração de containers (PostgreSQL + pgAdmin)
- **pgAdmin** - Interface web para gerenciamento do banco

---

## 🏗️ Arquitetura do Projeto

### **Estrutura de Pastas (Frontend)**

```
MeuPet/
├── app/                          # Aplicação principal (Expo Router)
│   ├── (app)/                   # Rotas protegidas (requer autenticação)
│   │   ├── (tabs)/              # Navegação por tabs
│   │   ├── _layout.tsx          # Layout das rotas protegidas
│   │   ├── add-pet.tsx          # Tela de adicionar pet
│   │   ├── food-services.tsx    # Tela de serviços de alimentação
│   │   ├── grooming-services.tsx # Tela de serviços de banho e tosa
│   │   ├── pet-details.tsx      # Detalhes do pet
│   │   └── veterinary-services.tsx # Serviços veterinários
│   ├── context/                 # Contextos globais (State Management)
│   │   ├── AuthContext.tsx      # Gerenciamento de autenticação
│   │   ├── PetContext.tsx       # Gerenciamento de pets
│   │   └── AppointmentContext.tsx # Gerenciamento de agendamentos
│   ├── services/                # Camada de serviços
│   │   └── api.ts               # Configuração do cliente HTTP (Axios)
│   ├── _layout.tsx              # Layout raiz com providers
│   ├── login.tsx                # Tela de login
│   ├── register.tsx             # Tela de registro
│   └── modal.tsx                # Tela modal genérica
├── components/                   # Componentes reutilizáveis
│   ├── AddAppointmentModal.tsx  # Modal de agendamento
│   ├── Header.tsx               # Componente de cabeçalho
│   ├── Themed.tsx               # Componentes com suporte a tema
│   └── ...
├── types/                        # Definições de tipos TypeScript
│   ├── pet.ts                   # Tipos relacionados a pets
│   ├── appointment.ts           # Tipos de agendamentos
│   └── global.d.ts              # Tipos globais
├── assets/                       # Recursos estáticos
│   ├── images/                  # Imagens e ícones
│   └── fonts/                   # Fontes customizadas
├── constants/                    # Constantes da aplicação
├── backend/                      # API REST (NestJS)
└── ...
```

### **Estrutura do Backend (NestJS)**

```
backend/
├── src/
│   ├── auth/                    # Módulo de autenticação
│   │   ├── auth.controller.ts   # Endpoints de auth
│   │   ├── auth.service.ts      # Lógica de negócio
│   │   ├── auth.module.ts       # Módulo NestJS
│   │   ├── jwt.strategy.ts      # Estratégia JWT
│   │   ├── jwt-auth.guard.ts    # Guard de proteção
│   │   ├── user.entity.ts       # Entidade de usuário (TypeORM)
│   │   ├── create-user-dto.ts   # DTO de criação
│   │   └── login-user-dto.ts    # DTO de login
│   ├── pet/                     # Módulo de pets
│   │   ├── pet.controller.ts    # Endpoints de pets
│   │   ├── pet.service.ts       # Lógica de pets
│   │   ├── pet.entity.ts        # Entidade de pet
│   │   └── pet.module.ts        # Módulo de pets
│   ├── migrations/              # Migrations do banco
│   ├── app.module.ts            # Módulo raiz
│   └── main.ts                  # Entry point da aplicação
├── data-source.ts               # Configuração do TypeORM
├── docker-compose.yml           # Orquestração Docker
└── package.json
```

---

## 🎨 Padrões e Boas Práticas Implementadas

### **Frontend**

✅ **File-based Routing** - Expo Router para navegação intuitiva baseada em arquivos  
✅ **Type Safety** - TypeScript strict mode com interfaces bem definidas  
✅ **Custom Hooks** - Hooks reutilizáveis (useAuth, usePets, useAppointment)  
✅ **Context Pattern** - Gerenciamento de estado escalável com Context API  
✅ **Component Composition** - Componentes reutilizáveis e modulares  
✅ **Protected Routes** - Sistema de proteção de rotas com guards  
✅ **Persistent Storage** - Dados persistidos localmente com AsyncStorage  
✅ **Secure Storage** - Tokens JWT armazenados com criptografia  
✅ **Error Handling** - Tratamento consistente de erros  
✅ **Loading States** - Estados de carregamento em todas as operações assíncronas  
✅ **Responsive Design** - Interface adaptável a diferentes tamanhos de tela  
✅ **Dark Mode** - Suporte automático a tema claro/escuro  
✅ **Native Permissions** - Gerenciamento adequado de permissões (câmera, localização)  
✅ **Image Optimization** - Upload e otimização de imagens de pets  

### **Backend**

✅ **Clean Architecture** - Separação em camadas (Controllers, Services, Repositories)  
✅ **Dependency Injection** - Injeção de dependências nativa do NestJS  
✅ **DTOs (Data Transfer Objects)** - Validação de entrada com class-validator  
✅ **JWT Authentication** - Autenticação stateless com tokens JWT  
✅ **Password Hashing** - Senhas criptografadas com bcrypt e salt  
✅ **Guards e Strategies** - Proteção de rotas com Passport  
✅ **Repository Pattern** - Abstração de acesso a dados com TypeORM  
✅ **Database Migrations** - Versionamento do schema do banco  
✅ **Environment Variables** - Configuração via variáveis de ambiente (.env)  
✅ **Error Handling** - Exceções tipadas do NestJS  
✅ **API Documentation** - Swagger para documentação interativa  
✅ **Docker Support** - Ambiente de desenvolvimento containerizado  

---

## 📱 Funcionalidades Detalhadas

### **1. Sistema de Autenticação**
- Registro de novos usuários com validação de email
- Login com JWT token
- Armazenamento seguro de credenciais com Expo Secure Store
- Auto-login persistente entre sessões
- Logout com limpeza de token
- Proteção automática de rotas autenticadas
- Interceptors HTTP para renovação de token

### **2. Gerenciamento de Pets**
- CRUD completo de pets (Create, Read, Update, Delete)
- Upload de fotos da câmera ou galeria
- Campos customizados: nome, tipo, raça, idade, peso, cor, observações
- Lista de pets com cards visuais
- Detalhes completos do pet
- Persistência local com AsyncStorage
- Validação de formulários

### **3. Sistema de Agendamentos**
- Calendário visual de compromissos
- Agendamento de consultas veterinárias
- Agendamento de banho e tosa
- Agendamento de serviços de alimentação
- Status de agendamentos (agendado, concluído, cancelado)
- Notificações de compromissos próximos
- Modal de criação de agendamentos

### **4. Localização de Serviços**
- Integração com React Native Maps
- Geolocalização do usuário
- Busca de pet shops próximos
- Busca de clínicas veterinárias
- Filtros por tipo de serviço
- Visualização em mapa com marcadores
- Informações de contato e avaliações

### **5. Perfil do Usuário**
- Visualização de dados pessoais
- Edição de informações
- Troca de senha
- Preferências de notificações
- Logout seguro

---

## 🛠️ Configuração e Instalação

### **Pré-requisitos**

- Node.js 18+ e npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- Docker e Docker Compose (para o backend)
- Android Studio (para emulador Android) ou Xcode (para iOS)
- PostgreSQL 14+ (ou usar Docker Compose fornecido)

### **Instalação - Frontend**

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd MeuPet

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Inicie o Expo
npm start

# Ou execute diretamente no emulador
npm run android  # Para Android
npm run ios      # Para iOS
```

### **Instalação - Backend**

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Inicie o banco de dados com Docker
docker-compose up -d

# Execute as migrations
npm run typeorm migration:run

# Inicie o servidor de desenvolvimento
npm run start:dev

# O servidor estará rodando em http://localhost:3000
```

### **Docker Compose (Backend)**

O projeto inclui configuração Docker Compose com:
- **PostgreSQL 14** na porta 5432
- **pgAdmin** na porta 8080 (interface web)

```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs
docker-compose logs -f
```

---

## 📚 Scripts Disponíveis

### **Frontend**

```json
{
  "start": "expo start",           // Inicia o Expo Dev Server
  "android": "expo run:android",   // Build e executa no Android
  "ios": "expo run:ios",           // Build e executa no iOS
  "web": "expo start --web"        // Executa versão web
}
```

### **Backend**

```json
{
  "start:dev": "nest start --watch",      // Desenvolvimento com hot-reload
  "start:prod": "node dist/main",         // Produção
  "build": "nest build",                  // Build da aplicação
  "typeorm": "ts-node ./node_modules/typeorm/cli.js", // CLI do TypeORM
  "test": "jest",                         // Testes unitários
  "test:e2e": "jest --config ./test/jest-e2e.json" // Testes E2E
}
```

---

## 🔐 Variáveis de Ambiente

### **Frontend (.env)**

```env
EXPO_PUBLIC_API_URL=http://192.168.0.100:3000
```

### **Backend (.env)**

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=meupet_user
DATABASE_PASSWORD=sua_senha_aqui
DATABASE_NAME=meupet

JWT_SECRET=seu_jwt_secret_aqui
JWT_EXPIRATION=7d

PORT=3000
```

---

## 🧪 Testes

O projeto está preparado para testes com Jest:

```bash
# Backend - Testes unitários
cd backend
npm run test

# Backend - Testes E2E
npm run test:e2e

# Backend - Coverage
npm run test:cov
```

---

## 📦 Build e Deploy

### **Frontend - Build para Produção**

```bash
# Build para Android
expo build:android

# Build para iOS
expo build:ios

# EAS Build (recomendado)
eas build --platform android
eas build --platform ios
```

### **Backend - Deploy**

```bash
# Build da aplicação
npm run build

# Iniciar em produção
npm run start:prod
```

---

## 🎓 Conceitos Técnicos Demonstrados

### **Frontend Mobile**
- ✅ React Native e desenvolvimento cross-platform
- ✅ TypeScript avançado com tipos genéricos
- ✅ Hooks do React (useState, useEffect, useContext, custom hooks)
- ✅ Context API para gerenciamento de estado
- ✅ Navegação com Expo Router (file-based routing)
- ✅ Integração com APIs REST via Axios
- ✅ Armazenamento local (AsyncStorage e Secure Store)
- ✅ Upload de imagens e integração com câmera
- ✅ Geolocalização e mapas nativos
- ✅ Animações com Reanimated
- ✅ Estilização com NativeWind/Tailwind
- ✅ Permissões nativas (câmera, localização)
- ✅ Tratamento de erros e loading states
- ✅ Protected routes e autenticação

### **Backend (API REST)**
- ✅ NestJS e arquitetura modular
- ✅ TypeORM e migrations
- ✅ PostgreSQL e banco de dados relacional
- ✅ JWT Authentication e Passport
- ✅ Guards e Strategies
- ✅ DTOs e validação com class-validator
- ✅ Dependency Injection
- ✅ RESTful API design
- ✅ Error handling com exceções tipadas
- ✅ Swagger/OpenAPI documentation
- ✅ Docker e containerização
- ✅ Environment configuration
- ✅ Password hashing com bcrypt

---

## 🚀 Diferenciais do Projeto

🎯 **Full-Stack Completo** - Aplicativo mobile + API REST + Banco de dados  
🎯 **Arquitetura Profissional** - Padrões de mercado e clean architecture  
🎯 **Type-Safe** - TypeScript em todo o stack (frontend e backend)  
🎯 **Moderno e Atualizado** - Tecnologias e versões atuais  
🎯 **Documentado** - Código bem documentado e README completo  
🎯 **Escalável** - Estrutura preparada para crescimento  
🎯 **Seguro** - Autenticação JWT, senha criptografada, secure storage  
🎯 **Containerizado** - Docker para facilitar desenvolvimento  
🎯 **Boas Práticas** - Clean code, separation of concerns, DRY  
🎯 **UI/UX Moderno** - Interface profissional e responsiva  

---

## 📄 Licença

Este projeto é privado e foi desenvolvido para fins de portfólio.

---

## 👨‍💻 Autor

**[Seu Nome]**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Conecte--se-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/seu-perfil)
[![GitHub](https://img.shields.io/badge/GitHub-Siga--me-181717?style=for-the-badge&logo=github)](https://github.com/seu-usuario)
[![Email](https://img.shields.io/badge/Email-Contato-D14836?style=for-the-badge&logo=gmail)](mailto:seu-email@example.com)

---

## 🙏 Agradecimentos

Projeto desenvolvido com dedicação para demonstrar habilidades técnicas em desenvolvimento mobile full-stack. Obrigado por conferir! 🚀

---

<div align="center">
  <strong>Desenvolvido com ❤️ usando React Native, TypeScript e NestJS</strong>
</div>
