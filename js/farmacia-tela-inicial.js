(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('toggleOnline');
    const statusInfo = document.getElementById('statusInfo');
    const modalEl = document.getElementById('onlineModal');

    let online = true;
    try{
      const saved = localStorage.getItem('farmaciaOnline');
      if (saved !== null) online = saved === 'true';
    }catch(e){}

    function showModal(message){
      const msgEl = document.getElementById('modalMessage');
      if (msgEl) msgEl.textContent = message;
      if (modalEl && typeof bootstrap !== 'undefined' && bootstrap.Modal){
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    }

    function updateUI(){
      if (statusInfo){
        statusInfo.innerHTML = online
          ? '<span class="badge bg-success">Disponível para vendas</span>'
          : '<span class="badge bg-danger">Indisponível para vendas</span>';
      }

      if (btn) btn.textContent = online ? 'Ficar Offline' : 'Ficar Online para Fazer Vendas';

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

    updateUI();
  });
})();
