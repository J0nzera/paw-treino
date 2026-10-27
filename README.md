JavaScript

**O que é o JavaScript Runtime?** O JavaScript Runtime é o ambiente que executa o código JavaScript. Ele é composto pelo motor do JS (como o V8 no Chrome), a Call Stack que organiza a execução das funções, e o Event Loop, que coordena tarefas síncronas e assíncronas. É isso que faz o JS conseguir lidar com coisas como Promises, setTimeout e Observables sem travar o navegador.

O que é Hoisting e quais problemas ele pode causar? Hoisting é o comportamento do JavaScript de pré-processar o código antes da execução, registrando as declarações de variáveis e funções. No caso do `var`, ele é movido pro topo e inicializado com `undefined`, o que pode causar bugs sutis. Já `let` e `const` também são ‘movidos’, mas não podem ser acessados antes da declaração, porque ficam em uma zona chamada Temporal Dead Zone.

O que é o Event Loop e como ele organiza a execução do código? O Event Loop é o mecanismo que o JS usa pra decidir o que executar e quando. Ele garante que o JS continue respondendo, mesmo com tarefas assíncronas, como Promises e setTimeout. Ele processa primeiro as tarefas normais (síncronas), depois as microtasks (como Promises resolvidas), e por último as macrotasks (como setTimeout ou requisições).

Qual a diferença entre Microtasks e Macrotasks? Microtasks são tarefas pequenas e rápidas, como o `.then()` de uma Promise. Elas têm prioridade e são executadas logo após o código principal, antes das Macrotasks. Já as Macrotasks são tarefas maiores, como `setTimeout`, eventos de clique e requisições HTTP. Elas são executadas depois que a fila de Microtasks termina.

O que é Coerção em JavaScript? Coerção é quando o JavaScript converte um valor de um tipo pra outro automaticamente pra conseguir executar uma operação. Pode ser implícita — o JS faz sozinho — ou explícita, quando eu uso funções como `Number()`, `String()` ou `Boolean()`.

Como você evita travar o Event Loop em aplicações Angular? Eu sempre evito operações síncronas muito pesadas no thread principal. Se preciso processar grandes volumes de dados, uso Web Workers ou executo em partes com setTimeout pra liberar o Event Loop entre uma execução e outra. Também uso Observables e RxJS pra tratar fluxos assíncronos sem travar a UI.

Microfrontends (MFE)

O que é um Microfrontend e qual a vantagem de usar? Um Microfrontend é a divisão de uma aplicação front-end grande em módulos independentes, cada um com desenvolvimento, deploy e teste próprios.  
Vantagens: modularidade, deploy independente, times trabalhando isolados, manutenção mais fácil e escalabilidade.

Quando faz sentido adotar Microfrontends? Quando a aplicação é grande, com times distribuídos, alta frequência de deploy ou necessidade de evoluir partes do app sem afetar todo o sistema.

O que é Module Federation? É uma funcionalidade do Webpack 5 que permite que módulos de diferentes projetos sejam importados dinamicamente em tempo de execução, possibilitando que cada MFE tenha seu próprio deploy.
