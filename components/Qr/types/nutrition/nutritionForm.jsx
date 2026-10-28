"use client";

import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
import { Hint } from "../wedding/weddingForm";
import { Salad, ShieldAlert } from "lucide-react";

export default function NutritionForm({ value = {}, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-5">
      <Section title="Product">
        <Hint icon={Salad} title="Product label">
          Everything on the pack, readable on any phone — ingredients,
          allergens, directions and where it was made.
        </Hint>
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["name", "Product name *"],
            ["brand", "Brand"],
            ["netQuantity", "Net quantity / weight / volume (e.g. 500 g)"],
            ["countryOfOrigin", "Country of origin"],
            ["expiryDate", "Expiration date", "date"],
            ["batch", "Batch / lot number"],
          ]}
        />
        <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
          <MediaUploader
            label="Upload product photo"
            onUpload={(file) => set({ image: file.url })}
          />
          <Field
            label="Product photo URL"
            type="url"
            value={value.image || ""}
            onChange={(image) => set({ image })}
          />
        </div>
      </Section>

      <Section title="Ingredients & allergens">
        <Field
          label="Ingredients"
          type="textarea"
          style={{ height: 110 }}
          value={value.ingredients || ""}
          onChange={(ingredients) => set({ ingredients })}
          placeholder="Whole oats, honey, almonds (12%), sunflower oil, salt"
        />
        <Field
          label="Allergen warnings"
          type="textarea"
          value={value.allergens || ""}
          onChange={(allergens) => set({ allergens })}
          placeholder="Contains nuts and gluten. May contain traces of milk."
        />
      </Section>

      <Section title="Nutrition facts (optional)">
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["servingSize", "Serving size (e.g. 40 g)"],
            ["servingsPerContainer", "Servings per container"],
            ["calories", "Calories per serving"],
          ]}
        />
        <ListEditor
          label="nutrient"
          value={value.nutrients || []}
          onChange={(nutrients) => set({ nutrients })}
          fields={[
            ["name", "Nutrient * (e.g. Protein)"],
            ["amount", "Amount (e.g. 6 g)"],
            ["dailyValue", "% Daily value"],
          ]}
        />
      </Section>

      <Section title="Use & storage">
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["directions", "Directions for use / instructions", "textarea"],
            ["storage", "Storage instructions", "textarea"],
          ]}
        />
      </Section>

      <Section title="Safety & manufacturer">
        <Hint icon={ShieldAlert} title="Warnings and contact">
          Safety warnings appear highlighted. Add who made or distributes the
          product so customers know who to contact.
        </Hint>
        <Field
          label="Safety warnings or disclaimer"
          type="textarea"
          value={value.warnings || ""}
          onChange={(warnings) => set({ warnings })}
        />
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["manufacturer", "Manufacturer or distributor", "textarea"],
            ["manufacturerPhone", "Contact phone", "tel"],
            ["manufacturerEmail", "Contact email", "email"],
            ["websiteUrl", "Website", "url"],
          ]}
        />
      </Section>
    </div>
  );
}
