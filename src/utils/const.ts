export const SCREENS = {
    Home: 'index',
    ProductList: 'ProductListScreen',
    ProductDetails: 'ProductDetailsScreen',
    Cart: 'CartScreen',
    Checkout: 'CheckoutScreen',
    OrderConfirmation: 'OrderConfirmationScreen',
} as const;

export type RootStackParamList = {
  [key in keyof typeof SCREENS]: any;
};
