import { BASE_URL } from "@/utils/api";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  Alert,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CustomSecondaryText from "../../../../components/CustomSecondaryText";
import CustomTabView from "../../../../components/CustomTabView";
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

const index = () => {
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
      label: "Favorites",
      icon: <HeartOutlineIcon color={"#dc2626"} />,
      lightBg: "#fee2e2",
      darkBg: "#7f1d1d33",
      lightColor: "#dc2626",
      darkColor: "#fca5a5",
      route: "/myFavourites",
      display: true,
    },
    {
      label: "Change Salon",
      icon: <SalonIcon color={"#7c3aed"} />,
      lightBg: "#ede9fe",
      darkBg: "#5b21b633",
      lightColor: "#7c3aed",
      darkColor: "#c4b5fd",
      route: "/connectSalon",
      display: authenticatedUser?.salonId ? true : false,
    },
    {
      label: "Help & Support",
      icon: <HelpIcon color={"#059669"} />,
      lightBg: "#d1fae5",
      darkBg: "#065f4633",
      lightColor: "#059669",
      darkColor: "#6ee7b7",
      route: "/helpSupport",
      display: true,
    },
    {
      label: "About",
      icon: <AboutIcon color={"#0284c7"} />,
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
      "Delete Account",
      "Are you sure you want to permanently delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
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
    // <View
    //   style={{
    //     backgroundColor: colors.background,
    //     flex: 1,
    //     paddingHorizontal: scale(10),
    //   }}
    // >
    //   <View style={styles.header}>

    //     <CustomText style={{ fontSize: scale(18), fontFamily: "AirbnbCereal_W_XBd" }}>Profile</CustomText>

    //     {/* Right section - Notification bell */}
    //     <Pressable
    //       style={styles.bellWrapper}
    //       activeOpacity={0.7}
    //       onPress={async () => {

    //         if (newNotification.value) {
    //           await AsyncStorage.setItem(
    //             "newNotification",
    //             JSON.stringify({
    //               email: authenticatedUser?.email,
    //               value: false
    //             })
    //           );
    //           setNewNotification({
    //             email: "",
    //             value: false
    //           })
    //         }

    //         router.push("/notification")
    //       }}
    //     >
    //       <NotificationIcon size={moderateScale(24)} color={colors.notificationBellColor} />
    //       {/* {
    //         newNotification.value && (
    //           <View style={styles.badge} />
    //         )
    //       } */}

    //     </Pressable>
    //   </View>

    //   <ScrollView
    //     contentContainerStyle={{ paddingBottom: 130 }}
    //     showsVerticalScrollIndicator={false}
    //   >
    //     {/* User Info Card */}

    //     <LinearGradient
    //       colors={['#14b8a6', '#0d9488']}
    //       style={styles.card}
    //       start={{ x: 0, y: 0 }}
    //       end={{ x: 1, y: 1 }}
    //     >
    //       <Image
    //         source={{ uri: authenticatedUser?.profile?.[0]?.url }}
    //         style={styles.avatar}
    //         onError={() => { }}
    //       />
    //       <View>
    //         <CustomText style={styles.cardTitle}>{authenticatedUser?.name}</CustomText>
    //         <CustomText style={[styles.cardSubtitle, { width: "100%" }]} numberOfLines={2}>{authenticatedUser?.email}</CustomText>
    //       </View>
    //       <TouchableOpacity style={styles.editButton} onPress={() => router.push("/editProfile")}>
    //         <Feather name="edit-2" size={moderateScale(16)} color="#fff" />
    //       </TouchableOpacity>
    //     </LinearGradient>

    //     {/* Profile Options */}
    //     <View style={[styles.optionsBox, { backgroundColor: colors.cardColor, borderColor: colors.queueBorder }]}>
    //       {profileOptions.map((opt, idx) => {
    //         if (!opt.display) return null; // Skip if display is false

    //         return (
    //           <View key={idx}>
    //             <TouchableOpacity style={styles.optionRow} onPress={() => router.push(opt.route)}>
    //               <View style={[styles.optionIconWrapper, { backgroundColor: opt.lightBg }]}>
    //                 {/* <Feather name={opt?.icon} size={moderateScale(24)} color={opt.lightColor} /> */}
    //                 {opt?.icon}
    //               </View>
    //               <CustomText style={[styles.optionLabel]}>{opt.label}</CustomText>
    //               <RightIcon size={moderateScale(16)} color={colors.text} style={{ marginLeft: 'auto' }} />
    //             </TouchableOpacity>
    //             {/* {idx !== profileOptions.length - 1 && (
    //               <View style={[styles.separator, { backgroundColor: colors.queueBorder }]} />
    //             )} */}
    //             <View style={[styles.separator, { backgroundColor: colors.queueBorder }]} />
    //           </View>
    //         );
    //       })}

    //       <View>
    //         <TouchableOpacity
    //           style={styles.optionRow}
    //           onPress={() => {
    //             deleteHandler()
    //           }}
    //         >
    //           <View
    //             style={[
    //               styles.optionIconWrapper,
    //               { backgroundColor: '#fee2e2' } // light red bg for delete
    //             ]}
    //           >
    //             <Feather name="trash-2" size={moderateScale(24)} color="#ef4444" />
    //             {/* trash icon + red color */}
    //           </View>
    //           <CustomText style={[styles.optionLabel]}>Delete Account</CustomText>
    //           <RightIcon
    //             size={moderateScale(16)}
    //             color={colors.text}
    //             style={{ marginLeft: 'auto' }}
    //           />
    //         </TouchableOpacity>

    //         {/* <View
    //           style={[
    //             styles.separator,
    //             { backgroundColor: colors.queueBorder }]}
    //         /> */}
    //       </View>

    //     </View>

    //     {/* Log Out */}
    //     <TouchableOpacity
    //       style={[styles.logoutButton, { backgroundColor: '#fee2e2' }]}
    //       onPress={logoutPressed}
    //     >
    //       <Feather name="log-out" size={moderateScale(16)} color={'#dc2626'} />
    //       <CustomText style={[styles.logoutText, { color: '#dc2626' }]}>Log Out</CustomText>
    //     </TouchableOpacity>
    //   </ScrollView>
    // </View>

    <CustomTabView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      {/* ================= HEADER ================= */}
      <View
        style={{
          paddingHorizontal: scale(10),
          paddingBottom: verticalScale(12),
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <CustomText
            style={{
              fontSize: moderateScale(22),
              fontFamily: "AirbnbCereal_W_XBd",
            }}
          >
            Live Queue
          </CustomText>

          <CustomSecondaryText
            style={{
              fontSize: moderateScale(13),
              marginTop: verticalScale(4),
              color: "#64748b",
            }}
          >
            Manage your account & preferences
          </CustomSecondaryText>
        </View>

        <Pressable
          onPress={async () => {
            if (newNotification.value) {
              await AsyncStorage.setItem(
                "newNotification",
                JSON.stringify({
                  email: authenticatedUser?.email,
                  value: false,
                }),
              );
              setNewNotification({ email: "", value: false });
            }
            router.push("/notification");
          }}
          style={({ pressed }) => ({
            width: scale(44),
            height: scale(44),
            borderRadius: moderateScale(22),
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: pressed ? "#e5e7eb" : "#fff",
            backgroundColor: colors.cardColor
          })}
        >
          <NotificationIcon
            size={moderateScale(22)}
            color={colors.notificationBellColor}
          />

          {newNotification.value && (
            <View
              style={{
                position: "absolute",
                top: scale(9),
                right: scale(9),
                width: scale(8),
                height: scale(8),
                borderRadius: scale(4),
                backgroundColor: "#ef4444",
              }}
            />
          )}
        </Pressable>
      </View>

      {/* ================= BIG WHITE SURFACE ================= */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: verticalScale(24),
        }}
      >
        {/* ================= USER SECTION (BLINKIT STYLE) ================= */}
        <View
          style={{
            borderBottomWidth: verticalScale(10),
            borderBottomColor: colors.thickBorderColor,
          }}
        >
          <View
            style={{
              // backgroundColor: colors.card,
              padding: scale(16),
              flexDirection: "row",
              alignItems: "center",
              gap: scale(14),
            }}
          >
            {/* Avatar with accent ring */}
            <View
              style={{
                width: scale(60),
                height: scale(60),
                borderRadius: moderateScale(30),
                backgroundColor: colors.cardColor,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: authenticatedUser?.profile?.[0]?.url }}
                style={{
                  width: scale(52),
                  height: scale(52),
                  borderRadius: moderateScale(26),
                  backgroundColor: "#e5e7eb",
                }}
              />
            </View>

            <View style={{ flex: 1 }}>
              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_XBd",
                  fontSize: moderateScale(16),
                  // color: "#0f172a",
                }}
              >
                {authenticatedUser?.name}
              </CustomText>

              <CustomSecondaryText
                numberOfLines={1}
                style={{
                  marginTop: verticalScale(4),
                  fontSize: moderateScale(13),
                  // color: "#64748b",
                }}
              >
                {authenticatedUser?.email}
              </CustomSecondaryText>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/editProfile")}
              activeOpacity={0.85}
              style={{
                width: scale(36),
                height: scale(36),
                borderRadius: moderateScale(18),
                backgroundColor: colors.cardColor,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Feather name="edit-2" size={16} color="#0f766e" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= OPTIONS SECTION ================= */}
        <View
          style={{
            paddingHorizontal: scale(16),
            paddingVertical: verticalScale(8),
            borderBottomWidth: verticalScale(10),
            // borderBottomColor: "#f1f5f9",
            borderBottomColor: colors.thickBorderColor,
          }}
        >
          {profileOptions.map((opt, idx) => {
            if (!opt.display) return null;

            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.8}
                onPress={() => router.push(opt.route)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: verticalScale(14),
                }}
              >
                <View
                  style={{
                    width: scale(44),
                    height: scale(44),
                    borderRadius: moderateScale(22),
                    backgroundColor: opt.lightBg,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {opt.icon}
                </View>

                <View style={{ marginLeft: scale(14) }}>
                  <CustomText
                    style={{
                      fontFamily: "AirbnbCereal_W_Bd",
                      fontSize: moderateScale(15),
                    }}
                  >
                    {opt.label}
                  </CustomText>

                  <CustomSecondaryText
                    style={{
                      fontSize: moderateScale(12),
                      marginTop: verticalScale(2),
                    }}
                  >
                    Manage {opt.label.toLowerCase()}
                  </CustomSecondaryText>
                </View>

                <RightIcon
                  size={moderateScale(16)}
                  color="#94a3b8"
                  style={{ marginLeft: "auto" }}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ================= DANGER SECTION ================= */}
        <View
          style={{
            paddingHorizontal: scale(16),
            paddingVertical: verticalScale(8),
            borderBottomWidth: verticalScale(10),
            borderBottomColor: colors.thickBorderColor,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={deleteHandler}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: verticalScale(14),
            }}
          >
            <View
              style={{
                width: scale(44),
                height: scale(44),
                borderRadius: moderateScale(22),
                backgroundColor: "#fee2e2",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Feather name="trash-2" size={20} color="#ef4444" />
            </View>

            <CustomText
              style={{
                marginLeft: scale(14),
                fontFamily: "AirbnbCereal_W_Bd",
                fontSize: moderateScale(15),
                color: "#ef4444",
              }}
            >
              Delete Account
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* ================= LOGOUT ================= */}
        <View
          style={{
            paddingHorizontal: scale(16),
            paddingVertical: verticalScale(20),
          }}
        >
          <TouchableOpacity
            onPress={logoutPressed}
            activeOpacity={0.85}
            style={{
              backgroundColor: "#fee2e2",
              borderRadius: moderateScale(24),
              paddingVertical: verticalScale(16),
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: scale(10),
            }}
          >
            <Feather name="log-out" size={18} color="#dc2626" />
            <CustomText
              style={{
                fontFamily: "AirbnbCereal_W_XBd",
                fontSize: moderateScale(15),
                color: "#dc2626",
              }}
            >
              Log Out
            </CustomText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </CustomTabView>
  );
};

export default index;
