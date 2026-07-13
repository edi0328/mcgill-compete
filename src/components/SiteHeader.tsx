"use client";

import { TransitionLink as Link } from "@/components/TransitionLink";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ThemeToggle } from "@/components/ThemeToggle";

const nav = [
  { href: "/", label: "home" },
  { href: "/schedule", label: "schedule" },
  { href: "/resources", label: "resources" },
  { href: "/templates", label: "templates" },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/* Hide-on-scroll thresholds: the header retracts only after this much
   accumulated same-direction travel, so tiny scroll jitter never moves it.
   Reveal is more eager than hide, and never within HOME_ZONE of the top. */
const HIDE_AFTER = 12;
const REVEAL_AFTER = -8;
const HOME_ZONE = 96;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const travel = useRef(0);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (raw) => {
    // Clamp: iOS rubber-banding reports negative positions.
    const y = Math.max(0, raw);
    const delta = y - Math.max(0, scrollY.getPrevious() ?? y);
    setScrolled(y > 8);
    if (reduced || open) {
      setHidden(false);
      travel.current = 0;
      return;
    }
    if (Math.sign(delta) !== Math.sign(travel.current)) travel.current = 0;
    travel.current += delta;
    if (y < HOME_ZONE) setHidden(false);
    else if (travel.current > HIDE_AFTER) setHidden(true);
    else if (travel.current < REVEAL_AFTER) setHidden(false);
  });

  // Every navigation closes the menu and reveals the header, so back/forward
  // never lands on a page with the nav retracted. Adjusted during render
  // (not in an effect) so the old state never paints.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
    setHidden(false);
  }

  // Scroll restoration can land mid-page before any scroll event fires.
  useEffect(() => {
    const id = requestAnimationFrame(() => setScrolled(window.scrollY > 8));
    return () => cancelAnimationFrame(id);
  }, []);

  // Escape closes the menu and hands focus back to the toggle button.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className="site-header sticky top-0 z-50"
      data-scrolled={scrolled || open || undefined}
      data-hidden={hidden || undefined}
    >
      <ScrollProgress />
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded font-display text-sm tracking-tight"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cp-logo.png"
            alt=""
            className="h-5 w-5"
            aria-hidden="true"
          />
          <span>
            compete<span className="text-accent">::</span>mcgill
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <nav className="flex items-center gap-1" aria-label="Main">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link relative rounded px-3 py-1.5 font-mono text-[13px] whitespace-nowrap transition-colors ${
                    active
                      ? "text-fg"
                      : "text-fg-muted hover:text-fg focus-visible:text-fg"
                  }`}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden="true"
                      className="absolute inset-x-3 bottom-0.5 h-px bg-accent"
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="nav-underline absolute inset-x-3 bottom-0.5 h-px bg-fg-faint"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            className="rounded p-2 text-fg-muted transition-colors hover:text-fg focus-visible:text-fg"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {/* Both icons stay mounted, stacked — the swap crossfades with a
                quarter turn and the button never changes size. */}
            <span className="relative block h-[18px] w-[18px]">
              <Menu
                size={18}
                className={`absolute inset-0 motion-safe:transition-[opacity,transform] motion-safe:duration-150 ${
                  open ? "-rotate-90 opacity-0" : "rotate-0 opacity-100"
                }`}
              />
              <X
                size={18}
                className={`absolute inset-0 motion-safe:transition-[opacity,transform] motion-safe:duration-150 ${
                  open ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            aria-label="Main mobile"
            className="overflow-hidden md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            // MotionConfig reducedMotion="user" doesn't cover height
            // animations, so the duration is zeroed by hand.
            transition={{ duration: reduced ? 0 : 0.2, ease: "easeOut" }}
          >
            <div className="border-t border-line px-4 py-2">
              {nav.map((item, i) => {
                const active = isActive(pathname, item.href);
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: reduced ? 0 : Math.min(i * 0.07, 0.21),
                      duration: reduced ? 0 : 0.2,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded px-2 py-2 font-mono text-sm ${
                        active ? "text-fg" : "text-fg-muted"
                      }`}
                    >
                      {active && <span className="text-accent">:: </span>}
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
