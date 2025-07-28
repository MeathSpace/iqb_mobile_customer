import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect, useRouter } from 'expo-router'
import { useTheme } from '@react-navigation/native'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import CustomText from '../../components/CustomText';
import { useGlobal } from '../../context/GlobalContext';
import { ErrorIcon } from '../../constants/icons';

const groupAddMemberModal = () => {

    const router = useRouter()
    const { colors } = useTheme();

    const {
        memberName,
        setMemberName,
        setSelectedMemberServices,
        setSelectedMemberBarber,
    } = useGlobal()
    const [memberNameError, setMemberNameError] = useState("")

    const addMemberPressed = () => {
        if (!memberName) {
            setMemberNameError("Member name is required");
            return;
        } else if (memberName.length < 2) {
            setMemberNameError("Member name must be at least 2 characters");
            return;
        } else if (memberName.length > 20) {
            setMemberNameError("Member name must be at most 20 characters");
            return;
        }
        setSelectedMemberServices([])
        setSelectedMemberBarber(null)
        router.replace("/groupJoin")
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
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
                        }}>Add New Member</CustomText>

                        <TextInput
                            editable
                            placeholder="Enter member's name"
                            placeholderTextColor={colors.secondaryText}
                            style={[false ? styles.inputFielderror : styles.inputField, {
                                color: colors.text,
                                backgroundColor: colors.cardColor,
                                borderWidth: scale(1),
                                borderColor: colors.queueBorder,

                            }]}
                            onChangeText={(text) => {
                                setMemberNameError("")
                                setMemberName(text)
                            }}
                            value={memberName}
                        />

                        {
                            memberNameError && (
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: scale(5),
                                }}>
                                    <ErrorIcon color='red' size={scale(16)} />
                                    <CustomText style={{ fontSize: scale(12), color: "red", }}>{memberNameError}</CustomText>
                                </View>
                            )
                        }

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                onPress={() => router.back()}
                                style={[styles.button, {
                                    // backgroundColor: '#ef4444'
                                }]}>
                                <CustomText style={{ fontFamily: "AirbnbCereal_W_Bd" }}>Cancel</CustomText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={addMemberPressed}
                                // disabled={singleJoinLoader}
                                // onPress={singleJoinPressed}
                                style={[styles.button, {
                                    backgroundColor: '#14b8a6'
                                }]}>
                                {
                                    false ? (<ActivityIndicator color={"#fff"} />) : (<CustomText style={{ color: "#fff", fontFamily: "AirbnbCereal_W_Bd" }}>Add</CustomText>)
                                }
                            </TouchableOpacity>
                        </View>

                    </Pressable>

                </Pressable>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default groupAddMemberModal

const styles = StyleSheet.create({
    modalContainer: {
        width: "85%",
        borderRadius: scale(8),
        borderWidth: scale(1),
        padding: scale(10),
        gap: verticalScale(15)
    },

    inputField: {
        height: verticalScale(40),
        borderRadius: scale(8),
        paddingHorizontal: scale(10),
        fontSize: moderateScale(14),
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
    }
})