import { Box, Card, Heading, HStack, Text, View } from "@gluestack-ui/themed";
import { ExpenseItemComponentProps } from "../types/components";

const ExpenseItemComponent: React.FC<ExpenseItemComponentProps> = ({ expense }) => {
  return (
    <>
      <Card bgColor="#647AA1" width="95%" p={10}>
        <HStack justifyContent="space-between" alignItems="center">
          <Box>
            <Heading color="white">{expense.name}</Heading>
            <Text size="sm" color="#F1F1F1">
              {expense.date.toLocaleDateString()}
            </Text>
          </Box>
          <Card bgColor="white">
            <Heading>{expense.amount}</Heading>
          </Card>
        </HStack>
      </Card>
    </>
  );
};

export default ExpenseItemComponent;
