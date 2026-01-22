"use client";

import { getProduct } from "@/api/products/_getProduct";
import { useEffect, use } from "react";
import { ProductForm } from "../../_components/product-form/product-form";
import { Product } from "@/api/products/_type";
import { useUpdateProduct } from "@/api/products/_updateProduct";
import PageWrapper from "../../_layout/page-wrapper/page-wrapper";
import { Loader } from "@/app/_shared/components";
import { useRouter } from "next/navigation";
import { useDeleteProduct } from "@/api/products/_deleteProduct";
import { FormSidebar } from "@/app/_shared/components/form-sidebar/form-sidebar";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string; products: string }>;
}) {
  const router = useRouter();
  const { id, products } = use(params);
  const { getProductById, isLoading, data } = getProduct();
  const {
    updateProduct,
    data: dataUpdateProduct,
    isLoading: isLoadingUpdateProduct,
  } = useUpdateProduct();

  const { deleteProduct, isLoading: isLoadingDeleteProduct } =
    useDeleteProduct();

  useEffect(() => {
    getProductById(id);
  }, [id]);

  const onSubmit = async (data: Product) => {
    try {
      await updateProduct(data);
      router.push("/products");
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async () => {
    try {
      await deleteProduct(Number(id));
      router.push("/products");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageWrapper title="Modifica prodotto" backUrl={`/${products}`}>
      {isLoadingUpdateProduct || isLoading ? (
        <Loader />
      ) : (
        <ProductForm
          product={data?.data || null}
          onSubmit={onSubmit}
          isLoading={isLoadingUpdateProduct}
        >
          <FormSidebar
            onDelete={onDelete}
            isLoadingSave={isLoadingUpdateProduct}
            isLoadingDelete={isLoadingDeleteProduct}
            isEdit={true}
          />
        </ProductForm>
      )}
    </PageWrapper>
  );
}
