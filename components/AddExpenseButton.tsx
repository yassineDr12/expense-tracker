import React, { useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform, View } from "react-native";
import {
  Button,
  ButtonText,
  Heading,
  Icon,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  VStack,
  FormControl,
  FormControlLabel,
  Input,
  InputField,
  FormControlLabelText,
  Fab,
  FabIcon,
  AddIcon,
} from "@gluestack-ui/themed";
import { useExpenses } from "@/contexts/ExpensesContext";
import { Expense } from "@/types/data";

const formatDate = (input: string): string => {
  // Remove any non-digit characters
  const cleanInput = input.replace(/\D/g, "");

  // Format the date as YYYY-MM-DD
  if (cleanInput.length <= 4) {
    return cleanInput;
  } else if (cleanInput.length <= 6) {
    return `${cleanInput.slice(0, 4)}-${cleanInput.slice(4)}`;
  } else {
    return `${cleanInput.slice(0, 4)}-${cleanInput.slice(4, 6)}-${cleanInput.slice(6, 8)}`;
  }
};

const AddExpenseButton: React.FC = () => {
  const { addExpense } = useExpenses();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleAddExpense = () => {
    if (name && amount && date) {
      const newExpense: Expense = {
        id: undefined,
        name,
        amount: parseFloat(amount),
        date: new Date(date),
      };
      addExpense(newExpense);

      setShowModal(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setName("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <ModalBackdrop />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "center", width: "100%", alignItems: "center" }}
        >
          <ModalContent>
            <ModalHeader>
              <Heading size="xl">Add New Expense</Heading>
            </ModalHeader>
            <ModalBody>
              <VStack py="$2" space="xl">
                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText>Name</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField placeholder="A label for the expense" value={name} onChangeText={setName} />
                  </Input>
                </FormControl>
                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText>Amount</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="How much did it cost?"
                      value={amount}
                      onChangeText={setAmount}
                      keyboardType="numeric"
                    />
                  </Input>
                </FormControl>
                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText>Date</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="YYYY-MM-DD"
                      value={date}
                      onChangeText={(text) => setDate(formatDate(text))}
                      maxLength={10}
                    />
                  </Input>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                size="sm"
                action="secondary"
                mr="$3"
                onPress={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button size="sm" bg="#647AA1" borderWidth="$0" onPress={handleAddExpense}>
                <ButtonText>Add</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </KeyboardAvoidingView>
      </Modal>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
      >
        <Fab bg="#647AA1" size="lg" onPress={() => setShowModal(true)}>
          <FabIcon as={AddIcon} h="$4" w="$4" />
        </Fab>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddExpenseButton;
