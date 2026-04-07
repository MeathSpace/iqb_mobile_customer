import { BASE_URL } from "@/utils/api";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import * as Calendar from "expo-calendar";
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
import i18n from "../../src/localization/i18n";
import { ddmmformatDate } from "../../utils/ddmmformatDate";

const appointmentPop = () => {
  const baseContent = i18n.t("protected.appointmentPop");

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

  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams();

  const selectedAppointmentParse = params?.selectedAppointment
    ? JSON.parse(params?.selectedAppointment)
    : {};
  const { authenticatedUser } = useAuth();

  const [deleteAppointmentLoader, setDeleteAppointmentLoader] = useState(false);

  const { appointmentListData, setAppointmentListData } = useGlobal();

  const confirmDeleteHandler = () => {
    Alert.alert(
      baseContent.alertBox.alertOne.header,
      baseContent.alertBox.alertOne.subHeader,
      [
        {
          text: baseContent.alertBox.alertOne.cancel,
          style: "cancel",
        },
        {
          text: baseContent.alertBox.alertOne.confirm,
          style: "destructive",
          onPress: () => {
            deleteHandler();
          },
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

      await deleteCalendarEvent(selectedAppointmentParse?.calenderEventId);

      setDeleteAppointmentLoader(false);

      router.back();
    } catch (error) {
      Alert.alert(
        baseContent.alertBox.alertTwo.header,
        `${error?.response?.data?.message}`,
        [
          {
            text: baseContent.alertBox.alertTwo.ok,
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

  const deleteCalendarEvent = async (calenderEventId) => {
    try {
      if (!calenderEventId) return;

      // ✅ Request permission again (important)
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          baseContent.alertBox.alertThree.header,
          baseContent.alertBox.alertThree.subHeader,
        );
        return;
      }

      // ✅ Delete event
      await Calendar.deleteEventAsync(calenderEventId);

      console.log("✅ Calendar event deleted successfully");
    } catch (error) {
      console.log("❌ Failed to delete calendar event:", error);
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
          {baseContent.header}
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
              • {selectedAppointmentParse?.services.length}{" "}
              {selectedAppointmentParse?.services.length === 1
                ? baseContent.service
                : baseContent.services}
            </CustomSecondaryText>
          </View>
        </View>

        {selectedAppointmentParse?.isPaid && (
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
                {baseContent.cancellation.header}
              </CustomText>
            </View>
            <CustomText
              style={{
                fontSize: moderateScale(12),
                color: "#9f1239",
                lineHeight: verticalScale(18),
              }}
            >
              {baseContent.cancellation.subHeader}
            </CustomText>
          </View>
        )}

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
              <CustomText style={{ color: "#fff" }}>
                {baseContent.cancel}
              </CustomText>
            )}
          </Pressable>
          <Pressable
            onPress={() => {
              // console.log(selectedAppointmentParse);
              router.replace({
                pathname: "/editAppointmentCalender",
                params: {
                  selectedAppointment: JSON.stringify(selectedAppointmentParse),
                  is_editAppointment: true,
                },
              });
            }}
            style={{
              height: verticalScale(35),
              width: "48%",
              backgroundColor: colors.accentColor,
              borderRadius: scale(4),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CustomText style={{ color: "#fff" }}>
              {baseContent.edit}
            </CustomText>
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
