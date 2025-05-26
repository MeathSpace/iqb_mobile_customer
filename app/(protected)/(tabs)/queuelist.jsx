import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import CustomTabView from '../../../components/CustomTabView';
import CustomText from '../../../components/CustomText';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../../constants/Colors';
import { useTheme } from '@react-navigation/native';
import QlistItem from '../../../components/QlistItem';
import { useRouter } from 'expo-router';
import { useGlobal } from '../../../context/GlobalContext';
import CustomSecondaryText from '../../../components/CustomSecondaryText';


const QueueList = () => {

    const { colors } = useTheme()

    const qlist = [
        {
            "id": 1,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 1
        },
        {
            "id": 2,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 2
        },
        {
            "id": 3,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 3
        },
        {
            "id": 4,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 4
        },
        {
            "id": 5,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 5
        },
        {
            "id": 6,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 6
        },
        {
            "id": 7,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 7
        },
        {
            "id": 8,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 8
        },
        {
            "id": 9,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 9
        },
        {
            "id": 10,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 10
        },
        {
            "id": 11,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 11
        },
        {
            "id": 12,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 12
        },
        {
            "id": 13,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 13
        },
        {
            "id": 14,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 14
        },
        {
            "id": 15,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 15
        },
        {
            "id": 16,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 16
        },
        {
            "id": 17,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 17
        },
        {
            "id": 18,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 18
        },
        {
            "id": 19,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 19
        },
        {
            "id": 20,
            "name": "Mckinley Barron",
            "image": "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "ewt": 15,
            "queue": 20
        }
    ]

    const router = useRouter()
    const { joinModes, setJoinModes, setSelectedBarber, setSelectedBarberServices } = useGlobal();

    return (
        <CustomTabView style={{ justifyContent: "space-between", paddingVertical: verticalScale(0), paddingTop: verticalScale(10) }}>
            {/* <View style={styles.qlistHeader}>
                <CustomText>Queue List</CustomText>

                <View style={[styles.segmentContainer, {}]}>
                    <Pressable
                        style={[
                            styles.segmentButton,
                            {
                                borderTopLeftRadius: moderateScale(4),
                                borderBottomLeftRadius: moderateScale(4),
                                borderRightColor: colors.border,
                                borderRightWidth: moderateScale(1),
                                backgroundColor: Colors.modeColor.colorCode,
                            },
                        ]}
                        onPress={() => {
                            setJoinModes({
                                singleJoin: true,
                                groupJoin: false,
                                appointment: false
                            })
                            setSelectedBarber({})
                            setSelectedBarberServices([])
                            router.push("/selectBarber")
                        }}
                    >
                        <CustomText style={{
                            color: "#fff"
                        }}>
                            Single Join
                        </CustomText>
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            setJoinModes({
                                singleJoin: false,
                                groupJoin: true,
                                appointment: false
                            })
                            setSelectedBarber({})
                            setSelectedBarberServices([])
                            router.push("/groupJoin")
                        }}
                        style={[
                            styles.segmentButton,
                            {
                                borderTopRightRadius: moderateScale(4),
                                borderBottomRightRadius: moderateScale(4),
                                backgroundColor: Colors.modeColor.colorCode,
                            },
                        ]}
                    >
                        <CustomText style={{
                            color: "#fff"
                        }}>
                            Group Join
                        </CustomText>
                    </Pressable>
                </View>
            </View> */}

            <View style={{ flex: 1, paddingBottom: Platform.OS === 'ios' ? verticalScale(60) : 0 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: verticalScale(6) }}>
                    <CustomText style={styles.title}>Today's Queue</CustomText>
                    <View
                        style={{
                            width: moderateScale(28),
                            height: moderateScale(28),
                            borderRadius: moderateScale(20),
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: Colors.modeColor.colorCode2,

                        }}
                    ><CustomSecondaryText style={{ color: Colors.modeColor.colorCode }}>10</CustomSecondaryText></View>
                </View>

                <FlatList
                    data={qlist}
                    contentContainerStyle={{
                        overflow: "visible",
                    }}
                    renderItem={({ item }) => <QlistItem item={item} />}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={<View style={{ height: Platform.OS === "ios" ? verticalScale(60) : 0 }} />}
                />

                <View style={{ flexDirection: "row", gap: verticalScale(10), justifyContent: "space-evenly" }}>
                    <Pressable
                        onPress={() => {
                            setJoinModes({
                                singleJoin: true,
                                groupJoin: false,
                                appointment: false
                            })
                            setSelectedBarber({})
                            setSelectedBarberServices([])
                            router.push("/selectBarber")
                        }}
                        style={[styles.btn, {
                            backgroundColor: Colors.modeColor.colorCode,
                            shadowColor: Colors.modeColor.colorCode,
                            marginBottom: Platform.OS === 'ios' ? verticalScale(20) : verticalScale(10),
                            marginTop: verticalScale(10)
                        }]}><CustomText style={{ color: "#fff" }}>Single Join</CustomText></Pressable>
                    <Pressable
                        onPress={() => {
                            setJoinModes({
                                singleJoin: false,
                                groupJoin: true,
                                appointment: false
                            })
                            setSelectedBarber({})
                            setSelectedBarberServices([])
                            router.push("/groupJoin")
                        }}
                        style={[styles.btn, {
                            backgroundColor: Colors.modeColor.colorCode,
                            shadowColor: Colors.modeColor.colorCode,
                            marginBottom: Platform.OS === 'ios' ? verticalScale(20) : verticalScale(10),
                            marginTop: verticalScale(10)
                        }]}><CustomText style={{ color: "#fff" }}>Group Join</CustomText></Pressable>
                </View>
            </View>


        </CustomTabView>
    );
};

export default QueueList;

const styles = StyleSheet.create({
    title: {
        fontFamily: "AirbnbCereal_W_Bd"
    },
    qlistHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },

    btn: {
        width: "45%",
        height: verticalScale(35),
        borderRadius: scale(4),
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
    }
    // segmentContainer: {
    //     flexDirection: 'row',
    //     overflow: 'hidden',
    // },
    // segmentButton: {
    //     paddingHorizontal: scale(12),
    //     height: verticalScale(35),
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     minWidth: scale(100),
    // },
});
