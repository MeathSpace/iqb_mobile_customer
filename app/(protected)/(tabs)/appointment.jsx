import { Alert, FlatList, Platform, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import CustomText from '../../../components/CustomText';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../../constants/Colors';
import { useFocusEffect, useRouter } from 'expo-router';
import { useGlobal } from '../../../context/GlobalContext';
import { Image } from 'expo-image';
import { CalendarIcon, ClockIcon, FilterIcon, RefreshIcon } from '../../../constants/icons';
import CustomTabView from '../../../components/CustomTabView';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import Skeleton from '../../../components/Skeleton';
import { useTheme } from '@react-navigation/native';
import CustomSecondaryText from '../../../components/CustomSecondaryText';
import { io } from "socket.io-client";

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
  const { setJoinModes, joinModes, applyAppointmentFilter, setApplyAppointmentFilter } = useGlobal();

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

        socket.emit("joinSalon", authenticatedUser?.salonId);

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

  return (
    <CustomTabView
      style={{
        paddingHorizontal: scale(0),
        paddingTop: verticalScale(0),
        backgroundColor: "#00B0901A"
      }}
    >
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10),
        paddingInline: scale(10)
      }}>
        {/* Header Button */}
        <Pressable
          style={{
            height: verticalScale(40),
            flex: 1,
            backgroundColor: Colors.modeColor.colorCode,
            marginHorizontal: "auto",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: scale(4),
            marginTop: verticalScale(10),
          }}
          onPress={() => {
            setJoinModes((prev) => ({ ...prev, appointment: true, appointmentType: "Book" }));
            router.push("/appointmentCalendar");
          }}
        >
          <CustomText style={{ color: "#fff" }}>Book Appointment</CustomText>
        </Pressable>

        <Pressable
          onPress={() => router.push("/appointmentFilter")}
          style={{
            height: verticalScale(40),
            width: verticalScale(40),
            backgroundColor: "#0BA3AD1A",
            marginHorizontal: "auto",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: scale(4),
            marginTop: verticalScale(10),
          }}
        >
          <FilterIcon color={Colors.modeColor.colorCode} />
        </Pressable>
      </View>

      <FlatList
        data={customPageData}
        style={{
          // backgroundColor: "#0BA3AD0D",
        }}
        contentContainerStyle={{
          // gap: verticalScale(10),
          paddingHorizontal: scale(10),
          paddingBottom: Platform.OS === 'ios' ? verticalScale(80) : 0
        }}
        showsVerticalScrollIndicator={false}

        renderItem={({ item }) => {
          switch (item) {

            case 'list':
              return (
                <View style={{
                  flex: 1,
                  marginTop: verticalScale(10)
                }}>

                  {
                    appointmentListData?.loading ? (

                      [0, 1, 2, 3, 4, 5].map((item) => {
                        return (
                          <Skeleton
                            key={item}
                            height={verticalScale(80)}
                            borderRadius={scale(4)}
                            style={{
                              marginVertical: verticalScale(5)
                            }}
                          />
                        )
                      })

                    ) : appointmentListData?.data?.length > 0 ? (
                      // appointmentListData?.data?.map((item, index) => {
                      //   return (
                      //     <Pressable
                      //       onPress={() => {
                      //         if (item.status === "upcoming") {
                      //           router.push({
                      //             pathname: "/appointmentPop",
                      //             params: {
                      //               selectedAppointment: JSON.stringify(item),
                      //             },
                      //           });
                      //         } else {
                      //           Alert.alert(
                      //             "Warning",
                      //             `This appointment is already ${item.status}`,
                      //             [
                      //               { text: "OK", onPress: () => { } }
                      //             ],
                      //             { cancelable: true }
                      //           )
                      //         }

                      //       }
                      //       }
                      //       key={item?._id}
                      //       style={{
                      //         flexDirection: "row",
                      //         justifyContent: "space-between",
                      //         alignItems: "center",
                      //         minHeight: verticalScale(75),
                      //         backgroundColor: "#fff",
                      //         marginBottom: verticalScale(10),
                      //         paddingInline: scale(15),
                      //         borderRadius: scale(10),
                      //       }}>

                      //       <View style={{
                      //         flexDirection: "row",
                      //         alignItems: "center",
                      //         gap: scale(10)
                      //       }}>
                      //         <View style={{
                      //           position: "relative"
                      //         }}>
                      //           <Image
                      //             style={{ height: scale(50), width: scale(50), borderRadius: moderateScale(30) }}
                      //             source={{ uri: item?.barberProfile?.[0]?.url }}
                      //             // placeholder={{ blurhash }}
                      //             contentFit="cover"
                      //             transition={300}
                      //           />
                      //         </View>


                      //         <View style={{ gap: verticalScale(8) }}>
                      //           <CustomText style={{ fontSize: scale(14) }}>{item?.barbername}</CustomText>

                      //           <View
                      //             style={{
                      //               height: verticalScale(15),
                      //               paddingHorizontal: scale(5),
                      //               borderRadius: scale(4),
                      //               backgroundColor: item.status === "served" ? "#00B0901A" :
                      //                 item.status === "upcoming" ? "#EAA8241A" : "#E11D481A",
                      //               justifyContent: "center",
                      //               alignItems: "center",
                      //               alignSelf: "flex-start"
                      //             }}
                      //           ><CustomText style={{
                      //             color: item.status === "served" ? "#00B090" :
                      //               item.status === "upcoming" ? "#EAA824" : "#E11D48",
                      //             fontSize: scale(10),
                      //           }}>{item.status}</CustomText></View>

                      //         </View>

                      //       </View>

                      //       <View style={{ gap: verticalScale(5) }}>
                      //         <View style={{
                      //           flexDirection: "row",
                      //           alignItems: "center",
                      //           gap: scale(2),
                      //           // flex: 1
                      //         }}>
                      //           <ClockIcon size={scale(12)} color='gray' />
                      //           <CustomText style={{ fontSize: scale(12), color: "gray" }}>{item?.timeSlots}</CustomText>
                      //         </View>

                      //         <CustomText style={{ fontSize: scale(14), fontFamily: "AirbnbCereal_W_Bd", textAlign: "center" }}>{item?.appointmentDate?.split("T")[0]}</CustomText>

                      //       </View>

                      //     </Pressable>
                      //   )
                      // })

                      <FlatList
                        data={appointmentListData?.data}
                        keyExtractor={(item) => item?._id}
                        contentContainerStyle={{ paddingBottom: verticalScale(20) }}
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
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              minHeight: verticalScale(75),
                              backgroundColor: "#fff",
                              marginBottom: verticalScale(10),
                              paddingHorizontal: scale(15),
                              borderRadius: scale(10),
                            }}
                          >
                            {/* Left section */}
                            <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
                              <View style={{ position: "relative" }}>
                                <Image
                                  style={{
                                    height: scale(50),
                                    width: scale(50),
                                    borderRadius: moderateScale(30),
                                  }}
                                  source={{ uri: item?.barberProfile?.[0]?.url }}
                                  contentFit="cover"
                                  transition={300}
                                />
                              </View>

                              <View style={{ gap: verticalScale(8) }}>
                                <CustomText style={{ fontSize: scale(14) }}>{item?.barbername}</CustomText>

                                <View
                                  style={{
                                    height: verticalScale(15),
                                    paddingHorizontal: scale(5),
                                    borderRadius: scale(4),
                                    backgroundColor:
                                      item.status === "served"
                                        ? "#00B0901A"
                                        : item.status === "upcoming"
                                          ? "#EAA8241A"
                                          : "#E11D481A",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignSelf: "flex-start",
                                  }}
                                >
                                  <CustomText
                                    style={{
                                      color:
                                        item.status === "served"
                                          ? "#00B090"
                                          : item.status === "upcoming"
                                            ? "#EAA824"
                                            : "#E11D48",
                                      fontSize: scale(10),
                                    }}
                                  >
                                    {item.status}
                                  </CustomText>
                                </View>
                              </View>
                            </View>

                            {/* Right section */}
                            <View style={{ gap: verticalScale(5) }}>
                              <View style={{ flexDirection: "row", alignItems: "center", gap: scale(2) }}>
                                <ClockIcon size={scale(12)} color="gray" />
                                <CustomText style={{ fontSize: scale(12), color: "gray" }}>
                                  {item?.timeSlots}
                                </CustomText>
                              </View>
                              <CustomText
                                style={{
                                  fontSize: scale(14),
                                  fontFamily: "AirbnbCereal_W_Bd",
                                  textAlign: "center",
                                }}
                              >
                                {item?.appointmentDate?.split("T")[0]}
                              </CustomText>
                            </View>
                          </Pressable>
                        )}

                      />
                    ) : (
                      <View style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: verticalScale(400)
                      }}>
                        <View
                          style={{
                            gap: verticalScale(12)
                          }}
                        >
                          <View
                            style={{
                              width: scale(60),
                              height: scale(60),
                              backgroundColor: colors.background,
                              marginHorizontal: "auto",
                              borderRadius: scale(50),
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            <CalendarIcon
                              color={colors.text}
                              size={scale(40)}
                            />
                          </View>
                          <CustomText
                            style={{
                              textAlign: "center",
                              fontSize: scale(16)
                            }}
                          >No Appointments Scheduled</CustomText>
                          <CustomSecondaryText
                            style={{
                              textAlign: "center"
                            }}
                          >You haven’t booked any appointments yet. Schedule your appointment today to ensure a convenient time that fits your schedule.</CustomSecondaryText>
                          {/* <Pressable
                            onPress={() => router.push("/appointmentCalendar")}
                            style={{
                              height: verticalScale(40),
                              paddingInline: scale(30),
                              backgroundColor: Colors.modeColor.colorCode,
                              marginHorizontal: "auto",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: scale(4),
                            }}
                          ><CustomText style={{
                            color: "#fff"
                          }}>Book Appointment</CustomText></Pressable> */}
                        </View>
                      </View>
                    )
                  }


                </View>
              );
            default:
              return null;
          }
        }}
        keyExtractor={item => item}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['black']}
            progressBackgroundColor={'#fff'}
          />
        }
      />
    </CustomTabView>
  )
}

export default appointment

const styles = StyleSheet.create({
  selectedTabBtn: {
    backgroundColor: Colors.modeColor.colorCode,
    paddingHorizontal: scale(10),
    height: verticalScale(30),
    borderRadius: scale(4),
    justifyContent: "center",
    alignItems: "center"
  },

  unSelectedTabBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: scale(10),
    height: verticalScale(30),
    borderRadius: scale(4),
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.modeColor.colorCode,
    borderWidth: scale(1)
  }
})