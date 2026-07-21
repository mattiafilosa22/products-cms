"use client";

import { use } from "react";
import { ProductForm } from "../../_components/product-form/product-form";
import PageWrapper from "../../_layout/page-wrapper/page-wrapper";
import { Loader } from "mama";
import { FormSidebar } from "@/app/products/_layout/form-sidebar/form-sidebar";
import { useProductQuery } from "@/api/products/_useProductQuery";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: product, isLoading } = useProductQuery(Number(id));

  return (
    <PageWrapper title="Visualizza prodotto" backUrl="/products">
      {isLoading ? (
        <Loader />
      ) : (
        <ProductForm
          product={product ?? null}
          onSubmit={() => {}}
          isLoading={isLoading}
          readonly={true}
        >
          <FormSidebar readonly={true} editUrl={`/products/edit/${id}`} />
        </ProductForm>
      )}
    </PageWrapper>
  );
}
