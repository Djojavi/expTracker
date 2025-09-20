import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type CheckBoxProps = {
    text: string,
    onSelected:(tipo:string) => void;
}

export const  CustomCheckbox:React.FC<CheckBoxProps> = ({text, onSelected}) => {
  const [checked, setChecked] = useState(false);

  const handlePress = () => {
    const newValue = !checked;
    setChecked(newValue);
    if(newValue){
        onSelected(text); 
    }else{
        onSelected(text+'no')
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={styles.container}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.label}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  box: {
    height: 24,
    width: 24,
    borderWidth: 2,
    borderColor: "#555",
    borderRadius: 6, 
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#fff",
  },
  boxChecked: {
    backgroundColor: "#A37366", 
    borderColor: "#A37366",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  label: {
    fontSize: 15,
    color: "#333",
  },
});
