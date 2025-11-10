// JS para a página Financeiro / Minha Farmácia (versão Farmácia)
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const toggleBtn = document.getElementById('toggleStatus');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const editBtn = document.getElementById('btnEditar');
    const inputs = document.querySelectorAll('[data-editable]');

    // restaurar estado
    let online = true;
    try{ const saved = localStorage.getItem('farmaciaOnline'); if (saved !== null) online = saved === 'true'; }catch(e){}

    function updateStatusUI(){
      if (!statusDot || !statusText) return;
      statusDot.classList.toggle('success', online);
      statusDot.classList.toggle('warn', !online);
      statusText.textContent = online ? 'Farmácia Online' : 'Farmácia Offline';
      toggleBtn.textContent = online ? 'Ficar Offline' : 'Ficar Online';
    }

    if (toggleBtn){
      toggleBtn.addEventListener('click', function(){
        online = !online;
        try{ localStorage.setItem('farmaciaOnline', String(online)); }catch(e){}
        updateStatusUI();
      });
    }

    // Edit / Save
    let editing = false;
    function setEditing(on){
      editing = on;
      inputs.forEach(i => { i.readOnly = !on; i.classList.toggle('editable', on); });
      editBtn.textContent = on ? 'Salvar' : 'Editar';
      if (!on){
        // salvar valores em localStorage (simulação)
        const data = {};
        inputs.forEach(i => data[i.name || i.id] = i.value);
        try{ localStorage.setItem('farmaciaDados', JSON.stringify(data)); }catch(e){}
      }
    }

    if (editBtn){
      editBtn.addEventListener('click', function(){ setEditing(!editing); });
    }

    // inicializar
    updateStatusUI();

    // carregar dados salvos
    try{
      const saved = localStorage.getItem('farmaciaDados');
      if (saved){
        const obj = JSON.parse(saved);
        inputs.forEach(i => { if (obj[i.name || i.id] !== undefined) i.value = obj[i.name || i.id]; });
      }
    }catch(e){}

  });
})();
