"use client";

import { useEffect, useState } from "react";
import { UtensilsCrossed, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ImageField } from "@/components/admin/image-field";
import { toast } from "sonner";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function MenuCMS() {
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
      toast.success(d.persisted ? "Menu published live." : "Saved (demo mode).");
    } catch { toast.error("Could not save."); }
    finally { setSaving(false); }
  }

  if (!c) return <div className="flex h-64 items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <UtensilsCrossed className="h-6 w-6 text-terracotta" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Menu</h1>
          <p className="text-sm text-muted-foreground">Edit dishes, descriptions and prices. Add or remove items per category.</p>
        </div>
      </div>

      {c.menu.map((cat: any, ci: number) => (
        <Card key={cat.id} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">{cat.name}</h2>
              <p className="text-xs text-muted-foreground">{cat.italian}</p>
            </div>
            <button
              onClick={() => update((d) => d.menu[ci].items.push({ name: "New Dish", description: "Description", price: 0, tags: [] }))}
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted"
            >
              <Plus className="h-3.5 w-3.5" /> Add Dish
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {cat.items.map((item: any, ii: number) => (
              <div key={ii} className="space-y-3 rounded-lg border p-3">
                <div className="grid grid-cols-12 items-start gap-3">
                  <input
                    value={item.name}
                    onChange={(e) => update((d) => { d.menu[ci].items[ii].name = e.target.value; })}
                    className="col-span-12 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium sm:col-span-3"
                    placeholder="Dish name"
                  />
                  <input
                    value={item.description}
                    onChange={(e) => update((d) => { d.menu[ci].items[ii].description = e.target.value; })}
                    className="col-span-9 rounded-md border border-input bg-background px-3 py-2 text-sm sm:col-span-6"
                    placeholder="Description"
                  />
                  <div className="col-span-2 flex items-center rounded-md border border-input bg-background sm:col-span-2">
                    <span className="pl-3 text-sm text-muted-foreground">$</span>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => update((d) => { d.menu[ci].items[ii].price = Number(e.target.value); })}
                      className="w-full bg-transparent px-2 py-2 text-sm outline-none"
                    />
                  </div>
                  <button
                    onClick={() => update((d) => { d.menu[ci].items.splice(ii, 1); })}
                    className="col-span-1 flex items-center justify-center text-muted-foreground hover:text-destructive"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <ImageField label="Dish photo" value={item.image || ""} onChange={(v) => update((d) => { d.menu[ci].items[ii].image = v; })} />
              </div>
            ))}
          </div>
        </Card>
      ))}

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
