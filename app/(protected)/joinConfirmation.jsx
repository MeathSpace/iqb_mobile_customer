import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import CustomText from '../../components/CustomText'
import CustomSecondaryText from '../../components/CustomSecondaryText'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CustomView from '../../components/CustomView'
import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { CheckIcon, ClockIcon, ContactIcon, MapIcon } from '../../constants/icons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors } from '../../constants/Colors';
import CustomTabView from '../../components/CustomTabView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobal } from '../../context/GlobalContext';

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

  console.log("joinModes ", joinModes)

  return (
    <SafeAreaView style={{
      flex: 1,
      paddingHorizontal: scale(15),
      paddingVertical: verticalScale(15),
    }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}>
        <View>
          <View style={{
            width: moderateScale(50),
            height: moderateScale(50),
            justifyContent: "center",
            alignItems: "center",
            borderRadius: moderateScale(25),
            backgroundColor: "#00A36C",
            marginBottom: verticalScale(15),
            marginHorizontal: "auto"
          }}>
            <CheckIcon
              color={"#fff"} size={moderateScale(26)} />
          </View>
          <View>
            <CustomText style={styles.heading}>
              {joinModes.appointment ? "Review and confirm below" : "Yay! Good to see you here"}
            </CustomText>

            <CustomSecondaryText style={{ textAlign: "center" }}>
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

            <View style={[styles.cardContent, { borderTopColor: colors.border }]}>
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
                <CustomText style={{ textAlign: "center", fontSize: moderateScale(20) }}>$ {selectedBarberServices.reduce((acc, item) => acc + item.servicePrice, 0)}</CustomText>
                <View style={{ flexDirection: "row", alignItems: "center", gap: scale(5), }}>
                  <ClockIcon size={moderateScale(14)} color={colors.secondaryText} />
                  {
                    joinModes.appointment ? (
                      <CustomSecondaryText>12:30 AM - 2:30 PM</CustomSecondaryText>
                    ) : (
                      <CustomSecondaryText> {selectedBarberServices.reduce((acc, item) => acc + item.barberServiceEWT, 0)} mins</CustomSecondaryText>
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
                  <CustomText>Hi! I’d like a quick haircut and beard trim. Please keep the sides short and tidy, and leave a bit of length on top. Looking forward to it!</CustomText>
                </View>
              )
            }
          </View>

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
            style={[styles.map, { borderColor: colors.border, borderWidth: scale(1) }]}
            customMapStyle={colorScheme === "dark" ? darkMapStyle : []}
          />
          <View style={[styles.addressContainer, { backgroundColor: colors.background }]}>
            <CustomText style={styles.addressText}>
              221B Baker Street, London, NW1 6XE, United Kingdom
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
          style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>
          <CustomText style={{ color: "#fff" }}>{joinModes.appointment ? "Confirm & Book" : "Done"}</CustomText>
        </Pressable>
      </ScrollView>
    </SafeAreaView >
  )
}

export default joinConfirmation

const styles = StyleSheet.create({
  heading: {
    fontFamily: "AirbnbCereal_W_Bd",
    fontSize: moderateScale(22),
    marginBottom: verticalScale(10),
    textAlign: "center"
  },

  card: {
    borderWidth: scale(1),
    marginVertical: verticalScale(20),
    borderRadius: moderateScale(4),
    padding: moderateScale(10),
    marginHorizontal: scale(5),


    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardContent: {
    borderTopWidth: moderateScale(1),
    marginTop: verticalScale(10),
    paddingTop: verticalScale(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  appointmentCardContent: {
    borderTopWidth: moderateScale(1),
    marginTop: verticalScale(10),
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
    borderRadius: scale(4),
    marginTop: verticalScale(10),
    marginHorizontal: scale(5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
    elevation: 2,
  },
  addressText: {
    flex: 1,
    fontSize: scale(12),
    fontFamily: "AirbnbCereal_W_Md"
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
    height: verticalScale(40),
    borderRadius: scale(4),
    alignItems: "center",
    justifyContent: "center",
    marginBlock: verticalScale(0),
    marginTop: verticalScale(20),
  },

})