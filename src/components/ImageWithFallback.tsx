import { useEffect, useState } from "react";

/**
 * The placeholder shown wherever a content image is missing or fails to load.
 * Drawn inline rather than loaded from public/ so it inherits `currentColor`
 * and works in both themes without shipping two files or an extra request.
 *
 * A potted plant: on-brand, and instantly readable as "a plant belongs here"
 * rather than as a broken file. Only two tones — foliage light, pot dark —
 * because `currentColor` gives us one hue and opacity is the only axis left.
 *
 * Each tone is one <g opacity>, not per-shape opacity: the leaves overlap the
 * stem and the pot body overlaps its rim, and per-shape alpha would let those
 * seams show through as darker lines. Group opacity composites the shapes
 * first, then fades the result, so each tone stays flat.
 */
export const BlankImage = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* foliage: stem, then five leaves — terminal one up-left, then two opposite pairs */}
    <g opacity="0.34" fill="currentColor">
      <path
        d="M24.8 34C24.6 30 23.9 24.5 23.2 19 22.8 16 22.4 14.5 22.3 13.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M22.3 13.5Q23.56 1.9 12 3.5Q12.41 13.38 22.3 13.5ZM23 18Q35.4 20.01 36.5 7.5Q25.58 7.38 23 18ZM23.2 21Q17.81 9.71 7 16Q13.09 25 23.2 21ZM24.1 28.5Q35.77 32.54 38.5 20.5Q28 18.56 24.1 28.5ZM24.5 31Q19.49 19.55 8.5 25.5Q14.29 34.68 24.5 31Z" />
    </g>
    {/* pot: rim, then the tapering body */}
    <g opacity="0.58" fill="currentColor">
      <rect x="13" y="33" width="22" height="3.5" rx="1.6" />
      <path d="M14.5 36.5H33.5L31.4 44.3Q31 46 29.3 46H18.7Q17 46 16.6 44.3Z" />
    </g>
  </svg>
);

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  /** Applied to both the <img> and the placeholder box, so one class works for either. */
  className?: string;
  loading?: "lazy" | "eager";
  width?: number;
  height?: number;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

/**
 * Renders an image, or the BlankImage placeholder when there is no source or
 * the source fails to load (dead storage path, 404). Replaces the per-site
 * emoji fallbacks, which rendered at wildly different sizes across the app.
 */
const ImageWithFallback = ({
  src,
  alt,
  className = "",
  loading,
  width,
  height,
  onClick,
}: ImageWithFallbackProps) => {
  const [failed, setFailed] = useState(false);

  // A carousel swapping src on the same element must get a fresh chance to load.
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const usable = !!src && src.trim() !== "" && !failed;

  if (usable) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        width={width}
        height={height}
        onClick={onClick}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className={`bg-muted text-muted-foreground flex items-center justify-center ${className}`}
      role="img"
      aria-label={alt}
      onClick={onClick}
    >
      {/*
        No fixed min/max: the SVG's own preserveAspectRatio keeps it centered
        and undistorted at any container size, so "half the box" alone scales
        correctly from a 40px thumbnail up to a full detail-page image panel.
      */}
      <BlankImage className="w-1/2 h-1/2" />
    </div>
  );
};

export default ImageWithFallback;
