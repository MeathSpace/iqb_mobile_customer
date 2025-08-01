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
import SalonCard from '../../../../components/SalonCard';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomTabView from '../../../../components/CustomTabView';
import { ArrowLeftIcon, CarIcon, ExternalLinkIcon, HeartDislikeIcon, HeartFilledIcon, HeartIcon } from '../../../../constants/icons';
import { Image } from 'expo-image';
import CustomText from '../../../../components/CustomText';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { useAuth } from '../../../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import { Toast } from 'toastify-react-native'
import Skeleton from '../../../../components/Skeleton';
import CustomSecondaryText from '../../../../components/CustomSecondaryText';

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
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(3)
            }}>
                <Pressable onPress={() => router.back()}><ArrowLeftIcon color={colors.text} /></Pressable>
                <CustomText style={{
                    flex: 1,
                    // textAlign: "center",
                    fontFamily: "AirbnbCereal_W_XBd",
                    fontSize: scale(18)
                }}>My Favorites</CustomText>
            </View>

            {
                favouriteSalonData?.loading ? (
                    [0, 1, 2, 3, 4, 5].map((_, index) => {
                        return (
                            <Skeleton
                                key={index}
                                width='95%'
                                height={verticalScale(140)}
                                style={{
                                    marginTop: index === 0 ? verticalScale(10) : 0,
                                    borderRadius: scale(12),
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
                                    borderRadius: scale(12),
                                    borderColor: colors.queueBorder,
                                    borderWidth: scale(1),
                                    position: "relative",
                                    backgroundColor: colors.cardColor,
                                }}
                            >
                                <Image
                                    style={{
                                        height: verticalScale(130),
                                        borderTopLeftRadius: scale(12),
                                        borderTopRightRadius: scale(12),
                                    }}
                                    source={{ uri: item?.gallery?.[0]?.url }}
                                    contentFit="cover"
                                    transition={1000}
                                />
                                <View style={{
                                    flex: 1,
                                    backgroundColor: colors.cardColor,
                                    paddingHorizontal: scale(10),
                                    paddingVertical: verticalScale(15),
                                    borderBottomLeftRadius: scale(12),
                                    borderBottomRightRadius: scale(12),
                                }}>
                                    <View style={{ gap: verticalScale(4) }}>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: scale(10),
                                            }}
                                        >

                                            <Image
                                                style={{
                                                    width: scale(40),
                                                    height: scale(40),
                                                    borderRadius: scale(40)
                                                }}
                                                source={{ uri: item?.salonLogo?.[0]?.url }}
                                                contentFit="cover"
                                                transition={300}
                                            />
                                            <View style={{
                                                gap: verticalScale(5)
                                            }}>
                                                <CustomText style={styles.heading}>{item?.salonName}</CustomText>
                                                <CustomText
                                                    style={{
                                                        color: colors.secondaryText,
                                                        fontSize: scale(12),
                                                    }}
                                                    numberOfLines={1}
                                                >{item?.address}, {item?.city}, {item?.country}
                                                </CustomText>
                                            </View>
                                        </View>


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
                                        padding: scale(10),
                                        borderWidth: scale(1),
                                        borderColor: colors.queueBorder,
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
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingTop: verticalScale(20),
                    }}>
                        <View style={[styles.noQueueContainer, {
                            borderColor: colors.queueBorder,
                            backgroundColor: colors.cardColor,
                        }]}>
                            <View style={[styles.iconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>

                                <HeartIcon
                                    color={'#ef4444'}
                                    size={scale(32)}
                                />
                            </View>

                            <CustomText style={{
                                fontFamily: "AirbnbCereal_W_XBd",
                                fontSize: scale(20),
                                textAlign: "center",
                            }}>No Favourite</CustomText>

                            <CustomText style={{
                                fontFamily: "AirbnbCereal_W_Bd",
                                fontSize: scale(16),
                                textAlign: "center",
                                color: colors.secondaryText,
                            }}>
                                You don't have any favourite salon
                            </CustomText>
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
    },
    heading: {
        fontSize: scale(16),
        fontFamily: "AirbnbCereal_W_XBd",
    },
    listContainer: {
        // paddingHorizontal: scale(10),
        paddingVertical: verticalScale(10),
        gap: verticalScale(10),
    },

    noQueueContainer: {
        width: '100%',
        borderWidth: scale(1),
        borderRadius: scale(12),
        // flex: 0.90,
        padding: scale(30),
        gap: verticalScale(20)
    },

    iconContainer: {
        width: scale(80),
        height: scale(80),
        borderRadius: scale(80),
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: "auto",
    }
});
