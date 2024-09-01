import { useExpenses } from "@/contexts/ExpensesContext";
import { useCustomToast } from "@/hooks/useCustomToast";
import { RootStackScreenProps } from "@/navigation/types";
import {
  ArrowRightIcon,
  Box,
  Button,
  ButtonText,
  EyeIcon,
  EyeOffIcon,
  Heading,
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Spinner,
  VStack,
} from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

const LoginScreen: React.FC<RootStackScreenProps<"Login">> = ({ route, navigation }) => {
  const { login, isLoading, isAuthenticated } = useExpenses();
  const { displayToast } = useCustomToast();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace("Home", { screen: "AllExpenses" });
    }
  }, [isAuthenticated, navigation]);

  if (isLoading) {
    return <Spinner size="large" color="#647AA1" sx={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;
  }

  if (isAuthenticated) {
    return <></>;
  }

  const handleShowPassword = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const validateInputs = () => {
    if (!email || !password) {
      displayToast("Please fill both fields", "error");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      displayToast("Please enter a valid email address", "error");
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    if (validateInputs()) {
      login(email, password);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, justifyContent: "center", width: "100%", alignItems: "center" }}
    >
      <Box p="$5" maxWidth="$96" borderWidth="$1" borderColor="#647AA1" borderRadius="$lg" width="90%">
        <Heading lineHeight={30} mb={5}>
          Login to your account
        </Heading>
        <VStack space="xl" py="$2">
          <Input borderColor="#647AA1">
            <InputField placeholder="Email" value={email} onChangeText={setEmail} />
          </Input>
          <Input borderColor="#647AA1">
            <InputField
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
            />
            <InputSlot pr="$3" onPress={handleShowPassword}>
              <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} color="$darkBlue500" />
            </InputSlot>
          </Input>
        </VStack>
        <VStack space="lg" pt="$4">
          <Button size="sm" bg="#647AA1" onPress={handleLogin}>
            <ButtonText>Login</ButtonText>
          </Button>
          <Box flexDirection="column">
            <Button variant="link" p="$0" size="sm" onPress={() => navigation.replace("Signup")}>
              <ButtonText color="#647AA1">Or create an account</ButtonText>
              <Icon size="md" ml="$2" as={ArrowRightIcon} />
            </Button>
          </Box>
        </VStack>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
