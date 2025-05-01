import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface CustomButtonProps {
  title: string;
  color: string;
  width?: string | number;
  onPress: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, color, width = '100%', onPress }) => {
  return (
    <TouchableOpacity
    style={[styles.button, { backgroundColor: color, width: width as ViewStyle['width'] }]} // Typecast width to match ViewStyle 
    onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;
