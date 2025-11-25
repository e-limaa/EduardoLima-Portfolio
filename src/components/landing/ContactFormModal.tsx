import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export function ContactFormModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Vamos conversar</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Preencha o formulário abaixo com seus dados e detalhes do projeto.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-zinc-300">Nome</Label>
            <Input id="name" placeholder="Seu nome" className="bg-zinc-900 border-zinc-800 text-white focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone" className="text-zinc-300">Telefone</Label>
            <Input id="phone" placeholder="(00) 00000-0000" className="bg-zinc-900 border-zinc-800 text-white focus:ring-blue-500 focus:border-blue-500" />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="company" className="text-zinc-300">Empresa</Label>
            <Input id="company" placeholder="Nome da empresa" className="bg-zinc-900 border-zinc-800 text-white focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-zinc-300">Descrição</Label>
            <Textarea id="description" placeholder="Como posso ajudar?" className="bg-zinc-900 border-zinc-800 text-white focus:ring-blue-500 focus:border-blue-500 min-h-[100px]" />
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 font-bold">
                Enviar mensagem
            </Button>
        </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
