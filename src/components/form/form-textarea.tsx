import { Textarea } from "../ui/textarea";
import { useFieldContext } from "@/components/form/use-forms.tsx";
import { FormBase, FormControlProps } from "@/components/form/form-base.tsx";

export function FormTextarea({
  label,
  description,
  ...rest
}: FormControlProps & React.ComponentProps<typeof Textarea>) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase label={label} description={description} required={rest.required}>
      <Textarea
        id={field.name}
        name={field.name}
        required={rest.required}
        disabled={rest.disabled}
        readOnly={rest.readonly}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        {...rest}
      />
    </FormBase>
  );
}
