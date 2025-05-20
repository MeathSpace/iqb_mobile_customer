import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomTabView from './CustomTabView'
import CustomText from './CustomText'
import { useAuth } from '../context/AuthContext'
import CustomSecondaryText from './CustomSecondaryText'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../constants/Colors'
import AdvertiseCard from './AdvertiseCard'
import { NextIcon, QueueIcon, SettingsIcon, UserIcon } from '../constants/icons'
import StatusCard from './StatusCard'
import BarberCard from './BarberCard'

const Dashboard = () => {

    const { authenticatedUser } = useAuth()

    const pageData = [
        {
            title: "hero",
        },
        {
            title: "advertise",
        },
        {
            title: "status",
        },
        {
            title: "barber",
        }
    ]

    const salonData = [
        {
            id: '1',
            title: 'Glamour Grace Salon',
            image: 'https://t4.ftcdn.net/jpg/01/81/61/29/360_F_181612908_uiOH8a4qWiNGuGS2Pg5dgwUIKJZ0C02w.jpg',
            services: ['Haircuts', 'Coloring', 'Styling', 'Bridal Packages', 'Spa Treatments'],
        },
        {
            id: '2',
            title: 'Velvet & Ivy Spa',
            image: 'https://img1.wsimg.com/isteam/ip/ecf2eb3f-f55b-4193-9e98-7c1b626bf779/Hero%20Picture.png',
            services: ['Organic Facials', 'Aromatherapy Massages', 'Holistic Beauty Treatments'],
        },
        {
            id: '3',
            title: 'The Luxe Lotus',
            image: 'https://cdn.magicdecor.in/com/2024/11/29145730/Beautiful-Seven-White-Horses-Art-Wallpaper-Mural-M-710x448.jpg',
            services: ['Hair Extensions', 'Keratin Treatments', 'Luxury Manicures'],
        },
        {
            id: '4',
            title: 'Blush & Blossom Beauty',
            image: 'https://cdn.magicdecor.in/com/2024/10/21145259/Monochrome-Geometric-Mural-Wallpaper-M-710x448.jpg',
            services: ['Makeup Artistry', 'Eyelash Extensions', 'Skincare Consultations'],
        },
        {
            id: '5',
            title: 'Opulence Oasis Salon',
            image: 'https://images.fresha.com/locations/location-profile-images/1246855/3931181/4534bff8-c5eb-41f3-be34-8b9d5cdf85a3-RitualRetreat-GB-England-Birmingham-KingsNorton-Fresha.jpg?class=width-small',
            services: ['Hair Spa Therapies', 'Color Correction', 'Personalized Styling Sessions'],
        },
    ];

    const salonStatus = [
        {
            id: 1,
            title: "System Status",
            icon: SettingsIcon,
            value: "ON",
            color1: "#E11D48",
        },
        {
            id: 2,
            title: "Total Queue",
            icon: QueueIcon,
            value: "0",
            color1: "#006FFD",
        },
        {
            id: 3,
            title: "Next In Queue",
            icon: NextIcon,
            value: "1",
            color1: "#EAA824",
        },
        {
            id: 4,
            title: "On Duty Staff",
            icon: UserIcon,
            value: "4",
            color1: "#00B090",
        },
    ]

    const barbersData = [
        {
            id: 1,
            image: "https://celebrity.edu/wp-content/uploads/2021/08/top-tips-to-be-a-successful-barber.jpg",
            name: "Korbyn Larson",
            online: true,
            estTime: "15 mins",

        },
        {
            id: 2,
            image: "https://media.istockphoto.com/id/1365608023/photo/shot-of-a-handsome-young-barber-standing-alone-in-his-salon.jpg?s=612x612&w=0&k=20&c=0l2Q3UVgXNnf3lbUvMM7hT18-AAnOloeoNMOHntomcw=",
            name: "Aden Schneider",
            online: true,
            estTime: "15 mins",

        },
        {
            id: 3,
            image: "https://d3sc42dkmius1e.cloudfront.net/mb/2023/11/shutterstock_2267242719.jpg",
            name: "Parker Howard",
            online: true,
            estTime: "15 mins",

        },
        {
            id: 4,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS00ttz25SjbZV0uIHzosHH25DVqhpNhtRXw&s",
            name: "Paulina Arroyo",
            online: true,
            estTime: "15 mins",

        },
        
    ]


    return (
        <CustomTabView>
            <FlatList
                data={pageData}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    gap: verticalScale(15)
                }}
                renderItem={({ item }) => {
                    switch (item.title) {
                        case "hero": {
                            return (
                                <>
                                    {/* <CustomText style={{ fontFamily: "AirbnbCereal_W_Md"}}>Hello, {authenticatedUser?.name} 👋</CustomText> */}
                                    <CustomSecondaryText style={{ fontFamily: "AirbnbCereal_W_Md", marginBottom: verticalScale(10) }}>Select an option to either join the current queue or schedule an appointment in advance.</CustomSecondaryText>

                                    <View style={{ flexDirection: "row", gap: verticalScale(10), justifyContent: "space-evenly" }}>
                                        <Pressable style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode, shadowColor: Colors.modeColor.colorCode, marginBottom: verticalScale(10) }]}><CustomText style={{ color: "#fff" }}>Join Queue</CustomText></Pressable>
                                        <Pressable style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode, shadowColor: Colors.modeColor.colorCode, marginBottom: verticalScale(10) }]}><CustomText style={{ color: "#fff" }}>Book Appt</CustomText></Pressable>
                                    </View>
                                </>

                            )
                        }

                        case "advertise": {
                            return (
                                <>
                                    <FlatList
                                        style={{
                                            overflow: "visible",
                                        }}
                                        contentContainerStyle={{
                                            gap: scale(10),                                        
                                        }}
                                        data={salonData}
                                        renderItem={({ item }) => <AdvertiseCard item={item} />}
                                        keyExtractor={item => item.id}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                    />
                                </>
                            )
                        }

                        case "status": {
                            return (
                                <FlatList
                                    style={{
                                        overflow: "visible",
                                    }}
                                    contentContainerStyle={{
                                        gap: scale(10)
                                    }}
                                    data={salonStatus}
                                    renderItem={({ item }) => <StatusCard item={item} />}
                                    keyExtractor={item => item.id}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    bounces={false}
                                />
                            )
                        }

                        case "barber": {
                            return (
                                <FlatList
                                    style={{
                                        overflow: "visible",
                                    }}
                                    columnWrapperStyle={{
                                        columnGap: scale(10),
                                    }}
                                    data={barbersData}
                                    renderItem={({ item }) => <BarberCard item={item}  />}
                                    keyExtractor={item => item.id}
                                    bounces={false}
                                    numColumns={2}
                                />
                            )
                        }
                    }
                }}
                keyExtractor={item => item.title}
                ListFooterComponent={<View style={{ height: Platform.OS === "ios" ? verticalScale(60) : 0 }} />}
            />

        </CustomTabView>
    )
}

export default Dashboard

const styles = StyleSheet.create({
    topContainer: {
        // gap: verticalScale(10),
    },
    btn: {
        width: "45%",
        height: verticalScale(35),
        borderRadius: scale(4),
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
    }
})