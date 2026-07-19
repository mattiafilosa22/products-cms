import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";

export type FormProps<T extends FieldValues> = {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- known debt: removed in Piece 3 (typed render prop)
  form: UseFormReturn<T, any, T>;
  onSubmit?: SubmitHandler<T>;
  className?: string;
  initialValues: T | null;
  id?: string;
};

export const Form = <T extends FieldValues = FieldValues>({
  children,
  form,
  onSubmit,
  className = "",
  initialValues,
  id,
}: FormProps<T>) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (onSubmit) form.handleSubmit(onSubmit)();
  };

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  return (
    <FormProvider {...form}>
      <form id={id} noValidate onSubmit={handleSubmit} className={className}>
        {children}
      </form>
      <DevTool control={form.control} />
    </FormProvider>
  );
};
