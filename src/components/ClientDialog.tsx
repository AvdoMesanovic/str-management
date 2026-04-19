"use client";

import { Calendar, DollarSign, Edit, Home, Mail, Phone, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import type { Client } from "@/data/mockClients";

export interface ClientEditData {
  name: string;
  email: string;
  phone: string;
  preferredContact: "email" | "phone" | "text";
  notes: string;
}

interface ClientDialogProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (clientId: string, data: ClientEditData) => void;
  onDelete?: (clientId: string) => void;
}

export function ClientDialog({ client, open, onOpenChange, onEdit, onDelete }: ClientDialogProps) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<ClientEditData>({
    name: "",
    email: "",
    phone: "",
    preferredContact: "email",
    notes: "",
  });

  useEffect(() => {
    if (client && open) {
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        preferredContact: client.preferredContact,
        notes: client.notes,
      });
      setEditing(false);
    }
  }, [client, open]);

  if (!client) return null;

  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "inactive":
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
    }
  };

  const handleSave = () => {
    onEdit?.(client.id, formData);
    setEditing(false);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${client.name}"? This action cannot be undone.`)) {
      onDelete?.(client.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-zinc-900 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {editing ? "Edit Client" : client.name}
          </DialogTitle>
        </DialogHeader>

        {editing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-client-name" className="text-zinc-300">Full Name *</Label>
              <Input
                id="edit-client-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-client-email" className="text-zinc-300">Email *</Label>
              <Input
                id="edit-client-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-client-phone" className="text-zinc-300">Phone *</Label>
              <Input
                id="edit-client-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Preferred Contact</Label>
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
              <Label htmlFor="edit-client-notes" className="text-zinc-300">Notes</Label>
              <Textarea
                id="edit-client-notes"
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
                onClick={() => setEditing(false)}
                className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()}
                className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-50"
              >
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={`border ${getStatusColor(client.status)}`}>
                {client.status.toUpperCase()}
              </Badge>
              <Badge className="border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                {client.preferredContact.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-cyan-400" />
                <div>
                  <div className="text-xs text-zinc-500">Email</div>
                  <div className="text-sm">{client.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-cyan-400" />
                <div>
                  <div className="text-xs text-zinc-500">Phone</div>
                  <div className="text-sm">{client.phone}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-xs">Total Revenue</span>
                </div>
                <div className="mt-1 text-lg">${client.totalRevenue.toLocaleString()}</div>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Home className="h-4 w-4" />
                  <span className="text-xs">Properties</span>
                </div>
                <div className="mt-1 text-lg">{client.properties.length}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
              <Calendar className="h-4 w-4 text-zinc-400" />
              <div>
                <div className="text-xs text-zinc-500">Join Date</div>
                <div className="text-sm">
                  {new Date(client.joinDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>

            {client.notes && (
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
                <div className="mb-2 text-xs text-zinc-500">Notes</div>
                <p className="text-sm text-zinc-300">{client.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
              <Button
                type="button"
                onClick={handleDelete}
                className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <Button
                type="button"
                onClick={() => setEditing(true)}
                className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
