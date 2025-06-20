// import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
// import React from 'react'
// import { CloseIcon } from '../../constants/icons'
// import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
// import { Colors } from '../../constants/Colors';
// import CustomText from '../../components/CustomText';
// import { useRouter } from 'expo-router';
// import { useTheme } from '@react-navigation/native';

// const helpSupport = () => {

//     const router = useRouter()
//     const { colors } = useTheme()

//     return (
//         <View
//             style={{
//                 flex: 1,
//                 backgroundColor: "rgba(0,0,0,0.2)",
//                 justifyContent: "center",
//                 alignItems: "center"
//             }}
//         >
//             <View
//                 style={{
//                     width: "85%",
//                     borderRadius: scale(8),
//                     borderWidth: scale(1),
//                     borderColor: "gray",
//                     justifyContent: "space-between",
//                     backgroundColor: colors.background,
//                     gap: verticalScale(10),
//                     padding: scale(15),
//                     position: 'relative'
//                 }}
//             >
//                 <CustomText
//                     style={{
//                         fontFamily: "AirbnbCereal_W_Bd",
//                         fontSize: scale(18),
//                         textAlign: "center"
//                     }}
//                 >Help & Support</CustomText>

//                 <CustomText
//                     style={{
//                         color: "gray",
//                         fontSize: scale(14),
//                     }}
//                 >
//                     If you are experiencing any issues, please let us know. We will try to resolve them as soon as possible.
//                 </CustomText>


//                 <TextInput
//                     editable
//                     placeholder="Title"
//                     placeholderTextColor={"gray"}
//                     style={[false ? styles.inputFielderror : styles.inputField, { borderColor: "#DDDDDD", backgroundColor: Colors.modeColor.colorCode3, fontFamily: "AirbnbCereal_W_Md", }]}
//                     value=''
//                 />

//                 <TextInput
//                     style={[false ? styles.inputFielderror : styles.inputField, { minHeight: verticalScale(120), textAlignVertical: "top", borderColor: "#DDDDDD", backgroundColor: Colors.modeColor.colorCode3, fontFamily: "AirbnbCereal_W_Md", }]}
//                     multiline
//                     placeholderTextColor={"gray"}
//                     placeholder='Explain the problem'
//                 />


//                 <Pressable
//                     style={{
//                         height: verticalScale(44),
//                         width: "100%",
//                         borderRadius: scale(8),
//                         backgroundColor: Colors.modeColor.colorCode,
//                         justifyContent: "center",
//                         alignItems: "center",
//                         marginHorizontal: "auto"
//                     }}
//                 >
//                     <CustomText style={{ color: "#fff" }}>Submit</CustomText>
//                 </Pressable>

//                 <CustomText
//                     style={{
//                         fontSize: scale(14),
//                     }}
//                 >You can contact us on this number <CustomText
//                     style={{
//                         color: Colors.modeColor.colorCode,
//                         fontSize: scale(14),
//                     }}
//                 >+44 1234567892</CustomText></CustomText>

//                 <Pressable
//                     onPress={() => router.back()}
//                     style={{
//                         position: "absolute",
//                         top: verticalScale(10),
//                         right: scale(10),
//                         width: scale(30),
//                         height: scale(30),
//                         justifyContent: "center",
//                         alignItems: "center",
//                         backgroundColor: "#E11D481A",
//                         borderRadius: scale(40)
//                     }}
//                 >
//                     <CloseIcon
//                         size={scale(16)}
//                         color='#E11D48'
//                     />
//                 </Pressable>

//             </View>
//         </View>
//     )
// }

// export default helpSupport

// const styles = StyleSheet.create({
//     inputField: {
//         borderRadius: scale(4),
//         borderWidth: scale(1),
//         padding: scale(16)
//     }
// })


import {
    Pressable,
    StyleSheet,
    TextInput,
    View,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native'
import React from 'react'
import { CloseIcon } from '../../constants/icons'
import { scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../constants/Colors';
import CustomText from '../../components/CustomText';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';

const helpSupport = () => {
    const router = useRouter()
    const { colors } = useTheme()

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
                        value=""
                    />

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
                    />

                    <Pressable style={styles.submitButton}>
                        <CustomText style={{ color: "#fff" }}>Submit</CustomText>
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
        width: "85%",
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
