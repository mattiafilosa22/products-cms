import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/form";
import { InputText } from "../input-text/input-text";
import { FormField, FormFieldProps } from "./form-field";

type TestValues = { nome: string };

// Real Form + react-hook-form host: FormField only works under FormProvider.
const Host = ({
  defaultValues = { nome: "" },
  onSubmit = () => {},
  ...fieldProps
}: Partial<FormFieldProps> & {
  defaultValues?: TestValues;
  onSubmit?: (data: TestValues) => void;
}) => {
  const form = useForm<TestValues>({ defaultValues });
  return (
    <Form<TestValues> form={form} onSubmit={onSubmit} initialValues={null}>
      <FormField name="nome" label="Nome" {...fieldProps}>
        <InputText />
      </FormField>
      <button type="submit">Salva</button>
    </Form>
  );
};

describe("FormField", () => {
  it("renderizza la label", () => {
    render(<Host />);
    expect(screen.getByText("Nome")).toBeInTheDocument();
  });

  it("aggiunge l'asterisco alla label con rules.required", () => {
    render(<Host rules={{ required: true }} />);
    expect(screen.getByText("Nome*")).toBeInTheDocument();
  });

  it("inietta name e value nel figlio e propaga l'onChange", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Host defaultValues={{ nome: "iniziale" }} onSubmit={onSubmit} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "nome");
    expect(input).toHaveValue("iniziale");

    await user.clear(input);
    await user.type(input, "nuovo valore");
    expect(input).toHaveValue("nuovo valore");

    await user.click(screen.getByRole("button", { name: "Salva" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({ nome: "nuovo valore" });
  });

  it("mostra '<label> è obbligatorio' dopo un submit fallito con required", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Host rules={{ required: true }} onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Salva" }));

    expect(await screen.findByText("Nome è obbligatorio")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("con readonly e valore vuoto non renderizza nulla", () => {
    render(<Host readonly defaultValues={{ nome: "" }} />);
    expect(screen.queryByText("Nome")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("con readonly e valore presente renderizza il campo in sola lettura", () => {
    render(<Host readonly defaultValues={{ nome: "valore" }} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("valore");
    expect(input).toHaveAttribute("readonly");
  });
});
