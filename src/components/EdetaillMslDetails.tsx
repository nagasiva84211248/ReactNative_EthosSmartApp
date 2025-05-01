import { View, Text, Image, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { mediaQueries } from '../assets/fonts/media-queries';
import { Get_Msl_Master_Output_Details, GetRepSyncColumnDetails } from '../services/dbServices';
import { DropDownProps, DropdownSingleSelect, ModalViewProps, MSLDetailsinterface, MSlMasterValueInterface } from './interfaces';
import Loader from './Loader';
import DropDown from './DropDown';

interface edetailMslProps {
    onpress: (selectedPlanEdetaing: number, selectedMSL: MSLDetailsinterface) => void;
    onPressMslList : () => void;
}

const EdetaillMslDetails: React.FC<edetailMslProps> = ({ onpress, onPressMslList }) => {
    const [MSlDetails, setMSlDetails] = useState<MSLDetailsinterface[]>([]);
    const [loader, setloader] = useState<boolean>(false)
    const [masterValueOutput, setMasterValueOutput] = useState<DropdownSingleSelect[]>([]);
    const [selectedMslTypeDetails, setSelectedMslTypeDetails] = useState<MSlMasterValueInterface>()
    useEffect(() => {
        _doGetMasterValueOutPut();
    }, [])

    useEffect(() => {
        console.log("MSlDetail==", MSlDetails);
        console.log("masterValueOutput", masterValueOutput);
        setloader(false);
    }, [MSlDetails, masterValueOutput])

    const _doGetMslDetails = async (selectedMSlType: DropdownSingleSelect) => {
        setloader(true)
        const msl = await GetRepSyncColumnDetails('msloutput');
        if (JSON.parse(msl.msloutput).length > 0 && JSON.parse(msl.msloutput) != undefined && JSON.parse(msl.msloutput) != null) {
            let convertMslDetailsJSONDetails: any = [];
            convertMslDetailsJSONDetails = JSON.parse(msl.msloutput).filter((f: any) => (f.MSL_Type_ID).toString() === (selectedMSlType.id).toString());
            if (convertMslDetailsJSONDetails.length > 0) {
                convertMslDetailsJSONDetails.forEach((ele: any, i: number) => {
                    ele.id = i + 1;
                    ele.SelectedDoctorPlanDetainTabVisibility = false;
                })
                setMSlDetails(convertMslDetailsJSONDetails);
            } else {
                setMSlDetails([]);
                setloader(false);
            }
        } else {
            console.log("else called");
            setMSlDetails([]);
        }
    }

    const _doGetMasterValueOutPut = async () => {
        const masterValueOutPut: MSlMasterValueInterface[] = await Get_Msl_Master_Output_Details();
        let mappedValue: any = masterValueOutPut.map((ele: MSlMasterValueInterface) => {
            let data = {
                'id': ele.MSLTypeId,
                'name': ele.MSLType
            }
            return data
        })
        setMasterValueOutput(mappedValue);
        console.log("masterValueOutPut", masterValueOutPut);
    }

    const _doSelectDoctor = (item: number) => {
        const updatedDetails = MSlDetails.map((ele, index) => ({
            ...ele,
            SelectedDoctorPlanDetainTabVisibility: index === item - 1
        }));
        setMSlDetails(updatedDetails);
        onPressMslList();
    }

    const _doGetDropdownResult = (selecteData: DropdownSingleSelect) => {
        console.log("selecteData", selecteData);
        selectedMslTypeDetails
        _doGetMslDetails(selecteData)
    }

    const _doSelectPlanning = (identifier: number, seletedMSl: MSLDetailsinterface) => {
        console.log("identifier", identifier);
        onpress(identifier, seletedMSl)
    }
    if (loader) {
        return <Loader />
    } else {
        return (

            <View style={{ height: '100%' }}>
                <View style={styles.container}>
                    <View style={styles.subContainer}>
                        <View style={styles.homeContainer}>
                            <Image style={styles.homeImage} source={require('../assets/images/home.png')}></Image>
                            <Text style={[styles.text, { marginLeft: 10 }]}>Home</Text>
                        </View>
                        <View>
                            <Image style={styles.homeImage} source={require('../assets/images/next.png')}></Image>
                        </View>
                    </View>
                    {

                    }
                    <View style={styles.flatlistContaner}>
                        <View style={styles.selectDropdownContainer}>
                            <DropDown data={masterValueOutput} onpress={(selectedItems: DropdownSingleSelect) => _doGetDropdownResult(selectedItems)} />
                        </View>

                        {MSlDetails && MSlDetails.length > 0 ?
                            <FlatList
                                data={MSlDetails}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.planningDetailingContainer}>
                                        <TouchableOpacity onPress={() => _doSelectDoctor(item.id)}>
                                            <View style={styles.contentView}>
                                                <Text style={styles.text} >{item.MSL_Name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        {
                                            item.SelectedDoctorPlanDetainTabVisibility === true ?
                                                <View key={item.id} style={[styles.planingContainer]}>
                                                    <TouchableOpacity style={[styles.planningButton, { backgroundColor: item.SelectedDoctorPlanDetainTabVisibility ? '#eab676' : '#eeeee4' }]} onPress={() => _doSelectPlanning(0, item)}>
                                                        <View style={[styles.copyContentView]}>
                                                            <Text style={[styles.text, { color: '#000' }]} >Planning</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[styles.planningButton, { backgroundColor: item.SelectedDoctorPlanDetainTabVisibility ? '#eeeee4' : '#eab676' }]} onPress={() => _doSelectPlanning(1, item)}>
                                                        <View style={[styles.copyContentView]}>
                                                            <Text style={[styles.text, { color: '#000' }]} >Detailing</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                                : null
                                        }

                                    </View>

                                )}
                            ></FlatList>
                            : <View style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', width: '100%', height: '100%' }}>
                                <Text style={styles.text} >No Select Type</Text>
                            </View>
                        }
                    </View>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    subContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "100%",
        padding: 10
    },
    homeContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    text: {
        fontSize: mediaQueries.fontSize.small,
        color: '#000',
        textAlign: 'left',
    },
    homeImage: {
        height: 30,
        width: 30
    },
    contentView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // padding: 10,
        margin: 5
    },
    copyContentView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        width: '100%'
    },
    flatlistContaner: {
        width: '100%',
        height: '90%'
    },
    planningDetailingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '90%',
        // borderRadius: 15,
        borderWidth: 1,
        margin: 10,
        paddingBottom: 2
    },
    planingContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '99%',
    },
    planningButton: {
        width: '50%',
        backgroundColor: '#eab676'
    },
    selectDropdownContainer: {
        width: '100%',
        marginBottom: 10
    }

});

export default EdetaillMslDetails