import React, { useState } from "react";
import posthog from "posthog-js";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
  toast,
} from "@limia/design-system";
import { useLanguage } from "../language-provider";
import { ApiError, sendContactMessage } from "../../lib/portfolio-api";

const emptyForm = { name: "", email: "", phone: "", company: "", message: "" };

export function ContactFormModal({
  children,
  initialMessage,
}: {
  children: React.ReactNode;
  /** Pre-fills an empty message, e.g. when opened from a service card. */
  initialMessage?: string;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isSending, setIsSending] = useState(false);
  const [reachError, setReachError] = useState(false);

  const update = (field: keyof typeof emptyForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      if (field === "email" || field === "phone") setReachError(false);
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSending) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      company: form.company.trim() || undefined,
      message: form.message.trim(),
    };
    if (!payload.email && !payload.phone) {
      setReachError(true);
      return;
    }

    setIsSending(true);
    try {
      await sendContactMessage(payload);
      posthog.capture("Contact Form Sent");
      toast.success(t("contact.toast.successTitle"), {
        description: t("contact.toast.successDesc"),
      });
      setForm(emptyForm);
      setOpen(false);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error sending contact message:", error);
      }
      const status = error instanceof ApiError ? error.status : 0;
      posthog.capture("Contact Form Failed", { status });
      toast.error(t("contact.toast.errorTitle"), {
        description: t(status === 429 ? "contact.toast.rateLimitDesc" : "contact.toast.errorDesc"),
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next && initialMessage) {
          setForm((current) => (current.message.trim() ? current : { ...current, message: initialMessage }));
        }
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="border-border/70 bg-popover text-popover-foreground sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("contact.dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("contact.dialog.desc")}
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="name">{t("contact.form.name")}</Label>
            <Input id="name" name="name" required maxLength={120} autoComplete="name" value={form.name} onChange={update("name")} placeholder={t("contact.form.namePlaceholder")} className="h-11 bg-input-background" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{t("contact.form.email")}</Label>
            <Input id="email" name="email" type="email" maxLength={254} autoComplete="email" value={form.email} onChange={update("email")} placeholder={t("contact.form.emailPlaceholder")} aria-describedby={reachError ? "contact-reach-error" : undefined} aria-invalid={reachError || undefined} className="h-11 bg-input-background" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">{t("contact.form.phone")}</Label>
            <Input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" value={form.phone} onChange={update("phone")} placeholder="(00) 00000-0000" aria-describedby={reachError ? "contact-reach-error" : undefined} aria-invalid={reachError || undefined} className="h-11 bg-input-background" />
          </div>
          {reachError && (
            <p id="contact-reach-error" role="alert" className="-mt-2 text-sm text-destructive">
              {t("contact.form.reachRequired")}
            </p>
          )}
          <div className="grid gap-2">
            <Label htmlFor="company">{t("contact.form.company")}</Label>
            <Input id="company" name="company" maxLength={120} autoComplete="organization" value={form.company} onChange={update("company")} placeholder={t("contact.form.companyPlaceholder")} className="h-11 bg-input-background" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">{t("contact.form.desc")}</Label>
            <Textarea id="description" name="description" required maxLength={4000} value={form.message} onChange={update("message")} placeholder={t("contact.form.descPlaceholder")} className="min-h-[100px] bg-input-background" />
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" className="w-full" disabled={isSending} aria-busy={isSending}>
              {isSending ? t("contact.form.sending") : t("contact.form.submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
