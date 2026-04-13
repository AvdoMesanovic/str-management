"use client";

import { Calendar, DollarSign, Home, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Client } from "@/data/mockClients";

interface ClientDialogProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientDialog({ client, open, onOpenChange }: ClientDialogProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-zinc-900 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">{client.name}</DialogTitle>
        </DialogHeader>

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
        </div>
      </DialogContent>
    </Dialog>
  );
}
