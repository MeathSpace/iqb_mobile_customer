import { Pressable, StyleSheet, Text, View } from 'react-native'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import React from 'react'
import { useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

const AdvertiseCard = ({ item }) => {

    const { colors } = useTheme()
    const router = useRouter()


    return (
        <Pressable
            onPress={() => {
                if (item?.link) {
                    router.push(item?.link)
                }

            }}
            style={[styles.cardWrapper, {}]}>
            <Image
                style={[styles.cardImage, {
                    borderColor: colors.queueBorder
                }]}
                source={{ uri: item.url }}
                contentFit="cover"
                transition={300}
            />
        </Pressable>
    )
}

export default AdvertiseCard

const styles = StyleSheet.create({
    cardWrapper: {
        // height: verticalScale(200),
        // paddingVertical: verticalScale(20),
        // marginBottom: verticalScale(10),
        width: scale(350),
        paddingHorizontal: scale(15),
        backgroundColor: "rgba(0,0,0,0.1)"
    },
    cardImage: {
        // height: "100%",
        height: verticalScale(70),
        width: "100%",
        borderRadius: scale(0),
        borderWidth: scale(0)
    }
})