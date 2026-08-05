import { render } from "preact";
import { StrictMode } from "preact/compat";
import "./index.css";

import { ErrorBoundary } from "./components/ErrorBoundary/index.tsx";
import App from "./index.tsx";

const rootElement = document.getElementById("root");
if (rootElement) {
  render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
    rootElement,
  );
}
