"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  FolderPlus,
  Plus,
  QrCode,
} from "lucide-react";

const Page = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Active");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("Most Recent");
  const [quantity, setQuantity] = useState("10");

  return (
    <div className="min-h-screen bg-[#f5f8fb] px-6 py-8">

      {/* ========================================
          HEADER
      ======================================== */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-[32px] font-bold text-[#101828]">
          My QR Codes
        </h1>

        <div className="flex items-center gap-5">
          {/* New Folder */}
          <button
            type="button"
            className="flex h-[52px] items-center gap-2 rounded-[4px] border border-[#20c75a] bg-white px-8 text-[18px] font-semibold text-[#20c75a] transition hover:bg-green-50"
          >
            <FolderPlus size={21} strokeWidth={2} />
            New Folder
          </button>

          {/* Create QR Code */}
          <Link
            href="/dashboard/create"
            className="flex h-[52px] items-center gap-3 rounded-[4px] bg-[#20c75a] px-7 text-[18px] font-bold text-white shadow-sm transition hover:bg-[#19b851]"
          >
            <QrCode size={24} strokeWidth={2.5} />
            Create QR Code
          </Link>
        </div>
      </div>


      {/* ========================================
          MY FOLDERS
      ======================================== */}
      <section className="mb-8">
        <h2 className="mb-4 text-[22px] font-normal text-[#7b8492]">
          My Folders
        </h2>

        <button
          type="button"
          className="flex h-[179px] w-[220px] flex-col items-center justify-center rounded-[4px] border border-[#20c75a] bg-transparent transition hover:bg-green-50"
        >
          <div className="mb-3 flex h-[70px] w-[70px] items-center justify-center rounded-full border border-dashed border-[#20c75a]">
            <FolderPlus
              size={29}
              strokeWidth={1.7}
              className="text-[#20c75a]"
            />
          </div>

          <span className="text-[21px] font-normal text-[#20c75a]">
            New Folder
          </span>
        </button>
      </section>


      {/* ========================================
          FILTER BAR
      ======================================== */}
      <section className="mb-8 rounded-[12px] bg-white px-6 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_120px] gap-8">

          {/* Search */}
          <div>
            <label className="mb-2 block text-[14px] text-[#667085]">
              My QR Codes
            </label>

            <div className="relative">
              <Search
                size={23}
                strokeWidth={1.7}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#111827]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="h-[50px] w-full rounded-full border-2 border-[#e4e4e4] bg-[#fafafa] pl-11 pr-4 text-[16px] text-[#344054] outline-none transition placeholder:text-[#667085] focus:border-[#20c75a]"
              />
            </div>
          </div>


          {/* QR Code Status */}
          <div>
            <label className="mb-2 block text-[14px] text-[#667085]">
              QR Code Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-[50px] w-full appearance-none border-2 border-[#e5e5e5] bg-white px-4 text-[16px] text-[#101828] outline-none focus:border-[#20c75a]"
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>All</option>
            </select>
          </div>


          {/* QR Code Types */}
          <div>
            <label className="mb-2 block text-[14px] text-[#667085]">
              QR Code Types
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-[50px] w-full appearance-none border-2 border-[#e5e5e5] bg-white px-4 text-[16px] text-[#101828] outline-none focus:border-[#20c75a]"
            >
              <option value="">Select an Option</option>
              <option>URL</option>
              <option>Text</option>
              <option>Email</option>
              <option>Phone</option>
              <option>WiFi</option>
              <option>vCard</option>
            </select>
          </div>


          {/* Sort */}
          <div>
            <label className="mb-2 block text-[14px] text-[#667085]">
              Sort by
            </label>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-[50px] w-full appearance-none border-2 border-[#e5e5e5] bg-white px-4 text-[16px] text-[#101828] outline-none focus:border-[#20c75a]"
            >
              <option>Most Recent</option>
              <option>Oldest</option>
              <option>Name A-Z</option>
              <option>Name Z-A</option>
            </select>
          </div>


          {/* Quantity */}
          <div>
            <label className="mb-2 block text-[14px] text-[#667085]">
              Quantity
            </label>

            <select
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-[50px] w-full appearance-none border-2 border-[#e5e5e5] bg-white px-4 text-[16px] text-[#101828] outline-none focus:border-[#20c75a]"
            >
              <option>10</option>
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>

        </div>
      </section>


      {/* ========================================
          EMPTY QR CODE AREA
      ======================================== */}
      <section className="flex min-h-[500px] flex-col items-center justify-center rounded-[14px] bg-white px-6 py-12 shadow-[0_2px_8px_rgba(16,24,40,0.08)]">

        {/* Empty State Illustration */}
        <div className="mb-8 flex h-[250px] w-[330px] items-center justify-center">
          {/* Replace this with your actual empty-state image */}
          <div className="relative h-[190px] w-[270px]">

            {/* Background document */}
            <div className="absolute right-5 top-0 h-[85px] w-[110px] border-[6px] border-[#f1f1f1] bg-white">
              <div className="space-y-2 p-3">
                <div className="h-1 bg-[#eeeeee]" />
                <div className="h-1 bg-[#eeeeee]" />
                <div className="h-1 bg-[#eeeeee]" />
                <div className="h-1 bg-[#eeeeee]" />
              </div>
            </div>

            {/* Browser */}
            <div className="absolute left-8 top-[55px] h-[130px] w-[180px] rounded-[8px] border-[7px] border-[#6fd994] bg-white">
              <div className="absolute left-0 right-0 top-0 h-5 bg-[#20c75a]">
                <div className="flex gap-1 px-2 pt-[5px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
              </div>

              {/* Broken QR document */}
              <div className="absolute left-1/2 top-[45px] -translate-x-1/2">
                <div className="flex h-11 w-9 items-center justify-center border border-[#20c75a] text-[#20c75a]">
                  <span className="text-2xl">⌁</span>
                </div>

                <p className="mt-2 whitespace-nowrap text-[7px] font-bold text-[#20c75a]">
                  NO QR CODE FOUND
                </p>
              </div>
            </div>

            {/* Person */}
            <div className="absolute right-[38px] top-[22px]">
              <div className="mx-auto h-8 w-8 rounded-full bg-[#263238]" />
              <div className="mx-auto h-[70px] w-12 rounded-b-[18px] bg-[#168944]" />
              <div className="absolute -left-3 top-2 h-2 w-8 -rotate-[40deg] rounded-full bg-[#ffb27d]" />
              <div className="absolute -right-3 top-2 h-2 w-8 rotate-[40deg] rounded-full bg-[#ffb27d]" />
              <div className="mx-auto flex gap-1">
                <div className="h-20 w-5 rotate-[8deg] rounded-full bg-[#263238]" />
                <div className="h-20 w-5 -rotate-[8deg] rounded-full bg-[#263238]" />
              </div>
            </div>

            {/* Ground */}
            <div className="absolute bottom-0 left-0 h-3 w-full rounded-[50%] bg-[#f2f2f2]" />
          </div>
        </div>


        {/* Message */}
        <h2 className="mb-8 text-center text-[31px] font-normal text-[#65758b]">
          There are no QR codes to show...
        </h2>


        {/* Create Button */}
        <Link
          href="/dashboard/create"
          className="flex items-center gap-3 rounded-[4px] bg-[#20c75a] px-8 py-4 text-[25px] font-bold text-white transition hover:bg-[#19b851]"
        >
          <QrCode size={31} strokeWidth={2.5} />
          Create QR Code
        </Link>

      </section>
    </div>
  );
};

export default Page;