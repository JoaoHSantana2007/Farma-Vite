// js/entregas.js
// Fornece comportamento de expand/collapse para "Ver Detalhes" nos cards de entregas.

document.addEventListener('DOMContentLoaded', function () {
  function toggleDetalhes(btn) {
    const card = btn.closest('.entrega-card');
    if (!card) return;
    const detalhes = card.querySelector('.detalhes');
    if (!detalhes) return;
    const open = detalhes.classList.toggle('open');
    btn.textContent = open ? 'Ocultar Detalhes' : 'Ver Detalhes';
    // Keep focus visible for keyboard users
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  // Delegation: attach to document to handle future cards too
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-detalhes');
    if (!btn) return;
    e.preventDefault();
    toggleDetalhes(btn);
  });
});
