import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router";

function RootLayoutNav() {
  const { isSignedIn } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isSignedIn ? (
        <Stack.Screen name="(tabs)/chat" />
      ) : (
        <Stack.Screen name="(auth)/index" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <RootLayoutNav />
    </ClerkProvider>
  );
}
