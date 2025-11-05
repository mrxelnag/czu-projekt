import ReactDOM from "react-dom/client";
import "./App.css";

// Import the generated route tree
import { App } from "@/App.tsx";
import { StrictMode } from "react";

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
