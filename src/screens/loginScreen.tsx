import { View, Text, Dimensions, Image, TextInput, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { mediaQueries } from '../assets/fonts/media-queries';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/appNavigation';
import { Toast } from "react-native-toast-notifications";
import ethosServices from '../services/ethosServices';
import { Get_Login_Output_Details, Insert_GetReport_Output_Details, Insert_Login_Output_Details, Insert_Msl_Master_Output_Details } from '../services/dbServices';
import RNFS, { DownloadBeginCallbackResult, DownloadProgressCallbackResult } from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import Loader from '../components/Loader';
import {request, PERMISSIONS} from 'react-native-permissions';



// var RNFS = require('react-native-fs');

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const [loader, setLoader] = useState(false);
    const [userName, onChangeText] = useState('ZA-zm-patna1');
    const [password, onChangeNumber] = useState('emp1392');
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const _doLogin = () => {
        console.log("called");
        if (userName.trim() === "") {
            Toast.show('Please enter username', { type: 'warning' });
        } else if (password.trim() === "") {
            Toast.show('Please enter password', { type: 'warning' });
        } else {
            setLoader(true);
            let data = {
                username: userName,
                password: password
            }
            
            ethosServices.post(data, "login/login").then(async (result) => {
                console.log("result", result);
                if (result.result === 1) {
                    request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then((status) => {
                        console.log("ACCESS_COARSE_LOCATION",status);
                    });
                    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((status) => {
                        console.log("ACCESS_FINE_LOCATION",status);
                    });
                    Toast.show(result.message_output, { type: 'success' });
                    Insert_Login_Output_Details(JSON.parse(result.login_output)[0]); //Insert Login_Output_Details
                    Insert_Msl_Master_Output_Details(JSON.parse(result.msl_master_output));//Insert Msl_Master_Output_Details
                    let loginOutPutDetails = JSON.parse(result.login_output)[0];
                     downloadFile(loginOutPutDetails.Profile_Image);
                }
            })
        }
    }

    const downloadFile = async (url: string) => {
        console.log("downloadFile called")
            if (url != undefined && url != undefined && url != null) {
                const fromUrl = url
                const directory = `${RNFS.DocumentDirectoryPath}/profile`;
                const exists = await RNFS.exists(directory);
                if (exists) {
                    await RNFS.unlink(directory);
                }
                const path = RNFS.DocumentDirectoryPath + '/profile';
                await RNFS.mkdir(path);
                const toFile = `${RNFS.DocumentDirectoryPath}/profile/${url.split('/').pop()}`;
                console.log("toFile",toFile);
                const options = {
                    fromUrl: fromUrl,
                    toFile: toFile,
                    begin: (res: DownloadBeginCallbackResult) => {
                    },
                    progress: (res: DownloadProgressCallbackResult) => {},
                };

                RNFS.downloadFile(options).promise
                    .then(async (res) => {
                        if (res.statusCode === 200) {
                        } else {
                            Toast.show("The profile image is not able to be downloaded.", { type: 'warning' })
                        }
                    })
                    .catch((error) => {
                        console.error('Error downloading file:', error);
                    });
            }
            _doGetReportInFo();
    };

    const _doGetReportInFo = async () => {
        console.log("_doGetReportInFo called")
        const loginDetails: any = await Get_Login_Output_Details();
        console.log("loginDetails",loginDetails);
        
        const body ={
            employeeid: (loginDetails[0].Employee_ID).toString(),
            subterritoryid: loginDetails[0].Sub_Territory_ID.toString(),
            designationid: loginDetails[0].Designation_ID.toString(),
            device: DeviceInfo.getDeviceType(),
            divisionid: Number(loginDetails[0].Division_ID),
        };
        console.log(body);
        
        ethosServices.post(body, "login/LastReport").then(async (res) => {
            console.log("_doGetReportInFo", res);
            Insert_GetReport_Output_Details(res);
            setLoader(false);
            navigation.reset({
                index: 0,
                routes: [{ name: 'sync' }]
            });
            // navigation.navigate('sync');
        })
    }

    if (loader) {
        return (
            <Loader />
        );
    } else {
        return (
            <SafeAreaProvider>
                <SafeAreaView>
                    <View style={styles.main}>
                        <View style={styles.Container}>
                            <View style={styles.imageContainer}>
                                <Image source={require('../assets/images/ethos.png')} style={styles.image}></Image>
                            </View>
                            <TextInput style={styles.input} placeholder="UserName" onChangeText={onChangeText} value={userName} ></TextInput>
                            <TextInput style={styles.input} placeholder="Password" keyboardType="numeric" onChangeText={onChangeNumber} value={password} ></TextInput>
                            <View style={styles.button}>
                                <CustomButton title="Login" color="#ff6600" width='100%' onPress={() => _doLogin()}></CustomButton>
                            </View>
                            <View style={styles.extraContent}>
                                <Text style={styles.text}>Support</Text>
                                <Text style={styles.text}>Call us: 1800 121 9344,1800 419 4080</Text>
                                <Text style={styles.text}>Email Us: ethossupport.himalaya@wipro.com</Text>
                                <Text style={styles.text}>Available: @ Mon-sun:9:00pm</Text>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        )
    }

}



const styles = StyleSheet.create({
    main: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        height: '100%',
        width: "100%",
        backgroundColor: '#fff',
        padding: 20
    },

    Container: {
        display: 'flex',
        justifyContent: "flex-start",
        flexDirection: 'column',
        alignItems: 'center',
        // height: height > 900 ? 600 : 300,
        width: width > 500 ? 700 : '100%',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: "#fefefe",
        boxShadow: '1 2 15 #ccc',
        padding: 15,
        marginTop: 40

    },

    imageContainer: {
        height: height > 900 ? 40 : 10,
        marginBottom: 30
    },

    image: {
        height: height > 900 ? 45 : 30,
        width: width > 500 ? 100 : 80,
        marginBottom: 30
    },

    input: {
        height: height > 900 ? 60 : 40,
        width: '100%',
        margin: 12,
        borderColor: '#fff',
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: "#fefefe",
        boxShadow: '1 2 15 #ccc',
        padding: 5,
        fontSize: mediaQueries.fontSize.medium,
    },

    button: {
        marginTop: 10,
        width: '100%',
    },
    text: {
        fontSize: mediaQueries.fontSize.small,
        marginBottom: 5
    },
    extraContent: {
        display: 'flex',
        alignItems: 'flex-start',
        width: '100%',
        marginTop: 30
    }
});