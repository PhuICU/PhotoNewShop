import { create } from "zustand";
import { createTheme } from "@mui/material/styles";

const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "dark"
        ? { background: { default: "#121212" }, text: { primary: "#fff" } }
        : { background: { default: "#f5f5f5" }, text: { primary: "#000" } }),
    },
  });

const useAppStore = create((set) => ({
  themeMode: localStorage.getItem("theme") || "dark",
  language: localStorage.getItem("language") || "en",
  setThemeMode: (mode) => {
    localStorage.setItem("theme", mode);
    set(() => ({ themeMode: mode }));
  },
  setLanguage: (lang) => {
    localStorage.setItem("language", lang);
    set(() => ({ language: lang }));
  },
  getTheme,
}));

export default useAppStore;
