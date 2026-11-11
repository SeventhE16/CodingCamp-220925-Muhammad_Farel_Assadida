(() => {
    const WA_PHONE = "6281237965000";
    const THEME_KEY = "kembang_jaya_theme";

    // ---------- Theme Toggle (AppColors <-> DarkColors) ----------
    const themeToggle = document.getElementById("themeToggle");
    const rootEl = document.documentElement;

    function applyTheme(theme) {
        if (theme === "dark") {
            rootEl.setAttribute("data-theme", "dark");
        } else {
            rootEl.removeAttribute("data-theme");
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const nextTheme = rootEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
            applyTheme(nextTheme);
            try {
                localStorage.setItem(THEME_KEY, nextTheme);
            } catch (e) {}
        });
    }

    // ---------- Mobile Drawer ----------
    const menuToggle = document.getElementById("menuToggle");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const drawerBackdrop = document.getElementById("drawerBackdrop");
    const drawerClose = document.getElementById("drawerClose");
    const drawerLinks = document.querySelectorAll(".drawer-item");

    function setDrawerState(isOpen) {
        if (!mobileDrawer || !drawerBackdrop || !menuToggle) return;
        mobileDrawer.classList.toggle("open", isOpen);
        mobileDrawer.setAttribute("aria-hidden", String(!isOpen));
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        drawerBackdrop.hidden = !isOpen;
    }

    if (menuToggle) menuToggle.addEventListener("click", () => setDrawerState(true));
    if (drawerClose) drawerClose.addEventListener("click", () => setDrawerState(false));
    if (drawerBackdrop) drawerBackdrop.addEventListener("click", () => setDrawerState(false));
    drawerLinks.forEach((link) => {
        link.addEventListener("click", () => setDrawerState(false));
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && mobileDrawer && mobileDrawer.classList.contains("open")) {
            setDrawerState(false);
        }
    });

    // ---------- Active Navigation Highlight on Scroll ----------
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    if ("IntersectionObserver" in window && sections.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach((link) => {
                        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                    });
                    drawerLinks.forEach((link) => {
                        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                    });
                });
            },
            { rootMargin: "-35% 0px -55% 0px" }
        );
        sections.forEach((sec) => observer.observe(sec));
    }

    // ---------- Snackbar Feedback (mirrors showStatusSnackBar) ----------
    const snackbar = document.getElementById("statusSnackbar");
    const snackbarIcon = document.getElementById("snackbarIcon");
    const snackbarMessage = document.getElementById("snackbarMessage");
    let snackbarTimer = null;

    function showSnackbar(message, type = "success") {
        if (!snackbar || !snackbarIcon || !snackbarMessage) return;

        clearTimeout(snackbarTimer);
        snackbarMessage.textContent = message;
        snackbar.classList.toggle("error", type === "error");

        snackbarIcon.innerHTML =
            type === "error"
                ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
                : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;

        snackbar.hidden = false;
        requestAnimationFrame(() => snackbar.classList.add("visible"));

        snackbarTimer = setTimeout(() => {
            snackbar.classList.remove("visible");
            setTimeout(() => {
                snackbar.hidden = true;
            }, 200);
        }, 4000);
    }

    // ---------- Catalog Search & Category Chips ----------
    const searchInput = document.getElementById("catalogSearch");
    const categoryChips = document.querySelectorAll(".chip[data-category]");
    const productCards = document.querySelectorAll(".product-card");
    const emptyState = document.getElementById("catalogEmptyState");
    const resetFilterBtn = document.getElementById("resetCatalogFilter");
    let activeCategory = "all";

    function filterCatalog() {
        const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
        let visibleCount = 0;

        productCards.forEach((card) => {
            const category = card.dataset.category || "";
            const keywords = (card.dataset.keywords || "") + " " + card.textContent.toLowerCase();
            const matchesCategory = activeCategory === "all" || category === activeCategory;
            const matchesQuery = !query || keywords.includes(query);

            const show = matchesCategory && matchesQuery;
            card.hidden = !show;
            if (show) visibleCount += 1;
        });

        if (emptyState) {
            emptyState.hidden = visibleCount > 0;
        }
    }

    categoryChips.forEach((chip) => {
        chip.addEventListener("click", () => {
            activeCategory = chip.dataset.category || "all";
            categoryChips.forEach((btn) => {
                const isSelected = btn === chip;
                btn.classList.toggle("active", isSelected);
                btn.setAttribute("aria-selected", String(isSelected));
            });
            filterCatalog();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", filterCatalog);
    }

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            activeCategory = "all";
            categoryChips.forEach((btn) => {
                const isAll = btn.dataset.category === "all";
                btn.classList.toggle("active", isAll);
                btn.setAttribute("aria-selected", String(isAll));
            });
            filterCatalog();
        });
    }

    // ---------- Prefill Form from Product Cards ----------
    const inquiryButtons = document.querySelectorAll(".btn-inquiry");
    const messageField = document.getElementById("message");
    const needField = document.getElementById("need");
    const contactSection = document.getElementById("kontak");

    inquiryButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const productName = btn.dataset.product || "Produk Kayu";
            if (needField && productName.toLowerCase().includes("jasa")) {
                needField.value = "Jasa Potong & Serut / Pasah";
            }
            if (messageField) {
                messageField.value = `Halo Depot Kayu Kembang Jaya, saya ingin menanyakan stok dan harga untuk ${productName}.`;
                messageField.focus();
            }
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // ---------- Contact Form Validation & WhatsApp Handoff ----------
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const contact = document.getElementById("email").value.trim();
            const need = document.getElementById("need").value;
            const message = document.getElementById("message").value.trim();

            if (!name || !contact || !message) {
                showSnackbar("Mohon lengkapi nama, kontak, dan pesan Anda.", "error");
                return;
            }

            const formattedText = [
                "Halo Depot Kayu Kembang Jaya,",
                `Nama: ${name}`,
                `Kontak: ${contact}`,
                `Kebutuhan: ${need}`,
                `Pesan: ${message}`
            ].join("\n");

            const waUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(formattedText)}`;
            showSnackbar(`Terima kasih, ${name}! Mengarahkan ke WhatsApp admin...`, "success");
            contactForm.reset();

            window.open(waUrl, "_blank", "noopener,noreferrer");
        });
    }

    // ---------- Footer Year ----------
    const yearEl = document.getElementById("currentYear");
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }
})();
