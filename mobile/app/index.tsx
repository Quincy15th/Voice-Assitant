import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  // ⏳ chờ Clerk load xong
  if (!isLoaded) return null;

  // ✅ redirect đúng cách
  return <Redirect href={isSignedIn ? "/chat" : "/sign-in"} />;
}
