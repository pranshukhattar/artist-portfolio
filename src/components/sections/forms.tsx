"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { arrowNudge, button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * UI-only submit. TODO: replace the timeout with a Server Action once an
 * email provider is chosen.
 */
function useStubSubmit() {
  const [status, setStatus] = useState<Status>("idle");
  const submit = async () => {
    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("success");
  };
  return { status, setStatus, submit };
}

function focusFirstInvalid(form: HTMLFormElement, errors: Errors) {
  const first = Object.keys(errors)[0];
  if (!first) return;
  const el = form.elements.namedItem(first);
  // A group of radios comes back as a list: focus its first option.
  if (el instanceof RadioNodeList) (el[0] as HTMLElement | undefined)?.focus();
  else (el as HTMLElement | null)?.focus();
}

// Light boxes on the paper card: plainly a place to type.
const field =
  "block h-12 w-full rounded-xl border-0 bg-paper-hi px-4 text-[15px] text-ink ring-1 ring-ink/12 placeholder:text-ink/35 transition-[box-shadow] duration-200 hover:ring-ink/30 focus:ring-2 focus:ring-ink focus:outline-none aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red";

function Label({ htmlFor, children, optional = false }: { htmlFor: string; children: string; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium">
      {children}
      {optional && <span className="font-normal text-ink/45"> · optional</span>}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-red-deep">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-red" />
      {message}
    </p>
  );
}

/**
 * The booking card: a paper ticket on the red. A perforated line with two notches
 * (cut in the section's own red) separates the details from the send button.
 */
function Ticket({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-[28px] bg-paper p-6 text-ink shadow-[0_1px_2px_rgba(0,0,0,0.18),0_12px_24px_-8px_rgba(0,0,0,0.25),0_40px_80px_-24px_rgba(0,0,0,0.45)] sm:p-10">
      {children}
    </div>
  );
}

function Perforation() {
  return (
    <div aria-hidden="true" className="relative -mx-6 my-8 sm:-mx-10">
      <span className="block border-t-2 border-dashed border-ink/15" />
      {/* Only the half inside the card is drawn, so the card's shadow outside can't show a seam. */}
      <span className="absolute top-1/2 left-0 h-6 w-3 -translate-y-1/2 rounded-r-full bg-red-deep" />
      <span className="absolute top-1/2 right-0 h-6 w-3 -translate-y-1/2 rounded-l-full bg-red-deep" />
    </div>
  );
}

const EVENT_TYPES = ["Club night", "Festival", "Private event", "Brand / corporate", "Other"];

/** A plain booking request: who, when, where, and a few words about the event. */
export function BookingForm() {
  const id = useId();
  const { status, submit } = useStubSubmit();
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    const next: Errors = {};
    if (!get("name")) next.name = "Tell us your name.";
    if (!EMAIL.test(get("email"))) next.email = get("email") ? "That email doesn't look right." : "Add an email so we can reply.";
    if (!get("date")) next.date = "Pick the date of the event.";
    else if (new Date(`${get("date")}T23:59`) < new Date()) next.date = "That date has already passed.";
    if (!get("type")) next.type = "Choose the kind of event.";
    setErrors(next);
    if (Object.keys(next).length) return focusFirstInvalid(e.currentTarget, next);
    await submit();
  };

  if (status === "success") {
    return (
      <Ticket>
        <div role="status" className="py-6 text-center sm:py-10">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-ink text-paper">
            <Icon name="music" size={24} />
          </span>
          <p className="mt-6 font-display text-[clamp(28px,3vw,40px)] leading-none tracking-[-0.03em]">Request sent.</p>
          <p className="mx-auto mt-3 max-w-xs text-[15px] text-ink/65">Thanks — we&apos;ll check the date and reply within a few days.</p>
        </div>
      </Ticket>
    );
  }

  const describe = (name: string) => (errors[name] ? `${id}-${name}-error` : undefined);

  return (
    <Ticket>
      <form onSubmit={onSubmit} noValidate>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <p className="label text-ink/50">Booking request</p>
            <h3 className="mt-2 font-display text-[clamp(26px,2.6vw,36px)] leading-none tracking-[-0.035em]">Tell us about the show</h3>
          </div>
          <p className="text-[13px] text-ink/50">Takes about a minute</p>
        </div>

        <div className="mt-8 grid gap-x-4 gap-y-5 sm:grid-cols-2">
          <div>
            <Label htmlFor={`${id}-name`}>Name</Label>
            <input id={`${id}-name`} name="name" autoComplete="name" placeholder="Your name" aria-invalid={!!errors.name} aria-describedby={describe("name")} className={field} />
            <FieldError id={`${id}-name-error`} message={errors.name} />
          </div>
          <div>
            <Label htmlFor={`${id}-email`}>Email</Label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={describe("email")}
              className={field}
            />
            <FieldError id={`${id}-email-error`} message={errors.email} />
          </div>
          <div>
            <Label htmlFor={`${id}-date`}>Event date</Label>
            <input id={`${id}-date`} name="date" type="date" aria-invalid={!!errors.date} aria-describedby={describe("date")} className={field} />
            <FieldError id={`${id}-date-error`} message={errors.date} />
          </div>
          <div>
            <Label htmlFor={`${id}-phone`} optional>
              Phone
            </Label>
            <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" className={field} />
          </div>

          {/* Event type: chips rather than a dropdown, so every option is visible at once. */}
          <fieldset className="sm:col-span-2" aria-describedby={describe("type")}>
            <legend className="mb-2 block text-[13px] font-medium">Type of event</legend>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((type) => (
                <label key={type} className="cursor-pointer">
                  <input type="radio" name="type" value={type} className="peer sr-only" />
                  <span className="inline-flex h-10 items-center rounded-full bg-paper-hi px-4 text-[14px] ring-1 ring-ink/12 transition-[background-color,color,box-shadow] duration-200 select-none peer-checked:bg-ink peer-checked:text-paper peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-red hover:ring-ink/35">
                    {type}
                  </span>
                </label>
              ))}
            </div>
            <FieldError id={`${id}-type-error`} message={errors.type} />
          </fieldset>

          <div className="sm:col-span-2">
            <Label htmlFor={`${id}-venue`} optional>
              City / venue
            </Label>
            <input id={`${id}-venue`} name="venue" autoComplete="address-level2" placeholder="e.g. Mumbai, Bandra" className={field} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor={`${id}-message`} optional>
              About the event
            </Label>
            <textarea
              id={`${id}-message`}
              name="message"
              rows={3}
              placeholder="Set length, expected crowd, budget…"
              className={`${field} h-auto resize-none py-3`}
              data-lenis-prevent
            />
          </div>
        </div>

        <Perforation />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-ink/55">We reply within a few days.</p>
          <button type="submit" disabled={status === "submitting"} className={button("ink", "h-12 px-6 disabled:opacity-70")}>
            {status === "submitting" ? "Sending…" : "Send booking request"}
            <Icon name="arrowRight" size={18} className={arrowNudge} />
          </button>
        </div>
      </form>
    </Ticket>
  );
}
