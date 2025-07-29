import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { scale, verticalScale } from 'react-native-size-matters'
import CustomText from '../../components/CustomText'
import { Colors } from '../../constants/Colors'
import { useRouter } from 'expo-router'
import { useTheme } from '@react-navigation/native'
import { useAuth } from '../../context/AuthContext'
import { useGlobal } from '../../context/GlobalContext'

const joinpopup = () => {

    const router = useRouter()
    const { colors } = useTheme()
    const { authenticatedUser } = useAuth()

    const {
        setMemberName,
    } = useGlobal()

    return (
        <Pressable
            onPress={() => router.back()}
            style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Pressable
                onPress={() => { }}
                style={{
                    width: "95%",
                    // height: verticalScale(350),
                    backgroundColor: colors.cardColor,
                    borderRadius: scale(12),
                    padding: scale(20),
                    gap: verticalScale(20),
                    borderColor: colors.cardBorder,
                    borderWidth: scale(1)
                }}
            >
                <CustomText
                    style={{
                        textAlign: "center",
                        fontFamily: "AirbnbCereal_W_Blk",
                        fontSize: scale(22),
                    }}
                >Join Queue</CustomText>

                <View
                    style={{
                        gap: verticalScale(10)
                    }}
                >
                    <CustomText
                        style={{
                            fontFamily: "AirbnbCereal_W_XBd",
                            fontSize: scale(18)
                        }}
                    >Single Join</CustomText>
                    <CustomText
                        style={{
                            fontFamily: "AirbnbCereal_W_Md",
                            color: colors.secondaryText,
                            fontSize: scale(14)
                        }}
                    >Join the queue as a single customer. This option is for individuals waiting alone for salon services.</CustomText>

                    <TouchableOpacity
                        onPress={() => router.replace("/singleJoin")}
                        style={styles.queueButton} activeOpacity={0.85}>
                        <CustomText style={styles.queueButtonText}>Single Join</CustomText>
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        gap: verticalScale(10)
                    }}
                >
                    <CustomText
                        style={{
                            fontFamily: "AirbnbCereal_W_XBd",
                            fontSize: scale(18)
                        }}
                    >Group Join</CustomText>
                    <CustomText
                        style={{
                            fontFamily: "AirbnbCereal_W_Md",
                            color: colors.secondaryText,
                            fontSize: scale(14)
                        }}
                    >Join the queue with multiple people at once. Ideal for friends or family members visiting the salon together.</CustomText>

                    <TouchableOpacity
                        // onPress={() => router.replace("/groupJoin")}
                        onPress={() => {
                            setMemberName(authenticatedUser?.name)
                            router.replace("/groupHostMemberModal")
                        }}
                        style={styles.queueButton} activeOpacity={0.85}>
                        <CustomText style={styles.queueButtonText}>Group Join</CustomText>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Pressable>
    )
}

export default joinpopup

const styles = StyleSheet.create({

    queueButton: {
        width: '100%',
        backgroundColor: '#14b8a6', // bg-teal-500
        paddingVertical: verticalScale(16), // py-4
        borderRadius: scale(12), // rounded-xl
        marginBottom: verticalScale(15), // mb-6
        alignItems: 'center',
        justifyContent: 'center',
    },
    queueButtonText: {
        color: '#fff', // text-white
        fontFamily: "AirbnbCereal_W_XBd",
        fontSize: scale(16),
    },
})