import { Checkbox } from "@/components/ui/checkbox.tsx";
import { FormBase, FormControlProps } from "@/components/form/form-base.tsx";
import { useFieldContext } from "@/components/form/use-forms.tsx";

export function FormCheckbox(props: FormControlProps) {
  const field = useFieldContext<boolean>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props} controlFirst horizontal>
      <Checkbox
        id={field.name}
        name={field.name}
        disabled={props.disabled}
        checked={field.state.value}
        onBlur={field.handleBlur}
        onCheckedChange={(e) => field.handleChange(e === true)}
        aria-invalid={isInvalid}
      />
    </FormBase>
  );
}
