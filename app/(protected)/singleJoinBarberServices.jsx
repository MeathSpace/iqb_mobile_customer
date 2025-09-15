import { FlatList, Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { AddIcon, ArrowLeftIcon, CheckIcon, SearchIcon } from '../../constants/icons';
import CustomText from '../../components/CustomText';
import Skeleton from '../../components/Skeleton';
import { Image } from 'expo-image';
import CustomSecondaryText from '../../components/CustomSecondaryText';

const singleJoinBarberServices = () => {

    const { selectBarber } = useLocalSearchParams();

    const parsedSelectBarber = JSON.parse(selectBarber)

    // console.log("Parsed Selected Barber ", parsedSelectBarber)

    const router = useRouter();
    const { colors } = useTheme();
    const colorScheme = useColorScheme();
    const { authenticatedUser } = useAuth()

    const [servicesList, setServicesList] = useState({
        data: null,
        filteredData: [],
        serviceCategories: [],
        loading: false,
        error: null,
        success: false
    })


    useEffect(() => {
        const fetchServicesByBarber = async () => {
            try {
                setServicesList((prev) => ({ ...prev, loading: true }))

                const { data } = await axios.post(`${BASE_URL}/mobileRoutes/getServicesByBarberId`, {
                    salonId: 1,
                    barberId: 1
                })

                setServicesList((prev) => ({ ...prev, loading: false, data: data?.response, filteredData: data?.response, serviceCategories: data?.serviceCategories, success: true, error: null }))
                // setSelectedCategory(data?.response?.[0]?.serviceCategoryName)
            } catch (error) {
                setServicesList((prev) => ({ ...prev, loading: false, data: null, filteredData: null, serviceCategories: null, success: false, error: error }))
                console.log("Error ", error?.response)
            }
        }

        fetchServicesByBarber()

    }, [])

    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const [searchServiceQuery, setSearchServiceQuery] = useState("")

    const handleChange = (text) => {
        setSelectedCategory("")
        setSearchServiceQuery(text)
    }

    useEffect(() => {
        if (searchServiceQuery) {
            const filtered = servicesList?.data?.filter((item) =>
                item?.serviceName?.toLowerCase().includes(searchServiceQuery.toLowerCase())
            );

            setServicesList((prev) => ({
                ...prev,
                filteredData: filtered
            }));
        } else {
            setServicesList((prev) => ({
                ...prev,
                filteredData: prev.data
            }));
        }
    }, [searchServiceQuery]);

    function formatMinutesToHrMin(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
        if (hours > 0) return `${hours}hr`;
        return `${mins}m`;
    }

    const addServiceHandler = (service) => {
        setSelectedServices((prev) => {
            const exists = prev.find((s) => s.serviceId === service.serviceId);
            if (exists) return prev;
            return [...prev, service];
        });
    };


    const removeServiceHandler = (service) => {
        setSelectedServices((prev) => prev.filter((s) => s.serviceId !== service.serviceId));
    };

    const insets = useSafeAreaInsets()

    useEffect(() => {
        if (selectedCategory) {
            // Filter based on category
            const filteredServicesData = servicesList?.data?.filter(
                (service) => service.serviceCategoryName === selectedCategory
            );

            setServicesList((prev) => ({
                ...prev,
                filteredData: filteredServicesData,
            }));
        } else {
            // If no category selected, reset to all data
            setServicesList((prev) => ({
                ...prev,
                filteredData: prev.data,
            }));
        }
    }, [selectedCategory, servicesList?.data]);

    const totalPrice = selectedServices.reduce((acc, service) => acc + service.servicePrice, 0);
    const totalTime = selectedServices.reduce((acc, service) => acc + service.barberServiceEWT, 0);
    const totalServices = selectedServices.length;


    // console.log("servicesList ", servicesList?.data)

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.background,
                padding: scale(10),
            }}
        >
            {/* Header */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: scale(10),
                    marginBottom: verticalScale(20),
                }}
            >
                <Pressable onPress={() => router.back()}>
                    <ArrowLeftIcon color={colors.text} />
                </Pressable>
                <CustomText
                    style={{
                        flex: 1,
                        fontFamily: "AirbnbCereal_W_XBd",
                        fontSize: scale(20),
                    }}
                >
                    Single Join (Services)
                </CustomText>
            </View>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                {/* Search Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Search services by category"
                        placeholderTextColor={colors.secondaryText}
                        value={searchServiceQuery}
                        onChangeText={handleChange}
                        style={[
                            styles.input,
                            {
                                borderWidth: scale(1),
                                borderColor: colors.queueBorder,
                                backgroundColor: colors.cardColor,
                                color: colors.text,
                            },
                        ]}
                    />
                    <Pressable style={styles.searchButton}>
                        <SearchIcon size={scale(20)} color="white" />
                    </Pressable>
                </View>
            </TouchableWithoutFeedback>

            {/* Categories */}
            {servicesList?.loading ? (
                <FlatList
                    data={[0, 1, 2, 3, 4, 5, 6]}
                    renderItem={({ item }) => (
                        <Skeleton
                            height={verticalScale(40)}
                            width={scale(100)}
                            borderRadius={scale(12)}
                        />
                    )}
                    keyExtractor={(item) => item.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{
                        height: verticalScale(40),
                        flexGrow: 0,
                        marginBottom: verticalScale(15),
                    }}
                    contentContainerStyle={{
                        alignItems: "center",
                        gap: scale(8),
                    }}
                />
            ) : (
                <FlatList
                    data={servicesList?.serviceCategories}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setSelectedCategory(item.serviceCategoryName)}
                            style={[
                                styles.categoryButton,
                                {
                                    backgroundColor:
                                        selectedCategory === item?.serviceCategoryName
                                            ? "#14b8a6"
                                            : colorScheme === "dark"
                                                ? "#3f3f46"
                                                : "#e4e4e7",
                                    flexDirection: "row",
                                    gap: scale(5),
                                },
                            ]}
                        >
                            <Image
                                style={{
                                    width: scale(20),
                                    height: scale(20),
                                    borderRadius: scale(20),
                                    borderWidth: scale(1),
                                    borderColor: colors.queueBorder,
                                }}
                                source={{ uri: item?.serviceCategoryImage?.url }}
                                contentFit="cover"
                                transition={300}
                            />
                            <CustomText
                                style={{
                                    lineHeight: verticalScale(35),
                                    color:
                                        selectedCategory === item?.serviceCategoryName
                                            ? "#fff"
                                            : colorScheme === "dark"
                                                ? "#fff"
                                                : "#000",
                                    textAlign: "center",
                                }}
                            >
                                {item?.serviceCategoryName}
                            </CustomText>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{
                        height: verticalScale(35),
                        flexGrow: 0,
                        marginBottom: verticalScale(15),
                    }}
                    contentContainerStyle={{
                        alignItems: "center",
                        gap: scale(8),
                    }}
                />
            )}

            {/* Scrollable List Area */}
            <View style={{
                flex: 1,
                marginBottom: selectedServices?.length ? (Platform.OS === "ios" ? insets.bottom + verticalScale(20) : verticalScale(80)) : 0
            }}
            >
                {servicesList?.loading ? (
                    <FlatList
                        data={[1, 2, 3, 4, 5, 6, 7, 8]}
                        renderItem={() => (
                            <Skeleton width={scale(160)} height={235} borderRadius={scale(8)} />
                        )}
                        keyExtractor={(item) => item.toString()}
                        numColumns={2}
                        columnWrapperStyle={{ columnGap: scale(10) }}
                        ItemSeparatorComponent={() => <View style={{ height: scale(10) }} />}
                        contentContainerStyle={{ paddingBottom: scale(20), paddingTop: scale(10) }}
                        showsVerticalScrollIndicator={false}
                    />
                ) : servicesList?.data?.length > 0 ? (
                    <FlatList
                        data={servicesList?.filteredData}
                        renderItem={({ item }) => {
                            const isSelected = selectedServices.find(s => s.serviceId === item.serviceId);
                            return (
                                <Pressable
                                    onPress={() =>
                                        isSelected
                                            ? removeServiceHandler(item)
                                            : addServiceHandler(item)
                                    }
                                    style={[
                                        styles.serviceCard,
                                        {
                                            backgroundColor: colors.cardColor,
                                            borderColor: isSelected ? "#14b8a6" : colors.queueBorder,
                                            borderWidth: isSelected ? scale(2) : scale(1),
                                        },
                                    ]}
                                >
                                    <View style={styles.serviceCardImageContainer}>
                                        <Image
                                            style={[
                                                styles.serviceCardImage,
                                                { borderWidth: scale(1), borderColor: colors.queueBorder },
                                            ]}
                                            source={{ uri: item?.serviceIcon?.url }}
                                            contentFit="cover"
                                            transition={300}
                                        />
                                        <Pressable
                                            onPress={() =>
                                                isSelected
                                                    ? removeServiceHandler(item)
                                                    : addServiceHandler(item)
                                            }
                                            style={[
                                                styles.selectIcon,
                                                {
                                                    backgroundColor: isSelected
                                                        ? "#14b8a6"
                                                        : colorScheme === "dark"
                                                            ? "#3f3f46"
                                                            : "#e4e4e7",
                                                },
                                            ]}
                                        >
                                            {isSelected ? (
                                                <CheckIcon color="#fff" size={scale(18)} />
                                            ) : (
                                                <AddIcon color={colors.text} />
                                            )}
                                        </Pressable>
                                    </View>
                                    <CustomText
                                        style={{
                                            fontFamily: "AirbnbCereal_W_Bd",
                                            textAlign: "center",
                                        }}
                                    >
                                        {item?.serviceName}
                                    </CustomText>
                                    <CustomSecondaryText>
                                        ~{formatMinutesToHrMin(item?.barberServiceEWT)}
                                    </CustomSecondaryText>
                                    <CustomText
                                        style={{
                                            fontFamily: "AirbnbCereal_W_XBd",
                                        }}
                                    >
                                        {authenticatedUser?.currency} {item?.servicePrice}
                                    </CustomText>
                                </Pressable>
                            );
                        }}
                        keyExtractor={(item) => item?.serviceId}
                        numColumns={2}
                        columnWrapperStyle={{ columnGap: scale(10) }}
                        ItemSeparatorComponent={() => <View style={{ height: scale(10) }} />}
                        contentContainerStyle={{ paddingBottom: scale(20), paddingTop: scale(10) }}
                        showsVerticalScrollIndicator={false}
                    />
                ) : null}
            </View>

            {/* Footer */}
            {selectedServices?.length ? (
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
                            {authenticatedUser?.currency} {totalPrice.toFixed(2)}
                        </CustomText>
                        <CustomSecondaryText>
                            {totalServices} {totalServices === 1 ? "service" : "services"} |{" "}
                            {formatMinutesToHrMin(totalTime)}
                        </CustomSecondaryText>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            // router.push({
                            //     pathname: "/singleJoinBarber",
                            //     params: {
                            //         data: JSON.stringify(selectedServices),
                            //     },
                            // });

                            router.push({
                                pathname: "/singleJoinModal",
                                params: {
                                    selectedServices: JSON.stringify(selectedServices),
                                    selectBarber: JSON.stringify(parsedSelectBarber)
                                },
                            });
                        }}
                        style={styles.queueButton}
                        activeOpacity={0.85}
                    >
                        <CustomText style={styles.queueButtonText}>Continue</CustomText>
                    </TouchableOpacity>
                </View>
            ) : null}
        </SafeAreaView>
    )
}

export default singleJoinBarberServices

const styles = StyleSheet.create({
    categoryButton: {
        paddingHorizontal: scale(10),
        borderRadius: scale(8),
        justifyContent: 'center',
        alignItems: 'center',
    },


    inputContainer: {
        position: 'relative',
        width: '100%',
        justifyContent: 'center',
        marginBottom: verticalScale(15),
    },
    input: {
        width: '100%',
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(16),
        paddingRight: scale(50), // space for the search button
        borderRadius: scale(8),
    },
    searchButton: {
        position: 'absolute',
        right: scale(4),
        backgroundColor: '#14b8a6', // teal-500
        padding: scale(8),
        borderRadius: scale(6),
        justifyContent: 'center',
        alignItems: 'center',
    },

    serviceCard: {
        // width: scale(103), for 3 cards
        width: scale(160),
        // height: verticalScale(150),
        borderRadius: scale(8),
        justifyContent: "center",
        alignItems: "center",
        padding: scale(10),
        gap: verticalScale(5)
    },

    serviceCardImageContainer: {
        width: "100%",
        height: verticalScale(120),
        position: "relative"
    },

    serviceCardImage: {
        width: "100%",
        height: "100%",
        borderRadius: scale(4),
    },
    selectIcon: {
        position: "absolute",
        bottom: verticalScale(10),
        right: scale(10),
        height: scale(30),
        width: scale(30),
        borderRadius: scale(30),
        backgroundColor: "gray",
        justifyContent: "center",
        alignItems: "center"
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






    container: {
        flex: 1,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
});