"use client";

import { ListOrdered } from "lucide-react";
import MediaUploader from "../../MediaUploader";
import { Field, Fields, ListEditor, Section } from "../controls";

const MAX_ITEMS = 30;

export default function ProgrammeForm({ value = {}, onChange }) {
  const items = value.programmeItems || [];
  const set = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-5">
      <Section title="Programme details">
        <p className="text-sm leading-6 text-slate-500">
          Create a digital programme guests can follow from the opening item to
          the final event.
        </p>
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["title", "Event name *"],
            ["host", "Organizer or host"],
            ["date", "Event date", "date"],
            ["venue", "Venue"],
          ]}
        />
        <Field
          label="Welcome message (optional)"
          type="textarea"
          value={value.intro || ""}
          onChange={(intro) => set({ intro })}
          placeholder="Welcome, and thank you for joining us."
        />
      </Section>

      <Section title="Event images">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <MediaUploader
              label="Upload banner image"
              onUpload={(file) => set({ cover: file.url })}
            />
            <Field
              label="Banner image URL"
              type="url"
              value={value.cover || ""}
              onChange={(cover) => set({ cover })}
              placeholder="https://example.com/banner.jpg"
            />
          </div>
          <div className="space-y-3">
            <MediaUploader
              label="Upload logo or crest"
              onUpload={(file) => set({ crest: file.url })}
            />
            <Field
              label="Logo or crest URL"
              type="url"
              value={value.crest || ""}
              onChange={(crest) => set({ crest })}
              placeholder="https://example.com/crest.png"
            />
          </div>
        </div>
        <p className="text-xs text-slate-500">
          The logo or crest appears centered over the bottom edge of the banner.
        </p>
      </Section>

      <Section title="Programme of events">
        <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
          <ListOrdered className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Add every part of the event in the order it will happen. Use the
            arrows to arrange the progression.
          </p>
        </div>
        <ListEditor
          label="item"
          value={items}
          onChange={(programmeItems) => set({ programmeItems })}
          maxItems={MAX_ITEMS}
          defaults={{ title: "" }}
          fields={[
            ["time", "Time (optional)", "time"],
            ["title", "Programme item *"],
            ["detail", "Speaker or details"],
          ]}
        />
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ListOrdered className="h-4 w-4" />
          <span>
            {items.length} of {MAX_ITEMS} items. Guests see this same order.
          </span>
        </div>
      </Section>
    </div>
  );
}
