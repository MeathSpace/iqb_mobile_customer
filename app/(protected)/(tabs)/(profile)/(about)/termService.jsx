import { Colors } from "@/constants/Colors";
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

const termService = () => {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <ScrollView
      style={{
        backgroundColor: colors.background,
        flex: 1,
        // paddingHorizontal: scale(10),
      }}
      contentContainerStyle={{
        paddingHorizontal: scale(10),
        paddingBottom:
          Platform.OS === "ios" ? verticalScale(80) : verticalScale(20),
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: scale(10),
          height: verticalScale(40),
        }}
      >
        <Pressable onPress={() => router.back()}>
          <ArrowLeftIcon color={colors.text} />
        </Pressable>
        <CustomText
          style={{
            flex: 1,
            fontSize: scale(18),
            // textAlign: "center",
            fontFamily: "AirbnbCereal_W_XBd",
          }}
        >
          {i18n.t("protected.about.termService.header")}
        </CustomText>
      </View>

      <View
        style={{
          backgroundColor: colors.cardColor,
          borderWidth: scale(1),
          borderColor: colors.queueBorder,
          padding: scale(12),
          borderRadius: scale(12),
          // marginTop: verticalScale(20)
        }}
      >
        <CustomText style={styles.heading}>
          {i18n.t("protected.about.termService.content.mainHeader")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {i18n.t("protected.about.termService.content.intro")}
        </CustomText>

        <CustomText style={styles.subHeading}>
          {i18n.t(
            "protected.about.termService.content.sections.usingApp.title",
          )}
        </CustomText>
        {i18n
          .t("protected.about.termService.content.sections.usingApp.points", {
            returnObjects: true,
          })
          .map((point, index) => (
            <CustomText key={index} style={styles.bullet}>
              • {point}
            </CustomText>
          ))}
        <CustomText style={styles.paragraph}>
          {i18n.t(
            "protected.about.termService.content.sections.usingApp.footer",
          )}
        </CustomText>

        <CustomText style={styles.subHeading}>
          {i18n.t(
            "protected.about.termService.content.sections.bookingsQueue.title",
          )}
        </CustomText>
        {i18n
          .t(
            "protected.about.termService.content.sections.bookingsQueue.points",
            {
              returnObjects: true,
            },
          )
          .map((point, index) => (
            <CustomText key={index} style={styles.bullet}>
              • {point}
            </CustomText>
          ))}

        <CustomText style={styles.subHeading}>
          {i18n.t(
            "protected.about.termService.content.sections.responsibility.title",
          )}
        </CustomText>
        {i18n
          .t(
            "protected.about.termService.content.sections.responsibility.points",
            {
              returnObjects: true,
            },
          )
          .map((point, index) => (
            <CustomText key={index} style={styles.bullet}>
              • {point}
            </CustomText>
          ))}

        <CustomText style={styles.subHeading}>
          {i18n.t(
            "protected.about.termService.content.sections.cancellations.title",
          )}
        </CustomText>
        {i18n
          .t(
            "protected.about.termService.content.sections.cancellations.points",
            {
              returnObjects: true,
            },
          )
          .map((point, index) => (
            <CustomText key={index} style={styles.bullet}>
              • {point}
            </CustomText>
          ))}

        <CustomText style={styles.subHeading}>
          {i18n.t("protected.about.termService.content.sections.privacy.title")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {i18n.t(
            "protected.about.termService.content.sections.privacy.descriptionBefore",
          )}

          <CustomText style={styles.italic}>
            {i18n.t(
              "protected.about.termService.content.sections.privacy.linkText",
            )}
          </CustomText>

          {i18n.t(
            "protected.about.termService.content.sections.privacy.descriptionAfter",
          )}
        </CustomText>

        <CustomText style={styles.subHeading}>
          {i18n.t("protected.about.termService.content.sections.updates.title")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {i18n.t(
            "protected.about.termService.content.sections.updates.description",
          )}
        </CustomText>

        <CustomText style={styles.subHeading}>
          {i18n.t("protected.about.termService.content.sections.help.title")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {i18n.t(
            "protected.about.termService.content.sections.help.description",
          )}
        </CustomText>
      </View>
    </ScrollView>
  );
};

export default termService;

const styles = StyleSheet.create({
  heading: {
    fontSize: scale(20),
    fontFamily: "AirbnbCereal_W_XBd",
    marginBottom: verticalScale(10),
  },
  subHeading: {
    fontSize: scale(16),
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
    fontStyle: "italic",
  },
  agreeButton: {
    marginTop: verticalScale(20),
    backgroundColor: Colors.modeColor.colorCode,
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
  },
});
