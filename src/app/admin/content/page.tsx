"use client";

import { useEffect, useState } from "react";
import { FileText, Save, Loader2, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Field } from "@/components/admin/cms-field";
import { ImageField } from "@/components/admin/image-field";
import { toast } from "sonner";

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyContent = Record<string, any>;

export default function ContentCMS() {
  const [c, setC] = useState<AnyContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  function load() {
    fetch("/api/content").then((r) => r.json()).then((d) => { setC(d.content); setDirty(false); });
  }
  useEffect(load, []);

  function set(path: (string | number)[], value: unknown) {
    setC((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      let node: AnyContent = next;
      for (let i = 0; i < path.length - 1; i++) node = node[path[i]];
      node[path[path.length - 1]] = value;
      return next;
    });
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data: c }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error();
      setDirty(false);
      toast.success(d.persisted ? "Saved & published live." : "Saved (demo mode, connect MongoDB to persist).");
    } catch {
      toast.error("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!c) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-terracotta" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content / CMS</h1>
          <p className="text-sm text-muted-foreground">Edit every word and image on your site. Changes publish live.</p>
        </div>
      </div>

      <Tabs defaultValue="text">
        <TabsList>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="images">Images &amp; Media</TabsTrigger>
        </TabsList>

        {/* ============ TEXT ============ */}
        <TabsContent value="text" className="space-y-6">
          <Card className="space-y-4 p-6">
            <h2 className="font-semibold">Brand &amp; Announcement</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Restaurant Name" value={c.brand.name} onChange={(v) => set(["brand", "name"], v)} />
              <Field label="Tagline" value={c.brand.tagline} onChange={(v) => set(["brand", "tagline"], v)} />
              <Field label="Motto" value={c.brand.motto} onChange={(v) => set(["brand", "motto"], v)} />
            </div>
            <Field label="Announcement Bar" value={c.announcement} onChange={(v) => set(["announcement"], v)} textarea />
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="font-semibold">Homepage Hero</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Eyebrow" value={c.hero.eyebrow} onChange={(v) => set(["hero", "eyebrow"], v)} />
              <Field label="Title (top)" value={c.hero.titleTop} onChange={(v) => set(["hero", "titleTop"], v)} />
              <Field label="Title (bottom)" value={c.hero.titleBottom} onChange={(v) => set(["hero", "titleBottom"], v)} />
            </div>
            <Field label="Subtitle" value={c.hero.subtitle} onChange={(v) => set(["hero", "subtitle"], v)} textarea />
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="font-semibold">About Section</h2>
            <Field label="Heading" value={c.about.heading} onChange={(v) => set(["about", "heading"], v)} />
            <Field label="Lead paragraph" value={c.about.lead} onChange={(v) => set(["about", "lead"], v)} textarea />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Chef Name" value={c.about.chef.name} onChange={(v) => set(["about", "chef", "name"], v)} />
              <Field label="Chef Title" value={c.about.chef.title} onChange={(v) => set(["about", "chef", "title"], v)} />
            </div>
            <Field label="Chef Quote" value={c.about.chef.quote} onChange={(v) => set(["about", "chef", "quote"], v)} textarea />
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="font-semibold">Testimonials</h2>
            {c.testimonials.map((t: any, i: number) => (
              <div key={i} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-2">
                <Field label={`Name #${i + 1}`} value={t.name} onChange={(v) => set(["testimonials", i, "name"], v)} />
                <Field label="Role" value={t.role} onChange={(v) => set(["testimonials", i, "role"], v)} />
                <div className="sm:col-span-2"><Field label="Quote" value={t.quote} onChange={(v) => set(["testimonials", i, "quote"], v)} textarea /></div>
              </div>
            ))}
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="font-semibold">Contact Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone" value={c.contact.phone} onChange={(v) => set(["contact", "phone"], v)} />
              <Field label="Reservations Phone" value={c.contact.reservationsPhone} onChange={(v) => set(["contact", "reservationsPhone"], v)} />
              <Field label="Email" value={c.contact.email} onChange={(v) => set(["contact", "email"], v)} />
              <Field label="Catering Email" value={c.contact.cateringEmail} onChange={(v) => set(["contact", "cateringEmail"], v)} />
            </div>
            <Field label="Address (one line)" value={c.contact.addressLine} onChange={(v) => set(["contact", "addressLine"], v)} />
            <Field label="Map embed URL" value={c.contact.mapEmbed} onChange={(v) => set(["contact", "mapEmbed"], v)} />
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="font-semibold">Visiting Hours</h2>
            <div className="space-y-2">
              {c.hours.map((h: any, i: number) => (
                <div key={h.day} className="grid grid-cols-12 items-center gap-3">
                  <span className="col-span-3 text-sm font-medium">{h.day}</span>
                  <input type="time" value={h.open} disabled={h.closed} onChange={(e) => set(["hours", i, "open"], e.target.value)} className="col-span-3 rounded-md border border-input bg-background px-2 py-1.5 text-sm disabled:opacity-40" />
                  <input type="time" value={h.close} disabled={h.closed} onChange={(e) => set(["hours", i, "close"], e.target.value)} className="col-span-3 rounded-md border border-input bg-background px-2 py-1.5 text-sm disabled:opacity-40" />
                  <label className="col-span-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" checked={!!h.closed} onChange={(e) => set(["hours", i, "closed"], e.target.checked)} /> Closed
                  </label>
                </div>
              ))}
            </div>
            <Field label="Hours Note" value={c.hoursNote} onChange={(v) => set(["hoursNote"], v)} textarea />
          </Card>
        </TabsContent>

        {/* ============ IMAGES ============ */}
        <TabsContent value="images" className="space-y-6">
          <Card className="space-y-4 p-6">
            <h2 className="font-semibold">Hero</h2>
            <ImageField label="Hero poster image" value={c.hero.poster} onChange={(v) => set(["hero", "poster"], v)} hint="Shown before the video loads." />
            <Field label="Hero background video URL (.mp4)" value={c.hero.video} onChange={(v) => set(["hero", "video"], v)} />
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="font-semibold">About</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <ImageField label="Primary image" value={c.about.image} onChange={(v) => set(["about", "image"], v)} />
              <ImageField label="Secondary image" value={c.about.imageSecondary} onChange={(v) => set(["about", "imageSecondary"], v)} />
            </div>
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="font-semibold">Happy Hour</h2>
            <ImageField label="Happy hour image" value={c.happyHour.image} onChange={(v) => set(["happyHour", "image"], v)} />
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="font-semibold">Banquet</h2>
            <ImageField label="Banquet hero image" value={c.banquet.image} onChange={(v) => set(["banquet", "image"], v)} />
            <div className="grid gap-4 sm:grid-cols-3">
              {c.banquet.spaces.map((s: any, i: number) => (
                <ImageField key={i} label={s.name} value={s.image} onChange={(v) => set(["banquet", "spaces", i, "image"], v)} />
              ))}
            </div>
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="font-semibold">Catering</h2>
            <ImageField label="Catering hero image" value={c.catering.image} onChange={(v) => set(["catering", "image"], v)} />
            <div className="grid gap-4 sm:grid-cols-3">
              {c.catering.services.map((s: any, i: number) => (
                <ImageField key={i} label={s.title} value={s.image} onChange={(v) => set(["catering", "services", i, "image"], v)} />
              ))}
            </div>
          </Card>

          <p className="text-xs text-muted-foreground">
            Menu dish photos are managed on the <b>Menu</b> page · the photo gallery on the <b>Gallery</b> page.
          </p>
        </TabsContent>
      </Tabs>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 px-5 py-3 backdrop-blur lg:left-64 lg:px-8">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{dirty ? "You have unsaved changes" : "All changes saved"}</span>
          <div className="flex gap-2">
            <button onClick={load} className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
              <RotateCcw className="h-4 w-4" /> Revert
            </button>
            <button onClick={save} disabled={saving || !dirty} className="inline-flex items-center gap-2 rounded-md bg-terracotta px-5 py-2 text-sm font-semibold text-cream hover:bg-terracotta-dark disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save &amp; Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
