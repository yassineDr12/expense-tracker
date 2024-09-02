import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
  Text,
  Button,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  Heading,
  AlertDialogFooter,
  ButtonGroup,
  ButtonText,
} from "@gluestack-ui/themed";

const LogoutButton = () => {
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const { logout } = useAuth();
  return (
    <>
      <TouchableOpacity
        style={{
          width: 48,
          height: 48,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => setShowAlertDialog(true)}
      >
        <Ionicons name="log-out-outline" size={34} color="#647AA1" />
      </TouchableOpacity>
      <AlertDialog
        isOpen={showAlertDialog}
        onClose={() => {
          setShowAlertDialog(false);
        }}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="lg">Logout</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text size="sm">Are you sure you want to logout?</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup space="lg">
              <Button
                variant="outline"
                action="secondary"
                onPress={() => {
                  setShowAlertDialog(false);
                }}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button bg="$error600" action="negative" onPress={logout}>
                <ButtonText>Confirm</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LogoutButton;
