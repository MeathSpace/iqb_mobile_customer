// import { Platform, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native'
// import React from 'react'
// import CustomText from '../../components/CustomText'
// import CustomSecondaryText from '../../components/CustomSecondaryText'
// import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
// import CustomView from '../../components/CustomView'
// import { useTheme } from '@react-navigation/native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { Image } from 'expo-image';
// import { CheckIcon, ClockIcon, ContactIcon, EmailIcon, MapIcon, WhatsappIcon } from '../../constants/icons';
// import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
// import { Colors } from '../../constants/Colors';
// import CustomTabView from '../../components/CustomTabView';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useGlobal } from '../../context/GlobalContext';

// const joinConfirmation = () => {

//   const { selectedBarber, selectedBarberServices, joinModes } = useGlobal();

//   const colorScheme = useColorScheme();
//   // const confirmationData = useLocalSearchParams();

//   // const selectedServices = JSON.parse(confirmationData.selectedServices)
//   // const selectBarber = JSON.parse(confirmationData.barber)

//   const { colors } = useTheme()
//   const router = useRouter()

// const darkMapStyle = [
//   {
//     "elementType": "geometry",
//     "stylers": [{ "color": "#1d2c4d" }]
//   },
//   {
//     "elementType": "labels.text.fill",
//     "stylers": [{ "color": "#ffffff" }]
//   },
//   {
//     "elementType": "labels.text.stroke",
//     "stylers": [{ "color": "#1d2c4d" }]
//   },
//   {
//     "featureType": "administrative",
//     "elementType": "geometry",
//     "stylers": [{ "color": "#1d2c4d" }]
//   },
//   {
//     "featureType": "poi",
//     "elementType": "geometry",
//     "stylers": [{ "color": "#283e6b" }]
//   },
//   {
//     "featureType": "poi",
//     "elementType": "labels.text.fill",
//     "stylers": [{ "color": "#ffffff" }]
//   },
//   {
//     "featureType": "road",
//     "elementType": "geometry",
//     "stylers": [{ "color": "#304a7d" }]
//   },
//   {
//     "featureType": "road",
//     "elementType": "labels.text.fill",
//     "stylers": [{ "color": "#98a5be" }]
//   },
//   {
//     "featureType": "transit",
//     "elementType": "geometry",
//     "stylers": [{ "color": "#2f3948" }]
//   },
//   {
//     "featureType": "water",
//     "elementType": "geometry",
//     "stylers": [{ "color": "#0f252e" }]
//   },
//   {
//     "featureType": "water",
//     "elementType": "labels.text.fill",
//     "stylers": [{ "color": "#ffffff" }]
//   }
// ];

//   // console.log("joinModes ", joinModes)

//   console.log("selectedBarber ", selectedBarber)
//   console.log("selectedBarberServices ", selectedBarberServices)

//   return (
//     <ScrollView
//       showsVerticalScrollIndicator={false}
//       style={{ flex: 1, backgroundColor: "#0BA3AD0D" }}
//       contentContainerStyle={{
//         flexGrow: 1,
//         paddingHorizontal: scale(15),
//         paddingVertical: Platform.OS === "ios" ? verticalScale(40) : verticalScale(15),
//         justifyContent: "space-between",
//       }}>
//       <View style={{ gap: verticalScale(15) }}>
//         <View style={{
//           width: moderateScale(70),
//           height: moderateScale(70),
//           justifyContent: "center",
//           alignItems: "center",
//           borderRadius: moderateScale(65),
//           backgroundColor: "#00B090",
//           // marginBottom: verticalScale(15),
//           marginHorizontal: "auto"
//         }}>
//           <CheckIcon
//             color={"#fff"} size={moderateScale(40)} />
//         </View>
//         <View style={{
//           gap: verticalScale(5),
//         }}>
//           <CustomText style={styles.heading}>
//             {joinModes.appointment ? "Review and confirm below" : "Yah! Good to see you here"}
//           </CustomText>

//           <CustomSecondaryText style={{ textAlign: "center", }}>
//             {joinModes.appointment ? "You'll be notified once your appointment is scheduled" : "You will be notified when your time arrives"}
//           </CustomSecondaryText>
//         </View>

//         <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
//           <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
//             <Image
//               style={{ height: moderateScale(55), width: moderateScale(55), borderRadius: moderateScale(30) }}
//               source={{ uri: selectedBarber.image }}
//               // placeholder={{ blurhash }}
//               contentFit="cover"
//               transition={300}
//             />
//             <CustomText>{selectedBarber.name}</CustomText>
//           </View>

//           <View style={[styles.cardContent, {
//             // borderTopColor: colors.border 
//           }]}>
//             <View style={{ gap: scale(6) }}>
//               {
//                 selectedBarberServices.map((ele, index) => {
//                   return (
//                     <CustomSecondaryText key={index}>{index + 1}. {ele.serviceName}</CustomSecondaryText>
//                   )
//                 })
//               }
//             </View>
//             <View style={{ gap: scale(6) }}>
//               <CustomText style={{ textAlign: "center", fontSize: moderateScale(18) }}>$ {selectedBarberServices.reduce((acc, item) => acc + item.servicePrice, 0)}</CustomText>
//               <View style={{ flexDirection: "row", alignItems: "center", gap: scale(5), }}>
//                 <ClockIcon size={moderateScale(14)} color={colors.secondaryText} />
//                 {
//                   joinModes.appointment ? (
//                     <CustomSecondaryText style={{ fontSize: scale(9.16) }}>12:30 AM - 2:30 PM</CustomSecondaryText>
//                   ) : (
//                     <CustomSecondaryText style={{ fontSize: scale(9.16) }}> {selectedBarberServices.reduce((acc, item) => acc + item.barberServiceEWT, 0)} mins</CustomSecondaryText>
//                   )
//                 }

//               </View>
//             </View>
//           </View>

//           {
//             joinModes.appointment && (
//               <View
//                 style={[styles.appointmentCardContent, { borderTopColor: colors.border }]}
//               >
//                 <CustomText
//                   style={{
//                     fontSize: scale(9.16)
//                   }}
//                 >Hi! I’d like a quick haircut and beard trim. Please keep the sides short and tidy, and leave a bit of length on top. Looking forward to it!</CustomText>
//               </View>
//             )
//           }
//         </View>

//         {/* <View
//           style={{
//             borderRadius: scale(16),
//             overflow: 'hidden',
//           }}
//         >
//           <MapView
//             provider={PROVIDER_GOOGLE}
//             initialCamera={{
//               center: {
//                 latitude: 37.78825,
//                 longitude: -122.4324,
//               },
//               zoom: 15,
//               pitch: 0,
//               heading: 0,
//             }}
//             scrollEnabled={false}
//             zoomEnabled={false}
//             rotateEnabled={false}
//             pitchEnabled={false}
//             style={[styles.map]} // no border here
//             customMapStyle={colorScheme === "dark" ? darkMapStyle : []}
//           />
//         </View> */}

//         <View
//           style={{
//             backgroundColor: "#00B0901A",
//             borderRadius: scale(4),
//             padding: scale(10),
//             gap: verticalScale(5),
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "space-between"
//           }}
//         >

//           <View>
//             <CustomText
//               style={{
//                 fontFamily: "AirbnbCereal_W_Bd",
//               }}
//             >Contact Us</CustomText>

//             <CustomText
//               style={{
//                 fontSize: scale(14),
//                 color: "gray"
//               }}
//             >
//               If you have any questions
//             </CustomText>
//           </View>

//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               gap: scale(10)
//             }}
//           >
//             <Pressable
//               style={{
//                 width: scale(30),
//                 height: scale(30),
//                 backgroundColor: colors.background,
//                 justifyContent: "center",
//                 alignItems: "center",
//                 borderRadius: scale(4)
//               }}
//             >
//               <ContactIcon size={scale(18)} color={"#4285F4"} />
//             </Pressable>

//             <Pressable
//               style={{
//                 width: scale(30),
//                 height: scale(30),
//                 backgroundColor: colors.background,
//                 justifyContent: "center",
//                 alignItems: "center",
//                 borderRadius: scale(4)
//               }}
//             >
//               <WhatsappIcon size={scale(18)} color={"#25D366"} />
//             </Pressable>

//             <Pressable
//               style={{
//                 width: scale(30),
//                 height: scale(30),
//                 backgroundColor: colors.background,
//                 justifyContent: "center",
//                 alignItems: "center",
//                 borderRadius: scale(4)
//               }}
//             >
//               <EmailIcon size={scale(18)} color={"#EA4335"} />
//             </Pressable>

//           </View>

//         </View>

//         <View>
//           <MapView
//             provider={PROVIDER_GOOGLE}
//             initialCamera={{
//               center: {
//                 latitude: 37.78825,
//                 longitude: -122.4324,
//               },
//               zoom: 15, // 0 (world view) to ~20 (very close)
//               pitch: 0,
//               heading: 0,
//             }}
//             scrollEnabled={false}
//             zoomEnabled={false}
//             rotateEnabled={false}
//             pitchEnabled={false}
//             style={[styles.map,
//             {
//               // borderColor: "#efefef", 
//               // borderWidth: scale(1) 
//             }
//             ]}
//             customMapStyle={colorScheme === "dark" ? darkMapStyle : []}
//           />
//           <View
//             style={{
//               backgroundColor: "#0BA3AD1A",
//               borderBottomLeftRadius: scale(4),
//               borderBottomRightRadius: scale(4),
//               padding: scale(10),
//               gap: verticalScale(5),
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "space-between"
//             }}
//           >

//             <View>
//               <CustomText
//                 style={{
//                   fontFamily: "AirbnbCereal_W_Bd",
//                 }}
//               >Location</CustomText>

//               <CustomText
//                 style={{
//                   fontSize: scale(14),
//                   color: "gray",
//                   maxWidth: "85%"
//                 }}
//               >
//                 30 Elliot Rd, Selly Oak, Birmingham, UK, B29 4AQ
//               </CustomText>
//             </View>

//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 gap: scale(10),
//                 flex: 1
//               }}
//             >
//               <Pressable
//                 style={{
//                   width: scale(30),
//                   height: scale(30),
//                   backgroundColor: colors.background,
//                   justifyContent: "center",
//                   alignItems: "center",
//                   borderRadius: scale(4)
//                 }}
//               >
//                 <MapIcon size={scale(18)} color={"#fbbf24"} />
//               </Pressable>

//             </View>

//           </View>
//         </View>

//         {/* <View style={[styles.addressContainer, { backgroundColor: colors.background }]}>
//           <CustomText style={styles.addressText}>
//             30 Elliot Rd, Selly Oak, Birmingham, UK, B29 4AQ
//           </CustomText>
//           <View style={styles.iconContainer}>
//             <Pressable style={[styles.iconButton, { backgroundColor: colorScheme === "dark" ? "#0f0f0f" : "#f0f0f0" }]}>
//               <ContactIcon color={colors.text} />
//             </Pressable>
//             <Pressable style={[styles.iconButton, { backgroundColor: colorScheme === "dark" ? "#151718" : "#f0f0f0" }]}>
//               <MapIcon color={colors.text} />
//             </Pressable>
//           </View>
//         </View> */}

//       </View>


//       <View style={{
//         flexDirection: "row",
//         alignItems: "center",
//         gap: scale(10)
//       }}>
//         <Pressable
//           onPress={() => {
//             router.push("/queuelist")
//           }}
//           style={[styles.btn, { backgroundColor: "#E11D481A" }]}>
//           <CustomText style={{ color: "#E11D48" }}>Cancel</CustomText>
//         </Pressable>

//         <Pressable
//           onPress={() => {
//             if (joinModes.appointment) {
//               router.push("/appointment")
//             } else {
//               router.push("/queuelist")
//             }
//           }}
//           style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>
//           <CustomText style={{ color: "#fff" }}>Confirm</CustomText>
//         </Pressable>

//       </View>

//     </ScrollView>
//   )
// }

// export default joinConfirmation

// const styles = StyleSheet.create({
//   heading: {
//     fontFamily: "AirbnbCereal_W_Blk",
//     fontSize: moderateScale(20),
//     // marginBottom: verticalScale(20),
//     textAlign: "center"
//   },

//   card: {
//     // borderWidth: scale(1),
//     // marginVertical: verticalScale(20),
//     borderRadius: moderateScale(4),
//     padding: moderateScale(10),
//     marginHorizontal: scale(5),


//     // elevation: 3,
//     // shadowColor: '#000',
//     // shadowOffset: { width: 0, height: 2 },
//     // shadowOpacity: 0.2,
//     // shadowRadius: 4,
//   },
//   cardContent: {
//     borderTopWidth: moderateScale(1),
//     // marginTop: verticalScale(10),
//     paddingTop: verticalScale(10),
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between"
//   },
//   appointmentCardContent: {
//     borderTopWidth: moderateScale(1),
//     // marginTop: verticalScale(10),
//     paddingTop: verticalScale(10),
//   },

//   map: {
//     width: "100%",
//     height: verticalScale(150),
//     marginHorizontal: scale(5),
//   },

//   addressContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between", // Ensure spacing between text and icons
//     padding: scale(10),
//     borderRadius: scale(8),
//     // marginTop: verticalScale(10),
//     marginHorizontal: scale(5),
//     gap: scale(10)
//   },
//   addressText: {
//     flex: 1,
//     fontSize: scale(12),
//     fontFamily: "AirbnbCereal_W_Bk"
//   },
//   iconContainer: {
//     flexDirection: "row",
//     gap: scale(10),
//   },
//   iconButton: {
//     padding: scale(6),
//     borderRadius: scale(6),
//     // backgroundColor: "#f0f0f0",
//   },

//   btn: {
//     width: "48%",
//     height: verticalScale(40),
//     borderRadius: scale(8),
//     alignItems: "center",
//     justifyContent: "center",
//     marginBlock: verticalScale(0),
//     marginTop: verticalScale(20),
//     marginBottom: verticalScale(40),
//     marginInline: "auto"
//   },

// })


import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useState } from 'react'
import CustomText from '../../components/CustomText'
import CustomSecondaryText from '../../components/CustomSecondaryText'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CustomView from '../../components/CustomView'
import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { CheckIcon, ClockIcon, ContactIcon, EmailIcon, MapIcon, WhatsappIcon } from '../../constants/icons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors } from '../../constants/Colors';
import { Toast } from 'toastify-react-native'
import CustomTabView from '../../components/CustomTabView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobal } from '../../context/GlobalContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';

const joinConfirmation = () => {

  const { colors } = useTheme()
  const { authenticatedUser } = useAuth()
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();
  const router = useRouter()

  const selectedCustomerBarberParse = JSON.parse(params?.selectedCustomerBarber)
  const selectCustomerServicesParse = JSON.parse(params?.selectCustomerServices)

  // console.log("selectedCustomerBarberParse ddd ", selectedCustomerBarberParse)

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

  const [singleJoinLoader, setSingleJoinLoader] = useState(false)

  const singleJoinPressed = async () => {
    try {
      const singleJoinData = {
        salonId: authenticatedUser?.salonId,
        name: authenticatedUser?.name,
        customerEmail: authenticatedUser?.email,
        joinedQType: "Single-Join",
        methodUsed: "App",
        mobileCountryCode: authenticatedUser?.mobileCountryCode,
        mobileNumber: authenticatedUser?.mobileNumber.toString(),
        barberName: selectedCustomerBarberParse?.name,
        barberId: selectedCustomerBarberParse?.barberId,
        services: selectCustomerServicesParse
      }

      setSingleJoinLoader(true)

      const { data } = await axios.post(`${BASE_URL}/mobileRoutes/singleJoinQueue`, singleJoinData)

      Toast.success(data?.message)
      setSingleJoinLoader(false)
      router.replace("/queuelist")

    } catch (error) {

      setSingleJoinLoader(false)
      Toast.error(error?.response?.data?.message)
      console.log("Error doing single join ", error)
    }
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: scale(15),
        paddingVertical: Platform.OS === "ios" ? verticalScale(40) : verticalScale(15),
        justifyContent: "space-between",
      }}>
      <View style={{ gap: verticalScale(15) }}>
        <View style={{
          width: moderateScale(70),
          height: moderateScale(70),
          justifyContent: "center",
          alignItems: "center",
          borderRadius: moderateScale(65),
          backgroundColor: "#00B090",
          // marginBottom: verticalScale(15),
          marginHorizontal: "auto"
        }}>
          <CheckIcon
            color={"#fff"} size={moderateScale(40)} />
        </View>
        <View style={{
          gap: verticalScale(5),
        }}>
          <CustomText style={styles.heading}>
            {params?.appointment ? "Review and confirm below" : "Yah! Good to see you here"}
          </CustomText>

          <CustomSecondaryText style={{ textAlign: "center", }}>
            {params?.appointment ? "You'll be notified once your appointment is scheduled" : "You will be notified when your time arrives"}
          </CustomSecondaryText>
        </View>

        <View style={[styles.card, { backgroundColor: "#0BA3AD1A", borderColor: colors.border }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
            <Image
              style={{ height: moderateScale(55), width: moderateScale(55), borderRadius: moderateScale(30) }}
              source={{ uri: selectedCustomerBarberParse?.profile?.[0]?.url }}
              // placeholder={{ blurhash }}
              contentFit="cover"
              transition={300}
            />
            <CustomText>{selectedCustomerBarberParse?.name}</CustomText>
          </View>

          <View style={[styles.cardContent, {
            // borderTopColor: colors.border 
          }]}>
            <View style={{ gap: scale(6) }}>
              {
                selectCustomerServicesParse?.map((ele, index) => {
                  return (
                    <CustomSecondaryText key={ele?.serviceId}>{index + 1}. {ele.serviceName}</CustomSecondaryText>
                  )
                })
              }
            </View>
            <View style={{ gap: scale(6) }}>
              <CustomText style={{ textAlign: "center", fontSize: moderateScale(18) }}>$ {selectCustomerServicesParse.reduce((acc, item) => acc + item.servicePrice, 0)}</CustomText>
              <View style={{ flexDirection: "row", alignItems: "center", gap: scale(5), }}>
                <ClockIcon size={moderateScale(14)} color={colors.secondaryText} />
                {
                  params?.join ? (
                    <CustomSecondaryText style={{ fontSize: scale(12) }}> {selectCustomerServicesParse.reduce((acc, item) => acc + item.serviceEWT, 0)} mins</CustomSecondaryText>
                  ) : (
                    <CustomSecondaryText style={{ fontSize: scale(12) }}>12:30 AM - 2:30 PM</CustomSecondaryText>
                  )
                }

              </View>
            </View>
          </View>

          {
            !params?.join && (
              <View
                style={[styles.appointmentCardContent, { borderTopColor: colors.border }]}
              >
                <CustomText
                  style={{
                    fontSize: scale(9.16)
                  }}
                >Hi! I’d like a quick haircut and beard trim. Please keep the sides short and tidy, and leave a bit of length on top. Looking forward to it!</CustomText>
              </View>
            )
          }
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

      </View>


      <View style={{
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10)
      }}>
        <Pressable
          onPress={() => {
            router.push("/queuelist")
          }}
          style={[styles.btn, { backgroundColor: "#E11D481A" }]}>
          <CustomText style={{ color: "#E11D48" }}>Cancel</CustomText>
        </Pressable>

        <Pressable
          // onPress={() => {
          //   if (params?.appointment) {
          //     router.push("/appointment")
          //   } else {
          //     router.push("/queuelist")
          //   }
          // }}

          onPress={singleJoinPressed}
          style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>
          {
            singleJoinLoader ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <CustomText style={{ color: "#fff" }}>Confirm</CustomText>
            )
          }
        </Pressable>

      </View>

    </ScrollView>
  )
}

export default joinConfirmation

const styles = StyleSheet.create({
  heading: {
    fontFamily: "AirbnbCereal_W_Blk",
    fontSize: moderateScale(20),
    textAlign: "center"
  },

  card: {
    borderRadius: moderateScale(4),
    padding: moderateScale(10),
    marginHorizontal: scale(5),
  },
  cardContent: {
    // borderTopWidth: moderateScale(1),
    paddingTop: verticalScale(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  appointmentCardContent: {
    borderTopWidth: moderateScale(1),
    paddingTop: verticalScale(10),
  },

  map: {
    width: "100%",
    height: verticalScale(150),
    marginHorizontal: scale(5),
  },

  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(10),
    borderRadius: scale(8),
    marginHorizontal: scale(5),
    gap: scale(10)
  },
  addressText: {
    flex: 1,
    fontSize: scale(12),
    fontFamily: "AirbnbCereal_W_Bk"
  },
  iconContainer: {
    flexDirection: "row",
    gap: scale(10),
  },
  iconButton: {
    padding: scale(6),
    borderRadius: scale(6),
  },

  btn: {
    width: "48%",
    height: verticalScale(40),
    borderRadius: scale(8),
    alignItems: "center",
    justifyContent: "center",
    marginBlock: verticalScale(0),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(40),
    marginInline: "auto"
  },

})