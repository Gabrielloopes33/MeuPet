### **Resumo da Jornada: Construindo a API de Pets com NestJS**

O nosso objetivo era criar os endpoints da API para a funcionalidade de "Pets" no backend, garantindo que fosse segura, funcional e completa. Conseguimos isso implementando um CRUD (Create, Read, Update, Delete), autenticação e upload de arquivos.

#### **Ponto 1: A Arquitetura do Backend (As Peças do Quebra-Cabeça)**

No NestJS, organizamos o código de forma modular para que ele seja fácil de manter. Para a nossa funcionalidade de `Pet`, usamos três tipos principais de arquivos:

1.  **`pet.controller.ts` (O Porteiro da API)**
    *   **O que faz?** Define as URLs da nossa API (ex: `/pets`, `/pets/:id`) e qual método HTTP (`GET`, `POST`, `PATCH`, `DELETE`) cada uma aceita.
    *   **Como funciona?** Ele recebe a requisição vinda do "mundo exterior" (o Postman ou o frontend) e chama o `Service` apropriado para fazer o trabalho pesado. Ele não contém lógica de negócios.
    *   **Aprendizado-chave**: Controllers são a camada de entrada da sua API. Eles cuidam das rotas e dos parâmetros da requisição.

2.  **`pet.service.ts` (O Cérebro da Operação)**
    *   **O que faz?** Contém toda a lógica de negócios. É aqui que programamos o que realmente acontece quando se cria um pet, se busca um pet no banco de dados, etc.
    *   **Como funciona?** Ele se comunica diretamente com o banco de dados através do TypeORM (usando `@InjectRepository`).
    *   **Aprendizado-chave**: Services centralizam e executam a lógica de negócios, mantendo os controllers "limpos" e focados apenas em receber requisições.

3.  **`pet.module.ts` (A Caixa de Ferramentas)**
    *   **O que faz?** "Amarra" tudo que pertence à funcionalidade de `Pet`. Ele declara qual controller e qual service fazem parte deste módulo.
    *   **Como funciona?** Ele informa ao NestJS sobre os componentes do módulo, permitindo que o framework gerencie as dependências entre eles (como injetar o `PetService` no `PetController`).
    *   **Aprendizado-chave**: Módulos são a base da organização no NestJS.

#### **Ponto 2: Segurança (A Porta e a Credencial)**

Uma API não pode ser aberta para qualquer um. Implementamos um sistema de segurança robusto.

1.  **Autenticação com JWT (JSON Web Token)**
    *   **O que é?** Um "crachá digital" seguro.
    *   **Como funciona?**
        1.  O usuário envia `email` e `senha` para a rota `/auth/login`.
        2.  O servidor verifica as credenciais. Se estiverem corretas, ele gera um token JWT (uma longa string) e o envia de volta.
        3.  Para acessar qualquer rota protegida, o cliente (Postman/frontend) deve enviar esse token no **Header** da requisição (`Authorization: Bearer <token>`).
    *   **Aprendizado-chave**: JWT é o padrão moderno para proteger APIs, pois evita que o servidor precise armazenar informações de sessão.

2.  **`JwtAuthGuard` (O Segurança na Porta)**
    *   **O que faz?** É um mecanismo do NestJS que intercepta todas as requisições para uma rota e verifica se o Header `Authorization` contém um token JWT válido. Se não tiver, a requisição é bloqueada.
    *   **Como usamos?** Adicionamos o decorador `@UseGuards(JwtAuthGuard)` no topo do `PetController`. Tivemos que criar o arquivo `jwt-auth.guard.ts`, pois ele estava faltando.
    *   **Aprendizado-chave**: Guards são "middlewares" focados em autorização, tornando muito simples proteger rotas inteiras.

#### **Ponto 3: Manipulação de Dados e Arquivos**

1.  **Entidades e DTOs (O Contrato e o Molde)**
    *   **`pet.entity.ts`**: É o "molde" que diz ao TypeORM como é a tabela `pets` no banco de dados. **Corrigimos um bug importante aqui**: o `id` de um `uuid` deve ser do tipo `string`, não `number`.
    *   **`create-pet.dto.ts` / `update-pet.dto.ts`**: São "contratos" que definem quais dados a API espera receber no **Body** de uma requisição. Eles são essenciais para **validação**, garantindo que ninguém envie dados incompletos ou em formato errado.

2.  **Upload de Imagens**
    *   **Como funciona?** Criamos uma rota especial (`POST /pets/:id/photo`) que aceita `form-data` (um tipo de Body para enviar arquivos).
    *   **`FileInterceptor`**: Usamos este interceptor do NestJS para processar o arquivo enviado. Ele usa uma biblioteca chamada **Multer** por baixo dos panos.
    *   **Armazenamento**: Configuramos para que a imagem fosse salva na pasta `backend/uploads` com um nome aleatório para evitar duplicatas.
    *   **Servindo as Imagens**: Modificamos o `main.ts` para que a pasta `uploads` se tornasse pública. Isso permite que o frontend acesse a imagem através de uma URL como `http://localhost:3000/uploads/nome-do-arquivo.jpg`.

#### **Ponto 4: Testes (A Prova Final)**

Para garantir que tudo funcionava, aprendemos a testar a API.

*   **Ferramenta**: Usamos o **Postman**, uma ferramenta gráfica poderosa para fazer requisições HTTP.
*   **O Fluxo de Teste Correto**:
    1.  **Registrar** um usuário.
    2.  **Fazer Login** com esse usuário para obter o `accessToken` (a credencial).
    3.  **Configurar o Token** no Postman para que ele seja enviado em todas as requisições futuras.
    4.  **Testar as rotas de `pets`** (criar, listar, deletar, etc.), que agora estão protegidas e funcionando corretamente.

**Em resumo, nós construímos uma API RESTful completa e segura, seguindo as melhores práticas do NestJS, e aprendemos a validá-la de ponta a ponta.**
