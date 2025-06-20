// import { Dimensions, FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native'
// import React, { useCallback, useRef, useState } from 'react'
// import { useFocusEffect, useTheme } from '@react-navigation/native';
// import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
// import { Image } from 'expo-image';
// import CustomText from '../../../components/CustomText'
// import { Colors } from '../../../constants/Colors'
// import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
// import { ArrowDownIcon, ArrowUpIcon, ContactIcon, FacebookIcon, InstagramIcon, MapIcon } from '../../../constants/icons';
// import CustomSecondaryText from '../../../components/CustomSecondaryText';

// const SalonItem = ({ item }) => {

//     const { colors } = useTheme()

//     return (
//         <View style={[styles.cardWrapper, { backgroundColor: colors.background }]} >
//             <Image
//                 style={styles.cardImage}
//                 source={{ uri: item.image }}
//                 contentFit="cover"
//                 transition={300}
//             />
//         </View>
//     )
// };


// const salon = () => {

// const advertisementData = [
//     {
//         id: 1,
//         image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2936&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//     },
//     {
//         id: 2,
//         image: "https://img1.wsimg.com/isteam/ip/ecf2eb3f-f55b-4193-9e98-7c1b626bf779/Hero%20Picture.png"
//     },
//     {
//         id: 3,
//         image: "https://cdn.wellnessta.com/vendors/5ff2c570edfc6c776857fe44/outlet/Hair-And-Care-Men's-Salon-202105121952400.webp"
//     },
//     {
//         id: 4,
//         image: "https://images.pexels.com/photos/705255/pexels-photo-705255.jpeg"
//     },
//     {
//         id: 5,
//         image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2936&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//     },
// ]

// const flatlistRef = useRef()
// const [currentIndex, setCurrentIndex] = useState(0)

// const scrollToIndex = () => {
//     flatlistRef.current.scrollToIndex({ animated: true, index: currentIndex })
// }

// useFocusEffect(
//     useCallback(() => {
//         if (flatlistRef?.current) {
//             scrollToIndex(currentIndex)
//         }
//     }, [currentIndex])
// )

// const darkMapStyle = [
//     {
//         "elementType": "geometry",
//         "stylers": [{ "color": "#1d2c4d" }]
//     },
//     {
//         "elementType": "labels.text.fill",
//         "stylers": [{ "color": "#ffffff" }]
//     },
//     {
//         "elementType": "labels.text.stroke",
//         "stylers": [{ "color": "#1d2c4d" }]
//     },
//     {
//         "featureType": "administrative",
//         "elementType": "geometry",
//         "stylers": [{ "color": "#1d2c4d" }]
//     },
//     {
//         "featureType": "poi",
//         "elementType": "geometry",
//         "stylers": [{ "color": "#283e6b" }]
//     },
//     {
//         "featureType": "poi",
//         "elementType": "labels.text.fill",
//         "stylers": [{ "color": "#ffffff" }]
//     },
//     {
//         "featureType": "road",
//         "elementType": "geometry",
//         "stylers": [{ "color": "#304a7d" }]
//     },
//     {
//         "featureType": "road",
//         "elementType": "labels.text.fill",
//         "stylers": [{ "color": "#98a5be" }]
//     },
//     {
//         "featureType": "transit",
//         "elementType": "geometry",
//         "stylers": [{ "color": "#2f3948" }]
//     },
//     {
//         "featureType": "water",
//         "elementType": "geometry",
//         "stylers": [{ "color": "#0f252e" }]
//     },
//     {
//         "featureType": "water",
//         "elementType": "labels.text.fill",
//         "stylers": [{ "color": "#ffffff" }]
//     }
// ];

//     const colorScheme = useColorScheme();
//     const { colors } = useTheme()

//     const serviceData = [
//         {
//             id: 1,
//             name: "Cutting",
//             iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/Femalehaircut_1706703379391.png"
//         },
//         {
//             id: 2,
//             name: "Trim",
//             iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/hair%20dyes_1706703379402.jpg"
//         },
//         {
//             id: 3,
//             name: "Styling",
//             iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/Malehaircut_1706703379405.png"
//         },
//         {
//             id: 4,
//             name: "Hair Dye",
//             iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703380/icons/massage_1706703379406.jpg"
//         },
//         {
//             id: 5,
//             name: "Grooming",
//             iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703380/icons/natural%20spa_1706703379406.jpg"
//         },

//         {
//             id: 6,
//             name: "Hair Treatment",
//             iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/shave_1706703379407.png"
//         },
//         {
//             id: 7,
//             name: "Beard Shave",
//             iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/spa_1706703379407.jpg"
//         },
//         {
//             id: 8,
//             name: "Cutting",
//             iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/Femalehaircut_1706703379391.png"
//         },
//         {
//             id: 9,
//             name: "Trim",
//             iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/hair%20dyes_1706703379402.jpg"
//         },
//         {
//             id: 10,
//             name: "Styling",
//             iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/Malehaircut_1706703379405.png"
//         },
//     ]

//     const [serviceDrop, setServiceDrop] = useState(false)

//     return (
//         <ScrollView
//             style={{ backgroundColor: "#efefef", flex: 1 }}
//             contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? verticalScale(60) : 0 }}
//             showsVerticalScrollIndicator={false}
//         >
//             <View>
// <FlatList
//     data={advertisementData}
//     style={{
//         position: "relative"
//     }}
//     renderItem={({ item }) => <SalonItem item={item} />}
//     keyExtractor={item => item.id.toString()}
//     ref={flatlistRef}
//     horizontal={true}
//     showsHorizontalScrollIndicator={false}
//     // snapToAlignment="start"
//     decelerationRate="fast"
//     snapToInterval={scale(400)}
//     pagingEnabled={true}
//     onMomentumScrollEnd={(event) => {
//         const offsetX = event.nativeEvent.contentOffset.x;
//         const index = Math.round(offsetX / scale(400));
//         setCurrentIndex(index);
//     }}
//     initialNumToRender={3}
//     maxToRenderPerBatch={3}
// />
//                 <View
//                     style={{
//                         position: "absolute",
//                         bottom: verticalScale(10),
//                         right: scale(20),
//                         flexDirection: "row",
//                         gap: scale(8),
//                         alignItems: "center"
//                     }}
//                 >
//                     {
//                         advertisementData.map((item, index) => {
//                             return (
//                                 <Pressable
//                                     onPress={() => setCurrentIndex(index)}
//                                     key={index}
//                                     style={{
//                                         width: index === currentIndex ? scale(25) : scale(10),
//                                         height: scale(10),
//                                         borderRadius: scale(30),
//                                         backgroundColor: index === currentIndex ? Colors.modeColor.colorCode : "#fff"
//                                     }}
//                                 ></Pressable>
//                             )
//                         })
//                     }

//                 </View>
//             </View>

//             <View
//                 style={{
//                     flex: 1,
//                     paddingVertical: verticalScale(20),
//                     paddingHorizontal: scale(10)
//                 }}
//             >
{/* <MapView
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
                        30 Elliot Rd, Selly Oak, Birmingham, UK, B29 4AQ
                    </CustomText>
                    <View style={styles.iconContainer}>
                        <Pressable style={[styles.iconButton, { backgroundColor: colorScheme === "dark" ? "#0f0f0f" : "#f0f0f0" }]}>
                            <ContactIcon color={colors.text} />
                        </Pressable>
                        <Pressable style={[styles.iconButton, { backgroundColor: colorScheme === "dark" ? "#151718" : "#f0f0f0" }]}>
                            <MapIcon color={colors.text} />
                        </Pressable>
                    </View>
                </View> */}

//                 <View
//                     style={{
//                         flexDirection: "row",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         height: verticalScale(42),
//                         paddingHorizontal: scale(20),
//                         borderBottomColor: "rgba(128, 117, 117, 0.6)",
//                         borderBottomWidth: scale(1)
//                     }}
//                 >
//                     <CustomText
//                         style={{
//                             fontFamily: "AirbnbCereal_W_Bk"
//                         }}
//                     >Service</CustomText>
//                     <Pressable
//                         onPress={() => setServiceDrop((prev) => !prev)}
//                     >{serviceDrop ? (<ArrowDownIcon size={scale(14)} />) : (<ArrowUpIcon size={scale(14)} />)}</Pressable>
//                 </View>

//                 {serviceDrop && (
//                     <ScrollView contentContainerStyle={{ flexDirection: 'row', gap: scale(8), flexWrap: 'wrap' }}>
//                         {serviceData.map((item, index) => (
//                             <View
//                                 style={{
//                                     width: '18%',
//                                     alignItems: 'center',
//                                     marginVertical: scale(8),
//                                 }}
//                                 key={index}
//                             >
//                                 <Image
//                                     style={{
//                                         width: "100%",
//                                         height: scale(64),
//                                         borderRadius: scale(8),
//                                         borderWidth: scale(1),
//                                         borderColor: '#E8E8E8',
//                                         backgroundColor: "#fff"
//                                     }}
//                                     source={{
//                                         uri: item.iconImage
//                                     }}
//                                     contentFit="cover"
//                                     transition={300}
//                                 />
//                                 <CustomText
//                                     style={{
//                                         fontFamily: 'AirbnbCereal_W_Bk',
//                                         fontSize: scale(11),
//                                         textAlign: 'center',
//                                         marginTop: scale(4),
//                                     }}
//                                 >
//                                     {item.name}
//                                 </CustomText>
//                             </View>
//                         ))}
//                     </ScrollView>
//                 )}


//                 <CustomText
//                     style={{
//                         fontFamily: "AirbnbCereal_W_Bd",
//                         fontSize: scale(16),
//                         marginVertical: verticalScale(12),
//                     }}
//                 >
//                     Follow us on
//                 </CustomText>

//                 <View
//                     style={[
//                         styles.linkContainer,
//                         {
//                             backgroundColor: colors.background,
//                             borderRadius: scale(4),
//                             padding: scale(14),
//                             gap: verticalScale(10),
//                         },
//                     ]}
//                 >
//                     <View>
//                         <CustomSecondaryText style={{ marginBottom: verticalScale(4), fontSize: scale(13) }}>
//                             📧 Email:
//                         </CustomSecondaryText>
//                         <CustomText style={{ fontSize: scale(14), fontFamily: "AirbnbCereal_W_Md" }}>
//                             iqueuebook@hotmail.com
//                         </CustomText>
//                     </View>

//                     <View>
//                         <CustomSecondaryText style={{ marginBottom: verticalScale(4), fontSize: scale(13) }}>
//                             🔗 Social Links:
//                         </CustomSecondaryText>
//                         <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
//                             <FacebookIcon color='#1877F2' />
//                             <InstagramIcon color="#E1306C" />
//                         </View>
//                     </View>
//                 </View>

//             </View>
//         </ScrollView>
//     )
// }

// export default salon

// const styles = StyleSheet.create({
// cardWrapper: {
//     height: verticalScale(280),
//     width: scale(400),
// },
// cardImage: {
//     height: "100%",
//     width: "100%",
// },


// map: {
//     width: "100%",
//     height: verticalScale(128),
// },

//     addressContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between", // Ensure spacing between text and icons
//         padding: scale(10),
//         borderRadius: scale(4),
//         marginTop: verticalScale(10),
//         // shadowColor: "#000",
//         // shadowOffset: { width: 0, height: 1 },
//         // shadowOpacity: 0.1,
//         // shadowRadius: scale(4),
//         // elevation: 2,
//     },
//     addressText: {
//         flex: 1,
//         fontSize: scale(14),
//         fontFamily: "AirbnbCereal_W_Bk"
//     },
//     iconContainer: {
//         flexDirection: "row",
//         gap: scale(10),
//     },
//     iconButton: {
//         width: scale(30),
//         height: scale(30),
//         justifyContent: "center",
//         alignItems: "center",
//         borderRadius: scale(4)
//     },
//     linkContainer: {
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 2,
//     }
// })


import { FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useFocusEffect } from 'expo-router';
import { Image } from 'expo-image';
import { useTheme } from '@react-navigation/native';
import { Colors } from '../../../constants/Colors';
import CustomText from '../../../components/CustomText';
import { ArrowLeftIcon, CheckIcon, ClockIcon, ContactIcon, EmailIcon, FacebookIcon, HeartFilledIcon, HeartIcon, InstagramIcon, MapIcon, WhatsappIcon } from '../../../constants/icons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import BarberCard from '../../../components/BarberCard';
import CustomTabView from '../../../components/CustomTabView';


const SalonItem = ({ item }) => {

    const { colors } = useTheme()

    return (
        <View style={[styles.cardWrapper, { backgroundColor: colors.background }]} >
            <Image
                style={styles.cardImage}
                source={{ uri: item.image }}
                contentFit="cover"
                transition={300}
            />
        </View>
    )
};


const salon = () => {

    const flatlistRef = useRef()
    const [currentIndex, setCurrentIndex] = useState(0)

    const scrollToIndex = () => {
        flatlistRef.current.scrollToIndex({ animated: true, index: currentIndex })
    }

    useFocusEffect(
        useCallback(() => {
            if (flatlistRef?.current) {
                scrollToIndex(currentIndex)
            }
        }, [currentIndex])
    )

    // // ref
    // const bottomSheetRef = useRef(null);

    // // callbacks
    // const handleSheetChanges = useCallback((index) => {
    //     console.log('handleSheetChanges', index);
    // }, []);

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


    const advertisementData = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2936&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 2,
            image: "https://img1.wsimg.com/isteam/ip/ecf2eb3f-f55b-4193-9e98-7c1b626bf779/Hero%20Picture.png"
        },
        {
            id: 3,
            image: "https://cdn.wellnessta.com/vendors/5ff2c570edfc6c776857fe44/outlet/Hair-And-Care-Men's-Salon-202105121952400.webp"
        },
        {
            id: 4,
            image: "https://images.pexels.com/photos/705255/pexels-photo-705255.jpeg"
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2936&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
    ]

    const [tabData, setTabData] = useState([
        "Details",
        "Services",
        "Barber"
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

    const [serviceCategorySelected, setServiceCategorySelected] = useState(false)

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
                <View>
                    <FlatList
                        data={advertisementData}
                        style={{
                            position: "relative"
                        }}
                        renderItem={({ item }) => <SalonItem item={item} />}
                        keyExtractor={item => item.id.toString()}
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
                            advertisementData.map((item, index) => {
                                return (
                                    <Pressable
                                        onPress={() => setCurrentIndex(index)}
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
                <BottomSheet
                    ref={sheetRef}
                    index={0}
                    snapPoints={Platform.OS === "ios" ? ["72%", "90%"] : ["68%", "87%"]}
                    enableDynamicSizing={false}
                    backgroundStyle={{
                        backgroundColor: colors.background,
                        borderTopLeftRadius: scale(20),
                        borderTopRightRadius: scale(20),
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
                        <CustomText>Add to Favorites</CustomText>
                        <Pressable
                            style={{
                                width: scale(30),
                                height: scale(30),
                                backgroundColor: "#E11D481A",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: scale(4)
                            }}
                        >
                            <HeartFilledIcon size={scale(16)} color='#E11D48' />
                        </Pressable>
                    </View>

                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: scale(10),
                        padding: scale(10),
                        justifyContent: "space-between"
                    }}>

                        {
                            tabData.map((item, index) => {
                                return (
                                    <Pressable
                                        key={index}
                                        style={[styles.tabBtn, {
                                            backgroundColor: selectedTab === item ? Colors.modeColor.colorCode : "#00B0901A"
                                        }]}
                                        onPress={() => {
                                            setSelectedTab(item)
                                        }}
                                    ><CustomText style={{
                                        fontSize: scale(12),
                                        color: selectedTab === item ? "#fff" : Colors.modeColor.colorCode
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
                                            backgroundColor: "#00B0901A",
                                            borderRadius: scale(4),
                                            padding: scale(10),
                                            gap: verticalScale(5)
                                        }}
                                    >
                                        <CustomText
                                            style={{
                                                fontFamily: "AirbnbCereal_W_Bd",
                                            }}
                                        >Description</CustomText>

                                        <CustomText
                                            style={{
                                                fontSize: scale(14),
                                                color: "gray"
                                            }}
                                        >At our salon, we believe that beauty is personal and every client deserves a tailored experience. From classic cuts to modern styling, our skilled professionals are here to provide high-quality hair, skin, and grooming services in a clean, relaxing environment.</CustomText>
                                    </View>

                                    <View
                                        style={{
                                            backgroundColor: "#00B0901A",
                                            borderRadius: scale(4),
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

                                            <CustomText
                                                style={{
                                                    fontSize: scale(14),
                                                    color: "gray"
                                                }}
                                            >
                                                If you have any questions
                                            </CustomText>
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
                                            >
                                                <EmailIcon size={scale(18)} color={"#EA4335"} />
                                            </Pressable>

                                        </View>

                                    </View>

                                    <View>
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
                                            style={[styles.map, 
                                                { 
                                                    // borderColor: "#efefef", 
                                                    // borderWidth: scale(1) 
                                                }
                                            ]}
                                            customMapStyle={colorScheme === "dark" ? darkMapStyle : []}
                                        />
                                        <View
                                            style={{
                                                backgroundColor: "#0BA3AD1A",
                                                borderBottomLeftRadius: scale(4),
                                                borderBottomRightRadius: scale(4),
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

                                                <CustomText
                                                    style={{
                                                        fontSize: scale(14),
                                                        color: "gray",
                                                        maxWidth: "85%"
                                                    }}
                                                >
                                                    30 Elliot Rd, Selly Oak, Birmingham, UK, B29 4AQ
                                                </CustomText>
                                            </View>

                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: scale(10),
                                                    flex: 1
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
                                                >
                                                    <MapIcon size={scale(18)} color={"#fbbf24"} />
                                                </Pressable>

                                            </View>

                                        </View>
                                    </View>


                                    <View
                                        style={{
                                            backgroundColor: "#00B0901A",
                                            borderRadius: scale(4),
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

                                            <CustomText
                                                style={{
                                                    fontSize: scale(14),
                                                    color: "gray"
                                                }}
                                            >
                                                Social links
                                            </CustomText>
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
                                            >
                                                <FacebookIcon size={scale(18)} color={"#1877F2"} />
                                            </Pressable>
                                        </View>

                                    </View>
                                </>
                            )
                        }

                        {
                            selectedTab === "Services" && (
                                serviceCategorySelected ? (
                                    <>
                                        <Pressable
                                            onPress={() => {
                                                setServiceCategorySelected(false)
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
                                            >Hair Cutting</CustomText>
                                        </Pressable>

                                        {
                                            [0, 1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
                                                return (

                                                    <Pressable
                                                        key={index}
                                                        style={{
                                                            // height: verticalScale(195),
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
                                                                    index % 2 === 1 ? (
                                                                        <Image
                                                                            style={{ height: scale(50), width: scale(50), borderRadius: scale(80) }}
                                                                            source={{ uri: "https://www.knksalon.in/assets-admin/upload/category_service/6595410e1a466.webp" }}
                                                                            // placeholder={{ blurhash }}
                                                                            contentFit="cover"
                                                                            transition={300}
                                                                        />
                                                                    ) : (
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
                                                                                source={{ uri: "https://www.knksalon.in/assets-admin/upload/category_service/6595410e1a466.webp" }}
                                                                                // placeholder={{ blurhash }}
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
                                                                    )
                                                                }

                                                                <View style={{ gap: verticalScale(5) }}>
                                                                    <CustomText style={{
                                                                        fontSize: scale(12),
                                                                        fontFamily: "AirbnbCereal_W_Bd"
                                                                    }}>Haircuts & Styling</CustomText>
                                                                    <Pressable
                                                                        style={{
                                                                            height: verticalScale(15),
                                                                            width: scale(50),
                                                                            backgroundColor: "#00B0901A",
                                                                            borderRadius: scale(4),
                                                                            justifyContent: "center",
                                                                            alignItems: "center"
                                                                        }}
                                                                    ><CustomText style={{ fontSize: scale(10), color: "#00B090" }}>Haircut</CustomText></Pressable>
                                                                </View>
                                                            </View>

                                                            {
                                                                index % 2 === 1 ? (
                                                                    <Pressable
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
                                                                ) : (<Pressable
                                                                    style={{
                                                                        height: verticalScale(20),
                                                                        width: scale(60),
                                                                        backgroundColor: "#E11D48",
                                                                        borderRadius: scale(4),
                                                                        justifyContent: "center",
                                                                        alignItems: "center"
                                                                    }}
                                                                ><CustomText style={{ fontSize: scale(12), color: "#fff" }}>Remove</CustomText>
                                                                </Pressable>)
                                                            }
                                                        </View>

                                                        <View style={{ marginTop: verticalScale(5), gap: verticalScale(5) }}>
                                                            <CustomText
                                                                style={{
                                                                    color: "gray",
                                                                    fontSize: scale(12)
                                                                }}
                                                            >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi in odit tenetur, exercitationem qui similique?</CustomText>

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
                                                                    justifyContent: "space-between",
                                                                    width: scale(75),
                                                                    gap: scale(2),
                                                                    backgroundColor: colors.background,
                                                                    paddingHorizontal: scale(5),
                                                                    borderRadius: scale(4)
                                                                }}>
                                                                    <ClockIcon size={scale(12)} color={Colors.modeColor.colorCode} />
                                                                    <CustomText style={{ fontSize: scale(12), flex: 1, color: Colors.modeColor.colorCode }}>120 mins</CustomText>
                                                                </View>

                                                                <CustomText
                                                                    style={{
                                                                        fontFamily: "AirbnbCereal_W_Blk",
                                                                        fontSize: scale(18),
                                                                        color: Colors.modeColor.colorCode
                                                                    }}
                                                                >$49.00</CustomText>
                                                            </View>
                                                        </View>
                                                    </Pressable >
                                                )
                                            })
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
                                            serviceCategories.map((item, index) => {
                                                return (
                                                    <View
                                                        key={index}
                                                        style={{
                                                            gap: verticalScale(10),
                                                            width: scale(65),
                                                            marginBottom: verticalScale(10)
                                                            // paddingLeft: scale(5)
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
                                                                setServiceCategorySelected(true)
                                                            }}
                                                        >
                                                            <Image
                                                                style={{ width: "100%", height: "100%", borderRadius: scale(30) }}
                                                                source={item.image}
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
                                                        >{item.name}</CustomText>
                                                    </View>
                                                )
                                            })
                                        }

                                    </View>
                                </>

                            )
                        }

                        {
                            selectedTab === "Barber" && (
                                <>
                                    <CustomText
                                        style={{
                                            fontFamily: "AirbnbCereal_W_Blk"
                                        }}
                                    >Explore all stylists</CustomText>

                                    <View
                                        style={{
                                            // flexDirection: "row",
                                            // alignItems: "center",
                                            // flexDirection: "row",
                                            // flexWrap: "wrap",
                                            // // paddingVertical: verticalScale(10),
                                            // gap: scale(20),
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            gap: scale(10)
                                        }}
                                    >

                                        {
                                            barbersData.map((item, index) => {
                                                return (<BarberCard key={index} item={item} />)
                                            })
                                        }

                                    </View>
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
        paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(10),
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
        borderRadius: scale(4),
        justifyContent: "center",
        alignItems: "center"
    },

    map: {
        width: "100%",
        height: verticalScale(128),
        borderTopLeftRadius: scale(4),
        borderTopRightRadius: scale(4)
    },
})