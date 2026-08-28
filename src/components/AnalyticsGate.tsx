import { useEffect, useState } from "react";
import { plausibleDomain, readConsent } from "@/lib/analytics";

export function AnalyticsGate() {
  const [allowed, setAllowed] = useState(false);
  const domain = plausibleDomain();

  useEffect(() => {
    const sync = () => setAllowed(!!readConsent()?.analytics && !!domain);
    sync();
    window.addEventListener("s3h-consent", sync);
    return () => window.removeEventListener("s3h-consent", sync);
  }, [domain]);

  useEffect(() => {
    if (!allowed || !domain) return;
    if (document.querySelector("script[data-s3h-analytics]")) return;
    const script = document.createElement("script");
    script.defer = true;
    script.setAttribute("data-s3h-analytics", "true");
    script.setAttribute("data-domain", domain);
    script.src = "https://plausible.io/js/script.tagged-events.js";
    document.head.appendChild(script);
  }, [allowed, domain]);

  return null;
}
