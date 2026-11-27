/*
 * Language switching for the static site.
 *
 * Markup contract
 *   data-i18n="key"                     → element textContent
 *   data-i18n-html="key"                → element innerHTML (repo-authored strings
 *                                         only; use it when a translation needs an inline link)
 *   data-i18n-attr="attr:key;attr:key"  → attributes such as aria-label and title
 *   [data-lang-toggle]                  → button that cycles to the next language
 *
 * Adding a string: add the key to every dictionary in MESSAGES (English is the
 * fallback) and reference it from markup or from window.i18n.t().
 * Adding a language: add an entry to LOCALES and a matching MESSAGES dictionary.
 * The toggle cycles through LOCALES in order, so nothing else needs editing.
 *
 * Scripts that build markup themselves call i18n.t() and re-render on the
 * "i18n:change" event, which carries { lang, dir }.
 */
(function () {
  'use strict';

  const LOCALES = {
    en: { dir: 'ltr', short: 'EN' },
    ar: { dir: 'rtl', short: 'ع' },
  };

  const MESSAGES = {
    en: {
      nav: {
        home: 'Home',
        projects: 'Projects',
        uses: 'Uses',
        about: 'About',
        more: 'More',
        search: 'Search pages',
        searchTitle: 'Search pages (Ctrl K)',
      },
      home: {
        title: "Kissou's space",
        heading: 'Welcome',
        subtitle: 'I build things, learn constantly, and turn ideas into meaningful digital experiences.',
      },
      projects: {
        title: 'Projects - My Portfolio',
        heading: 'Projects',
        subtitle: 'A collection of projects showcasing my skills and experience',
        kunuz: {
          title: 'Kunuz',
          desc: 'Discover the gems hidden in everyday items through an interactive web application.',
        },
        csn: {
          title: 'CSN - Computer Science Notes',
          desc: 'A comprehensive wiki-like repository of computer science concepts and notes for learning and reference.',
        },
        github: {
          title: 'More on GitHub',
          desc: 'Check out my GitHub profile for more open-source projects, code examples, and contributions.',
        },
      },
      tags: {
        webDev: 'Web Development',
        islamicApps: 'Islamic Apps',
        interactive: 'Interactive',
        knowledgeBase: 'Knowledge Base',
        wiki: 'Wiki',
        educational: 'Educational',
        github: 'GitHub',
        openSource: 'Open Source',
      },
      uses: {
        title: 'Uses - TryingCS',
        heading: 'What I Use',
        eyebrow: 'Setup',
        intro: 'A list of the stuff I use daily (inspired by <a href="https://uses.tech/" target="_blank" rel="noreferrer">uses.tech</a>).',
        hardware: 'Hardware',
        hardwareNote: 'The machines doing the daily work',
        software: 'Software',
        softwareNote: 'The tools I open every day',
        laptop: { label: 'Laptop', value: 'HP EliteBook x360 830 G7 Notebook PC' },
        phone: { label: 'Smartphone', value: 'Xiaomi Redmi Note 8' },
        os: { label: 'OS', value: 'Linux Mint (Cinnamon DE)' },
        editor: { label: 'Editor', value: 'Visual Studio Code' },
        notes: { label: 'Notes and Docs', value: 'Obsidian' },
        terminal: { label: 'Terminal Emulator', value: 'Gnome Terminal' },
        browser: { label: 'Browsers', value: 'Brave Browser and Ladybird' },
        },
      about: {
        title: "About - Kissou's space",
        heading: 'About',
        subtitle: 'A bit about me, and where to find me online.',
        contact: 'Contact',
        contactNote: 'The quickest ways to reach me .',
        github: 'GitHub',
        email: 'Email',
      },
      footer: {
        builtBy: 'Built by',
        viewGithub: 'View on GitHub',
      },
      plant: {
        title: 'Water the plant',
        watered: 'Watered today: {ml} ml',
      },
      theme: {
        switchToDark: 'Switch to dark mode',
        switchToLight: 'Switch to light mode',
      },
      lang: {
        switchTo: 'Switch to {language}',
        name: { en: 'English', ar: 'Arabic' },
      },
      palette: {
        dialog: 'Search pages',
        placeholder: 'Search or jump to…',
        noMatch: 'No match.',
        hints: '↑↓ navigate · Enter open · Esc close',
      },
    },

    ar: {
      nav: {
        home: 'الرئيسية',
        projects: 'المشاريع',
        uses: 'أدواتي',
        about: 'حول',
        more: 'المزيد',
        search: 'ابحث في الصفحات',
        searchTitle: 'ابحث في الصفحات (Ctrl K)',
      },
      home: {
        title: 'مساحة كيسو',
        heading: 'أهلاً بك',
        subtitle: 'أبني الأشياء، وأتعلّم باستمرار، وأحوّل الأفكار إلى تجارب رقمية ذات معنى.',
      },
      projects: {
        title: 'المشاريع — ملف أعمالي',
        heading: 'المشاريع',
        subtitle: 'مجموعة من المشاريع التي تعرض مهاراتي وخبراتي',
        kunuz: {
          title: 'كنوز',
          desc: 'اكتشف الكنوز المخبأة في الأشياء اليومية عبر تطبيق ويب تفاعلي.',
        },
        csn: {
          title: 'CSN — ملاحظات علوم الحاسوب',
          desc: 'مستودع شامل على نمط الويكي لمفاهيم وملاحظات علوم الحاسوب للتعلّم والمراجعة.',
        },
        github: {
          title: 'المزيد على GitHub',
          desc: 'تصفّح ملفي على GitHub للمزيد من المشاريع مفتوحة المصدر وأمثلة الشيفرة والمساهمات.',
        },
      },
      tags: {
        webDev: 'تطوير الويب',
        islamicApps: 'تطبيقات إسلامية',
        interactive: 'تفاعلي',
        knowledgeBase: 'قاعدة معرفة',
        wiki: 'ويكي',
        educational: 'تعليمي',
        github: 'GitHub',
        openSource: 'مفتوح المصدر',
      },
      uses: {
        title: 'أدواتي — TryingCS',
        heading: 'ما أستخدمه',
        eyebrow: 'عدّتي',
        intro: 'قائمة بالأشياء التي أستخدمها يوميًا (مستوحاة من <a href="https://uses.tech/" target="_blank" rel="noreferrer">uses.tech</a>).',
        hardware: 'العتاد',
        hardwareNote: 'الأجهزة التي تقوم بالعمل اليومي',
        software: 'البرمجيات',
        softwareNote: 'الأدوات التي أفتحها كل يوم',
        laptop: { label: 'الحاسوب المحمول', value: 'HP EliteBook x360 830 G7 Notebook PC' },
        phone: { label: 'الهاتف', value: 'Xiaomi Redmi Note 8' },
        os: { label: 'نظام التشغيل', value: 'Linux Mint (بيئة Cinnamon)' },
        editor: { label: 'المحرر', value: 'Visual Studio Code' },
        notes: { label: 'الملاحظات والتوثيق', value: 'Obsidian' },
        terminal: { label: 'الطرفية', value: 'Gnome Terminal' },
        browser: { label: 'المتصفحات', value: 'Brave Browser و Ladybird' }
      },
      about: {
        title: 'حول — مساحة كيسو',
        heading: 'حول',
        subtitle: 'نبذة عني، وأين تجدني على الإنترنت.',
        contact: 'تواصل',
        contactNote: 'أسرع الطرق للوصول إليّ .',
        github: 'GitHub',
        email: 'البريد الإلكتروني',
      },
      footer: {
        builtBy: 'صُنع بواسطة',
        viewGithub: 'اعرضه على GitHub',
      },
      plant: {
        title: 'اسقِ النبتة',
        watered: 'سُقيت اليوم: {ml} مل',
      },
      theme: {
        switchToDark: 'التبديل إلى الوضع الداكن',
        switchToLight: 'التبديل إلى الوضع الفاتح',
      },
      lang: {
        switchTo: 'التبديل إلى {language}',
        name: { en: 'الإنجليزية', ar: 'العربية' },
      },
      palette: {
        dialog: 'ابحث في الصفحات',
        placeholder: 'ابحث أو انتقل إلى…',
        noMatch: 'لا توجد نتائج.',
        hints: '↑↓ للتنقل · Enter للفتح · Esc للإغلاق',
      },
    },
  };

  const STORAGE_KEY = 'lang';
  const FALLBACK = 'en';
  const CODES = Object.keys(LOCALES);

  function storedLang() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  // The saved choice wins; a first visit follows the browser's preference.
  function preferredLang() {
    const saved = storedLang();
    if (saved && LOCALES[saved]) return saved;

    const tags = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || ''];
    for (const tag of tags) {
      const code = String(tag).split('-')[0].toLowerCase();
      if (LOCALES[code]) return code;
    }
    return FALLBACK;
  }

  let lang = preferredLang();

  function message(locale, key) {
    return key.split('.').reduce(
      (node, part) => (node && typeof node === 'object' ? node[part] : undefined),
      MESSAGES[locale]
    );
  }

  function t(key, vars) {
    const text = message(lang, key) ?? message(FALLBACK, key);
    if (text == null) {
      console.warn('[i18n] Missing translation for "' + key + '"');
      return key;
    }
    if (!vars) return String(text);
    return String(text).replace(/\{(\w+)\}/g, (match, name) =>
      Object.prototype.hasOwnProperty.call(vars, name) ? vars[name] : match
    );
  }

  // Every language's version of a key — used by search so any language matches.
  function every(key) {
    return CODES.map((code) => {
      const text = message(code, key);
      return text == null ? key : String(text);
    });
  }

  function nextLang() {
    return CODES[(CODES.indexOf(lang) + 1) % CODES.length];
  }

  function syncToggles() {
    const target = nextLang();
    const label = t('lang.switchTo', { language: t('lang.name.' + target) });
    document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
      btn.setAttribute('aria-label', label);
      btn.title = label;
      const slot = btn.querySelector('[data-lang-label]');
      if (slot) slot.textContent = LOCALES[target].short;
    });
  }

  function apply(root) {
    const scope = root || document;
    document.documentElement.lang = lang;
    document.documentElement.dir = LOCALES[lang].dir;

    scope.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    scope.querySelectorAll('[data-i18n-html]').forEach((el) => {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    scope.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.getAttribute('data-i18n-attr').split(';').forEach((pair) => {
        const [attr, key] = pair.split(':').map((part) => part.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });

    syncToggles();

    // Strings are in place; let the page paint.
    document.documentElement.removeAttribute('data-i18n-pending');
  }

  function setLang(code) {
    if (!LOCALES[code] || code === lang) return;
    lang = code;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    apply();
    document.dispatchEvent(
      new CustomEvent('i18n:change', { detail: { lang, dir: LOCALES[lang].dir } })
    );
  }

  // Set language and direction while <head> is still parsing so an RTL page
  // never flashes left-to-right; the strings are filled in once the DOM exists.
  document.documentElement.lang = lang;
  document.documentElement.dir = LOCALES[lang].dir;

  // The HTML carries English text, so hold the first paint until apply() has
  // replaced it. English pages need no hold: their markup already matches.
  if (lang !== FALLBACK) {
    document.documentElement.setAttribute('data-i18n-pending', '');
    // If a later script throws, show the page anyway rather than a blank screen.
    setTimeout(() => document.documentElement.removeAttribute('data-i18n-pending'), 1200);
  }

  document.addEventListener('DOMContentLoaded', () => apply());

  document.addEventListener('click', (event) => {
    if (event.target.closest && event.target.closest('[data-lang-toggle]')) {
      setLang(nextLang());
    }
  });

  window.i18n = {
    t,
    every,
    apply,
    setLang,
    get lang() {
      return lang;
    },
    get dir() {
      return LOCALES[lang].dir;
    },
    locales: CODES,
  };
})();
