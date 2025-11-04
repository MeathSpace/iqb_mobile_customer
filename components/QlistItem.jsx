// import { View, Text, StyleSheet } from 'react-native';
// import { scale, verticalScale } from 'react-native-size-matters';
// import CustomText from './CustomText';
// import { Image } from 'expo-image'
// import { useAuth } from '../context/AuthContext';
// import { useTheme } from '@react-navigation/native';

// const QlistItem = ({ item, index, qlistLength }) => {

//     const { colors } = useTheme()
//     const { authenticatedUser } = useAuth()


//     function formatMinutesToHrMin(totalMinutes) {
//         const hours = Math.floor(totalMinutes / 60);
//         const mins = totalMinutes % 60;

//         if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
//         if (hours > 0) return `${hours}hr`;
//         return `${mins}m`;
//     }

//     return (
//         <View style={[styles.queueItem, { backgroundColor: colors.cardColor, borderColor: colors.cardBorder }]}>
//             <View style={styles.leftSection}>
// <Image
//     style={[styles.avatar, { borderColor: colors.cardBorder }]}
//     source={{ uri: item?.barberProfile?.[0]?.url }}
//     contentFit="cover"
//     transition={300}
// />
//                 {/* <View style={{
//                     width: scale(40),
//                     height: scale(40),
//                     borderRadius: scale(20),
//                     justifyContent: "center",
//                     alignItems: "center",
//                     backgroundColor: colors.background,
//                     borderColor: colors.cardBorder,
//                     borderWidth: scale(1)
//                 }}>
//                     <CustomText>A</CustomText>
//                 </View> */}
//                 <CustomText numberOfLines={1} style={[styles.nameText, { color: colors.secondaryText }]}>
//                     {/* <CustomText style={styles.nameBold}>{item.barberName}</CustomText> (with {authenticatedUser?.email === item?.customerEmail ? item?.name : "Client"}) */}
//                     <CustomText style={styles.nameBold}>{item.barberName}</CustomText> {authenticatedUser?.email === item?.customerEmail ? `(with ${item?.name})` : "(Client)"}
//                 </CustomText>
//             </View>
//             <CustomText style={[styles.statusText, { color: colors.secondaryText }]}>
//                 <CustomText style={[item.qPosition === 1 && styles.statusHighlight]}>{item.qPosition === 1 ? "Next" : `#${item.qPosition}`}</CustomText> / ~{formatMinutesToHrMin(item.customerEWT)}
//             </CustomText>
//         </View>
//     )
// }

// export default QlistItem

// const styles = StyleSheet.create({
//     queueItem: {
//         backgroundColor: '#fff',
//         padding: scale(12),
//         borderRadius: scale(12),
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         // borderColor: '#e5e7eb', // border-gray-200
//         borderWidth: scale(1),
//     },
//     leftSection: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: scale(10),
//         flexShrink: 1,
//     },
// avatar: {
//     width: scale(40),
//     height: scale(40),
//     borderRadius: scale(20),
//     borderWidth: scale(1)
// },
//     nameText: {
//         // color: '#4b5563', // text-gray-600
//         fontSize: scale(13),
//         flexShrink: 1,
//     },
//     nameBold: {
//         fontFamily: "AirbnbCereal_W_Bd"
//         // fontWeight: '600',
//         // color: '#1f2937', // text-gray-800
//     },
//     statusText: {
//         fontSize: scale(13),
//         fontWeight: '600',
//         textAlign: 'right',
//         marginLeft: scale(8),
//         whiteSpace: 'nowrap',
//         fontFamily: "AirbnbCereal_W_Bd"
//     },
//     statusHighlight: {
//         color: '#14b8a6', // text-teal-500
//     },
// });


import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import CustomText from './CustomText';
import { Image } from 'expo-image'
import { useAuth } from '../context/AuthContext';
import { useTheme } from '@react-navigation/native';
import axios from 'axios'
import { BASE_URL } from '@/utils/api';
import { Toast } from 'toastify-react-native';

const QlistItem = ({ item, index, qlistLength, setQlistData, setShowHideQueBtn }) => {

    const { colors } = useTheme()
    const { authenticatedUser } = useAuth()


    function formatMinutesToHrMin(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
        if (hours > 0) return `${hours}hr`;
        return `${mins}m`;
    }

    const cancelQueuePressed = (item) => {
        Alert.alert(
            "Cancel Queue",
            "Are you sure you want to cancel this queue?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            const cancelQueueData = {
                                salonId: authenticatedUser?.salonId,
                                barberId: item?.barberId,
                                customerEmail: item?.customerEmail,
                                _id: item?._id
                            };

                            setQlistData((prev) => ({ ...prev, loading: true }))

                            const { data } = await axios.post(`${BASE_URL}/mobileRoutes/cancelQueueByCustomer`, cancelQueueData);

                            Toast.success(data?.message || "Customer cancelled successfully");

                            const { data: queuelistData } = await axios.get(`${BASE_URL}/mobileRoutes/getQlistBySalonId`, {
                                params: {
                                    salonId: authenticatedUser?.salonId,
                                    customerEmail: authenticatedUser?.email
                                }
                            })


                            const customerBarberId = queuelistData?.response?.find(qlistItem => qlistItem.customerEmail === authenticatedUser?.email)?.barberId || null;

                            const filteredQlistData = queuelistData?.response?.filter(qlistItem => {
                                if (qlistItem.barberId === customerBarberId) {
                                    return qlistItem;
                                }
                            });

                            setQlistData((prev) => ({ ...prev, loading: false, data: filteredQlistData, success: true, error: null , isJoinedQueue: queuelistData?.isJoinedQueue }))


                            // setQlistData((prev) => ({ ...prev, loading: false, data: queuelistData?.response, success: true, error: null, isJoinedQueue: queuelistData?.isJoinedQueue }))


                            

                        } catch (error) {
                            Toast.error(error?.response?.data?.message)
                            console.log("Canceled queue error ", error?.response?.data);
                            setQlistData((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
                            setShowHideQueBtn((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
                        }
                    }
                }
            ]
        );
    };

    return (
        <TouchableOpacity
            disabled={authenticatedUser?.email !== item?.customerEmail}
            onPress={() => {
                if (authenticatedUser?.email === item?.customerEmail) {
                    cancelQueuePressed(item)
                }
            }}
            style={[styles.queueItem, {
                borderBottomColor: index !== qlistLength.length - 1 ? colors.queueBorder : undefined,
                borderBottomWidth: index !== qlistLength.length - 1 ? scale(1) : 0,
                borderBottomLeftRadius: index === qlistLength.length - 1 ? scale(12) : 0,
                borderBottomRightRadius: index === qlistLength.length - 1 ? scale(12) : 0,
                backgroundColor: authenticatedUser?.email === item?.customerEmail && colors.selected
            }]}>
            <View style={styles.barberContainer}>
                <Image
                    style={[styles.avatar, {
                        borderColor: colors.cardBorder
                    }]}
                    source={{ uri: item?.barberProfile?.[0]?.url }}
                    contentFit="cover"
                    transition={300}
                />
                <CustomText
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.barberNameText}
                >{item.barberName}</CustomText>
            </View>

            <View style={[styles.customerContainer]}>
                <CustomText numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[styles.customerText, {
                        color: colors.secondaryText,
                    }]}
                >{authenticatedUser?.email === item?.customerEmail ? item?.name : "Client"}</CustomText>
            </View>

            <View style={styles.timeContainer}>
                <CustomText style={[item.qPosition === 1 && styles.statusHighlight, { fontFamily: "AirbnbCereal_W_XBd", fontSize: scale(14) }]}>{item.qPosition === 1 ? "Next" : `#${item.qPosition}`}</CustomText>
                <CustomText style={{
                    color: colors.secondaryText,
                    fontFamily: "AirbnbCereal_W_Bd",
                    fontSize: scale(13),
                }}>~{formatMinutesToHrMin(item.customerEWT)}</CustomText>
            </View>
        </TouchableOpacity>
    )
}

export default QlistItem

const styles = StyleSheet.create({
    queueItem: {
        height: verticalScale(60),
        paddingHorizontal: scale(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: scale(2)
    },
    barberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
        width: "37%",
        height: "100%",
    },
    barberNameText: {
        flexShrink: 1,
        overflow: 'hidden',
        fontFamily: "AirbnbCereal_W_XBd",
        fontSize: scale(14)
    },
    avatar: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(40),
        borderWidth: scale(1)
    },
    customerContainer: {
        width: "33%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },

    customerText: {
        flexShrink: 1,
        overflow: 'hidden',
        fontSize: scale(14)
    },
    timeContainer: {
        flexDirection: "column",
        gap: verticalScale(2),
        alignItems: "flex-end",
        width: "28%",
        height: "100%",
        justifyContent: "center",
    },
    statusHighlight: {
        color: '#14b8a6'
    },
});

