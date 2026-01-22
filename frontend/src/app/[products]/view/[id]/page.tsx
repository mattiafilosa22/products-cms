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

  useEffect(() => {
    getProductById(id);
  }, [id]);

  return (
    <PageWrapper title={`View Product ${id}`} backUrl={`/${products}`}>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="form-container">
          <div>
            <ProductForm
              product={data?.data || null}
              onSubmit={() => {}}
              isLoading={isLoading}
              readonly={true}
            />
          </div>
          <FormSidebar readonly={true} editUrl={`/${products}/edit/${id}`} />
        </div>
      )}
    </PageWrapper>
  );
}
