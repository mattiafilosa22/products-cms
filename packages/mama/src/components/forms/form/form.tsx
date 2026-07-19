import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { useEffect } from "react";

export type FormProps<T extends FieldValues, TContext = unknown> = {
  children: React.ReactNode;
  form: UseFormReturn<T, TContext, T>;
  onSubmit?: SubmitHandler<T>;
  className?: string;
  initialValues: T | null;
  id?: string;
};

export const Form = <T extends FieldValues = FieldValues, TContext = unknown>({
  children,
  form,
  onSubmit,
  className = "",
  initialValues,
  id,
}: FormProps<T, TContext>) => {
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
    </FormProvider>
  );
};
