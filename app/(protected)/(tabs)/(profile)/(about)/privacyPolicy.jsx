import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import CustomText from "../../../../../components/CustomText";
import { ArrowLeftIcon } from "../../../../../constants/icons";
import i18n from "../../../../../src/localization/i18n";

const PrivacyPolicy = () => {
  const router = useRouter();
  const { colors } = useTheme();

  const content = i18n.t("protected.about.privacyPolicy.content", {
    returnObjects: true,
  });

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
        paddingHorizontal: scale(10),
        paddingBottom:
          Platform.OS === "ios" ? verticalScale(80) : verticalScale(20),
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <ArrowLeftIcon color={colors.text} />
          </Pressable>

          <CustomText style={styles.title}>
            {i18n.t("protected.about.privacyPolicy.header")}
          </CustomText>
        </View>

        {/* Content */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardColor,
              borderColor: colors.queueBorder,
            },
          ]}
        >
          {/* Intro */}
          <CustomText style={styles.paragraph}>{content.intro1}</CustomText>

          <CustomText style={styles.paragraph}>
            {content.intro2_before}
            <CustomText style={styles.italic}>
              {content.intro2_highlight}
            </CustomText>
            {content.intro2_after}
          </CustomText>

          <CustomText style={styles.paragraph}>{content.intro3}</CustomText>

          {/* 1. Information We Collect */}
          <CustomText style={styles.subHeading}>
            {content.sections.infoCollection.title}
          </CustomText>

          <CustomText style={styles.paragraph}>
            {content.sections.infoCollection.description}
          </CustomText>

          {/* Personal */}
          <CustomText style={styles.bold}>
            {content.sections.infoCollection.personal.title}
          </CustomText>

          {content.sections.infoCollection.personal.points.map(
            (item, index) => (
              <CustomText key={index} style={styles.bullet}>
                • {item}
              </CustomText>
            ),
          )}

          {/* Booking */}
          <CustomText style={styles.bold}>
            {content.sections.infoCollection.booking.title}
          </CustomText>

          {content.sections.infoCollection.booking.points.map((item, index) => (
            <CustomText key={index} style={styles.bullet}>
              • {item}
            </CustomText>
          ))}

          {/* Device */}
          <CustomText style={styles.bold}>
            {content.sections.infoCollection.device.title}
          </CustomText>

          {content.sections.infoCollection.device.points.map((item, index) => (
            <CustomText key={index} style={styles.bullet}>
              • {item}
            </CustomText>
          ))}

          {/* 2. Usage */}
          <CustomText style={styles.subHeading}>
            {content.sections.usage.title}
          </CustomText>

          {content.sections.usage.points.map((item, index) => (
            <CustomText key={index} style={styles.bullet}>
              • {item}
            </CustomText>
          ))}

          <CustomText style={styles.paragraph}>
            {content.sections.usage.note_before}
            <CustomText style={styles.bold}>
              {content.sections.usage.note_highlight}
            </CustomText>
            {content.sections.usage.note_after}
          </CustomText>

          {/* 3. Sharing */}
          <CustomText style={styles.subHeading}>
            {content.sections.sharing.title}
          </CustomText>

          {content.sections.sharing.points.map((item, index) => (
            <CustomText key={index} style={styles.bullet}>
              • <CustomText style={styles.bold}>{item.bold}</CustomText>
              {item.text}
            </CustomText>
          ))}

          <CustomText style={styles.paragraph}>
            {content.sections.sharing.footer}
          </CustomText>

          {/* 4. Security */}
          <CustomText style={styles.subHeading}>
            {content.sections.security.title}
          </CustomText>

          {content.sections.security.points.map((item, index) => (
            <CustomText key={index} style={styles.bullet}>
              • {item}
            </CustomText>
          ))}

          <CustomText style={styles.paragraph}>
            {content.sections.security.footer}
          </CustomText>

          {/* 5. Rights */}
          <CustomText style={styles.subHeading}>
            {content.sections.rights.title}
          </CustomText>

          {content.sections.rights.points.map((item, index) => (
            <CustomText key={index} style={styles.bullet}>
              • {item}
            </CustomText>
          ))}

          <CustomText style={styles.paragraph}>
            {content.sections.rights.contact_before}
            <CustomText style={styles.italic}>
              {content.sections.rights.contact_highlight}
            </CustomText>
            {content.sections.rights.contact_after}
          </CustomText>

          {/* 6. Children */}
          <CustomText style={styles.subHeading}>
            {content.sections.children.title}
          </CustomText>

          <CustomText style={styles.paragraph}>
            {content.sections.children.description}
          </CustomText>

          {/* 7. Updates */}
          <CustomText style={styles.subHeading}>
            {content.sections.updates.title}
          </CustomText>

          {content.sections.updates.points.map((item, index) => (
            <CustomText key={index} style={styles.bullet}>
              • {item}
            </CustomText>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
    height: verticalScale(40),
  },
  title: {
    flex: 1,
    fontSize: scale(18),
    fontFamily: "AirbnbCereal_W_XBd",
  },
  card: {
    borderWidth: scale(1),
    padding: scale(12),
    borderRadius: scale(12),
  },
  subHeading: {
    fontSize: scale(16),
    fontFamily: "AirbnbCereal_W_XBd",
    marginTop: verticalScale(15),
    marginBottom: verticalScale(5),
  },
  paragraph: {
    lineHeight: scale(18),
    marginBottom: verticalScale(10),
  },
  bullet: {
    marginLeft: scale(10),
    marginBottom: verticalScale(5),
  },
  italic: {
    fontStyle: "italic",
  },
  bold: {
    fontWeight: "bold",
  },
});
