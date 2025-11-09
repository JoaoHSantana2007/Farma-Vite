// js/includes.js
// Carrega fragments HTML em elementos que tenham o atributo `data-include`.
// Uso: <div data-include="/pages/usuario/public/nav.html"></div>
// Depois de carregar, scripts inline e externos do fragmento serão executados.

(async function () {
  'use strict';

  async function fetchText(path) {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Erro ${res.status} ao buscar: ${path}`);
    return await res.text();
  }

  // Executa scripts encontrados dentro do container: tanto inline quanto com src.
  function executeScripts(container) {
    const scripts = Array.from(container.querySelectorAll('script'));
    for (const oldScript of scripts) {
      const script = document.createElement('script');
      // preserve attributes like type, async, defer
      for (const attr of oldScript.attributes) {
        script.setAttribute(attr.name, attr.value);
      }
      if (oldScript.src) {
        // externo: copiar src
        script.src = oldScript.src;
        // append to body to run
        document.body.appendChild(script);
      } else {
        // inline: copiar conteúdo
        script.textContent = oldScript.textContent;
        document.body.appendChild(script);
      }
      // remove original to avoid duplicate execution
      oldScript.remove();
    }
  }

  // Carrega todos elementos com data-include e injeta o HTML
  async function loadIncludes() {
    // Seleciona elementos que ainda não foram processados
    const includes = Array.from(document.querySelectorAll('[data-include]'));
    if (!includes.length) return;

    await Promise.all(includes.map(async (el) => {
      const path = el.getAttribute('data-include');
      if (!path) return;
      try {
        const html = await fetchText(path);
        el.innerHTML = html;
        // Executa scripts inseridos pelo fragmento
        executeScripts(el);
        // Remova o atributo para marcar como processado
        el.removeAttribute('data-include');
      } catch (err) {
        console.error('includes.js: erro ao carregar', path, err);
      }
    }));

    // Depois de inserir, pode haver novos data-include criados (includes aninhados). Re-execute recusivamente.
    if (document.querySelector('[data-include]')) {
      await loadIncludes();
    }
  }

  // Inicia quando DOM pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadIncludes);
  } else {
    // já pronto
    loadIncludes();
  }
})();
