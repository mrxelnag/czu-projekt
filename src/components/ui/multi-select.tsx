import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type SelectOption = {
  value: string;
  label: string;
};

type MultiSelectComboBoxProps<TData extends SelectOption> = {
  data: TData[];
  dataLoading: boolean;
  selected: SelectOption[];
  setSelected: React.Dispatch<React.SetStateAction<SelectOption[]>>;
  placeholder?: string;
  disabled?: boolean;
};

export default function MultiSelectComboBox<TData extends SelectOption>({
  data,
  dataLoading,
  selected,
  setSelected,
  placeholder = "Vyberte...",
  disabled,
}: MultiSelectComboBoxProps<TData>) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const options: SelectOption[] = data.map((item) => ({
    value: item.value,
    label: item.label,
  }));

  const handleSelect = React.useCallback(
    (option: SelectOption) => {
      if (disabled) return;
      const isSelected = selected.some((item) => item.value === option.value);

      if (isSelected) {
        setSelected(selected.filter((item) => item.value !== option.value));
      } else {
        setSelected([...selected, option]);
      }

      // Clear input value after selection
      setInputValue("");
    },
    [selected, setSelected, disabled],
  );

  const handleUnselect = React.useCallback(
    (option: SelectOption) => {
      setSelected(selected.filter((item) => item.value !== option.value));
    },
    [selected, setSelected],
  );

  // Filter options based on input value
  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return options;

    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [options, inputValue]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-auto min-h-10 w-full justify-between"
          onClick={() => setOpen(!open)}
        >
          <div className="flex max-w-[90%] flex-wrap gap-1 overflow-hidden">
            {selected.length > 0 ? (
              <>
                {selected.slice(0, 3).map((option) => (
                  <Badge
                    key={option.value}
                    variant="outline"
                    className="my-0.5 mr-1 border-primary"
                  >
                    {option.label}
                    <span
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnselect(option);
                      }}
                    >
                      {disabled ? null : (
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      )}
                    </span>
                  </Badge>
                ))}
                {selected.length > 3 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="my-0.5">
                          +{selected.length - 3} dalších
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="max-w-[200px]">
                          {selected.slice(3).map((option) => (
                            <div key={option.value} className="text-sm">
                              {option.label}
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command shouldFilter={false}>
          {" "}
          {/* Turn off automatic filtering */}
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={setInputValue}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>Nenalezeny žádné výsledky.</CommandEmpty>
            <CommandGroup>
              {dataLoading
                ? Array.from({ length: 5 }, (_, index) => (
                    <CommandItem key={index} className="cursor-pointer">
                      Loading...
                    </CommandItem>
                  ))
                : filteredOptions.map((option) => {
                    const isSelected = selected.some(
                      (item) => item.value === option.value,
                    );
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.label} // Use label for filtering instead of value
                        onSelect={() => handleSelect(option)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    );
                  })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
