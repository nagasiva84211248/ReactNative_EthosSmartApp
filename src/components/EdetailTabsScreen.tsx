import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';
import { UniqueProductFileOutput, uniqueProductOutPutList } from './interfaces';
import TextInputFocusExample from './rnd';
import EdetailPlanningPreview from './EdetailPlanningPreview';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/appNavigation';

interface EdetailTabsScreenProps {
    MSLplannedproductslocal: Array<[]>;
    Unplannedproducts: Array<UniqueProductFileOutput> | [];
    ManualProducts: Array<uniqueProductOutPutList> | [];
}
const ModalPresentationStyle = {
    FULL_SCREEN: 'fullScreen',
    PAGE_SHEET: 'pageSheet',
    FORM_SHEET: 'formSheet',
    OVER_FULL_SCREEN: 'overFullScreen',
  };

const NUM_COLUMNS = 3;


const EdetailTabsScreen: React.FC<EdetailTabsScreenProps> = ({ MSLplannedproductslocal, Unplannedproducts, ManualProducts }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>> ();
    const [plannedPreview, setPlannedPreview] = useState<boolean>(false)
    const [tabIndex, setTabIndex] = useState<number>(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const pagerRef = useRef<PagerView>(null);
    const tabNames = ["Planned", "Unplanned", "Manual"];
    // const tabColors = ["#f8d7da", "#d1ecf1", "#d4edda"];
    const handleLayout = (event: any) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    };
    const ITEM_WIDTH = containerWidth ? containerWidth / NUM_COLUMNS - 20 : 100;

    useEffect(() => {
        console.log("MSLplannedproductslocal", MSLplannedproductslocal);
        console.log("Unplannedproducts", Unplannedproducts);
    }, [tabIndex])

    const _doChangeTabs = (index: number) => {
        setTabIndex(index)
    }

    const _doSelectSlide = (item: any) => {
        setPlannedPreview(true);
    }

    const _doClosePlannedPreview = () => {
        setPlannedPreview(false);
        console.log("PlannedPreview", plannedPreview);

    }

    const handleTabClick = (index: number) => {
        setTabIndex(index);
        pagerRef.current?.setPage(index);
    };

    return (
        <View style={[styles.mainContainer]}>
            {/* <TextInputFocusExample></TextInputFocusExample> */}
            <View style={styles.tabHeader}>
                {tabNames.map((name, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleTabClick(index)}
                        style={[styles.tabButton, tabIndex === index && styles.activeTab]}>
                        <Text style={tabIndex === index ? styles.activeTabText : styles.tabText}>{name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <PagerView
                ref={pagerRef}
                style={styles.pagerView}
                initialPage={0}
                onPageSelected={e => setTabIndex(e.nativeEvent.position)}>
                <View key="1">
                    <View style={styles.mainContainer} onLayout={handleLayout}>
                        {MSLplannedproductslocal && MSLplannedproductslocal.length > 0 ? (
                            <FlatList
                                keyExtractor={(item: any) => (item.ProductFile_ID)?.toString()}
                                data={MSLplannedproductslocal}
                                numColumns={NUM_COLUMNS}
                                renderItem={({ item }: any) => (
                                    <TouchableOpacity onPress={() => _doSelectSlide(item)}>
                                        <View style={[styles.container, { width: ITEM_WIDTH }]}>
                                            <Image
                                                style={styles.image}
                                                source={{ uri: `file://${item.ProductFile_ImageURL_local}` }}
                                                resizeMode="cover"
                                            />
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        ) : (
                            <View style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', width: '100%', height: '100%' }}>
                                <Text>No Product Found</Text>
                            </View>
                        )}
                    </View>
                </View>
                <View key="2">
                    <View style={styles.mainContainer} onLayout={handleLayout}>
                        {Unplannedproducts && Unplannedproducts.length > 0 ? (
                            <FlatList
                                keyExtractor={(item: any) => item.ProductFile_ID.toString()}
                                data={Unplannedproducts}
                                numColumns={NUM_COLUMNS}
                                renderItem={({ item }: any) => (
                                    <TouchableOpacity onPress={() => _doSelectSlide(item)}>
                                        <View style={[styles.container, { width: ITEM_WIDTH }]}>
                                            <Image
                                                style={styles.image}
                                                source={{ uri: `file://${item.ProductFile_ImageURL_localPath}` }}
                                                resizeMode="cover"
                                            />
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        ) : (
                            <View style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', width: '100%', height: '100%' }}>
                                <Text>No Product Found</Text>
                            </View>
                        )}
                    </View>
                </View>
                <View key="3">
                    <View style={styles.mainContainer} onLayout={handleLayout}>
                        {ManualProducts && ManualProducts.length > 0 ? (
                            <FlatList
                                keyExtractor={(item: any) => item.ProductGroup_ID.toString()}
                                data={ManualProducts}
                                numColumns={NUM_COLUMNS}
                                renderItem={({ item }: any) => (
                                    <TouchableOpacity onPress={() => _doSelectSlide(item)}>
                                        <View style={[styles.container, { width: ITEM_WIDTH }]}>
                                            {/* <Image
                                            style={styles.image}
                                            source={{ uri: `file://${item.ProductFile_ImageURL_localPath}` }}
                                            resizeMode="cover"
                                        /> */}
                                            <View style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', width: '100%', height: '100%' }}>
                                                <Text>{item.ProductGroup_Name}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        ) : (
                            <View style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', width: '100%', height: '100%' }}>
                                <Text>No Product Found</Text>
                            </View>
                        )}
                    </View>
                </View>
            </PagerView>
            <View>
            {
                plannedPreview ?
                    <Modal style={{flex:1,padding:0,margin:0}} navigationBarTranslucent={true} visible={plannedPreview} transparent={false} animationType="slide">
                        <View style={[styles.modalContainer, {padding:0}]}>
                            {/* <View style={styles.modalContent}> */}
                                {/* <TouchableOpacity onPress={() => setSelectedProduct(null)} style={styles.closeButton}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity> */}
                                <EdetailPlanningPreview plannedPreview={MSLplannedproductslocal} onClose={_doClosePlannedPreview} />
                            </View>
                        {/* </View> */}
                    </Modal>
                    : null

            }   
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    pagerView: {
        flex: 1,
    },
    mainContainer: {
        flex: 1,
        // paddingHorizontal: 10,
    },
    image: {
        height: '100%',
        width: '100%',
    },
    tabHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: 'white',
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: "#007bff",
    },
    tabText: {
        fontSize: 16,
        color: "#333",
    },
    activeTabText: {
        fontSize: 16,
        color: "white",
    },
    page: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
    },
    container: {
        height: 200,
        margin: 5,
        backgroundColor: 'lightgray',
        justifyContent: "center",
        alignItems: "center",
    },
    textCenter: {
        textAlign: 'center',
    },
    modalContainer: { flex: 1, height:'100%',width:'100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: '90%', height: '70%', backgroundColor: 'white', borderRadius: 10, padding: 20 },

});

export default EdetailTabsScreen