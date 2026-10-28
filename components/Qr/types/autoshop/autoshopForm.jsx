"use client";

import { Section, Fields, Field } from "../controls";
import MediaUploader from "../../MediaUploader";
import { Hint } from "../wedding/weddingForm";
import { Car, Wrench, ClipboardList, Plus } from "lucide-react";
import { SERVICE_CHECKS } from "./checks";

const MAX_LOG = 100;

function LogEntry({ entry, index, total, onChange, onMove, onRemove }) {
  const set = (patch) => onChange({ ...entry, ...patch });
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <p className="text-sm font-semibold text-slate-800">
          Service {total - index}
          {entry.date && (
            <span className="ml-2 font-normal text-slate-400">{entry.date}</span>
          )}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
        >
          Remove
        </button>
      </div>
      <div className="space-y-4 p-4">
        <Fields
          value={entry}
          onChange={onChange}
          fields={[
            ["date", "Service date", "date"],
            ["mileage", "Mileage (e.g. 84,500 km)"],
            ["oilType", "Oil type used (e.g. 5W-30 synthetic)"],
            ["fluidBrand", "Fluid / parts type & brand"],
          ]}
        />
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">
            Work done
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {SERVICE_CHECKS.map(([key, label]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2"
              >
                <span className="text-sm text-slate-700">{label}</span>
                <span className="flex overflow-hidden rounded-lg border border-slate-200 text-xs font-semibold">
                  {[
                    [true, "Yes"],
                    [false, "No"],
                  ].map(([flag, text]) => (
                    <button
                      key={text}
                      type="button"
                      aria-pressed={entry[key] === flag}
                      onClick={() => set({ [key]: flag })}
                      className={`px-3 py-1.5 transition ${
                        entry[key] === flag
                          ? flag
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-700 text-white"
                          : "bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {text}
                    </button>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
        <Field
          label="Notes"
          type="textarea"
          value={entry.notes || ""}
          onChange={(notes) => set({ notes })}
          placeholder="Replaced air filter, rotated tyres…"
        />
        <div className="flex gap-2 border-t border-slate-200 pt-3">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            ↑ Move up
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            ↓ Move down
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AutoshopForm({ value = {}, onChange }) {
  const log = value.log || [];
  const set = (patch) => onChange({ ...value, ...patch });
  const setLog = (next) => set({ log: next });

  return (
    <div className="space-y-5">
      <Section title="Vehicle">
        <Hint icon={Car} title="Vehicle details">
          Stick this QR on the windscreen or service sticker. Scanning shows the
          car&apos;s service history and when the next service is due.
        </Hint>
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["vehicleType", "Vehicle type (e.g. Saloon, SUV)"],
            ["date", "Date", "date"],
            ["model", "Make & model * (e.g. Toyota Corolla)"],
            ["year", "Year"],
            ["plate", "Plate number"],
            ["vin", "VIN"],
          ]}
        />
      </Section>

      <Section title="Service">
        <Hint icon={Wrench} title="Next service">
          Drivers see a countdown to the next due date, and a reminder once it
          has passed.
        </Hint>
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["serviceType", "Service type (e.g. Full service)"],
            ["oilChangeDate", "Oil change date", "date"],
            ["nextDueDate", "Next due date", "date"],
            ["nextDueMileage", "Next due mileage (optional)"],
          ]}
        />
      </Section>

      <Section title={`Maintenance log (${log.length})`}>
        <Hint icon={ClipboardList} title="Service history">
          Add an entry for each visit. The newest goes on top.
        </Hint>
        <button
          type="button"
          disabled={log.length >= MAX_LOG}
          onClick={() =>
            setLog([
              {
                date: new Date().toISOString().slice(0, 10),
                ...Object.fromEntries(SERVICE_CHECKS.map(([k]) => [k, false])),
              },
              ...log,
            ])
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/40 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
        >
          <Plus size={17} /> Add service entry
        </button>
        {log.map((entry, index) => (
          <LogEntry
            key={index}
            entry={entry}
            index={index}
            total={log.length}
            onChange={(next) =>
              setLog(log.map((e, i) => (i === index ? next : e)))
            }
            onMove={(step) => {
              const next = [...log];
              [next[index], next[index + step]] = [next[index + step], next[index]];
              setLog(next);
            }}
            onRemove={() => setLog(log.filter((_, i) => i !== index))}
          />
        ))}
      </Section>

      <Section title="Workshop (optional)">
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["shopName", "Workshop name"],
            ["shopPhone", "Phone", "tel"],
            ["shopAddress", "Address"],
            ["mapUrl", "Google Maps link", "url"],
          ]}
        />
        <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
          <MediaUploader
            label="Upload workshop logo"
            onUpload={(file) => set({ logo: file.url })}
          />
          <Field
            label="Logo URL"
            type="url"
            value={value.logo || ""}
            onChange={(logo) => set({ logo })}
          />
        </div>
      </Section>
    </div>
  );
}
