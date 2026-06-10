import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F28C28",
        "primary-dark": "#D96B00",
        success: "#52C41A",
        warning: "#FAAD14",
        danger: "#FF4D4F",
        "text-primary": "#333333",
        "text-secondary": "#666666",
        "text-disabled": "#BBBBBB",
        border: "#F2E8DE",
        background: "#FAF7F2",
        card: "#FFFFFF",
        "bg-alert": "#FFF1F0",
        "bg-warm": "#FFF6EF",
      },
      borderRadius: {
        elder: "16px",
        family: "12px",
        medical: "8px",
        dialog: "20px",
      },
      fontSize: {
        "elder-h1": ["28px", { lineHeight: "1.3", fontWeight: "700" }],
        "elder-h2": ["22px", { lineHeight: "1.4", fontWeight: "500" }],
        "elder-body": ["20px", { lineHeight: "1.5", fontWeight: "400" }],
        "elder-caption": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "elder-btn": ["22px", { lineHeight: "1.2", fontWeight: "700" }],
        "sos-number": ["72px", { lineHeight: "1.1", fontWeight: "700" }],
        "family-h1": ["24px", { lineHeight: "1.3", fontWeight: "700" }],
        "family-h2": ["18px", { lineHeight: "1.4", fontWeight: "500" }],
        "family-body": ["15px", { lineHeight: "1.5", fontWeight: "400" }],
        "family-caption": ["13px", { lineHeight: "1.5", fontWeight: "400" }],
        "medical-h1": ["20px", { lineHeight: "1.3", fontWeight: "700" }],
        "medical-h2": ["16px", { lineHeight: "1.4", fontWeight: "500" }],
        "medical-body": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "medical-caption": ["12px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      minHeight: {
        "elder-btn": "56px",
        "family-btn": "48px",
        "medical-btn": "40px",
      },
      minWidth: {
        "elder-touch": "56px",
        "family-touch": "44px",
        "medical-touch": "40px",
      },
      spacing: {
        "elder-px": "20px",
        "family-px": "16px",
        "medical-px": "16px",
      },
    },
  },
  plugins: [],
};
export default config;
