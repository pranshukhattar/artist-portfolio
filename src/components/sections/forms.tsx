"use client";

import { useId, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { arrowNudge, button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * UI-only submit. TODO: replace the timeout with a Server Action once an
 * email / newsletter provider is chosen.
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
  if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
}

const field =
  "w-full border-0 border-b border-paper/55 bg-transparent py-3 text-base text-paper placeholder:text-paper/70 transition-colors focus:border-paper focus:outline-none aria-[invalid=true]:border-paper";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-paper">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-paper" />
      {message}
    </p>
  );
}

function Success({ title, body }: { title: string; body: string }) {
  return (
    <div role="status" className="rounded-2xl bg-ink/15 p-6 ring-1 ring-paper/25">
      <p className="font-display text-2xl tracking-[-0.02em]">{title}</p>
      <p className="mt-1 text-sm opacity-80">{body}</p>
    </div>
  );
}

export function MailingList() {
  const id = useId();
  const { status, submit } = useStubSubmit();
  const [error, setError] = useState<string>();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!EMAIL.test(email)) {
      setError(email ? "That email doesn't look right." : "Enter your email to join.");
      focusFirstInvalid(e.currentTarget, { email: "invalid" });
      return;
    }
    setError(undefined);
    await submit();
  };

  if (status === "success") return <Success title="You're on the list." body="New music, shows and the occasional voice note — straight to your inbox." />;

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-xl">
      <label htmlFor={`${id}-email`} className="label opacity-95">
        Join the mailing list
      </label>
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="your@email.com"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={field}
        />
        <button type="submit" disabled={status === "submitting"} className={button("onRed", "shrink-0 disabled:opacity-70")}>
          {status === "submitting" ? "Joining…" : "Join mailing list"}
          <Icon name="arrowRight" size={18} className={arrowNudge} />
        </button>
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </form>
  );
}

const ENQUIRIES = ["Booking", "Press", "Collaboration", "Other"];

export function ContactForm() {
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
    if (get("message").length < 10) next.message = "A few more words, please (10+ characters).";
    setErrors(next);
    if (Object.keys(next).length) return focusFirstInvalid(e.currentTarget, next);
    await submit();
  };

  if (status === "success") return <Success title="Message sent." body="Thanks for reaching out — expect a reply within a few days." />;

  const describe = (name: string) => (errors[name] ? `${id}-${name}-error` : undefined);

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 md:grid-cols-2">
      <div>
        <label htmlFor={`${id}-name`} className="label opacity-95">
          Name
        </label>
        <input id={`${id}-name`} name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={describe("name")} className={field} />
        <FieldError id={`${id}-name-error`} message={errors.name} />
      </div>
      <div>
        <label htmlFor={`${id}-email`} className="label opacity-95">
          Email
        </label>
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" inputMode="email" aria-invalid={!!errors.email} aria-describedby={describe("email")} className={field} />
        <FieldError id={`${id}-email-error`} message={errors.email} />
      </div>
      <fieldset className="md:col-span-2">
        <legend className="label opacity-95">Enquiry</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {ENQUIRIES.map((type, i) => (
            <label key={type} className="cursor-pointer">
              <input type="radio" name="type" value={type} defaultChecked={i === 0} className="peer sr-only" />
              <span className="inline-flex h-10 items-center rounded-full px-4 text-[13px] ring-1 ring-paper/60 transition-colors peer-checked:bg-paper peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-paper hover:ring-paper">
                {type}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="md:col-span-2">
        <label htmlFor={`${id}-message`} className="label opacity-95">
          Message
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={4}
          aria-invalid={!!errors.message}
          aria-describedby={describe("message")}
          className={`${field} resize-none`}
          data-lenis-prevent
        />
        <FieldError id={`${id}-message-error`} message={errors.message} />
      </div>
      <div className="md:col-span-2">
        <button type="submit" disabled={status === "submitting"} className={button("onRed", "disabled:opacity-70")}>
          {status === "submitting" ? "Sending…" : "Send message"}
          <Icon name="arrowRight" size={18} className={arrowNudge} />
        </button>
      </div>
    </form>
  );
}
