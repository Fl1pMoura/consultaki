"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ComboboxAppointmentsProps {
  data: {
    id: string;
    name: string;
  }[];
  selectText: string;
  placeholder: string;
  emptyText: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function ComboboxAppointments({
  data,
  selectText,
  placeholder,
  emptyText,
  value: controlledValue,
  onValueChange,
}: ComboboxAppointmentsProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState("");

  // Usa valor controlado se fornecido, senão usa estado interno
  const value = controlledValue ?? internalValue;

  const handleValueChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? data.find((item) => item.id === value)?.name : selectText}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={(selectedName) => {
                    const selectedItem = data.find(
                      (item) => item.name === selectedName,
                    );
                    if (selectedItem) {
                      handleValueChange(
                        selectedItem.id === value ? "" : selectedItem.id,
                      );
                    }
                    setOpen(false);
                  }}
                >
                  {item.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
