import { Product } from "@/api/products/_type";
import { AppButton } from "@/app/_shared/components";
import { Form, FormField, InputText } from "@/app/_shared/components/forms";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
interface ProductFormProps {
  product: Product | null;
  onSubmit: (data: Product) => void;
  isLoading: boolean;
}

export const ProductForm = ({
  product,
  onSubmit,
  isLoading,
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
      <FormField name="name" label="Name" placeholder="Name">
        <InputText />
      </FormField>
      <FormField
        name="description"
        label="Description"
        placeholder="Description"
      >
        <InputText />
      </FormField>
      <FormField name="price" label="Price" placeholder="Price">
        <InputText />
      </FormField>
      <FormField
        name="discountPrice"
        label="Discount Price"
        placeholder="Discount Price"
      >
        <InputText />
      </FormField>
    </Form>
  );
};
