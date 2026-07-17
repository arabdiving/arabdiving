const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "site", unique: true },

    // العلامة التجارية — قابلة للتغيير بالكامل (White-Label)
    branding: {
      siteName:    { type: String, default: "ArabDiving" },
      tagline:     { type: String, default: "مجتمع الغوص العربي" },
      logo:        { type: String, default: "" },  // رابط شعار (يظهر بدل الإيموجي إن وُجد)
      logoEmoji:   { type: String, default: "🤿" },
      description: { type: String, default: "أول مجتمع عربي متخصّص في الغوص بالبحر الأحمر — مواقع الغوص، الرحلات، والدليل الكامل للغوّاص العربي." },
      footerText:  { type: String, default: "" },  // إن تُرك فارغًا: © السنة + اسم الموقع
    },

    // معرفات برامج العمولة (فنادق/طيران) — تُضاف عند قبولك في البرامج
    affiliates: {
      bookingAid: { type: String, default: "" }, // Booking.com Affiliate (aid)
      agodaCid:   { type: String, default: "" }, // Agoda Partner (cid)
    },

    // ويدجت صفحة «رحلتك» /travel — أكواد التضمين من Travelpayouts (Tools → Widgets)
    travelWidgets: {
      type: [{ title: { type: String, default: "" }, code: { type: String, default: "" } }],
      default: [],
    },

    // طبيعة الموقع الآن:
    // full  = الموقع الكامل بكل صفحاته
    // focus = «موقع يحل مشكلة»: دليل المدربين + مراكز الغوص + الأدوات (حاسبة الأوزان، خريطة المواقع، الاستبيانات) فقط
    siteMode: { type: String, enum: ["full", "focus"], default: "full" },

    // مفتاح عام: السماح بعرض وسائل التواصل المباشر للمدربين والمراكز.
    // مفتوح الآن كوسيلة جذب — يمكن إغلاقه لاحقًا ليمر التواصل عبر المنصة.
    directContactEnabled: { type: Boolean, default: true },

    commentsEnabled: { type: Boolean, default: true },
    hiddenPages: { type: [String], default: [] },
    whatsappNumber: { type: String, default: "" },
    chatEnabled: { type: Boolean, default: true },
    navStyle: { type: String, enum: ["buttons", "dropdown", "sidebar"], default: "buttons" },
    navGroups: {
      type: [{ label: String, items: [{ href: String, label: String }] }],
      default: [],
    },
    theme: {
      navy:       { type: String, default: "#0d2c54" },
      mid:        { type: String, default: "#2e75b6" },
      gold:       { type: String, default: "#c9952a" },
      background: { type: String, default: "#f5f7fa" },
      surface:    { type: String, default: "#ffffff" },
      text:       { type: String, default: "#1e293b" },
      muted:      { type: String, default: "#64748b" },
      border:     { type: String, default: "#e2e8f0" },
      hero:       { type: String, default: "#08233e" },
    },
    dayNight: {
      enabled: { type: Boolean, default: false },
      day: { type: mongoose.Schema.Types.Mixed, default: {} },
      night: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    homeCards: {
      type: [{ href: String, label: String, desc: String, icon: String }],
      default: [
        { href: "/marketplace", label: "المتجر", desc: "أحدث معدات الغوص", icon: "🛒" },
        { href: "/retreats", label: "الباقات الفاخرة", desc: "تجارب راقية في البحر الأحمر", icon: "✦" },
        { href: "/weight-calculator", label: "حاسبة الأوزان", desc: "احسب وزن الرصاص المناسب", icon: "⚖️" },
      ],
    },
    addons: {
      type: [{ key: String, label: String, price: Number, perPerson: Boolean }],
      default: [
        { key: "photographer", label: "photographer", price: 100, perPerson: false },
        { key: "lunch",        label: "lunch",        price: 20,  perPerson: true  },
        { key: "privateBoat",  label: "privateBoat",  price: 1000,perPerson: false },
        { key: "transport",    label: "transport",    price: 25,  perPerson: false },
      ],
    },
    homeBlocks: {
      type: [
        {
          key:     { type: String },
          label:   { type: String },
          visible: { type: Boolean, default: true },
          order:   { type: Number,  default: 0 },
        },
      ],
      default: [
        { key: "hero",              label: "hero",              visible: true,  order: 0 },
        { key: "community_feed",    label: "community_feed",    visible: true,  order: 1 },
        { key: "gulf_focus",        label: "gulf_focus",        visible: true,  order: 2 },
        { key: "stats",             label: "stats",             visible: true,  order: 3 },
        { key: "segments",          label: "segments",          visible: true,  order: 4 },
        { key: "dive_centers",      label: "dive_centers",      visible: true,  order: 5 },
        { key: "featured_sites",    label: "featured_sites",    visible: true,  order: 6 },
        { key: "weight_calculator", label: "weight_calculator", visible: false, order: 7 },
        { key: "community_survey",  label: "community_survey",  visible: false, order: 8 },
      ],
    },
    // بلوكات رئيسية وضع «موقع يحل مشكلة» — مستقلة عن بلوكات الموقع الكامل
    focusHomeBlocks: {
      type: [
        {
          key:     { type: String },
          label:   { type: String },
          visible: { type: Boolean, default: true },
          order:   { type: Number,  default: 0 },
        },
      ],
      default: [
        { key: "focus_hero",        label: "focus_hero",        visible: true, order: 0 },
        { key: "focus_gates",       label: "focus_gates",       visible: true, order: 1 },
        { key: "focus_tools",       label: "focus_tools",       visible: true, order: 2 },
        { key: "focus_map",         label: "focus_map",         visible: false, order: 3 },
        { key: "focus_instructors", label: "focus_instructors", visible: false, order: 4 },
        { key: "focus_centers",     label: "focus_centers",     visible: false, order: 5 },
      ],
    },

    promoImages: { type: mongoose.Schema.Types.Mixed, default: {} },
    sections: {
      type: [{ slug: String, name: String, icon: String, color: String, pages: [String] }],
      default: [],
    },
    mapPoints: {
      type: [
        {
          n:        { type: Number },
          x:        { type: Number },
          y:        { type: Number },
          label:    { type: String },
          href:     { type: String },
          color:    { type: String },
          icon:     { type: String },
          subtitle: { type: String },
          desc:     { type: String },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", SettingsSchema);
