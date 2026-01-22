"use client";

import { getProduct } from "@/api/products/_getProduct";
import { useEffect, use } from "react";
import { ProductForm } from "../../_components/product-form/product-form";
import PageWrapper from "../../_layout/page-wrapper/page-wrapper";
import { Loader } from "@/app/_shared/components";
import { useRouter } from "next/navigation";
import { FormSidebar } from "@/app/_shared/components/form-sidebar/form-sidebar";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string; products: string }>;
}) {
  const router = useRouter();
  const { id, products } = use(params);
  const { getProductById, isLoading, data } = getProduct();

  useEffect(() => {
    getProductById(id);
  }, [id]);

  return (
    <PageWrapper title="Visualizza prodotto" backUrl={`/${products}`}>
      {isLoading ? (
        <Loader />
      ) : (
        <ProductForm
          product={data?.data || null}
          onSubmit={() => {}}
          isLoading={isLoading}
          readonly={true}
        >
          <FormSidebar readonly={true} editUrl={`/${products}/edit/${id}`} />
        </ProductForm>
      )}
    </PageWrapper>
  );
}
