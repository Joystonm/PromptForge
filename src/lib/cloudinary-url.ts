/**
 * Client-safe Cloudinary URL builder — no Node.js SDK required.
 */
export function buildCloudinaryUrl(
  publicId: string,
  width: number,
  height: number,
  options: { format?: string; quality?: string; gravity?: string; effect?: string } = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "demo";
  const transforms = [
    `w_${width}`,
    `h_${height}`,
    `c_fill`,
    `g_${options.gravity ?? "auto"}`,
    `f_${options.format ?? "auto"}`,
    `q_${options.quality ?? "auto"}`,
    `dpr_auto`,
    ...(options.effect ? [options.effect] : []),
  ];
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${publicId}`;
}

/** Raw original URL (no transforms) for comparison */
export function buildRawUrl(publicId: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "demo";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

/**
 * Responsive srcset — generates 3 width breakpoints for native <img srcset>.
 * Cloudinary serves the right size per viewport; no wasted bytes on mobile.
 */
export function buildSrcSet(publicId: string, height: number, widths = [480, 768, 1280]): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "demo";
  return widths
    .map((w) => {
      const h = Math.round((height / widths[widths.length - 1]) * w);
      return `https://res.cloudinary.com/${cloudName}/image/upload/w_${w},h_${h},c_fill,g_auto,f_auto,q_auto,dpr_auto/${publicId} ${w}w`;
    })
    .join(", ");
}

/** Auto-enhance: improve + sharpen + color correction and more */
export function buildEnhanceUrl(
  publicId: string,
  width: number,
  height: number,
  mode: "improve" | "sharpen" | "auto_color" | "vibrance" | "auto_brightness" | "auto_contrast" | "unsharp_mask" | "saturation" | "gamma" | "viesus_correct" | "upscale" | "noise"
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "demo";
  const effectMap: Record<string, string> = {
    improve: "e_improve",
    sharpen: "e_sharpen:100",
    auto_color: "e_auto_color",
    vibrance: "e_vibrance",
    auto_brightness: "e_auto_brightness",
    auto_contrast: "e_auto_contrast",
    unsharp_mask: "e_unsharp_mask",
    saturation: "e_saturation:50",
    gamma: "e_gamma:50",
    upscale: "e_upscale",
    noise: "e_noise:10",
  };
  const effect = effectMap[mode] ?? `e_${mode}`;
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill,g_auto,${effect},f_auto,q_auto,dpr_auto/${publicId}`;
}

/**
 * AI Background Removal — e_background_removal isolates the subject.
 * Optionally replaces background with a solid color or keeps it transparent (PNG).
 */
export function buildBgRemovalUrl(
  publicId: string,
  width: number,
  height: number,
  bgColor?: string // hex without #, e.g. "ffffff". Omit for transparent PNG.
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "demo";
  const bg = bgColor ? `,b_rgb:${bgColor}` : "";
  const fmt = bgColor ? "f_auto" : "f_png"; // PNG preserves transparency
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill,g_auto,e_background_removal${bg},${fmt},q_auto,dpr_auto/${publicId}`;
}

/** Smart gravity crop — reframe subject using different focal points */
export function buildGravityUrl(
  publicId: string,
  width: number,
  height: number,
  gravity: "auto" | "face" | "faces" | "north" | "south" | "east" | "west" | "center" | "north_east" | "north_west" | "south_east" | "south_west"
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "demo";
  // face/faces use c_thumb for proper face-detection cropping
  const crop = gravity === "face" || gravity === "faces" ? "c_thumb" : "c_fill";
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},${crop},g_${gravity},f_auto,q_auto/${publicId}`;
}

/**
 * Burn text + optional brand color overlay directly into the image via Cloudinary URL.
 * Uses chained transformations: resize → text layer → gradient banner.
 */
export function buildOverlayUrl(
  publicId: string,
  width: number,
  height: number,
  headline: string,
  cta: string
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "demo";
  const fontSize = Math.max(28, Math.floor(width / 18));
  const ctaSize = Math.max(18, Math.floor(width / 28));

  const transforms: string[] = [
    `w_${width},h_${height},c_fill,g_auto,f_auto,q_auto`,
    `e_gradient_fade:symmetric_pad,x_0,y_-0.3`,
  ];

  const safeHeadline = headline.trim().slice(0, 50).replace(/[,/]/g, " ");
  if (safeHeadline) {
    transforms.push(`l_text:Montserrat_${fontSize}_bold:${encodeURIComponent(safeHeadline)},co_white,g_south,y_80,w_${Math.floor(width * 0.85)},c_fit`);
  }

  const safeCta = cta.trim().slice(0, 30).replace(/[,/]/g, " ");
  if (safeCta) {
    transforms.push(`l_text:Montserrat_${ctaSize}_semibold:${encodeURIComponent(safeCta)},co_rgb:a78bfa,g_south,y_40`);
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join("/")}/${publicId}`;
}

/**
 * Generative fill — extend the canvas to a new aspect ratio using AI-generated content.
 * e_gen_fill pads the image with AI-generated background matching the scene.
 */
export function buildGenFillUrl(publicId: string, width: number, height: number): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "demo";
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_pad,b_gen_fill,f_auto,q_auto/${publicId}`;
}

/**
 * Artistic style filter via e_art transformation.
 */
export function buildArtisticUrl(
  publicId: string,
  width: number,
  height: number,
  style: "athena" | "audrey" | "daguerre" | "eucalyptus" | "fes" | "frost" | "hairspray" | "hokusai" | "incognito" | "linen" | "peacock" | "primavera" | "quartz" | "red_rock" | "refresh" | "sizzle" | "sonnet" | "ukulele" | "zorro"
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "demo";
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill,g_auto,e_art:${style},f_auto,q_auto/${publicId}`;
}
