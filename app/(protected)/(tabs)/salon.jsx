import { FlatList, Linking, Platform, Pressable, ScrollView, SectionList, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useFocusEffect } from 'expo-router';
import { Image } from 'expo-image';
import { useTheme } from '@react-navigation/native';
import { Colors } from '../../../constants/Colors';
import CustomText from '../../../components/CustomText';
import { ArrowLeftIcon, CheckIcon, ClockIcon, ContactIcon, EmailIcon, FacebookIcon, HeartFilledIcon, HeartIcon, InstagramIcon, MapIcon, TiktokIcon, WebIcon, WhatsappIcon, XIcon } from '../../../constants/icons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import BarberCard from '../../../components/BarberCard';
import CustomTabView from '../../../components/CustomTabView';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import { useAuth } from '../../../context/AuthContext';
import Skeleton from '../../../components/Skeleton';
import { Toast } from 'toastify-react-native'
import { Alert } from 'react-native';
import CustomSecondaryText from '../../../components/CustomSecondaryText';

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


const salon = () => {

    const { authenticatedUser } = useAuth()

    const [salonInfoData, setSalonInfoData] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
    })

    useFocusEffect(
        useCallback(() => {
            const fetchSalonInfo = async () => {
                try {

                    setSalonInfoData((prev) => ({ ...prev, loading: true }))

                    const { data } = await axios.get(`${BASE_URL}/mobileRoutes/getSalonInfoBySalonId`, {
                        params: {
                            salonId: authenticatedUser?.salonId,
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

        }, [authenticatedUser])
    )

    // console.log("salonInfoData ", salonInfoData?.data?.salonInfo?.gallery)

    const flatlistRef = useRef()
    const [currentIndex, setCurrentIndex] = useState(0)

    // hooks
    const sheetRef = useRef(null);

    // variables
    const data = useMemo(
        () =>
            Array(50)
                .fill(0)
                .map((_, index) => `index-${index}`),
        []
    );


    // render
    const renderItem = useCallback(
        (item) => (
            <View key={item} style={styles.itemContainer}>
                <Text>{item}</Text>
            </View>
        ),
        []
    );

    const [tabData, setTabData] = useState([
        "Details",
        "Services",
        "Stylists"
    ])

    const [selectedTab, setSelectedTab] = useState("Details")

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

    const serviceCategories = [
        {
            name: "Cutting",
            image: require("../../../assets/images/1.png"),
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
            image: require("../../../assets/images/2.png"),
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
            image: require("../../../assets/images/1.png"),
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
            image: require("../../../assets/images/4.png"),
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
            image: require("../../../assets/images/5.png"),
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
            image: require("../../../assets/images/6.png"),
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
            image: require("../../../assets/images/7.png"),
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
            image: require("../../../assets/images/2.png"),
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
            image: require("../../../assets/images/1.png"),
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
            image: require("../../../assets/images/4.png"),
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

    ]

    const [serviceCategorySelected, setServiceCategorySelected] = useState({
        categoryName: "",
        selected: false
    })

    const barbersData = [
        {
            id: 1,
            image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            name: "Korbyn Larson",
            online: true,
            estTime: "15 mins",
        },
        {
            id: 2,
            image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
            name: "Aden Schneider",
            online: true,
            estTime: "15 mins",
        },
        {
            id: 3,
            image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            name: "Parker Howard",
            online: true,
            estTime: "15 mins",
        },
        {
            id: 4,
            image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            name: "Paulina Arroyo",
            online: true,
            estTime: "15 mins",
        },
        {
            id: 5,
            image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
            name: "Parker Howard",
            online: true,
            estTime: "15 mins",

        },
        {
            id: 6,
            image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            name: "Paulina Arroyo",
            online: true,
            estTime: "15 mins",

        },

    ]

    const { colors } = useTheme()
    const colorScheme = useColorScheme();

    // console.log(salonInfoData?.data?.salonInfo?.location?.coordinates?.latitude)

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
                                salonId: authenticatedUser?.salonId,
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


        }, [authenticatedUser, serviceCategorySelected])
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
                salonId: authenticatedUser?.salonId
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

            Toast.success("Successfully added to favourites")

        } catch (error) {
            setFavouriteLoader(false)
            Toast.show({ type: "error", text1: error?.response?.data?.message || "Something went wrong" });
            console.log("Error in favourite salon ", error);
        }
    }


    const handleCall = async () => {
        const phoneNumber = '+919876543210'; // Include country code if needed
        const url = `tel:${phoneNumber}`;

        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert("Can't open dialer");
        }
    };

    function formatMinutesToHrMin(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        if (hours > 0 && mins > 0) return `${hours}hr ${mins}min`;
        if (hours > 0) return `${hours}hr`;
        return `${mins}min`;
    }

    // console.log("categorizedSalonServices ", JSON.stringify(salonInfoData?.data?.categorizedSalonServices, null, 2));


    const dummyServicesData = [
        {
            "serviceCategoryName": "Beard",
            "services": [
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
                    "serviceEWT": 37,
                    "vipService": false,
                    "_id": "68060458c3952c26da52b8ed",
                    "serviceCategoryName": "Beard"
                }
            ]
        },
        {
            "serviceCategoryName": "Haircut",
            "services": [
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
                    "serviceEWT": 25,
                    "vipService": false,
                    "_id": "67a46936c85dd16cdfa7ef9b",
                    "serviceCategoryName": "Haircut"
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
                    "serviceEWT": 130,
                    "vipService": false,
                    "_id": "67a46936c85dd16cdfa7ef9c",
                    "serviceCategoryName": "Haircut"
                },
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
                    "serviceEWT": 20,
                    "vipService": false,
                    "_id": "68060458c3952c26da52b8ec",
                    "serviceCategoryName": "Haircut"
                }
            ]
        },
        {
            "serviceCategoryName": "Massage",
            "services": [
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
                    "serviceEWT": 30,
                    "vipService": true,
                    "_id": "67a46936c85dd16cdfa7ef9e",
                    "serviceCategoryName": "Massage"
                },
                {
                    "serviceIcon": {
                        "public_id": "icons/shave_1706703379407",
                        "url": "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/shave_1706703379407.png"
                    },
                    "serviceId": 19,
                    "serviceCode": "TH19",
                    "serviceName": "Thai massage",
                    "serviceDesc": "Shdhdh",
                    "servicePrice": 22,
                    "serviceEWT": 11,
                    "vipService": true,
                    "_id": "6808e100c7b7ec5c21cb9f98",
                    "serviceCategoryName": "Massage"
                }
            ]
        },
        {
            "serviceCategoryName": "Spa",
            "services": [
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
                    "serviceEWT": 50,
                    "vipService": true,
                    "_id": "67a46936c85dd16cdfa7ef9d",
                    "serviceCategoryName": "Spa"
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
                    "serviceEWT": 34,
                    "vipService": false,
                    "_id": "68060458c3952c26da52b8ea",
                    "serviceCategoryName": "Spa"
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
                    "serviceEWT": 60,
                    "vipService": true,
                    "_id": "68060458c3952c26da52b8eb",
                    "serviceCategoryName": "Spa"
                }
            ]
        }
    ]


    return (
        <CustomTabView
            style={{
                paddingHorizontal: scale(0),
                paddingTop: verticalScale(0),
            }}
        >
            <GestureHandlerRootView style={[styles.container, {
                backgroundColor: colors.background
            }]}>

                {
                    salonInfoData?.loading ? (
                        <Skeleton
                            height={verticalScale(200)}
                            width={scale(400)}
                        />
                    ) : salonInfoData?.data?.salonInfo?.gallery?.length > 0 ? (
                        <View>
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
                                    width: "100%",
                                    height: "100%",
                                }}
                                source={require('@/assets/images/dummygallery.jpg')}
                                contentFit="cover"
                                transition={300}
                            />
                        </View>
                    )
                }


                <BottomSheet
                    ref={sheetRef}
                    index={0}
                    snapPoints={Platform.OS === "ios" ? ["72%", "90%"] : ["70%", "87%"]}
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

                    {/* <View style={{
                        paddingInline: scale(10),
                        marginVertical: verticalScale(10),
                        gap: verticalScale(5)
                    }}>
                        <CustomText
                            numberOfLines={1}
                            style={{
                                fontFamily: "AirbnbCereal_W_XBd",
                                fontSize: scale(26),
                            }}>{salonInfoData?.data?.salonInfo?.salonName}</CustomText>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: scale(5),
                            }}
                        >

                            <Pressable
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                onPress={() => openLink(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`)}
                            >
                                <MapIcon size={scale(18)} color={'#14b8a6'} />
                            </Pressable>

                            <CustomText
                                style={{
                                    fontSize: scale(14),
                                    color: "gray",
                                    maxWidth: "90%"
                                }}
                            >
                                {
                                    !salonInfoData?.loading && (
                                        `${salonInfoData?.data?.salonInfo?.address}, ${salonInfoData?.data?.salonInfo?.city}, ${salonInfoData?.data?.salonInfo?.country}`
                                    )
                                }
                            </CustomText>

                        </View>
                    </View> */}

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: scale(10),
                            padding: scale(10),
                            // justifyContent: "space-between"
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

                    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
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
                                                onPress={() => openLink(salonInfoData?.data?.salonInfo?.fbLink)}
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
                                                                {authenticatedUser?.currency} {ser.servicePrice}
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

                    </BottomSheetScrollView>


                </BottomSheet>
            </GestureHandlerRootView>
        </CustomTabView>
    )
}

export default salon

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: scale(10),
        paddingTop: scale(10),
        paddingBottom: Platform.OS === "ios" ? verticalScale(100) : verticalScale(20),
        gap: verticalScale(10)
        // backgroundColor: "#fff",
    },
    itemContainer: {
        padding: 6,
        margin: 6,
        backgroundColor: "#eee",
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
        backgroundColor: "gray",
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