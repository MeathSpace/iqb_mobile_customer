import { useTheme } from "@react-navigation/native";
import {
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { SalonIcon, UploadIcon } from "../constants/icons";
import CustomSecondaryText from "./CustomSecondaryText";
import CustomText from "./CustomText";

const SalonHint = ({
  latestVersion,
  lengthMore,
  salonInfo,
  textShown,
  toggleNumberOfLines,
  onTextLayout,
}) => {
  const { colors } = useTheme();

  return (
    <View style={{ gap: verticalScale(20) }}>
      {/* ===== UPDATE NOTIFICATION HEADER STYLE ===== */}
      {latestVersion && (
        <View
          style={{
            backgroundColor: "#14b8a610", // Soft tint background
            padding: scale(16),
            borderRadius: moderateScale(24),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderColor: "#14b8a630",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scale(12),
            }}
          >
            <View
              style={{
                width: scale(44),
                height: scale(44),
                backgroundColor: "#14b8a6",
                borderRadius: moderateScale(12),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <UploadIcon color="#fff" size={scale(20)} />
            </View>
            <View>
              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_XBd",
                  fontSize: moderateScale(15),
                  color: "#0f766e",
                }}
              >
                New update
              </CustomText>
              <CustomSecondaryText
                style={{
                  fontSize: moderateScale(12),
                  color: "#14b8a6",
                }}
              >
                Version {latestVersion} is ready
              </CustomSecondaryText>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              if (Platform.OS === "ios") {
                const iosUrl = `https://apps.apple.com/in/app/iqbook/id6742742449`;
                Linking.openURL(iosUrl).catch((err) => console.error(err));
              } else {
                const androidUrl =
                  "https://play.google.com/store/apps/details?id=com.iqbook.iqb";
                Linking.openURL(androidUrl).catch((err) => console.error(err));
              }
            }}
            style={{
              paddingHorizontal: scale(16),
              paddingVertical: verticalScale(8),
              backgroundColor: "#14b8a6",
              borderRadius: moderateScale(10),
              elevation: 2,
            }}
          >
            <CustomText
              style={{
                color: "#fff",
                fontFamily: "AirbnbCereal_W_Bd",
                fontSize: moderateScale(13),
              }}
            >
              Update
            </CustomText>
          </TouchableOpacity>
        </View>
      )}

      {/* ===== SALON INFO SECTION ===== */}
      <View>
        {/* Section Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: verticalScale(12),
            gap: scale(8),
          }}
        >
          <CustomText
            style={{
              fontFamily: "AirbnbCereal_W_XBd",
              fontSize: moderateScale(18),
              color: colors.text,
            }}
          >
            About the Salon
          </CustomText>
        </View>

        <View
          style={{
            backgroundColor: colors.modalBgColor,
            padding: scale(20),
            borderRadius: moderateScale(28),
            borderWidth: 1,
            borderColor: colors.queueBorder,
          }}
        >
          <View style={{ flexDirection: "row", gap: scale(12) }}>
            <View
              style={{
                width: scale(40),
                height: scale(40),
                backgroundColor: colors.background,
                borderRadius: moderateScale(10),
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.queueBorder,
              }}
            >
              <SalonIcon color={colors.primary} size={scale(20)} />
            </View>

            <View style={{ flex: 1 }}>
              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_Bd",
                  fontSize: moderateScale(11),
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                  color: "#94a3b8",
                  marginBottom: verticalScale(4),
                }}
              >
                Salon Description
              </CustomText>

              <CustomSecondaryText
                onTextLayout={onTextLayout}
                numberOfLines={textShown ? undefined : 5}
                style={{
                  lineHeight: 22,
                  fontSize: moderateScale(14),
                  color: "#64748b",
                }}
              >
                {salonInfo}
              </CustomSecondaryText>

              {lengthMore && (
                <TouchableOpacity
                  onPress={toggleNumberOfLines}
                  style={{ marginTop: verticalScale(8) }}
                >
                  <CustomText
                    style={{
                      fontFamily: "AirbnbCereal_W_Bd",
                      color: colors.primary,
                      fontSize: moderateScale(13),
                    }}
                  >
                    {textShown ? "Show less" : "Read more"}
                  </CustomText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SalonHint;

const styles = StyleSheet.create({});
