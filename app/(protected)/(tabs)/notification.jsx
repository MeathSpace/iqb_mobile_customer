import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useRouter } from 'expo-router';
import CustomTabView from '../../../components/CustomTabView';
import { ArrowLeftIcon } from '../../../constants/icons';
import CustomText from '../../../components/CustomText';
import { Image } from 'expo-image';

const notification = () => {

    const router = useRouter()

    return (
        <CustomTabView
            style={{
                paddingVertical: verticalScale(0),
                paddingTop: verticalScale(10),
                paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(20)
            }}>
            <Pressable
                onPress={() => router.push("/home")}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: scale(10),
                    height: verticalScale(60)
                }}
            >
                <ArrowLeftIcon size={scale(18)} />
                <CustomText>Notifcation</CustomText>
            </Pressable>

            {
                [0, 1, 2].map((item, index) => {
                    return (
                        <View
                            key={index}
                            style={{
                                minHeight: verticalScale(90),
                                borderBottomWidth: scale(1),
                                borderBottomColor: "#DDDDDD",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: scale(10)
                            }}
                        >
                            <Image
                                style={{ height: scale(65), width: scale(65), borderRadius: scale(40) }}
                                source={{ uri: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg" }}
                                // placeholder={{ blurhash }}
                                contentFit="cover"
                                transition={300}
                            />

                            <View style={{ gap: verticalScale(8), flex: 1 }}>
                                <CustomText
                                    style={{
                                        fontSize: scale(14)
                                    }}
                                >Your appointment with Wade Warren has been successfully made.</CustomText>
                                <CustomText
                                    style={{
                                        fontSize: scale(12),
                                        fontFamily: "AirbnbCereal_W_Bk"
                                    }}
                                >2 mins ago</CustomText>
                            </View>
                        </View>
                    )
                })
            }
        </CustomTabView>
    )
}

export default notification

const styles = StyleSheet.create({})