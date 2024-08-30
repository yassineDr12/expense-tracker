import { Box, Card, Heading, HStack, Text, View } from "@gluestack-ui/themed";
import { ExpenseItemComponentProps } from "../types/components";

const ExpenseItemComponent: React.FC<ExpenseItemComponentProps> = ({ expense }) => {
  return (
    <>
      <Card bgColor="#647AA1" width="95%" p={10} m={3}>
        <HStack justifyContent="space-between" alignItems="center">
          <Box>
            <Heading color="white">{expense.name}</Heading>
            <Text size="sm" color="#F1F1F1">
              {expense.date.toISOString().split("T")[0]}
            </Text>
          </Box>
          <Card width={104} alignItems="center">
            <Text>{expense.amount} $</Text>
          </Card>
        </HStack>
      </Card>
    </>
  );
};

export default ExpenseItemComponent;
