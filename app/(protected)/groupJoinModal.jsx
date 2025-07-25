import { ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import CustomText from '../../components/CustomText';

const GroupJoinModal = () => {

    const router = useRouter()
    const { colors } = useTheme();

    function formatMinutesToHrMin(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
        if (hours > 0) return `${hours}hr`;
        return `${mins}m`;
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
                router.back()
            }}
        >
            <Pressable
                onPress={() => { }}
                style={[styles.modalContainer, {
                    backgroundColor: colors.background,
                    borderColor: colors.queueBorder
                }]}>
                <CustomText style={{
                    fontFamily: "AirbnbCereal_W_XBd",
                    fontSize: scale(18),
                    textAlign: "center"
                }}>Confirm Group Booking</CustomText>

                <View style={{
                    borderRadius: scale(10),
                    backgroundColor: colors.cardColor,
                    padding: scale(10),
                    gap: verticalScale(10)
                }}>
                    <View style={styles.cardContent}>
                        <CustomText>Members</CustomText>
                        <CustomText>2</CustomText>
                    </View>

                    <View style={styles.cardContent}>
                        <CustomText>Total Services</CustomText>
                        <CustomText>2</CustomText>
                    </View>

                    <View style={styles.cardContent}>
                        <CustomText>Est. Time</CustomText>
                        <CustomText>{formatMinutesToHrMin(120)}</CustomText>
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
                        }}>$ 21</CustomText>
                    </View>

                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[styles.button, {
                            // backgroundColor: '#ef4444'
                        }]}>
                        <CustomText style={{ fontFamily: "AirbnbCereal_W_Bd" }}>Cancel</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        // onPress={}
                        // disabled={singleJoinLoader}
                        // onPress={singleJoinPressed}
                        onPress={() => router.replace("/groupJoinSuccessPage")}
                        style={[styles.button, {
                            backgroundColor: '#14b8a6'
                        }]}>
                        {
                            false ? (<ActivityIndicator color={"#fff"} />) : (<CustomText style={{ color: "#fff", fontFamily: "AirbnbCereal_W_Bd" }}>Join Queue</CustomText>)
                        }
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Pressable>
    )
}

export default GroupJoinModal

const styles = StyleSheet.create({
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