import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import CustomTabView from '../../../components/CustomTabView'
import CustomText from '../../../components/CustomText'
import { scale, verticalScale } from 'react-native-size-matters'
import { ArrowLeftIcon } from '../../../constants/icons'
import { useRouter } from 'expo-router'
import { useTheme } from '@react-navigation/native'

const privacyPolicy = () => {

  const router = useRouter()
  const { colors } = useTheme()

  return (
    <View
      style={{
        // backgroundColor: "#00B0901A",
        backgroundColor: colors.background,
        flex: 1,
        paddingVertical: verticalScale(0),
        paddingTop: verticalScale(10),
        paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(20),
      }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <CustomText style={styles.heading}>Privacy Policy</CustomText>

        <CustomText style={styles.paragraph}>
          Thank you for choosing to be part of our community at Iqbook. We are committed to protecting your personal information and your right to privacy.
        </CustomText>

        <CustomText style={styles.paragraph}>
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our <CustomText style={styles.italic}>salon mobile application</CustomText>, including features such as appointment booking, queue management (single or group), notifications, and user profile management.
        </CustomText>

        <CustomText style={styles.paragraph}>
          By using the app, you agree to the terms outlined in this policy.
        </CustomText>

        <CustomText style={styles.subHeading}>1. Information We Collect</CustomText>
        <CustomText style={styles.paragraph}>We may collect the following information when you use our app:</CustomText>

        <CustomText style={styles.bold}>a) Personal Information</CustomText>
        <CustomText style={styles.bullet}>• Name</CustomText>
        <CustomText style={styles.bullet}>• Phone number</CustomText>
        <CustomText style={styles.bullet}>• Email address (optional)</CustomText>
        <CustomText style={styles.bullet}>• Gender (optional for service personalization)</CustomText>
        <CustomText style={styles.bullet}>• Profile photo (optional)</CustomText>

        <CustomText style={styles.bold}>b) Booking and Queue Details</CustomText>
        <CustomText style={styles.bullet}>• Services selected</CustomText>
        <CustomText style={styles.bullet}>• Appointment date and time</CustomText>
        <CustomText style={styles.bullet}>• Queue type (Single or Group)</CustomText>
        <CustomText style={styles.bullet}>• Number of people in a group</CustomText>

        <CustomText style={styles.bold}>c) Device & Usage Data</CustomText>
        <CustomText style={styles.bullet}>• Device type (Android/iOS)</CustomText>
        <CustomText style={styles.bullet}>• IP address and general location</CustomText>
        <CustomText style={styles.bullet}>• App usage statistics</CustomText>
        <CustomText style={styles.bullet}>• Crash and error logs</CustomText>

        <CustomText style={styles.subHeading}>2. How We Use Your Information</CustomText>
        <CustomText style={styles.bullet}>• Schedule and manage your appointments</CustomText>
        <CustomText style={styles.bullet}>• Let you join the live queue (single/group)</CustomText>
        <CustomText style={styles.bullet}>• Send real-time notifications and reminders</CustomText>
        <CustomText style={styles.bullet}>• Provide estimated wait times and queue position</CustomText>
        <CustomText style={styles.bullet}>• Improve app performance and user experience</CustomText>
        <CustomText style={styles.bullet}>• Respond to support requests or inquiries</CustomText>

        <CustomText style={styles.paragraph}>
          We do <CustomText style={styles.bold}>not</CustomText> use your data for advertising purposes or sell your information to third parties.
        </CustomText>

        <CustomText style={styles.subHeading}>3. Sharing of Information</CustomText>
        <CustomText style={styles.bullet}>• <CustomText style={styles.bold}>With salon staff</CustomText> for managing bookings and queues</CustomText>
        <CustomText style={styles.bullet}>• <CustomText style={styles.bold}>With service providers</CustomText> (e.g., SMS providers) only to deliver messages or technical support</CustomText>
        <CustomText style={styles.bullet}>• <CustomText style={styles.bold}>When required by law</CustomText> to comply with legal obligations or protect our users' rights</CustomText>

        <CustomText style={styles.paragraph}>
          We ensure all third parties follow strict confidentiality and data protection standards.
        </CustomText>

        <CustomText style={styles.subHeading}>4. Data Security</CustomText>
        <CustomText style={styles.bullet}>• Secure servers and encrypted connections</CustomText>
        <CustomText style={styles.bullet}>• Role-based access control for staff</CustomText>
        <CustomText style={styles.bullet}>• Regular app updates to patch security vulnerabilities</CustomText>

        <CustomText style={styles.paragraph}>
          However, no mobile app is 100% secure. Use the app responsibly and update it regularly.
        </CustomText>

        <CustomText style={styles.subHeading}>5. Your Rights and Choices</CustomText>
        <CustomText style={styles.bullet}>• View and update your profile information</CustomText>
        <CustomText style={styles.bullet}>• Cancel your bookings or remove yourself from the queue</CustomText>
        <CustomText style={styles.bullet}>• Request deletion of your account and personal data</CustomText>
        <CustomText style={styles.bullet}>• Contact us if you believe your data has been misused</CustomText>

        <CustomText style={styles.paragraph}>
          To update or delete your data, please contact us at <CustomText style={styles.italic}>[Your Support Email]</CustomText> or use the profile settings in the app.
        </CustomText>

        <CustomText style={styles.subHeading}>6. Children's Privacy</CustomText>
        <CustomText style={styles.paragraph}>
          Our app is intended for users aged 13 and above. We do not knowingly collect data from children under 13. If you believe a child’s data has been submitted, contact us immediately for removal.
        </CustomText>

        <CustomText style={styles.subHeading}>7. Changes to This Policy</CustomText>
        <CustomText style={styles.bullet}>• We may update this Privacy Policy from time to time to reflect changes in technology, law, or business operations.</CustomText>
        <CustomText style={styles.bullet}>• We will notify users of significant changes via the app</CustomText>
        <CustomText style={styles.bullet}>• Continued use of the app means you accept the updated policy</CustomText>

      </ScrollView>
    </View>
  )
}

export default privacyPolicy

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: scale(12),
    paddingBottom: verticalScale(20),
  },
  backButton: {
    marginBottom: verticalScale(10),
  },
  heading: {
    fontSize: scale(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(10),
    textAlign: "center"
  },
  subHeading: {
    fontSize: scale(16),
    fontWeight: '600',
    marginTop: verticalScale(15),
    marginBottom: verticalScale(5),
  },
  paragraph: {
    fontSize: scale(13),
    lineHeight: scale(18),
    marginBottom: verticalScale(10),
  },
  bullet: {
    fontSize: scale(13),
    marginLeft: scale(10),
    marginBottom: verticalScale(5),
  },
  italic: {
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: 'bold',
  }
})
