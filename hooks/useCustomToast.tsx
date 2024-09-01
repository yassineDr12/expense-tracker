import { SafeAreaView, Toast, ToastDescription, ToastTitle, useToast, VStack } from "@gluestack-ui/themed";

export const useCustomToast = () => {
  const toast = useToast();

  const displayToast = (message: string, type: "attention" | "error" | "warning" | "success" | "info" | undefined) => {
    toast.show({
      placement: "top",
      duration: 2000,
      render: ({ id }) => {
        const toastId = "toast-" + id;
        return (
          <SafeAreaView>
            <Toast nativeID={toastId} action={type} variant="outline">
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
