// js/dadosveiculo.js
// Gerencia toggle de edição e detalhes dos documentos do veículo
document.addEventListener('DOMContentLoaded', function () {
  const btnEditar = document.getElementById('btnEditar');
  const btnSalvar = document.getElementById('btnSalvar');
  const inputs = Array.from(document.querySelectorAll('.veiculo-card input, .veiculo-card select'));

  if (btnEditar) {
    btnEditar.addEventListener('click', function () {
      const editing = btnEditar.classList.toggle('editing');
      inputs.forEach(i => i.disabled = !editing);
      btnEditar.textContent = editing ? 'Cancelar' : 'Editar Dados';
      // Focus first input when entering edit mode
      if (editing) inputs[0]?.focus();
    });
  }

  if (btnSalvar) {
    btnSalvar.addEventListener('click', function () {
      // Simples feedback: desabilita inputs e volta ao modo view
      inputs.forEach(i => i.disabled = true);
      if (btnEditar) { btnEditar.classList.remove('editing'); btnEditar.textContent = 'Editar Dados'; }
      // poderia salvar via API; aqui apenas um feedback visual
      btnSalvar.textContent = 'Salvo';
      setTimeout(()=> btnSalvar.textContent = 'Salvar Alterações', 1500);
    });
  }

  // detalhes dos documentos
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-doc-detalhes');
    if (!btn) return;
    e.preventDefault();
    const item = btn.closest('.doc-item');
    if (!item) return;
    const detalhes = item.querySelector('.doc-detalhes');
    const open = detalhes.classList.toggle('open');
    // Se o botão é uma ação (renovar), não trocar o texto
    const actionTexts = ['Renovar Seguro', 'Visualizar Documento', 'Visualizar Certificado', 'Ver Apólice'];
    if (!actionTexts.includes(btn.textContent.trim())) {
      btn.textContent = open ? 'Ocultar Detalhes' : 'Ver Detalhes';
    }
  });
});
