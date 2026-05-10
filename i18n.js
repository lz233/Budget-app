/**
 * Internationalization (i18n) module for Budget App.
 * All translatable strings are stored here.
 *
 * Usage in HTML:
 *   <span data-i18n="key">Default text</span>
 *   <input data-i18n-placeholder="key" placeholder="default" />
 *
 * Usage in JS:
 *   i18n.t("key")
 */

var i18n = (function () {
  var translations = {
    en: {
      // --- index.html ---
      "app.title.budget": "Budget",
      "app.title.app": "App",
      "nav.settings": "Settings",
      "header.balance": "Balance",
      "header.income": "Income",
      "header.outcome": "Outcome",
      "dashboard.title": "Dashboard",
      "tab.expenses": "Expenses",
      "tab.income": "Income",
      "tab.all": "All",
      "input.placeholder.title": "title",
      "input.placeholder.amount": "$0",

      // cookie banner
      "cookie.title": "Cookie Preferences",
      "cookie.message": "We use cookies to ensure you get the best experience on our website. Read our ",
      "cookie.privacy_link": "Privacy Policy",
      "cookie.message_end": " for more details.",
      "cookie.accept_essential": "Accept Essential Only",
      "cookie.accept_all": "Accept All Cookies",

      // toast / validation messages (budget.js)
      "toast.expense_added": "Expense added successfully!",
      "toast.income_added": "Income added successfully!",
      "validate.empty_title": "Please enter a title.",
      "validate.title_too_long": "Title must be 50 characters or fewer.",
      "validate.empty_amount": "Please enter an amount.",
      "validate.not_number": "Amount must be a number.",
      "validate.too_small": "Amount must be greater than zero.",
      "validate.too_large": "Amount is too large.",
      "validate.too_many_decimals": "Use at most 2 decimal places.",

      // --- settings.html ---
      "settings.title": "Settings",
      "settings.back": "← Back to App",
      "settings.language": "Language",
      "settings.privacy_policy": "Privacy Policy",
      "settings.reset_app": "Reset App",
      "settings.confirm_reset": "Are you sure you want to reset the app? This will clear all data.",

      // --- privacy.html ---
      "privacy.back": "← Back",
      "privacy.title": "Privacy Policy",
      "privacy.intro": "This privacy policy applies to the Budget Web App (hereby referred to as \"Application\") that was created by CAN304 Group 45 (hereby referred to as \"Service Provider\") as an Open Source service. This service is intended for use \"AS IS\".",
      "privacy.info_collection_title": "Information Collection and Use",
      "privacy.info_collection_desc": "The Application collects information when you access and use it. This information may include information such as:",
      "privacy.info_item_ip": "Your device's Internet Protocol address (e.g. IP address)",
      "privacy.info_item_pages": "The pages of the Application that you visit, the time and date of your visit, the time spent on those pages",
      "privacy.info_item_time": "The time spent on the Application",
      "privacy.info_item_os": "The operating system you use on your device",
      "privacy.info_no_location": "The Application does not gather precise information about the location of your device.",
      "privacy.info_no_ai": "The Application does not use Artificial Intelligence (AI) technologies to process your data or provide features.",
      "privacy.info_contact": "The Service Provider may use the information you provided to contact you from time to time to provide you with important information, required notices and marketing promotions.",
      "privacy.info_pii": "For a better experience, while using the Application, the Service Provider may require you to provide us with certain personally identifiable information. The information that the Service Provider request will be retained by them and used as described in this privacy policy.",
      "privacy.third_party_title": "Third Party Access",
      "privacy.third_party_desc": "Only aggregated, anonymized data is periodically transmitted to external services to aid the Service Provider in improving the Application and their service. The Service Provider may share your information with third parties in the ways that are described in this privacy statement.",
      "privacy.third_party_disclose": "The Service Provider may disclose User Provided and Automatically Collected Information:",
      "privacy.third_party_law": "as required by law, such as to comply with a subpoena, or similar legal process;",
      "privacy.third_party_good_faith": "when they believe in good faith that disclosure is necessary to protect their rights, protect your safety or the safety of others, investigate fraud, or respond to a government request;",
      "privacy.third_party_providers": "with their trusted services providers who work on their behalf, do not have an independent use of the information we disclose to them, and have agreed to adhere to the rules set forth in this privacy statement.",
      "privacy.opt_out_title": "Opt-Out Rights",
      "privacy.opt_out_desc": "You can stop all collection of information by the Application easily by ceasing to use the website and clearing your browser's cookies and local storage data.",
      "privacy.retention_title": "Data Retention Policy",
      "privacy.retention_desc": "The Service Provider will retain User Provided data for as long as you use the Application and for a reasonable time thereafter. If you'd like them to delete User Provided Data that you have provided via the Application, please contact them at admin@with.fish and they will respond in a reasonable time.",
      "privacy.children_title": "Children",
      "privacy.children_desc1": "The Service Provider does not use the Application to knowingly solicit data from or market to children under the age of 13.",
      "privacy.children_desc2": "The Service Provider does not knowingly collect personally identifiable information from children. The Service Provider encourages all children to never submit any personally identifiable information through the Application and/or Services. The Service Provider encourage parents and legal guardians to monitor their children's Internet usage and to help enforce this Policy by instructing their children never to provide personally identifiable information through the Application and/or Services without their permission. If you have reason to believe that a child has provided personally identifiable information to the Service Provider through the Application and/or Services, please contact the Service Provider (admin@with.fish) so that they will be able to take the necessary actions. You must also be at least 16 years of age to consent to the processing of your personally identifiable information in your country (in some countries we may allow your parent or guardian to do so on your behalf).",
      "privacy.security_title": "Security",
      "privacy.security_desc": "The Service Provider is concerned about safeguarding the confidentiality of your information. The Service Provider provides physical, electronic, and procedural safeguards to protect information the Service Provider processes and maintains.",
      "privacy.changes_title": "Changes",
      "privacy.changes_desc": "This Privacy Policy may be updated from time to time for any reason. The Service Provider will notify you of any changes to the Privacy Policy by updating this page with the new Privacy Policy. You are advised to consult this Privacy Policy regularly for any changes, as continued use is deemed approval of all changes.",
      "privacy.changes_effective": "This privacy policy is effective as of 2026-04-29.",
      "privacy.consent_title": "Your Consent",
      "privacy.consent_desc": "By using the Application, you are consenting to the processing of your information as set forth in this Privacy Policy now and as amended by us.",
      "privacy.contact_title": "Contact Us",
      "privacy.contact_desc": "If you have any questions regarding privacy while using the Application, or have questions about the practices, please contact the Service Provider via email at admin@with.fish.",
    },

    cn: {
      // --- index.html ---
      "app.title.budget": "预算",
      "app.title.app": "应用",
      "nav.settings": "设置",
      "header.balance": "余额",
      "header.income": "收入",
      "header.outcome": "支出",
      "dashboard.title": "仪表盘",
      "tab.expenses": "支出",
      "tab.income": "收入",
      "tab.all": "全部",
      "input.placeholder.title": "标题",
      "input.placeholder.amount": "¥0",

      // cookie banner
      "cookie.title": "Cookie 偏好设置",
      "cookie.message": "我们使用 Cookie 以确保您在我们的网站上获得最佳体验。请阅读我们的",
      "cookie.privacy_link": "隐私政策",
      "cookie.message_end": "了解更多详情。",
      "cookie.accept_essential": "仅接受必要 Cookie",
      "cookie.accept_all": "接受全部 Cookie",

      // toast / validation messages (budget.js)
      "toast.expense_added": "支出已成功添加！",
      "toast.income_added": "收入已成功添加！",
      "validate.empty_title": "请输入标题。",
      "validate.title_too_long": "标题不能超过 50 个字符。",
      "validate.empty_amount": "请输入金额。",
      "validate.not_number": "金额必须为数字。",
      "validate.too_small": "金额必须大于零。",
      "validate.too_large": "金额过大。",
      "validate.too_many_decimals": "最多保留两位小数。",

      // --- settings.html ---
      "settings.title": "设置",
      "settings.back": "← 返回应用",
      "settings.language": "语言",
      "settings.privacy_policy": "隐私政策",
      "settings.reset_app": "重置应用",
      "settings.confirm_reset": "确定要重置应用吗？这将清空所有数据。",

      // --- privacy.html ---
      "privacy.back": "← 返回",
      "privacy.title": "隐私政策",
      "privacy.intro": "本隐私政策适用于由 CAN304 第 45 组（以下简称\u201c服务提供方\u201d）作为开源服务创建的 Budget Web App（以下简称\u201c应用\u201d）。本服务按\u201c原样\u201d提供使用。",
      "privacy.info_collection_title": "信息收集与使用",
      "privacy.info_collection_desc": "当您访问和使用本应用时，应用会收集相关信息。这些信息可能包括：",
      "privacy.info_item_ip": "您设备的 IP 地址",
      "privacy.info_item_pages": "您访问的页面、访问的时间和日期、以及在这些页面上花费的时间",
      "privacy.info_item_time": "您在本应用上花费的时间",
      "privacy.info_item_os": "您设备上使用的操作系统",
      "privacy.info_no_location": "本应用不会收集您设备的精确位置信息。",
      "privacy.info_no_ai": "本应用不使用人工智能（AI）技术来处理您的数据或提供功能。",
      "privacy.info_contact": "服务提供方可能会不时使用您提供的信息与您联系，以向您提供重要信息、必要通知和营销推广。",
      "privacy.info_pii": "为了获得更好的体验，在使用本应用时，服务提供方可能会要求您提供某些个人身份信息。服务提供方请求的信息将由其保留，并按照本隐私政策中的描述使用。",
      "privacy.third_party_title": "第三方访问",
      "privacy.third_party_desc": "仅汇总的匿名数据会定期传输到外部服务，以帮助服务提供方改进应用和服务。服务提供方可能会按照本隐私声明中描述的方式与第三方共享您的信息。",
      "privacy.third_party_disclose": "服务提供方可能会披露用户提供的和自动收集的信息：",
      "privacy.third_party_law": "根据法律要求，例如遵守传票或类似的法律程序；",
      "privacy.third_party_good_faith": "当他们善意地认为披露对于保护其权利、保护您或他人的安全、调查欺诈或回应政府请求是必要的；",
      "privacy.third_party_providers": "与代表其工作的受信任服务提供商共享，这些提供商不会独立使用我们向其披露的信息，并且已同意遵守本隐私声明中规定的规则。",
      "privacy.opt_out_title": "退出权利",
      "privacy.opt_out_desc": "您可以通过停止使用本网站并清除浏览器的 Cookie 和本地存储数据来轻松停止本应用的所有信息收集。",
      "privacy.retention_title": "数据保留政策",
      "privacy.retention_desc": "服务提供方将在您使用本应用期间以及此后的合理时间内保留用户提供的数据。如果您希望删除通过本应用提供的用户数据，请联系 admin@with.fish，我们将在合理时间内回复。",
      "privacy.children_title": "儿童",
      "privacy.children_desc1": "服务提供方不会故意使用本应用向 13 岁以下的儿童征集数据或进行营销。",
      "privacy.children_desc2": "服务提供方不会故意收集儿童的个人身份信息。服务提供方鼓励所有儿童切勿通过本应用和/或服务提交任何个人身份信息。服务提供方鼓励家长和法定监护人监督其子女的互联网使用情况，并通过指导子女未经许可不得通过本应用和/或服务提供个人身份信息来帮助执行本政策。如果您有理由相信儿童已通过本应用和/或服务向服务提供方提供了个人身份信息，请联系服务提供方（admin@with.fish），以便其采取必要措施。您还必须年满 16 岁才能同意在您所在国家处理您的个人身份信息（在某些国家，我们可能允许您的父母或监护人代表您这样做）。",
      "privacy.security_title": "安全",
      "privacy.security_desc": "服务提供方关注保护您信息的机密性。服务提供方提供物理、电子和程序方面的保障措施，以保护其处理和维护的信息。",
      "privacy.changes_title": "变更",
      "privacy.changes_desc": "本隐私政策可能会因任何原因不时更新。服务提供方将通过在此页面发布新的隐私政策来通知您任何更改。建议您定期查阅本隐私政策以了解任何更改，持续使用即视为同意所有更改。",
      "privacy.changes_effective": "本隐私政策自 2026 年 4 月 29 日起生效。",
      "privacy.consent_title": "您的同意",
      "privacy.consent_desc": "使用本应用即表示您同意按照本隐私政策（包括我们的修订版）中规定的方式处理您的信息。",
      "privacy.contact_title": "联系我们",
      "privacy.contact_desc": "如果您在使用本应用时对隐私有任何疑问，或对相关做法有疑问，请通过电子邮件 admin@with.fish 联系服务提供方。",
    },
  };

  var currentLang = localStorage.getItem("app-language") || "en";

  function t(key) {
    var dict = translations[currentLang] || translations["en"];
    return dict[key] !== undefined ? dict[key] : (translations["en"][key] || key);
  }

  function applyToDOM() {
    // data-i18n → textContent
    var elements = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < elements.length; i++) {
      var key = elements[i].getAttribute("data-i18n");
      elements[i].textContent = t(key);
    }

    // data-i18n-placeholder → placeholder
    var placeholders = document.querySelectorAll("[data-i18n-placeholder]");
    for (var j = 0; j < placeholders.length; j++) {
      var key = placeholders[j].getAttribute("data-i18n-placeholder");
      placeholders[j].placeholder = t(key);
    }

    // Update <html lang="">
    document.documentElement.lang = currentLang === "cn" ? "zh-CN" : "en";
  }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem("app-language", lang);
    applyToDOM();
  }

  function getLang() {
    return currentLang;
  }

  // Auto-apply on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyToDOM);
  } else {
    applyToDOM();
  }

  return { t: t, applyToDOM: applyToDOM, setLang: setLang, getLang: getLang };
})();
