"use client";

import Image from "next/image";
import { ChangeEvent, DragEvent, useRef, useState } from "react";

type HistoryItem = {
  id: string;
  style: string;
  timestamp: string;
  src: string;
};

const styleOptions = [
  {
    id: "default",
    label: "Default",
    desc: "Preserve details, realistic",
    featured: true,
  },
  {
    id: "cartoon",
    label: "Cartoon",
    desc: "Classic cartoon",
  },
  {
    id: "snoopy",
    label: "Snoopy",
    desc: "Rounded lines, cute",
  },
  {
    id: "sketch",
    label: "Sketch",
    desc: "Pencil sketch",
  },
];

const samplePhoto =
  "https://cdn.icoloring.ai/icoloring/web/assets/img/image-to-coloring-new-bg-2.png?v=1";

export default function ImageToColoringWidget() {
  const [preview, setPreview] = useState<string>(samplePhoto);
  const [style, setStyle] = useState<string>("default");
  const [removeBg, setRemoveBg] = useState(false);
  const [enhance, setEnhance] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [hasCustomImage, setHasCustomImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Only supports PNG, JPG, and WEBP formats");
      return false;
    }
    if (file.size > 10485760) {
      alert("File size must be less than 10MB");
      return false;
    }
    return true;
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) return;
    uploadToServer(file);
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    handleFile(file);
  };

  const uploadToServer = async (file: File) => {
    try {
      setIsUploading(true);
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload-coloring", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok || data.code !== 0) {
        console.error("upload failed", data);
        alert(data.message || "Upload failed. Please try again.");
        return;
      }
      if (data.data?.url) {
        setPreview(data.data.url);
        setHasCustomImage(true);
      } else {
        alert("Upload failed: No URL returned");
      }
    } catch (e) {
      console.error("upload error", e);
      alert("Upload error. Please check your connection and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = () => {
    if (!preview || isGenerating) return;
    setIsGenerating(true);
    setTimeout(() => {
      setHistory((prev) => {
        const next: HistoryItem[] = [
          {
            id: crypto.randomUUID(),
            style,
            timestamp: new Date().toLocaleTimeString(),
            src: preview,
          },
          ...prev,
        ];
        return next.slice(0, 4);
      });
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <section className="mx-auto mt-10 w-full max-w-6xl">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)] lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <div className="text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Upload Your Image
              </p>
              <label htmlFor="coloring-upload" className="mt-2 block cursor-pointer">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex min-h-[220px] flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-slate-200 bg-[#fafbff] hover:border-slate-300 hover:bg-[#f5f6ff]"
                  }`}
                >
                  {hasCustomImage ? (
                    <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                      <Image
                        src={preview}
                        alt="Uploaded preview"
                        fill
                        sizes="260px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPreview(samplePhoto);
                          setHasCustomImage(false);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs font-semibold text-white hover:bg-black/80"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6"
                          aria-hidden
                        >
                          <path d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1" />
                          <polyline points="8 12 12 8 16 12" />
                          <line x1="12" y1="8" x2="12" y2="21" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-800">
                        Upload Your Image
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Drop your image here or click to upload
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Only supports PNG, JPG, and WEBP formats
                      </p>
                      {isUploading && (
                        <p className="mt-2 text-xs text-slate-500">
                          Uploading...
                        </p>
                      )}
                    </>
                  )}
                </div>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                id="coloring-upload"
                className="sr-only"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleUpload}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">Select Style</p>
              <div className="mt-3 space-y-3">
                <div className="grid gap-3 md:grid-cols-3">
                  {styleOptions.slice(0, 3).map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setStyle(option.id)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        style === option.id
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <p className="text-sm font-semibold">{option.label}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {option.desc}
                      </p>
                    </button>
                  ))}
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {styleOptions.slice(3).map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setStyle(option.id)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm transition md:col-span-1 ${
                        style === option.id
                          ? "border-pink-500 bg-pink-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <p className="text-sm font-semibold">{option.label}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {option.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <ToggleRow
                label="Remove Background"
                value={removeBg}
                onChange={setRemoveBg}
              />
              <ToggleRow
                label="Image Enhancer"
                value={enhance}
                onChange={setEnhance}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-2 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/30"
            >
              {isGenerating ? "Generating..." : "Generate (-2 Credit)"}
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-white p-6">
              <Image
                src={samplePhoto}
                alt="Example: photo to coloring page"
                width={520}
                height={360}
                className="w-full max-w-md object-contain"
              />
            </div>

            <div className="rounded-2xl border border-slate-100 bg-[#fafbff] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-semibold text-slate-800">
                    History
                  </p>
                  <span className="text-xs text-slate-400">ⓘ</span>
                </div>
                <a
                  href="/gallery"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  View All &gt;
                </a>
              </div>

              {history.length === 0 ? (
                <div className="mt-4 rounded-xl bg-white py-6 text-center text-sm text-slate-500">
                  <div className="mb-2 flex justify-center">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-xs">
                      ⏱
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    No history yet
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Generated images will appear here
                  </p>
                </div>
              ) : (
                <div className="mt-4 grid gap-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl bg-white p-3 text-sm"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-700">
                          {item.style}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {item.timestamp}
                        </p>
                      </div>
                      <div className="relative h-10 w-10 overflow-hidden rounded-md border border-slate-100">
                        <Image
                          src={item.src}
                          alt="History preview"
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white px-1 py-2">
      <p className="text-sm font-medium text-slate-800">{label}</p>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`flex h-5 w-9 items-center rounded-full border transition ${
          value
            ? "border-primary bg-primary"
            : "border-slate-300 bg-slate-200"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white shadow transition ${
            value ? "translate-x-4" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

