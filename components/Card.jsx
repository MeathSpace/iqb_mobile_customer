import { useTheme } from "@react-navigation/native";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { useAuth } from "../context/AuthContext";
import CustomSecondaryText from "./CustomSecondaryText";
import CustomText from "./CustomText";
import { BASE_URL } from "@/utils/api";
import { router, useFocusEffect } from "expo-router";
import { CalendarIcon } from "../constants/icons";
import Skeleton from "./Skeleton";

const Card = ({ customerLivetData, cancelQueueLoading, setCancelQueueLoading }) => {
  const { colors } = useTheme();
  const { authenticatedUser } = useAuth();

  function formatMinutesToHrMin(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
    if (hours > 0) return `${hours}hr`;
    return `${mins}m`;
  }

  return (
    <View>
      {customerLivetData?.loading ? (
        <Skeleton borderRadius={scale(28)} height={verticalScale(140)} />
      ) : customerLivetData?.liveQueueData?.isJoinedData?.length > 0 ? (
        /* --- ACTIVE QUEUE CARD (PREMIUM BENTO STYLE) --- */
        <View
          style={{
            backgroundColor: colors.modalBgColor,
            borderRadius: moderateScale(28),
            padding: scale(20),
            borderWidth: 1,
            borderColor: colors.queueBorder,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 15,
            elevation: 8,
          }}
        >
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
                  color: "#94a3b8",
                  marginBottom: verticalScale(6),
                }}
              >
                Active Status
              </CustomText>
              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_XBd",
                  fontSize: moderateScale(22),
                  color: colors.text,
                }}
                numberOfLines={1}
              >
                {customerLivetData?.liveQueueData?.isJoinedData?.[0]?.name}
              </CustomText>
              <CustomSecondaryText
                style={{
                  marginTop: verticalScale(2),
                  fontSize: moderateScale(14),
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
                backgroundColor: "#14b8a610",
                padding: scale(12),
                borderRadius: moderateScale(20),
                alignItems: "center",
                minWidth: scale(70),
                borderWidth: 1,
                borderColor: "#14b8a620",
              }}
            >
              <CustomText
                style={{
                  color: "#14b8a6",
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
                  color: "#14b8a6",
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

          <View
            style={{
              flexDirection: "row",
              gap: scale(12),
              marginTop: verticalScale(20),
            }}
          >
            <TouchableOpacity
              disabled={cancelQueueLoading}
              onPress={async () => {
                Alert.alert(
                  "Cancel Queue",
                  "Are you sure you want to cancel this queue?",
                  [
                    { text: "No", style: "cancel" },
                    {
                      text: "Yes",
                      onPress: async () => {
                        try {
                          const cancelQueueData = {
                            salonId: authenticatedUser?.salonId,
                            barberId:
                              customerLivetData?.liveQueueData
                                ?.isJoinedData?.[0]?.barberId,
                            customerEmail:
                              customerLivetData?.liveQueueData
                                ?.isJoinedData?.[0]?.customerEmail,
                            _id: customerLivetData?.liveQueueData
                              ?.isJoinedData?.[0]?._id,
                          };
                          setCancelQueueLoading(true);
                          const { data } = await axios.post(
                            `${BASE_URL}/mobileRoutes/cancelQueueByCustomer`,
                            cancelQueueData,
                          );
                          setCustomerLiveData((prev) => ({
                            ...prev,
                            loading: true,
                          }));
                          const { data: livedata } = await axios.post(
                            `${BASE_URL}/customer/customerLiveQueue`,
                            {
                              salonId: authenticatedUser?.salonId,
                              customerEmail: authenticatedUser?.email,
                            },
                          );
                          setCustomerLiveData((prev) => ({
                            ...prev,
                            loading: false,
                            liveQueueData: livedata?.response,
                            success: true,
                            error: null,
                          }));
                        } catch (error) {
                          console.log("Error from live queue data");
                        } finally {
                          setCancelQueueLoading(false);
                        }
                      },
                    },
                  ],
                );
              }}
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
              onPress={() => {
                if (!authenticatedUser?.isAppointments) {
                  return Toast.error(
                    "Appointment feature is not available at this salon",
                  );
                }
                setJoinModes((prev) => ({
                  ...prev,
                  appointment: true,
                  appointmentType: "Book",
                }));
                router.push("/appointmentCalendar");
              }}
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
                  fontFamily: "AirbnbCereal_W_Bd",
                }}
              >
                Book
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* --- EMPTY STATE CARD --- */
        <View
          style={{
            backgroundColor: colors.modalBgColor,
            borderRadius: moderateScale(28),
            padding: scale(20),
            borderWidth: 1,
            borderColor: colors.queueBorder,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 15,
            elevation: 8,
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
                backgroundColor: "#2563eb10",
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
              onPress={() => {
                if (!getSalonFeature?.salonFeature?.isQueuing) {
                  return Toast.error(
                    "Queueing feature is not available at this salon",
                  );
                }
                if (
                  !homeDashboardData?.dashboardData?.salonInfo
                    ?.mobileBookingAvailability
                ) {
                  return Toast.error("Mobile queueing is off");
                }
                router.push("/joinpopup");
              }}
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
              onPress={() => {
                if (!getSalonFeature?.salonFeature?.isAppointments) {
                  return Toast.error(
                    "Appointment feature is not available at this salon",
                  );
                }
                setJoinModes((prev) => ({
                  ...prev,
                  appointment: true,
                  appointmentType: "Book",
                }));
                router.push("/appointmentCalendar");
              }}
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
      )}
    </View>
  );
};

export default Card;
