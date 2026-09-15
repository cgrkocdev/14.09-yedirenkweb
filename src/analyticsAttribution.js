const SOCIAL_HOSTS = [
  [/tiktok|musically|bytedance/i, "TikTok"],
  [/instagram/i, "Instagram"],
  [/facebook|fb\.com|messenger/i, "Facebook"],
  [/youtube|youtu\.be/i, "YouTube"],
  [/linkedin/i, "LinkedIn"],
  [/(^|\.)x\.com$|twitter/i, "X / Twitter"],
];

const clean = (value, limit = 120) => String(value || "").trim().slice(0, limit);

const normalizeKnownSource = (value) => {
  const source = clean(value);
  const known = SOCIAL_HOSTS.find(([pattern]) => pattern.test(source));
  return known ? known[1] : source;
};

export function sourceFromReferrer(referrer = "") {
  if (!referrer) return "";
  let host = clean(referrer);
  try {
    const url = new URL(referrer);
    host = url.hostname || url.protocol.replace(":", "");
    if (url.protocol === "android-app:") host = `${url.hostname}${url.pathname}`;
  } catch {
    // Some application browsers send package names instead of web URLs.
  }
  const known = SOCIAL_HOSTS.find(([pattern]) => pattern.test(host));
  return known ? known[1] : host.replace(/^www\./, "");
}

export function detectTrafficAttribution(search = "", referrer = "") {
  const params = new URLSearchParams(search);
  const utmSource = clean(params.get("utm_source"));
  const clickSource = params.has("ttclid")
    ? "TikTok"
    : params.has("fbclid")
      ? "Facebook / Instagram"
      : params.has("gclid")
        ? "Google Ads"
        : params.has("msclkid")
          ? "Microsoft Ads"
          : "";
  return {
    source: normalizeKnownSource(utmSource) || clickSource || sourceFromReferrer(referrer) || "Doğrudan giriş",
    medium: clean(params.get("utm_medium")),
    campaign: clean(params.get("utm_campaign")),
    content: clean(params.get("utm_content")),
  };
}

export function eventTrafficSource(event = {}) {
  const data = event.data || {};
  return clean(data._trafficSource) || sourceFromReferrer(event.referrer) || "Doğrudan giriş";
}
