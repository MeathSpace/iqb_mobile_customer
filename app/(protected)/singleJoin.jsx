// import {
//     Pressable,
//     ScrollView,
//     StyleSheet,
//     View,
//     KeyboardAvoidingView,
//     Platform,
//     TextInput,
//     Animated,
// } from 'react-native'
// import React, { useEffect, useRef, useState } from 'react'
// import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
// import CustomText from '../../components/CustomText'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { Colors } from '../../constants/Colors'
// import CustomSecondaryText from '../../components/CustomSecondaryText'
// import { AddIcon, ArrowLeftIcon, CheckIcon, ClockIcon } from '../../constants/icons'
// import { Image } from 'expo-image'
// import { useRouter } from 'expo-router'
// import { useTheme } from '@react-navigation/native'
// import axios from 'axios';
// import { BASE_URL } from '@/utils/api';
// import { useAuth } from '../../context/AuthContext'
// import Skeleton from '../../components/Skeleton'
// import joinConfirmation from './joinConfirmation'
// import { Toast } from 'toastify-react-native'

// const SingleJoin = () => {

//     const { authenticatedUser } = useAuth()

//     const [salonServices, setSalonServices] = useState({
//         data: null,
//         loading: false,
//         error: null,
//         success: false
//     })

//     const [salonBarber, setSalonBarber] = useState({
//         data: null,
//         loading: false,
//         error: null,
//         success: false
//     })


//     useEffect(() => {
//         const fetchSalonServices = async () => {
//             try {

//                 setSalonServices((prev) => ({ ...prev, loading: true }))

//                 const { data } = await axios.get(`${BASE_URL}/mobileRoutes/getAllSalonServices`, {
//                     params: {
//                         salonId: authenticatedUser?.salonId
//                     }
//                 })

//                 setSalonServices((prev) => ({
//                     ...prev, loading: false, data: data?.response?.map((item) => {
//                         return (
//                             { ...item, selected: false }
//                         )
//                     }), success: true, error: null
//                 }))

//             } catch (error) {

//                 setSalonServices((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
//                 console.log("Error fetching salon Info ", error)
//             }
//         }

//         fetchSalonServices()
//     }, [authenticatedUser])


//     const [selectCustomerServices, setSelectedCustomerServices] = useState([])
//     const [selectedCustomerBarber, setSelectedCustomerBarber] = useState(null)
//     const [continueService, setContinueService] = useState(false)


//     useEffect(() => {
//         if (selectCustomerServices.length > 0 && continueService) {

//             const fetchBarbersByMultipleServiceId = async () => {
//                 try {

//                     setSalonBarber((prev) => ({ ...prev, loading: true }))

//                     const { data } = await axios.post(`${BASE_URL}/mobileRoutes/getBarberByMultipleServiceId`, {
//                         salonId: authenticatedUser.salonId,
//                         serviceIds: selectCustomerServices.map((item) => item.serviceId)
//                     })

//                     setSalonBarber((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))

//                 } catch (error) {

//                     setSalonBarber((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
//                     console.log("Error fetching barbers by multiple service Id", error)
//                 }
//             }

//             fetchBarbersByMultipleServiceId()
//         }

//     }, [authenticatedUser, selectCustomerServices, continueService])

//     const addServiceHandler = (service) => {
//         setContinueService(false)
//         const updatedSalonServices = salonServices?.data?.map((item) => {
//             return item?.serviceId === service?.serviceId ? { ...service, selected: true } : item
//         })

//         setSalonServices({
//             data: updatedSalonServices,
//             loading: false,
//             error: null,
//             success: false
//         })

//         setSelectedCustomerServices([...selectCustomerServices, service])
//     }

//     const removeServiceHandler = (service) => {
//         setContinueService(false)
//         const updatedSalonServices = salonServices?.data?.map((item) => {
//             return item?.serviceId === service?.serviceId ? { ...service, selected: false } : item
//         })

//         setSalonServices({
//             data: updatedSalonServices,
//             loading: false,
//             error: null,
//             success: false
//         })

//         setSelectedCustomerServices((prev) => {

//             const filteredArray = prev.filter((item) => {
//                 return item?.serviceId !== service?.serviceId
//             })

//             return filteredArray
//         })
//     }

//     // console.log("selectCustomerServices ", selectCustomerServices)
//     // console.log("selectedCustomerBarber ", selectedCustomerBarber)

//     const [activeSection, setActiveSection] = useState('services')
//     const [scrolling, setScrolling] = useState(false)
//     const [addIconPressCount, setAddIconPressCount] = useState(0);

//     const handleScrollStart = (section) => {
//         setActiveSection(section)
//         setScrolling(true)
//         setAddIconPressCount(1)
//     }

//     const paddingAnim = useRef(new Animated.Value(scale(15))).current;
//     const flexAnim = useRef(new Animated.Value(0)).current;

//     useEffect(() => {
//         Animated.timing(paddingAnim, {
//             toValue: scrolling ? scale(0) : scale(15),
//             duration: 300,
//             useNativeDriver: false, // Padding cannot use native driver
//         }).start();

//         Animated.timing(flexAnim, {
//             toValue: scrolling ? 1 : 0,
//             duration: scrolling ? 300 : 0,
//             useNativeDriver: false, // layout props like flex can't use native driver
//         }).start();
//     }, [scrolling]);



//     const router = useRouter()
//     const { colors } = useTheme()

//     const joinConfirmation = () => {

//         if (selectCustomerServices.length === 0) {
//             Toast.error("Please select a service")
//             return
//         } else if (!selectedCustomerBarber) {
//             Toast.error("Please select a barber")
//             return
//         }

//         router.push({
//             pathname: "/joinConfirmation",
//             params: {
//                 selectCustomerServices: JSON.stringify(selectCustomerServices),
//                 selectedCustomerBarber: JSON.stringify(selectedCustomerBarber),
//                 singleJoin: true
//             },
//         });
//     }

//     const renderSection = (key, title, content) => {
//         const isActive = activeSection === key

//         if (scrolling && !isActive) return null

//         function formatMinutesToHrMin(totalMinutes) {
//             const hours = Math.floor(totalMinutes / 60);
//             const mins = totalMinutes % 60;

//             if (hours > 0 && mins > 0) return `${hours}hr ${mins}min`;
//             if (hours > 0) return `${hours}hr`;
//             return `${mins}min`;
//         }

//         return isActive ? (
//             <Animated.View style={[styles.boxOpenWrapper, {
//                 flex: flexAnim,
//                 backgroundColor: colors.background
//             }]}>
//                 <ScrollView
//                     style={{ flex: 1 }}
//                     contentContainerStyle={{
//                         gap: verticalScale(15),
//                         paddingBottom: scale(30),
//                     }}
//                     onTouchStart={() => handleScrollStart(key)}
//                     showsVerticalScrollIndicator={false}
//                 >
//                     <View style={{
//                         flexDirection: "row",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                     }}>
//                         <Pressable
//                             onPress={() => {
//                                 setScrolling(false)
//                                 setActiveSection("")
//                                 setAddIconPressCount(0)
//                                 setContinueService(false)
//                             }}
//                             style={{
//                                 flexDirection: "row",
//                                 alignItems: "center",
//                                 gap: scale(5)
//                             }}>
//                             <ArrowLeftIcon color={colors.text} />
//                             <CustomText style={{ fontSize: scale(16), fontFamily: "AirbnbCereal_W_Blk" }}>{title}</CustomText>
//                         </Pressable>

//                     </View>
//                     {
//                         activeSection === "services" && (
//                             salonServices?.loading ? (
//                                 [0, 1, 2, 3, 4, 5].map((_, index) => {
//                                     return (
//                                         <Skeleton
//                                             key={index}
//                                             height={verticalScale(150)}
//                                             borderRadius={scale(10)}
//                                         />
//                                     )
//                                 })
//                             ) : (
//                                 salonServices?.data?.map((item, index) => {
//                                     return (
//                                         <Pressable
//                                             key={item?.serviceId}
//                                             style={{
//                                                 borderRadius: scale(10),
//                                                 backgroundColor: "#00B0901A",
//                                                 padding: scale(12),
//                                                 gap: verticalScale(10)
//                                             }}
//                                         >
//                                             <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//                                                 <View
//                                                     style={{
//                                                         flexDirection: "row",
//                                                         alignItems: "center",
//                                                         gap: scale(10)
//                                                     }}
//                                                 >

//                                                     {
//                                                         item?.selected ? (
//                                                             <View
//                                                                 style={{
//                                                                     height: scale(50),
//                                                                     width: scale(50),
//                                                                     borderRadius: scale(80),
//                                                                     backgroundColor: "rgba(0,0,0,0.4)",
//                                                                     position: "relative"
//                                                                 }}
//                                                             >
//                                                                 <Image
//                                                                     style={{ height: scale(50), width: scale(50), borderRadius: scale(80), zIndex: -1 }}
//                                                                     source={{ uri: item?.serviceIcon?.url }}
//                                                                     // placeholder={{ blurhash }}
//                                                                     contentFit="cover"
//                                                                     transition={300}
//                                                                 />
//                                                                 <CheckIcon
//                                                                     color='#fff'
//                                                                     style={{
//                                                                         position: "absolute",
//                                                                         top: scale(14),
//                                                                         left: scale(14)
//                                                                     }}
//                                                                 />
//                                                             </View>
//                                                         ) : (
//                                                             <Image
//                                                                 style={{ height: scale(50), width: scale(50), borderRadius: scale(80) }}
//                                                                 source={{ uri: item?.serviceIcon?.url }}
//                                                                 // placeholder={{ blurhash }}
//                                                                 contentFit="cover"
//                                                                 transition={300}
//                                                             />
//                                                         )
//                                                     }

//                                                     <View style={{ gap: verticalScale(5) }}>
//                                                         <CustomText style={{
//                                                             fontSize: scale(12),
//                                                             fontFamily: "AirbnbCereal_W_Bd"
//                                                         }}>{item?.serviceName}</CustomText>
//                                                         <Pressable
//                                                             style={{
//                                                                 height: verticalScale(15),
//                                                                 width: scale(50),
//                                                                 backgroundColor: "#00B0901A",
//                                                                 borderRadius: scale(4),
//                                                                 justifyContent: "center",
//                                                                 alignItems: "center"
//                                                             }}
//                                                         ><CustomText style={{ fontSize: scale(10), color: "#00B090" }}>{item?.serviceCategoryName}</CustomText></Pressable>
//                                                     </View>
//                                                 </View>

//                                                 {
//                                                     item?.selected ? (
//                                                         <Pressable
//                                                             onPress={() => removeServiceHandler(item)}
//                                                             style={{
//                                                                 height: verticalScale(20),
//                                                                 width: scale(60),
//                                                                 backgroundColor: "#E11D48",
//                                                                 borderRadius: scale(4),
//                                                                 justifyContent: "center",
//                                                                 alignItems: "center"
//                                                             }}
//                                                         ><CustomText style={{ fontSize: scale(12), color: "#fff" }}>Remove</CustomText>
//                                                         </Pressable>
//                                                     ) : (
//                                                         <Pressable
//                                                             onPress={() => addServiceHandler(item)}
//                                                             style={{
//                                                                 height: verticalScale(20),
//                                                                 width: scale(55),
//                                                                 backgroundColor: "#1f2937",
//                                                                 borderRadius: scale(4),
//                                                                 justifyContent: "center",
//                                                                 alignItems: "center"
//                                                             }}
//                                                         ><CustomText style={{ fontSize: scale(12), color: "#fff" }}>Add</CustomText>
//                                                         </Pressable>
//                                                     )
//                                                 }
//                                             </View>

//                                             <View style={{ marginTop: verticalScale(5), gap: verticalScale(5) }}>
//                                                 <CustomText
//                                                     style={{
//                                                         color: "gray",
//                                                         fontSize: scale(12)
//                                                     }}
//                                                 >{item?.serviceDesc}</CustomText>

//                                                 <View
//                                                     style={{
//                                                         flexDirection: "row",
//                                                         alignItems: "center",
//                                                         justifyContent: "space-between"
//                                                     }}
//                                                 >
//                                                     <View
//                                                         style={{
//                                                             flexDirection: "row",
//                                                             alignItems: "center",
//                                                             gap: scale(2),
//                                                             backgroundColor: colors.background,
//                                                             paddingHorizontal: scale(5),
//                                                             borderRadius: scale(4),
//                                                         }}
//                                                     >
//                                                         <ClockIcon size={scale(12)} color={Colors.modeColor.colorCode} />
//                                                         <CustomText style={{ fontSize: scale(12), color: Colors.modeColor.colorCode }}>{formatMinutesToHrMin(item?.serviceEWT)}</CustomText>
//                                                     </View>

//                                                     {/* Currency should also be added in authenticated user response */}
//                                                     {/* Service Price doesnot have point value */}

//                                                     <CustomText
//                                                         style={{
//                                                             fontFamily: "AirbnbCereal_W_Blk",
//                                                             fontSize: scale(18),
//                                                             color: Colors.modeColor.colorCode
//                                                         }}
//                                                     >{authenticatedUser?.currency} {item?.servicePrice}</CustomText>
//                                                 </View>
//                                             </View>
//                                         </Pressable >
//                                     )
//                                 })
//                             )

//                         )
//                     }

//                     {
//                         activeSection === "barber" && (
//                             salonBarber?.loading ? (
//                                 [0, 1, 2, 3, 4, 5].map((_, index) => {
//                                     return (
//                                         <Skeleton
//                                             key={index}
//                                             height={verticalScale(60)}
//                                             borderRadius={scale(10)}
//                                         />
//                                     )
//                                 })
//                             ) : salonBarber?.data?.length > 0 ? (
//                                 salonBarber?.data?.map((item, index) => {
//                                     return (
//                                         <Pressable
//                                             key={item?.barberId}
//                                             style={{
//                                                 flexDirection: "row",
//                                                 alignItems: "center",
//                                                 justifyContent: "space-between",
//                                                 backgroundColor: "#00B0901A",
//                                                 borderRadius: scale(10),
//                                                 padding: scale(10)
//                                             }}
//                                             onPress={() => {
//                                                 setSelectedCustomerBarber(item)
//                                                 setScrolling(false)
//                                                 setActiveSection("")
//                                                 setAddIconPressCount(0)
//                                             }}
//                                         >
//                                             <View
//                                                 style={{
//                                                     flexDirection: "row",
//                                                     alignItems: "center",
//                                                     gap: scale(10)
//                                                 }}
//                                             >
//                                                 <Image
//                                                     style={{ height: scale(50), width: scale(50), borderRadius: scale(40) }}
//                                                     source={{ uri: item?.profile?.[0]?.url }}
//                                                     contentFit="cover"
//                                                     transition={300}
//                                                 />

//                                                 <View>
//                                                     <CustomText style={{
//                                                         fontSize: scale(14)
//                                                     }}>{item?.name}</CustomText>
//                                                     <View style={{
//                                                         flexDirection: "row",
//                                                         alignItems: "center",
//                                                         justifyContent: "space-between",
//                                                         gap: scale(2),
//                                                     }}>
//                                                         <ClockIcon size={scale(12)} color='gray' />
//                                                         <CustomText style={{ fontSize: scale(12), color: "gray" }}>{formatMinutesToHrMin(item?.barberEWT)}</CustomText>
//                                                     </View>
//                                                 </View>
//                                             </View>

//                                             <View
//                                                 style={{

//                                                 }}
//                                             >
//                                                 <CustomText style={{ fontSize: scale(16), fontFamily: "AirbnbCereal_W_Blk", textAlign: "center" }}>{item?.queueCount}</CustomText>
//                                                 <CustomText style={{ fontSize: scale(14), color: "gray" }}>In Queue</CustomText>
//                                             </View>
//                                         </Pressable>
//                                     )
//                                 })
//                             ) : (
//                                 <View
//                                     style={{
//                                         paddingTop: verticalScale(20)
//                                     }}
//                                 >
//                                     <CustomText>No barbers available</CustomText>
//                                 </View>
//                             )

//                         )
//                     }

//                 </ScrollView>

//                 {
//                     scrolling && activeSection === "services" && selectCustomerServices.length > 0 && (
//                         <View style={{
//                             // height: verticalScale(50),
//                             width: "100%",
//                             borderTopColor: "#D2D2D2",
//                             borderTopWidth: scale(0.5),
//                             flexDirection: "row",
//                             alignItems: "center",
//                             justifyContent: "space-between",
//                             paddingVertical: verticalScale(10),
//                             marginBottom: -verticalScale(15),
//                             // position: "absolute",
//                         }}>
//                             <View>
//                                 <CustomText
//                                     style={{
//                                         fontSize: scale(18),
//                                         fontFamily: "AirbnbCereal_W_Blk"
//                                     }}
//                                 >$ {selectCustomerServices.reduce((acc, item) => acc + item.servicePrice, 0)}</CustomText>
//                                 <CustomText
//                                     style={{
//                                         fontSize: scale(12),
//                                         color: "gray"
//                                     }}
//                                 >{selectCustomerServices.length} services | {formatMinutesToHrMin(selectCustomerServices.reduce((acc, item) => acc + item.serviceEWT, 0))}</CustomText>
//                             </View>

//                             <Pressable
//                                 onPress={() => {
//                                     setContinueService(true)
//                                     setScrolling(false)
//                                     setActiveSection("barber")
//                                     setAddIconPressCount(0)
//                                 }}
//                                 style={{
//                                     height: verticalScale(40),
//                                     width: scale(100),
//                                     backgroundColor: Colors.modeColor.colorCode,
//                                     borderRadius: scale(6),
//                                     justifyContent: "center",
//                                     alignItems: "center"
//                                 }}
//                             >
//                                 <CustomText style={{
//                                     color: "#fff", fontSize: scale(16)
//                                 }}>Continue</CustomText>
//                             </Pressable>
//                         </View>
//                     )
//                 }
//             </Animated.View>
//         ) : (
//             <Pressable
//                 style={[styles.boxCloseWrapper, {
//                     backgroundColor: colors.background,
//                 }]}
//                 onPress={() => setActiveSection(key)}
//             >
//                 <CustomText>{title}</CustomText>
//             </Pressable>
//         )
//     }

//     return (
//         <Animated.View
//             style={[
//                 styles.container,
//                 {
//                     paddingHorizontal: paddingAnim,
//                 }
//             ]}
//         >
//             <SafeAreaView style={{ flex: 1 }}>
//                 <KeyboardAvoidingView
//                     style={{ flex: 1 }}
//                     behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//                 >
//                     <View style={{ flex: 1, gap: verticalScale(15) }}>
//                         {renderSection(
//                             'services',
//                             'Choose Services ?',
//                             [
//                                 { id: 1 },
//                                 { id: 2 },
//                                 { id: 3 },
//                                 { id: 4 },
//                                 { id: 5 },
//                                 { id: 6 },
//                                 { id: 7 },
//                                 { id: 8 },
//                                 { id: 9 },
//                             ]

//                         )}
//                         {renderSection(
//                             'barber',
//                             'Choose Barber ?',
//                             [
//                                 { id: 1 },
//                                 { id: 2 },
//                                 { id: 3 },
//                                 { id: 4 },
//                                 { id: 5 },
//                                 { id: 6 },
//                                 { id: 7 },
//                                 { id: 8 },
//                                 { id: 9 },
//                             ]
//                         )}

//                     </View>

//                     {!scrolling && (
//                         <View style={styles.footer}>
//                             <Pressable
//                                 onPress={() => {
//                                     router.replace("/queuelist")
//                                 }}
//                                 style={styles.searchButton}>
//                                 <CustomText style={{ color: '#fff' }}>Back</CustomText>
//                             </Pressable>
//                             <Pressable
//                                 // disabled={selectCustomerServices?.length === 0 || !selectedCustomerBarber}
//                                 onPress={joinConfirmation}
//                                 style={[
//                                     styles.searchButton,
//                                     // {
//                                     //     opacity: selectCustomerServices?.length === 0 || !selectedCustomerBarber ? 0.5 : 1
//                                     // }
//                                 ]}
//                             >
//                                 <CustomText style={{ color: '#fff' }}>Next</CustomText>
//                             </Pressable>
//                         </View>
//                     )}
//                 </KeyboardAvoidingView>
//             </SafeAreaView>
//         </Animated.View>
//     )
// }

// export default SingleJoin

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         // backgroundColor: '#00B0901A',
//         paddingHorizontal: scale(15),
//     },
//     boxOpenWrapper: {
//         // backgroundColor: '#fff',
//         borderRadius: scale(20),
//         height: verticalScale(300),
//         padding: scale(25),

//         // iOS shadow
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 0.3,
//         shadowRadius: 3,
//         padding: scale(25),

//         elevation: 3,
//     },
//     boxCloseWrapper: {
//         height: verticalScale(60),

//         // backgroundColor: '#fff',
//         borderRadius: scale(15),
//         paddingHorizontal: scale(25),
//         justifyContent: 'center',

//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 0.3,
//         shadowRadius: 3,
//         elevation: 3,
//     },
//     footer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginVertical: verticalScale(15),
//     },
//     clearAll: {
//         textDecorationLine: 'underline',
//     },
//     searchButton: {
//         height: verticalScale(40),
//         borderRadius: scale(10),
//         backgroundColor: Colors.modeColor.colorCode,
//         paddingHorizontal: scale(25),
//         justifyContent: 'center',
//         alignItems: 'center',
//     },







//     serviceItem: {
//         width: "100%",
//         height: verticalScale(124),
//         backgroundColor: "red",
//         // borderWidth: scale(0.5),
//         // borderColor: "#D2D2D2",
//         // borderRadius: scale(8),
//         paddingVertical: verticalScale(8),
//         // paddingHorizontal: scale(10),
//         backgroundColor: "#fff",
//         // elevation: 1
//     },


//     barberItem: {
//         width: "100%",
//         height: verticalScale(145),
//         // borderWidth: scale(0.5),
//         // borderColor: "#D2D2D2",
//         borderRadius: scale(8),
//         paddingVertical: verticalScale(8),
//         // paddingHorizontal: scale(10),
//         backgroundColor: "#fff",
//         // elevation: 1
//     },

//     navButtons: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         gap: scale(10)
//         // marginBottom: 10,
//     },
//     navButton: {
//         backgroundColor: Colors.modeColor.colorCode3,
//         borderColor: Colors.modeColor.colorCode,
//         borderWidth: scale(1),
//         width: scale(30),
//         height: scale(30),
//         borderRadius: scale(25),
//         justifyContent: "center",
//         alignItems: "center"
//     },

//     weekContainer: {
//         gap: scale(10)
//     },
//     dayBox: {
//         width: scale(60),
//         height: verticalScale(100),
//         borderColor: "#DDDDDD",
//         borderWidth: scale(0.6),
//         borderRadius: scale(4),
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: verticalScale(5)
//     },

// })


import { FlatList, Keyboard, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'; // Removed unused TouchableOpacity
import React, { useEffect, useState } from 'react';
import CustomText from '../../components/CustomText';
import { useRouter } from 'expo-router';
import { SafeAreaInsetsContext, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { AddIcon, ArrowLeftIcon, CheckIcon, SearchIcon } from '../../constants/icons';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Image } from 'expo-image';
import CustomSecondaryText from '../../components/CustomSecondaryText';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import { Toast } from 'toastify-react-native'
import Skeleton from '../../components/Skeleton';

const SingleJoin = () => {

    const router = useRouter();
    const { colors } = useTheme();
    const colorScheme = useColorScheme();
    const { authenticatedUser } = useAuth()

    const [servicesCategoryList, setServicesCategoryList] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
    })

    useEffect(() => {
        const fetchCategoryList = async () => {
            try {
                setServicesCategoryList((prev) => ({ ...prev, loading: true }))

                const { data } = await axios.post(`${BASE_URL}/mobileRoutes/getAllSalonCategories`, {
                    salonId: authenticatedUser?.salonId
                })

                setServicesCategoryList((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))
                setSelectedCategory(data?.response?.[0]?.serviceCategoryName)
            } catch (error) {
                setServicesCategoryList((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
                console.log("Error ", error?.response)
            }
        }

        fetchCategoryList()
    }, [authenticatedUser])


    const categoryList = [
        "Hair Cut",
        "Beard",
        "Trim",
        "Spa",
        "Hair"
    ];

    const [selectedCategory, setSelectedCategory] = useState("");

    const [salonServicesByCategory, setSalonServicesByCategory] = useState({
        data: [],
        filteredData: [],
        loading: false,
        error: null,
        success: false
    });


    useEffect(() => {
        const fetchSalonServicesByCategory = async () => {
            try {
                setSalonServicesByCategory((prev) => ({ ...prev, loading: true }))

                const { data } = await axios.get(`${BASE_URL}/mobileRoutes/getSalonServicesByCategory`, {
                    params: {
                        salonId: authenticatedUser?.salonId,
                        serviceCategoryName: selectedCategory
                    }
                })

                setSalonServicesByCategory((prev) => ({ ...prev, loading: false, data: data?.response, filteredData: data?.response, success: true, error: null }))

            } catch (error) {
                setSalonServicesByCategory((prev) => ({ ...prev, loading: false, data: null, filteredData: null, success: false, error: error }))
                console.log("Error ", error)
            }
        }

        fetchSalonServicesByCategory()
    }, [selectedCategory])


    const [searchServiceQuery, setSearchServiceQuery] = useState("")

    const handleChange = (text) => {
        setSearchServiceQuery(text)
    }


    useEffect(() => {
        if (searchServiceQuery) {
            const filtered = salonServicesByCategory?.data?.filter((item) =>
                item?.serviceName?.toLowerCase().includes(searchServiceQuery.toLowerCase())
            );

            setSalonServicesByCategory((prev) => ({
                ...prev,
                filteredData: filtered
            }));
        } else {
            setSalonServicesByCategory((prev) => ({
                ...prev,
                filteredData: prev.data
            }));
        }
    }, [searchServiceQuery]);

    function formatMinutesToHrMin(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
        if (hours > 0) return `${hours}hr`;
        return `${mins}m`;
    }

    const [selectedServices, setSelectedServices] = useState([]);

    const addServiceHandler = (service) => {
        setSelectedServices((prev) => {
            const exists = prev.find((s) => s.serviceId === service.serviceId);
            if (exists) return prev;
            return [...prev, service];
        });
    };


    const removeServiceHandler = (service) => {
        setSelectedServices((prev) => prev.filter((s) => s.serviceId !== service.serviceId));
    };

    const insets = useSafeAreaInsets()

    const totalPrice = selectedServices.reduce((acc, service) => acc + service.servicePrice, 0);
    const totalTime = selectedServices.reduce((acc, service) => acc + service.serviceEWT, 0);
    const totalServices = selectedServices.length;

    return (

        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.background,
                padding: scale(10),
            }}
        >
            {/* Header */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: scale(10),
                    marginBottom: verticalScale(20),
                }}
            >
                <Pressable onPress={() => router.replace("/queuelist")}>
                    <ArrowLeftIcon color={colors.text} />
                </Pressable>
                <CustomText
                    style={{
                        flex: 1,
                        fontFamily: "AirbnbCereal_W_XBd",
                        fontSize: scale(20),
                    }}
                >
                    Single Join (Services)
                </CustomText>
            </View>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                {/* Search Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Search services by category"
                        placeholderTextColor={colors.secondaryText}
                        value={searchServiceQuery}
                        onChangeText={handleChange}
                        style={[
                            styles.input,
                            {
                                borderWidth: scale(1),
                                borderColor: colors.queueBorder,
                                backgroundColor: colors.cardColor,
                                color: colors.text,
                            },
                        ]}
                    />
                    <Pressable style={styles.searchButton}>
                        <SearchIcon size={scale(20)} color="white" />
                    </Pressable>
                </View>
            </TouchableWithoutFeedback>

            {/* Categories */}
            {servicesCategoryList?.loading ? (
                <FlatList
                    data={[0, 1, 2, 3, 4, 5, 6]}
                    renderItem={({ item }) => (
                        <Skeleton
                            height={verticalScale(40)}
                            width={scale(100)}
                            borderRadius={scale(12)}
                        />
                    )}
                    keyExtractor={(item) => item.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{
                        height: verticalScale(40),
                        flexGrow: 0,
                        marginBottom: verticalScale(15),
                    }}
                    contentContainerStyle={{
                        alignItems: "center",
                        gap: scale(8),
                    }}
                />
            ) : (
                <FlatList
                    data={servicesCategoryList?.data}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setSelectedCategory(item.serviceCategoryName)}
                            style={[
                                styles.categoryButton,
                                {
                                    backgroundColor:
                                        selectedCategory === item?.serviceCategoryName
                                            ? "#14b8a6"
                                            : colorScheme === "dark"
                                                ? "#3f3f46"
                                                : "#e4e4e7",
                                    flexDirection: "row",
                                    gap: scale(5),
                                },
                            ]}
                        >
                            <Image
                                style={{
                                    width: scale(20),
                                    height: scale(20),
                                    borderRadius: scale(20),
                                    borderWidth: scale(1),
                                    borderColor: colors.queueBorder,
                                }}
                                source={{ uri: item?.serviceCategoryImage?.url }}
                                contentFit="cover"
                                transition={300}
                            />
                            <CustomText
                                style={{
                                    lineHeight: verticalScale(35),
                                    color:
                                        selectedCategory === item?.serviceCategoryName
                                            ? "#fff"
                                            : colorScheme === "dark"
                                                ? "#fff"
                                                : "#000",
                                    textAlign: "center",
                                }}
                            >
                                {item?.serviceCategoryName}
                            </CustomText>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{
                        height: verticalScale(35),
                        flexGrow: 0,
                        marginBottom: verticalScale(15),
                    }}
                    contentContainerStyle={{
                        alignItems: "center",
                        gap: scale(8),
                    }}
                />
            )}

            {/* Scrollable List Area */}
            <View style={{
                flex: 1,
                marginBottom: selectedServices?.length ? (Platform.OS === "ios" ? insets.bottom + verticalScale(20) : verticalScale(80)) : 0
            }}
            >
                {salonServicesByCategory?.loading ? (
                    <FlatList
                        data={[1, 2, 3, 4, 5, 6, 7, 8]}
                        renderItem={() => (
                            <Skeleton width={scale(160)} height={235} borderRadius={scale(8)} />
                        )}
                        keyExtractor={(item) => item.toString()}
                        numColumns={2}
                        columnWrapperStyle={{ columnGap: scale(10) }}
                        ItemSeparatorComponent={() => <View style={{ height: scale(10) }} />}
                        contentContainerStyle={{ paddingBottom: scale(20), paddingTop: scale(10) }}
                        showsVerticalScrollIndicator={false}
                    />
                ) : salonServicesByCategory?.data?.length > 0 ? (
                    <FlatList
                        data={salonServicesByCategory?.filteredData}
                        renderItem={({ item }) => {
                            const isSelected = selectedServices.find(s => s.serviceId === item.serviceId);
                            return (
                                <View
                                    style={[
                                        styles.serviceCard,
                                        {
                                            backgroundColor: colors.cardColor,
                                            borderColor: isSelected ? "#14b8a6" : colors.queueBorder,
                                            borderWidth: isSelected ? scale(2) : scale(1),
                                        },
                                    ]}
                                >
                                    <View style={styles.serviceCardImageContainer}>
                                        <Image
                                            style={[
                                                styles.serviceCardImage,
                                                { borderWidth: scale(1), borderColor: colors.queueBorder },
                                            ]}
                                            source={{ uri: item?.serviceIcon?.url }}
                                            contentFit="cover"
                                            transition={300}
                                        />
                                        <Pressable
                                            onPress={() =>
                                                isSelected
                                                    ? removeServiceHandler(item)
                                                    : addServiceHandler(item)
                                            }
                                            style={[
                                                styles.selectIcon,
                                                {
                                                    backgroundColor: isSelected
                                                        ? "#14b8a6"
                                                        : colorScheme === "dark"
                                                            ? "#3f3f46"
                                                            : "#e4e4e7",
                                                },
                                            ]}
                                        >
                                            {isSelected ? (
                                                <CheckIcon color="#fff" size={scale(18)} />
                                            ) : (
                                                <AddIcon color={colors.text} />
                                            )}
                                        </Pressable>
                                    </View>
                                    <CustomText
                                        style={{
                                            fontFamily: "AirbnbCereal_W_Bd",
                                            textAlign: "center",
                                        }}
                                    >
                                        {item?.serviceName}
                                    </CustomText>
                                    <CustomSecondaryText>
                                        ~{formatMinutesToHrMin(item?.serviceEWT)}
                                    </CustomSecondaryText>
                                    <CustomText
                                        style={{
                                            fontFamily: "AirbnbCereal_W_XBd",
                                        }}
                                    >
                                        {authenticatedUser?.currency} {item?.servicePrice}
                                    </CustomText>
                                </View>
                            );
                        }}
                        keyExtractor={(item) => item?.serviceId}
                        numColumns={2}
                        columnWrapperStyle={{ columnGap: scale(10) }}
                        ItemSeparatorComponent={() => <View style={{ height: scale(10) }} />}
                        contentContainerStyle={{ paddingBottom: scale(20), paddingTop: scale(10) }}
                        showsVerticalScrollIndicator={false}
                    />
                ) : null}
            </View>

            {/* Footer */}
            {selectedServices?.length ? (
                <View
                    style={{
                        backgroundColor: colors.cardColor,
                        borderTopColor: colors.queueBorder,
                        borderTopWidth: scale(1),
                        height:
                            Platform.OS === "ios"
                                ? insets.bottom + verticalScale(60)
                                : verticalScale(80),
                        padding: scale(10),
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <View style={{ marginBottom: verticalScale(15) }}>
                        <CustomText
                            style={{ fontFamily: "AirbnbCereal_W_XBd", fontSize: scale(18) }}
                        >
                            {authenticatedUser?.currency} {totalPrice.toFixed(2)}
                        </CustomText>
                        <CustomSecondaryText>
                            {totalServices} {totalServices === 1 ? "service" : "services"} |{" "}
                            {formatMinutesToHrMin(totalTime)}
                        </CustomSecondaryText>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            router.push({
                                pathname: "/singleJoinBarber",
                                params: {
                                    data: JSON.stringify(selectedServices),
                                },
                            });
                        }}
                        style={styles.queueButton}
                        activeOpacity={0.85}
                    >
                        <CustomText style={styles.queueButtonText}>Continue</CustomText>
                    </TouchableOpacity>
                </View>
            ) : null}
        </SafeAreaView>
    );
};

export default SingleJoin;

const styles = StyleSheet.create({
    categoryButton: {
        paddingHorizontal: scale(10),
        borderRadius: scale(8),
        justifyContent: 'center',
        alignItems: 'center',
    },


    inputContainer: {
        position: 'relative',
        width: '100%',
        justifyContent: 'center',
        marginBottom: verticalScale(15),
    },
    input: {
        width: '100%',
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(16),
        paddingRight: scale(50), // space for the search button
        borderRadius: scale(8),
    },
    searchButton: {
        position: 'absolute',
        right: scale(4),
        backgroundColor: '#14b8a6', // teal-500
        padding: scale(8),
        borderRadius: scale(6),
        justifyContent: 'center',
        alignItems: 'center',
    },

    serviceCard: {
        // width: scale(103), for 3 cards
        width: scale(160),
        // height: verticalScale(150),
        borderRadius: scale(8),
        justifyContent: "center",
        alignItems: "center",
        padding: scale(10),
        gap: verticalScale(5)
    },

    serviceCardImageContainer: {
        width: "100%",
        height: verticalScale(120),
        position: "relative"
    },

    serviceCardImage: {
        width: "100%",
        height: "100%",
        borderRadius: scale(4),
    },
    selectIcon: {
        position: "absolute",
        bottom: verticalScale(10),
        right: scale(10),
        height: scale(30),
        width: scale(30),
        borderRadius: scale(30),
        backgroundColor: "gray",
        justifyContent: "center",
        alignItems: "center"
    },

    queueButton: {
        width: '40%',
        backgroundColor: '#14b8a6', // bg-teal-500
        paddingVertical: verticalScale(12), // py-4
        borderRadius: scale(8), // rounded-xl
        marginBottom: verticalScale(15), // mb-6
        alignItems: 'center',
        justifyContent: 'center',
    },
    queueButtonText: {
        color: '#fff', // text-white
        fontFamily: "AirbnbCereal_W_XBd",
        fontSize: scale(16),
    },






    container: {
        flex: 1,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
});



