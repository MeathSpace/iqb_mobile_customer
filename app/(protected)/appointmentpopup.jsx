import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import CustomSecondaryText from "../../components/CustomSecondaryText";
import CustomText from "../../components/CustomText";
import { useAuth } from "../../context/AuthContext";
import { useGlobal } from "../../context/GlobalContext";

const appointmentpopup = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const selectedAppointmentParse = params?.selectedAppointment
    ? JSON.parse(params?.selectedAppointment)
    : {};

  const is_editAppointment = params?.is_editAppointment
    ? Boolean(params?.is_editAppointment)
    : false;

  const { colors } = useTheme();
  const { authenticatedUser } = useAuth();

  const { appointmentPopupType, setAppointmentPopupType } = useGlobal();

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
          Booking options
        </CustomText>

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
            Select Services First
          </CustomText>
          <CustomSecondaryText
            style={{
              fontSize: scale(14),
            }}
          >
            Choose the services you need first. After selecting services, you’ll
            see a list of barbers who provide those services.
          </CustomSecondaryText>

          <TouchableOpacity
            onPress={() => {
              setAppointmentPopupType({
                selectServices: true,
                selectBarber: false,
              });

              if (is_editAppointment) {
                router.back();
                router.push({
                  pathname: "/editAppointmentCalender",
                  params: {
                    selectedAppointment: JSON.stringify(
                      selectedAppointmentParse,
                    ),
                  },
                });
              } else {
                router.replace("/appointmentCalendar");
              }
            }}
            style={[
              styles.queueButton,
              { backgroundColor: colors.accentColor },
            ]}
            activeOpacity={0.85}
          >
            <CustomText style={styles.queueButtonText}>
              Select Services
            </CustomText>
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
            Select Barber First
          </CustomText>
          <CustomSecondaryText
            style={{
              fontFamily: "AirbnbCereal_W_Md",
              color: colors.secondaryText,
              fontSize: scale(14),
            }}
          >
            Choose a barber first. You'll then see the list of services offered
            by that barber and can select what you want.
          </CustomSecondaryText>

          <TouchableOpacity
            onPress={() => {
              setAppointmentPopupType({
                selectServices: false,
                selectBarber: true,
              });

              if (is_editAppointment) {
                router.back();
                router.push({
                  pathname: "/editAppointmentCalender",
                  params: {
                    selectedAppointment: JSON.stringify(
                      selectedAppointmentParse,
                    ),
                  },
                });
              } else {
                router.replace("/appointmentCalendar");
              }
            }}
            style={[
              styles.queueButton,
              { backgroundColor: colors.accentColor },
            ]}
            activeOpacity={0.85}
          >
            <CustomText style={styles.queueButtonText}>
              Select Barber
            </CustomText>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Pressable>
  );
};

export default appointmentpopup;

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
