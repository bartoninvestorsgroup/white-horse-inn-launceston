export const CONSENT_COOKIE_NAME = "barton_cookie_consent";
export const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

export const defaultConsent = {
  necessary: true,
  analytics: false,
  updatedAt: null,
};

export function normaliseConsent(value) {
  return {
    necessary: true,
    analytics: Boolean(value?.analytics),
    updatedAt: value?.updatedAt || null,
  };
}

export function readConsentCookie() {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));

  if (!match) {
    return null;
  }

  try {
    const rawValue = decodeURIComponent(match.split("=")[1]);
    return normaliseConsent(JSON.parse(rawValue));
  } catch {
    return null;
  }
}

export function writeConsentCookie(value) {
  if (typeof document === "undefined") {
    return;
  }

  const consent = normaliseConsent({
    ...value,
    updatedAt: new Date().toISOString(),
  });

  document.cookie = [
    `${CONSENT_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(consent))}`,
    "Path=/",
    `Max-Age=${CONSENT_COOKIE_MAX_AGE}`,
    "SameSite=Lax",
  ].join("; ");

  window.dispatchEvent(
    new CustomEvent("barton-consent-updated", {
      detail: consent,
    }),
  );
}
