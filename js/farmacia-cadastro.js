(function () {
  'use strict';
  var form = document.querySelector('.caixa form');
  if (!form) form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var termos = document.getElementById('termos');
    if (termos && !termos.checked) {
      alert('Por favor, aceite os Termos de Uso e a Política de Privacidade.');
      termos.focus();
      return;
    }

    window.location.href = 'login-farmacia.html';
  });
})();
