// ==============================
// FOUNDATION: TYPOGRAPHY
// ==============================
export const typography = {
  display:
    "font-semibold tracking-tight text-3xl sm:text-4xl md:text-5xl leading-tight",

  heading:
    "font-semibold tracking-tight text-xl sm:text-2xl md:text-3xl leading-snug",

  subheading: "font-medium text-lg sm:text-xl leading-snug text-gray-700",

  body: "text-sm sm:text-base leading-relaxed text-gray-600",

  caption: "text-xs text-gray-500",

  overline: "text-xs uppercase tracking-wider text-gray-400",
};

// ==============================
// FOUNDATION: LAYOUT
// ==============================
export const layout = {
  container: "w-full mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8",

  section: "py-8 sm:py-12 lg:py-16",

  stack: "flex flex-col gap-4",

  inline: "flex items-center gap-3",

  center: "flex items-center justify-center",

  between: "flex items-center justify-between",

  gridAuto: "grid gap-6 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]",
};

// ==============================
// SURFACE / CONTAINERS
// ==============================
export const surface = {
  base: "bg-white border border-gray-200",

  subtle: "bg-gray-50 border border-gray-100",

  elevated: "bg-white border border-gray-200 shadow-sm",

  floating: "bg-white shadow-lg border border-gray-100",

  interactive: "transition duration-200 hover:shadow-md hover:-translate-y-0.5",
};

// ==============================
// COMPONENT: BUTTON
// ==============================
export const button = {
  base: "inline-flex items-center justify-center rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",

  variants: {
    solid: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900",

    soft: "bg-gray-100 text-gray-800 hover:bg-gray-200",

    outline: "border border-gray-300 text-gray-800 hover:bg-gray-50",

    ghost: "text-gray-700 hover:bg-gray-100",

    inverse: "bg-white text-gray-900 hover:bg-gray-100 border border-gray-200",
  },

  sizes: {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
  },
};

// ==============================
// COMPONENT: INPUT
// ==============================
export const input = {
  base: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition",

  states: {
    error: "border-red-500 focus:ring-red-500 focus:border-red-500",

    success: "border-green-500 focus:ring-green-500 focus:border-green-500",
  },
};

// ==============================
// COMPONENT: CARD
// ==============================
export const card = {
  base: "rounded-xl border border-gray-200 bg-white",

  padding: "p-4 sm:p-5",

  interactive: "transition duration-200 hover:shadow-md hover:-translate-y-0.5",

  header: "flex items-center justify-between mb-3",

  title: "text-sm font-semibold text-gray-900",

  content: "text-sm text-gray-600",

  footer: "mt-4 flex items-center justify-between",
};

// ==============================
// FEEDBACK: BADGE
// ==============================
export const badge = {
  base: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",

  variants: {
    neutral: "bg-gray-100 text-gray-700",
    info: "bg-blue-100 text-blue-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
  },
};

// ==============================
// FEEDBACK: ALERT
// ==============================
export const alert = {
  base: "flex items-start gap-3 rounded-lg p-3 text-sm",

  variants: {
    info: "bg-blue-50 text-blue-800 border border-blue-200",

    success: "bg-green-50 text-green-800 border border-green-200",

    warning: "bg-yellow-50 text-yellow-800 border border-yellow-200",

    danger: "bg-red-50 text-red-800 border border-red-200",
  },
};

// ==============================
// UTILITIES
// ==============================
export const radius = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
};

export const shadow = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

export const border = {
  base: "border border-gray-200",
  subtle: "border border-gray-100",
  strong: "border border-gray-300",
};

export const text = {
  primary: "text-gray-900",
  secondary: "text-gray-600",
  muted: "text-gray-400",
};

export const bg = {
  base: "bg-white",
  subtle: "bg-gray-50",
  strong: "bg-gray-100",
};

// ==============================
// MOTION (SUBTLE UX)
// ==============================
export const motion = {
  base: "transition-all duration-200 ease-in-out",
  hoverLift: "hover:-translate-y-0.5 hover:shadow-md",
  press: "active:scale-95",
};

// ==============================
// LAYERING
// ==============================
export const z = {
  base: "z-0",
  dropdown: "z-40",
  sticky: "z-50",
  modal: "z-60",
  overlay: "z-70",
};

// ==============================
// PAGE WRAPPER
// ==============================
export const page = {
  base: "min-h-screen bg-gray-50 text-gray-900",

  content: "max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6",
};
