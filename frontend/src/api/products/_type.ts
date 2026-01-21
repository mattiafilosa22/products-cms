export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PrivateFileType = {
  file: File;
};
