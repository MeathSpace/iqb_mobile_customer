import { Pressable, StyleSheet, Text, View } from 'react-native'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import React from 'react'
import { useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';
import CustomText from './CustomText';

const SalonCard = ({ item, setSelectedCustomerSalon }) => {

    const { colors } = useTheme()

    return (
        <Pressable onPress={() => setSelectedCustomerSalon({
            open: true,
            data: item
        })}>
            <View style={[styles.cardWrapper, { backgroundColor: colors.background }]}>
                <Image
                    style={styles.cardImage}
                    source={{ uri: item.image }}
                    contentFit="cover"
                    transition={1000}
                />
                <View
                    style={styles.cardContentWrapper}
                >
                    <Image
                        style={{ height: moderateScale(35), width: moderateScale(35), borderRadius: moderateScale(20) }}
                        source="https://marketplace.canva.com/EAGUXS_OW4A/1/0/1600w/canva-purple-abstract-feminine-woman-hair-salon-line-art-logo-JWrVbRab4Vs.jpg"
                        // placeholder={{ blurhash }}
                        contentFit="cover"
                        transition={1000}
                    />
                    <CustomText style={{ fontSize: moderateScale(14), fontFamily: "AirbnbCereal_W_Md" }}>{item.title}</CustomText>
                </View>
            </View>
        </Pressable>
    )
}

export default SalonCard

const styles = StyleSheet.create({
    cardWrapper: {
        width: scale(280),
        borderRadius: moderateScale(8),
        elevation: 4,

        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardImage: {
        height: verticalScale(125),
        width: "100%",
        borderTopLeftRadius: moderateScale(8),
        borderTopRightRadius: moderateScale(8)
    },
    cardContentWrapper: {
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(10),
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10),
    }
})