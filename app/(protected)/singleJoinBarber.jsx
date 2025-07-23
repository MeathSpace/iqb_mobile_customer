import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomText from '../../components/CustomText'
import { useRouter } from 'expo-router'

const SingleJoinBarber = () => {

    const router = useRouter()

    return (
        <View style={{
            padding: 20
        }}>
            <CustomText style={{ fontSize: 28 }}>SingleJoinBarber</CustomText>

            <TouchableOpacity
                onPress={() => {
                    router.push("/singleJoinSuccessPage")
                }}
            >
                <CustomText>Single Join Success Page</CustomText>
            </TouchableOpacity>
        </View>
    )
}

export default SingleJoinBarber

const styles = StyleSheet.create({})