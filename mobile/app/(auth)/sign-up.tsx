import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useRouter } from "expo-router";

export default function SignUp() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isLoaded) return <Text>Loading...</Text>;

  const onSignUp = async () => {
    try {
      const res = await signUp.create({
        emailAddress: email,
        password,
      });

      await setActive({ session: res.createdSessionId });

      router.replace("/chat");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View>
      <Text>Sign Up</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={onSignUp} />
    </View>
  );
}
