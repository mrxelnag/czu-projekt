import { Switch } from "@/components/ui/switch.tsx";
import { FormBase, FormControlProps } from "@/components/form/form-base.tsx";
import { useFieldContext } from "@/components/form/use-forms.tsx";

export function FormSwitch(props: FormControlProps) {
  const field = useFieldContext<boolean>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props} controlFirst horizontal>
      <Switch
        id={field.name}
        name={field.name}
        checked={!!field.state.value}
        disabled={props.disabled}
        onBlur={field.handleBlur}
        onCheckedChange={(checked) => field.handleChange(checked === true)}
        aria-invalid={isInvalid}
      />
    </FormBase>
  );
}
