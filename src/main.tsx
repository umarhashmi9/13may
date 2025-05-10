import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import and initialize Tempo Devtools
import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

createRoot(document.getElementById("root")!).render(<App />);
