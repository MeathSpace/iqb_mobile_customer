import { Pressable, StyleSheet, Text, View } from 'react-native'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import React from 'react'
import { useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';
import CustomText from './CustomText';
import { useGlobal } from '../context/GlobalContext';
import { MapIcon } from '../constants/icons';

const SalonCard = ({ item, setSelectedCustomerSalon, favourite = false }) => {

    const { colors } = useTheme()
    const { selectedSalonLocation, setSelectedSalonLocation } = useGlobal()

    return (
        <Pressable onPress={() => setSelectedCustomerSalon({
            open: true,
            data: item
        })}>
            <View style={[styles.cardWrapper, { width: favourite ? "100%" : scale(280), backgroundColor: colors.background }]}>
                {/* <Image
                    style={styles.cardImage}
                    source={{ uri: item?.gallery?.[0]?.url }}
                    contentFit="cover"
                    transition={300}
                /> */}
                {
                    item?.gallery.length ? (
                        <Image
                            style={styles.cardImage}
                            source={{ uri: item?.gallery?.[0]?.url }}
                            contentFit="cover"
                            transition={300}
                        />
                    ) : (
                        <Image
                            style={styles.cardImage}
                            source={require('@/assets/images/dummygallery.jpg')}
                            contentFit="cover"
                            transition={300}
                        />
                    )
                }
                <View
                    style={styles.cardContentWrapper}
                >
                    <Image
                        style={{ height: moderateScale(35), width: moderateScale(35), borderRadius: moderateScale(20) }}
                        source={{ uri: item?.salonLogo?.[0]?.url }}
                        // placeholder={{ blurhash }}
                        contentFit="cover"
                        transition={1000}
                    />
                    <CustomText style={{ fontSize: moderateScale(14), fontFamily: "AirbnbCereal_W_Md" }}>{item.salonName}</CustomText>
                </View>


                <Pressable
                    onPress={() => {
                        setSelectedSalonLocation({ ...item?.location?.coordinates, address: item?.address, salonName: item?.salonName })
                    }}
                    style={{
                        width: "90%",
                        height: verticalScale(30),
                        marginHorizontal: "auto",
                        backgroundColor: "#0BA3AD1A",
                        marginBottom: verticalScale(10),
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: scale(4),
                        flexDirection: "row",
                        gap: scale(10)
                    }}
                >
                    <MapIcon size={scale(18)}/>
                    <CustomText style={{ color: "##0BA3AD" }}>See location</CustomText>
                </Pressable>

            </View>
        </Pressable>
    )
}

export default SalonCard

const styles = StyleSheet.create({
    cardWrapper: {
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