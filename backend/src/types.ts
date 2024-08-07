// Define the base type for shared fields
export type BaseProductInput = {
  name: string;
  description: string;
  msrpPrice: number;
  brand: string;
  model: string;
  isSingleSize: boolean;
  currentPrice?: number; // Optional with a default value in the model
  onSale?: boolean; // Optional with a default value in the model
  quantity?: number; // Optional with a default value in the model
  archived?: boolean; // Optional with a default value in the model
};

// Define the CreateProductInput type extending the base type
export type CreateProductInput = BaseProductInput;

// Define the CreateProductVariantInput type extending the base type and adding productId
export type CreateProductVariantInput = BaseProductInput & {
  productId: number;
};

// Define the UpdateProductInput type making all fields optional
export type UpdateProductInput = Partial<CreateProductInput>;

// Define the UpdateProductVariantInput type making all fields optional
export type UpdateProductVariantInput = Partial<CreateProductVariantInput>;

// Define the type for CreateCartItemInput
export type CreateCartItemInput = {
  cartId: number;
  productId: number;
  variantId?: number | null;
  sizeId?: number | null;
  cartQuantity: number;
  currentPrice: number;
};

// Define the UpdateCartItemInput type making all fields optional
export type UpdateCartItemInput = Partial<CreateCartItemInput>;

// Define the type for CreateSizeInput
export type CreateSizeInput = {
  size: string;
  quantity: number;
  productId?: number | null;
  variantId?: number | null;
  productName?: string | null;
  variantName?: string | null;
};

// Define the UpdateSizeInput type making all fields optional
export type UpdateSizeInput = Partial<CreateSizeInput>;

// Define the type for CreateProductImageInput
export type CreateProductImageInput = {
  url: string;
  order: number;
  productVariantId?: number | null;
  productId?: number | null;
};

// Define the UpdateProductImageInput type making all fields optional
export type UpdateProductImageInput = Partial<CreateProductImageInput>;

// Define the type for CreateCategoryInput
export type CreateCategoryInput = {
  name: string;
  description?: string | null;
};

// Define the UpdateCategoryInput type making all fields optional
export type UpdateCategoryInput = Partial<CreateCategoryInput>;

// Define the type for CreateSubCategoryInput
export type CreateSubCategoryInput = {
  name: string;
  description?: string | null;
  categoryId: number;
};

// Define the UpdateSubCategoryInput type making all fields optional
export type UpdateSubCategoryInput = Partial<CreateSubCategoryInput>;

// Define the type for CreateUserInput
export type CreateUserInput = {
  email: string;
  password: string;
  name?: string | null;
  address1?: string | null;
  address2?: string | null;
  phoneNumber?: string | null;
};

// Define the UpdateUserInput type making all fields optional
export type UpdateUserInput = Partial<CreateUserInput>;

// Define the type for CreateReviewInput
export type CreateReviewInput = {
  userName: string;
  userEmail: string;
  productId: number;
  rating: number;
  comment?: string | null;
  userId?: number | null;
};

// Define the UpdateReviewInput type making all fields optional
export type UpdateReviewInput = Partial<CreateReviewInput>;

// Define the type for CreateCartInput
export type CreateCartInput = {
  userId: number;
};

// Define the UpdateCartInput type making all fields optional
export type UpdateCartInput = Partial<CreateCartInput>;

// Define the type for CreateOrderItemInput
export type CreateOrderItemInput = {
  orderId: number;
  productId?: number | null;
  productName: string;
  productVariantId?: number | null;
  productVariantName?: string | null;
  quantity: number;
  price: number;
};

// Define the type for CreateOrderInput
export type CreateOrderInput = {
  userId?: number | null;
  userName?: string | null;
  userEmail?: string | null;
  userAddress1?: string | null;
  userAddress2?: string | null;
  userPhoneNumber?: string | null;
  totalAmount?: number;
};

export type UpdateOrderItemInput = {
  productId: number;
  productVariantId?: number;
  quantity: number;
  price: number;
  productName: string;
};

export type UpdateOrderInput = {
  userId?: number;
  totalAmount?: number;
  orderItems?: UpdateOrderItemInput[];
};

// Define the type for CreateInventoryInput
export type CreateInventoryInput = {
  productId?: number | null;
  variantId?: number | null;
  sizeId?: number | null;
  quantity: number;
};

// Define the UpdateInventoryInput type making all fields optional
export type UpdateInventoryInput = Partial<CreateInventoryInput>;

// Define the type for CreateSaleInput
export type CreateSaleInput = {
  name: string;
  title: string;
  tagline: string;
  startDate: Date;
  endDate: Date;
  salePercentage?: number | null;
  saleAmount?: number | null;
};

// Define the UpdateSaleInput type making all fields optional
export type UpdateSaleInput = Partial<CreateSaleInput>;

// Define the type for CreatePromoCodeInput
export type CreatePromoCodeInput = {
  code: string;
  validFrom: Date;
  validTo: Date;
  saleId: number;
};

// Define the UpdatePromoCodeInput type making all fields optional
export type UpdatePromoCodeInput = Partial<CreatePromoCodeInput>;

// Define the type for CreatePackageInput
export type CreatePackageInput = {
  name: string;
  description?: string | null;
  price: number;
};

// Define the UpdatePackageInput type making all fields optional
export type UpdatePackageInput = Partial<CreatePackageInput>;
