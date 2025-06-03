import { Platform, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import CustomText from '../../../components/CustomText'
import CustomSecondaryText from '../../../components/CustomSecondaryText'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CustomView from '../../../components/CustomView'
import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { CheckIcon, ClockIcon, ContactIcon, MapIcon } from '../../../constants/icons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors } from '../../../constants/Colors';
import CustomTabView from '../../../components/CustomTabView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobal } from '../../../context/GlobalContext';

const joinConfirmation = () => {

  const { selectedBarber, selectedBarberServices, joinModes } = useGlobal();

  const colorScheme = useColorScheme();
  // const confirmationData = useLocalSearchParams();

  // const selectedServices = JSON.parse(confirmationData.selectedServices)
  // const selectBarber = JSON.parse(confirmationData.barber)

  const { colors } = useTheme()
  const router = useRouter()

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

  // console.log("joinModes ", joinModes)

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: "#f7f7f7" }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: scale(15),
        paddingVertical: Platform.OS === "ios" ? verticalScale(60) : verticalScale(15),
        justifyContent: "space-between",
      }}>
      <View style={{ gap: verticalScale(20) }}>
        <View style={{
          width: moderateScale(90),
          height: moderateScale(90),
          justifyContent: "center",
          alignItems: "center",
          borderRadius: moderateScale(65),
          backgroundColor: "#fff",
          // marginBottom: verticalScale(15),
          marginHorizontal: "auto"
        }}>
          <CheckIcon
            color={"#00A36C"} size={moderateScale(45)} />
        </View>
        <View>
          <CustomText style={styles.heading}>
            {joinModes.appointment ? "Review and confirm below" : "Yah! Good to see you here"}
          </CustomText>

          <CustomSecondaryText style={{ textAlign: "center", fontFamily: "AirbnbCereal_W_Bk" }}>
            {joinModes.appointment ? "You'll be notified once your appointment is scheduled" : "You will be notified when your time arrives"}
          </CustomSecondaryText>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
            <Image
              style={{ height: moderateScale(55), width: moderateScale(55), borderRadius: moderateScale(30) }}
              source={{ uri: selectedBarber.image }}
              // placeholder={{ blurhash }}
              contentFit="cover"
              transition={300}
            />
            <CustomText>{selectedBarber.name}</CustomText>
          </View>

          <View style={[styles.cardContent, {
            // borderTopColor: colors.border 
          }]}>
            <View style={{ gap: scale(6) }}>
              {
                selectedBarberServices.map((ele, index) => {
                  return (
                    <CustomSecondaryText key={index}>{index + 1}. {ele.serviceName}</CustomSecondaryText>
                  )
                })
              }
            </View>
            <View style={{ gap: scale(6) }}>
              <CustomText style={{ textAlign: "center", fontSize: moderateScale(18) }}>$ {selectedBarberServices.reduce((acc, item) => acc + item.servicePrice, 0)}</CustomText>
              <View style={{ flexDirection: "row", alignItems: "center", gap: scale(5), }}>
                <ClockIcon size={moderateScale(14)} color={colors.secondaryText} />
                {
                  joinModes.appointment ? (
                    <CustomSecondaryText style={{ fontSize: scale(9.16) }}>12:30 AM - 2:30 PM</CustomSecondaryText>
                  ) : (
                    <CustomSecondaryText style={{ fontSize: scale(9.16) }}> {selectedBarberServices.reduce((acc, item) => acc + item.barberServiceEWT, 0)} mins</CustomSecondaryText>
                  )
                }

              </View>
            </View>
          </View>

          {
            joinModes.appointment && (
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
            borderRadius: scale(16),
            overflow: 'hidden',
          }}
        >
          <MapView
            provider={PROVIDER_GOOGLE}
            initialCamera={{
              center: {
                latitude: 37.78825,
                longitude: -122.4324,
              },
              zoom: 15,
              pitch: 0,
              heading: 0,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            style={[styles.map]} // no border here
            customMapStyle={colorScheme === "dark" ? darkMapStyle : []}
          />
        </View>

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
        </View>
      </View>


      <Pressable
        onPress={() => {
          if (joinModes.appointment) {
            router.push("/appointment")
          } else {
            router.push("/queuelist")
          }
        }}
        style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>
        <CustomText style={{ color: "#fff", fontSize: scale(12) }}>Confirm</CustomText>
      </Pressable>
    </ScrollView>
  )
}

export default joinConfirmation

const styles = StyleSheet.create({
  heading: {
    // fontFamily: "AirbnbCereal_W_Bd",
    fontSize: moderateScale(20),
    marginBottom: verticalScale(20),
    textAlign: "center"
  },

  card: {
    // borderWidth: scale(1),
    // marginVertical: verticalScale(20),
    borderRadius: moderateScale(4),
    padding: moderateScale(10),
    marginHorizontal: scale(5),


    // elevation: 3,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
  },
  cardContent: {
    borderTopWidth: moderateScale(1),
    // marginTop: verticalScale(10),
    paddingTop: verticalScale(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  appointmentCardContent: {
    borderTopWidth: moderateScale(1),
    // marginTop: verticalScale(10),
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
    justifyContent: "space-between", // Ensure spacing between text and icons
    padding: scale(10),
    borderRadius: scale(8),
    // marginTop: verticalScale(10),
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
    // backgroundColor: "#f0f0f0",
  },

  btn: {
    width: scale(206),
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