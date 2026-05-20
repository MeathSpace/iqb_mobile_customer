import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import CustomText from "../../../../components/CustomText";
import { CloseIcon, ErrorIcon } from "../../../../constants/icons";
import { useAuth } from "../../../../context/AuthContext";
import i18n from  "../../../../src/localization/i18n"
import api from "../../../../utils/api";

const connectSalon = () => {

  const baseContent = i18n.t("protected.connectSalon")

  const router = useRouter();
  const { colors } = useTheme();
  const { setAuthenticatedUser, authenticatedUser } = useAuth();

  const [connectSalonLoader, setConnectSalonLoader] = useState(false);

  const changeSalonPressed = async () => {
    try {
      setConnectSalonLoader(true);

      const { data } = await api.post(
        `/customer/customerDisconnectSalon`,
        {
          email: authenticatedUser?.email,
        },
      );

      setAuthenticatedUser({ ...authenticatedUser, salonId: 0 });
      await AsyncStorage.setItem(
        "LoggedInUser",
        JSON.stringify({ ...authenticatedUser, salonId: 0 }),
      );
      await AsyncStorage.removeItem("salonLocationAddress");
      // router.replace("/home")

      router.dismiss(); // this is alias for `router.back()` inside modal
      router.replace("/home");

      setConnectSalonLoader(false);
    } catch (error) {
      setConnectSalonLoader(false);
      Alert.alert(
        baseContent.alertBox.header,
        error?.response?.data?.message,
        [{ text: baseContent.alertBox.ok, onPress: () => {} }],
        { cancelable: true },
      );
      console.log("Error connecting to salon ", error?.response?.data?.message);
    }
  };

  return (
    <Pressable
      onPress={() => router.back()}
      style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.2)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={() => {}}
        style={{
          width: "95%",
          height: verticalScale(280),
          borderRadius: scale(12),
          borderWidth: scale(1),
          borderColor: colors.cardBorder,
          paddingVertical: verticalScale(24),
          paddingHorizontal: scale(48),
          gap: verticalScale(32),
          backgroundColor: colors.cardColor,
          position: "relative",
        }}
      >
        <View style={{ gap: verticalScale(25) }}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: "rgba(239, 68, 68, 0.1)" },
            ]}
          >
            <ErrorIcon
              size={scale(45)}
              color={"#ef4444"}
              style={{ textAlign: "center" }}
            />
          </View>

          <CustomText
            style={{
              fontFamily: "AirbnbCereal_W_Bd",
              fontSize: scale(16),
              textAlign: "center"
            }}
          >
            {baseContent.header}
          </CustomText>
        </View>

        <TouchableOpacity
          onPress={changeSalonPressed}
          style={[styles.queueButton, { backgroundColor: colors.accentColor }]}
          activeOpacity={0.85}
        >
          {connectSalonLoader ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <CustomText style={styles.queueButtonText}>{baseContent.changeSalon}</CustomText>
          )}
        </TouchableOpacity>

        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <CloseIcon size={scale(16)} color="#E11D48" />
        </Pressable>
      </Pressable>
    </Pressable>
  );
};

export default connectSalon;

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: verticalScale(10),
    right: scale(10),
    width: scale(30),
    height: scale(30),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E11D481A",
    borderRadius: scale(40),
  },

  iconContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(80),
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "auto",
  },

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
