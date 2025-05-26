import React from 'react';
import {
    FlatList,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import SalonCard from '../../components/SalonCard';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';

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

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>My Favourites</Text>

            <FlatList
                contentContainerStyle={styles.listContainer}
                data={salonData}
                renderItem={({ item }) => (
                    <SalonCard
                        item={item}
                        setSelectedCustomerSalon={() => { }}
                        favourite={true}
                    />
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
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
