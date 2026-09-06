import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import ImageWithFallback from "@/components/ImageWithFallback";

interface ImageLightboxProps {
  images: string[];
  /** Controlled, so a caller's own carousel can stay in sync with what was browsed here. */
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  /** Base alt text — the slide number is appended. */
  alt: string;
}

/**
 * Fullscreen image viewer, shared by the two detail pages and the two bottom
 * sheets. Sits at z-[70] so it clears the sheets' own z-[60] backdrop and can
 * be opened from inside one of them.
 *
 * Deliberately does NOT lock body scroll: the sheets that host it already do,
 * and releasing the lock on close here would unlock the page underneath while
 * the sheet behind it is still open.
 */
const ImageLightbox = ({ images, index, onIndexChange, onClose, alt }: ImageLightboxProps) => {
  const safeIndex = Math.min(Math.max(index, 0), Math.max(0, images.length - 1));
  const step = (delta: number) => onIndexChange((safeIndex + delta + images.length) % images.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (images.length < 2) return;
      if (e.key === "ArrowLeft") onIndexChange((safeIndex - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onIndexChange((safeIndex + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [safeIndex, images.length, onIndexChange, onClose]);

  if (images.length === 0) return null;

  const roundBtn =
    "absolute w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors z-10";

  return (
    <div
      className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <button onClick={onClose} aria-label="close" className={`${roundBtn} top-4 right-4`}>
        <X className="w-5 h-5" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            aria-label="previous image"
            className={`${roundBtn} left-4`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); step(1); }}
            aria-label="next image"
            className={`${roundBtn} right-4`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <ImageWithFallback
        src={images[safeIndex]}
        alt={`${alt} ${safeIndex + 1}`}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              // stopPropagation matters: without it the click reaches the
              // backdrop and closes the lightbox instead of changing image.
              onClick={(e) => { e.stopPropagation(); onIndexChange(i); }}
              aria-label={`image ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === safeIndex ? "bg-primary w-5" : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageLightbox;
