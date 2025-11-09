// js/includes-entregador.js
// Carrega fragments HTML em elementos que tenham o atributo `data-include-entregador`.
// Uso: <div data-include-entregador="/pages/entregador/nav-entregadores.html"></div>

(async function () {
  'use strict';

  async function fetchText(path) {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Erro ${res.status} ao buscar: ${path}`);
    return await res.text();
  }

  function executeScripts(container) {
    const scripts = Array.from(container.querySelectorAll('script'));
    for (const oldScript of scripts) {
      const script = document.createElement('script');
      for (const attr of oldScript.attributes) script.setAttribute(attr.name, attr.value);
      if (oldScript.src) {
        script.src = oldScript.src;
        document.body.appendChild(script);
      } else {
        script.textContent = oldScript.textContent;
        document.body.appendChild(script);
      }
      oldScript.remove();
    }
  }

  async function loadEntregadorIncludes() {
    const includes = Array.from(document.querySelectorAll('[data-include-entregador]'));
    if (!includes.length) return;

    await Promise.all(includes.map(async (el) => {
      const path = el.getAttribute('data-include-entregador');
      if (!path) return;
      try {
        const html = await fetchText(path);
        el.innerHTML = html;
        executeScripts(el);
        el.removeAttribute('data-include-entregador');
      } catch (err) {
        console.error('includes-entregador.js: erro ao carregar', path, err);
      }
    }));

    if (document.querySelector('[data-include-entregador]')) await loadEntregadorIncludes();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadEntregadorIncludes);
  else loadEntregadorIncludes();
})();
