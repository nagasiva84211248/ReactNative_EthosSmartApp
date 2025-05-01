import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'

const Loader = () => {
    return (
        <View style={styles.loaderContainer}>
           <ActivityIndicator size="large" color="#000" />
        </View>
    )
}

export default Loader

const styles = StyleSheet.create({
    loaderContainer:{
        height:"100%",
        width:"100%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
    }
})