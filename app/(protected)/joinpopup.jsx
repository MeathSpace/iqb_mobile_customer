import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { scale, verticalScale } from 'react-native-size-matters'
import CustomText from '../../components/CustomText'
import { Colors } from '../../constants/Colors'
import { useRouter } from 'expo-router'

const joinpopup = () => {

    const router = useRouter()

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
                    width: "85%",
                    height: verticalScale(350),
                    backgroundColor: "#fff",
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
                >Join Queue</CustomText>

                <View
                    style={{
                        gap: verticalScale(10)
                    }}
                >
                    <CustomText
                        style={{
                            fontFamily: "AirbnbCereal_W_Blk",
                            fontSize: scale(16)
                        }}
                    >Single Join</CustomText>
                    <CustomText
                        style={{
                            fontFamily: "AirbnbCereal_W_Md",
                            color: "rgba(0,0,0,0.5)",
                            fontSize: scale(12)
                        }}
                    >Join the queue as a single customer. This option is for individuals waiting alone for salon services.</CustomText>
                    <Pressable
                        onPress={() => router.replace("/singleJoin")}
                        style={{
                            height: verticalScale(40),
                            borderRadius: scale(4),
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: Colors.modeColor.colorCode
                        }}
                    >
                        <CustomText style={{ color: "#fff" }}>Single Join</CustomText>
                    </Pressable>
                </View>

                <View
                    style={{
                        gap: verticalScale(10)
                    }}
                >
                    <CustomText
                        style={{
                            fontFamily: "AirbnbCereal_W_Blk",
                            fontSize: scale(16)
                        }}
                    >Group Join</CustomText>
                    <CustomText
                        style={{
                            fontFamily: "AirbnbCereal_W_Md",
                            color: "rgba(0,0,0,0.5)",
                            fontSize: scale(12)
                        }}
                    >Join the queue with multiple people at once. Ideal for friends or family members visiting the salon together.</CustomText>
                    <Pressable
                        onPress={() => router.replace("/groupJoin")}
                        style={{
                            height: verticalScale(40),
                            borderRadius: scale(4),
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: Colors.modeColor.colorCode
                        }}
                    >
                        <CustomText style={{ color: "#fff" }}>Group Join</CustomText>
                    </Pressable>
                </View>
            </Pressable>
        </Pressable>
    )
}

export default joinpopup

const styles = StyleSheet.create({})