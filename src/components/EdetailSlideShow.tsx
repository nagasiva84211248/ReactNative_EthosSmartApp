import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { MSLDetailsinterface, UniqueProductFileOutput } from './interfaces';
import { Check_MSLplannedproduct_byFileId, Check_MSLplannedproduct_byGroupId, Delete_MSLplannedproduct_byFileId, Delete_MSLplannedproduct_ByGroupId, GET_MSLplannedproduct_byMSLID, Insert_MSLPlannedproduct_Details } from '../services/dbServices';

interface EdetailSlideShowProps {
    MSLrelatedProductSlides: Array<UniqueProductFileOutput>;
    selectedMsl: MSLDetailsinterface | null;
}

const NUM_COLUMNS = 3;

const EdetailSlideShow: React.FC<EdetailSlideShowProps> = ({ MSLrelatedProductSlides, selectedMsl }) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const [loader, setLoader] = useState<boolean>(false);
    const [MSlrelatedProdutsList, setMSlrelatedProdutsList] = useState<UniqueProductFileOutput[]>([])
    const planningNumbers = useRef<[]>([]);
    useEffect(() => {
        setMSlrelatedProdutsList(MSLrelatedProductSlides);
        _doAssignPlannedNumbers();
    }, [MSLrelatedProductSlides, selectedMsl])

    const handleLayout = (event: any) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    };

    // const _doSelectSlide = async (item: UniqueProductFileOutput) => {
    //     setLoader(true);
    //     console.log("selected Slide for planning", item);
    //     console.log("selectedMsl", selectedMsl);
    //     if (selectedMsl != null) {
    //         let checkMSLProdGroupCount: any = await Check_MSLplannedproduct_byGroupId(item.ProductGroup_ID, '', 0, 0, selectedMsl);
    //         let checkMSLProdFileMandatoryCount: any = await Check_MSLplannedproduct_byFileId(item.ProductFile_ID, '', 0, 0, selectedMsl);
    //         if (checkMSLProdGroupCount[0].count > 0 && checkMSLProdFileMandatoryCount[0].count > 0 && item.ProductFile_Mandatory === true) { // Mandatory file exist in local database delete that productGroupId record
    //             await Delete_MSLplannedproduct_ByGroupId(item.ProductGroup_ID, selectedMsl);
    //         } else if (checkMSLProdGroupCount[0].count > 0 && checkMSLProdFileMandatoryCount[0].count > 0 && item.ProductFile_Mandatory === false) { // not Mandatory file exist in local database delete that productFile record
    //             await Delete_MSLplannedproduct_byFileId(item.ProductFile_ID, selectedMsl);
    //         } else if (checkMSLProdGroupCount[0].count > 0) { // Insert the product group with file ID details
    //             await Insert_MSLPlannedproduct_Details(item.ProductGroup_ID, item.ProductFile_ID, 0, 0, '', 0, 0, item.EdetailingLanguageId, selectedMsl);
    //         } else {
    //             if (checkMSLProdFileMandatoryCount[0].count === 0) { // Insert the selected product Record 
    //                 await Insert_MSLPlannedproduct_Details(item.ProductGroup_ID, item.ProductFile_ID, 0, 0, '', 0, 0, item.EdetailingLanguageId, selectedMsl);
    //             }
    //             // Insert the product files which are madatory = true 
    //             let mandatoryprodid: any = MSLrelatedProductSlides.filter(mp => mp.ProductFile_Mandatory == true && mp.ProductGroup_ID == item.ProductGroup_ID);
    //             mandatoryprodid.forEach(async (ele: any) => {
    //                 await Insert_MSLPlannedproduct_Details(item.ProductGroup_ID, ele.ProductFile_ID, 0, 1, '', 0, 0, item.EdetailingLanguageId, selectedMsl);
    //             });
    //         }
    //     }
    //     setTimeout(() => {
    //         _doAssignPlannedNumbers();
    //     }, 3000);
    // }

    const _doSelectSlide = async (item: UniqueProductFileOutput) => {
        setLoader(true);
        try {
            if (selectedMsl) {
                let checkMSLProdGroupCount: any = await Check_MSLplannedproduct_byGroupId(item.ProductGroup_ID, '', 0, 0, selectedMsl);
                let checkMSLProdFileMandatoryCount: any = await Check_MSLplannedproduct_byFileId(item.ProductFile_ID, '', 0, 0, selectedMsl);
    
                if (checkMSLProdGroupCount[0].count > 0 && checkMSLProdFileMandatoryCount[0].count > 0 && item.ProductFile_Mandatory) {
                    await Delete_MSLplannedproduct_ByGroupId(item.ProductGroup_ID, selectedMsl);
                } else if (checkMSLProdGroupCount[0].count > 0 && checkMSLProdFileMandatoryCount[0].count > 0) {
                    await Delete_MSLplannedproduct_byFileId(item.ProductFile_ID, selectedMsl);
                } else if (checkMSLProdGroupCount[0].count > 0) {
                    await Insert_MSLPlannedproduct_Details(item.ProductGroup_ID, item.ProductFile_ID, 0, 0, '', 0, 0, item.EdetailingLanguageId, selectedMsl);
                } else {
                    if (checkMSLProdFileMandatoryCount[0].count === 0) {
                        await Insert_MSLPlannedproduct_Details(item.ProductGroup_ID, item.ProductFile_ID, 0, 0, '', 0, 0, item.EdetailingLanguageId, selectedMsl);
                    }
                    let mandatoryprodid: any = MSLrelatedProductSlides.filter(
                        (mp) => mp.ProductFile_Mandatory && mp.ProductGroup_ID == item.ProductGroup_ID
                    );
                    for (const ele of mandatoryprodid) {
                        await Insert_MSLPlannedproduct_Details(item.ProductGroup_ID, ele.ProductFile_ID, 0, 1, '', 0, 0, item.EdetailingLanguageId, selectedMsl);
                    }
                }
            }
    
            await _doAssignPlannedNumbers();
        } catch (error) {
            console.error("Error selecting slide:", error);
        } finally {
            setLoader(false);
        }
    };
    

    const _doAssignPlannedNumbers = async () => {
        if (selectedMsl) {
            const getPlannedMslDetails: any = await GET_MSLplannedproduct_byMSLID('', 0, 0, 0, selectedMsl);
            console.log("getPlannedMslDetails", getPlannedMslDetails);
            if (getPlannedMslDetails && getPlannedMslDetails.length > 0) {
                let checkMSLPlanned = MSLrelatedProductSlides.filter((item: any) => getPlannedMslDetails.some((element: any) => Number(selectedMsl.MSL_ID) === element.MSL_ID && item.ProductFile_ID === element.ProductFile_ID && item.ProductGroup_ID === element.ProductGroup_ID));
                // let copyMSLrelatedProductSlides = [...MSLrelatedProductSlides]
                // setMSlrelatedProdutsList(
                //     copyMSLrelatedProductSlides.map((element, index) => {
                //        let findIndex = checkMSLPlanned.findIndex((item: any) => item.ProductFile_ID === element.ProductFile_ID && item.ProductGroup_ID === element.ProductGroup_ID)
                //         let data = {
                //             ...element,
                //             'plannedNumber': findIndex != -1 ? findIndex + 1 : 0
                //         }
                //         return data;
                //     })
                // )

                setMSlrelatedProdutsList((prevState) =>
                    prevState.map((element) => {
                        let findIndex = checkMSLPlanned.findIndex(
                            (item: any) =>
                                item.ProductFile_ID === element.ProductFile_ID &&
                                item.ProductGroup_ID === element.ProductGroup_ID
                        );
                        return {
                            ...element,
                            plannedNumber: findIndex !== -1 ? findIndex + 1 : 0,
                        };
                    })
                );
            }
        }
        setLoader(false);

    }


    const ITEM_WIDTH = containerWidth ? containerWidth / NUM_COLUMNS - 20 : 100;

    if (loader) {
        return <View style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            backgroundColor: 'transparent',
            alignItems: "center",
        }}>
            <ActivityIndicator size={80} color="pink" />
        </View>
    } else {
        return (
            <View style={styles.mainContainer} onLayout={handleLayout}>
                {MSlrelatedProdutsList && MSlrelatedProdutsList.length > 0 ? (
                    <FlatList
                        keyExtractor={(item) => item.ProductFile_ID.toString()}
                        data={MSlrelatedProdutsList}
                        numColumns={NUM_COLUMNS}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => _doSelectSlide(item)}>
                                <View style={[styles.container, { width: ITEM_WIDTH }]} >
                                    <View style={[styles.newContainer]}>
                                        <Image source={require('../assets/images/new.png')} style={styles.starImage}></Image>
                                    </View>
                                    {
                                        (item.plannedNumber != 0 && item.plannedNumber != undefined) ?
                                            <View style={styles.planningNumContainer}>
                                                <Text style={styles.planNumText}>{item.plannedNumber}</Text>
                                            </View>
                                            : null

                                    }
                                    <Image
                                        style={styles.image}
                                        source={{ uri: `file://${item.ProductFile_ImageURL_localPath}` }}
                                        resizeMode="cover"
                                    />
                                    <View style={[styles.mandatoryContainer]}>
                                        <Image source={require('../assets/images/star.png')} style={styles.starImage}></Image>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                ) : (
                    <View style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        backgroundColor: 'transparent',
                        alignItems: "center",
                    }}>
                        <Text>No Product Found</Text>
                    </View>
                )}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    container: {
        height: 200,
        margin: 5,
        backgroundColor: 'lightgray',
    },
    image: {
        height: '100%',
        width: '100%',
    },
    planningNumContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#aa501c',
        borderBottomLeftRadius: 25,
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 25,
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 10,
    },
    mandatoryContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 10,
    },
    newContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
    },
    planNumText: {
        color: '#fff',
        fontSize: 15
    },
    starImage: {
        height: 30,
        width: 30
    }
});

export default EdetailSlideShow;

