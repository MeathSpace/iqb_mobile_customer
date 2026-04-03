import { BASE_URL } from "@/utils/api";
import { usePreventRemove, useTheme } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import { Toast } from "toastify-react-native";
import CustomSecondaryText from "../../components/CustomSecondaryText";
import CustomText from "../../components/CustomText";
import Skeleton from "../../components/Skeleton";
import { ArrowLeftIcon, ProfileIcon } from "../../constants/icons";
import { useAuth } from "../../context/AuthContext";
import { useGlobal } from "../../context/GlobalContext";
import i18n from "../../src/localization/i18n"

const singleJoinServicesBarber = () => {

  const baseContent = i18n.t("protected.singleJoinServicesBarber")

  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { authenticatedUser } = useAuth();

  const { setQueueJoinType, queueJoinType, joinPopupType, setJoinPopupType } =
    useGlobal();

  let hasUnsavedChanges = true;

  usePreventRemove(
    hasUnsavedChanges, // This boolean determines if removal should be prevented
    ({ data }) => {
      Alert.alert(
        "Confirm",
        "If you go back now, your queue will be reset",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => null, // Do nothing, stay on screen
          },
          {
            text: "OK",
            onPress: () => {
              setQueueJoinType({
                barberSelect: false,
                serviceSelect: false,
              });
              setJoinPopupType({
                single: false,
                group: false,
              });
              router.push("/(tabs)/home");
            },
          },
        ], // Only an 'OK' button
      );
    },
  );

  function formatMinutesToHrMin(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
    if (hours > 0) return `${hours}hr`;
    return `${mins}m`;
  }

  const [barberList, setBarberList] = useState({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  useEffect(() => {
    const getAvailableBarbersForQ = async () => {
      try {
        setBarberList((prev) => ({ ...prev, loading: true }));

        const { data } = await axios.get(
          `${BASE_URL}/mobileRoutes/getAvailableBarbersForQ?salonId=${authenticatedUser.salonId}`,
        );

        setBarberList((prev) => ({
          ...prev,
          loading: false,
          data: data?.response,
          success: true,
          error: null,
        }));
      } catch (error) {
        setBarberList((prev) => ({
          ...prev,
          loading: false,
          data: null,
          success: false,
          error: error,
        }));
        console.log("Error fetching barbers", error);
      }
    };

    getAvailableBarbersForQ();
  }, []);

  const [selectBarber, setSelectedBarber] = useState("");

  const totalPrice = barberList?.data?.reduce(
    (acc, barber) => acc + barber.servicePrice,
    0,
  );
  const totalTime = barberList?.data?.reduce(
    (acc, barber) => acc + barber.barberEWT,
    0,
  );
  const totalServices = barberList?.data?.length;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          flex: 1,
          padding: scale(10),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: scale(10),
            marginBottom: verticalScale(20), // Added some space below header
          }}
        >
          <Pressable onPress={() => router.back()}>
            <ArrowLeftIcon color={colors.text} size={scale(16)} />
          </Pressable>
          <CustomText
            style={{
              flex: 1,
              fontFamily: "AirbnbCereal_W_XBd",
              fontSize: scale(18),
            }}
          >
            {baseContent.header} (
            {authenticatedUser?.salonType === "Barber Shop"
              ? baseContent.barbers
              : baseContent.stylists}{" "}
            )
          </CustomText>
        </View>

        {barberList?.loading ? (
          <FlatList
            key={2}
            data={[1, 2, 3, 4, 5, 6, 7, 8]}
            columnWrapperStyle={{
              columnGap: scale(10),
            }}
            ItemSeparatorComponent={() => (
              <View style={{ height: scale(10) }} />
            )}
            renderItem={({ item }) => {
              return (
                <Skeleton
                  width={scale(160)}
                  height={scale(170)}
                  borderRadius={scale(8)}
                />
              );
            }}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: verticalScale(60),
            }}
            numColumns={2}
          />
        ) : barberList?.data?.length > 0 ? (
          <FlatList
            key={2}
            data={barberList?.data}
            columnWrapperStyle={{
              columnGap: scale(10),
            }}
            ItemSeparatorComponent={() => (
              <View style={{ height: scale(10) }} />
            )}
            renderItem={({ item }) => {
              return (
                <Pressable
                  onPress={() => setSelectedBarber(item)}
                  style={[
                    styles.barberCard,
                    {
                      backgroundColor: colors.cardColor,
                      borderColor:
                        selectBarber?.barberId === item?.barberId
                          ? colors.accentColor
                          : colors.queueBorder,
                      borderWidth:
                        selectBarber?.barberId === item?.barberId
                          ? scale(2)
                          : scale(1),
                    },
                  ]}
                >
                  <Image
                    style={[
                      styles.barberCardImage,
                      {
                        borderWidth: scale(1),
                        borderColor: colors.queueBorder,
                      },
                    ]}
                    source={{ uri: item?.profile?.[0]?.url }}
                    contentFit="cover"
                    transition={300}
                  />
                  <CustomText
                    style={{
                      fontFamily: "AirbnbCereal_W_XBd",
                    }}
                  >
                    {item?.name}
                  </CustomText>
                  <CustomSecondaryText>
                    ~{formatMinutesToHrMin(item?.barberEWT)}
                  </CustomSecondaryText>
                </Pressable>
              );
            }}
            keyExtractor={(item) => item?.barberId}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: verticalScale(60),
            }}
            numColumns={2}
          />
        ) : (
          <View
            style={[
              styles.upcomingCard,
              {
                backgroundColor: colors.cardColor,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: "rgba(13, 148, 136, 0.1)" },
              ]}
            >
              <ProfileIcon size={scale(32)} color={colors.accentColor} />
            </View>
            <CustomText style={styles.cardTitle}>
              {baseContent.no}{" "}
              {authenticatedUser?.salonType === "Barber Shop"
                ? baseContent.barbers
                : baseContent.stylists}{" "}
            </CustomText>
            <CustomText
              style={[styles.cardSubtitle, { color: colors.secondaryText }]}
            >
              {baseContent.info1}{" "}
              {authenticatedUser?.salonType === "Barber Shop"
                ? baseContent.barbers
                : baseContent.stylists}{" "}
              {baseContent.info2}
            </CustomText>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.bookButton, {backgroundColor: colors.accentColor}]}
              activeOpacity={0.85}
            >
              <CustomText style={styles.bookButtonText}>
                {baseContent.chooseServicesAgain}
              </CustomText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {selectBarber ? (
        <View
          style={{
            // backgroundColor: colors.cardColor,
            borderTopColor: colors.queueBorder,
            borderTopWidth: scale(1),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: scale(10),
          }}
        >
          <View />

          <TouchableOpacity
            onPress={() => {
              if (!selectBarber) {
                Toast.error("Please select a stylist");
                return;
              }

              router.push({
                pathname: "/singleJoinBarberServices",
                params: {
                  selectBarber: JSON.stringify(selectBarber),
                },
              });
            }}
            style={[styles.queueButton, {backgroundColor: colors.accentColor}]}
            activeOpacity={0.85}
          >
            <CustomText style={styles.queueButtonText}>{baseContent.continue}</CustomText>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default singleJoinServicesBarber;

const styles = StyleSheet.create({
  barberCard: {
    // width: scale(103), for 3 cards
    width: scale(160),
    // height: verticalScale(150),
    borderRadius: scale(8),
    justifyContent: "center",
    alignItems: "center",
    padding: scale(10),
    gap: verticalScale(5),
  },

  barberCardImage: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(120),
  },

  upcomingCard: {
    // backgroundColor: '#ffffff',
    borderRadius: scale(12),
    padding: scale(20),
    alignItems: "center",
    // borderColor: '#e5e7eb',
    borderWidth: scale(1),
    gap: verticalScale(20),
    marginBottom: verticalScale(10),
  },

  iconContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(80),
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "auto",
  },
  cardTitle: {
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(20),
    textAlign: "center",
    // marginBottom: verticalScale(4),
  },
  cardSubtitle: {
    fontFamily: "AirbnbCereal_W_Bd",
    fontSize: scale(16),
    textAlign: "center",
    // marginBottom: verticalScale(20)
  },
  bookButton: {
    width: "100%",
     // bg-teal-500
    paddingVertical: verticalScale(16), // py-4
    borderRadius: scale(12), // rounded-xl
    // marginBottom: verticalScale(15), // mb-6
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonText: {
    color: "#fff", // text-white
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(16),
  },

  queueButton: {
    width: "40%",
    // bg-teal-500
    paddingVertical: verticalScale(12), // py-4
    borderRadius: scale(8), // rounded-xl
    alignItems: "center",
    justifyContent: "center",
  },
  queueButtonText: {
    color: "#fff", // text-white
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(16),
  },
});
