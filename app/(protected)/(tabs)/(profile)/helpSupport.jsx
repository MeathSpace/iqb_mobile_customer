import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Linking,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import CustomText from "../../../../components/CustomText";
import { Colors } from "../../../../constants/Colors";
import { CloseIcon, ErrorIcon } from "../../../../constants/icons";
import { useAuth } from "../../../../context/AuthContext";
import i18n from "../../../../src/localization/i18n"
import api from "../../../../utils/api";

const helpSupport = () => {

  const baseContent = i18n.t("protected.helpAndSupport")

  const router = useRouter();
  const { colors } = useTheme();

  const { authenticatedUser } = useAuth();

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [subjectError, setSubjectError] = useState("");
  const [bodyError, setBodyError] = useState("");

  const [sendMailLoading, setSendMailLoading] = useState(false);

  const sendCustomerSupportMail = async () => {
    try {
      if (!subject) {
        setSubjectError(baseContent.errorStatesAndApi.subjectRequired);
        return;
      }

      if (!body) {
        setBodyError(baseContent.errorStatesAndApi.bodyRequired);
        return;
      }

      setSendMailLoading(true);

      const { data } = await api.post(
        `/customer/sendSupportMailCustomer`,
        {
          salonId: authenticatedUser?.salonId,
          email: authenticatedUser?.email,
          subject,
          text: body,
        },
      );

      setSendMailLoading(false);

      // Show success Alert
      Alert.alert(
        baseContent.alertBox.header,
        baseContent.alertBox.subHeader,
        [
          {
            text: baseContent.alertBox.ok,
            onPress: () => router.back(), // navigate back after user acknowledges
          },
        ],
        { cancelable: false },
      );
    } catch (error) {
      setSendMailLoading(false);
      console.log("Error sending mail ", error);

      // Show error Alert
      Alert.alert(
        baseContent.alertBox.error.header,
        error?.response?.data?.message ||
          baseContent.alertBox.error.subHeader,
      );
    }
  };

  const subjectTimeoutRef = useRef(null);
  const bodyTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (subjectTimeoutRef.current) clearTimeout(subjectTimeoutRef.current);
      if (bodyTimeoutRef.current) clearTimeout(bodyTimeoutRef.current);
    };
  }, []);

  const openLink = async (url) => {
    if (url) {
      await Linking.openURL(url);
    } else {
      console.warn("Invalid URL || Cannot Open it");
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        router.back();
        Keyboard.dismiss;
      }}
    >
      <View style={styles.overlay}>
        <Pressable
          onPress={() => {}}
          style={[
            styles.container,
            {
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <CustomText style={styles.title}>{baseContent.header}</CustomText>

          <CustomText
            style={[styles.description, { color: colors.secondaryText }]}
          >
            {baseContent.subHeader}
          </CustomText>

          <TextInput
            editable
            placeholder={baseContent.title.placeholder}
            placeholderTextColor="gray"
            style={[
              styles.inputField,
              {
                backgroundColor: colors.cardColor,
                borderWidth: scale(1),
                borderColor: colors.queueBorder,
                fontFamily: "AirbnbCereal_W_Md",
                color: colors.text,
              },
            ]}
            value={subject}
            onChangeText={(text) => {
              setSubjectError("");
              setSubject(text);

              if (subjectTimeoutRef.current) {
                clearTimeout(subjectTimeoutRef.current);
              }

              subjectTimeoutRef.current = setTimeout(() => {
                Keyboard.dismiss();
              }, 3000);
            }}
          />

          {subjectError && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(5),
              }}
            >
              <ErrorIcon color="red" size={scale(16)} />
              <CustomText style={{ fontSize: scale(12), color: "red" }}>
                {subjectError}
              </CustomText>
            </View>
          )}

          <TextInput
            style={[
              styles.inputField,
              {
                minHeight: verticalScale(120),
                textAlignVertical: "top",
                backgroundColor: colors.cardColor,
                borderWidth: scale(1),
                color: colors.text,
                borderColor: colors.queueBorder,
                fontFamily: "AirbnbCereal_W_Md",
              },
            ]}
            multiline
            placeholderTextColor="gray"
            placeholder={baseContent.body.placeholder}
            value={body}

            onChangeText={(text) => {
              setBodyError("");
              setBody(text);

              if (bodyTimeoutRef.current) {
                clearTimeout(bodyTimeoutRef.current);
              }

              bodyTimeoutRef.current = setTimeout(() => {
                Keyboard.dismiss();
              }, 3000);
            }}
          />

          {bodyError && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(5),
              }}
            >
              <ErrorIcon color="red" size={scale(16)} />
              <CustomText style={{ fontSize: scale(12), color: "red" }}>
                {bodyError}
              </CustomText>
            </View>
          )}

          <TouchableOpacity
            onPress={sendCustomerSupportMail}
            style={[styles.queueButton, {backgroundColor: colors.accentColor}]}
            activeOpacity={0.85}
          >
            {sendMailLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <CustomText style={styles.queueButtonText}>{baseContent.submit}</CustomText>
            )}
          </TouchableOpacity>

          <Pressable
            onPress={() => {
              openLink(`mailto:support@iqbook.io`);
            }}
          >
            <CustomText style={styles.contactText}>
              {baseContent.emailUs}{" "}
              <CustomText style={[styles.phoneNumber, { color: colors.accentColor}]}>
                {baseContent.email}
              </CustomText>
            </CustomText>
          </Pressable>

          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <CloseIcon size={scale(16)} color="#E11D48" />
          </Pressable>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default helpSupport;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "95%",
    borderRadius: scale(12),
    borderWidth: scale(1),
    justifyContent: "space-between",
    gap: verticalScale(10),
    padding: scale(17),
    position: "relative",
  },
  title: {
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(18),
    textAlign: "center",
  },
  description: {
    fontSize: scale(14),
  },
  inputField: {
    borderRadius: scale(4),
    // borderWidth: scale(1),
    padding: scale(16),
  },
  submitButton: {
    height: verticalScale(44),
    width: "100%",
    borderRadius: scale(8),
    backgroundColor: Colors.modeColor.colorCode,
    justifyContent: "center",
    alignItems: "center",
  },
  contactText: {
    fontSize: scale(14),
    textAlign: "center",
  },
  phoneNumber: {
    fontSize: scale(14),
  },
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
