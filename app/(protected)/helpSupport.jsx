import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { CloseIcon } from '../../constants/icons'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../../constants/Colors';
import CustomText from '../../components/CustomText';
import { useRouter } from 'expo-router';

const helpSupport = () => {

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
                    height: verticalScale(474),
                    borderRadius: scale(8),
                    borderWidth: scale(1),
                    borderColor: "#DDDDDD",
                    paddingVertical: verticalScale(22),
                    paddingHorizontal: scale(15),
                    // gap: verticalScale(32),
                    justifyContent: "space-between",
                    backgroundColor: "#F7F7F7",
                    position: 'relative'
                }}
            >
                <CustomText
                    style={{
                        fontFamily: "AirbnbCereal_W_Bd",
                        fontSize: scale(18),
                        marginBottom: verticalScale(25),
                        textAlign: "center"
                    }}
                >Help & Support</CustomText>

                <CustomText
                    style={{
                        fontFamily: "AirbnbCereal_W_Bk"
                    }}
                >
                    If you are experiencing any issues, please let us know. We will try to resolve them as soon as possible.
                </CustomText>


                <TextInput
                    editable
                    placeholder="Title"
                    placeholderTextColor={"#1F2024"}
                    style={[false ? styles.inputFielderror : styles.inputField, { borderColor: "#DDDDDD", backgroundColor: Colors.modeColor.colorCode3, fontFamily: "AirbnbCereal_W_Bk", }]}
                    // onChangeText={(text) => {
                    //     setEmailError("")
                    //     setEmail(text)
                    // }}
                    // value={email}
                    value=''
                />

                <TextInput
                    style={[false ? styles.inputFielderror : styles.inputField, { minHeight: verticalScale(120), textAlignVertical: "top", borderColor: "#DDDDDD", backgroundColor: Colors.modeColor.colorCode3, fontFamily: "AirbnbCereal_W_Bk", }]}
                    multiline
                    placeholder='Explain the problem'
                />


                <Pressable
                    style={{
                        height: verticalScale(44),
                        width: "100%",
                        borderRadius: scale(8),
                        backgroundColor: Colors.modeColor.colorCode,
                        justifyContent: "center",
                        alignItems: "center",
                        marginHorizontal: "auto"
                    }}
                >
                    <CustomText style={{ color: "#fff" }}>Submit</CustomText>
                </Pressable>

                <CustomText
                    style={{
                        fontSize: scale(14),
                        fontFamily: "AirbnbCereal_W_Bk"
                    }}
                >You can contact us on this number <CustomText
                    style={{
                        color: Colors.modeColor.colorCode,
                        fontSize: scale(14),
                        fontFamily: "AirbnbCereal_W_Bk"
                    }}
                >+44 1234567892</CustomText></CustomText>

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

export default helpSupport

const styles = StyleSheet.create({
    inputField: {
        height: verticalScale(48),
        borderRadius: scale(4),
        borderWidth: scale(1),
        padding: scale(16)
    }
})