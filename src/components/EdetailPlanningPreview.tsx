import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import PagerView from 'react-native-pager-view';

interface EdetailPlanningPreviewProps {
    plannedPreview: Array<any>,
    onClose: () => void
}

const EdetailPlanningPreview: React.FC<EdetailPlanningPreviewProps> = ({ plannedPreview, onClose }) => {
    useEffect(() => {
        console.log("plannedPreview", plannedPreview);
    }, []);

    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Image source={require('../assets/images/close.png')} style={styles.closeImage} />
            </TouchableOpacity>

            <PagerView style={styles.pagerView} initialPage={0}>
                {plannedPreview && plannedPreview.length > 0 ? (
                    plannedPreview.map((item, index) => (
                        <View key={index.toString()} style={styles.pageContainer}>
                            <Image
                                style={styles.slideImage}
                                source={{ uri: `file://${item.ProductFile_ImageURL_local}` }}
                                resizeMode='stretch'
                            />
                        </View>
                    ))
                ) : (
                    <View style={styles.noProductContainer}>
                        <Text>No Product Found</Text>
                    </View>
                )}
            </PagerView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
    pagerView: {
        flex: 1,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
    },
    closeImage: {
        height: 50,
        width: 50,
        padding: 0,
        margin: 0
    },
    pageContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    slideImage: {
        height: '100%',
        width: '100%',
    },
    noProductContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default EdetailPlanningPreview;
