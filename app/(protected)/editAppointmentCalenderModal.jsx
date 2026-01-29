import { BASE_URL } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Toast } from "toastify-react-native";
import CustomSecondaryText from "../../components/CustomSecondaryText";
import CustomText from "../../components/CustomText";
import { CheckIcon } from "../../constants/icons";
import { useAuth } from "../../context/AuthContext";
import { useGlobal } from "../../context/GlobalContext";
import { ddmmformatDate } from "../../utils/ddmmformatDate";

const editAppointmentCalenderModal = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { authenticatedUser } = useAuth();
  const params = useLocalSearchParams();

  const selectedCustomerBookAppointmentBarberParse =
    params?.selectedCustomerBookAppointmentBarber
      ? JSON.parse(params?.selectedCustomerBookAppointmentBarber)
      : {};
  const selectedCustomerBookAppointmentServicesParse =
    params?.selectedCustomerBookAppointmentServices
      ? JSON.parse(params?.selectedCustomerBookAppointmentServices)
      : [];
  const selectedBookCalenderTimeslotParse = params?.selectedBookCalenderTimeslot
    ? JSON.parse(params?.selectedBookCalenderTimeslot)
    : "";
  const selectedBookCalenderDateParse = params?.selectedBookCalenderDate
    ? JSON.parse(params?.selectedBookCalenderDate)
    : "";
  const selectedBookAppointmentNoteParse = params?.selectedBookAppointmentNote
    ? JSON.parse(params?.selectedBookAppointmentNote)
    : "";

  // console.log("selectedCustomerBookAppointmentBarberParse ", selectedCustomerBookAppointmentBarberParse)

  const { newNotification, setNewNotification, appointmentPopupType } = useGlobal();
  const [editAppointmentLoader, setEditAppointmentLoader] = useState(false);

  const editAppointmentPressed = async () => {
    const appData = {
      salonId: authenticatedUser?.salonId,
      appointmentId: params?.appointmentId,
      barberId: selectedCustomerBookAppointmentBarberParse?.barberId,
      serviceId: selectedCustomerBookAppointmentServicesParse.map(
        (item) => item.serviceId,
      ),
      appointmentDate: selectedBookCalenderDateParse,
      appointmentNotes: selectedBookAppointmentNoteParse,
      startTime: selectedBookCalenderTimeslotParse,
    };

    try {
      setEditAppointmentLoader(true);

      const { data } = await axios.put(
        `${BASE_URL}/mobileRoutes/editAppointments`,
        appData,
      );

      Toast.success(data?.message);
      setEditAppointmentLoader(false);

      await AsyncStorage.setItem(
        "newNotification",
        JSON.stringify({
          email: authenticatedUser?.email,
          value: true,
        }),
      );

      setNewNotification({
        email: authenticatedUser?.email,
        value: true,
      });

      router.replace({
        pathname: "/appointmentSuccessPage",
        params: {
          booked: false,
          edit: true,
        },
      });
    } catch (error) {
      setEditAppointmentLoader(false);
      Alert.alert("Notice", error?.response?.data?.message, [{ text: "OK" }]);
      console.log(
        "Error doing edit appointment ",
        error?.response?.data?.message,
      );
    }
  };

  function formatMinutesToHrMin(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
    if (hours > 0) return `${hours}hr`;
    return `${mins}m`;
  }

  const totalPrice = selectedCustomerBookAppointmentServicesParse?.reduce(
    (acc, service) => acc + service.servicePrice,
    0,
  );

  const [totalTime, setTotalTime] = useState(0);
  
    useEffect(() => {
      if (appointmentPopupType?.selectServices) {
        setTotalTime(
          selectedCustomerBookAppointmentBarberParse?.totalBarberServiceEWT,
        );
      } else {
        setTotalTime(
          selectedCustomerBookAppointmentServicesParse.reduce(
            (sum, item) => sum + (Number(item.barberServiceEWT) || 0),
            0,
          ),
        );
      }
    }, []);

  // const totalTime = selectedCustomerBookAppointmentServicesParse?.reduce((acc, service) => acc + service.serviceEWT, 0);
  // const totalTime =
  //   selectedCustomerBookAppointmentBarberParse?.totalBarberServiceEWT;
  const totalServices = selectedCustomerBookAppointmentServicesParse?.length;

  return (
    // <Pressable
    //   onPress={() => {
    //     if (!editAppointmentLoader) {
    //       router.back();
    //     }
    //   }}
    //   style={{
    //     flex: 1,
    //     backgroundColor: "rgba(0,0,0,0.5)",
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >
    //   <Pressable
    //     onPress={() => {}}
    //     style={[
    //       styles.modalContainer,
    //       {
    //         backgroundColor: colors.cardColor,
    //         borderColor: colors.queueBorder,
    //       },
    //     ]}
    //   >
    //     <View style={styles.iconContainer}>
    //       <CheckIcon
    //         style={{
    //           backgroundColor: colors.tabBackground,
    //           padding: scale(3),
    //           borderRadius: scale(50),
    //         }}
    //         size={scale(16)}
    //         color={colors.text}
    //       />
    //       <CustomText style={styles.titleText}>Please Confirm</CustomText>
    //     </View>

    //     <View style={{ gap: verticalScale(5) }}>
    //       <CustomSecondaryText style={styles.confirmText}>
    //         Are you sure you want to proceed?
    //       </CustomSecondaryText>

    //       <View
    //         style={{
    //           marginTop: verticalScale(5),
    //           backgroundColor: colors.tabBackground, // Optional: subtle background to group
    //           padding: scale(8),
    //           borderRadius: scale(6),
    //           gap: verticalScale(4),
    //         }}
    //       >
    //         <CustomText
    //           style={{
    //             fontFamily: "AirbnbCereal_W_XBd",
    //             fontSize: scale(14),
    //           }}
    //         >
    //           {selectedCustomerBookAppointmentBarberParse?.name}
    //         </CustomText>

    //         <View
    //           style={{
    //             flexDirection: "row",
    //             alignItems: "center",
    //             gap: scale(6),
    //           }}
    //         >
    //           <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd" }}>
    //             {authenticatedUser?.currency} {totalPrice.toFixed(2)}
    //           </CustomText>
    //           <CustomSecondaryText>
    //             ( {totalServices} {totalServices === 1 ? "service" : "services"}{" "}
    //             | {formatMinutesToHrMin(totalTime)} )
    //           </CustomSecondaryText>
    //         </View>

    //         <View
    //           style={{
    //             flexDirection: "row",
    //             alignItems: "center",
    //             gap: scale(6),
    //           }}
    //         >
    //           <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd" }}>
    //             Timeslot
    //           </CustomText>
    //           <CustomSecondaryText>
    //             {selectedBookCalenderTimeslotParse}
    //           </CustomSecondaryText>
    //         </View>

    //         <View
    //           style={{
    //             flexDirection: "row",
    //             alignItems: "center",
    //             gap: scale(6),
    //           }}
    //         >
    //           <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd" }}>
    //             Date
    //           </CustomText>
    //           <CustomSecondaryText>
    //             {ddmmformatDate(selectedBookCalenderDateParse)}
    //           </CustomSecondaryText>
    //         </View>

    //         {selectedBookAppointmentNoteParse && (
    //           <View style={{ gap: scale(6) }}>
    //             <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd" }}>
    //               Note
    //             </CustomText>
    //             <CustomSecondaryText>
    //               {selectedBookAppointmentNoteParse}
    //             </CustomSecondaryText>
    //           </View>
    //         )}

    //         <View
    //           style={{
    //             width: "100%",
    //             backgroundColor: colors.background,
    //             borderWidth: scale(1),
    //             borderColor: colors.cardBorder,
    //             borderRadius: scale(5),
    //             padding: scale(10),
    //           }}
    //         >
    //           <CustomText style={{ fontSize: moderateScale(14) }}>
    //             <CustomText
    //               style={{
    //                 fontFamily: "AirbnbCereal_W_Bd",
    //                 color: "#e11d48",
    //                 fontSize: moderateScale(14),
    //               }}
    //             >
    //               Reminder:{" "}
    //             </CustomText>
    //             edits or cancellations made less than 24 hours before your
    //             appointment will be subject to a 50% fee.
    //           </CustomText>
    //           <View
    //             style={{
    //               height: verticalScale(5),
    //             }}
    //           />
    //           <CustomText
    //             style={{
    //               fontSize: moderateScale(14),
    //             }}
    //           >
    //             Kindly reach 5 minutes early for a seamless service.
    //           </CustomText>
    //         </View>
    //       </View>
    //     </View>

    //     <View style={styles.buttonRow}>
    //       <TouchableOpacity
    //         onPress={() => {
    //           if (!editAppointmentLoader) {
    //             router.back();
    //           }
    //         }}
    //         style={[
    //           styles.button,
    //           {
    //             // backgroundColor: '#ef4444'
    //           },
    //         ]}
    //       >
    //         <CustomText style={{ fontFamily: "AirbnbCereal_W_Bd" }}>
    //           No
    //         </CustomText>
    //       </TouchableOpacity>
    //       <TouchableOpacity
    //         disabled={editAppointmentLoader}
    //         onPress={editAppointmentPressed}
    //         style={[
    //           styles.button,
    //           {
    //             backgroundColor: "#14b8a6",
    //           },
    //         ]}
    //       >
    //         {editAppointmentLoader ? (
    //           <ActivityIndicator color={"#fff"} />
    //         ) : (
    //           <CustomText
    //             style={{ color: "#fff", fontFamily: "AirbnbCereal_W_Bd" }}
    //           >
    //             Yes
    //           </CustomText>
    //         )}
    //       </TouchableOpacity>
    //     </View>
    //   </Pressable>
    // </Pressable>

    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
        padding: scale(15),
      }}
    >
      {/* Main Card */}
      <View
        style={{
          width: "100%",
          maxHeight: "90%",
          backgroundColor: colors.modalBgColor,
          borderRadius: moderateScale(28),
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: verticalScale(10) },
          shadowOpacity: 0.15,
          shadowRadius: moderateScale(20),
          elevation: 10,
          borderWidth: 1,
          borderColor: colors.queueBorder,
        }}
      >
        {/* ===== HEADER ===== */}
        <View
          style={{
            paddingTop: verticalScale(22),
            paddingBottom: verticalScale(20),
            paddingHorizontal: scale(24),
            alignItems: "center",
            borderBottomColor: colors.queueBorder,
            borderBottomWidth: scale(1),
          }}
        >
          <View
            style={{
              width: scale(64),
              height: scale(64), // Using scale for icon containers to keep them square
              borderRadius: moderateScale(32),
              backgroundColor: "#2563eb10",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: verticalScale(16),
            }}
          >
            <CheckIcon size={moderateScale(28)} color="#2563eb" />
          </View>

          <CustomText
            style={{
              fontFamily: "AirbnbCereal_W_XBd",
              fontSize: moderateScale(22),
              textAlign: "center",
            }}
          >
            Confirm Appointment
          </CustomText>

          <CustomSecondaryText
            style={{
              textAlign: "center",
              marginTop: verticalScale(6),
              fontSize: moderateScale(14),
              color: "#64748b",
            }}
          >
            Please review your booking details
          </CustomSecondaryText>
        </View>

        {/* ===== CONTENT ===== */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: verticalScale(20),
            paddingHorizontal: scale(24),
            paddingBottom: verticalScale(24),
          }}
        >
          {/* Professional Summary */}
          <View style={{ marginBottom: verticalScale(24) }}>
            <CustomSecondaryText
              style={{
                fontSize: moderateScale(12),
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: verticalScale(8),
                color: "#94a3b8",
              }}
            >
              Service Provider
            </CustomSecondaryText>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <CustomText
                  style={{
                    fontFamily: "AirbnbCereal_W_XBd",
                    fontSize: moderateScale(18),
                  }}
                >
                  {selectedCustomerBookAppointmentBarberParse?.name}
                </CustomText>
                <CustomSecondaryText style={{ marginTop: verticalScale(2) }}>
                  {totalServices} {totalServices === 1 ? "service" : "services"}{" "}
                  • {formatMinutesToHrMin(totalTime)}
                </CustomSecondaryText>
              </View>

              {!true && (
                <CustomText
                  style={{
                    fontFamily: "AirbnbCereal_W_XBd",
                    fontSize: moderateScale(18),
                  }}
                >
                  {authenticatedUser?.currency}
                  {totalPrice.toFixed(2)}
                </CustomText>
              )}
            </View>
          </View>

          {/* Date & Time Grid */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.modalSectionColor,
              borderRadius: moderateScale(20),
              padding: scale(16),
              marginBottom: verticalScale(24),
              borderWidth: 1,
              borderColor: colors.queueBorder,
            }}
          >
            <View
              style={{
                flex: 1,
                borderRightWidth: 1,
                borderColor: colors.queueBorder,
                paddingRight: scale(10),
              }}
            >
              <CustomSecondaryText
                style={{
                  fontSize: moderateScale(11),
                  textTransform: "uppercase",
                  marginBottom: verticalScale(4),
                }}
              >
                Date
              </CustomSecondaryText>
              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_Bd",
                  fontSize: moderateScale(15),
                }}
              >
                {ddmmformatDate(selectedBookCalenderDateParse)}
              </CustomText>
            </View>

            <View style={{ flex: 1, paddingLeft: scale(20) }}>
              <CustomSecondaryText
                style={{
                  fontSize: moderateScale(11),
                  textTransform: "uppercase",
                  marginBottom: verticalScale(4),
                }}
              >
                Time
              </CustomSecondaryText>
              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_Bd",
                  fontSize: moderateScale(15),
                }}
              >
                {selectedBookCalenderTimeslotParse}
              </CustomText>
            </View>
          </View>

          {/* Payment Receipt Style */}
          {false && (
            <View
              style={{
                padding: scale(20),
                borderRadius: moderateScale(20),
                backgroundColor: colors.modalSectionColor,
                borderWidth: 1,
                borderColor: colors.queueBorder,
                marginBottom: verticalScale(24),
              }}
            >
              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_Bd",
                  fontSize: moderateScale(14),
                  marginBottom: verticalScale(16),
                }}
              >
                Payment Breakdown
              </CustomText>

              <View style={{ gap: verticalScale(10) }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <CustomSecondaryText style={{ fontSize: moderateScale(14) }}>
                    Total Amount
                  </CustomSecondaryText>
                  <CustomText
                    style={{
                      fontFamily: "AirbnbCereal_W_Bd",
                      fontSize: moderateScale(14),
                    }}
                  >
                    {authenticatedUser?.currency} {totalPrice.toFixed(2)}
                  </CustomText>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: verticalScale(12),
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: colors.queueBorder,
                    marginVertical: verticalScale(4),
                  }}
                >
                  <View>
                    <CustomText
                      style={{
                        fontFamily: "AirbnbCereal_W_Bd",
                        color: "#2563eb",
                      }}
                    >
                      Pay Now
                    </CustomText>
                    <CustomSecondaryText
                      style={{ fontSize: moderateScale(12) }}
                    >
                      Deposit (23
                      %)
                    </CustomSecondaryText>
                  </View>
                  <CustomText
                    style={{
                      fontFamily: "AirbnbCereal_W_XBd",
                      color: "#2563eb",
                      fontSize: moderateScale(18),
                    }}
                  >
                    {authenticatedUser?.currency} {advanceAmount.toFixed(2)}
                  </CustomText>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <CustomSecondaryText style={{ fontSize: moderateScale(14) }}>
                    Remaining Balance
                  </CustomSecondaryText>
                  <CustomText
                    style={{
                      fontFamily: "AirbnbCereal_W_Bd",
                      fontSize: moderateScale(14),
                      color: "#64748b",
                    }}
                  >
                    {authenticatedUser?.currency}{" "}
                    {(totalPrice - advanceAmount).toFixed(2)}
                  </CustomText>
                </View>
              </View>
            </View>
          )}

          {/* Note */}
          {selectedBookAppointmentNoteParse && (
            <View style={{ marginBottom: verticalScale(24) }}>
              <CustomSecondaryText
                style={{
                  fontSize: moderateScale(12),
                  textTransform: "uppercase",
                  marginBottom: verticalScale(8),
                }}
              >
                Your Note
              </CustomSecondaryText>
              <View
                style={{
                  padding: scale(16),
                  borderRadius: moderateScale(16),
                  backgroundColor: colors.tabBackground,
                }}
              >
                <CustomText
                  style={{
                    fontSize: moderateScale(14),
                    fontStyle: "italic",
                  }}
                >
                  "{selectedBookAppointmentNoteParse}"
                </CustomText>
              </View>
            </View>
          )}

          {/* Policy Box */}
          <View
            style={{
              padding: scale(16),
              borderRadius: moderateScale(16),
              backgroundColor: "#fff1f2",
              borderWidth: 1,
              borderColor: "#ffe4e6",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: verticalScale(4),
                gap: scale(6),
              }}
            >
              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_Bd",
                  color: "#e11d48",
                  fontSize: moderateScale(13),
                }}
              >
                Cancellation Policy
              </CustomText>
            </View>
            <CustomText
              style={{
                fontSize: moderateScale(12),
                color: "#9f1239",
                lineHeight: verticalScale(18),
              }}
            >
              Cancellations within 24 hours incur a 50% fee. Please arrive 5
              minutes early.
            </CustomText>
          </View>
        </ScrollView>

        {/* ===== FOOTER ===== */}
        <View
          style={{
            padding: scale(24),
            paddingBottom: scale(10),
            borderTopWidth: 1,
            borderColor: colors.queueBorder,
          }}
        >
          {false ? (
            <TouchableOpacity
              onPress={openPaymentSheet}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#94a3b8" : "#2563eb",
                paddingVertical: verticalScale(18),
                borderRadius: moderateScale(16),
                alignItems: "center",
                shadowColor: "#2563eb",
                shadowOffset: { width: 0, height: verticalScale(4) },
                shadowOpacity: 0.2,
                shadowRadius: moderateScale(8),
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <CustomText
                  style={{
                    color: "#fff",
                    fontFamily: "AirbnbCereal_W_Bd",
                    fontSize: moderateScale(16),
                  }}
                >
                  Proceed to Payment
                </CustomText>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={editAppointmentPressed}
              disabled={editAppointmentLoader}
              style={{
                backgroundColor: editAppointmentLoader ? "#94a3b8" : "#0d9488",
                paddingVertical: verticalScale(18),
                borderRadius: moderateScale(16),
                alignItems: "center",
              }}
            >
              {editAppointmentLoader ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <CustomText
                  style={{
                    color: "#fff",
                    fontFamily: "AirbnbCereal_W_Bd",
                    fontSize: moderateScale(16),
                  }}
                >
                  Save Booking
                </CustomText>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => !editAppointmentLoader && router.back()}
            style={{
              marginTop: verticalScale(12),
              paddingVertical: verticalScale(8),
              alignItems: "center",
            }}
          >
            <CustomText
              style={{
                fontFamily: "AirbnbCereal_W_Bd",
                color: "#64748b",
                fontSize: moderateScale(15),
              }}
            >
              Go Back
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

{
  /* ===== FOOTER ===== */
}
// <View
//   style={{
//     padding: scale(24),
//     paddingBottom: scale(10),
//     borderTopWidth: 1,
//     borderColor: colors.queueBorder,
//   }}
// >
//   <TouchableOpacity
//     onPress={editAppointmentLoader}
//     disabled={editAppointmentLoader}
//     style={{
//       backgroundColor: editAppointmentLoader ? "#94a3b8" : "#0d9488",
//       paddingVertical: verticalScale(18),
//       borderRadius: moderateScale(16),
//       alignItems: "center",
//     }}
//   >
//     {editAppointmentLoader ? (
//       <ActivityIndicator color="#fff" />
//     ) : (
//       <CustomText
//         style={{
//           color: "#fff",
//           fontFamily: "AirbnbCereal_W_Bd",
//           fontSize: moderateScale(16),
//         }}
//       >
//         Save Booking
//       </CustomText>
//     )}
//   </TouchableOpacity>

//   <TouchableOpacity
//     onPress={() => !editAppointmentLoader && router.back()}
//     style={{
//       marginTop: verticalScale(12),
//       paddingVertical: verticalScale(8),
//       alignItems: "center",
//     }}
//   >
//     <CustomText
//       style={{
//         fontFamily: "AirbnbCereal_W_Bd",
//         color: "#64748b",
//         fontSize: moderateScale(15),
//       }}
//     >
//       Go Back
//     </CustomText>
//   </TouchableOpacity>
// </View>

export default editAppointmentCalenderModal;

const styles = StyleSheet.create({
  modalContainer: {
    width: "85%",
    borderRadius: scale(8),
    borderWidth: scale(1),
    padding: scale(10),
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  titleText: {
    fontFamily: "AirbnbCereal_W_Bd",
  },
  confirmText: {
    marginTop: verticalScale(10),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: scale(10),
    marginTop: verticalScale(10),
  },
  button: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: scale(6),
  },
});
