import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

export type FormProps<T extends FieldValues> = {
  children: React.ReactNode;
  form: UseFormReturn<T, any, T>;
  onSubmit?: SubmitHandler<T>;
  className?: string;
};

export const Form = <T extends FieldValues = FieldValues>({
  children,
  form,
  onSubmit,
  className = "",
}: FormProps<T>) => {

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit && form.handleSubmit(onSubmit)();
  };

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={handleSubmit} className={className}>
        {children}
      </form>
      <DevTool control={form.control} /> 
    </FormProvider>
  );
};
