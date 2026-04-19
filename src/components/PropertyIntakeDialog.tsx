"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import type { Client } from "@/data/mockClients";

export interface PropertyIntakeData {
  name: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  clientId: string;
  notes: string;
}

interface PropertyIntakeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PropertyIntakeData) => void;
  clients: Client[];
}

const emptyForm: PropertyIntakeData = {
  name: "",
  address: "",
  bedrooms: 1,
  bathrooms: 1,
  clientId: "",
  notes: "",
};

export function PropertyIntakeDialog({ open, onOpenChange, onSubmit, clients }: PropertyIntakeDialogProps) {
  const [formData, setFormData] = useState<PropertyIntakeData>(emptyForm);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClientName, setSelectedClientName] = useState("");

  const clientResults = useMemo(() => {
    const q = clientSearch.trim().toLowerCase();
    if (!q) return [];
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    );
  }, [clientSearch, clients]);

  const showResults = clientSearch.trim().length > 0;
  const isValid = formData.name.trim() && formData.address.trim() && formData.clientId;

  const handleClientSelect = (client: Client) => {
    setFormData({ ...formData, clientId: client.id });
    setSelectedClientName(client.name);
    setClientSearch("");
  };

  const handleClearClient = () => {
    setFormData({ ...formData, clientId: "" });
    setSelectedClientName("");
    setClientSearch("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit(formData);
    onOpenChange(false);
    setFormData(emptyForm);
    setSelectedClientName("");
    setClientSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-zinc-900 text-white sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Property Intake</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Add a new property to the management system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="property-name" className="text-zinc-300">Property Name *</Label>
            <Input
              id="property-name"
              placeholder="e.g., 63139 Dogtown House A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="property-address" className="text-zinc-300">Address *</Label>
            <Input
              id="property-address"
              placeholder="1234 Main St, St. Louis, MO 63139"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms" className="text-zinc-300">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                min="1"
                value={formData.bedrooms}
                onChange={(e) =>
                  setFormData({ ...formData, bedrooms: Number.parseInt(e.target.value, 10) || 1 })
                }
                className="border-zinc-700 bg-zinc-950 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms" className="text-zinc-300">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                min="1"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) =>
                  setFormData({ ...formData, bathrooms: Number.parseFloat(e.target.value) || 1 })
                }
                className="border-zinc-700 bg-zinc-950 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Client *</Label>
            {selectedClientName ? (
              <div className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/10 text-xs text-cyan-400">
                  {selectedClientName.charAt(0)}
                </div>
                <span className="flex-1 text-sm text-white">{selectedClientName}</span>
                <button
                  type="button"
                  onClick={handleClearClient}
                  className="text-zinc-500 hover:text-zinc-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  placeholder="Search clients by name or email..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="border-zinc-700 bg-zinc-950 pl-9 text-white placeholder:text-zinc-500"
                />
                {showResults && clientResults.length > 0 && (
                  <div className="absolute top-full z-50 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl">
                    {clientResults.map((client) => (
                      <button
                        type="button"
                        key={client.id}
                        onClick={() => handleClientSelect(client)}
                        className="flex w-full items-center gap-3 border-b border-zinc-800 px-3 py-2 text-left transition-colors last:border-b-0 hover:bg-zinc-800"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/10 text-xs text-cyan-400">
                          {client.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-white">{client.name}</div>
                          <div className="text-xs text-zinc-500">{client.email}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {showResults && clientResults.length === 0 && (
                  <div className="absolute top-full z-50 mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-center text-sm text-zinc-500">
                    No clients found
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-zinc-300">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional information about the property..."
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
              disabled={!isValid}
              className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-50"
            >
              Add Property
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
