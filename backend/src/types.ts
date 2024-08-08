import { Cart, CartItem, Product } from "@prisma/client";

// Base type for shared fields
export type BaseProductInput = {
  name: string;
  msrpPrice: number;
  isSingleSize: boolean;
  currentPrice?: number;
  quantity?: number;
};

// Create and Update Product types
export type CreateProductInput = BaseProductInput & {
  description: string;
  brand: string;
  model: string;
};

export type UpdateProductInput = Partial<CreateProductInput>;

// Create and Update Product Variant types
export type CreateProductVariantInput = BaseProductInput & {
  productId: number;
};

export type UpdateProductVariantInput = Partial<CreateProductVariantInput>;

// Cart and CartItem types
export type CartWithItems = Cart & {
  items: (CartItem & {
    product: Product;
  })[];
};

export type CreateCartItemInput = {
  cartId: number;
  productId: number;
  variantId?: number | null;
  sizeId?: number | null;
  cartQuantity: number;
  currentPrice: number;
};

export type UpdateCartItemInput = Partial<CreateCartItemInput>;

// Create and Update Size types
export type CreateSizeInput = {
  size: string;
  quantity: number;
  productId?: number | null;
  variantId?: number | null;
};

export type UpdateSizeInput = Partial<CreateSizeInput>;

// Create and Update Product Image types
export type CreateProductImageInput = {
  url: string;
  order: number;
  productVariantId?: number | null;
  productId?: number | null;
};

export type UpdateProductImageInput = Partial<CreateProductImageInput>;

// Create and Update Category types
export type CreateCategoryInput = {
  name: string;
  description?: string | null;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

// Create and Update SubCategory types
export type CreateSubCategoryInput = {
  name: string;
  description?: string | null;
  categoryId: number;
};

export type UpdateSubCategoryInput = Partial<CreateSubCategoryInput>;

// Create and Update User types
export type CreateUserInput = {
  email: string;
  password: string;
  name?: string | null;
  address1?: string | null;
  address2?: string | null;
  phoneNumber?: string | null;
};

export type UpdateUserInput = Partial<CreateUserInput>;

// Create and Update Review types
export type CreateReviewInput = {
  userName: string;
  userEmail: string;
  productId: number;
  rating: number;
  comment?: string | null;
  userId?: number | null;
};

export type UpdateReviewInput = Partial<CreateReviewInput>;

// Create and Update Cart types
export type CreateCartInput = {
  userId: number;
};

export type UpdateCartInput = Partial<CreateCartInput>;

// Create and Update Order Item types
export type CreateOrderItemInput = {
  orderId: number;
  productId: number;
  productVariantId?: number;
  quantity: number;
  price: number;
  productName: string;
  productVariantName?: string;
  sizeId?: number;
  size?: string;
};

export type UpdateOrderItemInput = Partial<CreateOrderItemInput>;

// Create and Update Order types
export type CreateOrderInput = {
  userId?: number | null;
  userName?: string | null;
  userEmail?: string | null;
  userAddress1?: string | null;
  userAddress2?: string | null;
  userPhoneNumber?: string | null;
  totalAmount?: number;
};

export type UpdateOrderInput = Partial<CreateOrderInput> & {
  orderItems?: UpdateOrderItemInput[];
};

// Create and Update Inventory types
export type CreateInventoryInput = {
  productId?: number | null;
  variantId?: number | null;
  sizeId?: number | null;
  quantity: number;
};

export type UpdateInventoryInput = Partial<CreateInventoryInput>;

// Define Operation type
export type Operation = "increment" | "decrement";

// Create and Update Sale types
export type CreateSaleInput = {
  name: string;
  title: string;
  tagline: string;
  startDate: Date;
  endDate: Date;
  salePercentage?: number | null;
  saleAmount?: number | null;
};

export type UpdateSaleInput = Partial<CreateSaleInput>;

// Create and Update PromoCode types
export type CreatePromoCodeInput = {
  code: string;
  validFrom: Date;
  validTo: Date;
  saleId: number;
};

export type UpdatePromoCodeInput = Partial<CreatePromoCodeInput>;

// Create and Update Package types
export type CreatePackageInput = {
  name: string;
  description?: string | null;
  price: number;
};

export type UpdatePackageInput = Partial<CreatePackageInput>;
