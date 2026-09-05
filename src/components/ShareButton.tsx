import { useState } from "react";
import { Share2, Link as LinkIcon, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface ShareButtonProps {
  title: string;
}

const ShareButton = ({ title }: ShareButtonProps) => {
  const [open, setOpen] = useState(false);
  const { lang } = useLanguage();
  const url = window.location.href;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast.success(lang === "th" ? "คัดลอกลิงก์แล้ว" : "Link copied!");
  };

  const shareTargets = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bg: "bg-[#1877F2]",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
        </svg>
      ),
    },
    {
      name: "LINE",
      href: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
      bg: "bg-[#06C755]",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19.36 9.5c0-3.32-3.33-6.02-7.42-6.02S4.52 6.18 4.52 9.5c0 2.97 2.64 5.46 6.21 5.93.24.05.57.16.65.36.07.18.05.47.02.65l-.1.63c-.03.18-.15.73.64.4.79-.33 4.27-2.51 5.83-4.3 1.07-1.18 1.59-2.38 1.59-3.67zM8.7 11.27H7.23a.39.39 0 0 1-.39-.39V7.96a.39.39 0 1 1 .78 0v2.53h1.08a.39.39 0 1 1 0 .78zm1.53-.39a.39.39 0 0 1-.78 0V7.96a.39.39 0 1 1 .78 0v2.92zm3.52 0a.39.39 0 0 1-.27.37.4.4 0 0 1-.12.02.39.39 0 0 1-.31-.16l-1.5-2.04v1.81a.39.39 0 0 1-.78 0V7.96a.39.39 0 0 1 .27-.37.4.4 0 0 1 .12-.02c.12 0 .24.06.31.16l1.5 2.04V7.96a.39.39 0 1 1 .78 0v2.92zm2.36-1.85a.39.39 0 1 1 0 .78h-1.08v.69h1.08a.39.39 0 1 1 0 .78h-1.47a.39.39 0 0 1-.39-.39V7.96a.39.39 0 0 1 .39-.39h1.47a.39.39 0 1 1 0 .78h-1.08v.69h1.08z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: null,
      bg: "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]",
      onClick: async () => {
        await navigator.clipboard.writeText(url);
        toast.success(
          lang === "th"
            ? "คัดลอกลิงก์แล้ว วางในสตอรี่/โพสต์ Instagram ได้เลย"
            : "Link copied! Paste it into Instagram",
        );
      },
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.71 3.71 0 0 1-1.38-.9 3.71 3.71 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.95c-3.15 0-3.5.01-4.74.07-1.07.05-1.65.23-2.04.38-.51.2-.88.44-1.27.83-.39.39-.63.76-.83 1.27-.15.39-.33.97-.38 2.04-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.07.23 1.65.38 2.04.2.51.44.88.83 1.27.39.39.76.63 1.27.83.39.15.97.33 2.04.38 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.07-.05 1.65-.23 2.04-.38.51-.2.88-.44 1.27-.83.39-.39.63-.76.83-1.27.15-.39.33-.97.38-2.04.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.07-.23-1.65-.38-2.04a3.42 3.42 0 0 0-.83-1.27 3.42 3.42 0 0 0-1.27-.83c-.39-.15-.97-.33-2.04-.38-1.24-.06-1.59-.07-4.74-.07zm0 3.32a4.57 4.57 0 1 1 0 9.14 4.57 4.57 0 0 1 0-9.14zm0 7.54a2.97 2.97 0 1 0 0-5.94 2.97 2.97 0 0 0 0 5.94zm5.82-7.72a1.07 1.07 0 1 1-2.14 0 1.07 1.07 0 0 1 2.14 0z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium"
      >
        <Share2 className="w-4 h-4" />
        {lang === "th" ? "แชร์" : "Share"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-card border border-border rounded-2xl shadow-xl p-6 w-[340px] max-w-[90vw] flex flex-col items-center gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between w-full">
              <h3 className="font-display font-bold text-card-foreground text-lg">
                {lang === "th" ? "แชร์" : "Share"}
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground text-center font-medium">{title}</p>

            <div className="bg-card p-4 rounded-xl border border-border">
              <QRCodeSVG
                value={url}
                size={160}
                bgColor="transparent"
                fgColor="hsl(var(--foreground))"
                level="M"
              />
            </div>

            <div className="flex items-center justify-center gap-4 w-full">
              {shareTargets.map((s) =>
                s.href ? (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className={`w-12 h-12 rounded-full ${s.bg} text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md`}
                  >
                    {s.icon}
                  </a>
                ) : (
                  <button
                    key={s.name}
                    onClick={s.onClick}
                    aria-label={s.name}
                    className={`w-12 h-12 rounded-full ${s.bg} text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md`}
                  >
                    {s.icon}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={copyLink}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <LinkIcon className="w-4 h-4" />
              {lang === "th" ? "คัดลอกลิงก์" : "Copy Link"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButton;
