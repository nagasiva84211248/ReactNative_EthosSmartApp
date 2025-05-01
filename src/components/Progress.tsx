import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';

interface ProgressBarProps {
    DownloadContent: number;
    DownloadProgress: number;
}

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const ProgressBar: React.FC<ProgressBarProps> = ({ DownloadContent, DownloadProgress }) => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
            setProgress(DownloadContent > 0 ? DownloadProgress / DownloadContent : 0);
        return(()=>{
            setProgress(1)
        })
    }, [DownloadContent, DownloadProgress]);

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={true}
            backdropColor={'transparent'}
        >
            <View style={styles.container}>
                <Progress.Pie style={styles.progress} progress={progress} size={100} color={'#16c70d'} borderColor={'#fff'} />
                {/* Optional text to display progress */}
                {/* <Text style={styles.progressText}>
                    {Math.round(progress * 100)}%
                </Text> */}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        display:'flex',
        justifyContent:'center',
        alignContent:'center',
        flexDirection:'row',
        margin: 20,
        height:"100%",
        backgroundColor: 'transparent',
        borderRadius: 20,
        paddingTop: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: 'auto',
        alignItems: 'center',
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    progress: {
        margin: 10,

        // width:"90%"
    },
    progressText: {
        fontSize: 16,
        marginTop: 10,
        color:'#fff'
    },
});

export default ProgressBar;
