import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { scale, verticalScale } from 'react-native-size-matters'
import { Colors } from '../../constants/Colors'
import CustomText from '../../components/CustomText'
import { useTheme } from '@react-navigation/native'

const appointmentFilter = () => {

    const router = useRouter()

    const { colors } = useTheme()

    return (
        <Pressable
            onPress={() => router.back()}
            style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Pressable
                onPress={() => { }}
                style={{
                    width: "85%",
                    // height: verticalScale(350),
                    backgroundColor: colors.background,
                    borderColor: "gray",
                    borderWidth: scale(1),
                    borderRadius: scale(10),
                    padding: scale(15),
                    gap: verticalScale(20)
                }}
            >
                <CustomText
                    style={{
                        textAlign: "center",
                        fontFamily: "AirbnbCereal_W_Blk",
                        fontSize: scale(22),
                    }}
                >Filter</CustomText>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: scale(10),
                        flexWrap: "wrap"
                    }}
                >
                    <Pressable
                        style={{
                            alignSelf: "flex-start",
                            paddingHorizontal: scale(20),
                            borderRadius: scale(4),
                            height: verticalScale(40),
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: Colors.modeColor.colorCode
                        }}
                    ><CustomText style={{
                        color: "#fff"
                    }}>All</CustomText></Pressable>

                    <Pressable
                        style={{
                            alignSelf: "flex-start",
                            paddingHorizontal: scale(10),
                            borderRadius: scale(4),
                            height: verticalScale(40),
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#0BA3AD1A"
                        }}
                    ><CustomText style={{
                        color: Colors.modeColor.colorCode
                    }}>Upcomming</CustomText></Pressable>


                    <Pressable
                        style={{
                            alignSelf: "flex-start",
                            paddingHorizontal: scale(10),
                            borderRadius: scale(4),
                            height: verticalScale(40),
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#00B0901A"
                        }}
                    ><CustomText style={{
                        color: Colors.modeColor.colorCode
                    }}>Served</CustomText></Pressable>


                    <Pressable
                        style={{
                            alignSelf: "flex-start",
                            paddingHorizontal: scale(10),
                            borderRadius: scale(4),
                            height: verticalScale(40),
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#0BA3AD1A"
                        }}
                    ><CustomText style={{
                        color: Colors.modeColor.colorCode
                    }}>Cancelled</CustomText></Pressable>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    <Pressable
                        onPress={() => router.back()}
                        style={{
                            backgroundColor: "#E11D481A",
                            borderRadius: scale(4),
                            width: "46%",
                            justifyContent: "center",
                            alignItems: "center",
                            height: verticalScale(40)
                        }}
                    ><CustomText style={{
                        color: "#E11D48",
                    }}>Cancel</CustomText></Pressable>

                    <Pressable
                        style={{
                            backgroundColor: "#0BA3AD",
                            borderRadius: scale(4),
                            width: "46%",
                            justifyContent: "center",
                            alignItems: "center",
                            height: verticalScale(40)
                        }}
                    ><CustomText style={{
                        color: "#fff",
                    }}>Apply</CustomText></Pressable>

                </View>
            </Pressable>
        </Pressable>
    )
}

export default appointmentFilter

const styles = StyleSheet.create({})