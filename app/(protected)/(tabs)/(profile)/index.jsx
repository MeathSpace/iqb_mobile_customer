import { BASE_URL } from "@/utils/api";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CustomText from "../../../../components/CustomText";
import {
  AboutIcon,
  HeartOutlineIcon,
  HelpIcon,
  NotificationIcon,
  RightIcon,
  SalonIcon,
} from "../../../../constants/icons";
import { useAuth } from "../../../../context/AuthContext";
import { useGlobal } from "../../../../context/GlobalContext";
import { useLanguage } from "../../../../context/LanguageContext";
import i18n from "../../../../src/localization/i18n";
import { useState } from "react";

const index = () => {
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const { changeLanguage, locale } = useLanguage();
  const baseContent = i18n.t("protected.profile");

  const { colors } = useTheme();
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();
  const {
    setSelectedBarber,
    setSelectedBarberServices,
    setCustomerName,
    rememberMe,
    setRememberMe,
    newNotification,
    setNewNotification,
    // hasRun
  } = useGlobal();

  const { setIsAuthenticated, authenticatedUser, setAuthenticatedUser } =
    useAuth();
  const router = useRouter();

  const profileOptions = [
    {
      label: baseContent.options.favorites,
      icon: <HeartOutlineIcon color={colors.accentColor} />,
      lightBg: "#fee2e2",
      darkBg: "#7f1d1d33",
      lightColor: "#dc2626",
      darkColor: "#fca5a5",
      route: "/myFavourites",
      display: true,
    },
    {
      label: baseContent.options.changeSalon,
      icon: <SalonIcon color={colors.accentColor} />,
      lightBg: "#ede9fe",
      darkBg: "#5b21b633",
      lightColor: "#7c3aed",
      darkColor: "#c4b5fd",
      route: "/connectSalon",
      display: authenticatedUser?.salonId ? true : false,
    },
    {
      label: baseContent.options.helpAndSupport,
      icon: <HelpIcon color={colors.accentColor} />,
      lightBg: "#d1fae5",
      darkBg: "#065f4633",
      lightColor: "#059669",
      darkColor: "#6ee7b7",
      route: "/helpSupport",
      display: true,
    },
    {
      label: baseContent.options.about,
      icon: <AboutIcon color={colors.accentColor} />,
      lightBg: "#e0f2fe",
      darkBg: "#1e3a8a33",
      lightColor: "#0284c7",
      darkColor: "#93c5fd",
      route: "/(about)",
      display: true,
    },
  ];

  const logoutPressed = async () => {
    if (isSignedIn) {
      await signOut();
    }
    setSelectedBarber({});
    setSelectedBarberServices([]);
    setCustomerName("");
    if (rememberMe) {
      await AsyncStorage.setItem(
        "LoggedInUser",
        JSON.stringify({
          email: authenticatedUser?.email,
          userPassword: authenticatedUser?.userPassword,
          authType: authenticatedUser?.AuthType,
        }),
      );
    } else {
      await AsyncStorage.removeItem("LoggedInUser");
    }
    await AsyncStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    setAuthenticatedUser(null);
    // router.push("/index")
  };

  const { user } = useUser();

  const deleteHandler = () => {
    Alert.alert(
      baseContent.options.deleteAccount.alert.header,
      baseContent.options.deleteAccount.alert.subHeader,
      [
        {
          text: baseContent.options.deleteAccount.alert.cancel,
          style: "cancel",
        },
        {
          text: baseContent.options.deleteAccount.alert.delete,
          style: "destructive",
          onPress: handleDeleteConfirmed,
        },
      ],
    );
  };

  const handleDeleteConfirmed = async () => {
    try {
      // Delete from your backend first

      await axios.post(`${BASE_URL}/customer/deleteCustomer`, {
        email: authenticatedUser?.email,
      });

      if (user) {
        // Delete user from Clerk
        await user.delete();
        await signOut();
      }

      setSelectedBarber({});
      setSelectedBarberServices([]);
      setCustomerName("");
      await AsyncStorage.removeItem("LoggedInUser");
      await AsyncStorage.removeItem("isAuthenticated");
      setIsAuthenticated(false);
      setAuthenticatedUser(null);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
        paddingHorizontal: scale(10),
      }}
    >
      <View style={styles.header}>
        <CustomText
          style={{ fontSize: scale(18), fontFamily: "AirbnbCereal_W_XBd" }}
        >
          {baseContent.heading}
        </CustomText>

        {/* Right section - Notification bell */}
        <Pressable
          style={styles.bellWrapper}
          activeOpacity={0.7}
          onPress={async () => {
            if (newNotification.value) {
              await AsyncStorage.setItem(
                "newNotification",
                JSON.stringify({
                  email: authenticatedUser?.email,
                  value: false,
                }),
              );
              setNewNotification({
                email: "",
                value: false,
              });
            }

            router.push("/notification");
          }}
        >
          <NotificationIcon
            size={moderateScale(24)}
            color={colors.notificationBellColor}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom:
            Platform.OS === "ios" ? verticalScale(120) : verticalScale(20),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card */}

        <LinearGradient
          colors={[colors.linearColor1, colors.linearColor2]}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Image
            source={{ uri: authenticatedUser?.profile?.[0]?.url }}
            style={styles.avatar}
            onError={() => {}}
          />
          <View>
            <CustomText style={styles.cardTitle}>
              {authenticatedUser?.name}
            </CustomText>
            <CustomText
              style={[styles.cardSubtitle, { width: "100%" }]}
              numberOfLines={2}
            >
              {authenticatedUser?.email}
            </CustomText>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/editProfile")}
          >
            <Feather name="edit-2" size={moderateScale(16)} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Profile Options */}
        <View
          style={[
            styles.optionsBox,
            {
              backgroundColor: colors.cardColor,
              borderColor: colors.queueBorder,
            },
          ]}
        >
          {profileOptions.map((opt, idx) => {
            if (!opt.display) return null; // Skip if display is false

            return (
              <View key={idx}>
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => router.push(opt.route)}
                >
                  <View
                    style={[
                      styles.optionIconWrapper,
                      // { backgroundColor: opt.lightBg },
                      {
                        backgroundColor: `${colors.accentColor}1A`,
                      },
                    ]}
                  >
                    {/* <Feather name={opt?.icon} size={moderateScale(24)} color={opt.lightColor} /> */}
                    {opt?.icon}
                  </View>
                  <CustomText style={[styles.optionLabel]}>
                    {opt.label}
                  </CustomText>
                  <RightIcon
                    size={moderateScale(16)}
                    color={colors.text}
                    style={{ marginLeft: "auto" }}
                  />
                </TouchableOpacity>
                <View
                  style={[
                    styles.separator,
                    { backgroundColor: colors.queueBorder },
                  ]}
                />
              </View>
            );
          })}

          <View>
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => {
                deleteHandler();
              }}
            >
              <View
                style={[
                  styles.optionIconWrapper,
                  { backgroundColor: "#DC26261A" }, // light red bg for delete
                ]}
              >
                <Feather
                  name="trash-2"
                  size={moderateScale(24)}
                  color="#DC2626"
                />
                {/* trash icon + red color */}
              </View>
              <CustomText style={[styles.optionLabel]}>
                {baseContent.options.deleteAccount.header}
              </CustomText>
              <RightIcon
                size={moderateScale(16)}
                color={colors.text}
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Language Section */}
        <CustomText
          style={{
            fontFamily: "AirbnbCereal_W_Bd",
          }}
        >
          {baseContent?.language?.header}
        </CustomText>

        <View
          style={[
            styles.optionsBox,
            {
              backgroundColor: colors.cardColor,
              borderColor: colors.queueBorder,
              marginTop: verticalScale(10),
            },
          ]}
        >
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setLanguageModalVisible(true)}
          >
            <View
              style={[
                styles.optionIconWrapper,
                { backgroundColor: `${colors.accentColor}1A` },
              ]}
            >
              <Feather
                name="globe"
                size={moderateScale(20)}
                color={colors.accentColor}
              />
            </View>

            <CustomText style={styles.optionLabel}>
              {locale === "en"
                ? baseContent?.language?.english
                : baseContent?.language?.german}
            </CustomText>

            <RightIcon
              size={moderateScale(16)}
              color={colors.text}
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        </View>

        {/* Language Modal */}
        <Modal
          visible={languageModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setLanguageModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setLanguageModalVisible(false)}
          >
            <Pressable
              style={[
                styles.modalContainer,
                { backgroundColor: colors.cardColor },
              ]}
            >
              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_XBd",
                  fontSize: scale(18),
                  marginBottom: verticalScale(16),
                }}
              >
                {baseContent?.language?.header}
              </CustomText>

              {/* English */}
              <TouchableOpacity
                style={styles.modalOption}
                onPress={async () => {
                  await AsyncStorage.setItem("currentLanguage", "en");
                  changeLanguage("en");
                  setLanguageModalVisible(false);
                }}
              >
                <View
                  style={[
                    styles.optionIconWrapper,
                    { backgroundColor: `${colors.accentColor}1A` },
                  ]}
                >
                  <Feather
                    name="globe"
                    size={moderateScale(20)}
                    color={colors.accentColor}
                  />
                </View>

                <View>
                  <CustomText style={styles.optionLabel}>English</CustomText>
                  <CustomText
                    style={[styles.optionLabel, { fontSize: scale(12) }]}
                  >
                    {baseContent?.language?.english}
                  </CustomText>
                </View>

                {locale === "en" && (
                  <Feather
                    name="check"
                    size={moderateScale(18)}
                    color={colors.accentColor}
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </TouchableOpacity>

              <View
                style={[
                  styles.separator,
                  { backgroundColor: colors.queueBorder },
                ]}
              />

              {/* German */}
              <TouchableOpacity
                style={styles.modalOption}
                onPress={async () => {
                  await AsyncStorage.setItem("currentLanguage", "de");
                  changeLanguage("de");
                  setLanguageModalVisible(false);
                }}
              >
                <View
                  style={[
                    styles.optionIconWrapper,
                    { backgroundColor: `${colors.accentColor}1A` },
                  ]}
                >
                  <Feather
                    name="globe"
                    size={moderateScale(20)}
                    color={colors.accentColor}
                  />
                </View>

                <View>
                  <CustomText style={styles.optionLabel}>German</CustomText>
                  <CustomText
                    style={[styles.optionLabel, { fontSize: scale(12) }]}
                  >
                    {baseContent?.language?.german}
                  </CustomText>
                </View>

                {locale === "de" && (
                  <Feather
                    name="check"
                    size={moderateScale(18)}
                    color={colors.accentColor}
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Log Out */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: "#DC26261A" }]}
          onPress={logoutPressed}
        >
          <Feather name="log-out" size={moderateScale(16)} color={"#DC2626"} />
          <CustomText style={[styles.logoutText, { color: "#DC2626" }]}>
            {baseContent.options.logout}
          </CustomText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: verticalScale(40),
  },

  bellWrapper: {
    padding: scale(8),
    borderRadius: scale(999),
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: scale(6),
    right: scale(6),
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: "#2dd4bf", // bg-teal-400
  },

  card: {
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(20),
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
    marginBottom: verticalScale(24),
    position: "relative",
  },
  avatar: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    borderWidth: scale(2),
    borderColor: "#fff",
  },
  cardTitle: {
    fontSize: scale(20),
    fontFamily: "AirbnbCereal_W_XBd",
    color: "#fff",
  },
  cardSubtitle: {
    fontSize: scale(14),
    color: "#fff",
    opacity: 0.9,
    marginTop: verticalScale(4),
  },
  editButton: {
    position: "absolute",
    top: verticalScale(12),
    right: scale(12),
    backgroundColor: "#ffffff33",
    padding: scale(8),
    borderRadius: 999,
  },
  optionsBox: {
    borderRadius: scale(16),
    borderWidth: scale(1),
    marginBottom: verticalScale(24),
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(16),
  },
  optionIconWrapper: {
    height: scale(40),
    width: scale(40),
    borderRadius: scale(12),
    justifyContent: "center",
    alignItems: "center",
  },
  optionLabel: {
    marginLeft: scale(12),
    fontFamily: "AirbnbCereal_W_Bd",
    fontSize: scale(16),
  },
  separator: {
    height: verticalScale(1),
    marginHorizontal: scale(16),
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: scale(16),
    borderRadius: scale(12),
    gap: scale(8),
  },
  logoutText: {
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: scale(20),
  },

  modalContainer: {
    borderRadius: scale(20),
    padding: scale(20),
  },

  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(14),
  },
});
