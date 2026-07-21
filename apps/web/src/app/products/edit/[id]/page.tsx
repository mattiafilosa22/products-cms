"use client";

import { use } from "react";
import { ProductForm } from "../../_components/product-form/product-form";
import { Product } from "@/api/products/_type";
import { useProductQuery } from "@/api/products/_useProductQuery";
import { useUpdateProductMutation } from "@/api/products/_useUpdateProductMutation";
import { useDeleteProductMutation } from "@/api/products/_useDeleteProductMutation";
import PageWrapper from "../../_layout/page-wrapper/page-wrapper";
import { Loader } from "mama";
import { useRouter } from "next/navigation";
import { FormSidebar } from "@/app/products/_layout/form-sidebar/form-sidebar";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const productId = Number(id);

  const { data: product, isLoading } = useProductQuery(productId);
  const updateProductMutation = useUpdateProductMutation();
  const deleteProductMutation = useDeleteProductMutation();

  const onSubmit = async (data: Product) => {
    try {
      await updateProductMutation.mutateAsync(data);
      router.push("/products");
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async () => {
    try {
      await deleteProductMutation.mutateAsync(productId);
      router.push("/products");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageWrapper title="Modifica prodotto" backUrl="/products">
      {updateProductMutation.isPending || isLoading ? (
        <Loader />
      ) : (
        <ProductForm
          product={product ?? null}
          onSubmit={onSubmit}
          isLoading={updateProductMutation.isPending}
        >
          <FormSidebar
            onDelete={onDelete}
            isLoadingSave={updateProductMutation.isPending}
            isLoadingDelete={deleteProductMutation.isPending}
            isEdit={true}
          />
        </ProductForm>
      )}
    </PageWrapper>
  );
}
