import { Product } from "@/api/products/_type";
import { AppButton } from "@/app/_shared/components";
import { Form, FormField, InputPrice, InputText, TextArea } from "@/app/_shared/components/forms";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
interface ProductFormProps {
  product: Product | null;
  onSubmit: (data: Product) => void;
  isLoading: boolean;
  readonly?: boolean;
}

export const ProductForm = ({
  product,
  onSubmit,
  isLoading,
  readonly = false,
}: ProductFormProps) => {
  const router = useRouter();
  const form = useForm<Product>({
    defaultValues: product || {},
  });

  return (
    <Form
      id="product-form"
      form={form}
      initialValues={product}
      onSubmit={onSubmit}
    >
      <FormField
        name="name"
        label="Name"
        placeholder="Name"
        readonly={readonly}
        rules={{ required: true }}
      >
        <InputText />
      </FormField>
      <FormField
        name="description"
        label="Description"
        placeholder="Description"
        readonly={readonly}
      >
        <TextArea />
      </FormField>
      <FormField
        name="price"
        label="Price"
        placeholder="Price"
        readonly={readonly}
        rules={{ required: true }}
      >
        <InputPrice />
      </FormField>
      <FormField
        name="discountPrice"
        label="Discount Price"
        placeholder="Discount Price"
        readonly={readonly}
      >
        <InputPrice />
      </FormField>
    </Form>
  );
};
