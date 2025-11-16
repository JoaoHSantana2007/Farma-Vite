(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const tabs = document.querySelectorAll('.tab-btn');
    const rows = document.querySelectorAll('#higien-list tr');
    const kpiConcluidas = document.getElementById('kpi-concluidas');
    const kpiPendentes = document.getElementById('kpi-pendentes');
    const kpiAgendadas = document.getElementById('kpi-agendadas');

    function updateKPIs(){
      const totals = {concluida:0, pendente:0, agendada:0};
      rows.forEach(r => {
        const s = r.getAttribute('data-status');
        if (s === 'concluida') totals.concluida++;
        else if (s === 'pendente') totals.pendente++;
        else if (s === 'agendada') totals.agendada++;
      });
      if (kpiConcluidas) kpiConcluidas.textContent = totals.concluida;
      if (kpiPendentes) kpiPendentes.textContent = totals.pendente;
      if (kpiAgendadas) kpiAgendadas.textContent = totals.agendada;
    }

    function showTab(name){
      tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab')===name));
      rows.forEach(r => {
        const s = r.getAttribute('data-status');
        if (name === 'recentes') r.style.display = '';
        else if (name === 'todos') r.style.display = '';
        else r.style.display = (s === name) ? '' : 'none';
      });
    }

    tabs.forEach(t => t.addEventListener('click', function(){ showTab(this.getAttribute('data-tab')); }));

    updateKPIs();
    const initial = document.querySelector('.tab-btn.active');
    if (initial) showTab(initial.getAttribute('data-tab'));
  });
})();
