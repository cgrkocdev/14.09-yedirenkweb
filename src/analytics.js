import { detectTrafficAttribution } from "./analyticsAttribution";

const CONSENT_KEY = "yedirenk-analytics-consent";
const SESSION_KEY = "yedirenk-session-id";
const DEV_EVENTS_KEY = "yedirenk-dev-analytics";
const DONATION_START_KEY = "yedirenk-meta-donation-started";
const ATTRIBUTION_KEY = "yedirenk-traffic-attribution";

let lastMetaPage = `${location.pathname}${location.search}`;

export const hasAnalyticsConsent = () =>
  localStorage.getItem(CONSENT_KEY) === "accepted";
export const setAnalyticsConsent = (value) =>
  localStorage.setItem(CONSENT_KEY, value ? "accepted" : "rejected");

export function sessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function createMetaEventId(prefix) {
  const id =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${id}`;
}

export function trackMetaPageView() {
  const currentPage = `${location.pathname}${location.search}`;
  if (currentPage === lastMetaPage || typeof window.fbq !== "function") return;
  window.fbq("track", "PageView");
  lastMetaPage = currentPage;
}

export function trackMetaDonationStart() {
  if (
    sessionStorage.getItem(DONATION_START_KEY) === "1" ||
    typeof window.fbq !== "function"
  )
    return;
  window.fbq("trackCustom", "DonationStart");
  sessionStorage.setItem(DONATION_START_KEY, "1");
}

export function trackMetaInitiateCheckout({ value, numItems, eventId }) {
  if (typeof window.fbq !== "function") return;
  const safeValue = Number(value);
  const safeItems = Math.max(1, Math.floor(Number(numItems) || 1));
  window.fbq(
    "track",
    "InitiateCheckout",
    {
      value: Number.isFinite(safeValue) ? safeValue : 0,
      currency: "TRY",
      num_items: safeItems,
    },
    { eventID: eventId },
  );
}

export async function track(event, data = {}) {
  let attribution;
  try {
    attribution = JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "null");
    if (!attribution) {
      attribution = detectTrafficAttribution(location.search, document.referrer);
      sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
    }
  } catch {
    attribution = detectTrafficAttribution(location.search, document.referrer);
  }
  const payload = {
    event,
    sessionId: sessionId(),
    path: `${location.pathname}${location.search}`,
    referrer: document.referrer.slice(0, 500),
    data: {
      ...data,
      _trafficSource: attribution.source,
      _trafficMedium: attribution.medium,
      _trafficCampaign: attribution.campaign,
      _trafficContent: attribution.content,
    },
    timestamp: Date.now(),
  };
  if (import.meta.env.DEV) {
    try {
      const events = getLocalAnalytics();
      events.unshift(payload);
      localStorage.setItem(DEV_EVENTS_KEY, JSON.stringify(events.slice(0, 2000)));
    } catch {
      /* local preview storage is optional */
    }
  }
  try {
    await fetch("/api/analytics", {
      method: "POST",
      keepalive: true,
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    /* analytics must never break the site */
  }
}

export function getLocalAnalytics() {
  try {
    return JSON.parse(localStorage.getItem(DEV_EVENTS_KEY) || "[]");
  } catch {
    return [];
  }
}
