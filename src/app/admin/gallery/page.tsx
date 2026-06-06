"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Images, Save, Loader2, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function GalleryCMS() {
  const [c, setC] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  function load() {
    fetch("/api/content").then((r) => r.json()).then((d) => { setC(d.content); setDirty(false); });
  }
  useEffect(load, []);

  function update(fn: (draft: any) => void) {
    setC((prev: any) => { const next = structuredClone(prev); fn(next); return next; });
    setDirty(true);
  }

  function move(i: number, dir: number) {
    update((d) => {
      const arr = d.gallery;
      const j = i + dir;
      if (j < 0 || j >= arr.length) return;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    });
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: c }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error();
      setDirty(false);
      toast.success(d.persisted ? "Gallery published live." : "Saved (demo mode).");
    } catch { toast.error("Could not save."); }
    finally { setSaving(false); }
  }

  if (!c) return <div className="flex h-64 items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Images className="h-6 w-6 text-terracotta" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gallery</h1>
            <p className="text-sm text-muted-foreground">Add, remove or reorder images. Order controls how they appear on the site.</p>
          </div>
        </div>
        <button
          onClick={() => update((d) => d.gallery.unshift({ src: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "New image", category: "Food" }))}
          className="inline-flex items-center gap-1.5 rounded-md bg-terracotta px-3 py-2 text-xs font-semibold text-cream hover:bg-terracotta-dark"
        >
          <Plus className="h-3.5 w-3.5" /> Add Image
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {c.gallery.map((g: any, i: number) => (
          <Card key={i} className="overflow-hidden p-0">
            <div className="relative aspect-video bg-muted">
              {g.src && <Image src={g.src} alt={g.alt || ""} fill className="object-cover" sizes="33vw" />}
              <div className="absolute right-2 top-2 flex gap-1">
                <button onClick={() => move(i, -1)} className="flex h-7 w-7 items-center justify-center rounded bg-black/60 text-white hover:bg-black/80" aria-label="Move up"><ArrowUp className="h-3.5 w-3.5" /></button>
                <button onClick={() => move(i, 1)} className="flex h-7 w-7 items-center justify-center rounded bg-black/60 text-white hover:bg-black/80" aria-label="Move down"><ArrowDown className="h-3.5 w-3.5" /></button>
                <button onClick={() => update((d) => d.gallery.splice(i, 1))} className="flex h-7 w-7 items-center justify-center rounded bg-red-600/80 text-white hover:bg-red-600" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">#{i + 1}</span>
            </div>
            <div className="space-y-2 p-3">
              <input value={g.src} onChange={(e) => update((d) => { d.gallery[i].src = e.target.value; })} placeholder="Image URL" className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs" />
              <div className="flex gap-2">
                <input value={g.alt} onChange={(e) => update((d) => { d.gallery[i].alt = e.target.value; })} placeholder="Alt text" className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs" />
                <input value={g.category} onChange={(e) => update((d) => { d.gallery[i].category = e.target.value; })} placeholder="Category" className="w-28 rounded-md border border-input bg-background px-2 py-1.5 text-xs" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 px-5 py-3 backdrop-blur lg:left-64 lg:px-8">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{dirty ? "Unsaved changes" : "All changes saved"}</span>
          <button onClick={save} disabled={saving || !dirty} className="inline-flex items-center gap-2 rounded-md bg-terracotta px-5 py-2 text-sm font-semibold text-cream hover:bg-terracotta-dark disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save &amp; Publish
          </button>
        </div>
      </div>
    </div>
  );
}
