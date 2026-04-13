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
import { Textarea } from "@/components/ui/textarea";

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
}

const emptyForm: PropertyIntakeData = {
  name: "",
  address: "",
  bedrooms: 1,
  bathrooms: 1,
  clientId: "",
  notes: "",
};

export function PropertyIntakeDialog({ open, onOpenChange, onSubmit }: PropertyIntakeDialogProps) {
  const [formData, setFormData] = useState<PropertyIntakeData>(emptyForm);

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
            <Label htmlFor="client-id" className="text-zinc-300">Client ID</Label>
            <Input
              id="client-id"
              placeholder="Client identifier or email"
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
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
              className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
            >
              Add Property
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
