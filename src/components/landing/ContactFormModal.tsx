import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input, Button, Label, Textarea } from "@antigravity/ds";
import { useLanguage } from "../language-provider";

export function ContactFormModal({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{t("contact.dialog.title")}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {t("contact.dialog.desc")}
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-zinc-300">{t("contact.form.name")}</Label>
            <Input id="name" name="name" autoComplete="name" placeholder={t("contact.form.namePlaceholder")} className="bg-zinc-900 border-zinc-800 text-white focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone" className="text-zinc-300">{t("contact.form.phone")}</Label>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" className="bg-zinc-900 border-zinc-800 text-white focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company" className="text-zinc-300">{t("contact.form.company")}</Label>
            <Input id="company" name="company" autoComplete="organization" placeholder={t("contact.form.companyPlaceholder")} className="bg-zinc-900 border-zinc-800 text-white focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-zinc-300">{t("contact.form.desc")}</Label>
            <Textarea id="description" name="description" placeholder={t("contact.form.descPlaceholder")} className="bg-zinc-900 border-zinc-800 text-white focus:ring-blue-500 focus:border-blue-500 min-h-[100px]" />
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 font-bold">
              {t("contact.form.submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
