import { usePreventRemove, useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import CustomSecondaryText from "../../components/CustomSecondaryText";
import CustomText from "../../components/CustomText";
import { CheckIcon } from "../../constants/icons";
import i18n from "../../src/localization/i18n"

const GroupJoinSuccessPage = () => {

  const baseContent = i18n.t("protected.groupJoinSuccessPage")

  const router = useRouter();
  const { colors } = useTheme();

  const LiveQueueNavigationRef = useRef(false);
  const homeNavigationRef = useRef(false);

  usePreventRemove(true, ({ data }) => {
    if (LiveQueueNavigationRef?.current && !homeNavigationRef?.current) {
      router.push("/queuelist");
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
        padding: scale(10),
      }}
    >
      <View
        style={[
          styles.upcomingCard,
          { backgroundColor: colors.cardColor, borderColor: colors.cardBorder },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${colors.accentColor}1A`},
          ]}
        >
          <CheckIcon size={scale(32)} color={colors.accentColor} />
        </View>
        <CustomText style={styles.cardTitle}>{baseContent.header}</CustomText>
        <CustomSecondaryText style={[styles.cardSubtitle, {}]}>
          {baseContent.subHeader}
        </CustomSecondaryText>
        <TouchableOpacity
          onPress={() => {
            LiveQueueNavigationRef.current = true;
            homeNavigationRef.current = false;
            router.back();
          }}
          style={[styles.bookButton, {backgroundColor: colors.accentColor}]}
          activeOpacity={0.85}
        >
          <CustomText style={styles.bookButtonText}>
            {baseContent.goToLiveQueue}
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            LiveQueueNavigationRef.current = false;
            homeNavigationRef.current = true;
            router.back();
          }}
        >
          <CustomText
            style={{
              color: colors.accentColor,
              textAlign: "center",
              fontFamily: "AirbnbCereal_W_XBd",
            }}
          >
            {baseContent.goBackToHome}
          </CustomText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GroupJoinSuccessPage;

const styles = StyleSheet.create({
  upcomingCard: {
    // backgroundColor: '#ffffff',
    borderRadius: scale(12),
    padding: scale(20),
    alignItems: "center",
    // borderColor: '#e5e7eb',
    borderWidth: scale(1),
    gap: verticalScale(15),
    marginTop: verticalScale(40),
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
    width: "100%",
    // bg-teal-500
    paddingVertical: verticalScale(16), // py-4
    borderRadius: scale(12), // rounded-xl
    // marginBottom: verticalScale(15), // mb-6
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonText: {
    color: "#fff", // text-white
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(16),
  },
});
