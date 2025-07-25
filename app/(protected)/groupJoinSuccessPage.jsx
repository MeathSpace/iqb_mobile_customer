// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const groupJoinSuccessPage = () => {
//   return (
//     <View>
//       <Text>groupJoinSuccessPage</Text>
//     </View>
//   )
// }

// export default groupJoinSuccessPage

// const styles = StyleSheet.create({})



import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomText from '../../components/CustomText'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@react-navigation/native'
import { CheckIcon } from '../../constants/icons'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const GroupJoinSuccessPage = () => {

    const router = useRouter()
    const { colors } = useTheme();

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
                <CustomText style={styles.cardTitle}>Queue Joined!</CustomText>
                <CustomText style={[styles.cardSubtitle, { color: colors.secondaryText }]}>
                    Your group has successfully joined the queue.
                </CustomText>
                <TouchableOpacity
                    onPress={() => router.dismissTo("/queuelist")}
                    style={styles.bookButton}
                    activeOpacity={0.85}
                >
                    <CustomText style={styles.bookButtonText}>Go to Live Queue</CustomText>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.dismissTo("/home")}>
                    <CustomText style={{ color: '#14b8a6', textAlign: "center", fontFamily: "AirbnbCereal_W_XBd" }}>Go back to home</CustomText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default GroupJoinSuccessPage

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