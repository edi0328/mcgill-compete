"use client";

import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/content/site";

type SubmitState = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full appearance-none border-0 border-b border-line bg-transparent px-0 py-3 text-base text-fg outline-none transition-colors duration-200 placeholder:text-fg-faint hover:border-fg-faint focus:border-accent focus:ring-0 disabled:opacity-60";

const inquiryOptions = [
  "General inquiry",
  "Sponsorship",
  "Event collaboration",
  "Joining the club",
  "Other",
] as const;

type InquiryType = (typeof inquiryOptions)[number];

function InquirySelect({
  value,
  onChange,
  disabled,
}: {
  value: InquiryType;
  onChange: (value: InquiryType) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const labelId = useId();
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    function closeOnOutsideClick(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open]);

  function select(next: InquiryType) {
    onChange(next);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const current = inquiryOptions.indexOf(value);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const next = (current + direction + inquiryOptions.length) % inquiryOptions.length;
      onChange(inquiryOptions[next]);
      setOpen(true);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="group relative">
      <span
        id={labelId}
        className="text-sm text-fg-muted transition-colors group-focus-within:text-fg"
      >
        Inquiry type
      </span>
      <input type="hidden" name="inquiryType" value={value} />
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        className={`contact-select-trigger mt-1 flex w-full items-center gap-3 border-b bg-transparent py-3 text-left transition-colors duration-200 disabled:opacity-60 ${
          open ? "border-accent" : "border-line hover:border-fg-faint"
        }`}
      >
        <span className="min-w-0 flex-1 truncate text-base text-fg">{value}</span>
        <ChevronDown
          size={15}
          aria-hidden="true"
          className={`text-fg-faint transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={listId}
            role="listbox"
            aria-labelledby={labelId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="panel absolute top-full right-0 left-0 z-20 mt-2 overflow-hidden p-1"
          >
            {inquiryOptions.map((option) => {
              const selected = option === value;
              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => select(option)}
                  className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-left transition-colors ${
                    selected
                      ? "bg-paper-deep text-fg"
                      : "text-fg-muted hover:bg-paper-deep hover:text-fg"
                  }`}
                >
                  <span className="flex-1 text-sm">{option}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [inquiryType, setInquiryType] = useState<InquiryType>("General inquiry");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const firstName = String(data.get("firstName") ?? "").trim();
    const lastName = String(data.get("lastName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const organization = String(data.get("organization") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = `[Website] ${inquiryType}${organization ? ` - ${organization.replace(/[\r\n]+/g, " ")}` : ""}`;
    setState("sending");

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(site.links.email)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: subject,
            _template: "table",
            _captcha: "false",
            _honey: String(data.get("_honey") ?? ""),
            name: `${firstName} ${lastName}`,
            email,
            phone: phone || "Not provided",
            organization: organization || "Not provided",
            inquiryType,
            message,
          }),
        },
      );
      const result = (await response.json()) as { success?: boolean | string };
      if (!response.ok || (result.success !== true && result.success !== "true")) {
        throw new Error("Unable to send inquiry");
      }
      form.reset();
      setInquiryType("General inquiry");
      setState("sent");
    } catch {
      setState("error");
    }
  }

  const disabled = state === "sending";

  return (
    <form
      onSubmit={handleSubmit}
      className="contact-form grid gap-x-10 gap-y-8 sm:grid-cols-2"
    >
      <label className="group block">
        <span className="text-sm text-fg-muted transition-colors group-focus-within:text-fg">
          First name*
        </span>
        <input
          className={fieldClass}
          type="text"
          name="firstName"
          autoComplete="given-name"
          maxLength={80}
          disabled={disabled}
          required
        />
      </label>

      <label className="group block">
        <span className="text-sm text-fg-muted transition-colors group-focus-within:text-fg">
          Last name*
        </span>
        <input
          className={fieldClass}
          type="text"
          name="lastName"
          autoComplete="family-name"
          maxLength={80}
          disabled={disabled}
          required
        />
      </label>

      <label className="group block">
        <span className="text-sm text-fg-muted transition-colors group-focus-within:text-fg">
          Email address*
        </span>
        <input
          className={fieldClass}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          maxLength={254}
          disabled={disabled}
          required
        />
      </label>

      <label className="group block">
        <span className="text-sm text-fg-muted transition-colors group-focus-within:text-fg">
          Phone number
        </span>
        <input
          className={fieldClass}
          type="tel"
          name="phone"
          autoComplete="tel"
          inputMode="tel"
          maxLength={40}
          disabled={disabled}
        />
      </label>

      <label className="group block">
        <span className="text-sm text-fg-muted transition-colors group-focus-within:text-fg">
          Company or organization
        </span>
        <input
          className={fieldClass}
          type="text"
          name="organization"
          autoComplete="organization"
          maxLength={120}
          disabled={disabled}
        />
      </label>

      <InquirySelect
        value={inquiryType}
        onChange={setInquiryType}
        disabled={disabled}
      />

      <label className="group block sm:col-span-2">
        <span className="text-sm text-fg-muted transition-colors group-focus-within:text-fg">
          Tell us what you&apos;d like to discuss*
        </span>
        <textarea
          className="mt-2 min-h-36 w-full appearance-none resize-y border-0 border-b border-line bg-transparent px-4 py-3 text-base leading-relaxed text-fg outline-none transition-colors duration-200 placeholder:text-fg-faint hover:border-fg-faint focus:border-accent focus:ring-0 disabled:opacity-60"
          name="message"
          placeholder="Share a few details…"
          minLength={10}
          maxLength={5000}
          disabled={disabled}
          required
        />
      </label>

      {/* Honeypot: real visitors never see or fill this field. */}
      <label className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        Website
        <input name="_honey" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="flex min-h-12 flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-end">
        <p className="text-sm text-fg-muted sm:mr-auto" role="status" aria-live="polite">
          {state === "sent" && (
            <span className="inline-flex items-center gap-2 text-ac">
              <Check size={15} /> Your message has been sent.
            </span>
          )}
          {state === "error" &&
            "We couldn't send your message. Please try again or email us directly."}
        </p>
        <button
          type="submit"
          disabled={disabled}
          className="group/button inline-flex w-full items-center justify-center gap-2 rounded border border-accent bg-accent px-5 py-3 font-mono text-[12px] text-white transition-[background-color,border-color,transform] hover:border-accent-soft hover:bg-accent-soft active:translate-y-px disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          {state === "sending" ? "submitting…" : "submit"}
          <Send
            size={15}
            className="transition-transform duration-200 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
          />
        </button>
      </div>
    </form>
  );
}
