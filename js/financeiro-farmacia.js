// JS unificado para a página Financeiro (Farmácia)
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    // Status / Toggle
    const toggleBtn = document.getElementById('toggleStatus');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    // Editáveis
    const editBtn = document.getElementById('btnEditar');
    const inputs = document.querySelectorAll('[data-editable]');

    // Transações / filtros / export
    const botoes = document.querySelectorAll('.filtro-group .filtro');
    const itens = document.querySelectorAll('.transacao-item');
    const btnSaque = document.getElementById('solicitarSaque');
    const btnExportCSV = document.getElementById('exportarCSV');
    const btnExportJSON = document.getElementById('exportarJSON');
    const btnGerar = document.getElementById('gerarRelatorio');

    // Restaurar estado online
    let online = true;
    try{ const saved = localStorage.getItem('farmaciaOnline'); if (saved !== null) online = saved === 'true'; }catch(e){}

    function updateStatusUI(){
      if (!statusDot || !statusText) return;
      statusDot.classList.toggle('success', online);
      statusDot.classList.toggle('warn', !online);
      statusText.textContent = online ? 'Farmácia Online' : 'Farmácia Offline';
      if (toggleBtn) toggleBtn.textContent = online ? 'Ficar Offline' : 'Ficar Online';
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
      if (editBtn) editBtn.textContent = on ? 'Salvar' : 'Editar';
      if (!on){
        const data = {};
        inputs.forEach(i => data[i.name || i.id] = i.value);
        try{ localStorage.setItem('farmaciaDados', JSON.stringify(data)); }catch(e){}
      }
    }
    if (editBtn){ editBtn.addEventListener('click', function(){ setEditing(!editing); }); }

    // Filtros de período
    function setActive(btn){ botoes.forEach(b => b.classList.remove('active')); if (btn) btn.classList.add('active'); }
    function filtrar(period){ if (!itens) return; itens.forEach(it => { if (period === 'todos') { it.style.display = ''; return; } const p = it.getAttribute('data-period'); if (p === period) it.style.display = ''; else it.style.display = 'none'; }); }
    botoes.forEach(b => b.addEventListener('click', function(){ const period = this.getAttribute('data-filter'); setActive(this); filtrar(period); }));
    const inicial = document.querySelector('.filtro-group .filtro.active'); if (inicial) filtrar(inicial.getAttribute('data-filter'));

    // Solicitar saque
    if (btnSaque){
      btnSaque.addEventListener('click', function(){
        if (window.UserAlerts && typeof window.UserAlerts.show === 'function'){
          window.UserAlerts.show('Solicitação de saque enviada. Aguarde confirmação.');
        } else if (window.EntregadorAlerts && typeof window.EntregadorAlerts.show === 'function'){
          window.EntregadorAlerts.show('Solicitação de saque enviada. Aguarde confirmação.');
        } else { alert('Solicitação de saque enviada. Aguarde confirmação.'); }
      });
    }

    // Export / Relatório
    function coletarTransacoes(){
      const rows = Array.from(document.querySelectorAll('.transacao-item'));
      return rows.map(r => {
        const merchant = r.querySelector('strong')?.textContent?.trim() || '';
        const meta = r.querySelector('.small')?.textContent?.trim() || '';
        const amountEl = r.querySelector('.fw-bold, .valor-concluido, .valor-pendente');
        const amount = amountEl ? amountEl.textContent.replace(/[^0-9,.-]+/g,'').trim() : '';
        const status = r.querySelector('.text-success, .text-warning')?.textContent?.trim() || '';
        return { merchant, meta, amount, status };
      });
    }

    function downloadBlob(filename, blob){ const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),5000); }

    function exportCSV(){ const data = coletarTransacoes(); const header = ['Loja/Remetente','Detalhes','Valor','Status']; const lines=[header.join(',')]; data.forEach(d=>{ const valor = d.amount.replace(',','.'); const row=[d.merchant,`"${d.meta}"`,valor,d.status]; lines.push(row.join(',')); }); const csv = lines.join('\n'); const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); const ts = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-'); downloadBlob(`financeiro_export_${ts}.csv`, blob); if (window.UserAlerts && typeof window.UserAlerts.show === 'function') window.UserAlerts.show('Exportação CSV iniciada.'); }

    function exportJSON(){ const data = coletarTransacoes(); const blob = new Blob([JSON.stringify(data,null,2)], { type: 'application/json' }); const ts = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-'); downloadBlob(`financeiro_export_${ts}.json`, blob); if (window.UserAlerts && typeof window.UserAlerts.show === 'function') window.UserAlerts.show('Exportação JSON iniciada.'); }

    function gerarRelatorioImprimivel(){ const data = coletarTransacoes(); const w = window.open('','_blank'); if(!w){ if (window.UserAlerts && typeof window.UserAlerts.show === 'function') window.UserAlerts.show('Não foi possível abrir a janela de impressão.'); else alert('Não foi possível abrir a janela de impressão.'); return; } const estilo = `body{font-family:Arial,Helvetica,sans-serif;padding:20px}h1{font-size:18px}table{width:100%;border-collapse:collapse}th,td{padding:8px;border:1px solid #ddd;text-align:left}`; const html = `<!doctype html><html><head><meta charset="utf-8"><title>Relatório Financeiro</title><style>${estilo}</style></head><body><h1>Relatório Financeiro</h1><p>Exportado em: ${new Date().toLocaleString()}</p><table><thead><tr><th>Loja/Remetente</th><th>Detalhes</th><th>Valor</th><th>Status</th></tr></thead><tbody>${data.map(d=>`<tr><td>${d.merchant}</td><td>${d.meta}</td><td>${d.amount}</td><td>${d.status}</td></tr>`).join('')}</tbody></table></body></html>`; w.document.write(html); w.document.close(); setTimeout(()=>{ w.print(); },500); }

    if (btnExportCSV) btnExportCSV.addEventListener('click', exportCSV);
    if (btnExportJSON) btnExportJSON.addEventListener('click', exportJSON);
    if (btnGerar) btnGerar.addEventListener('click', gerarRelatorioImprimivel);

    // Inicializar UI e carregar dados salvos
    updateStatusUI();
    try{ const saved = localStorage.getItem('farmaciaDados'); if (saved){ const obj = JSON.parse(saved); inputs.forEach(i=>{ if (obj[i.name || i.id] !== undefined) i.value = obj[i.name || i.id]; }); } }catch(e){}

  });
})();
