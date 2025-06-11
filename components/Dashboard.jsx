import { FlatList, Platform, Pressable, Image as ReactNativeImage, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomTabView from './CustomTabView'
import CustomText from './CustomText'
import { useAuth } from '../context/AuthContext'
import CustomSecondaryText from './CustomSecondaryText'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../constants/Colors'
import AdvertiseCard from './AdvertiseCard'
import { ClockIcon, CuttingIcon, DyeIcon, MenuIcon, NextIcon, QueueIcon, SettingsIcon, StylingIcon, TrimIcon, UserIcon } from '../constants/icons'
import StatusCard from './StatusCard'
import BarberCard from './BarberCard'
import { Link, router } from 'expo-router'
import { Dimensions } from 'react-native';
import { Image } from 'expo-image'

// const screenWidth = Dimensions.get('window').width;
// console.log('Screen Width:', screenWidth);

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
            image: 'https://w7.pngwing.com/pngs/117/849/png-transparent-hair-salon-sale-banner-poster.png',
            services: ['Haircuts', 'Coloring', 'Styling', 'Bridal Packages', 'Spa Treatments'],
        },
        {
            id: '2',
            title: 'Velvet & Ivy Spa',
            image: 'https://w7.pngwing.com/pngs/117/849/png-transparent-hair-salon-sale-banner-poster.png',
            services: ['Organic Facials', 'Aromatherapy Massages', 'Holistic Beauty Treatments'],
        },
        {
            id: '3',
            title: 'The Luxe Lotus',
            image: 'https://w7.pngwing.com/pngs/117/849/png-transparent-hair-salon-sale-banner-poster.png',
            services: ['Hair Extensions', 'Keratin Treatments', 'Luxury Manicures'],
        },
        {
            id: '4',
            title: 'Blush & Blossom Beauty',
            image: 'https://w7.pngwing.com/pngs/117/849/png-transparent-hair-salon-sale-banner-poster.png',
            services: ['Makeup Artistry', 'Eyelash Extensions', 'Skincare Consultations'],
        },
        {
            id: '5',
            title: 'Opulence Oasis Salon',
            image: 'https://w7.pngwing.com/pngs/117/849/png-transparent-hair-salon-sale-banner-poster.png',
            services: ['Hair Spa Therapies', 'Color Correction', 'Personalized Styling Sessions'],
        },
    ];

    const salonStatus = [
        {
            id: 1,
            title: "System Status",
            icon: SettingsIcon,
            value: "ON",
            color1: "#0BA3AD",
            color2: "rgb(206, 237, 239)"
        },
        {
            id: 2,
            title: "Total Queue",
            icon: QueueIcon,
            value: "40",
            color1: "#006FFD",
            color2: "#CCDEFF"
        },
        {
            id: 3,
            title: "Next In Queue",
            icon: NextIcon,
            value: "4",
            color1: "#EAA824",
            color2: "#FBF1D3"
        },
        {
            id: 4,
            title: "On Duty Staff",
            icon: UserIcon,
            value: "6",
            color1: "#00B090",
            color2: "#CCE6E6"
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
            icon: <CuttingIcon color={Colors.modeColor.colorCode} />,
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
            icon: <TrimIcon color={Colors.modeColor.colorCode} />,
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
            icon: <StylingIcon color={Colors.modeColor.colorCode} />,
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
            icon: <DyeIcon color={Colors.modeColor.colorCode} />,
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
            icon: <MenuIcon color={Colors.modeColor.colorCode} />,
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

    return (
        <CustomTabView>
            <FlatList
                data={pageData}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    gap: verticalScale(0)
                }}
                renderItem={({ item }) => {
                    switch (item.title) {
                        case "hero": {
                            return (
                                <>
                                    <CustomText style={{ fontFamily: "AirbnbCereal_W_Bd", fontSize: scale(16.03), marginBottom: verticalScale(10) }}>👋 Hello, {authenticatedUser?.name}</CustomText>
                                    <View style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        position: "relative"
                                    }}>
                                        <CustomText style={{ width: scale(290.63), fontSize: scale(11.02) }}>Dear Customer, please click the button below to book your appointment easily and at your convenien...</CustomText>
                                        <CustomText style={{
                                            fontSize: scale(11.02),
                                            color: Colors.modeColor.colorCode,
                                            position: "absolute",
                                            bottom: 0,
                                            right: 0
                                        }}>Read more</CustomText>
                                    </View>

                                    <View style={{
                                        flexDirection: "row",
                                        gap: verticalScale(10),
                                        // justifyContent: "space-evenly",
                                        paddingHorizontal: scale(25),
                                        paddingVertical: verticalScale(16)
                                    }}>
                                        <Pressable onPress={() => router.push("/queuelist")} style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode, shadowColor: Colors.modeColor.colorCode, marginBottom: verticalScale(10) }]}>
                                            <CustomText style={{ color: "#fff", fontSize: scale(11.69) }}>Join Queue</CustomText>
                                        </Pressable>
                                        <Pressable onPress={() => router.push("/appointment")}
                                            style={[styles.btn, {
                                                backgroundColor: Colors.modeColor.colorCode2,
                                                shadowColor: Colors.modeColor.colorCode, marginBottom: verticalScale(10),
                                                borderColor: Colors.modeColor.colorCode,
                                                borderWidth: scale(1)
                                            }]}><CustomText
                                                style={{
                                                    color: Colors.modeColor.colorCode,
                                                    fontSize: scale(11.69),
                                                }}>Book Appointment</CustomText></Pressable>
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
                                        flex: 1,
                                        gap: scale(10),
                                        justifyContent: "space-evenly"
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

                        case "serviceCategory": {
                            return (
                                <View>
                                    <CustomText
                                        style={{
                                            lineHeight: verticalScale(50),
                                            fontFamily: "AirbnbCereal_W_Bd"
                                        }}
                                    >Our Services</CustomText>
                                    <View
                                        style={{
                                            height: verticalScale(97),
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between"
                                        }}
                                    >

                                        {
                                            serviceCategories.map((item, index) => {
                                                return (
                                                    <View
                                                        key={index}
                                                        style={{
                                                            gap: verticalScale(7)
                                                        }}
                                                    >
                                                        <View
                                                            style={{
                                                                height: scale(48),
                                                                width: scale(48),
                                                                borderWidth: scale(1),
                                                                borderColor: "rgba(0,0,0,0.4)",
                                                                borderRadius: scale(50),
                                                                justifyContent: "center",
                                                                alignItems: "center"
                                                            }}
                                                        >
                                                            {item.icon}
                                                        </View>
                                                        <CustomText
                                                            style={{
                                                                fontFamily: "AirbnbCereal_W_Bk",
                                                                fontSize: scale(12),
                                                                textAlign: "center"
                                                            }}
                                                        >{item.name}</CustomText>
                                                    </View>
                                                )
                                            })
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
                                        paddingVertical: verticalScale(15)
                                    }}>
                                        <CustomText style={{
                                            fontFamily: "AirbnbCereal_W_Bd",
                                            fontSize: scale(16)
                                        }}>Barbers On Duty <CustomText
                                            style={{
                                                fontFamily: "AirbnbCereal_W_Bd",
                                                fontSize: scale(16),
                                                color: Colors.modeColor.colorCode
                                            }}
                                        >6</CustomText></CustomText>
                                        <CustomText
                                            style={{
                                                color: Colors.modeColor.colorCode,
                                                fontSize: scale(12),
                                                fontFamily: "AirbnbCereal_W_Md",
                                            }}
                                        >See more</CustomText>
                                    </View>
                                    <FlatList
                                        key={3}
                                        style={{
                                            overflow: "visible",
                                        }}
                                        columnWrapperStyle={{
                                            columnGap: scale(8),
                                        }}
                                        data={barbersData}
                                        renderItem={({ item }) => <BarberCard item={item} />}
                                        keyExtractor={item => item.id}
                                        bounces={false}
                                        numColumns={3}
                                    />
                                </>
                            )
                        }

                        case "services": {
                            return (
                                <>
                                    {serviceCategories.map((item, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <View
                                                    style={{
                                                        height: verticalScale(38),
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        gap: scale(10),
                                                    }}
                                                >
                                                    <CustomText
                                                        style={{
                                                            fontFamily: "AirbnbCereal_W_Bd",
                                                            fontSize: scale(12),
                                                        }}
                                                    >
                                                        {item.name}
                                                    </CustomText>
                                                    <View
                                                        style={{
                                                            width: "100%",
                                                            height: verticalScale(1),
                                                            backgroundColor: Colors.modeColor.colorCode,
                                                        }}
                                                    />
                                                </View>

                                                {
                                                    item.services.map((item, index) => {
                                                        return (
                                                            <View
                                                                key={index}
                                                                style={{
                                                                    flexDirection: "row",
                                                                    alignItems: "center",
                                                                    justifyContent: "space-between",
                                                                    marginBottom: verticalScale(10),
                                                                    paddingBottom: verticalScale(10),
                                                                    borderBottomWidth: index === 0 && scale(1),
                                                                    borderBottomColor: index === 0 && "rgba(0,0,0,0.4)"
                                                                }}
                                                            >
                                                                <View style={{
                                                                    gap: verticalScale(10)
                                                                }}>
                                                                    <CustomText
                                                                        style={{
                                                                            fontSize: scale(10)
                                                                        }}
                                                                    >Hair Cut <CustomText
                                                                        style={{
                                                                            fontSize: scale(10),
                                                                            fontFamily: "AirbnbCereal_W_Bd"
                                                                        }}
                                                                    >(VIP)</CustomText></CustomText>
                                                                    <View style={{
                                                                        flexDirection: "row",
                                                                        alignItems: "center",
                                                                        gap: scale(5)
                                                                    }}>
                                                                        <ClockIcon size={scale(10)} />
                                                                        <CustomText style={{
                                                                            fontSize: scale(10)
                                                                        }}>15 mins</CustomText>
                                                                    </View>

                                                                    <CustomText style={{
                                                                        fontSize: scale(14),
                                                                        color: Colors.modeColor.colorCode,
                                                                        fontFamily: "AirbnbCereal_W_Bd"
                                                                    }}>$ 49</CustomText>

                                                                    <CustomText
                                                                        style={{
                                                                            fontSize: scale(10),
                                                                            width: scale(230)
                                                                        }}
                                                                    >Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis, optio quo. Ipsa eius sed nesciunt!</CustomText>
                                                                </View>

                                                                <ReactNativeImage
                                                                    style={styles.cardImage}
                                                                    source={{ uri: item.image }}
                                                                    resizeMode="cover" // replaces contentFit="cover"
                                                                // transition is not supported in react-native Image
                                                                />

                                                            </View>
                                                        )
                                                    })
                                                }


                                            </React.Fragment>
                                        );
                                    })}

                                </>
                            );
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
        width: "45%",
        height: verticalScale(35),
        borderRadius: scale(41),
        alignItems: "center",
        justifyContent: "center",
        width: scale(131.91),
        height: verticalScale(29.22)
    },
    cardImage: {
        height: scale(80),
        width: scale(80),
        borderRadius: scale(8),
        marginBottom: verticalScale(5)
    },
})