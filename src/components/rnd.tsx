import React, { useRef } from "react";
import { View, TextInput, Button } from "react-native";

const TextInputFocusExample = () => {
  const inputRef = useRef<TextInput>(null); // Correct type for ref

  const handleFocus = () => {
    console.log("Focus button clicked"); // Debugging log
    if (inputRef.current) {
      inputRef.current.focus(); // Programmatically focus the TextInput
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput 
        ref={inputRef}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        placeholder="Type something..."
      />
      <Button title="Focus Input" onPress={handleFocus} />
    </View>
  );
};

export default TextInputFocusExample;
