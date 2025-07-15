import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import CustomTabView from '../../../components/CustomTabView'
import CustomText from '../../../components/CustomText'
import { scale, verticalScale } from 'react-native-size-matters'
import { ArrowLeftIcon } from '../../../constants/icons'
import { useRouter } from 'expo-router'
import { useTheme } from '@react-navigation/native'

const licenses = () => {

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
        paddingBottom: Platform.OS === 'ios' ? verticalScale(80) : verticalScale(20),
      }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CustomText style={styles.heading}>End User License Agreement (EULA)</CustomText>

        <CustomText style={styles.paragraph}>
          <CustomText style={styles.bold}>Effective Date:</CustomText> 04-07-2025
        </CustomText>
        <CustomText style={styles.paragraph}>
          <CustomText style={styles.bold}>App Name:</CustomText> iqbook
        </CustomText>

        <CustomText style={styles.paragraph}>
          This End User License Agreement (“Agreement”) is a legal agreement between you (“User”, “you”, or “your”) and <CustomText style={styles.italic}>iqbook</CustomText>, governing your use of the <CustomText style={styles.italic}>iqbook</CustomText> mobile application (“App”).
        </CustomText>

        <CustomText style={styles.paragraph}>
          By downloading, installing, or using the app, you agree to be bound by the terms of this license.
        </CustomText>

        {/* Sections */}
        <CustomText style={styles.subHeading}>1. License Grant</CustomText>
        <CustomText style={styles.bullet}>• Download and install the app on your personal device</CustomText>
        <CustomText style={styles.bullet}>• Use the app solely for booking appointments, joining the salon queue, and managing your salon visits</CustomText>
        <CustomText style={styles.paragraph}>You <CustomText style={styles.bold}>may not</CustomText>:</CustomText>
        <CustomText style={styles.bullet}>• Copy, modify, or distribute the app or its content</CustomText>
        <CustomText style={styles.bullet}>• Reverse engineer, decompile, or attempt to extract source code</CustomText>
        <CustomText style={styles.bullet}>• Use the app for illegal purposes or outside the scope of permitted use</CustomText>

        <CustomText style={styles.subHeading}>2. Ownership and Intellectual Property</CustomText>
        <CustomText style={styles.paragraph}>
          All content, design, code, and trademarks within the app are owned by <CustomText style={styles.italic}>iqbook</CustomText> or its licensors. This license does not grant you ownership of the app or its content—only the right to use it under the conditions of this Agreement.
        </CustomText>

        <CustomText style={styles.subHeading}>3. Updates and Modifications</CustomText>
        <CustomText style={styles.paragraph}>
          We may release updates or improvements to the app. These updates may be automatic or manual. You agree to install such updates for continued access and security.
        </CustomText>
        <CustomText style={styles.paragraph}>
          We reserve the right to modify or discontinue the app at any time without notice.
        </CustomText>

        <CustomText style={styles.subHeading}>4. Termination</CustomText>
        <CustomText style={styles.paragraph}>
          This license will remain in effect until terminated. We may suspend or terminate your access if you:
        </CustomText>
        <CustomText style={styles.bullet}>• Violate this agreement</CustomText>
        <CustomText style={styles.bullet}>• Misuse the app</CustomText>
        <CustomText style={styles.bullet}>• Engage in fraudulent, abusive, or harmful behavior</CustomText>
        <CustomText style={styles.paragraph}>
          Upon termination, you must delete the app from your device and stop using it immediately.
        </CustomText>

        <CustomText style={styles.subHeading}>5. Disclaimer of Warranty</CustomText>
        <CustomText style={styles.paragraph}>
          The app is provided <CustomText style={styles.italic}>"as is"</CustomText> without warranties of any kind. We do not guarantee that the app will be error-free or always available.
        </CustomText>
        <CustomText style={styles.paragraph}>
          To the fullest extent permitted by law, we disclaim all warranties, express or implied.
        </CustomText>

        <CustomText style={styles.subHeading}>6. Limitation of Liability</CustomText>
        <CustomText style={styles.bullet}>• Any damages resulting from the use or inability to use the app</CustomText>
        <CustomText style={styles.bullet}>• Loss of data, missed appointments, or queue disruptions</CustomText>
        <CustomText style={styles.bullet}>• Any indirect or consequential damages</CustomText>
        <CustomText style={styles.paragraph}>Your use of the app is at your own risk.</CustomText>

      </ScrollView>
    </View>
  )
}

export default licenses

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
    textAlign: 'center',
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
  },
})
