import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

/**
 * ServiceCombobox — shadcn Popover + Command combobox.
 *
 * Props:
 *   options        { value, label }[]  — selectable options
 *   value          string              — current free-text / selected label
 *   onChange       (label: string) => void   — called when an option is picked
 *   onInputChange  (text: string) => void    — called on every keystroke
 *   placeholder    string
 *   hasError       boolean
 *   disabled       boolean
 */
export function ServiceCombobox({
  options = [],
  value = "",
  onChange,
  onInputChange,
  placeholder = "Product or Service",
  hasError = false,
  disabled = false,
}) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedLabel) => {
    onChange(selectedLabel);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal text-sm h-9 px-3",
            !value && "text-muted-foreground",
            hasError && "border-destructive"
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)]"
        align="start"
        sideOffset={4}
      >
        <Command>
          <CommandInput
            placeholder={`Search…`}
            value={value}
            onValueChange={(text) => {
              onInputChange?.(text);
            }}
          />
          <CommandList>
            <CommandEmpty>No results. Type to create.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => handleSelect(opt.label)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === opt.label ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
