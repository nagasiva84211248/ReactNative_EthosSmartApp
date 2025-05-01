import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Check, Square } from 'lucide-react-native'

interface CheckBoxProps {
    onPress: () => void;
    toggleCheckBox: boolean;
}

const CheckBox: React.FC<CheckBoxProps> = ({ onPress, toggleCheckBox }) => (
    <TouchableOpacity onPress={onPress}>
        {toggleCheckBox ? (
            <Check color="red" size={30} />
        ) : (
            <Square color="red" size={30} />
        )}
    </TouchableOpacity>
)

export default CheckBox
