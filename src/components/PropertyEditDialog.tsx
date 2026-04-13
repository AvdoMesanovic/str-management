"use client";

import { useEffect, useState } from "react";
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
import type { Property } from "@/data/mockData";

export interface PropertyEditData {
  name: string;
  address: string;
  notes?: string;
}

interface PropertyEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PropertyEditData) => void;
  property: Property;
}

export function PropertyEditDialog({
  open,
  onOpenChange,
  onSubmit,
  property,
}: PropertyEditDialogProps) {
  const [formData, setFormData] = useState<PropertyEditData>({
    name: property.name,
    address: property.address,
    notes: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({ name: property.name, address: property.address, notes: "" });
    }
  }, [open, property]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-zinc-900 text-white sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Edit Property</DialogTitle>
          <DialogDescription className="text-zinc-400">Update property information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-property-name" className="text-zinc-300">Property Name *</Label>
            <Input
              id="edit-property-name"
              placeholder="e.g., 63139 Dogtown House A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-property-address" className="text-zinc-300">Address *</Label>
            <Input
              id="edit-property-address"
              placeholder="1234 Main St, St. Louis, MO 63139"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes" className="text-zinc-300">Notes</Label>
            <Textarea
              id="edit-notes"
              placeholder="Additional information about this update..."
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
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
