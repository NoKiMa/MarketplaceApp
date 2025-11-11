import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/presentation/store/configureStore";
import { SCREENS } from "@/src/utils/const";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen
          name={SCREENS.Home}
          options={{
            title: "Marketplace",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={SCREENS.ProductList}
          options={{
            title: "Products",
            headerShown: true,
            headerBackTitle: "Home",
          }}
        />
        <Stack.Screen
          name={SCREENS.ProductDetails}
          options={{
            title: "Product Details",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name={SCREENS.Cart}
          options={{
            title: "Shopping Cart",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen 
          name={SCREENS.Checkout} 
          options={{ title: 'Checkout' }} 
        />
        <Stack.Screen 
          name={SCREENS.OrderConfirmation} 
          options={{ 
            title: 'Order Confirmation',
            headerShown: false,
            gestureEnabled: false,
          }} 
        />
      </Stack>
    </Provider>
  );
}
