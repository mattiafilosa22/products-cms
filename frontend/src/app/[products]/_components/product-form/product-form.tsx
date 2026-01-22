import { Product } from "@/api/products/_type";
import { Form, FormField, InputText } from "@/app/_shared/components/forms";
import { useForm } from "react-hook-form";

export const ProductForm = ({ product }: { product: Product | null }) => {
  const form = useForm<Product>({
    defaultValues: product || {},
  });

  return (
    <Form form={form} initialValues={product}>
      <FormField name="name" label="Name" placeholder="Name">
        <InputText />
      </FormField>
      <FormField name="description" label="Description" placeholder="Description">
        <InputText />
      </FormField>
      <FormField name="price" label="Price" placeholder="Price">
        <InputText />
      </FormField>
      <FormField name="discountPrice" label="Discount Price" placeholder="Discount Price">
        <InputText />
      </FormField>
    </Form>
  );
}
