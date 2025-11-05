import { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormBase, FormControlProps } from "@/components/form/form-base.tsx";
import { useFieldContext } from "@/components/form/use-forms.tsx";

export function FormSelect({
  children,
  ...props
}: FormControlProps & { children: ReactNode }) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props} required={props.required} disabled={props.disabled}>
      <Select
        onValueChange={(value) => {
          // Handle clearing the value
          field.handleChange(value === "__clear__" ? "" : value);
        }}
        value={field.state.value || ""}
        required={props.required}
        disabled={props.disabled}
      >
        <SelectTrigger
          aria-invalid={isInvalid}
          id={field.name}
          onBlur={field.handleBlur}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {!props.required && field.state.value && (
            <SelectItem value="__clear__">
              <span className="text-muted-foreground italic">
                -- Vymazat --
              </span>
            </SelectItem>
          )}
          {children}
        </SelectContent>
      </Select>
    </FormBase>
  );
}
