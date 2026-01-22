import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { CalendarIcon } from "../constants/icons";
import { useAuth } from "../context/AuthContext";
import CustomSecondaryText from "./CustomSecondaryText";
import CustomText from "./CustomText";
import Skeleton from "./Skeleton";

const Card = ({
  customerLivetData,
  cancelQueueLoading,
  setCancelQueueLoading,
}) => {
  const { colors } = useTheme();
  const { authenticatedUser } = useAuth();

  function formatMinutesToHrMin(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
    if (hours > 0) return `${hours}hr`;
    return `${mins}m`;
  }

  const handleCancelQueue = async () => {
    // move your existing cancel logic here
  };

  const handleBook = () => {
    // booking logic
  };

  const handleJoinQueue = () => {
    // join queue logic
  };

  return (
    <View>
      {customerLivetData?.loading ? (
        <Skeleton borderRadius={scale(28)} height={verticalScale(140)} />
      ) : customerLivetData?.liveQueueData?.isJoinedData?.length > 0 ? (
        /* --- ACTIVE QUEUE CARD (PREMIUM LIGHT BENTO) --- */
        <LinearGradient
          colors={["#10b981", "#0f766e", "#0a5f55"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: moderateScale(28),
            padding: scale(20),
          }}
        >
          <View>
            {/* Header Row */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <View style={{ flex: 1 }}>
                <CustomText
                  style={{
                    fontFamily: "AirbnbCereal_W_Bd",
                    fontSize: moderateScale(11),
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    color: "#E6F4F1",
                    marginBottom: verticalScale(6),
                  }}
                >
                  Active Status
                </CustomText>

                <CustomText
                  style={{
                    fontFamily: "AirbnbCereal_W_XBd",
                    fontSize: moderateScale(22),
                    color: "#fff",
                  }}
                  numberOfLines={1}
                >
                  {customerLivetData?.liveQueueData?.isJoinedData?.[0]?.name}
                </CustomText>

                <CustomSecondaryText
                  style={{
                    marginTop: verticalScale(2),
                    fontSize: moderateScale(14),
                    color: "#f0fdfa",
                  }}
                >
                  {
                    customerLivetData?.liveQueueData?.isJoinedData?.[0]
                      ?.barberName
                  }
                </CustomSecondaryText>
              </View>

              {/* Position Badge */}
              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  paddingVertical: verticalScale(10),
                  paddingHorizontal: scale(14),
                  borderRadius: moderateScale(20),
                  alignItems: "center",
                  minWidth: scale(72),
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.3)"
                }}
              >
                <CustomText
                  style={{
                    color: "#E6F4F1",
                    fontSize: moderateScale(20),
                    fontFamily: "AirbnbCereal_W_XBd",
                  }}
                >
                  {customerLivetData?.liveQueueData?.isJoinedData?.[0]
                    ?.qPosition === 1
                    ? "Next"
                    : `#${customerLivetData?.liveQueueData?.isJoinedData?.[0]?.qPosition}`}
                </CustomText>

                <CustomText
                  style={{
                    color: "#E6F4F1",
                    fontSize: moderateScale(10),
                    fontFamily: "AirbnbCereal_W_Bd",
                  }}
                >
                  ~
                  {formatMinutesToHrMin(
                    customerLivetData?.liveQueueData?.isJoinedData?.[0]
                      ?.customerEWT,
                  )}
                </CustomText>
              </View>
            </View>

            {/* Action Buttons */}
            <View
              style={{
                flexDirection: "row",
                gap: scale(12),
                marginTop: verticalScale(20),
              }}
            >
              <TouchableOpacity
                disabled={cancelQueueLoading}
                onPress={handleCancelQueue}
                style={{
                  flex: 1,
                  height: verticalScale(48),
                  backgroundColor: "#fee2e2",
                  borderRadius: moderateScale(14),
                  justifyContent: "center",
                  alignItems: "center",
                }}
                activeOpacity={0.85}
              >
                {cancelQueueLoading ? (
                  <ActivityIndicator size="small" color="#ef4444" />
                ) : (
                  <CustomText
                    style={{
                      color: "#ef4444",
                      fontFamily: "AirbnbCereal_W_Bd",
                    }}
                  >
                    Cancel
                  </CustomText>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleBook}
                style={{
                  flex: 1,
                  height: verticalScale(48),
                  backgroundColor: "#fff",
                  borderRadius: moderateScale(14),
                  justifyContent: "center",
                  alignItems: "center",
                }}
                activeOpacity={0.85}
              >
                <CustomText
                  style={{
                    color: "#000",
                    fontFamily: "AirbnbCereal_W_Bd",
                  }}
                >
                  Book
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      ) : (
        /* --- EMPTY STATE CARD --- */
        <LinearGradient
          colors={["#ffffff", "#f8fafc", "#eef2ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: moderateScale(28),
            padding: scale(20),
            borderWidth: 1,
            borderColor: "#e2e8f0",
          }}
        >
          <View
            style={{
              backgroundColor: colors.modalBgColor,
              borderRadius: moderateScale(28),
              padding: scale(20),
              borderWidth: 1,
              borderColor: colors.queueBorder,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <CustomText
                  style={{
                    fontFamily: "AirbnbCereal_W_XBd",
                    fontSize: moderateScale(22),
                    color: colors.text,
                  }}
                >
                  Your Visit, Your Way
                </CustomText>

                <CustomSecondaryText
                  style={{
                    marginTop: verticalScale(4),
                    fontSize: moderateScale(14),
                    color: "#64748b",
                  }}
                >
                  Join the virtual queue or book an appointment.
                </CustomSecondaryText>
              </View>

              <View
                style={{
                  backgroundColor: "#2563eb12",
                  padding: scale(12),
                  borderRadius: scale(50),
                }}
              >
                <CalendarIcon color="#2563eb" size={scale(24)} />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: scale(12),
                marginTop: verticalScale(20),
              }}
            >
              <TouchableOpacity
                onPress={handleJoinQueue}
                style={{
                  flex: 1,
                  height: verticalScale(48),
                  backgroundColor: "#14b8a6",
                  borderRadius: moderateScale(14),
                  justifyContent: "center",
                  alignItems: "center",
                }}
                activeOpacity={0.85}
              >
                <CustomText
                  style={{
                    color: "#fff",
                    fontFamily: "AirbnbCereal_W_XBd",
                  }}
                >
                  Join Queue
                </CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleBook}
                style={{
                  flex: 1,
                  height: verticalScale(48),
                  backgroundColor: colors.modalSectionColor,
                  borderRadius: moderateScale(14),
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.queueBorder,
                }}
                activeOpacity={0.85}
              >
                <CustomText
                  style={{
                    color: colors.text,
                    fontFamily: "AirbnbCereal_W_XBd",
                  }}
                >
                  Book
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      )}
    </View>
  );
};

export default Card;
