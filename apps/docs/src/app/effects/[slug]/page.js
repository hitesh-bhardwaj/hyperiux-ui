import { notFound } from "next/navigation";
import { getEffectBySlug, getAllEffectSlugs, getEffectCode, getEffectsByCategory } from "@/lib/registry";
import { getEffectConfig } from "@/lib/effect-configs";
import { EffectDetailContent } from "./effect-detail";

export async function generateStaticParams() {
  const slugs = getAllEffectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const effect = getEffectBySlug(slug);

  if (!effect) {
    return { title: "Effect Not Found" };
  }

  return {
    title: `${effect.title} | Hyperiux UI`,
    description: effect.description,
  };
}

export default async function EffectPage({ params }) {
  const { slug } = await params;
  const effect = getEffectBySlug(slug);

  if (!effect) {
    notFound();
  }

  const config = getEffectConfig(slug);
  const code = getEffectCode(slug);

  // Get related effects (same category, excluding current)
  const categories = getEffectsByCategory();
  const relatedEffects = (categories[effect.category] || [])
    .filter((e) => e.name !== slug)
    .slice(0, 3);

  // Get effect counts for sidebar
  const effectCounts = {};
  for (const [category, effects] of Object.entries(categories)) {
    effectCounts[category] = effects.length;
  }

  return (
    <EffectDetailContent
      slug={slug}
      effect={effect}
      config={config}
      code={code}
      relatedEffects={relatedEffects}
      effectCounts={effectCounts}
    />
  );
}
