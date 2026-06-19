import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./ui/App";
import { createZBridgeProvider } from "./zbridge/provider";

declare global { interface Window { zbridge?: any; } }

window.zbridge = createZBridgeProvider();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
