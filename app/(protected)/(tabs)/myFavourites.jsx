import React, { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import SalonCard from '../../../components/SalonCard';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomTabView from '../../../components/CustomTabView';
import { ArrowLeftIcon, CarIcon, ExternalLinkIcon, HeartDislikeIcon, HeartFilledIcon, HeartIcon } from '../../../constants/icons';
import { Image } from 'expo-image';
import CustomText from '../../../components/CustomText';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import { Toast } from 'toastify-react-native'
import Skeleton from '../../../components/Skeleton';
import CustomSecondaryText from '../../../components/CustomSecondaryText';

const MyFavourites = () => {

    const { authenticatedUser } = useAuth()

    const [favouriteSalonData, setFavouriteSalonData] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
    })


    useFocusEffect(
        useCallback(() => {
            const fetchFavouriteSalons = async () => {
                try {

                    setFavouriteSalonData((prev) => ({ ...prev, loading: true }))

                    const { data } = await axios.post(`${BASE_URL}/customer/getCustomerFavouriteSalon`, {
                        customerEmail: authenticatedUser?.email
                    })

                    setFavouriteSalonData((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))

                } catch (error) {

                    setFavouriteSalonData((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
                    console.log("Error fetching queue list ", error)
                }
            }

            fetchFavouriteSalons()
        }, [authenticatedUser])
    )


    const salonData = [
        {
            id: '1',
            title: 'Glamour Grace Salon',
            image:
                'https://t4.ftcdn.net/jpg/01/81/61/29/360_F_181612908_uiOH8a4qWiNGuGS2Pg5dgwUIKJZ0C02w.jpg',
            services: ['Haircuts', 'Coloring', 'Styling', 'Bridal Packages', 'Spa Treatments'],
        },
        {
            id: '2',
            title: 'Velvet & Ivy Spa',
            image:
                'https://img1.wsimg.com/isteam/ip/ecf2eb3f-f55b-4193-9e98-7c1b626bf779/Hero%20Picture.png',
            services: ['Organic Facials', 'Aromatherapy Massages', 'Holistic Beauty Treatments'],
        },
        {
            id: '4',
            title: 'Blush & Blossom Beauty',
            image:
                'https://cdn.magicdecor.in/com/2024/10/21145259/Monochrome-Geometric-Mural-Wallpaper-M-710x448.jpg',
            services: ['Makeup Artistry', 'Eyelash Extensions', 'Skincare Consultations'],
        },
        {
            id: '5',
            title: 'Opulence Oasis Salon',
            image:
                'https://images.fresha.com/locations/location-profile-images/1246855/3931181/4534bff8-c5eb-41f3-be34-8b9d5cdf85a3-RitualRetreat-GB-England-Birmingham-KingsNorton-Fresha.jpg?class=width-small',
            services: ['Hair Spa Therapies', 'Color Correction', 'Personalized Styling Sessions'],
        },
    ];

    const router = useRouter()

    const { colors } = useTheme()

    const confirmAndDeleteFavouriteSalon = (item) => {
        Alert.alert(
            "Remove Favourite Salon",
            "Are you sure you want to remove this salon from your favourites?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes, Remove",
                    onPress: () => deleteCustomerFavouriteSalon(item),
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    }

    const deleteCustomerFavouriteSalon = async (item) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/customer/deleteCustomerFavouriteSalon`, {
                salonId: item?.salonId,
                email: authenticatedUser.email
            });

            Toast.success(data?.message);

            setFavouriteSalonData((prev) => ({
                loading: false,
                data: prev?.data?.filter((salon) => salon._id !== item._id),
                success: true,
                error: null
            }))

        } catch (error) {
            Toast.error(error?.response?.data?.message || "Something went wrong");
            console.log("Error in favourite salon ", error);
        }
    }


    return (
        <View
            style={{
                // backgroundColor: "#00B0901A",
                backgroundColor: colors.background,
                flex: 1,
                paddingHorizontal: scale(10),
                paddingTop: verticalScale(10),
                paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(0)
            }}
        >

            {
                favouriteSalonData?.loading ? (
                    [0, 1, 2, 3, 4, 5].map((_, index) => {
                        return (
                            <Skeleton
                                key={index}
                                width='95%'
                                height={verticalScale(140)}
                                style={{
                                    borderRadius: scale(8),
                                    marginHorizontal: "auto",
                                    marginBottom: verticalScale(10)
                                }}
                            />
                        )
                    })
                ) : favouriteSalonData?.data?.length > 0 ? (
                    <FlatList
                        contentContainerStyle={styles.listContainer}
                        data={favouriteSalonData?.data}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    width: "100%",
                                    borderRadius: scale(8),
                                    borderColor: "gray",
                                    position: "relative",
                                    backgroundColor: "#fff",
                                    // ✅ Android shadow
                                    elevation: 2,

                                    // ✅ iOS shadow
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                }}
                            >
                                <Image
                                    style={{
                                        height: verticalScale(130),
                                        borderTopLeftRadius: scale(7),
                                        borderTopRightRadius: scale(7),
                                    }}
                                    source={{ uri: item?.gallery?.[0]?.url }}
                                    contentFit="cover"
                                    transition={1000}
                                />
                                <View style={{
                                    flex: 1,
                                    backgroundColor: colors.background,
                                    padding: scale(10),
                                    borderBottomLeftRadius: scale(7),
                                    borderBottomRightRadius: scale(7),
                                }}>
                                    <View style={{ gap: verticalScale(4) }}>
                                        <View
                                            style={{ flexDirection: "row", alignItems: "center", gap: scale(5) }}
                                        >

                                            <Image
                                                style={{
                                                    width: scale(35),
                                                    height: scale(35),
                                                    borderRadius: scale(40)
                                                }}
                                                source={{ uri: item?.salonLogo?.[0]?.url }}
                                                contentFit="cover"
                                                transition={300}
                                            />
                                            <CustomText>{item?.salonName}</CustomText>
                                        </View>
                                        <CustomText
                                            style={{
                                                color: "gray",
                                                fontSize: scale(12),
                                            }}
                                        >{item?.address}, {item?.city}, {item?.country}</CustomText>

                                        {/* <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
                                    <CarIcon size={scale(16)} color={colors.text} />
                                    <CustomText
                                        style={{
                                            // fontFamily: "AirbnbCereal_W_Bk"
                                            color: "gray",
                                            fontSize: scale(12),
                                        }}
                                    >2.1 miles away</CustomText>
                                </View> */}

                                    </View>

                                </View>

                                <Pressable
                                    onPress={() => {
                                        confirmAndDeleteFavouriteSalon(item)
                                    }}
                                    style={{
                                        position: "absolute",
                                        top: verticalScale(10),
                                        right: scale(10),
                                        backgroundColor: colors.background,
                                        borderRadius: scale(20),
                                        padding: scale(8),
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                ><HeartFilledIcon size={scale(16)} color={"#E11D48"} />
                                </Pressable>

                            </View>
                        )}
                        keyExtractor={(item) => item._id}
                        showsVerticalScrollIndicator={false}
                    />

                ) : (
                    <View style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1
                    }}>
                        <View
                            style={{
                                gap: verticalScale(12)
                            }}
                        >
                            <View
                                style={{
                                    width: scale(60),
                                    height: scale(60),
                                    backgroundColor: colors.background,
                                    marginHorizontal: "auto",
                                    borderRadius: scale(50),
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <HeartDislikeIcon
                                    color={colors.text}
                                    size={scale(40)}
                                />
                            </View>
                            <CustomText
                                style={{
                                    textAlign: "center",
                                    fontSize: scale(16)
                                }}
                            >No Favourite</CustomText>
                            <CustomSecondaryText
                                style={{
                                    textAlign: "center"
                                }}
                            >
                                You don't have any favourite salon
                            </CustomSecondaryText>

                        </View>
                    </View>
                )
            }
        </View>
    );
};

export default MyFavourites;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: Platform.OS === 'ios' ? verticalScale(10) : 0,
        // backgroundColor: '#fff',
    },
    heading: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        paddingHorizontal: scale(10),
    },
    listContainer: {
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(10),
        gap: verticalScale(10),
    },
});
