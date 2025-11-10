// JS para a tela-inicial da farmácia
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('toggleOnline');
    const statusInfo = document.getElementById('statusInfo');
    const modalEl = document.getElementById('onlineModal');

    // restaurar estado salvo (opcional)
    let online = true;
    try{
      const saved = localStorage.getItem('farmaciaOnline');
      if (saved !== null) online = saved === 'true';
    }catch(e){ /* localStorage pode estar indisponível */ }

    function showModal(message){
      const msgEl = document.getElementById('modalMessage');
      if (msgEl) msgEl.textContent = message;
      if (modalEl && typeof bootstrap !== 'undefined' && bootstrap.Modal){
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    }

    function updateUI(){
      // statusInfo badge
      if (statusInfo){
        statusInfo.innerHTML = online
          ? '<span class="badge bg-success">Disponível para vendas</span>'
          : '<span class="badge bg-danger">Indisponível para vendas</span>';
      }

      // Botão
      if (btn) btn.textContent = online ? 'Ficar Offline' : 'Ficar Online para Fazer Vendas';

      // Optional: update dot/text if present in markup
      const statusDot = document.getElementById('statusDot');
      const statusText = document.getElementById('statusText');
      if (statusDot){
        statusDot.classList.toggle('bg-success', online);
        statusDot.classList.toggle('bg-danger', !online);
      }
      if (statusText) statusText.textContent = online ? 'Online' : 'Offline';
    }

    if (btn){
      btn.addEventListener('click', function(){
        online = !online;
        try{ localStorage.setItem('farmaciaOnline', String(online)); }catch(e){}
        updateUI();
        if (online) showModal('Você está disponível para vendas agora.');
        else showModal('Você saiu do modo de vendas.');
      });
    }

    // Inicializa UI
    updateUI();
  });
})();
