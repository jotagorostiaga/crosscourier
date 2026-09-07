(function () {
  var DATA = JSON.parse(document.getElementById("cc-data").textContent);
  var app = document.getElementById("cc-app");
  var stepIndex = 0;
  var pendingAnchor = null;

  function slugFromHash() {
    var raw = (location.hash || "").replace(/^#\/?/, "");
    if (!raw) return "index";
    return DATA.pages[raw] ? raw : "index";
  }

  function swapMedia(scope) {
    scope.querySelectorAll("img[src]").forEach(function (img) {
      var src = img.getAttribute("src");
      if (DATA.media[src]) img.src = DATA.media[src];
    });
  }

  // El header cambia de forma por CSS: acá sólo se refleja el estado.
  function setHeader() {
    var header = app.querySelector("header");
    if (!header) return;
    if (header.dataset.menu === "open") return; // con menú abierto queda estirado
    header.dataset.scrolled = String(window.scrollY > 8);
  }

  // Servicios que se revelan con el scroll: mismo cálculo que en el sitio.
  function syncScrollytell() {
    app.querySelectorAll("[data-scrollytell]").forEach(function (track) {
      var items = track.querySelectorAll("[data-stack-item]");
      var shots = track.querySelectorAll("[data-stack-shot]");
      if (!items.length) return;
      var rect = track.getBoundingClientRect();
      var travel = rect.height - window.innerHeight;
      if (travel <= 0) return;
      var progress = Math.min(Math.max(-rect.top / travel, 0), 1);
      var index = Math.min(items.length - 1, Math.floor(progress * items.length));
      items.forEach(function (item, i) {
        item.setAttribute("data-on", String(i === index));
      });
      shots.forEach(function (shot, i) {
        shot.setAttribute("data-on", String(i === index));
      });
    });
  }

  /* ---------- menú desplegable del header ---------- */
  function closePanels(header) {
    header.querySelectorAll("[id^='nav-panel-']").forEach(function (panel) {
      panel.hidden = true;
    });
    header.querySelectorAll("[data-nav-trigger]").forEach(function (trigger) {
      trigger.setAttribute("aria-expanded", "false");
      trigger.classList.remove("bg-surface-2", "text-fg");
      trigger.classList.add("text-fg-muted");
      var caret = trigger.querySelector("svg");
      if (caret) caret.classList.remove("rotate-180");
    });
    var scrim = header.querySelector(".cc-headscrim");
    if (scrim) scrim.hidden = true;
    header.dataset.menu = "closed";
    setHeader();
  }

  function togglePanel(trigger) {
    var header = trigger.closest("header");
    if (!header) return;
    var panel = document.getElementById(trigger.getAttribute("aria-controls"));
    var wasOpen = trigger.getAttribute("aria-expanded") === "true";
    closePanels(header);
    if (wasOpen || !panel) return;
    panel.hidden = false;
    panel.classList.remove("cc-fade");
    void panel.getBoundingClientRect();
    panel.classList.add("cc-fade");
    trigger.setAttribute("aria-expanded", "true");
    trigger.classList.add("bg-surface-2", "text-fg");
    trigger.classList.remove("text-fg-muted");
    var caret = trigger.querySelector("svg");
    if (caret) caret.classList.add("rotate-180");
    var scrim = header.querySelector(".cc-headscrim");
    if (scrim) scrim.hidden = false;
    header.dataset.menu = "open";
    header.dataset.scrolled = "true";
  }

  // Baja hasta la sección enlazada, dejando lugar al header.
  function scrollToAnchor() {
    if (!pendingAnchor) return;
    var target = document.getElementById(pendingAnchor);
    pendingAnchor = null;
    if (!target) return;
    var offset =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--cc-header-h"),
        10,
      ) || 84;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset - 24,
      behavior: "smooth",
    });
  }

  function note(message) {
    var existing = document.querySelector(".cc-note");
    if (existing) existing.remove();
    var el = document.createElement("div");
    el.className = "cc-note";
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(function () {
      el.remove();
    }, 3200);
  }

  /* ---------- render ---------- */
  function render(slug) {
    app.innerHTML = '<div class="cc-page"></div>';
    var page = app.firstElementChild;
    page.innerHTML = DATA.pages[slug];
    swapMedia(page);
    window.scrollTo(0, 0);
    setHeader();
    syncScrollytell();
    if (pendingAnchor) requestAnimationFrame(scrollToAnchor);
    if (slug === "cotizar" || slug.indexOf("lp/") === 0) {
      stepIndex = 0;
      renderStep(slug.indexOf("lp/") === 0 ? 2 : 0);
    }
    document.title = "CrossCourier";
  }

  /* ---------- cotizador ---------- */
  // Lo que el usuario ya escribió o eligió se conserva al ir y volver.
  var stepCache = {};

  // innerHTML no guarda lo que el usuario tipeó: hay que pasar los valores
  // vivos a atributos antes de cachear el paso.
  function freeze(scope) {
    scope.querySelectorAll("input").forEach(function (input) {
      if (input.type === "radio" || input.type === "checkbox") {
        if (input.checked) input.setAttribute("checked", "");
        else input.removeAttribute("checked");
      } else {
        input.setAttribute("value", input.value);
      }
    });
    scope.querySelectorAll("textarea").forEach(function (area) {
      area.textContent = area.value;
    });
    scope.querySelectorAll("select").forEach(function (select) {
      Array.prototype.forEach.call(select.options, function (option) {
        if (option.value === select.value) option.setAttribute("selected", "");
        else option.removeAttribute("selected");
      });
    });
  }

  function renderStep(index) {
    var host = app.querySelector("[data-quote-flow]");
    if (!host) return;
    if (host.innerHTML.trim()) {
      freeze(host);
      stepCache[stepIndex] = host.innerHTML;
    }
    stepIndex = Math.max(0, Math.min(DATA.steps.length - 1, index));
    host.innerHTML = stepCache[stepIndex] || DATA.steps[stepIndex];
    swapMedia(host);
    var top = host.getBoundingClientRect().top + window.scrollY - 140;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
  }

  /* ---------- interacciones ---------- */
  document.addEventListener(
    "click",
    function (event) {
      var target = event.target;
      if (!target.closest) return;

      var link = target.closest("a[href]");
      if (link) {
        var href = link.getAttribute("href");
        if (href && href.charAt(0) === "#" && href.indexOf("#/") !== 0) {
          return; // ancla interna
        }
        if (href && href.indexOf("#/") === 0) {
          pendingAnchor = link.getAttribute("data-anchor");
          if (pendingAnchor && href.replace(/^#\/?/, "") === slugFromHash()) {
            // Ya estamos en la página: sólo hay que bajar hasta la sección.
            scrollToAnchor();
            closeMenu();
            var sameHeader = app.querySelector('header[data-menu="open"]');
            if (sameHeader) closePanels(sameHeader);
            return;
          }
          closeMenu();
          var openHeader = app.querySelector('header[data-menu="open"]');
          if (openHeader) closePanels(openHeader);
          return; // el router se encarga por hashchange
        }
        if (href && /^https?:|^mailto:|^tel:/.test(href)) return;
        event.preventDefault();
        return;
      }

      var scrim = target.closest(".cc-headscrim");
      if (scrim) {
        if (scrim.closest("#cc-menu")) closeMenu();
        else {
          var scrimHeader = scrim.closest("header");
          if (scrimHeader) closePanels(scrimHeader);
        }
        return;
      }

      var button = target.closest("button");
      if (!button) return;

      // menú desplegable de sección
      if (button.hasAttribute("data-nav-trigger")) {
        togglePanel(button);
        return;
      }

      // flechas de los rieles horizontales (oficinas, historias)
      var rail = button.getAttribute("data-rail");
      if (rail) {
        var section = button.closest("section");
        var list = section && section.querySelector(".cc-rail");
        if (list) {
          list.scrollBy({
            left: (rail === "next" ? 1 : -1) * list.clientWidth * 0.8,
            behavior: "smooth",
          });
        }
        return;
      }

      // menú mobile
      if (button.getAttribute("aria-label") === "Abrir menú") {
        openMenu();
        return;
      }
      if (button.getAttribute("aria-label") === "Cerrar menú") {
        closeMenu();
        return;
      }

      // tabs del selector de servicios
      if (button.getAttribute("role") === "tab") {
        var list = button.closest('[role="tablist"]');
        if (list) {
          list.querySelectorAll('[role="tab"]').forEach(function (tab) {
            var on = tab === button;
            tab.setAttribute("aria-selected", String(on));
            tab.tabIndex = on ? 0 : -1;
            tab.classList.toggle("bg-surface", on);
            tab.classList.toggle("hover:bg-surface/60", !on);
            var bar = tab.querySelector("span[aria-hidden]");
            if (bar) {
              bar.classList.toggle("scale-y-100", on);
              bar.classList.toggle("scale-y-0", !on);
            }
            var name = tab.querySelector("span > span:last-child");
            if (name) {
              name.classList.toggle("text-fg", on);
              name.classList.toggle("text-fg-muted", !on);
            }
            var panel = document.getElementById(tab.getAttribute("aria-controls"));
            if (panel) {
              panel.hidden = !on;
              if (on) {
                panel.classList.remove("cc-fade");
                void panel.getBoundingClientRect();
                panel.classList.add("cc-fade");
              }
            }
          });
        }
        return;
      }

      // acordeón de preguntas
      if (button.getAttribute("aria-controls")) {
        var panel = document.getElementById(button.getAttribute("aria-controls"));
        if (panel) {
          var open = button.getAttribute("aria-expanded") === "true";
          button.setAttribute("aria-expanded", String(!open));
          panel.hidden = open;
          if (!open) {
            panel.classList.remove("cc-fade");
            void panel.getBoundingClientRect();
            panel.classList.add("cc-fade");
          }
          var caret = button.querySelector("[data-faq-caret]");
          if (caret) caret.classList.toggle("rotate-180", !open);
          var card = button.closest("[data-faq-card]");
          if (card) card.setAttribute("data-open", String(!open));
        }
        return;
      }

      // toggle importar / exportar del hero
      if (button.getAttribute("role") === "radio") {
        var group = button.parentElement;
        group.querySelectorAll('[role="radio"]').forEach(function (option) {
          var active = option === button;
          option.setAttribute("aria-checked", String(active));
          option.classList.toggle("bg-ink", active);
          option.classList.toggle("text-on-ink", active);
          option.classList.toggle("text-fg-muted", !active);
          // La opción activa no lleva color de hover: si no, al pasar el mouse
          // el texto vuelve al ink y queda oscuro sobre oscuro.
          option.classList.toggle("hover:text-fg", !active);
        });
        var selects = app.querySelectorAll("form select");
        if (selects.length >= 2) {
          var exporting = button.textContent.trim().toLowerCase() === "exportar";
          selects[0].value = exporting ? "AR" : "CN";
          selects[1].value = exporting ? "US" : "AR";
        }
        return;
      }

      var label = button.textContent.trim();
      if (label.indexOf("Continuar cotización") === 0) {
        location.hash = "#/cotizar";
        return;
      }
      if (label === "Continuar") {
        renderStep(stepIndex + 1);
        return;
      }
      if (label === "Volver") {
        renderStep(stepIndex - 1);
        return;
      }
      if (label.indexOf("Recibir mi cotización") === 0) {
        note("Preview: el lead se envía cuando el sitio corre con su backend.");
        return;
      }
      if (label.indexOf("Consultar estado") === 0) {
        note("Preview: la consulta se deriva al equipo desde el sitio publicado.");
      }
    },
    true,
  );

  function openMenu() {
    if (document.getElementById("cc-menu")) return;
    var holder = document.createElement("div");
    holder.id = "cc-menu";
    holder.innerHTML = DATA.mobileMenu;
    swapMedia(holder);
    document.body.appendChild(holder);
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    var menu = document.getElementById("cc-menu");
    if (menu) menu.remove();
    document.body.style.overflow = "";
  }

  /* ---------- selección de opciones ---------- */
  // El radio nativo ya cambia de estado; acá se refleja en el diseño, con la
  // misma animación de entrada del check que usa el componente real.
  var SELECTED_CARD = ["border-ink", "bg-surface", "shadow-cc-sm"];
  var IDLE_CARD = [
    "border-line-strong",
    "bg-surface/60",
    "hover:border-ink-600",
    "hover:bg-surface",
  ];
  var SELECTED_DOT = ["border-orange", "bg-orange", "text-ink"];
  var IDLE_DOT = ["border-line-strong", "bg-transparent", "text-transparent"];

  function syncOptions(fieldset) {
    fieldset.querySelectorAll('input[type="radio"]').forEach(function (input) {
      var card = input.closest("label");
      if (!card) return;
      var dot = card.querySelector("span[aria-hidden]");
      var on = input.checked;
      SELECTED_CARD.forEach(function (c) { card.classList.toggle(c, on); });
      IDLE_CARD.forEach(function (c) { card.classList.toggle(c, !on); });
      if (!dot) return;
      SELECTED_DOT.forEach(function (c) { dot.classList.toggle(c, on); });
      IDLE_DOT.forEach(function (c) { dot.classList.toggle(c, !on); });
      var check = dot.querySelector("svg");
      if (check) {
        check.classList.remove("cc-pop");
        if (on) {
          void check.getBoundingClientRect();
          check.classList.add("cc-pop");
        }
      }
    });
  }

  document.addEventListener("change", function (event) {
    var input = event.target;
    if (!input || input.type !== "radio") return;
    var fieldset = input.closest("fieldset");
    if (fieldset) syncOptions(fieldset);
  });

  window.addEventListener("hashchange", function () {
    closeMenu();
    render(slugFromHash());
  });

  window.addEventListener(
    "scroll",
    function () {
      setHeader();
      syncScrollytell();
    },
    { passive: true },
  );

  render(slugFromHash());
})();
