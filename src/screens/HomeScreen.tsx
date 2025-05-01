import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { mediaQueries } from '../assets/fonts/media-queries';
import ProfileHeader from '../components/profileHeader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/appNavigation';
import { Route } from 'lucide-react-native';
import Orientation from 'react-native-orientation-locker';

const HomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [keyExtractor, setKeyExtractor] = useState<number>(0);
    const [numColumns, setNumColumns] = useState(2);  // Initially set to 2 columns

    useEffect(() => {
        Orientation.unlockAllOrientations();
        // Here you could change the number of columns if needed
    }, [keyExtractor]);

    const tempdata: any = [
        {
            id: 0,
            name: 'Dashboard',
            menus: [
                {
                    id: 0,
                    name: 'Dashboard',
                    imageName: require('../assets/images/dashboardmenu.png'),
                },
            ],
        },
        {
            id: 1,
            name: 'Data Sync',
            routeName:'sync',
            menus: [
                {
                    id: 0,
                    name: 'Data Sync',
                    imageName: require('../assets/images/syncmenu.png'),
                },
            ],
        },
        {
            id: 2,
            name: 'MSL',
            imageName: 'edetailingmenu',
            menus: [
                {
                    id: 0,
                    name: 'MSL Survey',
                    imageName: require('../assets/images/mslsurvey.png'),
                },
                {
                    id: 1,
                    name: 'Update MSL Details',
                    imageName: require('../assets/images/MSLupdate.png'),
                },
            ],
        },
        {
            id: 3,
            name: 'Business Card',
            imageName: 'edetailingmenu',
            menus: [
                {
                    id: 0,
                    name: 'Business / Visiting Card',
                    imageName: require('../assets/images/businesscard.png'),
                },
            ],
        },
        {
            id: 4,
            name: 'E-detailing',
            routeName:'edetailProductList',
            imageName: 'edetailingmenu',
            menus: [
                {
                    id: 0,
                    name: 'E-detailing',
                    imageName: require('../assets/images/businesscard.png'),
                },
                {
                    id: 1,
                    name: 'E-Reporting',
                    imageName: require('../assets/images/businesscard.png'),
                },
            ],
        },
        {
            id: 5,
            name: 'Scientific Event',
            imageName: 'edetailingmenu',
            menus: [
                {
                    id: 0,
                    name: 'Scientific Event',
                    imageName: require('../assets/images/scientificevent.png'),
                },
                {
                    id: 1,
                    name: 'Scientific Event - Invoice/Expense',
                    imageName: require('../assets/images/invoice-expense.png'),
                },
                {
                    id: 2,
                    name: 'Scientific Event',
                    imageName: require('../assets/images/scientificevent.png'),
                },
                {
                    id: 3,
                    name: 'Scientific Event - Invoice/Expense',
                    imageName: require('../assets/images/invoice-expense.png'),
                },
            ],
        },
    ];

    const _doClearLogout = () => {
        console.log('clear Logout ');
        navigation.reset({
            index: 0,
            routes: [{ name: 'login' }],
        });
    };

    const _doChangeMenus = (index: number) => {
        setKeyExtractor(index);
    };

    const _doNaviagteToRequiredpage = (index:number) => {
        console.log("index",tempdata[keyExtractor].routeName);
        navigation.navigate(tempdata[keyExtractor].routeName);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <View style={styles.mainContainer}>
                    <Text style={styles.text}> Home </Text>
                    <View style={styles.profileContiner}>
                        <ProfileHeader onClose={_doClearLogout} />
                    </View>

                    <View style={[styles.container, { flexDirection: 'row' }]}>
                        <View style={{ flex: 2, backgroundColor: '#fff' }}>
                            <FlatList
                                data={tempdata}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => _doChangeMenus(item.id)}>
                                        <View style={[styles.sideMenuListContainer,{backgroundColor: keyExtractor === item.id ? '#c1a78d' : '#fff'}]}>
                                            <Text style={styles.sideMenuList}>{item.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>

                        <View style={{ flex: 4, backgroundColor: '#fff' }}>
                            <FlatList
                                key={numColumns}
                                data={tempdata[keyExtractor].menus}
                                keyExtractor={(item) => item.id}
                                numColumns={numColumns}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.MenuListContainer} onPress={() => _doNaviagteToRequiredpage(item.id)}>
                                        <View >
                                            <Image style={styles.image} source={item.imageName}></Image>
                                            <Text style={styles.sideMenuList}>{item.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 0,
    },
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        marginTop: 40,
    },
    text: {
        fontSize: mediaQueries.fontSize.medium,
        color: '#e74856',
        textAlign: 'center',
    },
    sideMenuList: {
        fontSize: mediaQueries.fontSize.medium,
        color: '#000',
        textAlign: 'left',
    },
    profileContiner: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    sideMenuListContainer: {
        backgroundColor: '#c1a78d',
        margin: 10,
        padding: 10,
        borderRadius: 10
    },
    MenuListContainer: {
        backgroundColor: '#fff',
        margin: 10,
        padding: 10,
        elevation: 10,
        boxShadow: '1 2 3 #000',
        borderRadius: 10,
        // height: 100,
        flex: 1,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    wrapMenus: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Even spacing between items
    },
    image: {
        width: 50,
        height: 50
    }
});

export default HomeScreen;
