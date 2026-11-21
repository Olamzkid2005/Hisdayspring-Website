"use client";

/**
 * The testimony form on /testimonials — the page the church QR code points
 * at. It sits above the wall of testimonies so a visitor who scanned a code
 * meets the form first.
 *
 * Nothing is posted to our server: this site has no database, so a submission
 * leaves the browser through WhatsApp (primary) or the visitor's mail client
 * (fallback). See `lib/testimony.ts` for the length strategy that keeps a long
 * testimony from arriving cut off.
 *
 * Ordering note: for a long testimony the clipboard write is *started* before
 * `window.open`. Safari refuses clipboard writes once the document loses focus,
 * and a new tab can take focus immediately, so writing after opening the tab is
 * a coin flip there.
 */

import { useCallback, useId, useState } from "react";
import { MessageCircle, Mail, Copy, Check } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useFormValidation } from "@/hooks";
import {
  TESTIMONY_BRANCHES,
  TESTIMONY_EMAIL,
  TESTIMONY_MAX_LENGTH,
  TESTIMONY_MIN_LENGTH,
  type TestimonyBranch,
} from "@/data/testimony";
import {
  buildTestimonyEmailUrl,
  planTestimonyDelivery,
  type TestimonyDelivery,
} from "@/lib/testimony";

type CopyState = "idle" | "copied" | "failed";

/** Older browsers and any non-HTTPS context have no async clipboard at all. */
function hasClipboard(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.clipboard?.writeText === "function"
  );
}

export function TestimonySection() {
  const textareaId = useId();
  const branchId = useId();
  const publishErrorId = useId();
  const counterId = `${textareaId}-counter`;
  const errorId = `${textareaId}-error`;

  const [delivery, setDelivery] = useState<TestimonyDelivery | null>(null);
  const [manualText, setManualText] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [emailUrl, setEmailUrl] = useState<string | null>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
      return true;
    } catch {
      setCopyState("failed");
      return false;
    }
  }, []);

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormValidation({
    fields: {
      name: { required: true, minLength: 2, maxLength: 120 },
      phone: {
        maxLength: 40,
        // Optional, but a reachable number if one is given: this is the field
        // the testimony team will use to call back.
        pattern: /^[+()\d\s-]{6,40}$/,
        customMessage: "Enter a phone number we can reach you on, or leave it blank",
      },
      branch: {},
      sharePublicly: { required: true },
      testimony: {
        required: true,
        minLength: TESTIMONY_MIN_LENGTH,
        maxLength: TESTIMONY_MAX_LENGTH,
      },
    },
    onSubmit: (values) => {
      const submission = {
        name: values.name,
        phone: values.phone,
        branch: (values.branch as TestimonyBranch | "") ?? "",
        publish: values.sharePublicly === "yes",
        testimony: values.testimony,
      };

      const plan = planTestimonyDelivery(submission);

      setDelivery(plan);
      setEmailUrl(buildTestimonyEmailUrl(submission));
      setCopyState("idle");
      setManualText(null);

      if (plan.mode === "direct") {
        window.open(plan.url, "_blank", "noopener,noreferrer");
        return;
      }

      // Long testimony. Without a clipboard there is no way to move the text
      // into WhatsApp, so do not open a chat that would arrive empty — show the
      // text to copy by hand instead.
      if (!hasClipboard()) {
        setManualText(plan.message);
        return;
      }

      // Start the write first, while this document still has focus.
      void copy(plan.message).then((copied) => {
        // If the write failed, WhatsApp already opened with only the header —
        // so surface the text for a manual paste rather than leaving the
        // sender to wonder why the chat is empty.
        if (!copied) setManualText(plan.message);
      });
      window.open(plan.url, "_blank", "noopener,noreferrer");
    },
  });

  const clearResult = () => {
    setDelivery(null);
    setManualText(null);
    setEmailUrl(null);
    setCopyState("idle");
  };

  /**
   * Editing after a submission invalidates what was built: the "Open WhatsApp"
   * link in the result panel still carries the previous text, so someone who
   * fixes a typo and then taps it sends the version they just corrected. Any
   * edit clears the panel instead.
   */
  const changeField = (event: Parameters<typeof handleChange>[0]) => {
    clearResult();
    handleChange(event);
  };

  const changeValue = (field: Parameters<typeof setFieldValue>[0], value: string) => {
    clearResult();
    setFieldValue(field, value);
  };

  const reset = () => {
    resetForm();
    clearResult();
  };

  const remaining = TESTIMONY_MAX_LENGTH - values.testimony.length;

  return (
    <section
      id="testify"
      className="pt-8 md:py-20 pb-12 px-4 md:px-8 bg-surface scroll-mt-24"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6 md:mb-10">
          <MessageCircle
            className="text-primary w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-6"
            aria-hidden="true"
          />
          <h2 className="font-headline text-2xl md:text-4xl font-bold text-on-surface mb-2 md:mb-4">
            Share your testimony
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant max-w-xl mx-auto">
            Tell us what God has done.
          </p>
          <a
            href="#testimonials"
            className="mt-3 md:mt-4 inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-primary underline"
          >
            Read others&rsquo; testimonies
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 rounded-3xl bg-surface-container-lowest p-5 md:p-10 shadow-sm border border-outline-variant/20"
        >
          <Input
            label="Your name"
            name="name"
            value={values.name}
            onChange={changeField}
            error={errors.name}
            required
            autoComplete="name"
            placeholder="Grace O."
          />
          <Input
            label="Phone (optional)"
            name="phone"
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={changeField}
            error={errors.phone}
            autoComplete="tel"
            placeholder="+234 800 000 0000"
          />

          <div className="w-full">
            <label
              htmlFor={branchId}
              className="block text-xs font-bold uppercase tracking-wider text-outline mb-1"
            >
              Branch (optional)
            </label>
            <select
              id={branchId}
              name="branch"
              value={values.branch}
              onChange={(event) => changeValue("branch", event.target.value)}
              className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-secondary outline-none p-4 rounded-lg transition-all duration-200"
            >
              <option value="">Prefer not to say</option>
              {TESTIMONY_BRANCHES.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <fieldset
            className="w-full"
            aria-invalid={errors.sharePublicly ? "true" : undefined}
            aria-describedby={errors.sharePublicly ? publishErrorId : undefined}
          >
            <legend className="block text-xs font-bold uppercase tracking-wider text-outline mb-2">
              May we share this publicly?
              <span className="text-error ml-1" aria-hidden="true">
                *
              </span>
            </legend>
            <div className="flex flex-wrap gap-3">
              {(
                [
                  { value: "yes", label: "Yes, share it" },
                  { value: "no", label: "No, keep it private" },
                ] as const
              ).map((option, index) => (
                <label
                  key={option.value}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 cursor-pointer transition-colors ${
                    values.sharePublicly === option.value
                      ? "bg-secondary text-on-secondary"
                      : "bg-surface-container-low text-on-surface"
                  }`}
                >
                  <input
                    type="radio"
                    name="sharePublicly"
                    value={option.value}
                    checked={values.sharePublicly === option.value}
                    // Grouping `required` on the first radio makes the whole
                    // group required natively, so assistive technology announces
                    // it instead of leaving an unmarked set of options.
                    required={index === 0}
                    onChange={(event) =>
                      changeValue("sharePublicly", event.target.value)
                    }
                    className="h-4 w-4 accent-secondary"
                  />
                  <span className="text-sm font-semibold">{option.label}</span>
                </label>
              ))}
            </div>
            {errors.sharePublicly && (
              <p id={publishErrorId} className="mt-2 text-sm text-error" role="alert">
                Please choose whether we may share your testimony publicly.
              </p>
            )}
          </fieldset>

          <div className="w-full md:col-span-2">
            <label
              htmlFor={textareaId}
              className="block text-xs font-bold uppercase tracking-wider text-outline mb-1"
            >
              Your testimony
              <span className="text-error ml-1" aria-hidden="true">
                *
              </span>
            </label>
            <textarea
              id={textareaId}
              name="testimony"
              rows={8}
              value={values.testimony}
              onChange={changeField}
              maxLength={TESTIMONY_MAX_LENGTH}
              required
              aria-invalid={errors.testimony ? "true" : undefined}
              aria-describedby={
                [counterId, errors.testimony ? errorId : null]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              placeholder="What did God do? Where were you, what changed, and how can we pray with you?"
              className={`w-full bg-surface-container-low border-b-2 border-transparent focus:border-secondary outline-none p-4 rounded-lg transition-all duration-200 resize-y placeholder:text-on-surface-variant/80 ${
                errors.testimony ? "border-error focus:border-error" : ""
              }`}
            />
            <div className="mt-1.5 flex items-start justify-between gap-4">
              {errors.testimony ? (
                <p id={errorId} className="text-sm text-error" role="alert">
                  {errors.testimony}
                </p>
              ) : (
                <span />
              )}
              <p
                id={counterId}
                className={`text-sm shrink-0 ${
                  remaining <= 100 ? "text-error" : "text-on-surface-variant"
                }`}
              >
                {values.testimony.length}/{TESTIMONY_MAX_LENGTH}
              </p>
            </div>
          </div>

          <div className="w-full md:col-span-2">
            <Button type="submit" size="lg" variant="primary">
              <MessageCircle className="w-5 h-5 mr-2" aria-hidden="true" />
              Send by WhatsApp
            </Button>
          </div>
        </form>

        {delivery && (
          <div className="mt-6 rounded-2xl bg-surface-container-high p-5 text-on-surface">
            <p role="status" className="text-sm md:text-base">
              {manualText ? (
                copyState === "failed" ? (
                  <>
                    <span className="font-bold">
                      WhatsApp is open, but your testimony did not copy.
                    </span>{" "}
                    Select the text below, copy it, then paste it into the chat and
                    send.
                  </>
                ) : (
                  <>
                    <span className="font-bold">Copy your testimony by hand.</span>{" "}
                    Select the text below, copy it, then open WhatsApp and paste it
                    into the chat.
                  </>
                )
              ) : delivery.mode === "clipboard" ? (
                <>
                  <span className="font-bold">WhatsApp is open.</span> {delivery.hint}
                </>
              ) : (
                <>
                  <span className="font-bold">WhatsApp is open</span> with your
                  testimony already typed in. Just tap Send.
                </>
              )}
            </p>

            {manualText && (
              <textarea
                readOnly
                value={manualText}
                rows={8}
                aria-label="Your testimony, ready to copy"
                onFocus={(event) => event.currentTarget.select()}
                className="mt-4 w-full rounded-lg bg-surface-container-lowest p-4 text-sm"
              />
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={delivery.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-primary underline"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                Open WhatsApp
              </a>

              {delivery.mode === "clipboard" && !manualText && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void copy(delivery.message)}
                >
                  {copyState === "copied" ? (
                    <Check className="w-4 h-4 mr-2" aria-hidden="true" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" aria-hidden="true" />
                  )}
                  {copyState === "copied" ? "Copied" : "Copy testimony again"}
                </Button>
              )}

              {emailUrl && (
                <a
                  href={emailUrl}
                  className="inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-primary underline"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  Send by email instead ({TESTIMONY_EMAIL})
                </a>
              )}

              <Button type="button" variant="ghost" size="sm" onClick={reset}>
                Write another
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
