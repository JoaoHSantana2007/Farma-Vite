// JS de suporte ao formulário de cadastro de medicamentos
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('formCadastroRemedio');
    const modalEl = document.getElementById('cadastroModal');

    function showModal(){
      if (modalEl && typeof bootstrap !== 'undefined' && bootstrap.Modal){
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      } else {
        alert('Medicamento cadastrado com sucesso.');
      }
    }

    if (!form) return;

    form.addEventListener('submit', function(e){
      e.preventDefault();

      // validações simples
      const nome = document.getElementById('nome');
      const categoria = document.getElementById('categoria');

      if (!nome || !categoria) return;

      if (!nome.value.trim()){
        nome.focus();
        return;
      }
      if (!categoria.value){
        categoria.focus();
        return;
      }

      // Simular envio / salvar localmente (pode ser substituído por fetch)
      const payload = new FormData(form);
      try{
        // opcional: salvar no localStorage para testes
        const obj = {};
        for (const [k,v] of payload.entries()) obj[k]=v;
        localStorage.setItem('ultimoRemedio', JSON.stringify(obj));
      }catch(e){/* ignore */}

      // mostrar confirmação
      showModal();

      // reset do form após confirmação (opcional)
      form.reset();
    });
  });
})();
