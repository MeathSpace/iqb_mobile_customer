import { Dimensions, FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Image } from 'expo-image';
import CustomText from '../../../components/CustomText'
import { Colors } from '../../../constants/Colors'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { ArrowDownIcon, ArrowUpIcon, ContactIcon, FacebookIcon, InstagramIcon, MapIcon } from '../../../constants/icons';
import CustomSecondaryText from '../../../components/CustomSecondaryText';

const SalonItem = ({ item }) => {

    const { colors } = useTheme()

    return (
        <View style={[styles.cardWrapper, { backgroundColor: colors.background }]} >
            <Image
                style={styles.cardImage}
                source={{ uri: item.image }}
                contentFit="cover"
                transition={300}
            />
        </View>
    )
};


const salon = () => {

    const advertisementData = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2936&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 2,
            image: "https://img1.wsimg.com/isteam/ip/ecf2eb3f-f55b-4193-9e98-7c1b626bf779/Hero%20Picture.png"
        },
        {
            id: 3,
            image: "https://cdn.wellnessta.com/vendors/5ff2c570edfc6c776857fe44/outlet/Hair-And-Care-Men's-Salon-202105121952400.webp"
        },
        {
            id: 4,
            image: "https://images.pexels.com/photos/705255/pexels-photo-705255.jpeg"
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2936&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
    ]

    const flatlistRef = useRef()
    const [currentIndex, setCurrentIndex] = useState(0)

    const scrollToIndex = () => {
        flatlistRef.current.scrollToIndex({ animated: true, index: currentIndex })
    }

    useFocusEffect(
        useCallback(() => {
            if (flatlistRef?.current) {
                scrollToIndex(currentIndex)
            }
        }, [currentIndex])
    )

    const darkMapStyle = [
        {
            "elementType": "geometry",
            "stylers": [{ "color": "#1d2c4d" }]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#ffffff" }]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#1d2c4d" }]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [{ "color": "#1d2c4d" }]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{ "color": "#283e6b" }]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#ffffff" }]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{ "color": "#304a7d" }]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#98a5be" }]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{ "color": "#2f3948" }]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#0f252e" }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#ffffff" }]
        }
    ];

    const colorScheme = useColorScheme();
    const { colors } = useTheme()

    const serviceData = [
        {
            id: 1,
            name: "Cutting",
            iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/Femalehaircut_1706703379391.png"
        },
        {
            id: 2,
            name: "Trim",
            iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/hair%20dyes_1706703379402.jpg"
        },
        {
            id: 3,
            name: "Styling",
            iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/Malehaircut_1706703379405.png"
        },
        {
            id: 4,
            name: "Hair Dye",
            iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703380/icons/massage_1706703379406.jpg"
        },
        {
            id: 5,
            name: "Grooming",
            iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703380/icons/natural%20spa_1706703379406.jpg"
        },

        {
            id: 6,
            name: "Hair Treatment",
            iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/shave_1706703379407.png"
        },
        {
            id: 7,
            name: "Beard Shave",
            iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/spa_1706703379407.jpg"
        },
        {
            id: 8,
            name: "Cutting",
            iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/Femalehaircut_1706703379391.png"
        },
        {
            id: 9,
            name: "Trim",
            iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/hair%20dyes_1706703379402.jpg"
        },
        {
            id: 10,
            name: "Styling",
            iconImage: "https://res.cloudinary.com/dfrw3aqyp/image/upload/v1706703381/icons/Malehaircut_1706703379405.png"
        },
    ]

    const [serviceDrop, setServiceDrop] = useState(false)

    return (
        <ScrollView
            style={{ backgroundColor: "#efefef", flex: 1 }}
            contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? verticalScale(60) : 0 }}
            showsVerticalScrollIndicator={false}
        >
            <View>
                <FlatList
                    data={advertisementData}
                    style={{
                        position: "relative"
                    }}
                    renderItem={({ item }) => <SalonItem item={item} />}
                    keyExtractor={item => item.id.toString()}
                    ref={flatlistRef}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    // snapToAlignment="start"
                    decelerationRate="fast"
                    snapToInterval={scale(400)}
                    onMomentumScrollEnd={(event) => {
                        const offsetX = event.nativeEvent.contentOffset.x;
                        const index = Math.round(offsetX / scale(400));
                        setCurrentIndex(index);
                    }}
                    initialNumToRender={3}
                    maxToRenderPerBatch={3}
                />
                <View
                    style={{
                        position: "absolute",
                        bottom: verticalScale(10),
                        right: scale(20),
                        flexDirection: "row",
                        gap: scale(8),
                        alignItems: "center"
                    }}
                >
                    {
                        advertisementData.map((item, index) => {
                            return (
                                <Pressable
                                    onPress={() => setCurrentIndex(index)}
                                    key={index}
                                    style={{
                                        width: index === currentIndex ? scale(25) : scale(10),
                                        height: scale(10),
                                        borderRadius: scale(30),
                                        backgroundColor: index === currentIndex ? Colors.modeColor.colorCode : "#fff"
                                    }}
                                ></Pressable>
                            )
                        })
                    }

                </View>
            </View>

            <View
                style={{
                    flex: 1,
                    paddingVertical: verticalScale(20),
                    paddingHorizontal: scale(10)
                }}
            >
                <MapView
                    provider={PROVIDER_GOOGLE}
                    initialCamera={{
                        center: {
                            latitude: 37.78825,
                            longitude: -122.4324,
                        },
                        zoom: 15, // 0 (world view) to ~20 (very close)
                        pitch: 0,
                        heading: 0,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                    style={[styles.map, { borderColor: colors.border, borderWidth: scale(1) }]}
                    customMapStyle={colorScheme === "dark" ? darkMapStyle : []}
                />
                <View style={[styles.addressContainer, { backgroundColor: colors.background }]}>
                    <CustomText style={styles.addressText}>
                        30 Elliot Rd, Selly Oak, Birmingham, UK, B29 4AQ
                    </CustomText>
                    <View style={styles.iconContainer}>
                        <Pressable style={[styles.iconButton, { backgroundColor: colorScheme === "dark" ? "#0f0f0f" : "#f0f0f0" }]}>
                            <ContactIcon color={colors.text} />
                        </Pressable>
                        <Pressable style={[styles.iconButton, { backgroundColor: colorScheme === "dark" ? "#151718" : "#f0f0f0" }]}>
                            <MapIcon color={colors.text} />
                        </Pressable>
                    </View>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: verticalScale(42),
                        paddingHorizontal: scale(20),
                        borderBottomColor: "rgba(128, 117, 117, 0.6)",
                        borderBottomWidth: scale(1)
                    }}
                >
                    <CustomText
                        style={{
                            fontFamily: "AirbnbCereal_W_Bk"
                        }}
                    >Service</CustomText>
                    <Pressable
                        onPress={() => setServiceDrop((prev) => !prev)}
                    >{serviceDrop ? (<ArrowDownIcon size={scale(14)} />) : (<ArrowUpIcon size={scale(14)} />)}</Pressable>
                </View>

                {serviceDrop && (
                    <ScrollView contentContainerStyle={{ flexDirection: 'row', gap: scale(8), flexWrap: 'wrap' }}>
                        {serviceData.map((item, index) => (
                            <View
                                style={{
                                    width: '18%',
                                    alignItems: 'center',
                                    marginVertical: scale(8),
                                }}
                                key={index}
                            >
                                <Image
                                    style={{
                                        width: "100%",
                                        height: scale(64),
                                        borderRadius: scale(8),
                                        borderWidth: scale(1),
                                        borderColor: '#E8E8E8',
                                        backgroundColor: "#fff"
                                    }}
                                    source={{
                                        uri: item.iconImage
                                    }}
                                    contentFit="cover"
                                    transition={300}
                                />
                                <CustomText
                                    style={{
                                        fontFamily: 'AirbnbCereal_W_Bk',
                                        fontSize: scale(11),
                                        textAlign: 'center',
                                        marginTop: scale(4),
                                    }}
                                >
                                    {item.name}
                                </CustomText>
                            </View>
                        ))}
                    </ScrollView>
                )}


                <CustomText
                    style={{
                        fontFamily: "AirbnbCereal_W_Bd",
                        fontSize: scale(16),
                        marginVertical: verticalScale(12),
                    }}
                >
                    Follow us on
                </CustomText>

                <View
                    style={[
                        styles.linkContainer,
                        {
                            backgroundColor: colors.background,
                            borderRadius: scale(4),
                            padding: scale(14),
                            gap: verticalScale(10),
                        },
                    ]}
                >
                    <View>
                        <CustomSecondaryText style={{ marginBottom: verticalScale(4), fontSize: scale(13) }}>
                            📧 Email:
                        </CustomSecondaryText>
                        <CustomText style={{ fontSize: scale(14), fontFamily: "AirbnbCereal_W_Md" }}>
                            iqueuebook@hotmail.com
                        </CustomText>
                    </View>

                    <View>
                        <CustomSecondaryText style={{ marginBottom: verticalScale(4), fontSize: scale(13) }}>
                            🔗 Social Links:
                        </CustomSecondaryText>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
                            <FacebookIcon color='#1877F2' />
                            <InstagramIcon color="#E1306C" />
                        </View>
                    </View>
                </View>

            </View>
        </ScrollView>
    )
}

export default salon

const styles = StyleSheet.create({
    cardWrapper: {
        height: verticalScale(280),
        width: scale(400),
    },
    cardImage: {
        height: "100%",
        width: "100%",
    },


    map: {
        width: "100%",
        height: verticalScale(128),
    },

    addressContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", // Ensure spacing between text and icons
        padding: scale(10),
        borderRadius: scale(4),
        marginTop: verticalScale(10),
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.1,
        // shadowRadius: scale(4),
        // elevation: 2,
    },
    addressText: {
        flex: 1,
        fontSize: scale(14),
        fontFamily: "AirbnbCereal_W_Bk"
    },
    iconContainer: {
        flexDirection: "row",
        gap: scale(10),
    },
    iconButton: {
        width: scale(30),
        height: scale(30),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: scale(4)
    },
    linkContainer: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    }
})