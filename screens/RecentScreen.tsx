import { RecentScreenProps } from "@/navigation/types";
import React from "react";
import { Text, View } from "react-native";

const RecentScreen: React.FC<RecentScreenProps> = ({ route, navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Recent</Text>
    </View>
  );
};

export default RecentScreen;
