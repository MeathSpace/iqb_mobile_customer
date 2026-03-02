import { BASE_URL } from "@/utils/api";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
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

const GroupJoinBarber = () => {
  // const { data } = useLocalSearchParams();

  // const selectedMemberServices = JSON.parse(data)

  const {
    setSelectedMemberBarber,
    selectedMemberBarber,
    selectedMemberServices,
    setGroupJoinMembers,
    memberName,
    setMemberName,
    setSelectedMemberServices,
  } = useGlobal();

  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { authenticatedUser } = useAuth();

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
    if (selectedMemberServices.length > 0) {
      const fetchBarbersByMultipleServiceId = async () => {
        try {
          setBarberList((prev) => ({ ...prev, loading: true }));

          const { data } = await axios.post(
            `${BASE_URL}/mobileRoutes/getBarberByMultipleServiceId`,
            {
              salonId: authenticatedUser.salonId,
              serviceIds: selectedMemberServices.map((item) => item.serviceId),
            },
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
          console.log("Error fetching barbers by multiple service Id", error);
        }
      };

      fetchBarbersByMultipleServiceId();
    }
  }, []);

  const totalPrice = selectedMemberServices?.reduce(
    (acc, service) => acc + service.servicePrice,
    0,
  );
  const totalTime = selectedMemberServices?.reduce(
    (acc, service) => acc + service.serviceEWT,
    0,
  );
  const totalServices = selectedMemberServices?.length;

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
            Group Join (Stylists)
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
                  onPress={() => setSelectedMemberBarber(item)}
                  style={[
                    styles.barberCard,
                    {
                      backgroundColor: colors.cardColor,
                      borderColor:
                        selectedMemberBarber?.barberId === item?.barberId
                          ? colors.accentColor
                          : colors.queueBorder,
                      borderWidth:
                        selectedMemberBarber?.barberId === item?.barberId
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
            <CustomText style={styles.cardTitle}>No Stylists</CustomText>
            <CustomText
              style={[styles.cardSubtitle, { color: colors.secondaryText }]}
            >
              Unfortunately, there are no available stylists for the selected
              services at the moment.
            </CustomText>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.bookButton, {backgroundColor: colors.accentColor}]}
              activeOpacity={0.85}
            >
              <CustomText style={styles.bookButtonText}>
                Choose Services Again
              </CustomText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {selectedMemberServices?.length ? (
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
          <View style={{}}>
            <CustomText
              style={{ fontFamily: "AirbnbCereal_W_XBd", fontSize: scale(18) }}
            >
              {authenticatedUser?.currency} {totalPrice.toFixed(2)}
            </CustomText>
            <CustomSecondaryText>
              {totalServices} {totalServices === 1 ? "service" : "services"} |{" "}
              {formatMinutesToHrMin(totalTime)}
            </CustomSecondaryText>
          </View>

          <TouchableOpacity
            onPress={() => {
              if (!selectedMemberBarber) {
                Toast.error("Please select a stylist");
                return;
              }
              if (selectedMemberServices.length === 0) {
                Toast.error("Please select a service");
                return;
              }
              // setGroupJoinMembers((prev) => [...prev, {
              //     id: Date.now(),
              //     memberName,
              //     selectedServices: selectedMemberServices,
              //     selectedMemberBarber
              // }])

              setGroupJoinMembers((prev) => {
                const newMember = {
                  id: Date.now(),
                  memberName,
                  selectedServices: selectedMemberServices,
                  selectedMemberBarber,
                };

                const updated = [...prev, newMember];

                // If any memberName matches the authenticatedUser name, move it to the top
                return updated.sort((a, b) => {
                  if (a.memberName === authenticatedUser?.name) return -1;
                  if (b.memberName === authenticatedUser?.name) return 1;
                  return 0;
                });
              });

              router.push("/groupJoinMembers");
              setSelectedMemberBarber({});
              setSelectedMemberServices([]);
              setMemberName("");
            }}
            style={[styles.queueButton, {backgroundColor: colors.accentColor}]}
            activeOpacity={0.85}
          >
            <CustomText style={styles.queueButtonText}>Continue</CustomText>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default GroupJoinBarber;

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
    // marginBottom: verticalScale(15), // mb-6
    alignItems: "center",
    justifyContent: "center",
  },
  queueButtonText: {
    color: "#fff", // text-white
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(16),
  },
});
