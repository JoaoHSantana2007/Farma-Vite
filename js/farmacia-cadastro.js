// Script para a página de cadastro de entregador
// Valida o checkbox de termos e redireciona para a página de login
(function () {
  'use strict';
  var form = document.querySelector('.caixa form');
  if (!form) form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var termos = document.getElementById('termos');
    if (termos && !termos.checked) {
      // Feedback simples — mantém compatibilidade com versão anterior
      alert('Por favor, aceite os Termos de Uso e a Política de Privacidade.');
      termos.focus();
      return;
    }

    // Substitua este redirecionamento por envio via fetch quando integrar com backend
    window.location.href = 'login-farmacia.html';
  });
})();
