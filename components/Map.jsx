import { FlatList, Modal, Platform, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import CustomText from './CustomText';
import CustomSecondaryText from './CustomSecondaryText';
import { Colors } from '../constants/Colors';
import SalonCard from './SalonCard';
import { Image } from 'expo-image';
import { useTheme } from '@react-navigation/native';
import { CloseIcon } from '../constants/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Map = () => {

    const colorScheme = useColorScheme();

    const { colors } = useTheme()
    const { searchSalon, setAuthenticatedUser, authenticatedUser } = useAuth()
    const [region, setRegion] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Location access is required to show your position.');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            });
        })();
    }, []);

    // Watch for selected city and move map
    useEffect(() => {
        if (searchSalon?.latitude && searchSalon?.longitude && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: searchSalon.latitude,
                longitude: searchSalon.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 1000); // 1 second animation
        }
    }, [searchSalon]);

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

    const [selectedCustomerSalon, setSelectedCustomerSalon] = useState({
        open: false,
        data: {}
    });

    // console.log(selectedCustomerSalon)

    const connectSalonPressed = async() => {
        setAuthenticatedUser({ ...authenticatedUser, salonId: 1 })
        await AsyncStorage.setItem("LoggedInUser", JSON.stringify({...authenticatedUser, salonId: 1 }))
        setSelectedCustomerSalon({ open: false, data: {} })
    }

    return (
        <>
            <MapView
                // style={{ flex: 1 }}
                provider={PROVIDER_GOOGLE}
                region={region}
                showsUserLocation={true}
                showsMyLocationButton={true}
                toolbarEnabled={true}
                zoomControlEnabled={true}
                // paddingAdjustmentBehavior="automatic"
                ref={mapRef}
                style={{ flex: 1, paddingBottom: 80, position: "relative" }}
                customMapStyle={colorScheme === "dark" ? darkMapStyle : []}
            />
            <FlatList
                style={{
                    position: "absolute",
                    bottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(10),
                    left: 0,
                    right: 0,
                    paddingHorizontal: scale(10),
                    overflow: "visible"
                }}
                contentContainerStyle={{
                    gap: scale(10)
                }}
                data={salonData}
                renderItem={({ item }) => <SalonCard item={item} setSelectedCustomerSalon={setSelectedCustomerSalon} />}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
            />

            <Modal
                animationType="fade"
                transparent={true}
                visible={selectedCustomerSalon.open}
                onRequestClose={() => setSelectedCustomerSalon({ open: false, data: {} })}
            >
                <Pressable
                    style={styles.modalWrapper}
                    onPress={() => setSelectedCustomerSalon({ open: false, data: {} })}
                >
                    <Pressable
                        style={[styles.modalContainer,
                        {
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            borderWidth: moderateScale(1),
                        }
                        ]}
                        onPress={() => { }}
                    >
                        <Image
                            style={styles.modalImage}
                            source={{ uri: selectedCustomerSalon?.data?.image }}
                            // placeholder={{ blurhash }}
                            contentFit="cover"
                            transition={300}
                        />
                        <View style={{ marginBottom: verticalScale(5), flexDirection: "row", alignItems: "center", gap: scale(10) }}>
                            <Image
                                style={{ height: moderateScale(35), width: moderateScale(35), borderRadius: moderateScale(20) }}
                                source="https://marketplace.canva.com/EAGUXS_OW4A/1/0/1600w/canva-purple-abstract-feminine-woman-hair-salon-line-art-logo-JWrVbRab4Vs.jpg"
                                // placeholder={{ blurhash }}
                                contentFit="cover"
                                transition={300}
                            />
                            <CustomText style={styles.modalTitle}>{selectedCustomerSalon?.data?.title}</CustomText>
                        </View>

                        {selectedCustomerSalon?.data?.services?.map((service, idx) => (
                            <CustomSecondaryText key={idx} style={styles.modalService}>• {service}</CustomSecondaryText>
                        ))}

                        <Pressable
                            style={[styles.modalbtn, { backgroundColor: Colors.modeColor.colorCode }]}
                            onPress={() => connectSalonPressed()}
                        >
                            <CustomText style={{ color: "#fff" }}>Connect</CustomText>
                        </Pressable>

                        <Pressable
                            style={[styles.closebtn]}
                            onPress={() => setSelectedCustomerSalon({ open: false, data: {} })}
                        >
                            <CustomText style={{ color: "red" }}>Cancel</CustomText>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>

        </>
    )
}

export default Map

const styles = StyleSheet.create({
    modalWrapper: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(20),
    },
    modalContainer: {
        width: '100%',
        // backgroundColor: 'white',
        borderRadius: moderateScale(12),
        padding: scale(15),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    modalImage: {
        width: '100%',
        height: verticalScale(180),
        borderRadius: moderateScale(10),
        marginBottom: verticalScale(12),
    },
    modalTitle: {
        fontSize: moderateScale(18),
        fontFamily: "AirbnbCereal_W_Md",
    },
    modalService: {
        fontSize: moderateScale(14),
        marginBottom: verticalScale(4),
    },
    modalbtn: {
        minHeight: verticalScale(35),
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: verticalScale(15),
        borderRadius: moderateScale(6),
    },
    closebtn: {
        minHeight: verticalScale(35),
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: verticalScale(10),
        borderRadius: moderateScale(6),
        borderWidth: moderateScale(1),
        borderColor: "red",
    }
})


