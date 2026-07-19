import { Product } from "@/api/products/_type";
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
          <FormField
            name="name"
            label="Nome"
            placeholder="Nome"
            readonly={readonly}
            rules={{ required: true }}
          >
            <InputText maxLength={20} />
          </FormField>
          <FormField
            name="description"
            label="Descrizione"
            placeholder="Descrizione"
            readonly={readonly}
          >
            <TextArea maxLength={200} rows={2} />
          </FormField>
          <FormField
            name="price"
            label="Prezzo"
            placeholder="Prezzo"
            readonly={readonly}
            rules={{ required: true }}
          >
            <InputPrice />
          </FormField>
          <FormField
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
          >
            <InputPrice />
          </FormField>
        </div>
        {children}
      </div>
    </Form>
  );
};
