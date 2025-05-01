import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, Pressable, View, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { ModalViewProps, ModelMultiSelection } from './interfaces';
import { mediaQueries } from '../assets/fonts/media-queries';
import CheckBox from './CheckBox';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const ModalView: React.FC<ModalViewProps> = ({ visible, onClose, onSubmit, data, resetCheckboxState }) => {
    const [toggleCheckBoxState, setToggleCheckBoxState] = useState<boolean[]>(
        data.map(item => item.selected ? true : false)
      );

    useEffect(() => {
        if (visible && resetCheckboxState) {
            console.log("data",data,);
            console.log("flag",data[0].flag);
            
            if(data[0].flag === 'empDetails'){
                setToggleCheckBoxState(new Array(data.length).fill(false));
            }else if(data[0].flag === "productLanguageDetails"){
                setToggleCheckBoxState(data.map(item => item.selected ? true : false))
            }

        }
    }, [visible, resetCheckboxState, data.length]);

    const _doChangeToggle = (index: number) => {
        if(data[0].flag === 'empDetails'){
            const updatedToggleState = [...toggleCheckBoxState];
            updatedToggleState[index] = !updatedToggleState[index];
            setToggleCheckBoxState(updatedToggleState);
        }else if(data[0].flag === "productLanguageDetails"){
            if(data[index].id != 1){
                const updatedToggleState = [...toggleCheckBoxState];
                updatedToggleState.forEach((ele,i)=>{
                    if(i != 0){
                        updatedToggleState[i] = false;
                    }
                })                
                updatedToggleState[index] = !updatedToggleState[index];
                setToggleCheckBoxState(updatedToggleState);
            }
        }        
    };

    const getToggledItems = (): ModelMultiSelection[] => {
        return data.filter((item, index) => toggleCheckBoxState[index]);
    };

    const handleSubmit = () => {
        const selectedItems = getToggledItems();
        onSubmit(selectedItems);
        onClose();
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={visible}
                    backdropColor={'transparent'}
                    onRequestClose={onClose}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.headerBackground}>
                                <Text style={styles.headerText}>MultiSelect</Text>
                            </View>
                            <ScrollView>
                                {
                                    data.map((item, index) => (
                                        <View style={styles.viewContainer} key={String(item.id)}>
                                            <Text style={styles.textStyle}>{item.name}</Text>
                                            <CheckBox
                                                onPress={() => _doChangeToggle(index)}
                                                toggleCheckBox={toggleCheckBoxState[index]}
                                            />
                                        </View>
                                    ))
                                }
                            </ScrollView>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={[styles.button, styles.buttonClose, { marginRight: 20 }]} onPress={onClose}>
                                    <Text style={[styles.textStyle, { color: '#fff' }]}>Close</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={handleSubmit}>
                                    <Text style={[styles.textStyle, { color: '#fff' }]}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default ModalView;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        // padding: 35,
        paddingTop:0,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        height: screenHeight * 0.7,
        width: screenWidth * 0.9,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        fontWeight: 'bold',
        fontSize: mediaQueries.fontSize.large
    },
    viewContainer: {
        width: '100%',
        display: 'flex',
        padding: 13,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    buttonContainer: {
        padding: 10,
        paddingTop: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    headerText: {
        fontSize: mediaQueries.fontSize.large,
        fontWeight: 600,
        color:'#000'
    },
    headerBackground:{
        backgroundColor:'#ccc',
        width:'100%',
        padding:15,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
    }
});
