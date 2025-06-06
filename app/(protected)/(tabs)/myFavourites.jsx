import React from 'react';
import {
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
import { ArrowLeftIcon, CarIcon, ExternalLinkIcon, HeartIcon } from '../../../constants/icons';
import { Image } from 'expo-image';
import CustomText from '../../../components/CustomText';
import { useRouter } from 'expo-router';

const MyFavourites = () => {
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

    return (
        <CustomTabView
            style={{
                paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(0)
            }}>
            <Pressable
                onPress={() => router.back()}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: scale(10),
                    height: verticalScale(60)
                }}
            >
                <ArrowLeftIcon size={scale(18)} />
                <CustomText>My Favorites</CustomText>
            </Pressable>

            <FlatList
                contentContainerStyle={styles.listContainer}
                data={salonData}
                renderItem={({ item }) => (
                    <View
                        style={{
                            height: verticalScale(270),
                            width: "100%",
                            borderRadius: scale(8),
                            borderColor: "#E11D48",
                            borderWidth: scale(1)
                        }}
                    >
                        <Image
                            style={{
                                height: verticalScale(210),
                                borderTopLeftRadius: scale(7),
                                borderTopRightRadius: scale(7),
                            }}
                            source={{ uri: item.image }}
                            contentFit="cover"
                            transition={1000}
                        />
                        <View style={{ flex: 1, paddingHorizontal: scale(15), flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View style={{ gap: verticalScale(5) }}>
                                <CustomText
                                    style={{
                                        fontFamily: "AirbnbCereal_W_Bd"
                                    }}
                                >The Beauty Lounge</CustomText>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
                                    <CarIcon size={scale(16)} />
                                    <CustomText
                                        style={{
                                            fontFamily: "AirbnbCereal_W_Bk"
                                        }}
                                    >2.1 miles away</CustomText>
                                </View>

                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center", gap: scale(20) }}>
                                <ExternalLinkIcon size={scale(18)} color={"#E11D48"} />
                                <HeartIcon size={scale(18)} color={"#E11D48"} />
                            </View>
                        </View>

                    </View>
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
            />
        </CustomTabView>
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
