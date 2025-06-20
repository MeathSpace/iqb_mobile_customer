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

    const connectSalonPressed = async () => {
        setAuthenticatedUser({ ...authenticatedUser, salonId: 1 })
        await AsyncStorage.setItem("LoggedInUser", JSON.stringify({ ...authenticatedUser, salonId: 1 }))
        setSelectedCustomerSalon({ open: false, data: {} })
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

    return (
        <>
            <MapView
                // style={{ flex: 1 }}
                provider={PROVIDER_GOOGLE}
                region={region}
                // region={{
                //     latitude: 37.78825,
                //     longitude: -122.4324,
                //     latitudeDelta: 0.0922,
                //     longitudeDelta: 0.0421,
                // }}
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
                            borderWidth: scale(1),
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

                        {/* {selectedCustomerSalon?.data?.services?.map((service, idx) => (
                            <CustomSecondaryText key={idx} style={styles.modalService}>• {service}</CustomSecondaryText>
                        ))} */}


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
                                    // height: verticalScale(97),
                                    flexDirection: "row",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    paddingVertical: verticalScale(20),
                                    gap: scale(25),
                                    // justifyContent: "space-between"
                                }}
                            >

                                {
                                    serviceCategories.map((item, index) => {
                                        return (
                                            <View
                                                key={index}
                                                style={{
                                                    gap: verticalScale(10),
                                                    // width: scale(65),
                                                    // marginBottom: verticalScale(10)
                                                    // paddingLeft: scale(5)
                                                }}
                                            >

                                                <View
                                                    style={{
                                                        width: scale(45),
                                                        height: scale(45),
                                                        borderRadius: scale(30),
                                                        backgroundColor: colors.background,
                                                        marginHorizontal: "auto"
                                                    }}
                                                >
                                                    <Image
                                                        style={{ width: "100%", height: "100%", borderRadius: scale(30) }}
                                                        source={item.image}
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
                                                >{item.name}</CustomText>
                                            </View>
                                        )
                                    })
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
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: verticalScale(10),
        borderRadius: moderateScale(6),
        backgroundColor: "#E11D481A"
    }
})


