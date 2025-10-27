document.addEventListener('DOMContentLoaded', function() {
    const radioButtons = document.querySelectorAll('input[name="metodoPagamento"]');
    const todosDetalhes = document.querySelectorAll('.detalhes-metodo');
    function mostrarDetalhesSelecionados(metodoSelecionado) {
        todosDetalhes.forEach(detalhes => {
            detalhes.classList.add('d-none');
        });
        document.querySelectorAll('.cartao-metodo').forEach(cartao => {
            cartao.classList.remove('metodo-ativo');
        });
        const cartaoAtivo = document.querySelector(`.cartao-metodo[data-metodo="${metodoSelecionado}"]`);
        if (cartaoAtivo) {
            const detalhesAtivos = cartaoAtivo.querySelector('.detalhes-metodo');
            if (detalhesAtivos) {
                detalhesAtivos.classList.remove('d-none');
                cartaoAtivo.classList.add('metodo-ativo');
            }
        }
    }
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            mostrarDetalhesSelecionados(this.value);
        });
    });
    const metodoInicial = document.querySelector('input[name="metodoPagamento"]:checked');
    if (metodoInicial) {
        mostrarDetalhesSelecionados(metodoInicial.value);
    }
    const btnCopiar = document.querySelector('.btn-copiar-pix');
    if (btnCopiar) {
        btnCopiar.addEventListener('click', function() {
            alert('Código PIX copiado!');
            btnCopiar.innerHTML = '<i class="fas fa-check me-1"></i> Copiado!';
            setTimeout(() => {
                btnCopiar.innerHTML = '<i class="far fa-copy me-1"></i> Copiar';
            }, 2000);
        });
    }
});