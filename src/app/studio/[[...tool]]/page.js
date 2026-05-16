import { hasRequiredSanityEnv } from "@/sanity/env";
import StudioApp from "@/components/sanity/StudioApp";

function StudioSetupNotice() {
  return (
    <main className="min-h-screen bg-[color:var(--color-primary)] px-6 py-24 text-[color:var(--color-white)]">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--color-gold-soft)]">
          Sanity Studio
        </p>
        <h1 className="font-[family:var(--font-lora)] text-4xl leading-tight md:text-5xl">
          Add your Sanity project ID and dataset to start the CMS.
        </h1>
        <p className="max-w-2xl text-base leading-8 text-white/80">
          Create a `.env.local` file from `.env.example`, then set
          `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
          Once those are in place, this route will load Sanity Studio.
        </p>
      </div>
    </main>
  );
}

export default function StudioPage() {
  if (!hasRequiredSanityEnv) {
    return <StudioSetupNotice />;
  }

  return <StudioApp />;
}
