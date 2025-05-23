import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CustomView from '../../components/CustomView'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import CustomSecondaryText from '../../components/CustomSecondaryText';
import CustomText from '../../components/CustomText';
import { useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';
import { ClockIcon } from '../../constants/icons';
import { Colors } from '../../constants/Colors';
import { useGlobal } from '../../context/GlobalContext';

const selectServices = () => {

    // const item = useLocalSearchParams();

    const { colors } = useTheme()
    const router = useRouter()

    const [serviceData, setServiceData] = useState([
        {
            "serviceIcon": {
                "public_id": "icons/Malehaircut_1706703379405",
                "url": "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/Malehaircut_1706703379405.png"
            },
            "serviceId": 17,
            "serviceCode": "CH17",
            "serviceName": "Child Haircut",
            "serviceDesc": "tteyue",
            "servicePrice": 10,
            "vipService": false,
            "_id": "68060458c3952c26da52b8ec",
            "barberServiceEWT": 20,
            "select": false
        },
        {
            "serviceIcon": {
                "public_id": "icons/Femalehaircut_1706703379391",
                "url": "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/Femalehaircut_1706703379391.png"
            },
            "serviceId": 12,
            "serviceCode": "FE12",
            "serviceName": "Female Haircut",
            "serviceDesc": "we have a good reputation with female haircuts",
            "servicePrice": 40,
            "vipService": false,
            "_id": "67a46936c85dd16cdfa7ef9c",
            "barberServiceEWT": 30,
            "select": false
        },
        {
            "serviceIcon": {
                "public_id": "icons/hair dyes_1706703379402",
                "url": "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/hair%20dyes_1706703379402.jpg"
            },
            "serviceId": 15,
            "serviceCode": "HA15",
            "serviceName": "Hair groom",
            "serviceDesc": "adcdc",
            "servicePrice": 45,
            "vipService": false,
            "_id": "68060458c3952c26da52b8ea",
            "barberServiceEWT": 34,
            "select": false
        },
        {
            "serviceIcon": {
                "public_id": "icons/spa_1706703379407",
                "url": "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/spa_1706703379407.jpg"
            },
            "serviceId": 13,
            "serviceCode": "HA13",
            "serviceName": "Hair Spa",
            "serviceDesc": "Special spa machinaries available here",
            "servicePrice": 100,
            "vipService": true,
            "_id": "67a46936c85dd16cdfa7ef9d",
            "barberServiceEWT": 50,
            "select": false
        },
        {
            "serviceIcon": {
                "public_id": "icons/Malehaircut_1706703379405",
                "url": "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/Malehaircut_1706703379405.png"
            },
            "serviceId": 16,
            "serviceCode": "HA16",
            "serviceName": "Hair Transplant",
            "serviceDesc": "ffff",
            "servicePrice": 45,
            "vipService": true,
            "_id": "68060458c3952c26da52b8eb",
            "barberServiceEWT": 60,
            "select": false
        },
        {
            "serviceIcon": {
                "public_id": "icons/Malehaircut_1706703379405",
                "url": "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/Malehaircut_1706703379405.png"
            },
            "serviceId": 11,
            "serviceCode": "HA11",
            "serviceName": "Haircut",
            "serviceDesc": "best haircut in town",
            "servicePrice": 38,
            "vipService": false,
            "_id": "67a46936c85dd16cdfa7ef9b",
            "barberServiceEWT": 25,
            "select": false
        },
        {
            "serviceIcon": {
                "public_id": "icons/shave_1706703379407",
                "url": "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/shave_1706703379407.png"
            },
            "serviceId": 19,
            "serviceCode": "HS19",
            "serviceName": "Hshsh",
            "serviceDesc": "Shdhdh",
            "servicePrice": 22,
            "vipService": true,
            "_id": "6808e100c7b7ec5c21cb9f98",
            "barberServiceEWT": 11,
            "select": false
        },
        {
            "serviceIcon": {
                "public_id": "icons/natural spa_1706703379406",
                "url": "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703380/icons/natural%20spa_1706703379406.jpg"
            },
            "serviceId": 18,
            "serviceCode": "MA18",
            "serviceName": "Male beard and Haircut",
            "serviceDesc": "acdac",
            "servicePrice": 40,
            "vipService": false,
            "_id": "68060458c3952c26da52b8ed",
            "barberServiceEWT": 37,
            "select": false
        },
        {
            "serviceIcon": {
                "public_id": "icons/massage_1706703379406",
                "url": "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703380/icons/massage_1706703379406.jpg"
            },
            "serviceId": 14,
            "serviceCode": "MA14",
            "serviceName": "Massage",
            "serviceDesc": "we have the best massage specialists in town",
            "servicePrice": 70,
            "vipService": true,
            "_id": "67a46936c85dd16cdfa7ef9e",
            "barberServiceEWT": 30,
            "select": false
        }
    ])

    const [selectedServices, setSelectedServices] = useState([])

    const AddServiceHandler = (item) => {
        setServiceData((prev) => {
            const updatedArray = prev.map((ele) => {
                return ele._id === item._id ? ({ ...ele, select: true }) : (ele)
            })
            return updatedArray
        })
        setSelectedServices([...selectedServices, item])
    }

    const deleteServiceHandler = (item) => {
        setServiceData((prev) => {
            const updatedArray = prev.map((ele) => {
                return ele._id === item._id ? ({ ...ele, select: false }) : (ele)
            })
            return updatedArray
        })
        setSelectedServices((prev) => {
            const updatedArray = prev.filter(ele => ele._id !== item._id);
            return updatedArray;
        });
    }

    const { selectedBarber, setSelectedBarberServices, joinModes } = useGlobal();

    return (
        <CustomView>
            {
                joinModes.appointment ? (
                    <CustomText style={styles.heading}>
                        Book Appointment
                    </CustomText>
                ) : (
                    <CustomText style={styles.heading}>
                        Join Queue
                    </CustomText>
                )
            }

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: verticalScale(20) }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
                    <Image
                        style={{ height: moderateScale(30), width: moderateScale(30), borderRadius: moderateScale(30) }}
                        source={{ uri: selectedBarber.image }}
                        // placeholder={{ blurhash }}
                        contentFit="cover"
                        transition={300}
                    />
                    <CustomText>{selectedBarber.name}</CustomText>
                </View>
                <CustomSecondaryText>Available Services 5</CustomSecondaryText>
            </View>

            <FlatList
                data={serviceData}
                showsVerticalScrollIndicator={false}
                style={{
                    // overflow: "visible"
                }}
                contentContainerStyle={{
                    gap: verticalScale(15),
                }}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={item.select ? () => deleteServiceHandler(item) : () => AddServiceHandler(item)}
                        style={[styles.serviceItem, { backgroundColor: colors.card, borderColor: item.select ? Colors.modeColor.colorCode : colors.border }]}>
                        <Image
                            style={{ height: moderateScale(55), width: moderateScale(55), borderRadius: moderateScale(30) }}
                            source={{ uri: item?.serviceIcon?.url }}
                            // placeholder={{ blurhash }}
                            contentFit="cover"
                            transition={300}
                        />

                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <View style={{ flex: 1, gap: scale(6) }}>
                                <CustomText style={{ fontFamily: "AirbnbCereal_W_Md" }}>{item.serviceName}</CustomText>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10), }}>
                                    <ClockIcon size={moderateScale(14)} color={colors.secondaryText} />
                                    <CustomSecondaryText>{item.barberServiceEWT} mins</CustomSecondaryText>
                                </View>
                            </View>
                            <CustomText>$ {item.servicePrice}</CustomText>
                        </View>

                    </Pressable>
                )}
                keyExtractor={item => item._id}
                ListFooterComponent={<View style={{ height: Platform.OS === "ios" ? verticalScale(60) : 0 }} />}
            />

            <Pressable
                onPress={() => {
                    if (joinModes.appointment) {
                        setSelectedBarberServices(selectedServices)
                        router.push("/appointmentCalender")
                    } else if (joinModes.groupJoin && !joinModes.singleJoin) {
                        setSelectedBarberServices(selectedServices)
                        router.push("/groupJoin")
                    } else {
                        setSelectedBarberServices(selectedServices)
                        router.push({
                            pathname: "/joinConfirmation",
                            // params: {
                            //     selectedServices: JSON.stringify(selectedServices),
                            //     barber: JSON.stringify(item),
                            // },
                        })
                    }
                }}
                disabled={selectedServices.length === 0}
                style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode, opacity: selectedServices.length === 0 ? 0.8 : 1 }]}>
                <CustomText style={{ color: "#fff" }}>Continue</CustomText>
            </Pressable>

        </CustomView>
    )
}

export default selectServices

const styles = StyleSheet.create({
    heading: {
        fontFamily: "AirbnbCereal_W_Bd",
        fontSize: moderateScale(20),
        textAlign: "center"
    },

    serviceItem: {
        // width: "100%",
        borderRadius: moderateScale(4),
        padding: moderateScale(10),
        marginHorizontal: scale(5),
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10),
        borderWidth: scale(1),
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    btn: {
        height: verticalScale(40),
        borderRadius: scale(4),
        alignItems: "center",
        justifyContent: "center",
        marginBlock: verticalScale(0),
        marginTop: verticalScale(20),
    },
})