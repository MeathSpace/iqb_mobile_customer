import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomText from '../../components/CustomText'
import { useRouter } from 'expo-router'

const SingleJoinSuccessPage = () => {

    const router = useRouter()

    return (
        <View style={{
            padding: 20
        }}>
            <CustomText style={{ fontSize: 28 }}>singleJoinSuccessPage</CustomText>

            <TouchableOpacity
                onPress={() => {
                    router.dismissTo("/queuelist")
                }}
            >
                <CustomText>Go to queuelist</CustomText>
            </TouchableOpacity>
        </View>
    )
}

export default SingleJoinSuccessPage

const styles = StyleSheet.create({})