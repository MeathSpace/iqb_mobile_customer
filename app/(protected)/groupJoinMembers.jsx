import { BASE_URL } from "@/utils/api";
import { AntDesign, Feather } from "@expo/vector-icons";
import { usePreventRemove, useTheme } from "@react-navigation/native";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
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
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Toast } from "toastify-react-native";
import CustomSecondaryText from "../../components/CustomSecondaryText";
import CustomText from "../../components/CustomText";
import { AddIcon, ArrowLeftIcon, ProfileIcon } from "../../constants/icons";
import { useAuth } from "../../context/AuthContext";
import { useGlobal } from "../../context/GlobalContext";
import i18n from "../../src/localization/i18n";


const GroupJoinMembers = () => {

  const baseContent = i18n.t("protected.groupJoinMembers")

  const { authenticatedUser } = useAuth();
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
          setPaymentSettingsData(data?.response?.[0]);
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
  const insets = useSafeAreaInsets();

  function formatMinutesToHrMin(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
    if (hours > 0) return `${hours}hr`;
    return `${mins}m`;
  }

  const {
    groupJoinMembers,
    setGroupJoinMembers,
    memberName,
    setMemberName,
    setSelectedMemberServices,
    setSelectedMemberBarber,
  } = useGlobal();

  const removeGroupMember = (member) => {
    const filteredData = groupJoinMembers.filter(
      (item) => item.id !== member.id,
    );
    setGroupJoinMembers(filteredData);
  };

  const editNavigationAllowRef = useRef(false);

  const editMember = (item) => {
    const filteredData = groupJoinMembers.filter(
      (member) => member.id !== item.id,
    );
    setGroupJoinMembers(filteredData);

    setMemberName(item.memberName);
    setSelectedMemberServices(item.selectedServices);
    setSelectedMemberBarber(item.selectedMemberBarber);

    editNavigationAllowRef.current = true;
    router.back();
  };

  const totalServicePrice = groupJoinMembers?.reduce((total, member) => {
    const memberTotal = member.selectedServices?.reduce((sum, service) => {
      return sum + (service.servicePrice || 0);
    }, 0);
    return total + memberTotal;
  }, 0);

  const totalServiceEwt = groupJoinMembers?.reduce((total, member) => {
    const memberTotal = member.selectedServices?.reduce((sum, service) => {
      return sum + (service.serviceEWT || 0);
    }, 0);
    return total + memberTotal;
  }, 0);

  const totalServicesLength = groupJoinMembers?.reduce(
    (total, item) => total + (item?.selectedServices?.length || 0),
    0,
  );

  // usePreventRemove(true, ({ data }) => {
  //     // Block back action silently
  //     if (editNavigationAllowRef?.current) {
  //         console.log("UnBlocked")
  //         router.push("/groupJoin")

  //     } else {
  //         console.log("Blocked ..")
  //     }

  // });

  usePreventRemove(true, ({ data }) => {
    if (editNavigationAllowRef.current) {
      // Already allowed
      router.push("/groupJoin");
    } else {
      // Show confirmation alert
      Alert.alert(
        "Discard group join data?",
        "All selected members will be cleared, and the group join information will be reset.",
        [
          {
            text: "Cancel",
            style: "destructive",
            // style: 'cancel',
            onPress: () => {
              // Do nothing: block remains
            },
          },
          {
            text: "OK",
            // style: 'destructive',
            onPress: () => {
              // editNavigationAllowRef.current = true; // temporarily allow
              // router.push('/groupJoin'); // now push
              setMemberName(authenticatedUser?.name);
              setSelectedMemberBarber(null);
              setSelectedMemberServices([]);
              setGroupJoinMembers([]);
              router.push("/queuelist");
            },
          },
        ],
        { cancelable: true },
      );
    }
  });

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
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: scale(10),
            marginBottom: verticalScale(20),
          }}
        >
          <Pressable
            onPress={() => {
              Alert.alert(
                "Discard group join data?",
                "All selected members will be cleared, and the group join information will be reset.",
                [
                  {
                    text: "Cancel",
                    style: "destructive",
                    // style: 'cancel',
                    onPress: () => {
                      // Do nothing: block remains
                    },
                  },
                  {
                    text: "OK",
                    // style: 'destructive',
                    onPress: () => {
                      setMemberName(authenticatedUser?.name);
                      setSelectedMemberBarber(null);
                      setSelectedMemberServices([]);
                      setGroupJoinMembers([]);
                      router.push("/queuelist");
                    },
                  },
                ],
                { cancelable: true },
              );
            }}
          >
            <ArrowLeftIcon color={colors.text} />
          </Pressable>
          <CustomText
            style={{ fontFamily: "AirbnbCereal_W_XBd", fontSize: scale(18) }}
          >
            {baseContent.header}
          </CustomText>
        </View>

        <FlatList
          data={groupJoinMembers}
          contentContainerStyle={{
            gap: verticalScale(10),
          }}
          renderItem={({ item }) => {
            return (
              <View
                style={[
                  styles.groupCard,
                  {
                    backgroundColor: colors.cardColor,
                    borderColor: colors.queueBorder,
                  },
                ]}
              >
                <View
                  style={{
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    width: scale(50),
                    height: scale(50),
                    borderRadius: scale(60),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ProfileIcon color="#22c55e" />
                </View>

                <View
                  style={{
                    gap: verticalScale(10),
                    width: "78%",
                  }}
                >
                  <View>
                    <CustomText
                      style={{
                        fontFamily: "AirbnbCereal_W_XBd",
                        fontSize: scale(18),
                        width: "70%",
                      }}
                    >
                      {item?.memberName === authenticatedUser?.name
                        ? baseContent.you
                        : item?.memberName}{" "}
                      <CustomText
                        style={{
                          color: colors.accentColor,
                        }}
                      >
                        {item?.memberName === authenticatedUser?.name
                          ? baseContent.host
                          : ""}
                      </CustomText>
                    </CustomText>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: scale(5),
                      }}
                    >
                      <View
                        style={{
                          width: scale(7),
                          height: scale(7),
                          borderRadius: scale(10),
                          backgroundColor: colors.accentColor,
                        }}
                      />
                      <CustomText
                        style={{
                          fontSize: scale(12),
                          fontFamily: "AirbnbCereal_W_Bd",
                          color: colors.accentColor,
                        }}
                      >
                        {baseContent.ready}
                      </CustomText>
                    </View>
                  </View>

                  <View
                    style={{
                      height: verticalScale(1),
                      backgroundColor: colors.queueBorder,
                      flex: 1,
                    }}
                  />

                  <View
                    style={{
                      gap: verticalScale(5),
                    }}
                  >
                    <CustomSecondaryText style={{ flexWrap: "wrap" }}>
                      {baseContent.services}{" "}
                      {item.selectedServices
                        ?.map((ser) => ser?.serviceName)
                        .join(" | ")}
                    </CustomSecondaryText>

                    <CustomSecondaryText>
                      {baseContent.stylist} {item?.selectedMemberBarber?.name}
                    </CustomSecondaryText>
                    <CustomText
                      style={{
                        fontFamily: "AirbnbCereal_W_Bd",
                      }}
                    >
                      {baseContent.subtotal} {authenticatedUser?.currency}{" "}
                      {item?.selectedServices?.reduce(
                        (acc, service) => acc + service.servicePrice,
                        0,
                      )}{" "}
                      (
                      {formatMinutesToHrMin(
                        item?.selectedServices?.reduce(
                          (acc, service) => acc + service.serviceEWT,
                          0,
                        ),
                      )}
                      )
                    </CustomText>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => editMember(item)}
                  style={[
                    styles.editButton,
                    {
                      backgroundColor: `${colors.accentColor}1A`,
                      right: !(item?.memberName === authenticatedUser?.name)
                        ? scale(50)
                        : scale(12),
                    },
                  ]}
                >
                  <Feather
                    name="edit-2"
                    size={moderateScale(16)}
                    color={colors.accentColor}
                  />
                </TouchableOpacity>

                {!(item?.memberName === authenticatedUser?.name) ? (
                  <TouchableOpacity
                    onPress={() => removeGroupMember(item)}
                    style={[
                      styles.deleteButton,
                      {
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                      },
                    ]}
                  >
                    <AntDesign
                      name="delete"
                      size={moderateScale(16)}
                      color="#ef4444"
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            );
          }}
          keyExtractor={(item, index) => item.id}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            groupJoinMembers?.length === 5 ? null : (
              <TouchableOpacity
                onPress={() => {
                  setMemberName("");
                  router.push("/groupAddMemberModal");
                }}
                style={[
                  styles.addMemberButton,
                  {
                    borderColor: colors.text,
                  },
                ]}
              >
                <AddIcon color={colors.text} />
                <CustomText>{baseContent.addMember}</CustomText>
              </TouchableOpacity>
            )
          }
        />
      </View>

      {groupJoinMembers?.length > 0 ? (
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
              {authenticatedUser?.currency} {totalServicePrice}
            </CustomText>
            <CustomSecondaryText>
              {groupJoinMembers?.length}{" "}
              {groupJoinMembers?.length === 1 ? baseContent.member : baseContent.members} |{" "}
              {formatMinutesToHrMin(totalServiceEwt)}
            </CustomSecondaryText>
          </View>

          <TouchableOpacity
            onPress={() => {
              if (!groupJoinMembers || groupJoinMembers.length < 2) {
                Toast.error("At least two members are needed");
                return;
              }

              if (groupJoinMembers.length > 5) {
                Toast.error("You can only add up to 5 members in a group");
                return;
              }

              router.push({
                pathname: "/groupJoinModal",
                params: {
                  groupJoinMembers: JSON.stringify(groupJoinMembers),
                  totalServicePrice,
                  totalServiceEwt,
                  totalServicesLength,
                  paymentSettingsData: JSON.stringify(paymentSettingsData),
                },
              });
            }}
            style={[styles.queueButton, {backgroundColor: colors.accentColor}]}
            activeOpacity={0.85}
            disabled={paymentSettingsLoading}
          >
            <CustomText style={styles.queueButtonText}>{baseContent.joinQueue}</CustomText>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default GroupJoinMembers;

const styles = StyleSheet.create({
  groupCard: {
    borderWidth: scale(1),
    borderRadius: scale(8),
    padding: scale(15),
    flexDirection: "row",
    gap: scale(15),
    position: "relative",
  },

  editButton: {
    position: "absolute",
    top: verticalScale(12),
    padding: scale(8),
    borderRadius: 999,
  },

  deleteButton: {
    position: "absolute",
    top: verticalScale(12),
    right: scale(12),
    padding: scale(8),
    borderRadius: 999,
  },

  addMemberButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(10),
    borderWidth: scale(1),
    borderStyle: "dotted",
    borderRadius: scale(8),
    height: verticalScale(40),
    paddingHorizontal: scale(20),
    alignSelf: "center",
    marginTop: verticalScale(10),
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

// import { usePreventRemove } from '@react-navigation/native';
// import { useRouter, Stack } from 'expo-router';
// import { useRef } from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';

// const GroupJoinMembers = () => {

//     const router = useRouter();
//     const allowNavigationRef = useRef(false);

//     usePreventRemove(true, ({ data }) => {
//         if (allowNavigationRef.current) {
//             // console.log("Triggered jjj")
//             router.push("/queuelist"); // or router.replace(), router.back() etc.
//         }
//         // Block back action silently
//     });

//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text>Prevent Back Navigation</Text>
//             <Button
//                 title="Allow Back & Go"
//                 onPress={() => {
//                     allowNavigationRef.current = true;
//                     router.back(); // or router.dismiss(), etc.
//                 }}
//             />
//         </View>
//     )
// }

// export default GroupJoinMembers

// const styles = StyleSheet.create({})
