// import { Alert, FlatList, Platform, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native'
// import React, { useCallback, useState } from 'react'
// import CustomText from '../../../components/CustomText';
// import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
// import { Colors } from '../../../constants/Colors';
// import { useFocusEffect, useRouter } from 'expo-router';
// import { useGlobal } from '../../../context/GlobalContext';
// import { Image } from 'expo-image';
// import { CalendarIcon, ClockIcon, FilterIcon, NotificationIcon, RefreshIcon } from '../../../constants/icons';
// import CustomTabView from '../../../components/CustomTabView';
// import { useAuth } from '../../../context/AuthContext';
// import axios from 'axios';
// import { BASE_URL } from '@/utils/api';
// import Skeleton from '../../../components/Skeleton';
// import { useTheme } from '@react-navigation/native';
// import CustomSecondaryText from '../../../components/CustomSecondaryText';
// import { io } from "socket.io-client";

// const appointment = () => {

//   const customPageData = [
//     "header", "list"
//   ]

//   const [selectedTab, setSelectedTab] = useState("All")

//   const [tabs, setTabs] = useState([
//     "All",
//     "Upcoming",
//     "Served",
//     "Cancelled"
//   ])

//   const router = useRouter()
//   const { setJoinModes, joinModes, applyAppointmentFilter, setApplyAppointmentFilter, newNotification, setNewNotification } = useGlobal();

//   const { authenticatedUser } = useAuth()

//   const [appointmentListData, setAppointmentListData] = useState({
//     data: null,
//     loading: false,
//     error: null,
//     success: false
//   })

//   const socket = io("https://iqb-final.onrender.com", {
//     transports: ['websocket'],
//   });

//   useFocusEffect(
//     useCallback(() => {

//       if (applyAppointmentFilter.open) {

//         // socket.emit("joinSalon", authenticatedUser?.salonId);

//         socket.emit("customerAppointmentList", { salonId: authenticatedUser?.salonId, email: authenticatedUser?.email })

//         socket.on("appointmentsUpdated", (appointmentData) => {
//           setAppointmentListData((prev) => ({ ...prev, loading: false, data: appointmentData, success: true, error: null }))
//         })

//         const fetchAppointmentList = async () => {
//           try {

//             setAppointmentListData((prev) => ({ ...prev, loading: true }))

//             const { data } = await axios.post(`${BASE_URL}/mobileRoutes/getAllCustomerAppointments`, {
//               salonId: authenticatedUser?.salonId,
//               customerEmail: authenticatedUser?.email,
//               status: applyAppointmentFilter.selectedTab
//             })

//             setAppointmentListData((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))

//           } catch (error) {

//             setAppointmentListData((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
//             console.log("Error fetching appointment list ", error)
//           }
//         }

//         fetchAppointmentList()
//       }


//     }, [authenticatedUser, applyAppointmentFilter])
//   )

//   const { colors } = useTheme()

//   const [refreshing, setRefreshing] = useState(false);

//   const onRefresh = () => {
//     setRefreshing(true);
//     setTimeout(() => {
//       setApplyAppointmentFilter({
//         selectedTab: "all",
//         open: true
//       })
//       setRefreshing(false);
//     }, 2000);
//   };

//   return (
//     <CustomTabView
//       style={{
//         paddingVertical: verticalScale(0),
//         paddingTop: verticalScale(0),
//         backgroundColor: colors.background
//       }}
//     >

//       {/* <View style={{
//         flexDirection: "row",
//         alignItems: "center",
//         gap: scale(10),
//         paddingInline: scale(10)
//       }}>

//         <Pressable
//           style={{
//             height: verticalScale(40),
//             flex: 1,
//             backgroundColor: Colors.modeColor.colorCode,
//             marginHorizontal: "auto",
//             justifyContent: "center",
//             alignItems: "center",
//             borderRadius: scale(4),
//             marginTop: verticalScale(10),
//           }}
//           onPress={() => {
//             setJoinModes((prev) => ({ ...prev, appointment: true, appointmentType: "Book" }));
//             router.push("/appointmentCalendar");
//           }}
//         >
//           <CustomText style={{ color: "#fff" }}>Book Appointment</CustomText>
//         </Pressable>

//         <Pressable
//           onPress={() => router.push("/appointmentFilter")}
//           style={{
//             height: verticalScale(40),
//             width: verticalScale(40),
//             backgroundColor: "#0BA3AD1A",
//             marginHorizontal: "auto",
//             justifyContent: "center",
//             alignItems: "center",
//             borderRadius: scale(4),
//             marginTop: verticalScale(10),
//           }}
//         >
//           <FilterIcon color={Colors.modeColor.colorCode} />
//         </Pressable>
//       </View> */}

//       <FlatList
//         data={customPageData}
//         style={{
//           // backgroundColor: "#0BA3AD0D",
//         }}
//         contentContainerStyle={{
//           // gap: verticalScale(10),
//           paddingHorizontal: scale(10),
//           paddingBottom: Platform.OS === 'ios' ? verticalScale(80) : 0
//         }}
//         showsVerticalScrollIndicator={false}

//         renderItem={({ item }) => {
//           switch (item) {

//             case 'list':
//               return (
//                 <View style={{
//                   flex: 1,
//                   marginTop: verticalScale(10)
//                 }}>

//                   {
//                     appointmentListData?.loading ? (

//                       [0, 1, 2, 3, 4, 5].map((item) => {
//                         return (
//                           <Skeleton
//                             key={item}
//                             height={verticalScale(80)}
//                             borderRadius={scale(4)}
//                             style={{
//                               marginVertical: verticalScale(5)
//                             }}
//                           />
//                         )
//                       })

//                     ) : appointmentListData?.data?.length > 0 ? (
//                       // appointmentListData?.data?.map((item, index) => {
//                       //   return (
//                       //     <Pressable
//                       //       onPress={() => {
//                       //         if (item.status === "upcoming") {
//                       //           router.push({
//                       //             pathname: "/appointmentPop",
//                       //             params: {
//                       //               selectedAppointment: JSON.stringify(item),
//                       //             },
//                       //           });
//                       //         } else {
//                       //           Alert.alert(
//                       //             "Warning",
//                       //             `This appointment is already ${item.status}`,
//                       //             [
//                       //               { text: "OK", onPress: () => { } }
//                       //             ],
//                       //             { cancelable: true }
//                       //           )
//                       //         }

//                       //       }
//                       //       }
//                       //       key={item?._id}
//                       //       style={{
//                       //         flexDirection: "row",
//                       //         justifyContent: "space-between",
//                       //         alignItems: "center",
//                       //         minHeight: verticalScale(75),
//                       //         backgroundColor: "#fff",
//                       //         marginBottom: verticalScale(10),
//                       //         paddingInline: scale(15),
//                       //         borderRadius: scale(10),
//                       //       }}>

//                       //       <View style={{
//                       //         flexDirection: "row",
//                       //         alignItems: "center",
//                       //         gap: scale(10)
//                       //       }}>
//                       //         <View style={{
//                       //           position: "relative"
//                       //         }}>
//                       //           <Image
//                       //             style={{ height: scale(50), width: scale(50), borderRadius: moderateScale(30) }}
//                       //             source={{ uri: item?.barberProfile?.[0]?.url }}
//                       //             // placeholder={{ blurhash }}
//                       //             contentFit="cover"
//                       //             transition={300}
//                       //           />
//                       //         </View>


//                       //         <View style={{ gap: verticalScale(8) }}>
//                       //           <CustomText style={{ fontSize: scale(14) }}>{item?.barbername}</CustomText>

//                       //           <View
//                       //             style={{
//                       //               height: verticalScale(15),
//                       //               paddingHorizontal: scale(5),
//                       //               borderRadius: scale(4),
//                       //               backgroundColor: item.status === "served" ? "#00B0901A" :
//                       //                 item.status === "upcoming" ? "#EAA8241A" : "#E11D481A",
//                       //               justifyContent: "center",
//                       //               alignItems: "center",
//                       //               alignSelf: "flex-start"
//                       //             }}
//                       //           ><CustomText style={{
//                       //             color: item.status === "served" ? "#00B090" :
//                       //               item.status === "upcoming" ? "#EAA824" : "#E11D48",
//                       //             fontSize: scale(10),
//                       //           }}>{item.status}</CustomText></View>

//                       //         </View>

//                       //       </View>

//                       //       <View style={{ gap: verticalScale(5) }}>
//                       //         <View style={{
//                       //           flexDirection: "row",
//                       //           alignItems: "center",
//                       //           gap: scale(2),
//                       //           // flex: 1
//                       //         }}>
//                       //           <ClockIcon size={scale(12)} color='gray' />
//                       //           <CustomText style={{ fontSize: scale(12), color: "gray" }}>{item?.timeSlots}</CustomText>
//                       //         </View>

//                       //         <CustomText style={{ fontSize: scale(14), fontFamily: "AirbnbCereal_W_Bd", textAlign: "center" }}>{item?.appointmentDate?.split("T")[0]}</CustomText>

//                       //       </View>

//                       //     </Pressable>
//                       //   )
//                       // })

//                       <FlatList
//                         data={appointmentListData?.data}
//                         keyExtractor={(item) => item?._id}
//                         contentContainerStyle={{ paddingBottom: verticalScale(20) }}
//                         renderItem={({ item }) => (
//                           <Pressable
//                             onPress={() => {
//                               if (item.status === "upcoming") {
//                                 router.push({
//                                   pathname: "/appointmentPop",
//                                   params: {
//                                     selectedAppointment: JSON.stringify(item),
//                                   },
//                                 });
//                               } else {
//                                 Alert.alert(
//                                   "Warning",
//                                   `This appointment is already ${item.status}`,
//                                   [{ text: "OK", onPress: () => { } }],
//                                   { cancelable: true }
//                                 );
//                               }
//                             }}
//                             style={{
//                               flexDirection: "row",
//                               justifyContent: "space-between",
//                               alignItems: "center",
//                               minHeight: verticalScale(75),
//                               backgroundColor: "#00B0901A",
//                               marginBottom: verticalScale(10),
//                               paddingHorizontal: scale(15),
//                               borderRadius: scale(10),
//                             }}
//                           >
//                             {/* Left section */}
//                             <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
//                               <View style={{ position: "relative" }}>
//                                 <Image
//                                   style={{
//                                     height: scale(50),
//                                     width: scale(50),
//                                     borderRadius: moderateScale(30),
//                                   }}
//                                   source={{ uri: item?.barberProfile?.[0]?.url }}
//                                   contentFit="cover"
//                                   transition={300}
//                                 />
//                               </View>

//                               <View style={{ gap: verticalScale(8) }}>
//                                 <CustomText style={{ fontSize: scale(14) }}>{item?.barbername}</CustomText>

//                                 <View
//                                   style={{
//                                     height: verticalScale(15),
//                                     paddingHorizontal: scale(5),
//                                     borderRadius: scale(4),
//                                     backgroundColor:
//                                       item.status === "served"
//                                         ? "#00B0901A"
//                                         : item.status === "upcoming"
//                                           ? "#EAA8241A"
//                                           : "#E11D481A",
//                                     justifyContent: "center",
//                                     alignItems: "center",
//                                     alignSelf: "flex-start",
//                                   }}
//                                 >
//                                   <CustomText
//                                     style={{
//                                       color:
//                                         item.status === "served"
//                                           ? "#00B090"
//                                           : item.status === "upcoming"
//                                             ? "#EAA824"
//                                             : "#E11D48",
//                                       fontSize: scale(10),
//                                     }}
//                                   >
//                                     {item.status}
//                                   </CustomText>
//                                 </View>
//                               </View>
//                             </View>

//                             {/* Right section */}
//                             <View style={{ gap: verticalScale(5) }}>
//                               <CustomText
//                                 style={{
//                                   fontSize: scale(14),
//                                   fontFamily: "AirbnbCereal_W_Bd",
//                                   textAlign: "center",
//                                 }}
//                               >
//                                 {item?.appointmentDate?.split("T")[0]}
//                               </CustomText>

//                               <View style={{ flexDirection: "row", alignItems: "center", gap: scale(2) }}>
//                                 <ClockIcon size={scale(12)} color="gray" />
//                                 <CustomText style={{ fontSize: scale(12), color: "gray" }}>
//                                   {item?.timeSlots}
//                                 </CustomText>
//                               </View>
//                             </View>
//                           </Pressable>
//                         )}

//                       />
//                     ) : (
//                       <View style={{
//                         justifyContent: "center",
//                         alignItems: "center",
//                         minHeight: verticalScale(400)
//                       }}>
//                         <View
//                           style={{
//                             gap: verticalScale(12)
//                           }}
//                         >
//                           <View
//                             style={{
//                               width: scale(60),
//                               height: scale(60),
//                               backgroundColor: colors.background,
//                               marginHorizontal: "auto",
//                               borderRadius: scale(50),
//                               justifyContent: "center",
//                               alignItems: "center"
//                             }}
//                           >
//                             <CalendarIcon
//                               color={colors.text}
//                               size={scale(40)}
//                             />
//                           </View>
//                           <CustomText
//                             style={{
//                               textAlign: "center",
//                               fontSize: scale(16)
//                             }}
//                           >No Appointments Scheduled</CustomText>
//                           <CustomSecondaryText
//                             style={{
//                               textAlign: "center"
//                             }}
//                           >
//                             {applyAppointmentFilter.selectedTab === "upcoming" ? "You haven’t booked any appointments yet. Schedule your appointment today to ensure a convenient time that fits your schedule." :
//                               applyAppointmentFilter.selectedTab === "served" ? "You have no served appointments" :
//                                 applyAppointmentFilter.selectedTab === "cancelled" ? "You have no cancel appointments" :
//                                   "You haven’t booked any appointments yet. Schedule your appointment today to ensure a convenient time that fits your schedule."}
//                           </CustomSecondaryText>

//                         </View>
//                       </View>
//                     )
//                   }


//                 </View>
//               );
//             default:
//               return null;
//           }
//         }}
//         keyExtractor={item => item}

//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['black']}
//             progressBackgroundColor={'#fff'}
//           />
//         }
//       />
//     </CustomTabView>
//   )
// }

// export default appointment

// const styles = StyleSheet.create({

//   selectedTabBtn: {
//     backgroundColor: Colors.modeColor.colorCode,
//     paddingHorizontal: scale(10),
//     height: verticalScale(30),
//     borderRadius: scale(4),
//     justifyContent: "center",
//     alignItems: "center"
//   },

//   unSelectedTabBtn: {
//     backgroundColor: "#fff",
//     paddingHorizontal: scale(10),
//     height: verticalScale(30),
//     borderRadius: scale(4),
//     justifyContent: "center",
//     alignItems: "center",
//     borderColor: Colors.modeColor.colorCode,
//     borderWidth: scale(1)
//   }
// })



import { Alert, FlatList, Platform, Pressable, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import CustomText from '../../../components/CustomText';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../../constants/Colors';
import { useFocusEffect, useRouter } from 'expo-router';
import { useGlobal } from '../../../context/GlobalContext';
import { Image } from 'expo-image';
import { CalendarIcon, ClockIcon, FilterIcon, NotificationIcon, RefreshIcon } from '../../../constants/icons';
import CustomTabView from '../../../components/CustomTabView';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import Skeleton from '../../../components/Skeleton';
import { useTheme } from '@react-navigation/native';
import CustomSecondaryText from '../../../components/CustomSecondaryText';
import { io } from "socket.io-client";
import { Feather } from '@expo/vector-icons';

const appointment = () => {

  const customPageData = [
    "header", "list"
  ]

  const [selectedTab, setSelectedTab] = useState("All")

  const [tabs, setTabs] = useState([
    "All",
    "Upcoming",
    "Served",
    "Cancelled"
  ])

  const router = useRouter()
  const { setJoinModes, joinModes, applyAppointmentFilter, setApplyAppointmentFilter, newNotification, setNewNotification } = useGlobal();

  const { authenticatedUser } = useAuth()

  const [appointmentListData, setAppointmentListData] = useState({
    data: null,
    loading: false,
    error: null,
    success: false
  })

  const socket = io("https://iqb-final.onrender.com", {
    transports: ['websocket'],
  });

  useFocusEffect(
    useCallback(() => {

      if (applyAppointmentFilter.open) {

        // socket.emit("joinSalon", authenticatedUser?.salonId);

        socket.emit("customerAppointmentList", { salonId: authenticatedUser?.salonId, email: authenticatedUser?.email })

        socket.on("appointmentsUpdated", (appointmentData) => {
          setAppointmentListData((prev) => ({ ...prev, loading: false, data: appointmentData, success: true, error: null }))
        })

        const fetchAppointmentList = async () => {
          try {

            setAppointmentListData((prev) => ({ ...prev, loading: true }))

            const { data } = await axios.post(`${BASE_URL}/mobileRoutes/getAllCustomerAppointments`, {
              salonId: authenticatedUser?.salonId,
              customerEmail: authenticatedUser?.email,
              status: applyAppointmentFilter.selectedTab
            })

            setAppointmentListData((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))

          } catch (error) {

            setAppointmentListData((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
            console.log("Error fetching appointment list ", error)
          }
        }

        fetchAppointmentList()
      }


    }, [authenticatedUser, applyAppointmentFilter])
  )

  const { colors } = useTheme()

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setApplyAppointmentFilter({
        selectedTab: "all",
        open: true
      })
      setRefreshing(false);
    }, 2000);
  };

  const dummyAppointments = [
    {
      id: '1',
      salonName: 'Style H Gents Salon',
      dateTime: 'Wed, Jun 18, 2025 at 12:30 PM',
      price: 'AED 235',
      items: 2,
      image: 'https://placehold.co/80x80/E5E7EB/1F2937?text=S',
    },
    {
      id: '2',
      salonName: 'Elite Barber Lounge',
      dateTime: 'Fri, Jun 20, 2025 at 3:00 PM',
      price: 'AED 180',
      items: 1,
      image: 'https://placehold.co/80x80/E5E7EB/1F2937?text=E',
    },
    {
      id: '3',
      salonName: 'Elite Barber Lounge',
      dateTime: 'Fri, Jun 20, 2025 at 3:00 PM',
      price: 'AED 180',
      items: 1,
      image: 'https://placehold.co/80x80/E5E7EB/1F2937?text=E',
    },
    {
      id: '4',
      salonName: 'Elite Barber Lounge',
      dateTime: 'Fri, Jun 20, 2025 at 3:00 PM',
      price: 'AED 180',
      items: 1,
      image: 'https://placehold.co/80x80/E5E7EB/1F2937?text=E',
    },
    {
      id: '5',
      salonName: 'Elite Barber Lounge',
      dateTime: 'Fri, Jun 20, 2025 at 3:00 PM',
      price: 'AED 180',
      items: 1,
      image: 'https://placehold.co/80x80/E5E7EB/1F2937?text=E',
    },
  ];

  console.log("appointmentListData ", JSON.stringify(appointmentListData?.data?.filter((item) => item.status !== "upcoming"), null, 2))

  return (
    <CustomTabView
      style={{
        paddingVertical: verticalScale(0),
        paddingTop: verticalScale(0),
        backgroundColor: colors.background
      }}
    >

      <View style={styles.header}>

        <CustomText style={{ fontSize: scale(18), fontFamily: "AirbnbCereal_W_XBd" }}>Appointments</CustomText>

        {/* Right section - Notification bell */}
        <Pressable
          style={styles.bellWrapper}
          activeOpacity={0.7}
          onPress={async () => {

            if (newNotification.value) {
              await AsyncStorage.setItem(
                "newNotification",
                JSON.stringify({
                  email: authenticatedUser?.email,
                  value: false
                })
              );
              setNewNotification({
                email: "",
                value: false
              })
            }

            router.push("/notification")
          }}
        >
          <NotificationIcon size={moderateScale(24)} color={colors.notificationBellColor} />
          {
            newNotification.value && (
              <View style={styles.badge} />
            )
          }

        </Pressable>
      </View>

      <View>
        <CustomText style={styles.Listheader}>Upcoming</CustomText>

        {
          appointmentListData?.loading ? (
            <CustomText>Loading..</CustomText>
          ) : appointmentListData?.data?.filter((item) => item.status === "upcoming")?.length > 0 ? (
            <FlatList
              data={appointmentListData?.data?.filter((item) => item.status === "upcoming")}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    if (item.status === "upcoming") {
                      router.push({
                        pathname: "/appointmentPop",
                        params: {
                          selectedAppointment: JSON.stringify(item),
                        },
                      });
                    } else {
                      Alert.alert(
                        "Warning",
                        `This appointment is already ${item.status}`,
                        [{ text: "OK", onPress: () => { } }],
                        { cancelable: true }
                      );
                    }
                  }}
                  style={[styles.card, { backgroundColor: colors.cardColor, borderColor: colors.cardBorder }]}>
                  <Image source={{ uri: item?.barberProfile?.[0]?.url }} style={styles.image} />
                  <View style={styles.info}>
                    <CustomText style={[styles.title, {
                      fontFamily: "AirbnbCereal_W_XBd",
                    }]} numberOfLines={1}>{item.barbername}</CustomText>
                    <CustomText style={[styles.datetime, {
                      color: colors.secondaryText,
                    }]}>{item?.appointmentDate?.split("T")[0]} ({item?.timeSlots})</CustomText>
                    <View style={styles.footer}>
                      <CustomText style={[styles.meta, {
                        color: colors.secondaryText,
                      }]}>{authenticatedUser?.currency} {item?.services?.reduce((sum, service) => {
                        return sum + (service?.servicePrice || 0);
                      }, 0)} • {item?.services.length} item{item?.services.length > 1 ? 's' : ''}</CustomText>
                    </View>
                  </View>
                </Pressable>
              )}
              style={{
                height: verticalScale(250),
                marginBottom: verticalScale(20)
              }}
              contentContainerStyle={{ paddingBottom: verticalScale(20), paddingHorizontal: scale(5) }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={[styles.upcomingCard, { backgroundColor: colors.cardColor, borderColor: colors.cardBorder }]}>
              <View style={[styles.iconContainer, { backgroundColor: "rgba(13, 148, 136, 0.1)" }]}>
                <Feather name={"calendar"} size={moderateScale(32)} color={"#14b8a6"} />
              </View>
              <Text style={styles.cardTitle}>No upcoming appointments</Text>
              <Text style={[styles.cardSubtitle, { color: colors.secondaryText, }]}>Your upcoming appointments will appear here when you book.</Text>

              <TouchableOpacity
                onPress={() => {
                  setJoinModes((prev) => ({ ...prev, appointment: true, appointmentType: "Book" }));
                  router.push("/appointmentCalendar");
                }}
                style={styles.bookButton} activeOpacity={0.85}>
                <CustomText style={styles.bookButtonText}>Book Appointment</CustomText>
              </TouchableOpacity>
            </View>
          )
        }
      </View >

      <View>
        <CustomText style={styles.Listheader}>Past {appointmentListData?.data?.filter((item) => item.status !== "upcoming")?.length}</CustomText>

        {
          appointmentListData?.loading ? (
            <CustomText>Loading..</CustomText>
          ) : appointmentListData?.data?.filter((item) => item.status !== "upcoming")?.length > 0 ? (
            <FlatList
              data={appointmentListData?.data?.filter((item) => item.status !== "upcoming")}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    if (item.status === "upcoming") {
                      router.push({
                        pathname: "/appointmentPop",
                        params: {
                          selectedAppointment: JSON.stringify(item),
                        },
                      });
                    } else {
                      Alert.alert(
                        "Warning",
                        `This appointment is already ${item.status}`,
                        [{ text: "OK", onPress: () => { } }],
                        { cancelable: true }
                      );
                    }
                  }}
                  style={[styles.card, { backgroundColor: colors.cardColor, borderColor: colors.cardBorder }]}>
                  <Image source={{ uri: item?.barberProfile?.[0]?.url }} style={styles.image} />
                  <View style={styles.info}>
                    <CustomText style={[styles.title, {
                      fontFamily: "AirbnbCereal_W_XBd",
                    }]} numberOfLines={1}>{item.barbername}</CustomText>
                    <CustomText style={[styles.datetime, {
                      color: colors.secondaryText,
                    }]}>{item?.appointmentDate?.split("T")[0]} ({item?.timeSlots})</CustomText>
                    <CustomText
                    >{item.status}</CustomText>
                    <View style={styles.footer}>
                      <CustomText style={[styles.meta, {
                        color: colors.secondaryText,
                      }]}>{authenticatedUser?.currency} {item?.services?.reduce((sum, service) => {
                        return sum + (service?.servicePrice || 0);
                      }, 0)} • {item?.services.length} item{item?.services.length > 1 ? 's' : ''}</CustomText>

                      <TouchableOpacity
                        onPress={() => {
                          setJoinModes((prev) => ({ ...prev, appointment: true, appointmentType: "Book" }));
                          router.push("/appointmentCalendar");
                        }}
                        style={styles.rebookButton}>
                        <Text style={styles.rebookText}>Book again</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Pressable>
              )}
              style={{
                height: verticalScale(250)
              }}
              contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? verticalScale(150) : verticalScale(100), paddingHorizontal: scale(5) }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={[styles.upcomingCard, { backgroundColor: colors.cardColor, borderColor: colors.cardBorder }]}>
              <View style={[styles.iconContainer, { backgroundColor: "rgba(13, 148, 136, 0.1)" }]}>
                <Feather name={"calendar"} size={moderateScale(32)} color={"#14b8a6"} />
              </View>
              <Text style={styles.cardTitle}>No past appointments</Text>
              <Text style={[styles.cardSubtitle, { color: colors.secondaryText, }]}>Your past appointments will appear here.</Text>
            </View>
          )
        }
      </View>

    </CustomTabView >
  )
}

export default appointment

const styles = StyleSheet.create({

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: verticalScale(40),
    // paddingTop: verticalScale(5),
    // paddingBottom: verticalScale(12),
  },

  bellWrapper: {
    padding: scale(8),
    borderRadius: scale(999),
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: scale(6),
    right: scale(6),
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#2dd4bf', // bg-teal-400
  },


  container: {
    paddingBottom: Platform.OS === "ios" ? verticalScale(150) : verticalScale(100),
    paddingInline: scale(5),
    backgroundColor: "red",
    height: 300
    // padding: scale(16),
    // backgroundColor: "red",

  },
  Listheader: {
    fontSize: scale(18),
    fontFamily: "AirbnbCereal_W_Bd",
    marginBottom: verticalScale(10),
  },

  upcomingCard: {
    // backgroundColor: '#ffffff',
    borderRadius: scale(12),
    padding: scale(20),
    alignItems: 'center',
    // borderColor: '#e5e7eb',
    borderWidth: scale(1),
    gap: verticalScale(20),
    marginBottom: verticalScale(24)
  },

  iconContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(80),
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "auto",
  },
  cardTitle: {
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(20),
    textAlign: "center",
    // marginBottom: verticalScale(4),
  },
  cardSubtitle: {
    fontFamily: "AirbnbCereal_W_Bd",
    fontSize: scale(16),
    textAlign: "center",
    // marginBottom: verticalScale(20)
  },
  bookButton: {
    width: '100%',
    backgroundColor: '#14b8a6', // bg-teal-500
    paddingVertical: verticalScale(16), // py-4
    borderRadius: scale(12), // rounded-xl
    marginBottom: verticalScale(15), // mb-6
    alignItems: 'center',
    justifyContent: 'center'
  },
  bookButtonText: {
    color: '#fff', // text-white
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(16),
  },


  card: {
    flexDirection: 'row',
    // backgroundColor: '#ffffff',
    borderRadius: scale(12),
    padding: scale(12),
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  separator: {
    height: verticalScale(10),
  },
  image: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(12),
    marginRight: scale(12),
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: scale(16),
    fontWeight: '600',
    // color: '#1f2937',
  },
  datetime: {
    fontSize: scale(12),
    // color: '#6b7280',
    marginTop: verticalScale(2),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  meta: {
    fontSize: scale(12),
    // color: '#9ca3af',
  },
  rebookButton: {
    backgroundColor: '#ccfbf1',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderRadius: scale(6),
  },
  rebookText: {
    color: '#0f766e',
    fontSize: scale(12),
    fontWeight: '500',
  },
})



// import React from 'react';
// import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
// import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
// import { Feather, Ionicons } from '@expo/vector-icons';
// const appointment = () => {
//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Appointments</Text>
//         <TouchableOpacity>
//           <Feather name="sun" size={24} color="#1f2937" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.contentContainer}>
//         {/* Upcoming Appointments */}
//         <Text style={styles.sectionTitle}>Upcoming</Text>
//         <View style={styles.upcomingCard}>
//           <View style={styles.calendarIconWrapper}>
//             <Feather name="calendar" size={40} color="#14b8a6" />
//           </View>
//           <Text style={styles.cardTitle}>No upcoming appointments</Text>
//           <Text style={styles.cardSubtitle}>Your upcoming appointments will appear here when you book.</Text>
//           <TouchableOpacity style={styles.bookButton}>
//             <Text style={styles.bookButtonText}>Book Appointment</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Past Appointments */}
//         <View style={styles.pastHeader}>
//           <Text style={styles.sectionTitle}>Past</Text>
//           <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
//         </View>

//         <View style={styles.pastCard}>
//           <Image
//             source={{ uri: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2670&auto=format&fit=crop' }}
//             style={styles.salonImage}
//           />
//           <View style={styles.statusBadgeServed}><Text style={styles.statusBadgeText}>Served</Text></View>
//           <View style={styles.cardContent}>
//             <Text style={styles.salonName}>Style H Gents Salon</Text>
//             <Text style={styles.dateTime}>Wed, Jun 18, 2025 at 12:30 PM</Text>
//             <View style={styles.cardFooter}>
//               <Text style={styles.amountText}>AED 235 • 2 items</Text>
//               <TouchableOpacity style={styles.rebookButton}>
//                 <Text style={styles.rebookButtonText}>Book again</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         <View style={styles.pastCard}>
//           <Image
//             source={{ uri: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2670&auto=format&fit=crop' }}
//             style={styles.salonImage}
//           />
//           <View style={styles.statusBadgeCanceled}><Text style={styles.statusBadgeText}>Canceled</Text></View>
//           <View style={styles.cardContent}>
//             <Text style={styles.salonName}>Style H Gents Salon</Text>
//             <Text style={styles.dateTime}>Tue, Jun 17, 2025 at 4:45 PM</Text>
//             <View style={styles.cardFooter}>
//               <Text style={styles.amountText}>AED 0 • 4 items</Text>
//               <TouchableOpacity style={styles.rebookButton}>
//                 <Text style={styles.rebookButtonText}>Book again</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// export default appointment

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f3f4f6',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: scale(16),
//   },
//   headerTitle: {
//     fontSize: scale(20),
//     fontWeight: 'bold',
//     color: '#1f2937',
//   },
//   contentContainer: {
//     padding: scale(16),
//     paddingBottom: verticalScale(40)
//   },
//   sectionTitle: {
//     fontSize: scale(18),
//     fontWeight: '600',
//     color: '#1f2937',
//     marginBottom: verticalScale(10)
//   },
//   upcomingCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: scale(16),
//     padding: scale(20),
//     alignItems: 'center',
//     borderColor: '#e5e7eb',
//     borderWidth: 1,
//     marginBottom: verticalScale(24)
//   },
//   calendarIconWrapper: {
//     backgroundColor: '#ccfbf1',
//     width: scale(80),
//     height: scale(80),
//     borderRadius: scale(16),
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: verticalScale(20),
//   },
//   cardTitle: {
//     fontSize: scale(16),
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: verticalScale(4),
//   },
//   cardSubtitle: {
//     color: '#6b7280',
//     fontSize: scale(13),
//     textAlign: 'center',
//     marginBottom: verticalScale(20)
//   },
//   bookButton: {
//     backgroundColor: '#14b8a6',
//     paddingVertical: verticalScale(12),
//     paddingHorizontal: scale(24),
//     borderRadius: scale(12),
//     shadowColor: '#14b8a6',
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 3
//   },
//   bookButtonText: {
//     color: '#ffffff',
//     fontWeight: 'bold'
//   },
//   pastHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: scale(6),
//     marginBottom: verticalScale(10)
//   },
//   badge: {
//     backgroundColor: '#e5e7eb',
//     borderRadius: scale(10),
//     paddingHorizontal: scale(6),
//     paddingVertical: verticalScale(2)
//   },
//   badgeText: {
//     fontSize: scale(10),
//     fontWeight: 'bold',
//     color: '#374151'
//   },
//   pastCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: scale(16),
//     padding: scale(12),
//     flexDirection: 'row',
//     gap: scale(12),
//     borderColor: '#e5e7eb',
//     borderWidth: 1,
//     position: 'relative',
//   },
//   salonImage: {
//     width: scale(80),
//     height: scale(80),
//     borderRadius: scale(14)
//   },
//   statusBadgeServed: {
//     position: 'absolute',
//     top: scale(6),
//     left: scale(70),
//     backgroundColor: '#d1fae5',
//     paddingHorizontal: scale(6),
//     paddingVertical: verticalScale(2),
//     borderRadius: scale(10),
//     zIndex: 2
//   },
//   statusBadgeCanceled: {
//     position: 'absolute',
//     top: scale(6),
//     left: scale(70),
//     backgroundColor: '#fee2e2',
//     paddingHorizontal: scale(6),
//     paddingVertical: verticalScale(2),
//     borderRadius: scale(10),
//     zIndex: 2
//   },
//   statusBadgeText: {
//     fontSize: scale(10),
//     fontWeight: 'bold',
//     color: '#1f2937'
//   },
//   cardContent: {
//     flex: 1
//   },
//   salonName: {
//     fontWeight: 'bold',
//     fontSize: scale(14),
//     color: '#1f2937'
//   },
//   dateTime: {
//     color: '#6b7280',
//     fontSize: scale(12),
//     marginTop: verticalScale(2)
//   },
//   cardFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: verticalScale(10)
//   },
//   amountText: {
//     fontSize: scale(11),
//     color: '#9ca3af'
//   },
//   rebookButton: {
//     backgroundColor: '#5eead4',
//     paddingHorizontal: scale(12),
//     paddingVertical: verticalScale(6),
//     borderRadius: scale(8)
//   },
//   rebookButtonText: {
//     color: '#0f766e',
//     fontWeight: '600',
//     fontSize: scale(12)
//   }
// })