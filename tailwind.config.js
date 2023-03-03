/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        300: "300px",
        20: "20%",
        30: "30%",
        40: "40%",
        50: "50%",
        60: "60%",
        65: "65%",
        70: "70%",
        80: "80%",
        90: "90%",

        35: "35%",
      },
      height: {
        30: "30%",
        55: "55%",
      },
      backgroundColor: {
        bgHover: "rgb(221 214 254)",
        blackOverlay: "rgba(0, 0 ,0 ,0.3)",
        grayOverlay: "rgba(0, 0 ,0 ,0.7)",
      },
    },
  },
  plugins: [],
};
