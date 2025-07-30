import { ActivityIndicator, Alert, BackHandler, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import CustomText from '../../components/CustomText';
import { useAuth } from '../../context/AuthContext';
import { Toast } from 'toastify-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import { useGlobal } from '../../context/GlobalContext';
import { CheckIcon } from '../../constants/icons';

const GroupJoinModal = () => {

    const { groupJoinMembers, totalServicePrice, totalServiceEwt, totalServicesLength } = useLocalSearchParams();
    const groupJoinMembersParse = JSON.parse(groupJoinMembers)
    const { authenticatedUser } = useAuth()

    const {
        setGroupJoinMembers,
        setMemberName,
        setSelectedMemberServices,
        setSelectedMemberBarber,
    } = useGlobal()


    const router = useRouter()
    const { colors } = useTheme();

    function formatMinutesToHrMin(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
        if (hours > 0) return `${hours}hr`;
        return `${mins}m`;
    }

    const [groupJoinLoader, setGroupJoinLoader] = useState(false)
    const { newNotification, setNewNotification } = useGlobal()


    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (groupJoinLoader) {
                    // Prevent back during loading
                    return true; // <-- prevents default back behavior
                }
                return false; // allow default back
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [groupJoinLoader])
    );

    const groupJoinPressed = async () => {
        try {
            const groupJoinData = {
                salonId: authenticatedUser?.salonId,
                groupInfo: groupJoinMembersParse.map((item) => {
                    return {
                        barberId: item.selectedMemberBarber.barberId,
                        barberName: item.selectedMemberBarber.name,
                        customerEmail: authenticatedUser?.email,
                        joinedQType: "Group-Join",
                        methodUsed: "App",
                        mobileCountryCode: authenticatedUser?.mobileCountryCode,
                        mobileNumber: authenticatedUser?.mobileNumber,
                        name: item?.memberName,
                        services: item.selectedServices
                    }
                })
            }

            setGroupJoinLoader(true)

            const { data } = await axios.post(`${BASE_URL}/mobileRoutes/groupJoinQueue`, groupJoinData)
            Toast.success(data?.message)


            await AsyncStorage.setItem(
                "newNotification",
                JSON.stringify({
                    email: authenticatedUser?.email,
                    value: true
                })
            );

            setNewNotification({
                email: authenticatedUser?.email,
                value: true
            })

            setGroupJoinMembers([])
            setMemberName(authenticatedUser?.name)
            setSelectedMemberServices([])
            setSelectedMemberBarber({})

            // router.dismissTo("/queuelist")
            router.replace("/groupJoinSuccessPage")


            // setGroupJoinLoader(true)

        } catch (error) {
            setGroupJoinLoader(false)
            // Toast.error(error?.response?.data?.message)
            Alert.alert(
                "Notice",
                error?.response?.data?.message,
                [{ text: "OK" }]
            );
            console.log("Error doing group join ", error)
        }
    }

    return (
        <Pressable
            style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                justifyContent: "center",
                alignItems: "center"
            }}
            onPress={() => {
                if (!groupJoinLoader) {
                    router.back();
                }
            }}
        >
            <Pressable
                onPress={() => { }}
                style={[styles.modalContainer, {
                    backgroundColor: colors.cardColor,
                    borderColor: colors.queueBorder
                }]}>
                {/* <CustomText style={{
                    fontFamily: "AirbnbCereal_W_XBd",
                    fontSize: scale(18),
                    textAlign: "center"
                }}>Confirm Group Booking</CustomText> */}
                <View style={styles.iconContainer}>
                    <CheckIcon style={{
                        backgroundColor: colors.tabBackground,
                        padding: scale(3),
                        borderRadius: scale(50),
                    }}
                        size={scale(16)}
                        color={colors.text}
                    />
                    <CustomText style={styles.titleText}>Please Confirm</CustomText>
                </View>

                <View style={{
                    borderRadius: scale(10),
                    backgroundColor: colors.tabBackground,
                    padding: scale(10),
                    gap: verticalScale(10)
                }}>
                    <View style={styles.cardContent}>
                        <CustomText>Members</CustomText>
                        <CustomText>{groupJoinMembersParse?.length}</CustomText>
                    </View>

                    <View style={styles.cardContent}>
                        <CustomText>Total Services</CustomText>
                        <CustomText>{totalServicesLength}</CustomText>
                    </View>

                    <View style={styles.cardContent}>
                        <CustomText>Est. Time</CustomText>
                        <CustomText>{formatMinutesToHrMin(totalServiceEwt)}</CustomText>
                    </View>

                    <View style={{
                        height: verticalScale(1),
                        backgroundColor: colors.secondaryText
                    }} />

                    <View style={styles.cardContent}>
                        <CustomText style={{
                            fontFamily: "AirbnbCereal_W_XBd",
                            fontSize: scale(18)
                        }}>Total Price</CustomText>
                        <CustomText style={{
                            fontFamily: "AirbnbCereal_W_XBd",
                            fontSize: scale(18)
                        }}> {authenticatedUser?.currency} {totalServicePrice}</CustomText>
                    </View>

                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        onPress={() => {
                            if (!groupJoinLoader) {
                                router.back();
                            }
                        }}
                        style={[styles.button, {
                            // backgroundColor: '#ef4444'
                        }]}>
                        <CustomText style={{ fontFamily: "AirbnbCereal_W_Bd" }}>No</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        // onPress={() => router.replace("/groupJoinSuccessPage")}
                        disabled={groupJoinLoader}
                        onPress={groupJoinPressed}
                        style={[styles.button, {
                            backgroundColor: '#14b8a6'
                        }]}>
                        {
                            groupJoinLoader ? (<ActivityIndicator color={"#fff"} />) : (<CustomText style={{ color: "#fff", fontFamily: "AirbnbCereal_W_Bd" }}>Yes</CustomText>)
                        }
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Pressable>
    )
}

export default GroupJoinModal

const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(8)
    },
    titleText: {
        fontFamily: "AirbnbCereal_W_Bd"
    },
    modalContainer: {
        width: "85%",
        borderRadius: scale(8),
        borderWidth: scale(1),
        padding: scale(10),
        gap: verticalScale(15)
    },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: scale(10),
        marginTop: verticalScale(10)
    },
    button: {
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(6),
        borderRadius: scale(6),
    },

    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }
})