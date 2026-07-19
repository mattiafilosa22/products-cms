import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { FormField } from "../form-field/form-field";
import { InputText } from "../input-text/input-text";
import { Form } from "./form";

type TestValues = { nome: string };

const Host = ({
  onSubmit = () => {},
  initialValues = null,
}: {
  onSubmit?: (data: TestValues) => void;
  initialValues?: TestValues | null;
}) => {
  const form = useForm<TestValues>({ defaultValues: { nome: "" } });
  return (
    <Form<TestValues>
      form={form}
      onSubmit={onSubmit}
      initialValues={initialValues}
    >
      <FormField name="nome" label="Nome">
        <InputText />
      </FormField>
      <button type="submit">Salva</button>
    </Form>
  );
};

describe("Form", () => {
  it("al submit chiama onSubmit con i valori correnti", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Host onSubmit={onSubmit} />);

    await user.type(screen.getByRole("textbox"), "Laptop");
    await user.click(screen.getByRole("button", { name: "Salva" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({ nome: "Laptop" });
  });

  it("resetta i campi sugli initialValues quando arrivano", () => {
    render(<Host initialValues={{ nome: "dal server" }} />);
    expect(screen.getByRole("textbox")).toHaveValue("dal server");
  });

  it("resetta i campi quando initialValues cambia dopo il mount", () => {
    const { rerender } = render(<Host initialValues={null} />);
    expect(screen.getByRole("textbox")).toHaveValue("");

    rerender(<Host initialValues={{ nome: "aggiornato" }} />);
    expect(screen.getByRole("textbox")).toHaveValue("aggiornato");
  });
});
