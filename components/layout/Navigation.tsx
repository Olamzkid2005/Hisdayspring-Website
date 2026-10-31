"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useBookCartCount } from "@/hooks/useBookCartCount";
import {
  navigationLinks,
  sectionLinkIds,
  resolveActiveNav,
  topLevelLinks,
  dropdownMenuLinks,
  moreMenuLinks,
} from "./navigation/links";
import { useScrollSpy } from "./navigation/useScrollSpy";
import { useBodyScrollLock } from "./navigation/useBodyScrollLock";
import { DesktopMenu } from "./navigation/DesktopMenu";
import { MobileMenu } from "./navigation/MobileMenu";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const cartCount = useBookCartCount();
  const pathname = usePathname();
  const homeSection = useScrollSpy(sectionLinkIds, pathname === "/");
  const { activeId, moreIsActive } = resolveActiveNav(pathname, homeSection);

  useBodyScrollLock(isMobileMenuOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const navigateTo = (linkId: string) => {
    const link = navigationLinks.find((item) => item.id === linkId);
    if (link && link.href.startsWith("/") && !link.href.startsWith("/#")) {
      window.location.href = link.href;
      closeMenus();
      return;
    }
    const element = document.getElementById(linkId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else if (link) {
      window.location.href = link.href;
    }
    closeMenus();
  };

  const navigateToHref = (href: string) => {
    if (href.startsWith("/#")) {
      const element = document.getElementById(href.replace("/#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.assign(href);
      }
      closeMenus();
      return;
    }
    window.location.assign(href);
    closeMenus();
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-screen-2xl mx-auto">
          <button
            onClick={() => navigateTo("home")}
            className="flex items-center gap-2"
          >
            <Image
              src="/images/logo/Logo-Website.png"
              alt="Hisdayspring"
              width={160}
              height={40}
              className="h-10 w-auto"
            />
          </button>

          <DesktopMenu
            links={topLevelLinks}
            dropdownLinks={dropdownMenuLinks}
            moreLinks={moreMenuLinks}
            activeId={activeId}
            moreIsActive={moreIsActive}
            openDropdown={openDropdown}
            onOpenDropdown={setOpenDropdown}
            onNavigateSection={navigateTo}
            onNavigateHref={navigateToHref}
          />

          <div className="hidden lg:flex gap-3 items-center">
            {/* Book cart — visible from any page, links to the order flow. */}
            <button
              onClick={() => navigateToHref("/books")}
              className="relative p-2.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={
                cartCount > 0
                  ? `Book cart, ${cartCount} item${cartCount === 1 ? "" : "s"} — open books page`
                  : "Book cart — open books page"
              }
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 bg-secondary text-on-secondary text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center"
                  aria-hidden="true"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigateTo("giving")}
              className="bg-primary text-on-primary px-6 py-2 rounded-full font-medium hover:brightness-110 transition-all min-h-[44px] whitespace-nowrap"
            >
              Give Online
            </button>
          </div>

          <div className="lg:hidden flex items-center gap-1">
            <button
              onClick={() => navigateToHref("/books")}
              className="relative p-3 text-on-surface-variant hover:text-primary transition-colors"
              aria-label={
                cartCount > 0
                  ? `Book cart, ${cartCount} item${cartCount === 1 ? "" : "s"} — open books page`
                  : "Book cart — open books page"
              }
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span
                  className="absolute top-0.5 right-0.5 bg-secondary text-on-secondary text-[10px] font-bold rounded-full min-w-[16px] h-[16px] px-1 flex items-center justify-center"
                  aria-hidden="true"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 text-on-surface-variant hover:text-primary transition-colors relative z-50 pointer-events-auto touch-manipulation"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={topLevelLinks}
        dropdownLinks={dropdownMenuLinks}
        moreLinks={moreMenuLinks}
        activeId={activeId}
        onNavigateSection={navigateTo}
        onNavigateHref={navigateToHref}
      />
    </>
  );
}
