import { Alert, FlatList, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomView from '../../components/CustomView'
import CustomText from '../../components/CustomText'
import CustomSecondaryText from '../../components/CustomSecondaryText'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native'
import { Link, useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { Colors } from '../../constants/Colors'
import GroupItem from '../../components/GroupItem'
import { useGlobal } from '../../context/GlobalContext'

const groupJoin = () => {

    const { colors } = useTheme()
    const router = useRouter()

    const { groupJoinMembers, setGroupJoinMembers, customerName, setCustomerName, selectedBarber, setSelectedBarber, selectedBarberServices, setSelectedBarberServices, removeGroupMember, setRemoveGroupMember } = useGlobal();

    useEffect(() => {
        if (removeGroupMember?.remove) {
            setCustomerName(removeGroupMember.data.customerName)
            setSelectedBarber(removeGroupMember.data.barber)
            setSelectedBarberServices(removeGroupMember.data.barberServices)
        }

    }, [removeGroupMember])

    // useEffect(() => {
    //     return () => {
    //         console.log("triggered ")
    //         setCustomerName("")
    //         setSelectedBarber({})
    //         setSelectedBarberServices([])
    //         setGroupJoinMembers([])
    //     }
    // }, [])

    return (
        <CustomView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View>
                    <View>
                        <CustomText style={styles.heading}>
                            Group Join
                        </CustomText>

                        <CustomSecondaryText>
                            Please provide information for all members joining the group (maximum of 5).
                        </CustomSecondaryText>
                    </View>


                    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <TextInput
                            value={customerName}
                            onChangeText={text => setCustomerName(text)}
                            placeholder='Enter customer name'
                            placeholderTextColor={colors.secondaryText}
                            style={[styles.input, { backgroundColor: colors.secondaryInputBackground, color: colors.text }]} />

                        <Pressable
                            onPress={() => {
                                setRemoveGroupMember({
                                    remove: false,
                                    data: {}
                                })
                                router.push("/selectBarber")

                            }}
                            style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode, shadowColor: Colors.modeColor.colorCode }]}>
                            <CustomText style={{ color: "#fff" }}>Select Barber & Services</CustomText>
                        </Pressable>

                        {
                            Object.keys(selectedBarber).length > 0 ? (
                                <>
                                    <CustomText>Details</CustomText>

                                    <View style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: scale(10),
                                    }}>
                                        <Image
                                            style={{ height: moderateScale(45), width: moderateScale(45), borderRadius: moderateScale(30) }}
                                            source={{ uri: selectedBarber.image, }}
                                            // placeholder={{ blurhash }}
                                            contentFit="cover"
                                            transition={300}
                                        />
                                        <CustomText>{selectedBarber.name}</CustomText>
                                    </View>

                                    <View style={{ height: verticalScale(1), borderBottomColor: colors.border, borderBottomWidth: moderateScale(1.5) }}></View>

                                    <View style={{ gap: verticalScale(6) }}>
                                        {
                                            selectedBarberServices.map((ele, index) => {
                                                return (
                                                    <CustomSecondaryText key={index}>{index + 1}. {ele.serviceName}</CustomSecondaryText>
                                                )
                                            })
                                        }
                                    </View>

                                    <Pressable
                                        onPress={() => {
                                            if (!customerName || !Object.keys(selectedBarber).length || !selectedBarberServices.length) {
                                                return Alert.alert(
                                                    "Missing Information",
                                                    "Please enter the customer name, select a barber, and choose at least one service.",
                                                    [{ text: "OK" }]
                                                );
                                            }
                                            setGroupJoinMembers([...groupJoinMembers, {
                                                id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                                                customerName: customerName,
                                                barber: selectedBarber,
                                                barberServices: selectedBarberServices
                                            }])
                                            setCustomerName("")
                                            setSelectedBarber({})
                                            setSelectedBarberServices([])
                                            setRemoveGroupMember({
                                                remove: false,
                                                data: {}
                                            })
                                        }}
                                        style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode, shadowColor: Colors.modeColor.colorCode }]}>
                                        <CustomText style={{ color: "#fff" }}>Add Customer</CustomText>
                                    </Pressable>
                                </>
                            ) : (
                                <>
                                    <View style={{
                                        height: verticalScale(100),
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <CustomSecondaryText>Barber and services not selected</CustomSecondaryText>
                                    </View>
                                </>
                            )
                        }

                    </View>
                </View>
            </TouchableWithoutFeedback>

            <View style={{ flex: 1, justifyContent: "space-between" }}>
                {
                    groupJoinMembers.length > 0 ? (
                        <>
                            <CustomText style={{ fontFamily: "AirbnbCereal_W_Bd", fontSize: moderateScale(18), marginBottom: verticalScale(10) }}>
                                Group Members
                            </CustomText>
                            <FlatList
                                data={groupJoinMembers}
                                // style={{ marginTop: verticalScale(10)}}
                                contentContainerStyle={{
                                    gap: verticalScale(10),
                                }}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => <GroupItem item={item} />}
                                keyExtractor={item => item.id}
                            />

                        </>
                    ) : (<View />)
                }

                <Pressable
                    onPress={() => { }}
                    style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>
                    <CustomText style={{ color: "#fff" }}>Continue</CustomText>
                </Pressable>
            </View>

        </CustomView>
    )
}

export default groupJoin

const styles = StyleSheet.create({
    heading: {
        fontFamily: "AirbnbCereal_W_Bd",
        fontSize: moderateScale(22),
        marginBottom: verticalScale(10)
    },

    card: {
        padding: moderateScale(10),
        marginVertical: verticalScale(20),
        borderRadius: scale(4),
        borderWidth: scale(1),
        gap: verticalScale(10),
        elevation: 3,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },

    input: {
        height: verticalScale(40),
        borderRadius: scale(4),
        paddingHorizontal: scale(10),
        fontSize: moderateScale(14),
    },

    btn: {
        height: verticalScale(35),
        borderRadius: scale(4),
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
    },


    container: {
        flex: 1,
        marginTop: 0,
    },

})