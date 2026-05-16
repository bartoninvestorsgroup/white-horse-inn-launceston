import { createClient } from "next-sanity";
import {
  apiVersion,
  dataset,
  hasRequiredSanityEnv,
  projectId,
} from "../env";

export const client = hasRequiredSanityEnv
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

export async function sanityFetch({
  query,
  params = {},
  perspective = "published",
  stega = false,
  fallback = null,
}) {
  if (!client) {
    return fallback;
  }

  return client.fetch(query, params, {
    perspective,
    stega,
  });
}
