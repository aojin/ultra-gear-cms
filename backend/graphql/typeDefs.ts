const { gql } = require("apollo-server");

const typeDefs = gql`
  scalar DateTime

  type Product {
    id: ID!
    name: String!
    description: String!
    msrpPrice: Float!
    currentPrice: Float!
    onSale: Boolean!
    imageUrl: String
    images: [ProductImage!]
    brand: String!
    model: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    archived: Boolean!
    variants: [ProductVariant!]
    reviews: [Review!]
    inventory: [Inventory!]
    sales: [Sale!]
    categories: [Category!]
    subcategories: [SubCategory!]
    sizes: [Size!]
    isSingleSize: Boolean!
    quantity: Int
  }

  type ProductVariant {
    id: ID!
    name: String!
    msrpPrice: Float!
    currentPrice: Float!
    product: Product!
    productId: ID!
    isSingleSize: Boolean!
    quantity: Int
    sizes: [Size!]
    createdAt: DateTime!
    updatedAt: DateTime!
    archived: Boolean!
    images: [ProductImage!]
    sales: [Sale!]
  }

  type Size {
    id: ID!
    size: String!
    quantity: Int!
    product: Product
    productId: ID
    variant: ProductVariant
    variantId: ID
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ProductImage {
    id: ID!
    url: String!
    order: Int!
    productVariant: ProductVariant
    productVariantId: ID
    product: Product
    productId: ID
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Category {
    id: ID!
    name: String!
    description: String
    products: [Product!]
    subcategories: [SubCategory!]
  }

  type SubCategory {
    id: ID!
    name: String!
    description: String
    categoryId: ID!
    category: Category!
    products: [Product!]
  }

  type User {
    id: ID!
    email: String!
    password: String!
    name: String
    createdAt: DateTime!
    updatedAt: DateTime!
    orders: [Order!]
    reviews: [Review!]
    cart: Cart
  }

  type Order {
    id: ID!
    user: User!
    totalAmount: Float!
    createdAt: DateTime!
    updatedAt: DateTime!
    orderItems: [OrderItem!]
  }

  type OrderItem {
    id: ID!
    order: Order!
    product: Product!
    quantity: Int!
    price: Float!
  }

  type Review {
    id: ID!
    user: User!
    product: Product!
    rating: Float!
    comment: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Cart {
    id: ID!
    user: User!
    items: [CartItem!]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type CartItem {
    id: ID!
    cart: Cart!
    product: Product!
    quantity: Int!
    size: Size
    variant: ProductVariant
    currentPrice: Float!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Inventory {
    id: ID!
    product: Product
    productId: ID
    variant: ProductVariant
    variantId: ID
    quantity: Int!
    updatedAt: DateTime!
  }

  type Sale {
    id: ID!
    name: String!
    title: String!
    tagline: String!
    startDate: DateTime!
    endDate: DateTime!
    salePercentage: Float
    saleAmount: Float
    archived: Boolean!
    products: [Product!]
    variants: [ProductVariant!]
    promoCodes: [PromoCode!]
  }

  type PromoCode {
    id: ID!
    code: String!
    validFrom: DateTime!
    validTo: DateTime!
    sale: Sale!
    saleId: ID!
  }

  type Package {
    id: ID!
    name: String!
    description: String!
    price: Float!
    products: [Product!]
  }

  type Query {
    products: [Product!]
    product(id: ID!): Product
    categories: [Category!]
    category(id: ID!): Category
    users: [User!]
    user(id: ID!): User
    orders: [Order!]
    order(id: ID!): Order
  }

  type Mutation {
    createProduct(
      name: String!
      description: String!
      msrpPrice: Float!
      brand: String!
      model: String!
      imageUrls: [String!]!
      categoryIds: [ID!]!
    ): Product!
    updateProduct(
      id: ID!
      name: String
      description: String
      msrpPrice: Float
      brand: String
      model: String
      imageUrls: [String!]
      categoryIds: [ID!]
    ): Product!
    deleteProduct(id: ID!): Product!
    createProductVariant(
      productId: ID!
      name: String!
      msrpPrice: Float!
      isSingleSize: Boolean!
      quantity: Int
      imageUrls: [String!]!
    ): ProductVariant!
    updateProductVariant(
      id: ID!
      name: String
      msrpPrice: Float
      isSingleSize: Boolean
      quantity: Int
      imageUrls: [String!]
    ): ProductVariant!
    deleteProductVariant(id: ID!): ProductVariant!
    createCategory(name: String!, description: String): Category!
    updateCategory(id: ID!, name: String, description: String): Category!
    deleteCategory(id: ID!): Category!
    createSubCategory(name: String!, categoryId: ID!): SubCategory!
    updateSubCategory(id: ID!, name: String, categoryId: ID): SubCategory!
    deleteSubCategory(id: ID!): SubCategory!
    createUser(email: String!, password: String!, name: String): User!
    updateUser(id: ID!, email: String, password: String, name: String): User!
    deleteUser(id: ID!): User!
    createOrder(userId: ID!, totalAmount: Float!): Order!
    updateOrder(id: ID!, totalAmount: Float): Order!
    deleteOrder(id: ID!): Order!
    createReview(
      userId: ID!
      productId: ID!
      rating: Float!
      comment: String
    ): Review!
    updateReview(id: ID!, rating: Float, comment: String): Review!
    deleteReview(id: ID!): Review!
    createCartItem(
      cartId: ID!
      productId: ID!
      quantity: Int!
      sizeId: ID
      variantId: ID
      currentPrice: Float!
    ): CartItem!
    updateCartItem(id: ID!, quantity: Int!): CartItem!
    deleteCartItem(id: ID!): CartItem!
    createInventory(productId: ID, variantId: ID, quantity: Int!): Inventory!
    updateInventory(id: ID!, quantity: Int!): Inventory!
    deleteInventory(id: ID!): Inventory!
    createSale(
      name: String!
      title: String!
      tagline: String!
      startDate: DateTime!
      endDate: DateTime!
      salePercentage: Float
      saleAmount: Float
    ): Sale!
    updateSale(
      id: ID!
      name: String
      title: String
      tagline: String
      startDate: DateTime
      endDate: DateTime
      salePercentage: Float
      saleAmount: Float
    ): Sale!
    deleteSale(id: ID!): Sale!
    createPromoCode(
      code: String!
      validFrom: DateTime!
      validTo: DateTime!
      saleId: ID!
    ): PromoCode!
    updatePromoCode(
      id: ID!
      code: String
      validFrom: DateTime
      validTo: DateTime
    ): PromoCode!
    deletePromoCode(id: ID!): PromoCode!
    createPackage(
      name: String!
      description: String!
      price: Float!
      products: [ID!]!
    ): Package!
    updatePackage(
      id: ID!
      name: String
      description: String
      price: Float
      products: [ID!]
    ): Package!
    deletePackage(id: ID!): Package!
  }
`;

module.exports = typeDefs;
