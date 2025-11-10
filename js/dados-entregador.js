// js/dados-entregador.js
// Gerencia troca de abas (tabs) e toggle de detalhes dos documentos

document.addEventListener('DOMContentLoaded', function () {
  // Tab switching (simples): botões com data-target apontam para id do painel
  const tabButtons = Array.from(document.querySelectorAll('#dadosTabs .nav-link'));
  const tabPanes = Array.from(document.querySelectorAll('.tab-pane'));

  function showTab(targetId) {
    tabButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-target') === targetId));
    tabPanes.forEach(p => p.classList.toggle('active', '#' + p.id === targetId));
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const target = btn.getAttribute('data-target');
      showTab(target);
    });
  });

  // Detalhes dos documentos
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-doc-detalhes');
    if (!btn) return;
    e.preventDefault();
    const item = btn.closest('.doc-item');
    if (!item) return;
    const detalhes = item.querySelector('.doc-detalhes');
    const open = detalhes.classList.toggle('open');
    btn.textContent = open ? 'Ocultar Detalhes' : 'Ver Detalhes';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Opcional: inicializar com a primeira tab ativa
  if (tabButtons.length) tabButtons[0].click();
});
