import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Get_Login_Output_Details } from '../services/dbServices';
import RNFS from 'react-native-fs';
import { LoginDetails } from './interfaces';
import { mediaQueries } from '../assets/fonts/media-queries';

interface profileHeaderProps {
    onClose: () => void;
}

const ProfileHeader: React.FC<profileHeaderProps> = ({ onClose }) => {
    const [loginDetails, setLoginDetails] = useState<LoginDetails | null>(null);
    const [profileImage, setProfileImage] = useState<string>('');

    useEffect(() => {
        _doGetLoginDetails();
    }, []);

    const _doGetLoginDetails = async () => {
        console.log("Fetching login details...");
        const details = await Get_Login_Output_Details();
        if (details.length > 0) {
            setLoginDetails(details[0]);
            const LocalProfileImageAddress = `${RNFS.DocumentDirectoryPath}/profile/${details[0].Profile_Image.split('/').pop()}`;
            const fileExists = await RNFS.exists(LocalProfileImageAddress);
            if (fileExists) {
                setProfileImage('file://' + LocalProfileImageAddress);
            }
        }
    };

    if (loginDetails) {
        return (
            <View style={styles.main}>
                <View style={styles.proImageContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={profileImage ? { uri: profileImage } : require('../assets/images/userAvatar.png')}
                            style={styles.image}
                        ></Image>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{loginDetails.EmployeeName}</Text>
                        <Text style={styles.text}>{loginDetails.Employee_Code} , {loginDetails.Designation_Name} , {loginDetails.HeadQuarter_Name}</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity onPress={onClose}>
                            <Image
                                source={require('../assets/images/signoutbutton2.png')}
                                style={styles.image}
                            ></Image>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    } else {
        return (
            <View style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#000', fontSize: 15 }}>Profile details loading ...</Text>
            </View>
        );
    }
};

export default ProfileHeader;

const styles = StyleSheet.create({
    main: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        height: '100%',
        width: "100%",
        backgroundColor: '#006665',
        padding: 10,
        borderRadius: 10,
    },
    imageContainer: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        borderWidth: 2,
        height: 75,
        width: 75,
        borderColor: '#000',
        padding: 4,
        backgroundColor: '#fff',
        marginRight: 10
    },
    image: {
        borderRadius: 50,
        height: 65,
        width: 65
    },
    text: {
        fontSize: mediaQueries.fontSize.medium,
        color: "#fff",
    },
    textContainer: {
        // justifyContent:'space-between'
    },
    proImageContainer: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center",
    }
});
