
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import App from "./App.tsx";
import "./styles/limia.css";

const DevRetune =
  import.meta.env.DEV
    ? React.lazy(() =>
        import("./components/dev/RetuneOverlay").then((module) => ({
          default: module.RetuneOverlay,
        }))
      )
    : null;

const posthogKey = import.meta.env.VITE_POSTHOG_KEY || "";
const posthogHost = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    person_profiles: "identified_only", // Options: 'always', 'identified_only', ou 'never'
  });
}

createRoot(document.getElementById("root")!).render(
  <PostHogProvider client={posthog}>
    <BrowserRouter>
      <App />
      {DevRetune ? (
        <Suspense fallback={null}>
          <DevRetune />
        </Suspense>
      ) : null}
    </BrowserRouter>
  </PostHogProvider>
);
