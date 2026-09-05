import logoIcon from "@/assets/logo-icon.svg";
import lineIcon from "@/assets/line-icon.svg";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <img src={logoIcon} alt="TreeKingdom" className="w-5 h-5" />
            <span className="font-display font-semibold text-sm text-foreground">
              Tree<span className="text-primary">Kingdom</span>
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="https://line.me/ti/p/@treekingdom"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
              aria-label="LINE @treekingdom"
            >
              <img src={lineIcon} alt="LINE" className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">@treekingdom</span>
            </a>
            <a
              href="https://www.tiktok.com/@tree_kingdom"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
              aria-label="TikTok @tree_kingdom"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.94a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31z" />
              </svg>
              <span className="font-medium hidden sm:inline">@tree_kingdom</span>
            </a>
          </div>
          <p className="hidden sm:block">© 2026 TreeKingdom</p>
          <p className="sm:hidden">© 2026</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
