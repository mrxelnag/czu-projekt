import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormInput } from "@/components/form/form-input.tsx";
import { FormTextarea } from "@/components/form/form-textarea.tsx";
import { FormSelect } from "@/components/form/form-select.tsx";
import { FormCheckbox } from "@/components/form/form-checkbox.tsx";
import { FormImageUpload } from "@/components/form/form-image-input.tsx";
import { FormSwitch } from "@/components/form/form-switch.tsx";
import { FormAsyncSelect } from "@/components/form/form-async-select.tsx";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input: FormInput,
    Image: FormImageUpload,
    Textarea: FormTextarea,
    Select: FormSelect,
    AsyncSelect: FormAsyncSelect,
    Checkbox: FormCheckbox,
    Switch: FormSwitch,
  },
  formComponents: {},
  fieldContext,
  formContext,
});

export { useAppForm, useFieldContext, useFormContext };
