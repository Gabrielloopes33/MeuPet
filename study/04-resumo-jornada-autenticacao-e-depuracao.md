# Resumo da Jornada de Desenvolvimento: Autenticação e Depuração Profunda (MeuPet Backend)

## Introdução

Hoje foi um dia intenso e extremamente produtivo na construção do backend do projeto "MeuPet". Nosso objetivo principal era implementar um sistema de autenticação completo, incluindo registro, login e geração de JWT, além de proteger rotas. A jornada foi repleta de desafios de depuração que nos ensinaram lições valiosas sobre a interação de frameworks e bibliotecas.

## Conquistas Principais

1.  **Entidades `User` e `Pet`:**
    *   Definimos e relacionamos as entidades `User` e `Pet`, estabelecendo a estrutura básica do nosso banco de dados.
2.  **TypeORM Migrations:**
    *   Configuramos um fluxo profissional de migrações para gerenciar o schema do banco de dados.
    *   **Desafio:** Erro `uuid_generate_v4() do not exist` ao usar UUIDs.
    *   **Solução:** Criamos uma migração específica (`EnableUUIDExtension`) para ativar a extensão `uuid-ossp` no PostgreSQL.
    *   **Aprendizado:** A importância de gerenciar extensões do DB via migrações e a ordem de execução.
3.  **Registro de Usuários:**
    *   Implementamos o endpoint `POST /auth/register` com validação de DTOs (`CreateUserDto`).
    *   **Desafio:** Persistente erro `NOT_NULL_VIOLATION` na coluna `password`.
    *   **Solução Final:** Hashing da senha diretamente no `AuthService` antes de chamar `userRepo.save()`, contornando interações problemáticas com `@BeforeInsert` e `@Exclude`.
4.  **Login de Usuários:**
    *   Implementamos o endpoint `POST /auth/login` com validação de DTOs (`LoginUserDto`).
    *   Lógica de verificação de credenciais usando `bcrypt.compare()`.
5.  **Geração de JWT (JSON Web Tokens):**
    *   Configuramos o `JwtModule` no `AuthModule`.
    *   Modificamos o `AuthService.login()` para gerar e retornar um `accessToken` após o login bem-sucedido.
6.  **Proteção de Rotas com JWT:**
    *   Criamos uma `JwtStrategy` para validar os tokens.
    *   Configuramos o `AuthModule` para usar a `JwtStrategy` com `PassportModule`.
    *   Protegemos uma rota de teste (`GET /auth/profile`) usando `@UseGuards(AuthGuard('jwt'))`.

## Desafios de Depuração e Aprendizados Profundos

A jornada de hoje foi um verdadeiro curso intensivo em depuração e compreensão de detalhes de implementação:

1.  **`EntityMetadataNotFoundError`:**
    *   **Causa:** Remoção acidental de `autoLoadEntities: true` na configuração do `TypeOrmModule.forRoot` no `app.module.ts`.
    *   **Solução:** Reativar `autoLoadEntities: true`.
    *   **Aprendizado:** A diferença entre a configuração do TypeORM para o CLI (`data-source.ts`) e para a aplicação em tempo de execução (`app.module.ts`).

2.  **`NOT_NULL_VIOLATION` na Senha (O Problema Persistente):**
    *   **Causa Inicial:** O decorator `@Exclude()` sem `{ toPlainOnly: true }` estava removendo a senha na entrada (`Plain -> Class`), fazendo-a chegar `null` no banco.
    *   **Solução Parcial:** Adicionar `{ toPlainOnly: true }` ao `@Exclude()`.
    *   **Causa Persistente:** Mesmo com `toPlainOnly: true` e `@BeforeInsert` funcionando (confirmado por `console.log`), a propriedade `password` ainda era perdida entre o hook e a geração da query `INSERT`.
    *   **Solução Final:** Remover `@BeforeInsert` e `@Exclude` da entidade e realizar o hashing da senha **diretamente no `AuthService`** antes de chamar `userRepo.save()`. Isso contornou a interação problemática do TypeORM/class-transformer.
    *   **Aprendizado:** A complexidade da interação entre `class-transformer` e TypeORM, e a necessidade de, às vezes, simplificar o fluxo para garantir a persistência.

3.  **Erros de Linha de Comando do TypeORM:**
    *   **Causa:** Argumentos `dataSource` mal posicionados e `ts-node` não encontrado no PATH.
    *   **Solução:** Ajustar o script `typeorm` no `package.json` e usar o caminho completo para `ts-node` (`./node_modules/.bin/ts-node`).
    *   **Aprendizado:** A sensibilidade das ferramentas CLI e como garantir sua execução correta.

4.  **Erro de Importação do `Reflector`:**
    *   **Causa:** Importar `Reflector` de `@nestjs/common` em vez de `@nestjs/core`.
    *   **Solução:** Corrigir o caminho de importação.
    *   **Aprendizado:** A importância de verificar os caminhos de importação corretos.

5.  **Ordem de Configuração do `ClassSerializerInterceptor`:**
    *   **Causa:** Registrar o interceptor global antes da configuração do Swagger.
    *   **Solução:** Registrar o interceptor global *após* a configuração do Swagger no `main.ts`.
    *   **Aprendizado:** A ordem de registro de componentes globais pode ser crucial no NestJS.

6.  **Falha Silenciosa da Ferramenta `write_file`:**
    *   **Causa:** Em alguns momentos, minhas tentativas de escrever no arquivo `user.entity.ts` reportaram sucesso, mas as alterações não persistiram no disco.
    *   **Solução:** Recorrer à alteração manual pelo usuário e à verificação constante.
    *   **Aprendizado:** A necessidade de verificar o estado real do arquivo e a resiliência na depuração.

## Ferramentas e Conceitos Reforçados

*   **NestJS:** Modularidade, Controllers, Services, DTOs, Interceptors, Guards.
*   **TypeORM:** Entidades, Relacionamentos (`@OneToMany`, `@ManyToOne`), Repositórios, Migrações, Hooks (`@BeforeInsert`).
*   **Docker:** Configuração de serviços (PostgreSQL, pgAdmin).
*   **PostgreSQL:** Extensões (`uuid-ossp`), constraints (`NOT NULL`).
*   **JWT:** Geração, `JwtStrategy`, `AuthGuard`.
*   **Segurança:** Hashing de senhas (`bcrypt`), `class-transformer` (`@Exclude`), `class-validator`.
*   **Depuração:** Uso estratégico de `console.log`, análise de logs de erro, isolamento de problemas.

## Conclusão

A persistência e a depuração sistemática foram nossas maiores aliadas hoje. Cada obstáculo nos levou a um entendimento mais profundo de como o sistema funciona. Agora, temos um sistema de autenticação robusto e funcional, pronto para ser integrado ao frontend.
