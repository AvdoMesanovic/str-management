"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface ClientIntakeData {
  name: string;
  email: string;
  phone: string;
  preferredContact: "email" | "phone" | "text";
  notes: string;
}

interface ClientIntakeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClientIntakeData) => void;
}

const emptyForm: ClientIntakeData = {
  name: "",
  email: "",
  phone: "",
  preferredContact: "email",
  notes: "",
};

export function ClientIntakeDialog({ open, onOpenChange, onSubmit }: ClientIntakeDialogProps) {
  const [formData, setFormData] = useState<ClientIntakeData>(emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
    setFormData(emptyForm);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-zinc-900 text-white sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Client Intake</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Add a new client to the management system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client-name" className="text-zinc-300">Full Name *</Label>
            <Input
              id="client-name"
              placeholder="e.g., John Smith"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-email" className="text-zinc-300">Email Address *</Label>
            <Input
              id="client-email"
              type="email"
              placeholder="client@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-phone" className="text-zinc-300">Phone Number *</Label>
            <Input
              id="client-phone"
              type="tel"
              placeholder="(314) 555-0123"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred-contact" className="text-zinc-300">Preferred Contact Method</Label>
            <Select
              value={formData.preferredContact}
              onValueChange={(value: "email" | "phone" | "text") =>
                setFormData({ ...formData, preferredContact: value })
              }
            >
              <SelectTrigger className="border-zinc-700 bg-zinc-950 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-zinc-700 bg-zinc-900 text-white">
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-notes" className="text-zinc-300">Notes</Label>
            <Textarea
              id="client-notes"
              placeholder="Additional information about the client..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            >
              Add Client
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
