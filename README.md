# FarmaVite

Uma interface front-end para busca e exploração de medicamentos, cosméticos e produtos relacionados — projeto estático (HTML/CSS/JS) com layout responsivo usando Bootstrap e Font Awesome. Serve como protótipo de um marketplace farmacêutico (cliente) com páginas para navegar por categorias, visualizar farmácias parceiras e explorar produtos.

---

## Descrição

FarmaVite é um projeto front-end que apresenta a página inicial e páginas de apoio de um marketplace farmacêutico. A interface permite ao usuário procurar produtos, explorar categorias e acessar informações resumidas de farmácias parceiras. O projeto é estático (HTML, CSS e JavaScript) e utiliza Bootstrap para responsividade e Font Awesome para ícones.

Observação: não há backend/API pública neste repositório.

---

## Principais funcionalidades

- Layout responsivo para desktop e mobile.
- Interface de pesquisa de produtos (navegação para página de pesquisa).
- Cartões de categorias (Medicamentos, Beleza, Bebê, Vitaminas, etc.).
- Listagem de farmácias parceiras com avaliação, tempo estimado de entrega e preço de frete.
- Inclusão de header (nav) e footer via script de includes (`/js/includes.js`).
- Botões de chamada para ação (Explorar Produtos, Seja um Entregador, Seja uma Farmácia Parceira).

---

## Tecnologias utilizadas

- HTML5
- CSS3 (arquivos em `style/`)
- JavaScript (vanilla) — scripts em `js/`
- Bootstrap 5 (CDN)
- Font Awesome (CDN)

Linguagens principais:
- HTML
- CSS
- JavaScript

---

## Requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari).
- Git (necessário caso queira clonar o repositório e rodar localmente usando o fluxo com git).
- Para fluxo de desenvolvimento local, recomendo servir os arquivos via servidor HTTP local.
---

## Instalação e execução

Opções para executar localmente:

Siga os passos abaixo para clonar o repositório e executar localmente.

1) Clonar o repositório
- Abra o terminal do seu sitema operacional
- Entre no diretorio que deseja que o repositorio fique guardado
- EX: área de trabalho use o comando
```
cd .\Desktop\
```
- Clone o repositório para sua máquina
```
git clone https://github.com/JoaoHSantana2007/Farma-Vite.git
```
- Entre no diretório do projeto
```
cd Farma-Vite
```

Apos clonar o repositório escolha o  metodo de execução que mais de agrada

1) Abrir diretamente (menos recomendado)
- Clique duas vezes em `index.html` ou abra no navegador.
- Observação: alguns navegadores podem restringir requisições locais (dependendo do uso de `fetch()` / includes). Se houver problemas, execute um servidor local.

2) Usando Live Server (VS Code)
- Instale a extensão "Live Server".
- Clique com o botão direito em `index.html` > "Open with Live Server".

## Estrutura de pastas (explicação)

Estrutura observada (resumida):

- index.html
- img/                -> imagens do projeto (favicon, banners, placeholders)
- js/
  - includes.js       -> script que injeta nav/footer via `data-include`
- pages/              -> páginas internas (ex.: `/pages/usuario/public/produtos/`)
- style/
  - index.css         -> estilos customizados referenciados em `index.html`
- README.md           -> este arquivo

Explicação:
- index.html: página inicial pública (hero, categorias, farmácias parceiras).
- img/: guarde capturas e ícones; recommended: criar subpastas (icons, screenshots).
- js/: scripts JavaScript, incluindo lógica de includes.
- pages/: páginas estáticas separadas por funcionalidade (usuário, produtos, etc.).
- style/: estilos CSS customizados.

---

## Endpoints / API

No estado atual do repositório não existe documentação de API nem código de backend. A interface usa navegação entre páginas estáticas.

---

## Hospedagem

O projeto está disponível publicamente em:
- https://farma-vite.vercel.app

Observações:
- O deploy foi realizado no Vercel (plataforma de hospedagem para projetos estáticos e aplicações web).

---

## Autores

Projeto criado por:
- JoaoHSantana — https://github.com/JoaoHSantana
- Felps-26 — https://github.com/Felps-26
- felipetnt — https://github.com/felipetnt

## Contato

Abra issues ou PRs no repositório ou entre em contatos com os autores listados na seção "Autores" deste documento para sugestões duvidas. Para solicitações de autorização de uso do código, abra uma issue com o título "Permissão de Uso / Licença" e descreva a finalidade.


## Aviso de Direitos Autorais (Copyright)

Todo o conteúdo deste repositório — incluindo, mas não se limitando a, código-fonte, arquivos HTML/CSS/JS, imagens, estilos e documentação — é de propriedade dos autores listados na seção "Autores". O uso, reprodução, cópia, adaptação, distribuição ou publicação parcial ou integral deste conteúdo NÃO é permitido sem autorização expressa dos autores, independentemente da finalidade ou intenção (comercial, educacional, experimental ou qualquer outra).

Ao usar ou acessar este repositório você concorda que:
- Não irá copiar, clonar, replicar, distribuir nem publicar o código sem permissão prévia por escrito.
- Qualquer pedido de uso deve ser feito abrindo uma issue ou contactando diretamente os autores pelos perfis GitHub indicados.
- Os autores reservam-se o direito de tomar medidas administrativas ou legais em caso de uso não autorizado.

Se a equipe decidir adotar uma licença permissiva (por exemplo MIT, Apache), essa seção será atualizada para refletir os termos da licença pública escolhida.

---