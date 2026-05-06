(function () {
  const STATE_KEY = "__mananEnhancementsState";
  const state = (window[STATE_KEY] = window[STATE_KEY] || {
    started: false,
    navInjected: false,
  });

  function ensureButtons() {
    const email = "mananjaviya11@gmail.com";
    const phoneDisplay = "+91 9879674792";
    const phoneHref = "tel:+919879674792";
    const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

    const emailLinks = Array.from(document.querySelectorAll("a")).filter((a) =>
      new RegExp(email, "i").test(a.textContent || "") || /^email$/i.test((a.textContent || "").trim())
    );
    emailLinks.forEach((a) => {
      a.setAttribute("href", gmailCompose);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noreferrer");
      a.setAttribute("aria-label", `Email ${email}`);
      a.dataset.contactAction = "email";
    });

    const phoneLinks = Array.from(document.querySelectorAll("a")).filter((a) =>
      (a.textContent || "").includes(phoneDisplay) || /^phone$/i.test((a.textContent || "").trim())
    );
    phoneLinks.forEach((a) => {
      a.removeAttribute("href");
      a.removeAttribute("target");
      a.removeAttribute("rel");
      a.setAttribute("role", "group");
      a.setAttribute("aria-label", `Phone ${phoneDisplay}`);
      a.dataset.contactAction = "phone-display";
    });

    if (phoneLinks[0] && !document.getElementById("custom-whatsapp-card")) {
      const whatsapp = document.createElement("a");
      whatsapp.id = "custom-whatsapp-card";
      whatsapp.href = "https://wa.me/919879674792";
      whatsapp.target = "_blank";
      whatsapp.rel = "noreferrer";
      whatsapp.className = emailLinks[0]?.className || phoneLinks[0].className;
      whatsapp.removeAttribute("role");
      whatsapp.dataset.contactAction = "whatsapp";
      whatsapp.setAttribute("aria-label", "Open WhatsApp chat");
      const emailCard = emailLinks[0];
      const emailArrow = emailCard?.lastElementChild;
      const arrowMarkup = emailArrow ? emailArrow.outerHTML : "";
      whatsapp.innerHTML = `
        <div class="custom-contact-icon">WA</div>
        <div>
          <div class="custom-contact-label">WhatsApp</div>
          <div class="custom-contact-value">Message me directly</div>
        </div>
        ${arrowMarkup}
      `;
      phoneLinks[0].insertAdjacentElement("afterend", whatsapp);
    }

    const githubButtons = Array.from(document.querySelectorAll("a")).filter((a) =>
      /github/i.test(a.textContent || "")
    );
    githubButtons.forEach((a) => {
      a.setAttribute("href", "https://github.com/Manan1107");
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noreferrer");
    });

    const linkedinButtons = Array.from(document.querySelectorAll("a")).filter((a) =>
      /linkedin/i.test(a.textContent || "")
    );
    linkedinButtons.forEach((a) => {
      a.setAttribute("href", "https://www.linkedin.com/in/manan-javiya/");
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noreferrer");
    });

    const resumeButtons = Array.from(document.querySelectorAll("a")).filter((a) =>
      /resume/i.test(a.textContent || "")
    );
    resumeButtons.forEach((a) => {
      a.setAttribute("href", "/Manan_Javiya_Resume.pdf");
      a.setAttribute("download", "Manan_Javiya_Resume.pdf");
    });
  }


  function getContactApiBase() {
  return "https://manan-portfolio-en6k.onrender.com/api";
}

  function setContactStatus(form, message, isError = false) {
    let status = form.querySelector(".custom-contact-status");
    if (!status) {
      status = document.createElement("p");
      status.className = "custom-contact-status";
      form.appendChild(status);
    }
    status.textContent = message;
    status.style.color = isError ? "#ff7a5c" : "#d4ff3a";
  }

  function valueAfterLabel(form, labelText) {
    const label = Array.from(form.querySelectorAll("label")).find((labelEl) =>
      new RegExp(`^${labelText}$`, "i").test((labelEl.textContent || "").trim())
    );
    const field = label?.parentElement?.querySelector("input, textarea");
    return field ? field.value.trim() : "";
  }

  function wireContactForm() {
    const form = document.querySelector("#contact form");
    if (!form || form.dataset.mananContactWired === "1") return;
    form.dataset.mananContactWired = "1";

    form.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const payload = {
          name: valueAfterLabel(form, "Your name"),
          email: valueAfterLabel(form, "Email"),
          subject: valueAfterLabel(form, "Subject"),
          message: valueAfterLabel(form, "Message"),
        };

        if (!payload.name || !payload.email || !payload.message) {
          setContactStatus(form, "Please fill in name, email and message.", true);
          return;
        }

        const button = form.querySelector("button[type='submit']");
        const originalText = button ? button.textContent : "";
        if (button) {
          button.disabled = true;
          button.textContent = "Sending...";
        }
        setContactStatus(form, "Sending your message...");

        try {
          const res = await fetch(`${getContactApiBase()}/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.message || "Message could not be sent.");

          form.querySelectorAll("input, textarea").forEach((field) => {
            field.value = "";
            field.dispatchEvent(new Event("input", { bubbles: true }));
          });
          setContactStatus(form, "Message sent. I will get back to you soon.");
        } catch (error) {
          setContactStatus(form, error.message || "Something went wrong. Please email me directly.", true);
        } finally {
          if (button) {
            button.disabled = false;
            button.textContent = originalText || "Send message";
          }
        }
      },
      true
    );
  }

  function addContactResponseNote() {
    const contact = document.getElementById("contact");
    if (!contact || document.getElementById("custom-contact-response-note")) return;

    const target = contact.querySelector("h2") || contact.querySelector(".section-title");
    if (!target) return;

    const note = document.createElement("p");
    note.id = "custom-contact-response-note";
    note.textContent = "I usually respond within 24-48 hours.";
    target.insertAdjacentElement("afterend", note);
  }

  function alignContactLayout() {
    const contact = document.getElementById("contact");
    const form = contact?.querySelector("form");
    const cards = contact?.querySelector(".space-y-5");
    if (!contact || !form || !cards) return;

    const layout = form.closest(".grid");
    if (layout) layout.classList.add("custom-contact-layout");
    form.closest(".card-frame")?.classList.add("custom-contact-form-card");
    cards.classList.add("custom-contact-cards");
  }

  function injectHeaderLinks() {
    if (state.navInjected) return;
    const allAnchors = Array.from(document.querySelectorAll("a"));
    const workAnchor = allAnchors.find((a) => /^work$/i.test((a.textContent || "").trim()));
    const contactAnchor = allAnchors.find((a) => /^contact$/i.test((a.textContent || "").trim()));
    const navAnchor = contactAnchor || workAnchor;
    if (!navAnchor || !navAnchor.parentElement) return;
    const parent = navAnchor.parentElement;

    if (parent.dataset.mananNavInjected === "1") {
      state.navInjected = true;
      return;
    }

    const ref = parent.querySelector("a") || contactAnchor;
    const cls = ref.getAttribute("class") || "";

    const add = (id, text, href) => {
      const link = document.createElement("a");
      link.id = id;
      link.href = href;
      link.textContent = text;
      if (cls) link.setAttribute("class", cls);
      return link;
    };

    const hrefExists = (href) =>
      Array.from(parent.querySelectorAll("a")).some((a) => a.getAttribute("href") === href);

    if (workAnchor && !hrefExists("/")) workAnchor.insertAdjacentElement("beforebegin", add("custom-nav-home", "Home", "/"));
    if (!hrefExists("/blog/index.html")) contactAnchor.insertAdjacentElement("afterend", add("custom-nav-blog", "Blog", "/blog/index.html"));
    if (!hrefExists("/notes/index.html")) contactAnchor.insertAdjacentElement("afterend", add("custom-nav-notes", "Notes", "/notes/index.html"));

    parent.dataset.mananNavInjected = "1";
    state.navInjected = true;
  }

  function init() {
    ensureButtons();
    injectHeaderLinks();
    wireContactForm();
    addContactResponseNote();
    alignContactLayout();
  }

  function start() {
    if (state.started) return;
    state.started = true;
    init();
    const obs = new MutationObserver(() => {
      init();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
