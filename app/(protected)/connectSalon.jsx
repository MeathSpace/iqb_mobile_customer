import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { CloseIcon, ErrorIcon } from '../../constants/icons';
import CustomText from '../../components/CustomText'
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';

const connectSalon = () => {

    const router = useRouter()

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.2)",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <View
                style={{
                    width: "85%",
                    height: verticalScale(244),
                    borderRadius: scale(8),
                    borderWidth: scale(1),
                    borderColor: "#DDDDDD",
                    paddingVertical: verticalScale(24),
                    paddingHorizontal: scale(48),
                    gap: verticalScale(32),
                    backgroundColor: "#F7F7F7",
                    position: 'relative'
                }}
            >
                <View style={{ gap: verticalScale(25) }}>
                    <ErrorIcon size={scale(45)} color={"#FF6961"} style={{ textAlign: "center" }} />
                    <CustomText
                        style={{
                            textAlign: "center"
                        }}
                    >Are you sure you want to disconnect?</CustomText>
                </View>

                <Pressable
                    style={{
                        height: verticalScale(44),
                        width: scale(180),
                        borderRadius: scale(40),
                        backgroundColor: Colors.modeColor.colorCode,
                        justifyContent: "center",
                        alignItems: "center",
                        marginHorizontal: "auto"
                    }}
                >
                    <CustomText style={{ color: "#fff" }}>Change Salon</CustomText>
                </Pressable>

                <Pressable
                    onPress={() => router.back()}
                    style={{
                        position: "absolute",
                        top: verticalScale(10),
                        right: scale(10),
                    }}
                >
                    <CloseIcon
                        size={scale(16)}
                        style={{
                            backgroundColor: "#E8194833",
                            color: "#E11D48",
                            borderColor: "#E11D48",
                            borderWidth: scale(1),
                            borderRadius: scale(20),
                        }}
                    />
                </Pressable>


            </View>
        </View>
    )
}

export default connectSalon

const styles = StyleSheet.create({})