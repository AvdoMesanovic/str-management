"use client";

import { Building2, Search, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { ClientDialog } from "@/components/ClientDialog";
import { ClientIntakeDialog, type ClientIntakeData } from "@/components/ClientIntakeDialog";
import { PropertyIntakeDialog, type PropertyIntakeData } from "@/components/PropertyIntakeDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { type Client, mockClients } from "@/data/mockClients";

interface HeaderProps {
  clientMode: boolean;
  onClientModeChange: (enabled: boolean) => void;
  onPropertySearch: (query: string) => void;
}

export function Header({ clientMode, onClientModeChange, onPropertySearch }: HeaderProps) {
  const [propertySearchQuery, setPropertySearchQuery] = useState("");
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [clientSearchResults, setClientSearchResults] = useState<Client[]>([]);
  const [showClientResults, setShowClientResults] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [showPropertyIntake, setShowPropertyIntake] = useState(false);
  const [showClientIntake, setShowClientIntake] = useState(false);

  const handlePropertySearch = (value: string) => {
    setPropertySearchQuery(value);
    onPropertySearch(value);
  };

  const handleClientSearch = (value: string) => {
    setClientSearchQuery(value);
    if (value.trim()) {
      const results = mockClients.filter(
        (client) =>
          client.name.toLowerCase().includes(value.toLowerCase()) ||
          client.email.toLowerCase().includes(value.toLowerCase()) ||
          client.phone.includes(value),
      );
      setClientSearchResults(results);
      setShowClientResults(true);
    } else {
      setClientSearchResults([]);
      setShowClientResults(false);
    }
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setShowClientDialog(true);
    setShowClientResults(false);
    setClientSearchQuery("");
  };

  const handlePropertyIntakeSubmit = (data: PropertyIntakeData) => {
    alert(`Property "${data.name}" added successfully!`);
  };

  const handleClientIntakeSubmit = (data: ClientIntakeData) => {
    alert(`Client "${data.name}" added successfully!`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950 backdrop-blur-sm">
        <div className="flex flex-col gap-4 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm text-cyan-400">[PROPRIETARY LOGO]</div>
                <div className="text-xs text-zinc-500">STL Command Center</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2">
              <Label htmlFor="client-mode" className="cursor-pointer text-sm text-zinc-300">
                Toggle Client Mode
              </Label>
              <Switch
                id="client-mode"
                checked={clientMode}
                onCheckedChange={onClientModeChange}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </div>

          {!clientMode && (
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Search properties..."
                  value={propertySearchQuery}
                  onChange={(e) => handlePropertySearch(e.target.value)}
                  className="border-zinc-700 bg-zinc-900 pl-9 pr-9 text-white placeholder:text-zinc-500"
                />
                {propertySearchQuery && (
                  <button
                    type="button"
                    onClick={() => handlePropertySearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Search clients..."
                  value={clientSearchQuery}
                  onChange={(e) => handleClientSearch(e.target.value)}
                  className="border-zinc-700 bg-zinc-900 pl-9 pr-9 text-white placeholder:text-zinc-500"
                />
                {clientSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setClientSearchQuery("");
                      setShowClientResults(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {showClientResults && clientSearchResults.length > 0 && (
                  <div className="absolute top-full z-50 mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl">
                    {clientSearchResults.map((client) => (
                      <button
                        type="button"
                        key={client.id}
                        onClick={() => handleClientSelect(client)}
                        className="flex w-full items-center gap-3 border-b border-zinc-800 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-zinc-800"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                          {client.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-white">{client.name}</div>
                          <div className="text-xs text-zinc-500">{client.email}</div>
                        </div>
                        <div
                          className={`text-xs ${
                            client.status === "active"
                              ? "text-emerald-400"
                              : client.status === "pending"
                                ? "text-amber-400"
                                : "text-zinc-500"
                          }`}
                        >
                          {client.status}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {showClientResults && clientSearchResults.length === 0 && (
                  <div className="absolute top-full z-50 mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-center text-sm text-zinc-500">
                    No clients found
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowPropertyIntake(true)}
                  className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Property Intake</span>
                  <span className="sm:hidden">Property</span>
                </Button>
                <Button
                  onClick={() => setShowClientIntake(true)}
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Client Intake</span>
                  <span className="sm:hidden">Client</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <ClientDialog
        client={selectedClient}
        open={showClientDialog}
        onOpenChange={setShowClientDialog}
      />
      <PropertyIntakeDialog
        open={showPropertyIntake}
        onOpenChange={setShowPropertyIntake}
        onSubmit={handlePropertyIntakeSubmit}
      />
      <ClientIntakeDialog
        open={showClientIntake}
        onOpenChange={setShowClientIntake}
        onSubmit={handleClientIntakeSubmit}
      />
    </>
  );
}
