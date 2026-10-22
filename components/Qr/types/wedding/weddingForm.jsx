"use client";

import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
import { WEDDING_THEMES } from "./themes";
import { Heart, CalendarHeart, Images, Clapperboard, Gift } from "lucide-react";

const MAX_IMAGES = 30;
const MAX_VIDEOS = 10;

function Hint({ icon: Icon, title, children }) {
  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm">
        <Icon size={19} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          {children}
        </p>
      </div>
    </div>
  );
}

export default function WeddingForm({ value = {}, onChange }) {
  const images = value.images || [];
  const videos = value.videos || [];
  const set = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-5">
      <Section title="The couple">
        <Hint icon={Heart} title="Who's celebrating?">
          Choose whether this page invites guests before the day or thanks
          well-wishers and shares memories afterwards. You can switch any time
          — the printed QR stays the same.
        </Hint>

        <label className="block text-sm font-medium text-slate-700">
          Page purpose
          <select
            className="mt-2 block h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            value={value.purpose || "invitation"}
            onChange={(e) => set({ purpose: e.target.value })}
          >
            <option value="invitation">Invitation — before the wedding</option>
            <option value="celebration">
              Thank you & memories — after the wedding
            </option>
          </select>
        </label>

        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["partnerOne", "First partner's name *"],
            ["partnerTwo", "Second partner's name *"],
            ["intro", "Invitation line (e.g. Together with their families…)", "textarea"],
            ["hashtag", "Wedding hashtag (e.g. #TK2026)"],
          ]}
        />

        <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
          <MediaUploader
            label="Upload cover photo"
            onUpload={(file) => set({ cover: file.url })}
          />
          <Field
            label="Cover photo URL"
            type="url"
            value={value.cover || ""}
            onChange={(cover) => set({ cover })}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Theme</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(WEDDING_THEMES).map(([id, theme]) => (
              <button
                key={id}
                type="button"
                aria-pressed={(value.theme || "classic") === id}
                onClick={() => set({ theme: id })}
                className={`rounded-xl border p-3 text-left text-xs font-semibold transition ${
                  (value.theme || "classic") === id
                    ? "border-emerald-500 ring-2 ring-emerald-100"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span
                  className="mb-2 flex h-8 overflow-hidden rounded-lg"
                  aria-hidden
                >
                  <span className="flex-1" style={{ background: theme.bg }} />
                  <span
                    className="flex-1"
                    style={{ background: theme.accent }}
                  />
                  <span className="flex-1" style={{ background: theme.text }} />
                </span>
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="When & where">
        <Hint icon={CalendarHeart} title="Event details">
          Guests see a countdown to the date and a directions button for the
          venue.
        </Hint>
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["date", "Wedding date", "date"],
            ["time", "Start time", "time"],
            ["venue", "Venue name"],
            ["address", "Venue address"],
            ["mapUrl", "Google Maps link", "url"],
            ["dressCode", "Dress code / colours"],
          ]}
        />
        <p className="pt-2 text-sm font-semibold text-slate-800">
          Programme (optional)
        </p>
        <ListEditor
          label="programme item"
          value={value.schedule || []}
          onChange={(schedule) => set({ schedule })}
          fields={[
            ["time", "Time", "time"],
            ["title", "Event (e.g. Ceremony) *"],
            ["location", "Location"],
          ]}
        />
      </Section>

      <Section title="Message to well-wishers">
        <Field
          label={
            value.purpose === "celebration"
              ? "Your thank-you message"
              : "Your message to guests"
          }
          type="textarea"
          style={{ height: 140 }}
          value={value.message || ""}
          onChange={(message) => set({ message })}
          placeholder="We can't wait to celebrate with you…"
        />
      </Section>

      <Section title="RSVP & gifts">
        <Hint icon={Gift} title="Responses and gifts">
          Add a WhatsApp number to let guests RSVP with one tap, or link to a
          form. Gift details can include a registry link or account details.
        </Hint>
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["rsvpPhone", "RSVP WhatsApp number (+234)", "tel"],
            ["rsvpUrl", "RSVP form link", "url"],
            ["rsvpBy", "RSVP by", "date"],
            ["registryUrl", "Gift registry link", "url"],
            ["giftDetails", "Gift / account details", "textarea"],
          ]}
        />
      </Section>

      <Section title={`Photo gallery (${images.length}/${MAX_IMAGES})`}>
        <Hint icon={Images} title="Share your photos">
          Pre-wedding shoots, the big day, or memories together.
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
        <Hint icon={Clapperboard} title="Share your videos">
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
