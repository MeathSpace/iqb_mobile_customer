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
    const { joinQueue, setJoinQueue } = useGlobal();

    return (
        <CustomTabView>
            <View style={styles.qlistHeader}>
                <CustomText style={{ fontFamily: "AirbnbCereal_W_Md" }}>Queue List</CustomText>

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
                            setJoinQueue({
                                singleJoin: true,
                                groupJoin: false
                            })
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
                            setJoinQueue({
                                singleJoin: false,
                                groupJoin: true
                            })
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
        </CustomTabView>
    );
};

export default QueueList;

const styles = StyleSheet.create({
    qlistHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    segmentContainer: {
        flexDirection: 'row',
        overflow: 'hidden',
    },
    segmentButton: {
        paddingHorizontal: scale(12),
        height: verticalScale(35),
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: scale(100),
    },
});
