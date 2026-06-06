import "server-only";
import { siteContent, type SiteContent } from "@/content/site";
import { connectDB } from "./db";
import { SiteContentModel } from "./models";

/** Deep-merge CMS overrides on top of the default content tree. */
function deepMerge<T>(base: T, override: unknown): T {
  if (override === null || override === undefined) return base;
  if (Array.isArray(base)) return (override as T) ?? base;
  if (typeof base === "object" && typeof override === "object") {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(override as Record<string, unknown>)) {
      out[k] = k in (base as object)
        ? deepMerge((base as Record<string, unknown>)[k], v)
        : v;
    }
    return out as T;
  }
  return (override as T) ?? base;
}

/**
 * Resolve site content: defaults from /content/site.ts merged with any
 * overrides saved by the admin dashboard in MongoDB. Falls back to pure
 * defaults when the database is not configured.
 */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const conn = await connectDB();
    if (!conn) {
      // Demo mode: reflect unsaved CMS edits held in memory.
      const demo = (globalThis as unknown as { _demoContent?: unknown })._demoContent;
      return demo ? deepMerge(siteContent, demo) : siteContent;
    }
    const doc = await SiteContentModel.findOne({ key: "main" }).lean();
    if (!doc?.data) return siteContent;
    return deepMerge(siteContent, doc.data);
  } catch {
    return siteContent;
  }
}
