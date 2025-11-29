(function () {
    const exprEl = document.getElementById('expr');
    const resultEl = document.getElementById('result');
    const btns = document.querySelectorAll('button[data-val]');
    const clearBtn = document.getElementById('clear');
    const backBtn = document.getElementById('back');
    const equalsBtn = document.getElementById('equals');

    let expr = '';

    function refresh() {
        exprEl.textContent = expr || '\u00A0';
        resultEl.textContent = expr ? tryEvalShort(expr) : '0';
    }

    function tryEvalShort(s) {
        try {
            const v = safeEval(s);
            return Number.isFinite(v) ? String(v) : 'Error';
        } catch {
            return '';
        }
    }

    function safeEval(s) {
        const clean = s.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        if (!/^[0-9+\-*/%().\s]*$/.test(clean)) throw 'bad char';
        const fn = new Function('return (' + clean + ')');
        return fn();
    }

    btns.forEach(b => {
        b.addEventListener('click', () => {
            expr += b.dataset.val;
            refresh();
        });
    });

    clearBtn.addEventListener('click', () => {
        expr = '';
        refresh();
    });

    backBtn.addEventListener('click', () => {
        expr = expr.slice(0, -1);
        refresh();
    });

    equalsBtn.addEventListener('click', () => {
        try {
            expr = String(safeEval(expr || '0'));
            refresh();
        } catch {
            resultEl.textContent = 'Error';
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            equalsBtn.click();
            return;
        }
        if (e.key === 'Backspace') {
            e.preventDefault();
            backBtn.click();
            return;
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            clearBtn.click();
            return;
        }
        if (/^[0-9+\-*/%().]$/.test(e.key)) {
            expr += e.key;
            refresh();
        }
    });

    refresh();
})();
