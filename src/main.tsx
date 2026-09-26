import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Image cache (public/sw.js). Production only: in dev it would keep serving
// images across reloads and hide whatever you're changing.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // No service worker just means no image cache — the site works the same.
    });
  });
}
