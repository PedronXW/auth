# Auth

Projeto voltado para estudo

A intenção é implementar um sistema de autenticação completo utilizando práticas de SOLID, Clean Architecture, TDD e alguns princípios de estruturação de DDD.

Implemento, também, uma arquitetura baseada em eventos que utiliza tanto Domain Events quanto filas, utilizando RabbitMQ, para disparar eventos.

O banco de dados que utilizei foi o DynamoDB no próprio cloud tanto em produção quanto para em desenvolvimento, e testes são realizados em uma versão local do mesmo banco.

Para executar a aplicação é necessário preencher as variáveis de desenvolvimento com valores reais de acesso a seu cluster aws.
