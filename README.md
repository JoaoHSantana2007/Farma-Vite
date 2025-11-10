# FarmaVite — Marketplace de Farmácias (estilo iFood)

Um projeto front-end estático que implementa a interface de um marketplace de farmácias (modelo similar ao iFood), com páginas para usuários, farmácias e entregadores. O código é escrito com HTML, CSS e JavaScript puro, usando Bootstrap 5 e Font Awesome para UI.

## Destaques

- Páginas para diferentes perfis: usuário, farmácia e entregador
- Fluxo de autenticação (páginas de login/cadastro e alteração de senha)
- Área privada para farmácias: cadastro de medicamentos, financeiro, higienização e gerenciamento da própria farmácia
- Área para entregadores: cadastro, dados do veículo, financeiro e lista de entregas
- Telas públicas para usuários: explorar produtos, carrinho, pedido e métodos de pagamento
- Estrutura modular de includes para reutilizar `nav` e `footer`

## Tecnologias

- HTML5
- CSS (pasta `style/`, com arquivos específicos por área)
- JavaScript (pasta `js/`)
- Bootstrap 5 (CDN)
- Font Awesome (CDN)

Este é um front-end estático (sem back-end incluído). Ele serve como protótipo/tema para um marketplace de farmácia.

## Estrutura do projeto (visão geral)

- `index.html` — página inicial principal
- `pages/` — todas as páginas divididas por perfis e áreas (auth, farmacia, entregador, usuario, etc.)
	- `pages/farmacia/` — páginas públicas e privadas da farmácia
	- `pages/entregador/` — páginas do entregador
	- `pages/usuario/` — páginas do usuário (compra, produtos)
- `style/` — arquivos CSS organizados por área
- `js/` — scripts JavaScript (ex.: `includes.js`, `farmacia-tela-inicial.js`, `cadastroremedios.js`)
- `img/` — imagens, ícones e favicon

Arquivos JS relevantes:

- `js/includes.js` / `js/includes-farmacia.js` / `js/includes-entregador.js` — carregam trechos HTML (nav/footer) dinamicamente
- `js/farmacia-tela-inicial.js` — lógica da tela inicial da farmácia (status online/offline, modal, etc.)

## Como rodar localmente

Este é um site estático. Você pode simplesmente abrir `index.html` no navegador, mas recomenda-se usar um servidor local para evitar problemas com caminhos relativos e carregamento via fetch.

Opções (PowerShell):

1) Usando a extensão Live Server do VSCode

- Abra o workspace no VSCode e clique em "Open with Live Server" na barra inferior ou botão direito no `index.html` → `Open with Live Server`.

## Desenvolvendo / Editando

- Páginas e estilos estão organizados por área em `pages/` e `style/` — mantenha a mesma convenção ao adicionar novas telas.
- Reutilize os includes (`nav`/`footer`) via os scripts em `js/includes*.js` para consistência.
- Prefira componentes CSS em `style/` já existentes para manter a aparência consistente.

### Contrato mínimo das páginas

- Inputs: formulários de cadastro/login (simulados no front-end)
- Outputs: páginas HTML renderizadas, comunicação entre telas via localStorage ou requisições (quando integradas a back-end)
- Erros: como este repositório é front-end estático, validações e mensagens são feitas no front-end; ao conectar um back-end, trate falhas de rede/auth.

### Aprendicado

Boas práticas:

- Manter HTML semântico
- Evitar duplicação de CSS — extrair estilos comuns quando possível
- Documentar novas pages/JS que alterem o comportamento global
