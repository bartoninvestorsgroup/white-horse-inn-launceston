const fallbackApiVersion = "2026-04-12";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || fallbackApiVersion;
export const studioBasePath = "/studio";
export const hasRequiredSanityEnv = Boolean(projectId && dataset);
