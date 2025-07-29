// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const appointmentSuccessPage = () => {
//   return (
//     <View>
//       <Text>appointmentSuccessPage</Text>
//     </View>
//   )
// }

// export default appointmentSuccessPage

// const styles = StyleSheet.create({})


import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef } from 'react'
import CustomText from '../../components/CustomText'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { usePreventRemove, useTheme } from '@react-navigation/native'
import { CheckIcon } from '../../constants/icons'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const AppointmentSuccessPage = () => {

    const router = useRouter()
    const { colors } = useTheme();
    const params = useLocalSearchParams();

    const LiveQueueNavigationRef = useRef(false);
    const homeNavigationRef = useRef(false);

    usePreventRemove(true, ({ data }) => {
        if (LiveQueueNavigationRef?.current && !homeNavigationRef?.current) {
            router.push("/appointment");
        } else if (!LiveQueueNavigationRef?.current && homeNavigationRef?.current) {
            router.push("/home");
        } else {
            // Block back action silently
        }
    });

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.background,
                padding: scale(10)
            }}
        >
            <View style={[styles.upcomingCard, { backgroundColor: colors.cardColor, borderColor: colors.cardBorder }]}>
                <View style={[styles.iconContainer, { backgroundColor: "rgba(13, 148, 136, 0.1)" }]}>
                    <CheckIcon size={scale(32)} color={"#14b8a6"} />
                </View>
                <CustomText style={styles.cardTitle}>{params.booked === "true" ? "Appointment Booked !" : "Appointment Updated !"}</CustomText>
                <CustomText style={[styles.cardSubtitle, { color: colors.secondaryText }]}>
                   {
                    params.booked === "true" ? ("You have successfully booked the appointment. You will be notified when it's your turn.") : ("You have successfully updated the appointment. You will be notified when it's your turn.")
                   } 
                </CustomText>
                <TouchableOpacity
                    onPress={() => {
                        LiveQueueNavigationRef.current = true;
                        homeNavigationRef.current = false
                        router.back();
                    }}
                    style={styles.bookButton}
                    activeOpacity={0.85}
                >
                    <CustomText style={styles.bookButtonText}>Go to Appointments</CustomText>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        LiveQueueNavigationRef.current = false;
                        homeNavigationRef.current = true
                        router.back();
                    }}
                >
                    <CustomText style={{ color: '#14b8a6', textAlign: "center", fontFamily: "AirbnbCereal_W_XBd" }}>Go back to home</CustomText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default AppointmentSuccessPage

const styles = StyleSheet.create({
    upcomingCard: {
        // backgroundColor: '#ffffff',
        borderRadius: scale(12),
        padding: scale(20),
        alignItems: 'center',
        // borderColor: '#e5e7eb',
        borderWidth: scale(1),
        gap: verticalScale(20),
        marginTop: verticalScale(40)
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
        // marginBottom: verticalScale(15), // mb-6
        alignItems: 'center',
        justifyContent: 'center'
    },
    bookButtonText: {
        color: '#fff', // text-white
        fontFamily: "AirbnbCereal_W_XBd",
        fontSize: scale(16),
    },

})