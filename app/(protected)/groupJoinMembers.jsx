import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect, useNavigation, useRouter } from 'expo-router'
import { usePreventRemove, useTheme } from '@react-navigation/native'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import CustomText from '../../components/CustomText'
import { AddIcon, ArrowLeftIcon, DeleteIcon, PeopleIcon, ProfileIcon } from '../../constants/icons'
import { Image } from 'expo-image'
import CustomSecondaryText from '../../components/CustomSecondaryText'
import { AntDesign, Feather } from '@expo/vector-icons'
import { useAuth } from '../../context/AuthContext'
import { useGlobal } from '../../context/GlobalContext'
import { Toast } from 'toastify-react-native'

const GroupJoinMembers = () => {

    const router = useRouter()
    const { colors } = useTheme();
    const insets = useSafeAreaInsets()
    const { authenticatedUser } = useAuth()

    function formatMinutesToHrMin(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
        if (hours > 0) return `${hours}hr`;
        return `${mins}m`;
    }


    const {
        groupJoinMembers,
        setGroupJoinMembers,
        memberName,
        setMemberName,
        setSelectedMemberServices,
        setSelectedMemberBarber,
    } = useGlobal()

    const removeGroupMember = (member) => {
        const filteredData = groupJoinMembers.filter((item) => item.id !== member.id)
        setGroupJoinMembers(filteredData)
    }

    const editNavigationAllowRef = useRef(false)

    const editMember = (item) => {
        const filteredData = groupJoinMembers.filter((member) => member.id !== item.id)
        setGroupJoinMembers(filteredData)

        setMemberName(item.memberName)
        setSelectedMemberServices(item.selectedServices)
        setSelectedMemberBarber(item.selectedMemberBarber)

        editNavigationAllowRef.current = true
        router.back()
    }


    const totalServicePrice = groupJoinMembers?.reduce((total, member) => {
        const memberTotal = member.selectedServices?.reduce((sum, service) => {
            return sum + (service.servicePrice || 0);
        }, 0);
        return total + memberTotal;
    }, 0);

    const totalServiceEwt = groupJoinMembers?.reduce((total, member) => {
        const memberTotal = member.selectedServices?.reduce((sum, service) => {
            return sum + (service.serviceEWT || 0);
        }, 0);
        return total + memberTotal;
    }, 0);

    const totalServicesLength = groupJoinMembers?.reduce(
        (total, item) => total + (item?.selectedServices?.length || 0),
        0
    );



    // usePreventRemove(true, ({ data }) => {
    //     // Block back action silently
    //     if (editNavigationAllowRef?.current) {
    //         console.log("UnBlocked")
    //         router.push("/groupJoin")

    //     } else {
    //         console.log("Blocked ..")
    //     }

    // });


    usePreventRemove(true, ({ data }) => {
        if (editNavigationAllowRef.current) {
            // Already allowed
            router.push('/groupJoin');
        } else {
            // Show confirmation alert
            Alert.alert(
                'Discard group join data?',
                'All selected members will be cleared, and the group join information will be reset.',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => {
                            // Do nothing: block remains
                        },
                    },
                    {
                        text: 'OK',
                        style: 'destructive',
                        onPress: () => {
                            // editNavigationAllowRef.current = true; // temporarily allow
                            // router.push('/groupJoin'); // now push
                            setMemberName(authenticatedUser?.name)
                            setSelectedMemberBarber(null)
                            setSelectedMemberServices([])
                            setGroupJoinMembers([])
                            router.push("/queuelist")
                        },
                    },
                ],
                { cancelable: true }
            );
        }
    });


    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.background,
                padding: scale(10)
            }}
        >
            <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd", fontSize: scale(22), marginBottom: verticalScale(10) }}>Group Members</CustomText>

            <FlatList
                data={groupJoinMembers}
                contentContainerStyle={{
                    gap: verticalScale(10),
                    paddingBottom: Platform.OS === "ios" ? verticalScale(60) : verticalScale(100)
                }}
                renderItem={({ item }) => {
                    return (
                        <View style={[styles.groupCard, {
                            backgroundColor: colors.cardColor,
                            borderColor: colors.queueBorder,
                        }]}>
                            <View style={{
                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                width: scale(50),
                                height: scale(50),
                                borderRadius: scale(60),
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <ProfileIcon color='#22c55e' />
                            </View>

                            <View style={{
                                gap: verticalScale(10),
                                width: "78%"
                            }}>
                                <View>
                                    <CustomText style={{
                                        fontFamily: "AirbnbCereal_W_XBd",
                                        fontSize: scale(18),
                                        width: "70%"
                                    }}>{item?.memberName === authenticatedUser?.name ? "You" : item?.memberName} <CustomText style={{
                                        color: '#2dd4bf'
                                    }}>{item?.memberName === authenticatedUser?.name ? "(Host)" : ""}</CustomText>
                                    </CustomText>

                                    <View style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: scale(5)
                                    }}>
                                        <View style={{
                                            width: scale(7),
                                            height: scale(7),
                                            borderRadius: scale(10),
                                            backgroundColor: '#2dd4bf'
                                        }} />
                                        <CustomText style={{
                                            fontSize: scale(12),
                                            fontFamily: "AirbnbCereal_W_Bd",
                                            color: '#2dd4bf'
                                        }}>Ready</CustomText>
                                    </View>
                                </View>

                                <View
                                    style={{
                                        height: verticalScale(1),
                                        backgroundColor: colors.queueBorder,
                                        flex: 1
                                    }}
                                />

                                <View style={{
                                    gap: verticalScale(5),
                                }}>
                                    <CustomSecondaryText style={{ flexWrap: 'wrap' }}>
                                        Services: {item.selectedServices?.map(ser => ser?.serviceName).join(" | ")}
                                    </CustomSecondaryText>

                                    <CustomSecondaryText>Stylist: {item?.selectedMemberBarber?.name}</CustomSecondaryText>
                                    <CustomText style={{
                                        fontFamily: "AirbnbCereal_W_Bd",
                                    }}>Subtotal: {authenticatedUser?.currency} {item?.selectedServices?.reduce((acc, service) => acc + service.servicePrice, 0)} ({formatMinutesToHrMin(item?.selectedServices?.reduce((acc, service) => acc + service.serviceEWT, 0))})</CustomText>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => editMember(item)}
                                style={[styles.editButton, {
                                    backgroundColor: "rgba(13, 148, 136, 0.1)",
                                    right: !(item?.memberName === authenticatedUser?.name) ? scale(50) : scale(12),
                                }]}>
                                <Feather name="edit-2" size={moderateScale(16)} color='#14b8a6' />
                            </TouchableOpacity>

                            {
                                !(item?.memberName === authenticatedUser?.name) ? (
                                    <TouchableOpacity
                                        onPress={() => removeGroupMember(item)}
                                        style={[styles.deleteButton, {
                                            backgroundColor: 'rgba(239, 68, 68, 0.1)'
                                        }]}>
                                        <AntDesign name="delete" size={moderateScale(16)} color='#ef4444' />
                                    </TouchableOpacity>
                                ) : (null)
                            }

                        </View>
                    )
                }}
                keyExtractor={(item, index) => item.id}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    groupJoinMembers?.length === 5 ? (
                        null
                    ) : (<TouchableOpacity
                        onPress={() => {
                            setMemberName("")
                            router.push("/groupAddMemberModal")
                        }}
                        style={[styles.addMemberButton, {
                            borderColor: colors.text
                        }]}>
                        <AddIcon color={colors.text} />
                        <CustomText>Add Member</CustomText>
                    </TouchableOpacity>)
                }
            />

            {groupJoinMembers?.length > 0 ? (
                <View
                    style={{
                        backgroundColor: colors.cardColor,
                        borderTopColor: colors.queueBorder,
                        borderTopWidth: scale(1),
                        height:
                            Platform.OS === "ios"
                                ? insets.bottom + verticalScale(60)
                                : verticalScale(80),
                        padding: scale(10),
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <View style={{ marginBottom: verticalScale(15) }}>
                        <CustomText
                            style={{ fontFamily: "AirbnbCereal_W_XBd", fontSize: scale(18) }}
                        >
                            {authenticatedUser?.currency} {totalServicePrice}
                        </CustomText>
                        <CustomSecondaryText>
                            {groupJoinMembers?.length} {groupJoinMembers?.length === 1 ? 'member' : 'members'} |{" "}
                            {formatMinutesToHrMin(totalServiceEwt)}
                        </CustomSecondaryText>
                    </View>

                    <TouchableOpacity
                        onPress={() => {

                            if (!groupJoinMembers || groupJoinMembers.length < 2) {
                                Toast.error("At least two members are needed");
                                return;
                            }

                            if (groupJoinMembers.length > 5) {
                                Toast.error("You can only add up to 5 members in a group");
                                return;
                            }

                            router.push({
                                pathname: "/groupJoinModal",
                                params: {
                                    groupJoinMembers: JSON.stringify(groupJoinMembers),
                                    totalServicePrice,
                                    totalServiceEwt,
                                    totalServicesLength
                                }
                            });
                        }}
                        style={styles.queueButton}
                        activeOpacity={0.85}
                    >
                        <CustomText style={styles.queueButtonText}>Join Queue</CustomText>
                    </TouchableOpacity>
                </View>
            ) : null}

        </SafeAreaView>
    )
}

export default GroupJoinMembers

const styles = StyleSheet.create({
    groupCard: {
        borderWidth: scale(1),
        borderRadius: scale(8),
        padding: scale(15),
        flexDirection: "row",
        gap: scale(15),
        position: "relative"
    },

    editButton: {
        position: 'absolute',
        top: verticalScale(12),
        padding: scale(8),
        borderRadius: 999,
    },

    deleteButton: {
        position: 'absolute',
        top: verticalScale(12),
        right: scale(12),
        padding: scale(8),
        borderRadius: 999,
    },

    addMemberButton: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: scale(10),
        borderWidth: scale(1),
        borderStyle: "dotted",
        borderRadius: scale(8),
        height: verticalScale(40),
        paddingHorizontal: scale(20),
        alignSelf: "center",
        marginTop: verticalScale(10)
    },

    queueButton: {
        width: '40%',
        backgroundColor: '#14b8a6', // bg-teal-500
        paddingVertical: verticalScale(12), // py-4
        borderRadius: scale(8), // rounded-xl
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


// import { usePreventRemove } from '@react-navigation/native';
// import { useRouter, Stack } from 'expo-router';
// import { useRef } from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';

// const GroupJoinMembers = () => {

//     const router = useRouter();
//     const allowNavigationRef = useRef(false);

//     usePreventRemove(true, ({ data }) => {
//         if (allowNavigationRef.current) {
//             // console.log("Triggered jjj")
//             router.push("/queuelist"); // or router.replace(), router.back() etc.
//         }
//         // Block back action silently
//     });

//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text>Prevent Back Navigation</Text>
//             <Button
//                 title="Allow Back & Go"
//                 onPress={() => {
//                     allowNavigationRef.current = true;
//                     router.back(); // or router.dismiss(), etc.
//                 }}
//             />
//         </View>
//     )
// }

// export default GroupJoinMembers

// const styles = StyleSheet.create({})