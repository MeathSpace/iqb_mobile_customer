import { FlatList, Platform, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import CustomTabView from '../../../components/CustomTabView'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import AdvertiseCard from '../../../components/AdvertiseCard'
import CustomText from '../../../components/CustomText'
import BarberCard from '../../../components/BarberCard'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { useTheme } from '@react-navigation/native'
import { ContactIcon, FacebookIcon, MapIcon } from '../../../constants/icons'
import CustomSecondaryText from '../../../components/CustomSecondaryText'
import ServiceCard from '../../../components/ServiceCard'

const salon = () => {

    const colorScheme = useColorScheme();
    const { colors } = useTheme()

    const pageData = [
        {
            title: "salonImages",
        },
        {
            title: "services",
        },
        {
            title: "topStylist",
        },
        {
            title: "Address",
        },
        {
            title: "Links",
        },
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


    const darkMapStyle = [
        {
            "elementType": "geometry",
            "stylers": [{ "color": "#1d2c4d" }]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#ffffff" }]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#1d2c4d" }]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [{ "color": "#1d2c4d" }]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{ "color": "#283e6b" }]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#ffffff" }]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{ "color": "#304a7d" }]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#98a5be" }]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{ "color": "#2f3948" }]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#0f252e" }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#ffffff" }]
        }
    ];

    const servicesData = [
        {
            "id": "1",
            "name": "Haircut",
            "image": "https://plus.unsplash.com/premium_photo-1661290481306-4841edd49719?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVuJTIwaGFpcmN1dHxlbnwwfHwwfHx8MA%3D%3D"
        },
        {
            "id": "2",
            "name": "Beard Trim",
            "image": "https://www.milkmanaustralia.com/cdn/shop/articles/how-to-trim-beard-with-Scissors.jpg?v=1458647796"
        },
        {
            "id": "3",
            "name": "Hair Coloring",
            "image": "https://media.istockphoto.com/id/1305824214/photo/woman-dyeing-her-hair-at-the-salon.jpg?s=612x612&w=0&k=20&c=Jk2XQqn-5Tf1IeUPhmLYMP1Lq2nSlW_0udRXzc_KAJI="
        },
        {
            "id": "4",
            "name": "Facial",
            "image": "https://media.istockphoto.com/id/1399469980/photo/close-up-portrait-of-anorganic-facial-mask-application-at-spa-salon-facial-treatment-skin.jpg?s=612x612&w=0&k=20&c=ZvZi_bdGLicsykUtlrHgQe70ftZzd_xPKvq2vzfOyV0="
        },
        {
            "id": "5",
            "name": "Head Massage",
            "image": "https://img.freepik.com/free-photo/closeup-man-getting-head-massage-relaxing-with-eyes-closed-spa_637285-1721.jpg"
        }
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
                        case "salonImages": {
                            return (
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

                            )
                        }

                        case "services": {
                            return (
                                <>
                                    <CustomText style={{ fontFamily: "AirbnbCereal_W_Md", marginBottom: verticalScale(10) }}>Services</CustomText>

                                    <FlatList
                                        style={{
                                            overflow: "visible",
                                        }}
                                        // columnWrapperStyle={{
                                        //     columnGap: scale(10),
                                        // }}
                                        contentContainerStyle={{
                                            gap: scale(10),
                                        }}
                                        data={servicesData}
                                        renderItem={({ item }) => <ServiceCard item={item} />}
                                        keyExtractor={item => item.id}
                                        bounces={false}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                    // numColumns={1}
                                    />
                                </>
                            )
                        }

                        case "topStylist": {
                            return (
                                <>
                                    <CustomText style={{ fontFamily: "AirbnbCereal_W_Md", marginBottom: verticalScale(10) }}>Top Stylist</CustomText>

                                    <FlatList
                                        style={{
                                            overflow: "visible",
                                        }}
                                        // columnWrapperStyle={{
                                        //     columnGap: scale(10),
                                        // }}
                                        contentContainerStyle={{
                                            gap: scale(10),
                                        }}
                                        data={barbersData}
                                        renderItem={({ item }) => <BarberCard item={item} />}
                                        keyExtractor={item => item.id}
                                        bounces={false}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                    // numColumns={1}
                                    />
                                </>
                            )
                        }

                        case "Address": {
                            return (
                                <>
                                    {/* <CustomText style={{ fontFamily: "AirbnbCereal_W_Md", marginBottom: verticalScale(10) }}>Address</CustomText> */}
                                    <MapView
                                        provider={PROVIDER_GOOGLE}
                                        initialCamera={{
                                            center: {
                                                latitude: 37.78825,
                                                longitude: -122.4324,
                                            },
                                            zoom: 15, // 0 (world view) to ~20 (very close)
                                            pitch: 0,
                                            heading: 0,
                                        }}
                                        scrollEnabled={false}
                                        zoomEnabled={false}
                                        rotateEnabled={false}
                                        pitchEnabled={false}
                                        style={[styles.map, { borderColor: colors.border, borderWidth: scale(1) }]}
                                        customMapStyle={colorScheme === "dark" ? darkMapStyle : []}
                                    />
                                    <View style={[styles.addressContainer, { backgroundColor: colors.background }]}>
                                        <CustomText style={styles.addressText}>
                                            221B Baker Street, London, NW1 6XE, United Kingdom
                                        </CustomText>
                                        <View style={styles.iconContainer}>
                                            <Pressable style={[styles.iconButton, { backgroundColor: colorScheme === "dark" ? "#0f0f0f" : "#f0f0f0" }]}>
                                                <ContactIcon color={colors.text} />
                                            </Pressable>
                                            <Pressable style={[styles.iconButton, { backgroundColor: colorScheme === "dark" ? "#151718" : "#f0f0f0" }]}>
                                                <MapIcon color={colors.text} />
                                            </Pressable>
                                        </View>
                                    </View>
                                </>
                            )
                        }

                        case "Links": {
                            return (
                                <>
                                    <CustomText
                                        style={{
                                            fontFamily: "AirbnbCereal_W_Bd",
                                            fontSize: scale(16),
                                            marginBottom: verticalScale(12),
                                        }}
                                    >
                                        Follow us on
                                    </CustomText>

                                    <View
                                        style={[
                                            styles.linkContainer,
                                            {
                                                backgroundColor: colors.background,
                                                borderRadius: scale(4),
                                                padding: scale(14),
                                                gap: verticalScale(10),
                                            },
                                        ]}
                                    >
                                        <View>
                                            <CustomSecondaryText style={{ marginBottom: verticalScale(4), fontSize: scale(13) }}>
                                                📧 Email:
                                            </CustomSecondaryText>
                                            <CustomText style={{ fontSize: scale(14), fontFamily: "AirbnbCereal_W_Md" }}>
                                                iqueuebook@hotmail.com
                                            </CustomText>
                                        </View>

                                        <View>
                                            <CustomSecondaryText style={{ marginBottom: verticalScale(4), fontSize: scale(13) }}>
                                                🔗 Social Links:
                                            </CustomSecondaryText>
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
                                                <FacebookIcon color='#1877F2' />
                                                {/* Add more icons if needed */}
                                            </View>
                                        </View>
                                    </View>
                                </>


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

export default salon

const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: verticalScale(150),
    },

    addressContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", // Ensure spacing between text and icons
        padding: scale(10),
        borderRadius: scale(4),
        marginTop: verticalScale(10),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: scale(4),
        elevation: 2,
    },
    addressText: {
        flex: 1,
        fontSize: scale(12),
        fontFamily: "AirbnbCereal_W_Md"
    },
    iconContainer: {
        flexDirection: "row",
        gap: scale(10),
    },
    iconButton: {
        padding: scale(6),
        borderRadius: scale(6),
        // backgroundColor: "#f0f0f0",
    },
    linkContainer: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    }

})