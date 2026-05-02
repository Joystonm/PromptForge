import Link from "next/link";
import { Sparkles, Zap, Image, FileText, ArrowRight, Star, Leaf, BarChart3, Recycle, Monitor } from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI Campaign Strategist", desc: "Converts simple ideas into detailed marketing strategies with brand positioning and messaging frameworks." },
  { icon: Image, title: "AI Visual Generator", desc: "Generates campaign backgrounds, styled scenes, and promotional compositions using MiniMax image-01." },
  { icon: FileText, title: "AI Copywriter", desc: "Creates platform-specific headlines, captions, ad descriptions, and CTAs in multiple tone variations." },
  { icon: Zap, title: "Cloudinary Media Engine", desc: "Handles all transformations, smart cropping, format conversion, and global CDN delivery." },
];

const sustainabilityFeatures = [
  { icon: Leaf, title: "Green Score", desc: "Every campaign gets a 0–100 sustainability score based on compression efficiency, asset reuse, and delivery optimization." },
  { icon: BarChart3, title: "Impact Dashboard", desc: "See exactly how much bandwidth, storage, and CO₂ emissions your optimized campaign saves vs. unoptimized delivery." },
  { icon: Recycle, title: "Smart Asset Reuse", desc: "One uploaded image powers every platform format — Instagram, LinkedIn, YouTube, and more — via URL transforms alone." },
  { icon: Monitor, title: "Responsive Delivery", desc: "Preview how Cloudinary automatically serves the right image size to mobile, tablet, and desktop — no extra files needed." },
];

const steps = [
  { n: "01", title: "Campaign Idea", desc: "Describe your campaign in plain English. Paste a full creative brief or just a sentence — AI handles the rest." },
  { n: "02", title: "Select Platforms", desc: "Choose from Instagram, LinkedIn, YouTube, Facebook, X, Website, Email, and Google Display." },
  { n: "03", title: "Choose Asset Types", desc: "Pick social posts, stories, banners, thumbnails, carousels, email headers, and more." },
  { n: "04", title: "Pick Formats", desc: "Select exact pixel dimensions per platform. Every format is pre-configured — no manual sizing." },
  { n: "05", title: "AI Creative Brief", desc: "MiniMax-M2.7 generates brand positioning, color palette, taglines, hooks, and visual direction from your idea." },
  { n: "06", title: "Generate Campaign Kit", desc: "Upload brand assets → AI generates visuals → Cloudinary optimizes and delivers. One source image powers every format." },
  { n: "07", title: "Review, Studio & Export", desc: "Apply live Cloudinary transforms — text overlays, generative fill, art filters, smart crop — then check your Green Score and download." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">PromptForge AI</span>
          </div>
          <Link href="/campaign" className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
            Start Creating <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-green-300 mb-8">
            <Leaf className="w-3.5 h-3.5 fill-green-400 text-green-400" />
            April Mini-Hack · Build for a More Mindful Digital Future
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Create Once.{" "}
            <span className="gradient-text">Optimize Everywhere.</span>{" "}
            Deliver Sustainably.
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            AI-powered marketing campaigns with built-in sustainability. Every asset optimized by Cloudinary — lighter delivery, smarter reuse, measurable impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/campaign" className="btn-primary flex items-center justify-center gap-2 text-base">
              <Sparkles className="w-5 h-5" /> Generate My Campaign
            </Link>
            <a href="#sustainability" className="btn-secondary flex items-center justify-center gap-2 text-base">
              <Leaf className="w-4 h-4" /> See Green Features
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need, Automated</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="step-card group">
                <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center mb-4 group-hover:bg-brand-600/30 transition-colors">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section id="sustainability" className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/20 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-sm text-green-400 mb-4">
              <Leaf className="w-3.5 h-3.5" /> Sustainable AI Marketing
            </div>
            <h2 className="text-3xl font-bold mb-4">A Greener Way to Create</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every optimized asset saves bandwidth, energy, and emissions. PromptForge uses Cloudinary to make your campaigns faster, lighter, and more sustainable by default.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {sustainabilityFeatures.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="step-card group border-green-500/10 hover:border-green-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          {/* Impact stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: "~82%", label: "Average file size reduction", color: "text-green-400" },
              { value: "1 → ∞", label: "Source asset to all formats", color: "text-brand-400" },
              { value: "WebP/AVIF", label: "Auto format + dpr_auto", color: "text-purple-400" },
              { value: "0 extra", label: "Files generated per variant", color: "text-amber-400" },
            ].map(({ value, label, color }) => (
              <div key={label} className="step-card text-center">
                <p className={`text-2xl font-black mb-1 ${color}`}>{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-gray-400 text-center mb-12">Seven steps from idea to sustainable marketing kit</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="step-card">
                <span className="text-4xl font-black text-brand-600/30 block mb-3">{n}</span>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto glass rounded-3xl p-12 border border-green-500/10">
          <div className="inline-flex items-center gap-2 text-green-400 text-sm mb-4">
            <Leaf className="w-4 h-4" /> Mindful Digital Marketing
          </div>
          <h2 className="text-3xl font-bold mb-4">Ready to Forge a Greener Campaign?</h2>
          <p className="text-gray-400 mb-8">Create once, optimize everywhere, deliver sustainably — powered by Cloudinary.</p>
          <Link href="/campaign" className="btn-primary inline-flex items-center gap-2 text-base">
            <Sparkles className="w-5 h-5" /> Start for Free
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-6 text-center text-sm text-gray-500">
        © 2026 PromptForge AI · Built with MiniMax AI + Cloudinary · 🌱 April Mini-Hack: Build for a More Mindful Digital Future
      </footer>
    </main>
  );
}
