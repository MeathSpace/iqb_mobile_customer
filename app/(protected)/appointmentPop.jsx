import { BASE_URL } from "@/utils/api";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CustomSecondaryText from "../../components/CustomSecondaryText";
import CustomText from "../../components/CustomText";
import { useAuth } from "../../context/AuthContext";
import { useGlobal } from "../../context/GlobalContext";
import { ddmmformatDate } from "../../utils/ddmmformatDate";

const appointmentPop = () => {
  const [paymentSettingsLoading, setPaymentSettingsLoading] = useState(false);
  const [paymentSettingsData, setPaymentSettingsData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const getSalonPaymentSettings = async () => {
        try {
          setPaymentSettingsLoading(true);
          const { data } = await axios.get(
            `${BASE_URL}/mobileRoutes/getPaymentSettings?salonId=${authenticatedUser?.salonId}`,
          );
          setPaymentSettingsData(data?.response?.[1]);
        } catch (error) {
          console.log("Error fetching salon settings ", error);
        } finally {
          setPaymentSettingsLoading(false);
        }
      };

      getSalonPaymentSettings();
    }, []),
  );

  // console.log(paymentSettingsData?.enabled);

  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams();

  const selectedAppointmentParse = params?.selectedAppointment
    ? JSON.parse(params?.selectedAppointment)
    : {};
  const { authenticatedUser } = useAuth();

  // console.log("selectedAppointmentParse ", selectedAppointmentParse)
  const [deleteAppointmentLoader, setDeleteAppointmentLoader] = useState(false);

  const { appointmentListData, setAppointmentListData } = useGlobal();

  const confirmDeleteHandler = () => {
    Alert.alert(
      "Delete Appointment",
      "Are you sure you want to delete this appointment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          style: "destructive",
          onPress: () => deleteHandler(),
        },
      ],
      { cancelable: true },
    );
  };

  const deleteHandler = async () => {
    try {
      setDeleteAppointmentLoader(true);

      const { data } = await axios.delete(
        `${BASE_URL}/mobileRoutes/deleteAppointments`,
        {
          data: {
            salonId: authenticatedUser?.salonId,
            appointmentId: selectedAppointmentParse?._id,
          },
        },
      );

      setDeleteAppointmentLoader(false);

      router.back();

      // Alert.alert(
      //   "Appointment Deleted",
      //   "The appointment was deleted successfully.",
      //   [
      //     {
      //       text: "OK",
      //       onPress: () => {
      //         router.back();
      //       },
      //     },
      //   ],
      //   { cancelable: false }
      // );
    } catch (error) {
      // Toast.error(error?.response?.data?.message)
      Alert.alert(
        "Warning !",
        `${error?.response?.data?.message}`,
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ],
        { cancelable: false },
      );
      console.log("Error deleting appointment ", error);
    } finally {
      setDeleteAppointmentLoader(false);
    }
  };

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
          width: "90%",
          backgroundColor: colors.background,
          borderRadius: scale(10),
          padding: scale(15),
          gap: verticalScale(20),
          borderColor: "gray",
          borderWidth: scale(1),
        }}
      >
        <CustomText
          style={{
            fontFamily: "AirbnbCereal_W_XBd",
            fontSize: scale(16),
            textAlign: "center",
          }}
        >
          Manage Appointment
        </CustomText>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardColor,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Image
            source={{
              uri: selectedAppointmentParse?.barberProfile?.[0]?.url,
            }}
            style={[
              styles.image,
              {
                borderWidth: scale(1),
                borderColor: colors.queueBorder,
              },
            ]}
          />
          <View style={styles.info}>
            <CustomText
              style={[styles.title, { fontFamily: "AirbnbCereal_W_XBd" }]}
              numberOfLines={1}
            >
              {selectedAppointmentParse?.barbername}
            </CustomText>

            <CustomSecondaryText style={styles.datetime}>
              {`${moment(selectedAppointmentParse?.appointmentDate).format(
                "dddd",
              )}  |  ${ddmmformatDate(
                selectedAppointmentParse?.appointmentDate?.split("T")[0],
              )}  |  ${selectedAppointmentParse?.timeSlots?.split("-")[0]}`}
            </CustomSecondaryText>

            <CustomSecondaryText style={[styles.meta, {}]}>
              {authenticatedUser?.currency}{" "}
              {selectedAppointmentParse?.services?.reduce(
                (sum, service) => sum + (service?.servicePrice || 0),
                0,
              )}{" "}
              • {selectedAppointmentParse?.services.length} service
              {selectedAppointmentParse?.services.length > 1 ? "s" : ""}
            </CustomSecondaryText>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: scale(10),
          }}
        >
          <Pressable
            disabled={deleteAppointmentLoader}
            onPress={() => {
              confirmDeleteHandler();
            }}
            style={{
              height: verticalScale(35),
              width: "48%",
              backgroundColor: "#ef4444",
              borderRadius: scale(4),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {deleteAppointmentLoader ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <CustomText style={{ color: "#fff" }}>Cancel</CustomText>
            )}
          </Pressable>
          <Pressable
            onPress={() => {
              if (paymentSettingsData?.enabled) {
                Alert.alert(
                  "Updation Not Allowed",
                  "This appointment cannot be updated because payment has already been enabled for it. Please contact the salon for assistance.",
                  [{ text: "OK" }],
                  { cancelable: true },
                );
                return;
              }

              router.replace({
                pathname: "/appointmentpopup",
                params: {
                  selectedAppointment: JSON.stringify(selectedAppointmentParse),
                  is_editAppointment: true,
                },
              });
            }}
            style={{
              height: verticalScale(35),
              width: "48%",
              backgroundColor: "#2dd4bf",
              borderRadius: scale(4),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CustomText style={{ color: "#fff" }}>Edit</CustomText>
          </Pressable>
        </View>
      </Pressable>
    </Pressable>
  );
};

export default appointmentPop;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: scale(12),
    padding: scale(12),
    borderWidth: scale(1),
  },
  image: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(12),
    marginRight: scale(12),
  },
  info: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {},
  datetime: {
    fontSize: moderateScale(12),
    marginTop: verticalScale(2),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(8),
  },
  meta: {
    fontSize: moderateScale(12),
  },
});
