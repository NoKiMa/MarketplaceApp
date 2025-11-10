import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/presentation/store/configureStore";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Marketplace",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ProductListScreen"
          options={{
            title: "Products",
            headerShown: true,
            headerBackTitle: "Home",
          }}
        />
        <Stack.Screen
          name="ProductDetailsScreen"
          options={{
            title: "Product Details",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="CartScreen"
          options={{
            title: "Shopping Cart",
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </Provider>
  );
}
