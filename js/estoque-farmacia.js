(function () {
  "use strict";

  const STORAGE_KEY = "farmacia_estoque_v1";
  const LOW_STOCK_THRESHOLD = 5;

  const qs = (s, root = document) => root.querySelector(s);
  const qsa = (s, root = document) => Array.from(root.querySelectorAll(s));

  function loadProducts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Erro ao ler estoque", e);
      return [];
    }
  }

  function saveProducts(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function generateId() {
    return "p_" + Date.now();
  }

  function formatDate(d) {
    if (!d) return "";
    try {
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      return dt.toLocaleDateString();
    } catch {
      return d;
    }
  }

  function renderTable(filter = "") {
    const tbody = qs("#corpo-tabela");
    const products = loadProducts();
    const q = (filter || "").toLowerCase();
    tbody.innerHTML = "";

    const lista = products.filter((p) => {
      if (!q) return true;
      return (
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.nome && p.nome.toLowerCase().includes(q))
      );
    });

    if (!lista.length) {
      tbody.innerHTML =
        '<tr><td colspan="6" class="text-center text-muted">Nenhum produto no estoque.</td></tr>';
      return;
    }

    for (const p of lista) {
      const tr = document.createElement("tr");
      if ((Number(p.quantidade) || 0) < LOW_STOCK_THRESHOLD)
        tr.classList.add("baixo-estoque");

      tr.innerHTML = `
        <td>${escapeHtml(p.sku || "")}</td>
        <td>
          <div class="produto-nome">${escapeHtml(p.nome || "")}</div>
          <div class="text-muted small">${escapeHtml(p.descricao || "")}</div>
        </td>
        <td><span class="badge bg-light text-dark badge-quantidade">${
          Number(p.quantidade) || 0
        }</span></td>
        <td>${Number(p.preco || 0).toFixed(2)}</td>
        <td>${formatDate(p.validade)}</td>
        <td class="text-center acoes-btns">
          <button class="btn btn-sm btn-outline-primary btn-editar" data-id="${
            p.id
          }" title="Editar"><i class="fa fa-edit"></i></button>
          <button class="btn btn-sm btn-outline-danger btn-apagar" data-id="${
            p.id
          }" title="Apagar"><i class="fa fa-trash"></i></button>
        </td>
      `;

      tbody.appendChild(tr);
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, function (m) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[m];
    });
  }

  function addProduct(data) {
    const lista = loadProducts();
    data.id = generateId();
    lista.unshift(data);
    saveProducts(lista);
    renderTable(qs("#buscar-produto").value);
  }

  function updateProduct(id, data) {
    const lista = loadProducts();
    const idx = lista.findIndex((x) => x.id === id);
    if (idx === -1) return false;
    lista[idx] = Object.assign({ id }, data);
    saveProducts(lista);
    renderTable(qs("#buscar-produto").value);
    return true;
  }

  function deleteProduct(id) {
    let lista = loadProducts();
    lista = lista.filter((x) => x.id !== id);
    saveProducts(lista);
    renderTable(qs("#buscar-produto").value);
  }

  function fillForm(produto) {
    qs("#produto-id").value = produto.id || "";
    qs("#produto-sku").value = produto.sku || "";
    qs("#produto-nome").value = produto.nome || "";
    qs("#produto-quantidade").value = produto.quantidade || 0;
    qs("#produto-preco").value = produto.preco || 0;
    qs("#produto-validade").value = produto.validade || "";
    qs("#produto-descricao").value = produto.descricao || "";
    qs("#titulo-modal").textContent = produto.id
      ? "Editar Produto"
      : "Novo Produto";
  }

  function resetForm() {
    fillForm({});
  }

  function setupHandlers() {
    qs("#buscar-produto").addEventListener("input", (e) =>
      renderTable(e.target.value)
    );
    qs("#btn-novo").addEventListener("click", () => {
      resetForm();
    });
    qs("#form-produto").addEventListener("submit", function (ev) {
      ev.preventDefault();
      const id = qs("#produto-id").value;
      const data = {
        sku: qs("#produto-sku").value.trim(),
        nome: qs("#produto-nome").value.trim(),
        quantidade: Number(qs("#produto-quantidade").value) || 0,
        preco: Number(qs("#produto-preco").value) || 0,
        validade: qs("#produto-validade").value || "",
        descricao: qs("#produto-descricao").value.trim() || "",
      };

      if (id) {
        updateProduct(id, data);
      } else {
        addProduct(data);
      }
      const modalEl = document.getElementById("modalProduto");
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
      this.reset();
    });

    qs("#tabela-estoque").addEventListener("click", function (e) {
      const btn = e.target.closest("button");
      if (!btn) return;
      const id = btn.getAttribute("data-id");
      if (btn.classList.contains("btn-editar")) {
        const lista = loadProducts();
        const p = lista.find((x) => x.id === id);
        if (p) {
          fillForm(p);
          const modal = new bootstrap.Modal(qs("#modalProduto"));
          modal.show();
        }
      }
      if (btn.classList.contains("btn-apagar")) {
        if (confirm("Deseja remover este produto do estoque?")) {
          deleteProduct(id);
        }
      }
    });

    qs("#btn-exportar").addEventListener("click", () => {
      const data = loadProducts();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "estoque.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

    const importFile = qs("#import-file");
    qs("#btn-importar").addEventListener("click", () => importFile.click());
    importFile.addEventListener("change", function (e) {
      const f = e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = function (ev) {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (!Array.isArray(parsed)) throw new Error("Formato inválido");
          if (confirm("Substituir o estoque atual pelos dados importados?")) {
            const produtos = parsed.map((p) =>
              Object.assign({
                id: p.id || generateId(),
                sku: p.sku || "",
                nome: p.nome || "",
                quantidade: Number(p.quantidade || 0),
                preco: Number(p.preco || 0),
                validade: p.validade || "",
                descricao: p.descricao || "",
              })
            );
            saveProducts(produtos);
            renderTable(qs("#buscar-produto").value);
          }
        } catch (err) {
          alert("Falha ao importar: arquivo inválido");
          console.error(err);
        }
      };
      reader.readAsText(f);
      this.value = null;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const limText = qs("#limite-baixo-text");
    if (limText) limText.textContent = String(LOW_STOCK_THRESHOLD);
    if (!localStorage.getItem(STORAGE_KEY)) {
      const exemplo = [
        {
          id: generateId(),
          sku: "A100",
          nome: "Dipirona 500mg",
          quantidade: 12,
          preco: 8.5,
          validade: "",
          descricao: "Analgesico/antipiretico",
        },
        {
          id: generateId(),
          sku: "B200",
          nome: "Amoxicilina 500mg",
          quantidade: 3,
          preco: 19.9,
          validade: "",
          descricao: "Antibiotico",
        },
      ];
      saveProducts(exemplo);
    }

    (function ensureRequestedProducts() {
      const current = loadProducts();
      const toAdd = [];
      // Dipirona
      if (
        !current.some(
          (p) => p.nome && p.nome.toLowerCase().includes("dipirona")
        )
      ) {
        toAdd.push({
          sku: "A100",
          nome: "Dipirona 500mg",
          quantidade: 12,
          preco: 8.5,
          validade: "",
          descricao: "Analgesico/antipiretico",
        });
      }
      if (
        !current.some(
          (p) =>
            p.nome &&
            (p.nome.toLowerCase().includes("nafitalina") ||
              p.nome.toLowerCase().includes("naftalina"))
        )
      ) {
        toAdd.push({
          sku: "C300",
          nome: "Nafitalina 10mg",
          quantidade: 10,
          preco: 15.0,
          validade: "",
          descricao: "Produto adicionado automaticamente",
        });
      }
      if (toAdd.length) {
        const novos = toAdd.map((p) => Object.assign({ id: generateId() }, p));
        // adiciona no topo
        const merged = novos.concat(current);
        saveProducts(merged);
      }
    })();

    setupHandlers();
    renderTable();
  });
})();
