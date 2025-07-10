import { FlatList, Platform, Pressable, Image as ReactNativeImage, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import CustomTabView from './CustomTabView'
import CustomText from './CustomText'
import { useAuth } from '../context/AuthContext'
import CustomSecondaryText from './CustomSecondaryText'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../constants/Colors'
import AdvertiseCard from './AdvertiseCard'
import { ClockIcon, CuttingIcon, DyeIcon, MenuIcon, NextIcon, QueueIcon, RightIcon, SettingsIcon, StylingIcon, TrimIcon, UserIcon } from '../constants/icons'
import StatusCard from './StatusCard'
import BarberCard from './BarberCard'
import { Link, router, useFocusEffect } from 'expo-router'
import { Dimensions } from 'react-native';
import { Image } from 'expo-image'
import { useTheme } from '@react-navigation/native'
import { useGlobal } from '../context/GlobalContext'
import axios from 'axios'
import { BASE_URL } from '@/utils/api';
import Skeleton from './Skeleton'

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});



function handleRegistrationError(errorMessage) {
    alert(errorMessage);
    throw new Error(errorMessage);
}


async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission not granted to get push token for push notification!');
            return;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            // console.log("From Dashboard Screen ",pushTokenString);
            return pushTokenString;
        } catch (e) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}


const Dashboard = () => {

    const { homeDashboardData, setHomeDashboardData } = useGlobal()
    const { authenticatedUser } = useAuth()

    // console.log("Authenticated user", authenticatedUser)

    const [sliceBarber, setSliceBarber] = useState(3)

    const [homeAdvertisementData, setHomeAdvertisementData] = useState({
        advertisementData: null,
        loading: false,
        error: null,
        success: false
    })

    const [serviceCategoryData, setServiceCategoryData] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
    })

    // console.log("homeDashboardData ", homeDashboardData)

    useFocusEffect(
        useCallback(() => {
            if (authenticatedUser) {

                const fetchDashboardData = async () => {
                    try {

                        setHomeDashboardData((prev) => ({ ...prev, loading: true }))

                        const { data } = await axios.post(`${BASE_URL}/customer/customerDashboard`, {
                            salonId: authenticatedUser?.salonId
                        })

                        setHomeDashboardData((prev) => ({ ...prev, loading: false, dashboardData: data?.response, success: true, error: null }))

                    } catch (error) {
                        setHomeDashboardData((prev) => ({ ...prev, loading: false, dashboardData: null, success: false, error: error }))
                        console.error("Error fetching dashboard data: ", error?.response?.data)
                    }
                }

                const fetchAdvertisementData = async () => {
                    try {

                        setHomeAdvertisementData((prev) => ({ ...prev, loading: true }))

                        const { data } = await axios.post(`${BASE_URL}/mobileRoutes/getAllAdvertisements`, {
                            salonId: authenticatedUser?.salonId
                        })

                        setHomeAdvertisementData((prev) => ({ ...prev, loading: false, advertisementData: data?.response, success: true, error: null }))


                    } catch (error) {
                        setHomeAdvertisementData((prev) => ({ ...prev, loading: false, advertisementData: null, success: false, error: error }))
                        console.error("Error fetching advertisement data: ", error)
                    }
                }

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

                fetchDashboardData()
                fetchAdvertisementData()
                fetchServiceCategoryData()
            }

            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [authenticatedUser])
    );

    const { colors } = useTheme()

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
            title: "serviceCategory",
        },
        {
            title: "barber",
        },
        {
            title: "services",
        }
    ]

    const salonData = [
        {
            id: '1',
            title: 'Glamour Grace Salon',
            image: 'https://cdn.pixabay.com/photo/2019/03/08/20/17/beauty-salon-4043096_960_720.jpg',
            services: ['Haircuts', 'Coloring', 'Styling', 'Bridal Packages', 'Spa Treatments'],
        },
        {
            id: '2',
            title: 'Velvet & Ivy Spa',
            image: 'https://cdn-ilblohb.nitrocdn.com/CoViiNPrBmwoLCQyMsMvkIwRSuXFuqci/assets/images/optimized/rev-27f70e7/www.latestinteriors.com/wp-content/uploads/2024/01/Interior-Designers-in-Delhi-3.jpeg',
            services: ['Organic Facials', 'Aromatherapy Massages', 'Holistic Beauty Treatments'],
        },
        {
            id: '3',
            title: 'The Luxe Lotus',
            image: 'https://cdn.pixabay.com/photo/2019/03/08/20/17/beauty-salon-4043096_960_720.jpg',
            services: ['Hair Extensions', 'Keratin Treatments', 'Luxury Manicures'],
        },
        {
            id: '4',
            title: 'Blush & Blossom Beauty',
            image: 'https://cdn-ilblohb.nitrocdn.com/CoViiNPrBmwoLCQyMsMvkIwRSuXFuqci/assets/images/optimized/rev-27f70e7/www.latestinteriors.com/wp-content/uploads/2024/01/Interior-Designers-in-Delhi-3.jpeg',
            services: ['Makeup Artistry', 'Eyelash Extensions', 'Skincare Consultations'],
        },
        {
            id: '5',
            title: 'Opulence Oasis Salon',
            image: 'https://cdn.pixabay.com/photo/2019/03/08/20/17/beauty-salon-4043096_960_720.jpg',
            services: ['Hair Spa Therapies', 'Color Correction', 'Personalized Styling Sessions'],
        },
    ];

    const salonStatus = [
        {
            id: 1,
            title: "System Status",
            icon: SettingsIcon,
            value: homeDashboardData?.dashboardData?.salonInfo?.mobileBookingAvailability ? "ON" : "OFF",
            color1: homeDashboardData?.dashboardData?.salonInfo?.mobileBookingAvailability ? "#00B090" : "#E11D48",
            color2: homeDashboardData?.dashboardData?.salonInfo?.mobileBookingAvailability ? "#CCEFE9" : "#E11D481A"
        },
        {
            id: 2,
            title: "Total Queue",
            icon: QueueIcon,
            value: homeDashboardData?.dashboardData?.totalQueueCount || 0,
            color1: "#006FFD",
            color2: "#006FFD33"
        },
        {
            id: 3,
            title: "Next In Queue",
            icon: NextIcon,
            value: homeDashboardData?.dashboardData?.leastQueueCount + 1,
            color1: "#EAA824",
            color2: "#EAA82433"
        },
        {
            id: 4,
            title: "On Duty Staff",
            icon: UserIcon,
            value: homeDashboardData?.dashboardData?.barberOnDuty,
            color1: "#7ED4AD",
            color2: "#7ED4AD33"
        },
    ]

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



    // Notification Code 


    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(
        undefined
    );

    useFocusEffect(
        useCallback(() => {
            registerForPushNotificationsAsync()
                .then(token => setExpoPushToken(token ?? ''))
                .catch((error) => setExpoPushToken(`${error}`));

            const notificationListener = Notifications.addNotificationReceivedListener(notification => {
                setNotification(notification);
            });

            const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
                // console.log(response);
            });

            return () => {
                notificationListener.remove();
                responseListener.remove();
            };
        }, [])
    )

    useFocusEffect(
        useCallback(() => {
            if (expoPushToken) {
                const saveExpoPushToken = async () => {
                    try {
                        const { data } = await axios.post(`${BASE_URL}/mobileRoutes/pushDevices`, {
                            salonId: authenticatedUser?.salonId,
                            name: authenticatedUser?.name,
                            email: authenticatedUser?.email,
                            deviceToken: expoPushToken,
                            deviceType: "android"
                        })


                        // console.log("Saved Notifcation Data ", data)
                    } catch (error) {
                        console.log("Error saving token ", error)
                    }
                }

                saveExpoPushToken()
            }

        }, [expoPushToken, authenticatedUser])
    )

    // console.log("Real Token From Dashboard ", expoPushToken)

    return (
        <CustomTabView
            style={{
                paddingTop: verticalScale(0),
                paddingBottom: Platform.OS === "ios" ? verticalScale(60) : verticalScale(10)
            }}
        >
            <FlatList
                data={pageData}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    gap: verticalScale(0)
                }}
                renderItem={({ item }) => {
                    switch (item.title) {
                        case "advertise": {
                            return (
                                <>
                                    {
                                        homeAdvertisementData?.loading ? (<FlatList
                                            style={{
                                                overflow: "visible",
                                            }}
                                            contentContainerStyle={{
                                                gap: scale(10),
                                            }}
                                            data={salonData}
                                            renderItem={({ item }) => <View style={{
                                                paddingVertical: verticalScale(20),
                                            }}>
                                                <Skeleton width={scale(300.56)} height={verticalScale(145)} borderRadius={scale(12)} />
                                            </View>}
                                            keyExtractor={item => item.id}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                        />) : homeAdvertisementData?.advertisementData?.length ? (<FlatList
                                            style={{
                                                overflow: "visible",
                                            }}
                                            contentContainerStyle={{
                                                gap: scale(10),
                                            }}
                                            data={homeAdvertisementData?.advertisementData}
                                            renderItem={({ item }) => <AdvertiseCard item={item} />}
                                            keyExtractor={item => item._id}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                        />) : (
                                            <View
                                                style={{
                                                    width: "100%",
                                                    height: verticalScale(180),
                                                    paddingVertical: verticalScale(20),
                                                }}
                                            >
                                                <Image
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        borderRadius: scale(12),
                                                        borderWidth: scale(1),
                                                        borderColor: "#d3d3d3"
                                                    }}
                                                    source={require('@/assets/images/dummygallery.jpg')}
                                                    contentFit="cover"
                                                    transition={300}
                                                />
                                            </View>
                                        )
                                    }

                                </>
                            )
                        }

                        case "status": {
                            return (

                                homeDashboardData?.loading ? (<FlatList
                                    style={{
                                        overflow: "visible",
                                    }}
                                    contentContainerStyle={{
                                        flex: 1,
                                        flexDirection: "row",
                                        gap: scale(10),
                                        paddingVertical: verticalScale(10),
                                        justifyContent: "space-evenly"
                                    }}
                                    data={salonStatus}
                                    renderItem={({ item }) => <Skeleton width={scale(60)} height={scale(80)} />}
                                    keyExtractor={item => item.id}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    bounces={false}
                                />) : (<FlatList
                                    style={{
                                        overflow: "visible",
                                    }}
                                    contentContainerStyle={{
                                        flex: 1,
                                        flexDirection: "row",
                                        gap: scale(10),
                                        paddingVertical: verticalScale(10),
                                        justifyContent: "space-evenly"
                                    }}
                                    data={salonStatus}
                                    renderItem={({ item }) => <StatusCard item={item} />}
                                    keyExtractor={item => item.id}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    bounces={false}
                                />)


                            )
                        }

                        case "hero": {
                            return (
                                <>
                                    <CustomText style={{ fontFamily: "AirbnbCereal_W_Bd" }}>Hello, {authenticatedUser.name} 👋</CustomText>
                                    {
                                        homeDashboardData?.loading ? (
                                            <View style={{
                                                marginBottom: verticalScale(15),
                                                marginTop: verticalScale(10)
                                            }}>
                                                <Skeleton height={verticalScale(30)} />
                                            </View>
                                        ) : homeDashboardData?.dashboardData?.salonInfo?.salonDesc?.length ? (<CustomText style={{ fontSize: scale(14), marginBottom: verticalScale(15), marginTop: verticalScale(10) }}>
                                            {homeDashboardData?.dashboardData?.salonInfo?.salonDesc}
                                        </CustomText>) : (
                                            <CustomText style={{ fontSize: scale(14), marginBottom: verticalScale(15), marginTop: verticalScale(10) }}>
                                                This salon currently doesn't have a description.
                                            </CustomText>
                                        )
                                    }
                                    {/* <CustomText style={{ fontSize: scale(14), marginBottom: verticalScale(15), marginTop: verticalScale(10) }}>
                                        We strive to reach beyond the roots (of hair), and into the refinement and healing of one’s core self.
                                    </CustomText> */}
                                    <View style={{
                                        flexDirection: "row",
                                        gap: verticalScale(10),
                                        marginVertical: verticalScale(5)
                                        // marginBottom: verticalScale(20)
                                    }}>
                                        <Pressable
                                            onPress={() => router.push("/queuelist")}
                                            style={[styles.btn, {
                                                backgroundColor: Colors.modeColor.colorCode, shadowColor: Colors.modeColor.colorCode,
                                            }]}>
                                            <CustomText style={{ color: "#fff", fontSize: scale(14) }}>Join Queue</CustomText>
                                        </Pressable>

                                        <Pressable
                                            onPress={() => router.push("/appointment")}
                                            style={[styles.btn, {
                                                backgroundColor: Colors.modeColor.colorCode2,
                                                shadowColor: Colors.modeColor.colorCode,
                                                borderColor: Colors.modeColor.colorCode,
                                                borderWidth: scale(1)
                                            }]}>
                                            <CustomText
                                                style={{
                                                    color: Colors.modeColor.colorCode,
                                                    fontSize: scale(14),
                                                }}>Book Appointment</CustomText>
                                        </Pressable>
                                    </View>
                                </>

                            )
                        }

                        case "serviceCategory": {
                            return (
                                <View>
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
                                            gap: scale(20),
                                            // justifyContent: "space-between"
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

                                                            <View
                                                                style={{
                                                                    width: scale(60),
                                                                    height: scale(60),
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
                            )
                        }

                        case "barber": {
                            return (
                                <>
                                    <View style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        paddingBottom: verticalScale(15)
                                    }}>
                                        <CustomText style={{
                                            fontFamily: "AirbnbCereal_W_Blk",
                                        }}>Barbers on duty <CustomText
                                            style={{
                                                fontFamily: "AirbnbCereal_W_Blk",
                                                color: Colors.modeColor.colorCode
                                            }}
                                        >{homeDashboardData?.dashboardData?.barberOnDuty}</CustomText></CustomText>

                                    </View>

                                    {
                                        homeDashboardData?.loading ? (
                                            <FlatList
                                                key={3}
                                                style={{
                                                    overflow: "visible",
                                                }}
                                                columnWrapperStyle={{
                                                    columnGap: scale(10),
                                                }}
                                                data={[0, 1, 2, 3, 4, 5,]}
                                                renderItem={({ item }) => <Skeleton
                                                    height={verticalScale(110)}
                                                    width={scale(103)}
                                                    borderRadius={scale(10)}

                                                    style={{
                                                        marginBottom: verticalScale(10)
                                                    }}
                                                />}
                                                keyExtractor={item => item}
                                                bounces={false}
                                                numColumns={3}
                                            />
                                        ) : homeDashboardData?.dashboardData?.barbers?.length ? (
                                            <FlatList
                                                key={3}
                                                style={{
                                                    overflow: "visible",
                                                }}
                                                columnWrapperStyle={{
                                                    columnGap: scale(10),
                                                }}
                                                data={homeDashboardData?.dashboardData?.barbers.slice(0, sliceBarber)}
                                                renderItem={({ item }) => <BarberCard item={item} />}
                                                keyExtractor={item => item.id}
                                                bounces={false}
                                                numColumns={3}
                                            />
                                        ) : (
                                            <View
                                                style={{
                                                    height: verticalScale(100),
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginBottom: verticalScale(40)
                                                }}
                                            ><CustomText>No barbers available</CustomText></View>
                                        )
                                    }

                                    {
                                        sliceBarber < homeDashboardData?.dashboardData?.barbers?.length && (
                                            <Pressable
                                                onPress={() => {
                                                    setSliceBarber(homeDashboardData?.dashboardData?.barbers?.length)
                                                }}
                                                style={{
                                                    height: verticalScale(35),
                                                    backgroundColor: "#00B0901A",
                                                    borderRadius: scale(4),
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginBottom: verticalScale(20)
                                                }}
                                            >
                                                <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
                                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                        {
                                                            homeDashboardData?.dashboardData?.barbers?.slice(0, 3).map((item, index) => {
                                                                return (
                                                                    <View
                                                                        key={index}
                                                                        style={{
                                                                            height: scale(25),
                                                                            width: scale(25),
                                                                            borderRadius: scale(20),
                                                                            marginLeft: -scale(1 * 5)
                                                                        }}>
                                                                        <Image
                                                                            style={{
                                                                                height: "100%",
                                                                                width: "100%",
                                                                                borderRadius: scale(20)
                                                                            }}
                                                                            source={{ uri: item?.profile?.[0]?.url }}
                                                                            contentFit="cover"
                                                                            transition={300}
                                                                        />
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                    <View
                                                        style={{
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            gap: scale(5)
                                                        }}
                                                    >
                                                        <CustomText style={{ color: Colors.modeColor.colorCode }}>See all barbers</CustomText>
                                                        <RightIcon size={scale(14)} color={Colors.modeColor.colorCode} />
                                                    </View>
                                                </View>
                                            </Pressable>
                                        )
                                    }

                                </>
                            )
                        }

                    }
                }}
                keyExtractor={item => item.title}
                ListFooterComponent={< View style={{ height: Platform.OS === "ios" ? verticalScale(60) : 0 }} />}
            />

        </CustomTabView >
    )
}

export default Dashboard

const styles = StyleSheet.create({
    topContainer: {
        // gap: verticalScale(10),
    },
    btn: {
        // width: "45%",
        width: "48%",
        height: verticalScale(35),
        borderRadius: scale(41),
        alignItems: "center",
        justifyContent: "center",
    },
    cardImage: {
        height: scale(80),
        width: scale(80),
        borderRadius: scale(8),
        marginBottom: verticalScale(5)
    },
})