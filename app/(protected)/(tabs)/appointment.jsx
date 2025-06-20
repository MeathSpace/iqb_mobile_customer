import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CustomText from '../../../components/CustomText';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../../constants/Colors';
import { useRouter } from 'expo-router';
import { useGlobal } from '../../../context/GlobalContext';
import { Image } from 'expo-image';
import { ClockIcon, FilterIcon } from '../../../constants/icons';
import CustomTabView from '../../../components/CustomTabView';

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
  const { setJoinModes, joinModes } = useGlobal();

  const appData = [
    {
      type: "upcomming",
      backgroundColor: "#EAA8241A",
      color: "#EAA824"
    },
    {
      type: "served",
      backgroundColor: "#00B0901A",
      color: "#00B090"
    },
    {
      type: "cancelled",
      backgroundColor: "#E11D481A",
      color: "#E11D48"
    },

    {
      type: "upcomming",
      backgroundColor: "#EAA8241A",
      color: "#EAA824"
    },
    {
      type: "served",
      backgroundColor: "#00B0901A",
      color: "#00B090"
    },
    {
      type: "cancelled",
      backgroundColor: "#E11D481A",
      color: "#E11D48"
    },

    {
      type: "upcomming",
      backgroundColor: "#EAA8241A",
      color: "#EAA824"
    },
    {
      type: "served",
      backgroundColor: "#00B0901A",
      color: "#00B090"
    },
    {
      type: "cancelled",
      backgroundColor: "#E11D481A",
      color: "#E11D48"
    },
  ]

  return (
    <CustomTabView
      style={{
        paddingHorizontal: scale(0),
        paddingTop: verticalScale(0),
      }}
    >
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

            case 'header':
              return (
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: scale(10)
                }}>
                  <Pressable
                    style={{
                      height: verticalScale(40),
                      flex: 1,
                      backgroundColor: Colors.modeColor.colorCode,
                      marginHorizontal: "auto",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: scale(4),
                      marginTop: verticalScale(10)
                    }}
                    onPress={() => {
                      setJoinModes((prev) => ({ ...prev, appointment: true, appointmentType: "Book" }))
                      router.push("/appointmentCalendar")
                      // router.push("/appointmentCalender")
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
                      marginTop: verticalScale(10)
                    }}
                  >
                    <FilterIcon color={Colors.modeColor.colorCode} />
                  </Pressable>
                </View>
              )

            case 'list':
              return (
                <View style={{
                  flexGrow: 1
                }}>
                  {
                    appData.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            minHeight: verticalScale(75),
                            // borderBottomColor: appData.length - 1 !== index && "#0BA3AD1A",
                            // borderBottomWidth: appData.length - 1 !== index && scale(1)
                          }}>

                          <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: scale(10)
                          }}>
                            <View style={{
                              position: "relative"
                            }}>
                              <Image
                                style={{ height: scale(50), width: scale(50), borderRadius: moderateScale(30) }}
                                source={{ uri: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg" }}
                                // placeholder={{ blurhash }}
                                contentFit="cover"
                                transition={300}
                              />
                              {/* <View
                              style={{
                                position: "absolute",
                                bottom: verticalScale(-5),
                                right: scale(-15),
                                height: verticalScale(12),
                                paddingInline: scale(3),
                                backgroundColor: "#fff",
                                borderRadius: scale(20),
                                borderColor: Colors.modeColor.colorCode,
                                borderWidth: scale(1),
                                justifyContent: "center",
                                alignItems: "center"
                              }}
                            >
                              <CustomText style={{ fontSize: scale(8), color: Colors.modeColor.colorCode }}>Upcoming</CustomText>
                            </View> */}
                            </View>


                            <View style={{ gap: verticalScale(8) }}>
                              <CustomText style={{ fontSize: scale(14) }}>Michael Swath</CustomText>
                              <View
                                style={{
                                  height: verticalScale(15),
                                  paddingHorizontal: scale(5),
                                  borderRadius: scale(4),
                                  backgroundColor: item.backgroundColor,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  alignSelf: "flex-start"
                                }}
                              ><CustomText style={{
                                color: item.color,
                                fontSize: scale(10),
                              }}>{item.type}</CustomText></View>
                            </View>

                          </View>

                          <View style={{ gap: verticalScale(5) }}>
                            <View style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: scale(2),
                              // flex: 1
                            }}>
                              <ClockIcon size={scale(12)} color='gray' />
                              <CustomText style={{ fontSize: scale(12), color: "gray" }}>11:00 AM</CustomText>
                            </View>

                            <CustomText style={{ fontSize: scale(14), fontFamily: "AirbnbCereal_W_Bd" }}>31 Mar, 2025</CustomText>

                          </View>

                        </View>
                      )
                    })
                  }

                </View>
              );
            default:
              return null;
          }
        }}
        keyExtractor={item => item}
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