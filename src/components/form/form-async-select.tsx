import { ReactNode, useState, useEffect, useRef } from "react";
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
import { FormBase, FormControlProps } from "@/components/form/form-base.tsx";
import { useFieldContext } from "@/components/form/use-forms.tsx";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AsyncOption<TData = any> {
  value: string;
  label: string;
  description?: string;
  data?: TData;
}

interface FormAsyncSelectProps<TData = any> extends FormControlProps {
  queryKey: (searchTerm: string) => readonly unknown[];
  queryFn: (searchTerm: string) => Promise<AsyncOption<TData>[]>;
  placeholder?: string;
  debounceMs?: number;
  minChars?: number;
  emptyMessage?: string;
  loadingMessage?: string;
  onSelect?: (option: AsyncOption<TData>) => void;
}

export function FormAsyncSelect<TData = any>({
  queryKey,
  queryFn,
  placeholder = "Vyberte...",
  debounceMs = 300,
  minChars = 2,
  emptyMessage = "Žádné výsledky",
  loadingMessage = "Načítání...",
  onSelect,
  ...props
}: FormAsyncSelectProps<TData>) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");

  // Debounce the search term
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [searchTerm, debounceMs]);

  const shouldFetch = debouncedSearch.length >= minChars;

  const { data: options = [], isLoading } = useQuery({
    queryKey: queryKey(debouncedSearch),
    queryFn: () => queryFn(debouncedSearch),
    enabled: shouldFetch,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <FormBase {...props}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          asChild
          disabled={props.disabled || props.readonly || isLoading}
        >
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={isInvalid}
            className={cn(
              "w-full justify-between text-base font-normal shadow-xs md:text-sm",
              !field.state.value && "text-muted-foreground",
            )}
            onBlur={field.handleBlur}
          >
            {selectedLabel || placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Hledat..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {isLoading && (
                <div className="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{loadingMessage}</span>
                </div>
              )}

              {!isLoading &&
                searchTerm.length > 0 &&
                searchTerm.length < minChars && (
                  <CommandEmpty>Zadejte alespoň {minChars} znaky</CommandEmpty>
                )}

              {!isLoading && shouldFetch && options.length === 0 && (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              )}

              {!isLoading && options.length > 0 && (
                <CommandGroup>
                  {options.map((option, key) => (
                    <CommandItem
                      value={option.value}
                      onSelect={() => {
                        field.handleChange(option.value);
                        setSelectedLabel(option.label);
                        setOpen(false);

                        // Call the onSelect callback if provided
                        if (onSelect) {
                          onSelect(option);
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.state.value === option.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        {option.description && (
                          <span className="text-muted-foreground text-xs">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormBase>
  );
}
