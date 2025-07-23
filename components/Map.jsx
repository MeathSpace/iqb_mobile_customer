import { ActivityIndicator, Alert, FlatList, Keyboard, Linking, Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import { useGlobal } from '../context/GlobalContext'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import CustomText from './CustomText';
import CustomSecondaryText from './CustomSecondaryText';
import { Colors } from '../constants/Colors';
import SalonCard from './SalonCard';
import { Image } from 'expo-image';
import { usePreventRemove, useTheme } from '@react-navigation/native';
import { ArrowLeftIcon, CheckIcon, ClockIcon, CloseIcon, ContactIcon, CuttingIcon, EmailIcon, FacebookIcon, HeartFilledIcon, HeartIcon, InstagramIcon, MapIcon, MapScissorIcon, TiktokIcon, WebIcon, WhatsappIcon, XIcon } from '../constants/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import Skeleton from './Skeleton';
import CustomTabView from './CustomTabView';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useFocusEffect } from 'expo-router';
import { Toast } from 'toastify-react-native'
import BarberCard from './BarberCard';

const Map = () => {

    const colorScheme = useColorScheme();

    const { colors } = useTheme()
    const { searchSalon, setAuthenticatedUser, authenticatedUser } = useAuth()
    const { searchCitySalons, setSearchCitySalons, selectedSalonLocation } = useGlobal()

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


    useEffect(() => {
        if (selectedSalonLocation) {
            mapRef.current.animateToRegion({
                latitude: selectedSalonLocation.latitude,
                longitude: selectedSalonLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 3000); // 1 second animation
        }

    }, [selectedSalonLocation]);

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

    useEffect(() => {

        const fetchServiceCategoryData = async () => {
            try {

                setServiceCategoryData((prev) => ({ ...prev, loading: true }))

                const { data } = await axios.get(`${BASE_URL}/mobileRoutes/getAllServiceCategories`)

                setServiceCategoryData((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))

            } catch (error) {
                setServiceCategoryData((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
                console.error("Error fetching service category data: ", error)
            }
        }

        fetchServiceCategoryData()

    }, [])

    const [getAllSalons, setGetAllSalons] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
    })

    useEffect(() => {
        const fetchAllSalons = async () => {
            try {

                setGetAllSalons((prev) => ({ ...prev, loading: true }))

                const { data } = await axios.get(`${BASE_URL}/mobileRoutes/getAllSalonsMob`)

                setGetAllSalons((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))

            } catch (error) {
                setGetAllSalons((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
                console.log("Error fetching salons ", error)
            }
        }

        fetchAllSalons()
    }, [])

    const [connectSalonLoader, setConnectSalonLoader] = useState(false)

    const connectSalonPressed = async () => {
        try {

            setConnectSalonLoader(true)

            const { data } = await axios.post(`${BASE_URL}/customer/customerConnectSalon`, {
                salonId: selectedCustomerSalon?.data?.salonId,
                email: authenticatedUser?.email
            })

            // console.log(data)

            //This response should be same as signin response then everything will work perfectly

            // console.log("Salon connect api ", data?.response?.salonInfo?.salonLogo?.[0]?.url)
            // console.log("Salon connect api ", data?.response?.salonInfo?.salonName)

            setAuthenticatedUser(data?.response)
            await AsyncStorage.setItem("LoggedInUser", JSON.stringify(data?.response))
            setSelectedCustomerSalon({ open: false, data: {} })
            setSearchCitySalons({
                data: null,
                loading: false,
                error: null,
                success: false
            })

            setConnectSalonLoader(false)

        } catch (error) {
            console.log("Error connecting salon ", error)
            setConnectSalonLoader(false)
        }
    }

    const serviceCategories = [
        {
            name: "Cutting",
            image: require("../assets/images/1.png"),
            services: [
                {
                    name: "Hair Cut",
                    vip: true,
                    est: 15,
                    price: 49,
                    serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
                    image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
                },
                {
                    name: "Hair Cut",
                    vip: true,
                    est: 15,
                    price: 49,
                    serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
                    image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
                },
            ]
        },
        {
            name: "Trim",
            image: require("../assets/images/2.png"),
            services: [
                {
                    name: "Hair Cut",
                    vip: true,
                    est: 15,
                    price: 49,
                    serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
                    image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
                },
                {
                    name: "Hair Cut",
                    vip: true,
                    est: 15,
                    price: 49,
                    serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
                    image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
                },
            ]
        },
        {
            name: "Styling",
            image: require("../assets/images/1.png"),
            services: [
                {
                    name: "Hair Cut",
                    vip: true,
                    est: 15,
                    price: 49,
                    serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
                    image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
                },
                {
                    name: "Hair Cut",
                    vip: true,
                    est: 15,
                    price: 49,
                    serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
                    image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
                },
            ]
        },
        {
            name: "Hair Dye",
            image: require("../assets/images/4.png"),
            services: [
                {
                    name: "Hair Cut",
                    vip: true,
                    est: 15,
                    price: 49,
                    serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
                    image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
                },
                {
                    name: "Hair Cut",
                    vip: true,
                    est: 15,
                    price: 49,
                    serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
                    image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
                },
            ]
        },

        {
            name: "More",
            image: require("../assets/images/5.png"),
            services: [
                {
                    name: "Hair Cut",
                    vip: true,
                    est: 15,
                    price: 49,
                    serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
                    image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
                },
                {
                    name: "Hair Cut",
                    vip: true,
                    est: 15,
                    price: 49,
                    serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
                    image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
                },
            ]
        },
        {
            name: "Cutting",
            image: require("../assets/images/6.png"),
            services: [
                {
                    name: "Hair Cut",
                    vip: true,
                    est: 15,
                    price: 49,
                    serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
                    image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
                },
                {
                    name: "Hair Cut",
                    vip: true,
                    est: 15,
                    price: 49,
                    serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
                    image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
                },
            ]
        },
        {
            name: "Trim",
            image: require("../assets/images/7.png"),
            services: [
                {
                    name: "Hair Cut",
                    vip: true,
                    est: 15,
                    price: 49,
                    serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
                    image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
                },
                {
                    name: "Hair Cut",
                    vip: true,
                    est: 15,
                    price: 49,
                    serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
                    image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
                },
            ]
        },
        {
            name: "Trim",
            image: require("../assets/images/2.png"),
            services: [
                {
                    name: "Hair Cut",
                    vip: true,
                    est: 15,
                    price: 49,
                    serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
                    image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
                },
                {
                    name: "Hair Cut",
                    vip: true,
                    est: 15,
                    price: 49,
                    serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
                    image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
                },
            ]
        },
        // {
        //     name: "Styling",
        //     image: require("../assets/images/1.png"),
        //     services: [
        //         {
        //             name: "Hair Cut",
        //             vip: true,
        //             est: 15,
        //             price: 49,
        //             serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
        //             image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
        //         },
        //         {
        //             name: "Hair Cut",
        //             vip: true,
        //             est: 15,
        //             price: 49,
        //             serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
        //             image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
        //         },
        //     ]
        // },
        // {
        //     name: "Cutting",
        //     image: require("../assets/images/4.png"),
        //     services: [
        //         {
        //             name: "Hair Cut",
        //             vip: true,
        //             est: 15,
        //             price: 49,
        //             serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
        //             image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
        //         },
        //         {
        //             name: "Hair Cut",
        //             vip: true,
        //             est: 15,
        //             price: 49,
        //             serviceDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, ut asperiores nesciunt obcaecati vel veritatis voluptate nulla accusamus iste in odio, eos aliquam saepe officiis architecto at, doloremque suscipit! Voluptatem error illum rem veritatis ea consectetur repellendus, repudiandae possimus ullam perferendis sequi a, quos explicabo tenetur quod vitae consequatur similique numquam neque eos voluptatibus. Saepe facere velit officia numquam, sed harum totam magnam voluptate accusamus dicta, aliquid rerum ab dignissimos rem fugiat sunt aliquam nihil corrupti! Commodi, facere minus molestiae, eius ducimus deleniti aut et error, sed optio tempore. Culpa, quisquam eum soluta voluptates dignissimos aut dolorem quo mollitia quos, nostrum quis pariatur. Molestias, beatae unde aut reiciendis distinctio ullam quos enim, non dolorum dignissimos adipisci est alias nam quibusdam maiores ducimus in vitae eos maxime corporis eius aperiam. Nesciunt ut ipsum, qui labore ullam quisquam dolor animi quidem odit facilis sed ipsa magni a fugiat sint facere iure ex culpa quaerat neque optio distinctio natus magnam aut. Adipisci, delectus praesentium. Adipisci recusandae vel, accusantium repellat commodi nesciunt voluptatum pariatur eum sapiente, perferendis dolores similique a, eveniet ratione? Iste, itaque. Nihil beatae autem laboriosam excepturi culpa, repudiandae nostrum repellat laudantium, amet impedit architecto quos sit iure? Nostrum quia iste adipisci.",
        //             image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
        //         },
        //     ]
        // },

    ]


    // Salon Info for connect Salon

    const [salonInfoData, setSalonInfoData] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
    })

    const [selectecConnectSalonId, setSelectedConnectSalonId] = useState("")

    useFocusEffect(
        useCallback(() => {
            if (selectecConnectSalonId) {
                const fetchSalonInfo = async () => {
                    try {

                        setSalonInfoData((prev) => ({ ...prev, loading: true }))

                        const { data } = await axios.get(`${BASE_URL}/mobileRoutes/getSalonInfoBySalonId`, {
                            params: {
                                salonId: selectecConnectSalonId,
                                customerEmail: authenticatedUser?.email
                            }
                        })

                        setSalonInfoData((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))

                    } catch (error) {

                        setSalonInfoData((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
                        console.log("Error fetching salon Info ", error)
                    }
                }

                fetchSalonInfo()
            }


        }, [authenticatedUser, selectecConnectSalonId])
    )

    const flatlistRef = useRef()
    const [currentIndex, setCurrentIndex] = useState(0)

    // hooks
    const sheetRef = useRef(null);

    const [tabData, setTabData] = useState([
        "Details",
        "Services",
        "Stylists"
    ])

    const [selectedTab, setSelectedTab] = useState("Details")

    const latitude = salonInfoData?.data?.salonInfo?.location?.coordinates?.latitude
    const longitude = salonInfoData?.data?.salonInfo?.location?.coordinates?.longitude

    const openLink = async (url) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            console.warn("Can't open URL:", url);
        }
    };

    const [serviceCategorySelected, setServiceCategorySelected] = useState({
        categoryName: "",
        selected: false
    })


    const [serviceCategoryData, setServiceCategoryData] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
    })

    const [salonServicesCategoryData, setSalonServicesCategoryData] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
    })

    useFocusEffect(
        useCallback(() => {
            const fetchServiceCategoryData = async () => {
                try {

                    setServiceCategoryData((prev) => ({ ...prev, loading: true }))

                    const { data } = await axios.get(`${BASE_URL}/mobileRoutes/getAllServiceCategories`)

                    setServiceCategoryData((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))

                } catch (error) {
                    setServiceCategoryData((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
                    console.error("Error fetching service category data: ", error)
                }
            }

            fetchServiceCategoryData()

            if (serviceCategorySelected.selected && serviceCategorySelected.categoryName) {
                const fetchSalonServicesByCategory = async () => {
                    try {

                        setSalonServicesCategoryData((prev) => ({ ...prev, loading: true }))

                        const { data } = await axios.get(`${BASE_URL}/mobileRoutes/getSalonServicesByCategory`, {
                            params: {
                                salonId: selectecConnectSalonId,
                                serviceCategoryName: serviceCategorySelected.categoryName
                            }
                        })

                        setSalonServicesCategoryData((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))

                    } catch (error) {
                        setSalonServicesCategoryData((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
                        console.error("Error fetching salon services category data: ", error)
                    }
                }

                fetchSalonServicesByCategory()
            }


        }, [serviceCategorySelected, selectecConnectSalonId])
    )

    const [selectCustomerServices, setSelectedCustomerServices] = useState([])
    const [selectedCustomerBarber, setSelectedCustomerBarber] = useState(null)

    const addServiceHandler = (service) => {
        const updatedSalonServices = salonServicesCategoryData?.data?.map((item) => {
            return item?.serviceId === service?.serviceId ? { ...service, selected: true } : item
        })

        setSalonServicesCategoryData({
            data: updatedSalonServices,
            loading: false,
            error: null,
            success: false
        })

        setSelectedCustomerServices([...selectCustomerServices, service])
    }

    const removeServiceHandler = (service) => {
        const updatedSalonServices = salonServicesCategoryData?.data?.map((item) => {
            return item?.serviceId === service?.serviceId ? { ...service, selected: false } : item
        })

        setSalonServicesCategoryData({
            data: updatedSalonServices,
            loading: false,
            error: null,
            success: false
        })

        setSelectedCustomerServices((prev) => {

            const filteredArray = prev.filter((item) => {
                return item?.serviceId !== service?.serviceId
            })

            return filteredArray
        })
    }

    const [favouriteLoader, setFavouriteLoader] = useState(false)

    const addToFavourites = async () => {
        try {

            setFavouriteLoader(true)

            const { data } = await axios.post(`${BASE_URL}/customer/customerFavouriteSalon`, {
                email: authenticatedUser?.email,
                salonId: selectecConnectSalonId
            })

            setFavouriteLoader(false)

            setSalonInfoData({
                ...salonInfoData,
                data: {
                    ...salonInfoData.data,
                    salonInfo: {
                        ...salonInfoData.data.salonInfo,
                        isFavourite: true
                    }
                }
            });

            // Toast.success("Successfully added to favourites")

            Alert.alert("Success", "Successfully added to favourites");

        } catch (error) {
            setFavouriteLoader(false)
            // Toast.error(error?.response?.data?.message);
            // Toast doesnot come in the modal
            Alert.alert("Error", error?.response?.data?.message || "Something went wrong");
            console.log("Error in favourite salon ", error?.response?.data);
        }
    }

    // console.log(salonInfoData?.data?.salonInfo?.salonLogo)

    function formatMinutesToHrMin(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        if (hours > 0 && mins > 0) return `${hours}hr ${mins}min`;
        if (hours > 0) return `${hours}hr`;
        return `${mins}min`;
    }

    const hasUnsavedChanges = true

    usePreventRemove(
        hasUnsavedChanges, // This boolean determines if removal should be prevented
        ({ data }) => {
            // The action is still passed, but we're choosing not to dispatch it,
            // effectively making "going back" impossible through these means.
            // Alert.alert(
            //     'Cannot Go Back',
            //     'You cannot go back during the signup flow. Please complete the current step.',
            //     [{ text: 'OK', onPress: () => null }] // Only an 'OK' button
            // );
        }
    );

    const [selectedMarker, setSelectedMarker] = useState("")

    return (
        <>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{
                    flex: 1
                }}>
                    {
                        getAllSalons?.loading ? (
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: colors.background
                                }}
                            />
                        ) : (
                            getAllSalons?.data?.length > 0 && (
                                <MapView
                                    provider={PROVIDER_GOOGLE}
                                    region={region}
                                    showsUserLocation={true}
                                    showsMyLocationButton={true}
                                    toolbarEnabled={true}
                                    zoomControlEnabled={true}
                                    ref={mapRef}
                                    style={{ flex: 1, paddingBottom: 80, position: 'relative' }}
                                    customMapStyle={colorScheme === 'dark' ? darkMapStyle : []}
                                >

                                    {
                                        getAllSalons?.data?.length > 0 && getAllSalons?.data?.map((salon, index) => {
                                            if (salon?.location?.coordinates?.latitude && salon?.location?.coordinates?.longitude) {
                                                return (
                                                    <Marker
                                                        key={index}
                                                        coordinate={{
                                                            latitude: salon?.location?.coordinates?.latitude,
                                                            longitude: salon?.location?.coordinates?.longitude,
                                                        }}
                                                        title={salon.salonName}
                                                        description={salon.address}
                                                        onPress={() => {
                                                            setSelectedMarker(salon.salonId)
                                                        }}
                                                    >
                                                        <View
                                                            style={{
                                                                backgroundColor: colors.background,
                                                                padding: scale(2),
                                                                borderRadius: scale(8),
                                                                borderWidth: scale(1),
                                                                borderColor: colors.border,
                                                            }}
                                                        >
                                                            <View
                                                                style={{
                                                                    padding: scale(8),
                                                                    borderRadius: scale(6),
                                                                    backgroundColor: selectedMarker === salon.salonId ? "#0BA3AD" : "#efefef"
                                                                }}
                                                            >
                                                                <MapScissorIcon color={selectedMarker === salon.salonId ? "#fff" : "#000"} />
                                                            </View>
                                                        </View>

                                                    </Marker>
                                                );
                                            }
                                            return null;
                                        })
                                    }

                                </MapView>
                            )
                        )
                    }


                    <FlatList
                        style={{
                            position: "absolute",
                            bottom: Platform.OS === "ios" ? verticalScale(100) : verticalScale(20),
                            left: 0,
                            right: 0,
                            paddingHorizontal: scale(10),
                            overflow: "visible"
                        }}
                        contentContainerStyle={{
                            gap: scale(10)
                        }}
                        data={searchCitySalons?.data}
                        renderItem={({ item }) => <SalonCard
                            item={item}
                            setSelectedCustomerSalon={setSelectedCustomerSalon}
                            setSelectedConnectSalonId={setSelectedConnectSalonId}
                        />}
                        keyExtractor={item => item._id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />

                    {/* <Modal
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
                                    borderWidth: scale(1),
                                }
                                ]}
                                onPress={() => { }}
                            >
                                {
                                    selectedCustomerSalon?.data?.gallery?.length ? (
                                        <Image
                                            style={styles.modalImage}
                                            source={{ uri: selectedCustomerSalon?.data?.gallery?.[0]?.url }}
                                            contentFit="cover"
                                            transition={300}
                                        />
                                    ) : (
                                        <Image
                                            style={styles.modalImage}
                                            source={require('@/assets/images/dummygallery.jpg')}
                                            contentFit="cover"
                                            transition={300}
                                        />
                                    )
                                }

                                <View style={{ marginBottom: verticalScale(5), flexDirection: "row", alignItems: "center", gap: scale(10) }}>
                                    <Image
                                        style={{ height: moderateScale(35), width: moderateScale(35), borderRadius: moderateScale(20) }}
                                        source={selectedCustomerSalon?.data?.salonLogo?.[0]?.url}
                                        // placeholder={{ blurhash }}
                                        contentFit="cover"
                                        transition={300}
                                    />
                                    <CustomText style={styles.modalTitle}>{selectedCustomerSalon?.data?.salonName}</CustomText>
                                </View>

                                <View
                                    style={{
                                        marginTop: verticalScale(20),
                                    }}
                                >
                                    <CustomText
                                        style={{
                                            fontFamily: "AirbnbCereal_W_Blk"
                                        }}
                                    >Explore all services</CustomText>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            paddingVertical: verticalScale(20),
                                            gap: scale(25),
                                        }}
                                    >

                                        {
                                            serviceCategoryData?.loading ? (
                                                [0, 1, 2, 3, 4, 5, 6, 7].map((item, index) => {
                                                    return (
                                                        <View
                                                            key={index}
                                                            style={{
                                                                gap: verticalScale(10),
                                                                width: scale(65),
                                                            }}
                                                        >

                                                            <Skeleton
                                                                width={scale(60)}
                                                                height={scale(60)}
                                                                borderRadius={scale(30)}
                                                            >

                                                            </Skeleton>

                                                        </View>
                                                    )
                                                })
                                            ) : (
                                                serviceCategoryData?.data?.map((item, index) => {
                                                    return (
                                                        <View
                                                            key={item?._id}
                                                            style={{
                                                                gap: verticalScale(10),
                                                                width: scale(65),
                                                                marginBottom: verticalScale(10)
                                                            }}
                                                        >

                                                            <View
                                                                style={{
                                                                    width: scale(55),
                                                                    height: scale(55),
                                                                    borderRadius: scale(30),
                                                                    backgroundColor: colors.background,
                                                                    marginHorizontal: "auto"
                                                                }}
                                                            >
                                                                <Image
                                                                    style={{ width: "100%", height: "100%", borderRadius: scale(30) }}
                                                                    source={{ uri: item?.serviceCategoryImage?.url.replace("http", "https") }}
                                                                    contentFit="cover"
                                                                    transition={1000}
                                                                />
                                                            </View>
                                                            <CustomText
                                                                style={{
                                                                    fontFamily: "AirbnbCereal_W_Md",
                                                                    fontSize: scale(12),
                                                                    textAlign: "center",
                                                                    color: "gray",
                                                                }}
                                                            >{item.serviceCategoryName}</CustomText>
                                                        </View>
                                                    )
                                                })
                                            )
                                        }

                                    </View>
                                </View>

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
                                    <CustomText style={{ color: "#E11D48" }}>Cancel</CustomText>
                                </Pressable>
                            </Pressable>
                        </Pressable>
                    </Modal> */}


                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={selectedCustomerSalon.open}
                        onRequestClose={() => setSelectedCustomerSalon({ open: false, data: {} })}
                    >
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <SafeAreaView>
                                <GestureHandlerRootView style={[styles.container, {
                                    backgroundColor: colors.background,
                                }]}>

                                    {
                                        salonInfoData?.loading ? (
                                            <Skeleton
                                                height={verticalScale(200)}
                                                width={scale(400)}
                                            />
                                        ) : salonInfoData?.data?.salonInfo?.gallery?.length > 0 ? (
                                            <View style={{ position: 'relative' }}>
                                                <Pressable
                                                    onPress={() => setSelectedCustomerSalon({ open: false, data: {} })}
                                                    style={{
                                                        position: 'absolute',
                                                        top: verticalScale(10),
                                                        left: scale(10),
                                                        zIndex: 10,
                                                        backgroundColor: colors.background,
                                                        borderWidth: scale(1),
                                                        borderColor: colors.queueBorder,
                                                        height: scale(40),
                                                        width: scale(40),
                                                        borderRadius: scale(30),
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    <ArrowLeftIcon color={colors.text} />
                                                </Pressable>


                                                <Pressable
                                                    disabled={favouriteLoader}
                                                    onPress={addToFavourites}
                                                    style={{
                                                        width: scale(30),
                                                        height: scale(30),
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        borderRadius: scale(4),
                                                        position: 'absolute',
                                                        top: verticalScale(10),
                                                        right: scale(10),
                                                        zIndex: 10,
                                                        backgroundColor: colors.background,
                                                        borderWidth: scale(1),
                                                        borderColor: colors.queueBorder,
                                                        height: scale(40),
                                                        width: scale(40),
                                                        borderRadius: scale(30),
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}
                                                >

                                                    {
                                                        salonInfoData?.data?.salonInfo?.isFavourite ? <HeartFilledIcon size={scale(20)} color='#E11D48' /> : <HeartIcon size={scale(16)} color='#E11D48' />
                                                    }
                                                </Pressable>

                                                <FlatList
                                                    data={salonInfoData?.data?.salonInfo?.gallery?.slice(0, 5)}
                                                    style={{
                                                        position: "relative"
                                                    }}
                                                    renderItem={({ item }) => <SalonItem item={item} />}
                                                    keyExtractor={item => item._id}
                                                    ref={flatlistRef}
                                                    horizontal={true}
                                                    showsHorizontalScrollIndicator={false}
                                                    // snapToAlignment="start"
                                                    decelerationRate="fast"
                                                    snapToInterval={scale(400)}
                                                    pagingEnabled={true}
                                                    onMomentumScrollEnd={(event) => {
                                                        const offsetX = event.nativeEvent.contentOffset.x;
                                                        const index = Math.round(offsetX / scale(400));
                                                        setCurrentIndex(index);
                                                    }}
                                                    initialNumToRender={3}
                                                    maxToRenderPerBatch={3}
                                                />
                                                <View
                                                    style={{
                                                        position: "absolute",
                                                        bottom: Platform.OS === "ios" ? verticalScale(40) : verticalScale(30),
                                                        alignSelf: "center",
                                                        flexDirection: "row",
                                                        gap: scale(8),
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    {
                                                        salonInfoData?.data?.salonInfo?.gallery?.slice(0, 5)?.map((item, index) => {
                                                            return (
                                                                <Pressable
                                                                    onPress={() => {
                                                                        setCurrentIndex(index);
                                                                        flatlistRef.current?.scrollToIndex({ animated: true, index });
                                                                    }}
                                                                    key={index}
                                                                    style={{
                                                                        width: index === currentIndex ? scale(25) : scale(10),
                                                                        height: scale(10),
                                                                        borderRadius: scale(30),
                                                                        backgroundColor: index === currentIndex ? Colors.modeColor.colorCode : "#fff"
                                                                    }}
                                                                ></Pressable>
                                                            )
                                                        })
                                                    }

                                                </View>
                                            </View>

                                        ) : (
                                            <View
                                                style={{
                                                    width: "100%",
                                                    height: verticalScale(200),
                                                }}
                                            >
                                                <Image
                                                    style={{
                                                        width: scale(350),
                                                        height: verticalScale(200),
                                                    }}
                                                    source={require('@/assets/images/dummygallery.jpg')}
                                                    contentFit="cover"
                                                    transition={300}
                                                />
                                            </View>
                                        )
                                    }


                                    {
                                        !salonInfoData?.loading && (
                                            <BottomSheet
                                                ref={sheetRef}
                                                index={0}
                                                snapPoints={Platform.OS === "ios" ? ["72%", "90%"] : ["73%", "87%"]}
                                                enableDynamicSizing={false}
                                                backgroundStyle={{
                                                    backgroundColor: colors.background,
                                                    borderTopLeftRadius: scale(20),
                                                    borderTopRightRadius: scale(20),
                                                }}
                                                handleIndicatorStyle={{
                                                    backgroundColor: colors.secondaryText
                                                }}
                                            // onChange={handleSheetChange}
                                            >
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        gap: scale(10),
                                                        padding: scale(10),
                                                        justifyContent: "space-between"
                                                    }}
                                                >

                                                    <View
                                                        style={{
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            gap: scale(10)
                                                        }}
                                                    >
                                                        <Image
                                                            style={{
                                                                height: scale(40),
                                                                width: scale(40),
                                                                borderRadius: scale(20),
                                                                position: "relative"
                                                            }}
                                                            source={salonInfoData?.data?.salonInfo?.salonLogo?.[0]?.url}
                                                            // placeholder={{ blurhash }}
                                                            contentFit="cover"
                                                            transition={1000}
                                                        />

                                                        <CustomText style={{ fontSize: scale(18), fontFamily: "AirbnbCereal_W_XBd" }}>{salonInfoData?.data?.salonInfo?.salonName}</CustomText>
                                                    </View>

                                                    {/* <Pressable
                                                        disabled={favouriteLoader}
                                                        onPress={addToFavourites}
                                                        style={{
                                                            width: scale(30),
                                                            height: scale(30),
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            borderRadius: scale(4)
                                                        }}
                                                    >

                                                        {
                                                            salonInfoData?.data?.salonInfo?.isFavourite ? <HeartFilledIcon size={scale(16)} color='#E11D48' /> : <HeartIcon size={scale(16)} color='#E11D48' />
                                                        }
                                                    </Pressable> */}
                                                </View>

                                                <View style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: scale(10),
                                                    padding: scale(5),
                                                    justifyContent: "space-between",
                                                    backgroundColor: colors.cardColor,
                                                    marginHorizontal: scale(10),
                                                    borderRadius: scale(12)
                                                }}>

                                                    {
                                                        tabData.map((item, index) => {
                                                            return (
                                                                <Pressable
                                                                    key={index}
                                                                    style={[styles.tabBtn, {
                                                                        backgroundColor: selectedTab === item ? '#14b8a6' : colorScheme === "dark" ? "#3f3f46" : "#e4e4e7"
                                                                    }]}
                                                                    onPress={() => {
                                                                        setSelectedTab(item)
                                                                    }}
                                                                ><CustomText style={{
                                                                    fontSize: scale(12),
                                                                    color: selectedTab === item ? "#fff" : colorScheme === "dark" ? "#fff" : "#000"
                                                                }}>{item}</CustomText></Pressable>
                                                            )
                                                        })
                                                    }
                                                </View>

                                                <BottomSheetScrollView contentContainerStyle={[styles.contentContainer, {
                                                    position: "relative"
                                                }]}>
                                                    {
                                                        selectedTab === "Details" && (
                                                            <>
                                                                <View
                                                                    style={{
                                                                        backgroundColor: colors.cardColor,
                                                                        borderWidth: scale(1),
                                                                        borderColor: colors.queueBorder,
                                                                        borderRadius: scale(12),
                                                                        padding: scale(10),
                                                                        gap: verticalScale(5)
                                                                    }}
                                                                >
                                                                    <CustomText
                                                                        style={{
                                                                            fontFamily: "AirbnbCereal_W_Bd",
                                                                        }}
                                                                    >Description</CustomText>

                                                                    <CustomSecondaryText
                                                                        style={{
                                                                            fontSize: scale(14),
                                                                        }}
                                                                    >{salonInfoData?.data?.salonInfo?.salonDesc}</CustomSecondaryText>
                                                                </View>

                                                                <View
                                                                    style={{
                                                                        backgroundColor: colors.cardColor,
                                                                        borderRadius: scale(12),
                                                                        borderWidth: scale(1),
                                                                        borderColor: colors.queueBorder,
                                                                        padding: scale(10),
                                                                        gap: verticalScale(5),
                                                                        flexDirection: "row",
                                                                        alignItems: "center",
                                                                        justifyContent: "space-between"
                                                                    }}
                                                                >

                                                                    <View>
                                                                        <CustomText
                                                                            style={{
                                                                                fontFamily: "AirbnbCereal_W_Bd",
                                                                            }}
                                                                        >Contact Us</CustomText>

                                                                        <CustomSecondaryText
                                                                            style={{
                                                                                fontSize: scale(14),
                                                                            }}
                                                                        >
                                                                            If you have any questions
                                                                        </CustomSecondaryText>
                                                                    </View>

                                                                    <View
                                                                        style={{
                                                                            flexDirection: "row",
                                                                            alignItems: "center",
                                                                            gap: scale(10)
                                                                        }}
                                                                    >
                                                                        <Pressable
                                                                            style={{
                                                                                width: scale(30),
                                                                                height: scale(30),
                                                                                backgroundColor: colors.background,
                                                                                justifyContent: "center",
                                                                                alignItems: "center",
                                                                                borderRadius: scale(4)
                                                                            }}

                                                                            onPress={() => {
                                                                                Linking.openURL(
                                                                                    `tel:${salonInfoData?.data?.salonInfo?.mobileCountryCode}${salonInfoData?.data?.salonInfo?.contactTel}`
                                                                                );
                                                                            }}
                                                                        >
                                                                            <ContactIcon size={scale(18)} color={"#4285F4"} />
                                                                        </Pressable>

                                                                        <Pressable
                                                                            style={{
                                                                                width: scale(30),
                                                                                height: scale(30),
                                                                                backgroundColor: colors.background,
                                                                                justifyContent: "center",
                                                                                alignItems: "center",
                                                                                borderRadius: scale(4)
                                                                            }}
                                                                            onPress={() => {
                                                                                openLink(``)
                                                                            }}
                                                                        >
                                                                            <WhatsappIcon size={scale(18)} color={"#25D366"} />
                                                                        </Pressable>

                                                                        <Pressable
                                                                            style={{
                                                                                width: scale(30),
                                                                                height: scale(30),
                                                                                backgroundColor: colors.background,
                                                                                justifyContent: "center",
                                                                                alignItems: "center",
                                                                                borderRadius: scale(4)
                                                                            }}
                                                                            onPress={() => {
                                                                                openLink(`mailto:${salonInfoData?.data?.salonInfo?.salonEmail}`)
                                                                            }}
                                                                        >
                                                                            <EmailIcon size={scale(18)} color={"#EA4335"} />
                                                                        </Pressable>

                                                                    </View>

                                                                </View>

                                                                <View>

                                                                    {
                                                                        salonInfoData?.data?.salonInfo?.location?.coordinates?.latitude && salonInfoData?.data?.salonInfo?.location?.coordinates?.longitude && (
                                                                            <MapView
                                                                                provider={PROVIDER_GOOGLE}
                                                                                initialCamera={{
                                                                                    center: {
                                                                                        latitude: salonInfoData?.data?.salonInfo?.location?.coordinates?.latitude,
                                                                                        longitude: salonInfoData?.data?.salonInfo?.location?.coordinates?.longitude
                                                                                    },
                                                                                    zoom: 15, // 0 (world view) to ~20 (very close)
                                                                                    pitch: 0,
                                                                                    heading: 0,
                                                                                }}
                                                                                scrollEnabled={false}
                                                                                zoomEnabled={false}
                                                                                rotateEnabled={false}
                                                                                pitchEnabled={false}
                                                                                style={[styles.map,
                                                                                {
                                                                                    // borderColor: "#efefef", 
                                                                                    // borderWidth: scale(1) 
                                                                                }
                                                                                ]}
                                                                                pointerEvents={Platform.OS === "ios" ? "none" : "auto"}
                                                                                customMapStyle={colorScheme === "dark" ? darkMapStyle : []}
                                                                            />
                                                                        )
                                                                    }

                                                                    <View
                                                                        style={{
                                                                            backgroundColor: colors.cardColor,
                                                                            borderBottomLeftRadius: scale(12),
                                                                            borderBottomRightRadius: scale(12),
                                                                            borderWidth: scale(1),
                                                                            borderColor: colors.queueBorder,
                                                                            padding: scale(10),
                                                                            gap: verticalScale(5),
                                                                            flexDirection: "row",
                                                                            alignItems: "center",
                                                                            justifyContent: "space-between"
                                                                        }}
                                                                    >

                                                                        <View>
                                                                            <CustomText
                                                                                style={{
                                                                                    fontFamily: "AirbnbCereal_W_Bd",
                                                                                }}
                                                                            >Location</CustomText>

                                                                            <CustomSecondaryText
                                                                                style={{
                                                                                    fontSize: scale(14),
                                                                                    maxWidth: "90%"
                                                                                }}
                                                                            >
                                                                                {`${salonInfoData?.data?.salonInfo?.address}, ${salonInfoData?.data?.salonInfo?.city}, ${salonInfoData?.data?.salonInfo?.country}`}
                                                                            </CustomSecondaryText>
                                                                        </View>

                                                                        <Pressable
                                                                            style={{
                                                                                width: scale(30),
                                                                                height: scale(30),
                                                                                backgroundColor: colors.background,
                                                                                justifyContent: "center",
                                                                                alignItems: "center",
                                                                                borderRadius: scale(4)
                                                                            }}
                                                                            onPress={() => openLink(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`)}
                                                                        >
                                                                            <MapIcon size={scale(18)} color={"#fbbf24"} />
                                                                        </Pressable>

                                                                    </View>
                                                                </View>

                                                                <View
                                                                    style={{
                                                                        backgroundColor: colors.cardColor,
                                                                        borderColor: colors.queueBorder,
                                                                        borderWidth: scale(1),
                                                                        borderRadius: scale(12),
                                                                        padding: scale(10),
                                                                        gap: verticalScale(5),
                                                                        flexDirection: "row",
                                                                        alignItems: "center",
                                                                        justifyContent: "space-between"
                                                                    }}
                                                                >

                                                                    <View>
                                                                        <CustomText
                                                                            style={{
                                                                                fontFamily: "AirbnbCereal_W_Bd",
                                                                            }}
                                                                        >Follow us on</CustomText>

                                                                        <CustomSecondaryText
                                                                            style={{
                                                                                fontSize: scale(14),
                                                                            }}
                                                                        >
                                                                            Social links
                                                                        </CustomSecondaryText>
                                                                    </View>

                                                                    <View
                                                                        style={{
                                                                            flexDirection: "row",
                                                                            alignItems: "center",
                                                                            gap: scale(10)
                                                                        }}
                                                                    >
                                                                        <Pressable
                                                                            style={{
                                                                                width: scale(30),
                                                                                height: scale(30),
                                                                                backgroundColor: colors.background,
                                                                                justifyContent: "center",
                                                                                alignItems: "center",
                                                                                borderRadius: scale(4)
                                                                            }}
                                                                            onPress={() => openLink(salonInfoData?.data?.salonInfo?.instraLink)}
                                                                        >
                                                                            <InstagramIcon size={scale(18)} color={"#E1306C"} />
                                                                        </Pressable>

                                                                        <Pressable
                                                                            style={{
                                                                                width: scale(30),
                                                                                height: scale(30),
                                                                                backgroundColor: colors.background,
                                                                                justifyContent: "center",
                                                                                alignItems: "center",
                                                                                borderRadius: scale(4)
                                                                            }}
                                                                            onPress={() => openLink(salonInfoData?.data?.salonInfo?.facebookLink)}
                                                                        >
                                                                            <FacebookIcon size={scale(18)} color={"#1877F2"} />
                                                                        </Pressable>


                                                                        <Pressable
                                                                            style={{
                                                                                width: scale(30),
                                                                                height: scale(30),
                                                                                backgroundColor: colors.background,
                                                                                justifyContent: "center",
                                                                                alignItems: "center",
                                                                                borderRadius: scale(4)
                                                                            }}
                                                                            onPress={() => openLink(salonInfoData?.data?.salonInfo?.twitterLink)}
                                                                        >
                                                                            <XIcon size={scale(18)} color={colors.text} />
                                                                        </Pressable>

                                                                        <Pressable
                                                                            style={{
                                                                                width: scale(30),
                                                                                height: scale(30),
                                                                                backgroundColor: colors.background,
                                                                                justifyContent: "center",
                                                                                alignItems: "center",
                                                                                borderRadius: scale(4)
                                                                            }}
                                                                            onPress={() => openLink(salonInfoData?.data?.salonInfo?.tiktokLink)}
                                                                        >
                                                                            <TiktokIcon size={scale(18)} color={colors.text} />
                                                                        </Pressable>

                                                                        <Pressable
                                                                            style={{
                                                                                width: scale(30),
                                                                                height: scale(30),
                                                                                backgroundColor: colors.background,
                                                                                justifyContent: "center",
                                                                                alignItems: "center",
                                                                                borderRadius: scale(4)
                                                                            }}
                                                                            onPress={() => openLink(salonInfoData?.data?.salonInfo?.webLink)}
                                                                        >
                                                                            <WebIcon size={scale(18)} color={colors.text} />
                                                                        </Pressable>

                                                                    </View>

                                                                </View>

                                                                {/* <View
                                                                    style={{
                                                                        flexDirection: "row",
                                                                        alignItems: "center",
                                                                        gap: scale(10),
                                                                        justifyContent: "space-between"
                                                                    }}
                                                                >
                                                                    <Pressable
                                                                        disabled={connectSalonLoader}
                                                                        style={[styles.modalbtn, { backgroundColor: Colors.modeColor.colorCode }]}
                                                                        onPress={() => connectSalonPressed()}
                                                                    >
                                                                        {
                                                                            connectSalonLoader ? (
                                                                                <ActivityIndicator size="small" color="#fff" />
                                                                            ) : (
                                                                                <CustomText style={{ color: "#fff" }}>Connect</CustomText>
                                                                            )
                                                                        }

                                                                    </Pressable>

                                                                    <Pressable
                                                                        style={[styles.closebtn]}
                                                                        onPress={() => setSelectedCustomerSalon({ open: false, data: {} })}
                                                                    >
                                                                        <CustomText style={{ color: "#E11D48" }}>Cancel</CustomText>
                                                                    </Pressable>
                                                                </View> */}
                                                            </>
                                                        )
                                                    }

                                                    {/* {
                                                        selectedTab === "Services" && (
                                                            serviceCategorySelected?.selected ? (
                                                                <>
                                                                    <Pressable
                                                                        onPress={() => {
                                                                            setServiceCategorySelected({
                                                                                selected: false,
                                                                                categoryName: ""
                                                                            })
                                                                        }}
                                                                        style={{
                                                                            flexDirection: "row",
                                                                            alignItems: "center",
                                                                            gap: scale(10),
                                                                            // height: verticalScale(60)
                                                                        }}
                                                                    >
                                                                        <ArrowLeftIcon size={scale(18)} />
                                                                        <CustomText
                                                                            style={{
                                                                                fontFamily: "AirbnbCereal_W_Bd"
                                                                            }}
                                                                        >{serviceCategorySelected?.categoryName}</CustomText>
                                                                    </Pressable>

                                                                    {
                                                                        salonServicesCategoryData?.data?.length > 0 ? (
                                                                            salonServicesCategoryData?.data?.map((item, index) => {
                                                                                return (
                                                                                    <Pressable
                                                                                        key={item?.serviceId}
                                                                                        style={{
                                                                                            borderRadius: scale(10),
                                                                                            backgroundColor: "#00B0901A",
                                                                                            padding: scale(12),
                                                                                            gap: verticalScale(10)
                                                                                        }}
                                                                                    >
                                                                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                                            <View
                                                                                                style={{
                                                                                                    flexDirection: "row",
                                                                                                    alignItems: "center",
                                                                                                    gap: scale(10)
                                                                                                }}
                                                                                            >

                                                                                                {
                                                                                                    item?.selected ? (
                                                                                                        <View
                                                                                                            style={{
                                                                                                                height: scale(50),
                                                                                                                width: scale(50),
                                                                                                                borderRadius: scale(80),
                                                                                                                backgroundColor: "rgba(0,0,0,0.4)",
                                                                                                                position: "relative"
                                                                                                            }}
                                                                                                        >
                                                                                                            <Image
                                                                                                                style={{ height: scale(50), width: scale(50), borderRadius: scale(80), zIndex: -1 }}
                                                                                                                source={{ uri: item?.serviceIcon?.url }}
                                                                                                                contentFit="cover"
                                                                                                                transition={300}
                                                                                                            />
                                                                                                            <CheckIcon
                                                                                                                color='#fff'
                                                                                                                style={{
                                                                                                                    position: "absolute",
                                                                                                                    top: scale(14),
                                                                                                                    left: scale(14)
                                                                                                                }}
                                                                                                            />
                                                                                                        </View>
                                                                                                    ) : (
                                                                                                        <Image
                                                                                                            style={{ height: scale(50), width: scale(50), borderRadius: scale(80) }}
                                                                                                            source={{ uri: item?.serviceIcon?.url }}
                                                                                                            contentFit="cover"
                                                                                                            transition={300}
                                                                                                        />
                                                                                                    )
                                                                                                }

                                                                                                <View style={{ gap: verticalScale(5) }}>
                                                                                                    <CustomText style={{
                                                                                                        fontSize: scale(12),
                                                                                                        fontFamily: "AirbnbCereal_W_Bd"
                                                                                                    }}>{item?.serviceName}</CustomText>
                                                                                                    <Pressable
                                                                                                        style={{
                                                                                                            height: verticalScale(15),
                                                                                                            width: scale(50),
                                                                                                            backgroundColor: "#00B0901A",
                                                                                                            borderRadius: scale(4),
                                                                                                            justifyContent: "center",
                                                                                                            alignItems: "center"
                                                                                                        }}
                                                                                                    ><CustomText style={{ fontSize: scale(10), color: "#00B090" }}>{item?.serviceCategoryName}</CustomText></Pressable>
                                                                                                </View>
                                                                                            </View>

                                                                                            {
                                                                                                item?.selected ? (
                                                                                                    <Pressable
                                                                                                        onPress={() => removeServiceHandler(item)}
                                                                                                        style={{
                                                                                                            height: verticalScale(20),
                                                                                                            width: scale(60),
                                                                                                            backgroundColor: "#E11D48",
                                                                                                            borderRadius: scale(4),
                                                                                                            justifyContent: "center",
                                                                                                            alignItems: "center"
                                                                                                        }}
                                                                                                    ><CustomText style={{ fontSize: scale(12), color: "#fff" }}>Remove</CustomText>
                                                                                                    </Pressable>
                                                                                                ) : (
                                                                                                    <Pressable
                                                                                                        onPress={() => addServiceHandler(item)}
                                                                                                        style={{
                                                                                                            height: verticalScale(20),
                                                                                                            width: scale(55),
                                                                                                            backgroundColor: "#1f2937",
                                                                                                            borderRadius: scale(4),
                                                                                                            justifyContent: "center",
                                                                                                            alignItems: "center"
                                                                                                        }}
                                                                                                    ><CustomText style={{ fontSize: scale(12), color: "#fff" }}>Add</CustomText>
                                                                                                    </Pressable>
                                                                                                )
                                                                                            }
                                                                                        </View>

                                                                                        <View style={{ marginTop: verticalScale(5), gap: verticalScale(5) }}>
                                                                                            <CustomText
                                                                                                style={{
                                                                                                    color: "gray",
                                                                                                    fontSize: scale(12)
                                                                                                }}
                                                                                            >{item?.serviceDesc}</CustomText>

                                                                                            <View
                                                                                                style={{
                                                                                                    flexDirection: "row",
                                                                                                    alignItems: "center",
                                                                                                    justifyContent: "space-between"
                                                                                                }}
                                                                                            >
                                                                                                <View style={{
                                                                                                    flexDirection: "row",
                                                                                                    alignItems: "center",
                                                                                                    gap: scale(2),
                                                                                                    backgroundColor: colors.background,
                                                                                                    paddingHorizontal: scale(5),
                                                                                                    borderRadius: scale(4)
                                                                                                }}>
                                                                                                    <ClockIcon size={scale(12)} color={Colors.modeColor.colorCode} />
                                                                                                    <CustomText style={{ fontSize: scale(12), color: Colors.modeColor.colorCode }}>{formatMinutesToHrMin(item?.serviceEWT)}</CustomText>
                                                                                                </View>

                                                                                                <CustomText
                                                                                                    style={{
                                                                                                        fontFamily: "AirbnbCereal_W_Blk",
                                                                                                        fontSize: scale(18),
                                                                                                        color: Colors.modeColor.colorCode
                                                                                                    }}
                                                                                                >{authenticatedUser?.currency} {item?.servicePrice}</CustomText>
                                                                                            </View>
                                                                                        </View>
                                                                                    </Pressable >
                                                                                )
                                                                            })
                                                                        ) : (
                                                                            <View
                                                                                style={{
                                                                                    height: verticalScale(180),
                                                                                    justifyContent: "center",
                                                                                    alignItems: "center",
                                                                                }}
                                                                            >
                                                                                <CustomText>No services available</CustomText>
                                                                            </View>
                                                                        )

                                                                    }
                                                                </>
                                                            ) : <>
                                                                <CustomText
                                                                    style={{
                                                                        fontFamily: "AirbnbCereal_W_Blk"
                                                                    }}
                                                                >Explore all services</CustomText>

                                                                <View
                                                                    style={{
                                                                        flexDirection: "row",
                                                                        alignItems: "center",
                                                                        flexDirection: "row",
                                                                        flexWrap: "wrap",
                                                                        // paddingVertical: verticalScale(10),
                                                                        gap: scale(20),
                                                                    }}
                                                                >

                                                                    {
                                                                        serviceCategoryData?.loading ? (
                                                                            [0, 1, 2, 3, 4, 5, 6, 7].map((item, index) => {
                                                                                return (
                                                                                    <View
                                                                                        key={index}
                                                                                        style={{
                                                                                            gap: verticalScale(10),
                                                                                            width: scale(65),
                                                                                            // marginBottom: verticalScale(10)
                                                                                        }}
                                                                                    >

                                                                                        <Skeleton
                                                                                            width={scale(60)}
                                                                                            height={scale(60)}
                                                                                            borderRadius={scale(30)}
                                                                                        >

                                                                                        </Skeleton>

                                                                                    </View>
                                                                                )
                                                                            })
                                                                        ) : (
                                                                            serviceCategoryData?.data?.map((item, index) => {
                                                                                return (
                                                                                    <View
                                                                                        key={item?._id}
                                                                                        style={{
                                                                                            gap: verticalScale(10),
                                                                                            width: scale(65),
                                                                                            marginBottom: verticalScale(10)
                                                                                        }}
                                                                                    >

                                                                                        <Pressable
                                                                                            style={{
                                                                                                width: scale(60),
                                                                                                height: scale(60),
                                                                                                borderRadius: scale(30),
                                                                                                backgroundColor: colors.background,
                                                                                                marginHorizontal: "auto"
                                                                                            }}
                                                                                            onPress={() => {
                                                                                                setServiceCategorySelected({
                                                                                                    categoryName: item.serviceCategoryName,
                                                                                                    selected: true
                                                                                                })
                                                                                            }}
                                                                                        >
                                                                                            <Image
                                                                                                style={{ width: "100%", height: "100%", borderRadius: scale(30) }}
                                                                                                source={{ uri: item?.serviceCategoryImage?.url.replace("http", "https") }}
                                                                                                contentFit="cover"
                                                                                                transition={1000}
                                                                                            />
                                                                                        </Pressable>
                                                                                        <CustomText
                                                                                            style={{
                                                                                                fontFamily: "AirbnbCereal_W_Md",
                                                                                                fontSize: scale(12),
                                                                                                textAlign: "center",
                                                                                                color: "gray",
                                                                                            }}
                                                                                        >{item.serviceCategoryName}</CustomText>
                                                                                    </View>
                                                                                )
                                                                            })
                                                                        )
                                                                    }

                                                                </View>
                                                            </>

                                                        )
                                                    } */}

                                                    {
                                                        selectedTab === "Services" && (
                                                            salonInfoData?.loading ? (
                                                                [0, 1, 2, 3, 4, 5, 6, 7].map((_, index) => (
                                                                    <Skeleton
                                                                        key={index}
                                                                        height={scale(80)}
                                                                        borderRadius={scale(12)}
                                                                        style={{
                                                                            marginBottom: verticalScale(5),
                                                                        }}
                                                                    />
                                                                ))
                                                            ) : (
                                                                salonInfoData?.data?.categorizedSalonServices?.map((item, index) => (
                                                                    <React.Fragment key={item?.serviceCategoryName || index}>
                                                                        <CustomText style={styles.serviceName}>
                                                                            {item?.serviceCategoryName}
                                                                        </CustomText>
                                                                        {item?.services?.map((ser) => (
                                                                            <View
                                                                                key={ser.serviceId}
                                                                                style={[
                                                                                    styles.card,
                                                                                    {
                                                                                        backgroundColor: colors.cardColor,
                                                                                        borderColor: colors.queueBorder,
                                                                                        borderWidth: scale(1),
                                                                                    },
                                                                                ]}
                                                                            >
                                                                                <Image source={{ uri: ser?.serviceIcon?.url }} style={styles.icon} />
                                                                                <View style={styles.cardContent}>
                                                                                    <CustomText style={styles.serviceName}>{ser.serviceName}</CustomText>
                                                                                    <CustomText style={[styles.serviceDesc, { color: colors.secondaryText }]}>
                                                                                        {ser.serviceDesc}
                                                                                    </CustomText>
                                                                                    <View
                                                                                        style={{
                                                                                            flexDirection: "row",
                                                                                            alignItems: "center",
                                                                                            gap: scale(10),
                                                                                            marginTop: verticalScale(5),
                                                                                        }}
                                                                                    >
                                                                                        <CustomText style={styles.servicePrice}>
                                                                                            {salonInfoData?.data?.salonInfo?.currency} {ser.servicePrice}
                                                                                        </CustomText>
                                                                                        <CustomText style={[styles.serviceEWT, { color: colors.secondaryText }]}>
                                                                                            ~ {ser.serviceEWT} mins
                                                                                        </CustomText>
                                                                                    </View>
                                                                                </View>
                                                                            </View>
                                                                        ))}
                                                                    </React.Fragment>
                                                                ))
                                                            )
                                                        )
                                                    }

                                                    {
                                                        selectedTab === "Stylists" && (
                                                            <>
                                                                <CustomText
                                                                    style={{
                                                                        fontFamily: "AirbnbCereal_W_Blk"
                                                                    }}
                                                                >Explore all stylists</CustomText>

                                                                {
                                                                    salonInfoData?.data?.barbers?.length > 0 ? (
                                                                        <View
                                                                            style={{
                                                                                flexDirection: "row",
                                                                                flexWrap: "wrap",
                                                                                gap: scale(10)
                                                                            }}
                                                                        >

                                                                            {
                                                                                salonInfoData?.data?.barbers?.map((item, index) => {
                                                                                    return (<BarberCard key={item?.barberId} item={item} />)
                                                                                })
                                                                            }

                                                                        </View>
                                                                    ) : (
                                                                        <View style={{
                                                                            height: verticalScale(180),
                                                                            justifyContent: "center",
                                                                            alignItems: "center",
                                                                        }}>
                                                                            <CustomText>No barbers available</CustomText>
                                                                        </View>
                                                                    )
                                                                }

                                                            </>
                                                        )
                                                    }

                                                    <TouchableOpacity
                                                        onPress={() => connectSalonPressed()}
                                                        disabled={connectSalonLoader}
                                                        style={styles.signinButton} activeOpacity={0.85}>
                                                        {
                                                            connectSalonLoader ? (
                                                                <ActivityIndicator size="small" color="#fff" />
                                                            ) : (
                                                                <CustomText style={styles.signinButtonText}>Connect</CustomText>
                                                            )
                                                        }
                                                    </TouchableOpacity>

                                                </BottomSheetScrollView>

                                                {/* <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        gap: scale(10),
                                                        justifyContent: "space-between",
                                                        marginHorizontal: scale(10)
                                                    }}
                                                >
                                                    <Pressable
                                                        disabled={connectSalonLoader}
                                                        style={[styles.modalbtn, { backgroundColor: Colors.modeColor.colorCode }]}
                                                        onPress={() => connectSalonPressed()}
                                                    >
                                                        {
                                                            connectSalonLoader ? (
                                                                <ActivityIndicator size="small" color="#fff" />
                                                            ) : (
                                                                <CustomText style={{ color: "#fff" }}>Connect</CustomText>
                                                            )
                                                        }

                                                    </Pressable>

                                                </View> */}

                                            </BottomSheet>
                                        )
                                    }

                                </GestureHandlerRootView>
                            </SafeAreaView>
                        </View>
                    </Modal>

                </View >
            </TouchableWithoutFeedback >
        </>
    )
}

export default Map

const SalonItem = ({ item }) => {

    const { colors } = useTheme()

    return (
        <View style={[styles.cardWrapper, { backgroundColor: colors.background }]} >
            <Image
                style={styles.cardImage}
                source={{ uri: item.url }}
                contentFit="cover"
                transition={300}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    modalWrapper: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        // paddingHorizontal: scale(20),
    },
    modalContainer: {
        width: '100%',
        height: "90%",
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
        height: verticalScale(140),
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
        width: "48%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: verticalScale(15),
        borderRadius: moderateScale(6),
        backgroundColor: "#E11D481A"
    },




    container: {
        flex: 1,
    },

    contentContainer: {
        paddingHorizontal: scale(10),
        paddingTop: scale(10),
        // paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(10),
        gap: verticalScale(10)
        // backgroundColor: "#fff",
    },

    cardWrapper: {
        height: verticalScale(200),
        width: scale(400),
    },
    cardImage: {
        height: "100%",
        width: "100%",
    },

    tabBtn: {
        height: verticalScale(30),
        flex: 1,
        paddingInline: scale(10),
        borderRadius: scale(8),
        justifyContent: "center",
        alignItems: "center"
    },

    map: {
        width: "100%",
        height: verticalScale(128),
        borderTopLeftRadius: scale(12),
        borderTopRightRadius: scale(12)
    },

    signinButton: {
        width: '100%',
        backgroundColor: '#14b8a6', // bg-teal-500
        paddingVertical: verticalScale(12), // py-4
        borderRadius: scale(8), // rounded-xl
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(20),
    },
    signinButtonText: {
        color: '#fff', // text-white
        fontFamily: "AirbnbCereal_W_XBd",
        fontSize: scale(16),
    },


    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        marginHorizontal: 16,
    },
    card: {
        flexDirection: 'row',
        padding: scale(12),
        // marginHorizontal: 16,
        marginBottom: verticalScale(8),
        borderRadius: scale(12),
    },
    icon: {
        width: scale(60),
        height: scale(60),
        borderRadius: scale(8),
        marginRight: scale(12),
        borderWidth: scale(1),
        borderColor: '#efefef', // gray-200
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    serviceName: {
        fontSize: scale(16),
        fontFamily: "AirbnbCereal_W_Bd"
    },
    serviceDesc: {
        fontSize: scale(14),
    },
    servicePrice: {
        fontSize: scale(14),
        fontFamily: "AirbnbCereal_W_Bd",
        color: '#14b8a6'
    },
    serviceEWT: {
        fontSize: scale(12),
    },
})




{/* {
                            selectedSalonLocation?.latitude && selectedSalonLocation?.longitude && (
                                <Marker
                                    coordinate={{
                                        latitude: selectedSalonLocation.latitude,
                                        longitude: selectedSalonLocation.longitude,
                                    }}
                                    title={selectedSalonLocation?.salonName}
                                    description={selectedSalonLocation?.address}
                                />
                            )
                        } */}