import { SafeAreaView, Toast, ToastDescription, useToast, VStack } from "@gluestack-ui/themed";

export const useCustomToast = () => {
  const toast = useToast();

  const displayToast = (message: string, type: "error" | "success" | undefined) => {
    toast.show({
      placement: "top",
      duration: 2000,
      render: ({ id }) => {
        const toastId = "toast-" + id;
        return (
          <SafeAreaView marginTop={30}>
            <Toast
              nativeID={toastId}
              action={type}
              variant="outline"
              borderColor={type === "success" ? "#647AA1" : "red"}
            >
              <VStack space="xs">
                <ToastDescription>{message}</ToastDescription>
              </VStack>
            </Toast>
          </SafeAreaView>
        );
      },
    });
  };

  return { displayToast };
};
