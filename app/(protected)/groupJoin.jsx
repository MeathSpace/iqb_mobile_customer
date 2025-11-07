import { Alert, FlatList, Keyboard, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'; // Removed unused TouchableOpacity
import React, { useEffect, useRef, useState } from 'react';
import CustomText from '../../components/CustomText';
import { useRouter } from 'expo-router';
import { SafeAreaInsetsContext, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePreventRemove, useTheme } from '@react-navigation/native';
import { AddIcon, ArrowLeftIcon, CheckIcon, SearchIcon } from '../../constants/icons';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Image } from 'expo-image';
import CustomSecondaryText from '../../components/CustomSecondaryText';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import { Toast } from 'toastify-react-native'
import Skeleton from '../../components/Skeleton';
import { useGlobal } from '../../context/GlobalContext';

const GroupJoin = () => {

    const router = useRouter();
    const { colors } = useTheme();
    const colorScheme = useColorScheme();
    const { authenticatedUser } = useAuth()

    const [servicesCategoryList, setServicesCategoryList] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
    })

    useEffect(() => {
        const fetchCategoryList = async () => {
            try {
                setServicesCategoryList((prev) => ({ ...prev, loading: true }))

                const { data } = await axios.post(`${BASE_URL}/mobileRoutes/getAllSalonCategories`, {
                    salonId: authenticatedUser?.salonId
                })

                setServicesCategoryList((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))
                setSelectedCategory(data?.response?.[0]?.serviceCategoryName)
            } catch (error) {
                setServicesCategoryList((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
                console.log("Error ", error?.response)
            }
        }

        fetchCategoryList()
    }, [authenticatedUser])


    const categoryList = [
        "Hair Cut",
        "Beard",
        "Trim",
        "Spa",
        "Hair"
    ];

    const [selectedCategory, setSelectedCategory] = useState("");

    const [salonServicesByCategory, setSalonServicesByCategory] = useState({
        data: [],
        filteredData: [],
        loading: false,
        error: null,
        success: false
    });


    useEffect(() => {
        const fetchSalonServicesByCategory = async () => {
            try {
                setSalonServicesByCategory((prev) => ({ ...prev, loading: true }))

                const { data } = await axios.get(`${BASE_URL}/mobileRoutes/getSalonServicesByCategory`, {
                    params: {
                        salonId: authenticatedUser?.salonId,
                        serviceCategoryName: selectedCategory
                    }
                })

                setSalonServicesByCategory((prev) => ({ ...prev, loading: false, data: data?.response, filteredData: data?.response, success: true, error: null }))

            } catch (error) {
                setSalonServicesByCategory((prev) => ({ ...prev, loading: false, data: null, filteredData: null, success: false, error: error }))
                console.log("Error ", error)
            }
        }

        if (selectedCategory) {
            fetchSalonServicesByCategory()
        }

    }, [selectedCategory])


    const [searchServiceQuery, setSearchServiceQuery] = useState("")

    const handleChange = (text) => {
        setSearchServiceQuery(text)
    }


    useEffect(() => {
        if (searchServiceQuery) {
            const filtered = salonServicesByCategory?.data?.filter((item) =>
                item?.serviceName?.toLowerCase().includes(searchServiceQuery.toLowerCase())
            );

            setSalonServicesByCategory((prev) => ({
                ...prev,
                filteredData: filtered
            }));
        } else {
            setSalonServicesByCategory((prev) => ({
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

    const {
        groupJoinMembers,
        setGroupJoinMembers,
        memberName,
        setMemberName,
        selectedMemberServices,
        setSelectedMemberServices,
        setSelectedMemberBarber,
    } = useGlobal()


    const addServiceHandler = (service) => {
        setSelectedMemberServices((prev) => {
            const exists = prev.find((s) => s.serviceId === service.serviceId);
            if (exists) return prev;
            return [...prev, service];
        });
    };


    const removeServiceHandler = (service) => {
        setSelectedMemberServices((prev) => prev.filter((s) => s.serviceId !== service.serviceId));
    };

    const insets = useSafeAreaInsets()

    const totalPrice = selectedMemberServices.reduce((acc, service) => acc + service.servicePrice, 0);
    const totalTime = selectedMemberServices.reduce((acc, service) => acc + service.serviceEWT, 0);
    const totalServices = selectedMemberServices.length;


    const allowGroupJoinExitRef = useRef(false);

    usePreventRemove(true, ({ data }) => {
        if (allowGroupJoinExitRef.current) {
            setSelectedMemberServices([])
            setSelectedMemberBarber(null)
            setGroupJoinMembers([])
            setMemberName(authenticatedUser?.name)
            router.push("/queuelist"); // or router.push("/something")
            return;
        }

        Alert.alert(
            'Discard group join data?',
            'All selected members will be cleared, and the group join information will be reset.',
            [
                {
                    text: "Cancel",
                    style: 'destructive',
                    onPress: () => {
                        // Do nothing, block navigation
                    },
                },
                {
                    text: "OK",
                    onPress: () => {
                        allowGroupJoinExitRef.current = true;
                        router.back(); // or router.push("/home") etc.
                    },
                },
            ],
            { cancelable: true }
        );
    });

    return (

        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.background,
                padding: scale(10),
            }}
        >
            <View
                style={{
                    flex: 1,
                    padding: scale(10)
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
                    <Pressable onPress={() => router.replace("/queuelist")}>
                        <ArrowLeftIcon color={colors.text} />
                    </Pressable>
                    <CustomText
                        style={{
                            flex: 1,
                            fontFamily: "AirbnbCereal_W_XBd",
                            fontSize: scale(20),
                        }}
                    >
                        Group Join (Services)
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
                {servicesCategoryList?.loading ? (
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
                        data={servicesCategoryList?.data}
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
                }}
                >
                    {salonServicesByCategory?.loading ? (
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
                    ) : salonServicesByCategory?.data?.length > 0 ? (
                        <FlatList
                            data={salonServicesByCategory?.filteredData}
                            renderItem={({ item }) => {
                                const isSelected = selectedMemberServices.find(s => s.serviceId === item.serviceId);
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
                                            ~{formatMinutesToHrMin(item?.serviceEWT)}
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
                            contentContainerStyle={{ paddingVertical: scale(10) }}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : null}
                </View>
            </View>

            {/* Footer */}
            {selectedMemberServices?.length ? (
                <View
                    style={{
                        // backgroundColor: colors.cardColor,
                        borderTopColor: colors.queueBorder,
                        borderTopWidth: scale(1),
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: scale(10)
                    }}
                >
                    <View style={{ }}>
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
                            //     pathname: "/groupJoinBarber",
                            //     params: {
                            //         data: JSON.stringify(selectedMemberServices),
                            //     },
                            // });
                            setSelectedMemberServices(selectedMemberServices)
                            router.push("/groupJoinBarber")
                        }}
                        style={styles.queueButton}
                        activeOpacity={0.85}
                    >
                        <CustomText style={styles.queueButtonText}>Continue</CustomText>
                    </TouchableOpacity>
                </View>
            ) : null}
        </SafeAreaView>
    );
};

export default GroupJoin;

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
        // marginBottom: verticalScale(15), // mb-6
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



