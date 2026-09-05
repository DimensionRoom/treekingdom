import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X, Globe, Sparkles, ShieldCheck } from "lucide-react";
import { useState } from "react";
import logoIcon from "@/assets/logo-icon.svg";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/plants", label: t("nav.plants") },
    { to: "/categories", label: t("nav.categories") },
    { to: "/personality", label: t("nav.personality") },
    { to: "/lucky", label: t("nav.lucky"), highlight: true },
  ];

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b-2 border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logoIcon} alt="TreeKingdom" className="w-9 h-9 group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-display font-bold text-xl text-foreground">
            Tree<span className="text-primary">Kingdom</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {links.map((link) => {
            const active = isActive(link.to);
            const isHighlight = "highlight" in link && link.highlight;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all inline-flex items-center gap-1.5 ${
                  active
                    ? isHighlight
                      ? "bg-accent text-accent-foreground shadow-md"
                      : "bg-primary text-primary-foreground shadow-md"
                    : isHighlight
                      ? "text-accent-foreground bg-accent/15 hover:bg-accent/25"
                      : "text-foreground hover:bg-muted hover:text-primary"
                }`}
              >
                {isHighlight && <Sparkles className="w-3.5 h-3.5" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user && (
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors text-xs font-semibold border border-border"
              title="Admin"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
          <button
            onClick={() => setLang(lang === "th" ? "en" : "th")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors text-sm font-semibold border border-border"
          >
            <Globe className="w-4 h-4" />
            {lang === "th" ? "TH" : "EN"}
          </button>

          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-card border-b-2 border-border px-4 py-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block font-semibold py-2.5 px-4 rounded-xl transition-colors ${
                isActive(link.to) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
