document.addEventListener('DOMContentLoaded', function () {
    const STORAGE_KEY = 'metodoPagamentoSelecionado';

    const radioButtons = Array.from(document.querySelectorAll('input[name="metodoPagamento"]'));
    const todosDetalhes = Array.from(document.querySelectorAll('.detalhes-metodo'));
    const cartoes = Array.from(document.querySelectorAll('.cartao-metodo'));

    function ensureLiveRegion() {
        let live = document.querySelector('#metodo-pagamento-live');
        if (!live) {
            live = document.createElement('div');
            live.id = 'metodo-pagamento-live';
            live.setAttribute('aria-live', 'polite');
            live.setAttribute('aria-atomic', 'true');
            live.style.position = 'absolute';
            live.style.left = '-9999px';
            document.body.appendChild(live);
        }
        return live;
    }

    const liveRegion = ensureLiveRegion();
    function notify(message) { if (liveRegion) liveRegion.textContent = message; }

    function mostrarDetalhesSelecionados(metodoSelecionado) {
        todosDetalhes.forEach(d => d.classList.add('d-none'));
        cartoes.forEach(c => c.classList.remove('metodo-ativo'));

        const cartaoAtivo = document.querySelector(`.cartao-metodo[data-metodo="${metodoSelecionado}"]`);
        if (cartaoAtivo) {
            const detalhesAtivos = cartaoAtivo.querySelector('.detalhes-metodo');
            if (detalhesAtivos) {
                detalhesAtivos.classList.remove('d-none');
                cartaoAtivo.classList.add('metodo-ativo');
            }
        }
    }

    (function restoreSelected() {
        const saved = localStorage.getItem(STORAGE_KEY);
        let initial = document.querySelector('input[name="metodoPagamento"]:checked');
        if (saved) {
            const savedInput = document.querySelector(`input[name="metodoPagamento"][value="${saved}"]`);
            if (savedInput) { savedInput.checked = true; initial = savedInput; }
        }
        if (initial) mostrarDetalhesSelecionados(initial.value);
    })();

    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            mostrarDetalhesSelecionados(this.value);
            try { localStorage.setItem(STORAGE_KEY, this.value); } catch (e) {}
        });
    });

    cartoes.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const metodo = card.dataset.metodo;
            const input = document.querySelector(`input[name="metodoPagamento"][value="${metodo}"]`);
            if (input) input.checked = true, input.dispatchEvent(new Event('change', { bubbles: true }));
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
        });
    });

    document.querySelectorAll('.detalhes-pix').forEach(pixBox => {
        const codeEl = pixBox.querySelector('.codigo-pix');
        const btn = pixBox.querySelector('.btn-copiar-pix');
        const qrIcon = pixBox.querySelector('.qr-icon');
        const code = codeEl ? codeEl.textContent.trim() : (btn ? (btn.dataset.pix || '') : '');
        if (btn && code) btn.dataset.pix = code;
        if (qrIcon && code) qrIcon.setAttribute('title', 'Código PIX: ' + code);
    });

    document.querySelectorAll('.btn-copiar-pix').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const code = btn.dataset.pix || btn.getAttribute('data-pix') || btn.textContent.trim();
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(code);
                else {
                    const ta = document.createElement('textarea'); ta.value = code; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
                }
                const original = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check-circle me-1"></i> Copiado!';
                btn.disabled = true;
                notify('Código PIX copiado para a área de transferência');
                setTimeout(() => { btn.innerHTML = original; btn.disabled = false; }, 2000);
            } catch (err) {
                alert('Não foi possível copiar automaticamente. Copie manualmente: ' + code);
            }
        });
    });

    function onlyDigits(str) { return (str || '').replace(/\D/g, ''); }
    function formatCardNumber(value) {
        const digits = onlyDigits(value).slice(0, 19);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    }
    function detectCardBrand(number) {
        const n = onlyDigits(number);
        if (/^4/.test(n)) return 'visa';
        if (/^5[1-5]/.test(n) || /^2(2[2-9]|[3-6]\d|7[01])/.test(n)) return 'mastercard';
        if (/^3[47]/.test(n)) return 'amex';
        if (/^6(?:011|5)/.test(n) || /^64[4-9]/.test(n)) return 'discover';
        return 'unknown';
    }
    function luhnCheck(cardNumber) {
        const digits = onlyDigits(cardNumber);
        let sum = 0; let shouldDouble = false;
        for (let i = digits.length - 1; i >= 0; i--) {
            let d = parseInt(digits.charAt(i), 10);
            if (shouldDouble) { d *= 2; if (d > 9) d -= 9; }
            sum += d; shouldDouble = !shouldDouble;
        }
        return digits.length > 0 && sum % 10 === 0;
    }
    function validateExpiry(value) {
        if (!value) return false;
        const parts = value.split('/').map(p => p.trim()); if (parts.length !== 2) return false;
        let month = parseInt(parts[0], 10); let year = parseInt(parts[1], 10);
        if (isNaN(month) || isNaN(year)) return false; if (year < 100) year += 2000;
        if (month < 1 || month > 12) return false;
        const now = new Date(); const exp = new Date(year, month - 1, 1);
        return exp >= new Date(now.getFullYear(), now.getMonth(), 1);
    }
    function validateCvv(cvv, brand) {
        const d = onlyDigits(cvv);
        if (brand === 'amex') return d.length === 4; return d.length === 3;
    }

    const cardNumberInput = document.querySelector('input[name="cardNumber"]');
    const cardExpiryInput = document.querySelector('input[name="cardExpiry"]');
    const cardCvvInput = document.querySelector('input[name="cardCvv"]');
    const cardHolderInput = document.querySelector('input[name="cardHolder"]');
    const pagamentoForm = document.querySelector('form.metodo-pagamento-form') || document.querySelector('form');

    function setFieldError(el, message) {
        if (!el) return; let err = el.parentElement.querySelector('.field-error');
        if (message) {
            if (!err) { err = document.createElement('div'); err.className = 'field-error'; el.parentElement.appendChild(err); }
            err.textContent = message;
        } else { if (err) err.remove(); }
    }

    function updateCardPreview() {
        const preview = document.querySelector('.card-preview');
        if (!preview) return;
        const numEl = preview.querySelector('.card-number');
        const holderEl = preview.querySelector('.card-holder');
        const expEl = preview.querySelector('.card-expiry');
        const brandEl = preview.querySelector('.brand');

        const raw = cardNumberInput ? onlyDigits(cardNumberInput.value) : '';
        const last4 = raw.slice(-4);
        const masked = raw.length <= 4 ? raw.padStart(4, 'X') : raw.slice(0, Math.max(0, raw.length - 4)).replace(/\d/g, 'X') + last4;
        const grouped = masked.replace(/(.{4})/g, '$1 ').trim();
        if (numEl) numEl.textContent = grouped || 'XXXX XXXX XXXX 1234';

        if (cardHolderInput && holderEl) holderEl.textContent = (cardHolderInput.value || 'NOME DO TITULAR').toUpperCase();
        if (cardExpiryInput && expEl) expEl.textContent = (cardExpiryInput.value || 'MM/AA');
        if (cardNumberInput && brandEl) brandEl.textContent = detectCardBrand(cardNumberInput.value).toUpperCase();
    }

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            const pos = e.target.selectionStart;
            e.target.value = formatCardNumber(e.target.value);
            updateCardPreview();
            setFieldError(cardNumberInput, '');
        });
        cardNumberInput.addEventListener('blur', (e) => { if (!luhnCheck(e.target.value)) setFieldError(cardNumberInput, 'Número de cartão inválido'); else setFieldError(cardNumberInput, ''); });
    }
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', (e) => { let v = onlyDigits(e.target.value); if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2,6); e.target.value = v; updateCardPreview(); setFieldError(cardExpiryInput, ''); });
        cardExpiryInput.addEventListener('blur', (e) => { if (e.target.value && !validateExpiry(e.target.value)) setFieldError(cardExpiryInput, 'Data de validade inválida'); else setFieldError(cardExpiryInput, ''); });
    }
    if (cardCvvInput) {
        cardCvvInput.addEventListener('input', (e) => { e.target.value = onlyDigits(e.target.value).slice(0,4); setFieldError(cardCvvInput, ''); });
        cardCvvInput.addEventListener('blur', (e) => { const brand = (cardNumberInput && cardNumberInput.dataset.brand) || detectCardBrand(cardNumberInput ? cardNumberInput.value : ''); if (e.target.value && !validateCvv(e.target.value, brand)) setFieldError(cardCvvInput, 'CVV inválido para a bandeira do cartão'); else setFieldError(cardCvvInput, ''); });
    }
    if (cardHolderInput) cardHolderInput.addEventListener('input', updateCardPreview);

    updateCardPreview();

    if (pagamentoForm) {
        pagamentoForm.addEventListener('submit', (e) => {
            const selected = document.querySelector('input[name="metodoPagamento"]:checked');
            if (selected && selected.value && selected.value.toLowerCase().includes('cred')) {
                let ok = true;
                if (cardNumberInput && !luhnCheck(cardNumberInput.value)) { setFieldError(cardNumberInput, 'Número de cartão inválido'); ok = false; }
                if (cardExpiryInput && !validateExpiry(cardExpiryInput.value)) { setFieldError(cardExpiryInput, 'Data de validade inválida'); ok = false; }
                if (cardCvvInput) { const brand = (cardNumberInput && cardNumberInput.dataset.brand) || detectCardBrand(cardNumberInput ? cardNumberInput.value : ''); if (!validateCvv(cardCvvInput.value, brand)) { setFieldError(cardCvvInput, 'CVV inválido'); ok = false; } }
                if (!ok) { e.preventDefault(); notify('Dados do cartão inválidos. Por favor corrija os campos.'); }
            }
        });
    }

});