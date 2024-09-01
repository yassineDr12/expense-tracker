import {
  Button,
  ButtonText,
  SafeAreaView,
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
  VStack,
} from "@gluestack-ui/themed";

const Scractch = () => {
  const toast = useToast();

  return (
    <>
      <SafeAreaView>
        <Button
          onPress={() => {
            toast.show({
              placement: "bottom",
              duration: 1500,
              render: ({ id }) => {
                const toastId = "toast-" + id;
                return (
                  <Toast nativeID={toastId} action="attention" variant="solid">
                    <VStack space="xs">
                      <ToastTitle>New Message</ToastTitle>
                      <ToastDescription>
                        Hey, just wanted to touch base and see how you're doing. Let's catch up soon!
                      </ToastDescription>
                    </VStack>
                  </Toast>
                );
              },
            });
          }}
        >
          <ButtonText>Press Me</ButtonText>
        </Button>
      </SafeAreaView>
    </>
  );
};

export default Scractch;
