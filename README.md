# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.16.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Esboço de como ficará o projeto

```
src/
├── app/
│   ├── core/               # Módulos e serviços essenciais
│   │   ├── guards/         # Guards para rotas
│   │   ├── interceptors/   # Interceptadores HTTP
│   │   ├── services/       # Serviços globais (ex.: autenticação, logging)
│   │   └── core.module.ts  # Módulo do Core (importado apenas no AppModule)
│   ├── shared/             # Componentes, diretivas e módulos compartilhados
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── directives/     # Diretivas reutilizáveis
│   │   ├── pipes/          # Pipes reutilizáveis
│   │   ├── modules/        # Módulos compartilhados (ex.: Angular Material)
│   │   └── shared.module.ts
│   ├── features/           # Módulos específicos da aplicação
│   │   ├── dashboard/      # Tela principal
│   │   │   ├── components/ # Componentes específicos do dashboard
│   │   │   ├── services/   # Serviços específicos do dashboard
│   │   │   ├── models/     # Modelos de dados específicos
│   │   │   └── dashboard.module.ts
│   │   ├── transactions/   # Módulo para receitas/saídas
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── transactions.module.ts
│   │   ├── categories/     # Módulo para categorias
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── categories.module.ts
│   ├── app-routing.module.ts
│   ├── app.component.ts
│   └── app.module.ts
├── assets/                 # Imagens, fontes e outros recursos estáticos
├── environments/           # Arquivos de configuração de ambiente
│   ├── environment.ts      # Ambiente de desenvolvimento
│   └── environment.prod.ts # Ambiente de produção

``` 