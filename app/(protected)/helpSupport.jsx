import {
    Pressable,
    StyleSheet,
    TextInput,
    View,
    Keyboard,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Alert
} from 'react-native'
import React, { useState } from 'react'
import { CloseIcon, ErrorIcon } from '../../constants/icons'
import { scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../constants/Colors';
import CustomText from '../../components/CustomText';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import { Toast } from 'toastify-react-native'

const helpSupport = () => {
    const router = useRouter()
    const { colors } = useTheme()

    const { authenticatedUser } = useAuth()

    const [subject, setSubject] = useState("")
    const [body, setBody] = useState("")

    const [subjectError, setSubjectError] = useState("")
    const [bodyError, setBodyError] = useState("")

    const [sendMailLoading, setSendMailLoading] = useState(false)

    const sendCustomerSupportMail = async () => {
        try {
            if (!subject) {
                setSubjectError("Subject is required");
                return;
            }

            if (!body) {
                setBodyError("Body is required");
                return;
            }

            setSendMailLoading(true);

            const { data } = await axios.post(`${BASE_URL}/customer/sendSupportMailCustomer`, {
                salonId: authenticatedUser?.salonId,
                email: authenticatedUser?.email,
                subject,
                text: body
            });

            setSendMailLoading(false);

            // Show success Alert
            Alert.alert(
                "Success",
                "Email has been sent successfully to admin.",
                [
                    {
                        text: "OK",
                        onPress: () => router.back(), // navigate back after user acknowledges
                    },
                ],
                { cancelable: false }
            );

        } catch (error) {
            setSendMailLoading(false);
            console.log("Error sending mail ", error);

            // Show error Alert
            Alert.alert(
                "Error",
                error?.response?.data?.message || "Something went wrong. Please try again later."
            );
        }
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: colors.background }]}>
                    <CustomText style={styles.title}>Help & Support</CustomText>

                    <CustomText style={styles.description}>
                        If you are experiencing any issues, please let us know. We will try to resolve them as soon as possible.
                    </CustomText>

                    <TextInput
                        editable
                        placeholder="Title"
                        placeholderTextColor="gray"
                        style={[
                            styles.inputField,
                            {
                                // borderColor: "#DDDDDD",
                                backgroundColor: "#00B0901A",
                                fontFamily: "AirbnbCereal_W_Md"
                            }
                        ]}
                        value={subject}
                        onChangeText={(text) => {
                            setSubjectError("")
                            setSubject(text)
                        }}
                    />

                    {
                        subjectError && (
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: scale(5),
                            }}>
                                <ErrorIcon color='red' size={scale(16)} />
                                <CustomText style={{ fontSize: scale(12), color: "red", }}>{subjectError}</CustomText>
                            </View>
                        )
                    }

                    <TextInput
                        style={[
                            styles.inputField,
                            {
                                minHeight: verticalScale(120),
                                textAlignVertical: "top",
                                borderColor: "#DDDDDD",
                                backgroundColor: "#00B0901A",
                                fontFamily: "AirbnbCereal_W_Md"
                            }
                        ]}
                        multiline
                        placeholderTextColor="gray"
                        placeholder="Explain the problem"
                        value={body}
                        onChangeText={(text) => {
                            setBodyError("")
                            setBody(text)
                        }}
                    />

                    {
                        bodyError && (
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: scale(5),
                            }}>
                                <ErrorIcon color='red' size={scale(16)} />
                                <CustomText style={{ fontSize: scale(12), color: "red", }}>{bodyError}</CustomText>
                            </View>
                        )
                    }

                    <Pressable
                        onPress={sendCustomerSupportMail}
                        style={styles.submitButton}>
                        {
                            sendMailLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <CustomText style={{ color: "#fff" }}>Submit</CustomText>
                            )
                        }
                    </Pressable>

                    <CustomText style={styles.contactText}>
                        You can contact us on this number{" "}
                        <CustomText style={styles.phoneNumber}>+44 1234567892</CustomText>
                    </CustomText>

                    <Pressable
                        onPress={() => router.back()}
                        style={styles.closeButton}
                    >
                        <CloseIcon
                            size={scale(16)}
                            color="#E11D48"
                        />
                    </Pressable>
                </View>
            </View>

        </TouchableWithoutFeedback>
    )
}

export default helpSupport

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.2)",
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        width: "90%",
        borderRadius: scale(8),
        borderWidth: scale(1),
        borderColor: "gray",
        justifyContent: "space-between",
        gap: verticalScale(10),
        padding: scale(15),
        position: 'relative'
    },
    title: {
        fontFamily: "AirbnbCereal_W_Bd",
        fontSize: scale(18),
        textAlign: "center"
    },
    description: {
        color: "gray",
        fontSize: scale(14),
    },
    inputField: {
        borderRadius: scale(4),
        // borderWidth: scale(1),
        padding: scale(16),
    },
    submitButton: {
        height: verticalScale(44),
        width: "100%",
        borderRadius: scale(8),
        backgroundColor: Colors.modeColor.colorCode,
        justifyContent: "center",
        alignItems: "center",
    },
    contactText: {
        fontSize: scale(14),
    },
    phoneNumber: {
        color: Colors.modeColor.colorCode,
        fontSize: scale(14),
    },
    closeButton: {
        position: "absolute",
        top: verticalScale(10),
        right: scale(10),
        width: scale(30),
        height: scale(30),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E11D481A",
        borderRadius: scale(40),
    }
})
