// import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
// import React from 'react';
// import CustomTabView from '../../../components/CustomTabView';
// import CustomText from '../../../components/CustomText';
// import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
// import { Colors } from '../../../constants/Colors';
// import { useTheme } from '@react-navigation/native';
// import AppointmentItem from '../../../components/AppointmentItem';
// import { router, useRouter } from 'expo-router';
// import { useGlobal } from '../../../context/GlobalContext'
// import CustomSecondaryText from '../../../components/CustomSecondaryText';

// const Appointment = () => {
//   const baseAppointData = {
//     CustomerName: "Tom Cruise",
//     barberName: "Korbyn Larson",
//     barberImage: "https://celebrity.edu/wp-content/uploads/2021/08/top-tips-to-be-a-successful-barber.jpg",
//     timeJoined: "15:30 - 15:40",
//     date: "May 01"
//   };

//   const appointData = Array.from({ length: 30 }, (_, index) => ({
//     id: index + 1,
//     ...baseAppointData,
//   }));

//   const { colors } = useTheme();
// const router = useRouter()
// const { setJoinModes, joinModes } = useGlobal();

//   return (
//     <CustomTabView style={{ justifyContent: "space-between", paddingVertical: verticalScale(0), paddingTop: verticalScale(10) }}>
//       <View style={{ flex: 1, paddingBottom: Platform.OS === 'ios' ? verticalScale(60) : 0 }}>
//         <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: verticalScale(6) }}>
//           <CustomText style={styles.title}>Scheduled Appointment</CustomText>
//           <View
//             style={{
//               width: moderateScale(28),
//               height: moderateScale(28),
//               borderRadius: moderateScale(20),
//               justifyContent: "center",
//               alignItems: "center",
//               backgroundColor: Colors.modeColor.colorCode2,

//             }}
//           ><CustomSecondaryText style={{ color: Colors.modeColor.colorCode }}>15</CustomSecondaryText></View>
//         </View>
//         <FlatList
//           data={appointData}
//           contentContainerStyle={styles.listContent}
//           renderItem={({ item }) => {
//             return (<AppointmentItem item={item} />)
//           }}
//           keyExtractor={item => item.id.toString()}
//           showsVerticalScrollIndicator={false}
//           ListFooterComponent={<View style={{ height: verticalScale(20) }} />}
//         />
//         <Pressable
//           onPress={() => {
//             setJoinModes((prev) => ({ ...prev, appointment: true, appointmentType: "Book" }))
//             router.push("/selectBarber")
//             // router.push("/appointmentCalender")
//           }}
//           style={[
//             styles.btn,
//             {
//               backgroundColor: Colors.modeColor.colorCode,
//               shadowColor: Colors.modeColor.colorCode,
//               marginBottom: Platform.OS === 'ios' ? verticalScale(20) : verticalScale(10),
//               marginTop: verticalScale(10)
//             }
//           ]}
//         >
//           <CustomText style={styles.btnText}>Book Appt</CustomText>
//         </Pressable>
//       </View>


//     </CustomTabView>
//   );

// };

// export default Appointment;

// const styles = StyleSheet.create({
//   title: {
//     fontFamily: "AirbnbCereal_W_Bd"
//   },
//   listContent: {
//     overflow: "visible",
//   },
//   btn: {
//     height: verticalScale(35),
//     borderRadius: scale(4),
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 4,
//   },
//   btnText: {
//     color: "#fff"
//   }
// });

import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CustomText from '../../../components/CustomText';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../../constants/Colors';
import { useRouter } from 'expo-router';
import { useGlobal } from '../../../context/GlobalContext';
import { Image } from 'expo-image';

const appointment = () => {

  const customPageData = [
    "header", "menubar", "list"
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

  return (
    <FlatList
      data={customPageData}
      contentContainerStyle={{
        gap: verticalScale(10),
        paddingHorizontal: scale(20)
      }}
      renderItem={({ item }) => {
        switch (item) {
          case 'header':
            return (
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                height: verticalScale(64),
              }}>
                <CustomText
                  style={{
                    fontSize: scale(16)
                  }}
                >Appointments</CustomText>
                <Pressable
                  onPress={() => {
                    setJoinModes((prev) => ({ ...prev, appointment: true, appointmentType: "Book" }))
                    router.push("/selectBarber")
                  }}
                  style={{
                    backgroundColor: Colors.modeColor.colorCode,
                    borderRadius: scale(8),
                    width: scale(160),
                    height: verticalScale(30),
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                ><CustomText
                  style={{
                    fontSize: scale(12),
                    color: "#fff"
                  }}
                >Book Appointment</CustomText></Pressable>
              </View >
            );
          case 'menubar':
            return (
              <View style={{
                // backgroundColor: "blue",
                height: verticalScale(30),
                flexDirection: "row",
                alignItems: "center",
                gap: scale(5)
              }}>
                {
                  tabs.map((item) => {
                    return (
                      <Pressable
                        onPress={() => setSelectedTab(item)}
                        key={item}
                        style={selectedTab === item ? styles.selectedTabBtn : styles.unSelectedTabBtn}
                      ><CustomText style={{ color: selectedTab === item ? "#fff" : Colors.modeColor.colorCode, fontSize: scale(12) }}>{item}</CustomText></Pressable>
                    )
                  })
                }

              </View>
            );
          case 'list':
            return (
              <View style={{
                flexGrow: 1
              }}>
                <View style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: verticalScale(85),
                  borderBottomColor: "#DDDDDD",
                  borderBottomWidth: scale(1)
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
                        style={{ height: scale(55), width: scale(55), borderRadius: moderateScale(30) }}
                        source={{ uri: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg" }}
                        // placeholder={{ blurhash }}
                        contentFit="cover"
                        transition={300}
                      />
                      <View
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
                      ><CustomText style={{ fontSize: scale(8), color: Colors.modeColor.colorCode}}>Upcoming</CustomText></View>
                    </View>


                    <View style={{ gap: verticalScale(8) }}>
                      <CustomText style={{ fontSize: scale(14) }}>Michael</CustomText>
                      <View style={{ paddingInline: scale(10) }}>
                        <CustomText style={{ color: "#78716C", fontSize: scale(12), fontFamily: "AirbnbCereal_W_Bk" }}>. Hair Cut</CustomText>
                        <CustomText style={{ color: "#78716C", fontSize: scale(12), fontFamily: "AirbnbCereal_W_Bk" }}>. Beard</CustomText>
                      </View>
                    </View>

                  </View>

                  <View style={{ gap: verticalScale(5) }}>
                    <CustomText style={{ fontSize: scale(14) }}>31 Mar, 2025</CustomText>
                    <CustomText style={{ color: "#78716C", fontSize: scale(12), fontFamily: "AirbnbCereal_W_Bk", marginLeft: "auto" }}>11:30 am</CustomText>
                  </View>

                </View>
              </View>
            );
          default:
            return null;
        }
      }}
      keyExtractor={item => item}
    />
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