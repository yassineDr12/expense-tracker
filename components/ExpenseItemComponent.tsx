import {
  Button,
  ButtonText,
  CloseIcon,
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
  Box,
  Card,
  HStack,
  Text,
  Pressable,
} from "@gluestack-ui/themed";
import { ExpenseItemComponentProps } from "../types/components";
import { useExpenses } from "@/contexts/ExpensesContext";
import { useState } from "react";
import { Expense } from "@/types/data";
import { KeyboardAvoidingView, Platform } from "react-native";

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

const ExpenseItemComponent: React.FC<ExpenseItemComponentProps> = ({ expense }) => {
  const { modifyExpense, removeExpense } = useExpenses();
  const [showModal, setShowModal] = useState(false);
  const id = expense.id;
  const [name, setName] = useState(expense.name);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [date, setDate] = useState(expense.date.toISOString().split("T")[0]);

  const handleEditExpense = () => {
    if (name && amount && date) {
      const newExpense: Expense = {
        id: id,
        name,
        amount: parseFloat(amount),
        date: new Date(date),
      };
      modifyExpense(newExpense);

      setShowModal(false);
    } else {
      // show a toast message here
    }
  };

  return (
    <>
      <Pressable onPress={() => setShowModal(true)}>
        <Card bgColor="#647AA1" width="95%" p={10} m={3}>
          <HStack justifyContent="space-between" alignItems="center">
            <Box>
              <Heading color="white">{name}</Heading>
              <Text size="sm" color="#F1F1F1">
                {date}
              </Text>
            </Box>
            <Card width={104} alignItems="center">
              <Text>{amount} $</Text>
            </Card>
          </HStack>
        </Card>
      </Pressable>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "center", width: "100%", alignItems: "center" }}
        >
          <ModalContent>
            <ModalHeader>
              <Heading size="xl">Edit Expense</Heading>
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
              <Button variant="outline" size="sm" action="secondary" mr="$3" onPress={() => setShowModal(false)}>
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button size="sm" bg="#647AA1" borderWidth="$0" onPress={handleEditExpense}>
                <ButtonText>Save</ButtonText>
              </Button>
              <Button action="negative" size="sm" ml="$3" onPress={() => removeExpense(expense)}>
                <ButtonText>Delete</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

export default ExpenseItemComponent;
