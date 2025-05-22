import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomView from '../../components/CustomView'
import { Image } from 'expo-image'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import CustomText from '../../components/CustomText'
import CustomSecondaryText from '../../components/CustomSecondaryText'
import { ClockIcon, PeopleIcon } from '../../constants/icons'
import { useTheme } from '@react-navigation/native'
import { useRouter } from 'expo-router';
import { useGlobal } from '../../context/GlobalContext'

const selectBarber = () => {

    const barbersData = [
        {
            id: 1,
            image: "https://celebrity.edu/wp-content/uploads/2021/08/top-tips-to-be-a-successful-barber.jpg",
            name: "Korbyn Larson",
            qPos: 1,
            estTime: 15,

        },
        {
            id: 2,
            image: "https://media.istockphoto.com/id/1365608023/photo/shot-of-a-handsome-young-barber-standing-alone-in-his-salon.jpg?s=612x612&w=0&k=20&c=0l2Q3UVgXNnf3lbUvMM7hT18-AAnOloeoNMOHntomcw=",
            name: "Aden Schneider",
            qPos: 2,
            estTime: 15,

        },
        {
            id: 3,
            image: "https://d3sc42dkmius1e.cloudfront.net/mb/2023/11/shutterstock_2267242719.jpg",
            name: "Parker Howard",
            qPos: 3,
            estTime: 15,

        },
        {
            id: 4,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS00ttz25SjbZV0uIHzosHH25DVqhpNhtRXw&s",
            name: "Paulina Arroyo",
            qPos: 4,
            estTime: 15,

        },


        {
            id: 5,
            image: "https://celebrity.edu/wp-content/uploads/2021/08/top-tips-to-be-a-successful-barber.jpg",
            name: "Korbyn Larson",
            qPos: 1,
            estTime: 15,

        },
        {
            id: 6,
            image: "https://media.istockphoto.com/id/1365608023/photo/shot-of-a-handsome-young-barber-standing-alone-in-his-salon.jpg?s=612x612&w=0&k=20&c=0l2Q3UVgXNnf3lbUvMM7hT18-AAnOloeoNMOHntomcw=",
            name: "Aden Schneider",
            qPos: 2,
            estTime: 15,

        },
        {
            id: 7,
            image: "https://d3sc42dkmius1e.cloudfront.net/mb/2023/11/shutterstock_2267242719.jpg",
            name: "Parker Howard",
            qPos: 3,
            estTime: 15,

        },
        {
            id: 8,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS00ttz25SjbZV0uIHzosHH25DVqhpNhtRXw&s",
            name: "Paulina Arroyo",
            qPos: 4,
            estTime: 15,

        },
    ]

    const { colors } = useTheme()
    const router = useRouter()

    const { setSelectedBarber } = useGlobal();

    return (
        <CustomView>
            <CustomText style={styles.heading}>
                Join Queue
            </CustomText>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: verticalScale(20) }}>
                <CustomSecondaryText style={{ fontFamily: "AirbnbCereal_W_Md" }}>Who are you looking for ?</CustomSecondaryText>
                <CustomSecondaryText style={{ fontFamily: "AirbnbCereal_W_Md" }}>Available Barbers 4</CustomSecondaryText>
            </View>

            <FlatList
                data={barbersData}
                showsVerticalScrollIndicator={false}
                style={{
                    // overflow: "visible"
                }}
                contentContainerStyle={{
                    gap: verticalScale(15),
                }}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => {
                            setSelectedBarber(item)
                            router.push({
                                pathname: "/selectServices",
                                params: item
                            })
                        }}
                        style={[styles.barberItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Image
                            style={{ height: moderateScale(55), width: moderateScale(55), borderRadius: moderateScale(30) }}
                            source={{ uri: item.image }}
                            // placeholder={{ blurhash }}
                            contentFit="cover"
                            transition={300}
                        />

                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: scale(10) }}>
                            <View style={{ flex: 1, gap: scale(6) }}>
                                <CustomText style={{ fontFamily: "AirbnbCereal_W_Md" }}>{item.name}</CustomText>
                                <CustomSecondaryText
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >Haircut + 8 more </CustomSecondaryText>
                            </View>
                            <View style={{ flex: 1, gap: scale(6) }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10), }}>
                                    <ClockIcon size={moderateScale(14)} color={colors.secondaryText} />
                                    <CustomSecondaryText>{item.estTime} mins</CustomSecondaryText>
                                </View>


                                <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10), }}>
                                    <PeopleIcon color={colors.text} />
                                    <CustomText>{item.qPos}</CustomText>
                                </View>

                            </View>
                        </View>

                    </Pressable>
                )}
                keyExtractor={item => item.id}
                ListFooterComponent={<View style={{ height: Platform.OS === "ios" ? verticalScale(60) : 0 }} />}
            />

        </CustomView>
    )
}

export default selectBarber

const styles = StyleSheet.create({
    heading: {
        fontFamily: "AirbnbCereal_W_Bd",
        fontSize: moderateScale(20),
        textAlign: "center"
    },

    barberItem: {
        // width: "100%",
        borderRadius: moderateScale(4),
        padding: moderateScale(10),
        marginHorizontal: scale(5),
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10),
        borderWidth: scale(1),
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    }
})