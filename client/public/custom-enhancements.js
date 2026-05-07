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
    return "";
  }

  async function sendViaFormSubmit(payload) {
    const res = await fetch("https://formsubmit.co/ajax/mananjaviya11@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        subject: payload.subject || "Portfolio contact",
        message: payload.message,
        _subject: `Portfolio contact: ${payload.subject || "No subject"}`,
        _captcha: "false",
      }),
    });
    return res;
  }

  async function postContact(payload) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 30000);

    try {
      const primary = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (primary.ok) return primary;
      // Fallback path for cases where Netlify function env/config is missing.
      return await sendViaFormSubmit(payload);
    } catch {
      return await sendViaFormSubmit(payload);
    } finally {
      window.clearTimeout(timeoutId);
    }
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
          const res = await postContact(payload);
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.message || "Message could not be sent.");

          form.querySelectorAll("input, textarea").forEach((field) => {
            field.value = "";
            field.dispatchEvent(new Event("input", { bubbles: true }));
          });
          setContactStatus(form, "Message sent. I will get back to you soon.");
        } catch (error) {
          const message =
            error.name === "AbortError"
              ? "Email service did not respond. Please try again."
              : error.message || "Something went wrong. Please email me directly.";
          setContactStatus(form, message, true);
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

  function addProfessionalStrip() {
    if (document.getElementById("custom-professional-strip")) return;

    const headings = Array.from(document.querySelectorAll("h1, h2"));
    const anchor = headings.find((el) => /manan|developer|engineer/i.test(el.textContent || ""));
    const section = anchor?.closest("section") || anchor?.parentElement;
    if (!section || !section.parentElement) return;

    const strip = document.createElement("section");
    strip.id = "custom-professional-strip";
    strip.className = "custom-professional-strip";
    strip.innerHTML = `
      <div class="custom-professional-card">
        <h2>Full-stack developer focused on reliable, usable products.</h2>
        <p>I build clean interfaces, practical APIs, and project experiences that feel polished from first click to final deploy. My work blends MERN fundamentals, thoughtful UI details, and a first-principles approach to performance, maintainability, and systems that scale.</p>
      </div>
      <div class="custom-professional-points" aria-label="Professional strengths">
        <div class="custom-professional-point">React + Node.js</div>
        <div class="custom-professional-point">API design</div>
        <div class="custom-professional-point">Production deployment</div>
      </div>
    `;
    section.insertAdjacentElement("afterend", strip);
  }

  function scrollToHashTarget() {
    if (window.location.hash !== "#work") return;

    const target =
      document.getElementById("work") ||
      Array.from(document.querySelectorAll("section")).find((section) =>
        /selected work|my work|projects/i.test(section.textContent || "")
      );

    if (!target || target.dataset.mananScrolledIntoView === "1") return;
    target.dataset.mananScrolledIntoView = "1";
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
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
    addProfessionalStrip();
    scrollToHashTarget();
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
