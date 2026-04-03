import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import CustomSecondaryText from "../../components/CustomSecondaryText";
import CustomText from "../../components/CustomText";
import { useAuth } from "../../context/AuthContext";
import { useGlobal } from "../../context/GlobalContext";
import i18n from "../../src/localization/i18n"

const joinpopup = () => {

  const baseContent = i18n.t("protected.joinpopup")

  const router = useRouter();
  const { colors } = useTheme();
  const { authenticatedUser } = useAuth();

  const { setMemberName, joinPopupType, setJoinPopupType } = useGlobal();

  return (
    <Pressable
      onPress={() => router.back()}
      style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={() => {}}
        style={{
          width: "95%",
          // height: verticalScale(350),
          backgroundColor: colors.cardColor,
          borderRadius: scale(12),
          padding: scale(20),
          gap: verticalScale(20),
          borderColor: colors.cardBorder,
          borderWidth: scale(1),
        }}
      >
        <CustomText
          style={{
            textAlign: "center",
            fontFamily: "AirbnbCereal_W_XBd",
            fontSize: scale(22),
          }}
        >
          {baseContent.header}
        </CustomText>

        <View
          style={{
            gap: verticalScale(10),
          }}
        >
          <CustomText
            style={{
              fontFamily: "AirbnbCereal_W_XBd",
              fontSize: scale(18)
            }}
          >
            {baseContent.singleJoin.label}
          </CustomText>
          <CustomSecondaryText
            style={{
              fontSize: scale(14),
            }}
          >
            {baseContent.singleJoin.subHeader}
          </CustomSecondaryText>

          <TouchableOpacity
            onPress={() => {
              // router.replace("/singleJoin")
              setJoinPopupType({
                single: true,
                group: false,
              });
              router.replace("/joinQueueTypeModal");
            }}
            style={[
              styles.queueButton,
              { backgroundColor: colors.accentColor },
            ]}
            activeOpacity={0.85}
          >
            <CustomText style={styles.queueButtonText}>{baseContent.singleJoin.buttonText}</CustomText>
          </TouchableOpacity>
        </View>

        <View
          style={{
            gap: verticalScale(10),
          }}
        >
          <CustomText
            style={{
              fontFamily: "AirbnbCereal_W_XBd",
              fontSize: scale(18),
            }}
          >
            {baseContent.groupJoin.label}
          </CustomText>
          <CustomSecondaryText
            style={{
              fontFamily: "AirbnbCereal_W_Md",
              fontSize: scale(14),
            }}
          >
            {baseContent.groupJoin.subHeader}
          </CustomSecondaryText>

          <TouchableOpacity
            // onPress={() => router.replace("/groupJoin")}
            onPress={() => {
              setMemberName(authenticatedUser?.name);
              router.replace("/groupHostMemberModal");
            }}
            style={[
              styles.queueButton,
              {
                backgroundColor: `${colors.accentColor}`,
              },
            ]}
            activeOpacity={0.85}
          >
            <CustomText style={styles.queueButtonText}>{baseContent.groupJoin.buttonText}</CustomText>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Pressable>
  );
};

export default joinpopup;

const styles = StyleSheet.create({
  queueButton: {
    width: "100%",
    // bg-teal-500
    paddingVertical: verticalScale(16), // py-4
    borderRadius: scale(12), // rounded-xl
    marginBottom: verticalScale(15), // mb-6
    alignItems: "center",
    justifyContent: "center",
  },
  queueButtonText: {
    color: "#fff", // text-white
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(16),
  },
});
