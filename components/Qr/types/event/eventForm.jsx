"use client";

import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
import { Hint } from "../wedding/weddingForm";
import { EVENT_THEMES, EVENT_KINDS } from "./themes";
import {
  PartyPopper,
  CalendarDays,
  Ticket,
  Users,
  Images,
  Clapperboard,
} from "lucide-react";

const MAX_IMAGES = 30;
const MAX_VIDEOS = 10;

export default function EventForm({ value = {}, onChange }) {
  const images = value.images || [];
  const videos = value.videos || [];
  const kindId = EVENT_KINDS[value.kind] ? value.kind : "other";
  const kind = EVENT_KINDS[kindId];
  const theme = value.theme || kind.theme;
  const set = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-5">
      <Section title="The event">
        <Hint icon={PartyPopper} title="What are you hosting?">
          Pick the kind of event and the page wording adapts — agenda for a
          conference, line-up for a show, order of service for a church or
          memorial.
        </Hint>

        <label className="block text-sm font-medium text-slate-700">
          Event type
          <select
            className="mt-2 block h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            value={kindId}
            onChange={(e) =>
              // Switch to the new kind's theme unless one was chosen by hand.
              set({
                kind: e.target.value,
                ...(!value.theme || value.theme === kind.theme
                  ? { theme: EVENT_KINDS[e.target.value].theme }
                  : {}),
              })
            }
          >
            {Object.entries(EVENT_KINDS).map(([id, k]) => (
              <option key={id} value={id}>
                {k.label}
              </option>
            ))}
          </select>
        </label>

        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["title", kind.titleHint],
            ["host", kind.hostLabel],
            ["intro", "Invitation line (optional)", "textarea"],
            ["hashtag", "Hashtag (e.g. #TechSummit26)"],
          ]}
        />

        <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
          <MediaUploader
            label={kindId === "memorial" ? "Upload portrait" : "Upload cover / flyer"}
            onUpload={(file) => set({ cover: file.url })}
          />
          <Field
            label="Cover image URL"
            type="url"
            value={value.cover || ""}
            onChange={(cover) => set({ cover })}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Theme</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(EVENT_THEMES).map(([id, t]) => (
              <button
                key={id}
                type="button"
                aria-pressed={theme === id}
                onClick={() => set({ theme: id })}
                className={`rounded-xl border p-3 text-left text-xs font-semibold transition ${
                  theme === id
                    ? "border-emerald-500 ring-2 ring-emerald-100"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span
                  className="mb-2 flex h-8 overflow-hidden rounded-lg"
                  aria-hidden
                >
                  <span className="flex-1" style={{ background: t.bg }} />
                  <span className="flex-1" style={{ background: t.accent }} />
                  <span className="flex-1" style={{ background: t.text }} />
                </span>
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="When & where">
        <Hint icon={CalendarDays} title="Event details">
          Guests see a countdown, a directions button for the venue and a join
          button if you stream online.
        </Hint>
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["date", "Event date", "date"],
            ["time", "Start time", "time"],
            ["endTime", "End time", "time"],
            ["venue", "Venue name"],
            ["address", "Venue address"],
            ["mapUrl", "Google Maps link", "url"],
            ["onlineUrl", "Livestream / online link", "url"],
            ["dressCode", "Dress code / colours"],
          ]}
        />
        <p className="pt-2 text-sm font-semibold text-slate-800">
          {kind.scheduleTitle} (optional)
        </p>
        <ListEditor
          label="item"
          value={value.schedule || []}
          onChange={(schedule) => set({ schedule })}
          fields={[
            ["time", "Time", "time"],
            ["title", "Activity *"],
            ["location", "Location / speaker"],
          ]}
        />
      </Section>

      <Section title={kind.peopleTitle}>
        <Hint icon={Users} title={`${kind.peopleTitle} (optional)`}>
          Add the people guests should look out for, with a photo and role.
        </Hint>
        <ListEditor
          label="person"
          value={value.speakers || []}
          onChange={(speakers) => set({ speakers })}
          fields={[
            ["name", "Name *"],
            ["role", "Role / title"],
            ["image", "Photo URL", "url"],
          ]}
        />
      </Section>

      <Section title={kind.messageTitle}>
        <Field
          label="Message"
          type="textarea"
          style={{ height: 140 }}
          value={value.message || ""}
          onChange={(message) => set({ message })}
          placeholder="We can't wait to see you there…"
        />
      </Section>

      <Section title="Tickets, RSVP & contact">
        <Hint icon={Ticket} title="Getting in">
          Link to a ticketing page, let guests RSVP on WhatsApp with one tap,
          or share a form.
        </Hint>
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["ticketPrice", "Entry (e.g. Free, ₦5,000)"],
            ["ticketUrl", "Ticket link", "url"],
            ["rsvpPhone", "RSVP WhatsApp number (+234)", "tel"],
            ["rsvpUrl", "RSVP form link", "url"],
            ["rsvpBy", "RSVP by", "date"],
            ["contactPhone", "Enquiries phone", "tel"],
            ["giftDetails", "Gifts / donations / account details", "textarea"],
          ]}
        />
      </Section>

      <Section title={`Photo gallery (${images.length}/${MAX_IMAGES})`}>
        <Hint icon={Images} title="Share photos">
          Flyers, past editions, or pictures from the day.
        </Hint>
        {images.length < MAX_IMAGES && (
          <MediaUploader
            label="Add photo"
            onUpload={(file) =>
              set({ images: [...images, { url: file.url, caption: "" }] })
            }
          />
        )}
        {images.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {images.map((image, i) =>
                image.url ? (
                  <img
                    key={i}
                    src={image.url}
                    alt=""
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ) : null,
              )}
            </div>
            <ListEditor
              label="photo"
              value={images}
              onChange={(next) => set({ images: next })}
              fields={[
                ["url", "Photo URL", "url"],
                ["caption", "Caption"],
              ]}
            />
          </>
        )}
      </Section>

      <Section title={`Videos (${videos.length}/${MAX_VIDEOS})`}>
        <Hint icon={Clapperboard} title="Share videos">
          Upload MP4/WebM files (up to 50 MB) or paste YouTube links.
        </Hint>
        {videos.length < MAX_VIDEOS && (
          <MediaUploader
            kind="video"
            label="Upload video"
            onUpload={(file) =>
              set({ videos: [...videos, { url: file.url, title: "" }] })
            }
          />
        )}
        <ListEditor
          label="video"
          value={videos}
          onChange={(next) => set({ videos: next.slice(0, MAX_VIDEOS) })}
          fields={[
            ["url", "Video or YouTube URL *", "url"],
            ["title", "Title"],
          ]}
        />
      </Section>
    </div>
  );
}
