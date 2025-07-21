import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import CustomText from '../../../components/CustomText'
import { scale, verticalScale } from 'react-native-size-matters'
import { useRouter } from 'expo-router'
import { Colors } from '@/constants/Colors';
import { useTheme } from '@react-navigation/native'
import { ArrowLeftIcon } from '../../../constants/icons'

const termService = () => {

  const router = useRouter()
  const { colors } = useTheme()

  return (
    <ScrollView
      style={{
        flex: 1,
        // backgroundColor: "#00B0901A"
        backgroundColor: colors.background
      }}
      contentContainerStyle={{
        paddingTop: verticalScale(10),
        paddingHorizontal: scale(10),
        paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(20)
      }}
    >

      <View style={{
        flexDirection: "row",
        alignItems: "center",
      }}>
        <Pressable onPress={() => router.replace("/about")}><ArrowLeftIcon color={colors.text} /></Pressable>
        <CustomText style={{
          flex: 1,
          textAlign: "center",
          fontFamily: "AirbnbCereal_W_XBd",
        }}>Terms of Services</CustomText>
      </View>

      <View style={{
        backgroundColor: colors.cardColor,
        borderWidth: scale(1),
        borderColor: colors.queueBorder,
        padding: scale(12),
        borderRadius: scale(12),
        marginTop: verticalScale(20)
      }}>
        <CustomText style={styles.heading}>Welcome to our salon app!</CustomText>
        <CustomText style={styles.paragraph}>
          By using this app, you agree to the terms below.
        </CustomText>

        <CustomText style={styles.subHeading}>1. Using Our App</CustomText>
        <CustomText style={styles.bullet}>• Book appointments in advance</CustomText>
        <CustomText style={styles.bullet}>• Join the walk-in queue (single or group)</CustomText>
        <CustomText style={styles.bullet}>• Track your booking or queue status in real time</CustomText>
        <CustomText style={styles.paragraph}>
          Use the app responsibly and follow all salon rules.
        </CustomText>

        <CustomText style={styles.subHeading}>2. Bookings & Queue</CustomText>
        <CustomText style={styles.bullet}>• Choose your service, date, and time to book</CustomText>
        <CustomText style={styles.bullet}>• Join the queue as a single customer or with a group</CustomText>
        <CustomText style={styles.bullet}>• Estimated wait times may change based on salon flow</CustomText>

        <CustomText style={styles.subHeading}>3. Your Responsibility</CustomText>
        <CustomText style={styles.bullet}>• Provide correct info while booking or joining the queue</CustomText>
        <CustomText style={styles.bullet}>• Show up on time for appointments or queue turn</CustomText>
        <CustomText style={styles.bullet}>• Repeated no-shows may lead to restrictions</CustomText>

        <CustomText style={styles.subHeading}>4. Cancellations</CustomText>
        <CustomText style={styles.bullet}>• You can cancel or reschedule before your time</CustomText>
        <CustomText style={styles.bullet}>• For groups, cancel if you're not coming to avoid delays</CustomText>

        <CustomText style={styles.subHeading}>5. Your Privacy</CustomText>
        <CustomText style={styles.paragraph}>
          We protect your personal data and never share it without consent. See our <CustomText style={styles.italic}>Privacy Policy</CustomText> for more.
        </CustomText>

        <CustomText style={styles.subHeading}>6. Updates</CustomText>
        <CustomText style={styles.paragraph}>
          Terms may change. Keep using the app only if you agree with the latest version.
        </CustomText>

        <CustomText style={styles.subHeading}>7. Need Help?</CustomText>
        <CustomText style={styles.paragraph}>
          Contact us anytime from the app or at info@iqbook.io
        </CustomText>
      </View>

    </ScrollView>
  )
}

export default termService

const styles = StyleSheet.create({
  heading: {
    fontSize: scale(22),
    fontFamily: "AirbnbCereal_W_XBd",
    marginBottom: verticalScale(10),
  },
  subHeading: {
    fontSize: scale(18),
    fontFamily: "AirbnbCereal_W_XBd",
    marginTop: verticalScale(15),
    marginBottom: verticalScale(5),
  },
  paragraph: {
    // fontSize: scale(13),
    marginBottom: verticalScale(8),
    lineHeight: scale(18),
  },
  bullet: {
    // fontSize: scale(13),
    marginLeft: scale(10),
    marginBottom: verticalScale(5),
  },
  italic: {
    fontStyle: 'italic',
  },
  agreeButton: {
    marginTop: verticalScale(20),
    backgroundColor: Colors.modeColor.colorCode,
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
  }
})
