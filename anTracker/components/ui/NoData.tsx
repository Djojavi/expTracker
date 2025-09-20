import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

type NoDataProps = {
  message?: string;
  icon?: string;
  colorScheme?: "primary" | "secondary" | "neutral";
  showAnimation?: boolean;
};

export const NoData: React.FC<NoDataProps> = ({
  message = "datos",
  icon = "📭",
  colorScheme = "primary",
  showAnimation = true,
}) => {


  const getColors = () => {
    switch (colorScheme) {
      case "primary":
        return { text: "#A37366", background: "#e3f2fd", icon: "#A37366" };
      case "secondary":
        return { text: "#9c27b0", background: "#f3e5f5", icon: "#9c27b0" };
      default:
        return { text: "#555", background: "#f5f5f5", icon: "#777" };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.Text
        style={[
          styles.icon,
          
        ]}
      >
        {icon}
      </Animated.Text>
      <Text style={[styles.text, { color: colors.text }]}>
        ¡No hay {message} registrados!
      </Text>
      <Text style={[styles.subtext, { color: colors.text }]}>
        Cuando tengas nuevos {message}, aparecerán aquí
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    margin: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    fontSize: 60,
    marginBottom: 15,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
  },
});