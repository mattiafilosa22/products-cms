import { Product } from "@/api/products/_type";
import { DevTool } from "@hookform/devtools";
import { Form, FormField, InputPrice, InputText, TextArea } from "mama";
import { useForm } from "react-hook-form";
interface ProductFormProps {
  product: Product | null;
  onSubmit: (data: Product) => void;
  isLoading: boolean;
  readonly?: boolean;
  children?: React.ReactNode;
}

export const ProductForm = ({
  product,
  onSubmit,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- pre-existing unused binding, cleanup deferred
  isLoading,
  readonly = false,
  children,
}: ProductFormProps) => {
  const form = useForm<Product>({
    defaultValues: product || {},
  });

  const { watch } = form;
  const price = watch("price");

  return (
    <Form
      id="product-form"
      form={form}
      initialValues={product}
      onSubmit={onSubmit}
    >
      <div className="form-container">
        <div>
          <FormField<string>
            name="name"
            label="Nome"
            placeholder="Nome"
            readonly={readonly}
            rules={{ required: true }}
            render={(field) => <InputText {...field} maxLength={20} />}
          />
          <FormField<string>
            name="description"
            label="Descrizione"
            placeholder="Descrizione"
            readonly={readonly}
            render={(field) => <TextArea {...field} maxLength={200} rows={2} />}
          />
          <FormField<number | string | null>
            name="price"
            label="Prezzo"
            placeholder="Prezzo"
            readonly={readonly}
            rules={{ required: true }}
            render={(field) => <InputPrice {...field} />}
          />
          <FormField<number | string | null>
            name="discountPrice"
            label="Prezzo Scontato"
            placeholder="Prezzo Scontato"
            readonly={readonly}
            rules={{
              validate: (value) => {
                if (!value || !price) return true;
                if (Number(value) >= Number(price)) {
                  return "Il prezzo scontato deve essere inferiore al prezzo originale";
                }
                return true;
              },
            }}
            render={(field) => <InputPrice {...field} />}
          />
        </div>
        {children}
      </div>
      {/* Dev tooling now lives app-side (moved out of mama in Piece 3). */}
      <DevTool control={form.control} />
    </Form>
  );
};
