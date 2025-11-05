import { FormBase, FormControlProps } from "@/components/form/form-base.tsx";
import { useFieldContext } from "@/components/form/use-forms.tsx";
import { Input } from "@/components/ui/input.tsx";

export function FormInput({
  label,
  description,
  ...rest
}: FormControlProps & React.ComponentProps<typeof Input>) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase
      label={label}
      description={description}
      required={rest.required}
      disabled={rest.disabled}
    >
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        required={rest.required}
        disabled={rest.disabled}
        readOnly={rest.readonly}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        {...rest}
      />
    </FormBase>
  );
}
