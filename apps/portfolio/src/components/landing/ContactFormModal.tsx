import React from "react";
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
} from "@limia/design-system";
import { useLanguage } from "../language-provider";

export function ContactFormModal({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();

  return (
    <Dialog>
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
        <form className="grid gap-4 py-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-2">
            <Label htmlFor="name">{t("contact.form.name")}</Label>
            <Input id="name" name="name" autoComplete="name" placeholder={t("contact.form.namePlaceholder")} className="h-11 bg-input-background" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">{t("contact.form.phone")}</Label>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" className="h-11 bg-input-background" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">{t("contact.form.company")}</Label>
            <Input id="company" name="company" autoComplete="organization" placeholder={t("contact.form.companyPlaceholder")} className="h-11 bg-input-background" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">{t("contact.form.desc")}</Label>
            <Textarea id="description" name="description" placeholder={t("contact.form.descPlaceholder")} className="min-h-[100px] bg-input-background" />
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" className="w-full">
              {t("contact.form.submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

