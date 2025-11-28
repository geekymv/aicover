import ImageToColoringWidget from "@/components/image-tool/ImageToColoringWidget";
import { Metadata } from "next";

const steps = [
  {
    title: "Upload Your Image",
    desc: "Drop your image or click to upload. Supports PNG, JPG, and WEBP formats.",
  },
  {
    title: "Select Line Art Style",
    desc: "Choose Default, Cartoon, Snoopy, or Sketch to control detail and line quality.",
  },
  {
    title: "Generate & Download",
    desc: "In around 30 seconds you get a clean, printable coloring page for instant use.",
  },
];

const styles = ["Default", "Cartoon", "Snoopy", "Sketch"];

const features = [
  {
    title: "Free Conversions",
    desc: "Try high‑quality photo‑to‑coloring conversions for free before upgrading.",
  },
  {
    title: "No Watermarks",
    desc: "Get clean, distraction‑free coloring pages without logos or overlays.",
  },
  {
    title: "Multiple Styles",
    desc: "From realistic to classic cartoon, pick the line art style that fits your idea.",
  },
  {
    title: "Smarter AI Core",
    desc: "Enhanced region‑based color analysis keeps gradients and textures while avoiding broken lines.",
  },
  {
    title: "Popular Formats",
    desc: "Easily convert images from PNG, JPG, or WEBP into printable coloring pages.",
  },
  {
    title: "Creator‑Friendly Rights",
    desc: "You keep rights to your original photo and generated coloring page for printing and sharing.",
  },
];

const categories = [
  "Animal Coloring Pages",
  "Food Coloring Pages",
  "Characters Coloring Pages",
  "Enjoy Moments Coloring Pages",
  "Cartoons Coloring Pages",
  "Vehicles Coloring Pages",
];

const tools = [
  "Text to Coloring Page",
  "Image to Coloring Page",
  "Online Coloring",
  "AI Colorizer",
  "Image to PDF Converter",
  "Name & Letter Coloring Pages",
];

const faqs = [
  {
    q: "How does the photo to coloring page conversion work?",
    a: "Our AI analyzes colors and edges in your photo, then extracts clean black‑and‑white outlines that are perfect for coloring.",
  },
  {
    q: "What types of photos work best?",
    a: "Clear, well‑lit photos with distinct subjects and good contrast produce the best coloring pages.",
  },
  {
    q: "What if I'm not satisfied with the result?",
    a: "Try a different style, adjust options like detail level, or upload a simpler photo for improved output.",
  },
  {
    q: "Who owns the copyright to the generated coloring page?",
    a: "You retain rights to your original photo and the generated coloring page, but only upload content you have permission to use.",
  },
];

export const metadata: Metadata = {
  title: "Online Photo to Coloring Page Converter | Image to Coloring Page",
  description:
    "Upload any photo and instantly turn it into a high‑quality coloring page in cartoon, sketch, or portrait styles.",
  alternates: {
    canonical: `${process.env.WEB_BASE_URI}/image-to-coloring-page`,
  },
};

export default function ImageToColoringPage() {
  return (
    <div className="w-full bg-[#f7f7fb] px-4 pb-16 pt-12 text-slate-900 md:px-8">
      <section className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-4xl">
          Online Photo to Coloring Page Converter
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
          Upload any photo - our photo-to-coloring-page converter instantly generates
          high-quality coloring pages in cartoon, sketch, or portrait styles.
        </p>
      </section>

      <ImageToColoringWidget />

      <section className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
              {index + 1}
            </div>
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{step.desc}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="text-2xl font-semibold">
          Why choose this photo to coloring page converter?
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl rounded-3xl bg-white p-10 shadow-sm">
        <h2 className="text-2xl font-semibold">
          6 image types perfect for photo‑to‑coloring‑page conversion
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <div
              key={category}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
            >
              <p className="font-medium text-slate-800">{category}</p>
              <p className="mt-2 text-sm text-slate-600">
                Upload a related photo and the AI will keep the main outlines so kids
                and adults can enjoy coloring.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="text-2xl font-semibold">FAQs about photos to coloring pages</h2>
        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <summary className="cursor-pointer text-lg font-semibold text-slate-800">
                {faq.q}
              </summary>
              <p className="mt-3 text-sm text-slate-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

