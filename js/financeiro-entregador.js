document.addEventListener('DOMContentLoaded', function () {
  const botoes = document.querySelectorAll('.filtro-group .filtro');
  const itens = document.querySelectorAll('.transacao-item');

  function setActive(btn) {
    botoes.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  function filtrar(period) {
    itens.forEach(it => {
      if (period === 'todos') {
        it.style.display = '';
        return;
      }
      const p = it.getAttribute('data-period');
      if (p === period) it.style.display = '';
      else it.style.display = 'none';
    });
  }

  botoes.forEach(b => {
    b.addEventListener('click', function () {
      const period = this.getAttribute('data-filter');
      setActive(this);
      filtrar(period);
    });
  });

  const inicial = document.querySelector('.filtro-group .filtro.active');
  if (inicial) filtrar(inicial.getAttribute('data-filter'));

  const btnSaque = document.getElementById('solicitarSaque');
  if (btnSaque) {
    btnSaque.addEventListener('click', function () {
      if (window.EntregadorAlerts && typeof window.EntregadorAlerts.show === 'function') {
        window.EntregadorAlerts.show('Solicitação de saque enviada. Aguarde confirmação.');
      } else if (window.UserAlerts && typeof window.UserAlerts.show === 'function') {
        window.UserAlerts.show('Solicitação de saque enviada. Aguarde confirmação.');
      } else {
        alert('Solicitação de saque enviada. Aguarde confirmação.');
      }
    });
  }

  const btnExportCSV = document.getElementById('exportarCSV');
  const btnExportJSON = document.getElementById('exportarJSON');
  const btnGerar = document.getElementById('gerarRelatorio');

  function coletarTransacoes() {
    const rows = Array.from(document.querySelectorAll('.transacao-item'));
    return rows.map(r => {
      const merchant = r.querySelector('.transacao-meta strong')?.textContent?.trim() || '';
      const meta = r.querySelector('.transacao-meta .small')?.textContent?.trim() || '';
      const amountEl = r.querySelector('.valor-concluido, .valor-pendente');
      const amount = amountEl ? amountEl.textContent.replace(/[^0-9,.-]+/g, '').trim() : '';
      const status = r.querySelector('.text-success, .text-warning')?.textContent?.trim() || '';
      return { merchant, meta, amount, status };
    });
  }

  function downloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  function exportCSV() {
    const data = coletarTransacoes();
    const header = ['Loja/Remetente', 'Detalhes', 'Valor', 'Status'];
    const lines = [header.join(',')];
    data.forEach(d => {
      const valor = d.amount.replace(',', '.');
      const row = [d.merchant, `"${d.meta}"`, valor, d.status];
      lines.push(row.join(','));
    });
    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const ts = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
    downloadBlob(`financeiro_export_${ts}.csv`, blob);
    if (window.EntregadorAlerts && typeof window.EntregadorAlerts.show === 'function') {
      window.EntregadorAlerts.show('Exportação CSV iniciada.');
    }
  }

  function exportJSON() {
    const data = coletarTransacoes();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const ts = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
    downloadBlob(`financeiro_export_${ts}.json`, blob);
    if (window.EntregadorAlerts && typeof window.EntregadorAlerts.show === 'function') {
      window.EntregadorAlerts.show('Exportação JSON iniciada.');
    }
  }

  function gerarRelatorioImprimivel() {
    const data = coletarTransacoes();
    const w = window.open('', '_blank');
    if (!w) {
      if (window.EntregadorAlerts && typeof window.EntregadorAlerts.show === 'function') {
        window.EntregadorAlerts.show('Não foi possível abrir a janela de impressão.');
      } else alert('Não foi possível abrir a janela de impressão.');
      return;
    }
    const estilo = `
      body{font-family:Arial,Helvetica,sans-serif;padding:20px}
      h1{font-size:18px}
      table{width:100%;border-collapse:collapse}
      th,td{padding:8px;border:1px solid #ddd;text-align:left}
    `;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Relatório Financeiro</title><style>${estilo}</style></head><body>
      <h1>Relatório Financeiro</h1>
      <p>Exportado em: ${new Date().toLocaleString()}</p>
      <table><thead><tr><th>Loja/Remetente</th><th>Detalhes</th><th>Valor</th><th>Status</th></tr></thead><tbody>
      ${data.map(d => `<tr><td>${d.merchant}</td><td>${d.meta}</td><td>${d.amount}</td><td>${d.status}</td></tr>`).join('')}
      </tbody></table>
    </body></html>`;
    w.document.write(html);
    w.document.close();
    setTimeout(() => { w.print(); }, 500);
  }

  if (btnExportCSV) btnExportCSV.addEventListener('click', exportCSV);
  if (btnExportJSON) btnExportJSON.addEventListener('click', exportJSON);
  if (btnGerar) btnGerar.addEventListener('click', gerarRelatorioImprimivel);
});
