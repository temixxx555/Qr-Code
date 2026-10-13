"use client";

import { Section, Fields, Field } from "../controls";
import MediaUploader from "../../MediaUploader";
import {
  ShoppingBag,
  Store,
  MessageCircle,
  Package,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
} from "lucide-react";

const MAX_PRODUCTS = 100;

function Hint({ icon: Icon, title, children }) {
  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
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

export default function ProductForm({ value = {}, onChange }) {
  const products = value.products || [];

  const setProducts = (next) => onChange({ ...value, products: next });
  const updateProduct = (index, next) =>
    setProducts(products.map((p, i) => (i === index ? next : p)));
  const move = (from, to) => {
    const next = [...products];
    [next[from], next[to]] = [next[to], next[from]];
    setProducts(next);
  };

  return (
    <div className="space-y-5">
      <Section title="Store">
        <Hint icon={Store} title="Your business">
          This is the header customers see before they browse your products.
        </Hint>

        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["name", "Business name *"],
            ["currency", "Currency (e.g. NGN, USD)"],
            ["description", "About your products", "textarea"],
          ]}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
            <MediaUploader
              label="Upload logo"
              onUpload={(file) => onChange({ ...value, logo: file.url })}
            />
            <Field
              label="Logo URL"
              type="url"
              value={value.logo || ""}
              onChange={(logo) => onChange({ ...value, logo })}
            />
          </div>
          <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
            <MediaUploader
              label="Upload cover image"
              onUpload={(file) => onChange({ ...value, cover: file.url })}
            />
            <Field
              label="Cover image URL"
              type="url"
              value={value.cover || ""}
              onChange={(cover) => onChange({ ...value, cover })}
            />
          </div>
        </div>
      </Section>

      <Section title="How customers order">
        <Hint icon={MessageCircle} title="Ordering and contact">
          Add a WhatsApp number to show an “Order on WhatsApp” button on every
          product. Use the international format, e.g. +2348012345678.
        </Hint>

        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["whatsapp", "WhatsApp number", "tel"],
            ["phone", "Phone number", "tel"],
            ["storeUrl", "Online store / website", "url"],
            ["address", "Store address"],
          ]}
        />
      </Section>

      <Section title={`Products (${products.length})`}>
        <Hint icon={ShoppingBag} title="Your catalogue">
          Add up to {MAX_PRODUCTS} products. Use categories to let customers
          filter, and set a sale price to show a discount.
        </Hint>

        {products.map((product, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70"
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 text-slate-400">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package size={18} />
                  )}
                </div>
                <p className="truncate text-sm font-semibold text-slate-800">
                  {product.name || `Product ${index + 1}`}
                </p>
              </div>
              <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-slate-100 px-2 text-xs font-semibold text-slate-500">
                {index + 1}
              </span>
            </div>

            <div className="space-y-4 p-4">
              <Fields
                value={product}
                onChange={(next) => updateProduct(index, next)}
                fields={[
                  ["name", "Product name *"],
                  ["category", "Category (e.g. Dresses)"],
                  ["price", "Price *", "number"],
                  ["salePrice", "Sale price", "number"],
                  ["description", "Description", "textarea"],
                  ["buyUrl", "Buy link (optional)", "url"],
                ]}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <MediaUploader
                  label="Upload product photo"
                  onUpload={(file) =>
                    updateProduct(index, { ...product, image: file.url })
                  }
                />
                <Field
                  label="Photo URL"
                  type="url"
                  value={product.image || ""}
                  onChange={(image) =>
                    updateProduct(index, { ...product, image })
                  }
                />
              </div>

              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3">
                <span className="text-sm text-slate-700">
                  {product.available !== false
                    ? "In stock"
                    : "Sold out — shown but can't be ordered"}
                </span>
                <input
                  type="checkbox"
                  checked={product.available !== false}
                  onChange={(e) =>
                    updateProduct(index, {
                      ...product,
                      available: e.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-emerald-600"
                />
              </label>

              <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => move(index, index - 1)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ArrowUp size={13} /> Move up
                </button>
                <button
                  type="button"
                  disabled={index === products.length - 1}
                  onClick={() => move(index, index + 1)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ArrowDown size={13} /> Move down
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setProducts(products.filter((_, i) => i !== index))
                  }
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          disabled={products.length >= MAX_PRODUCTS}
          onClick={() =>
            setProducts([...products, { name: "", price: "", available: true }])
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/40 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-40"
        >
          <Plus size={17} /> Add product
        </button>
      </Section>
    </div>
  );
}
