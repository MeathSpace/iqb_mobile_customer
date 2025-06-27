import {
    Pressable,
    ScrollView,
    StyleSheet,
    View,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    Animated,
    Easing,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import CustomText from '../../components/CustomText'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/Colors'
import CustomSecondaryText from '../../components/CustomSecondaryText'
import { AddIcon, ArrowLeftIcon, CheckIcon, ClockIcon, ErrorIcon } from '../../constants/icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useTheme } from '@react-navigation/native'
import { useGlobal } from '../../context/GlobalContext'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import Skeleton from '../../components/Skeleton'
import { Toast } from 'toastify-react-native'

const groupJoin = () => {

    const { authenticatedUser } = useAuth()

    const [salonServices, setSalonServices] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
    })

    const [salonBarber, setSalonBarber] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
    })


    useEffect(() => {
        const fetchSalonServices = async () => {
            try {

                setSalonServices((prev) => ({ ...prev, loading: true }))

                const { data } = await axios.get(`${BASE_URL}/mobileRoutes/getAllSalonServices`, {
                    params: {
                        salonId: authenticatedUser?.salonId
                    }
                })

                setSalonServices((prev) => ({
                    ...prev, loading: false, data: data?.response?.map((item) => {
                        return (
                            { ...item, selected: false }
                        )
                    }), success: true, error: null
                }))

            } catch (error) {

                setSalonServices((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
                console.log("Error fetching salon Info ", error)
            }
        }

        fetchSalonServices()
    }, [authenticatedUser])

    const [selectCustomerServices, setSelectedCustomerServices] = useState([])
    const [continueService, setContinueService] = useState(false)


    useEffect(() => {
        if (selectCustomerServices.length > 0 && continueService) {

            const fetchBarbersByMultipleServiceId = async () => {
                try {

                    setSalonBarber((prev) => ({ ...prev, loading: true }))

                    const { data } = await axios.post(`${BASE_URL}/mobileRoutes/getBarberByMultipleServiceId`, {
                        salonId: authenticatedUser.salonId,
                        serviceIds: selectCustomerServices.map((item) => item.serviceId)
                    })

                    setSalonBarber((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))

                } catch (error) {

                    setSalonBarber((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
                    console.log("Error fetching barbers by multiple service Id", error)
                }
            }

            fetchBarbersByMultipleServiceId()
        }

    }, [authenticatedUser, selectCustomerServices, continueService])

    useEffect(() => {
        setMemberName(authenticatedUser?.name)
    }, [])

    const addServiceHandler = (service) => {
        setContinueService(false)
        const updatedSalonServices = salonServices?.data?.map((item) => {
            return item?.serviceId === service?.serviceId ? { ...service, selected: true } : item
        })

        setSalonServices({
            data: updatedSalonServices,
            loading: false,
            error: null,
            success: false
        })

        setSelectedCustomerServices([...selectCustomerServices, service])
    }

    const removeServiceHandler = (service) => {
        setContinueService(false)
        const updatedSalonServices = salonServices?.data?.map((item) => {
            return item?.serviceId === service?.serviceId ? { ...service, selected: false } : item
        })

        setSalonServices({
            data: updatedSalonServices,
            loading: false,
            error: null,
            success: false
        })

        setSelectedCustomerServices((prev) => {

            const filteredArray = prev.filter((item) => {
                return item?.serviceId !== service?.serviceId
            })

            return filteredArray
        })
    }

    const [memberName, setMemberName] = useState("")
    const [memberNameError, setMemberNameError] = useState("")

    const [activeSection, setActiveSection] = useState('addmember')
    const [scrolling, setScrolling] = useState(false)
    const [addIconPressCount, setAddIconPressCount] = useState(0);


    const handleScrollStart = (section) => {
        setActiveSection(section)
        setScrolling(true)
        setAddIconPressCount(1)
    }

    const { colors } = useTheme()


    const {
        customerName,
        setCustomerName
    } = useGlobal();

    const router = useRouter()

    const [groupJoinMembers, setGroupJoinMembers] = useState([])

    const paddingAnim = useRef(new Animated.Value(scale(15))).current;
    const flexAnim = useRef(new Animated.Value(0)).current;

    // console.log("groupJoinMembers ", groupJoinMembers)

    const removeGroupMember = (member) => {
        const filteredData = groupJoinMembers.filter((item) => item.id !== member.id)
        setGroupJoinMembers(filteredData)
    }

    useEffect(() => {
        Animated.timing(paddingAnim, {
            toValue: scrolling ? scale(0) : scale(15),
            duration: 300,
            // easing: Easing.back(),
            useNativeDriver: false, // Padding cannot use native driver
        }).start();

        Animated.timing(flexAnim, {
            toValue: scrolling ? 1 : 0,
            duration: scrolling ? 300 : 0,
            // easing: Easing.back(),
            useNativeDriver: false, // layout props like flex can't use native driver
        }).start();
    }, [scrolling]);

    const joinConfirmation = () => {
        router.push({
            pathname: "/joinConfirmation",
            params: {
                groupJoinMembers: JSON.stringify(groupJoinMembers),
                singleJoin: false
            },
        });
    }

    const renderSection = (key, title, content) => {

        const isActive = activeSection === key

        if (scrolling && !isActive) return null

        return isActive ? (
            <Animated.View style={[styles.boxOpenWrapper, {
                flex: flexAnim,
                backgroundColor: colors.background,
            }]}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        gap: verticalScale(15),
                        paddingBottom: scale(30),
                    }}
                    onTouchStart={() => handleScrollStart(key)}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                        <Pressable
                            onPress={() => {
                                setScrolling(false)
                                setActiveSection("")
                                setAddIconPressCount(0)
                            }}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: scale(5)
                            }}>
                            <ArrowLeftIcon color={colors.text} />
                            <CustomText style={{ fontSize: scale(16), fontFamily: "AirbnbCereal_W_Blk" }}>{title}</CustomText>
                        </Pressable>
                    </View>

                    {
                        activeSection === "addedmember" && (
                            groupJoinMembers?.length > 0 ? (
                                <>
                                    {/* <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Pressable
                                        style={{
                                            // width: scale(70),
                                            flex: 1,
                                            height: verticalScale(30),
                                            borderRadius: scale(8),
                                            backgroundColor: groupJoinMembers.length ? Colors.modeColor.colorCode : "#D7D7D7",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                        onPress={() => {
                                            if (groupJoinMembers.length) {
                                                router.push("/joinConfirmation")
                                            }
                                        }}
                                    >
                                        <CustomText
                                            style={{
                                                fontSize: scale(12),
                                                color: groupJoinMembers.length ? "#fff" : "#999898"
                                            }}
                                        >Book</CustomText>
                                    </Pressable>
                                </View> */}

                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <CustomText>Total</CustomText>
                                        <CustomText
                                            style={{
                                                fontFamily: "AirbnbCereal_W_Blk",
                                                color: "#0BA3AD"
                                            }}
                                        >{groupJoinMembers?.length}</CustomText>
                                    </View>

                                    {
                                        groupJoinMembers.map((item, index) => {
                                            return (
                                                <View
                                                    key={index}
                                                    style={{
                                                        paddingVertical: verticalScale(8),
                                                        width: "100%",
                                                        backgroundColor: "#00B0901A",
                                                        padding: scale(10),
                                                        position: "relative",
                                                        borderRadius: scale(10),
                                                        gap: verticalScale(10)
                                                    }}>
                                                    <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
                                                        <Image
                                                            style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(30) }}
                                                            source={{ uri: item?.selectedCustomerBarber?.profile?.[0]?.url }}
                                                            // placeholder={{ blurhash }}
                                                            contentFit="cover"
                                                            transition={300}
                                                        />
                                                        <View style={{
                                                            gap: verticalScale(5)
                                                        }}>
                                                            <CustomText style={{
                                                                fontSize: scale(14)
                                                            }}>{item?.selectedCustomerBarber?.name}</CustomText>
                                                            <CustomText
                                                                style={{
                                                                    fontSize: scale(12),
                                                                    color: "gray"
                                                                }}
                                                            >{item?.memberName}</CustomText>
                                                        </View>
                                                    </View>

                                                    <View style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "space-between"
                                                    }}>
                                                        <View>
                                                            {
                                                                item?.selectCustomerServices?.map((service) => {
                                                                    return (
                                                                        <CustomSecondaryText
                                                                            key={service.serviceId}
                                                                            style={{
                                                                                fontSize: scale(11)
                                                                            }}
                                                                        >{service?.serviceName}</CustomSecondaryText>
                                                                    )
                                                                })

                                                            }

                                                        </View>

                                                        <View style={{ gap: scale(6) }}>
                                                            <CustomText
                                                                style={{
                                                                    textAlign: "center",
                                                                    fontSize: scale(18),
                                                                    fontFamily: "AirbnbCereal_W_Blk",
                                                                    color: Colors.modeColor.colorCode
                                                                }}>{authenticatedUser?.currency} {item.selectCustomerServices.reduce((acc, item) => acc + item.servicePrice, 0)}</CustomText>

                                                            <View style={{
                                                                flexDirection: "row",
                                                                alignItems: "center",
                                                                justifyContent: "space-between",
                                                                width: scale(75),
                                                                gap: scale(2),
                                                                backgroundColor: colors.background,
                                                                paddingHorizontal: scale(5),
                                                                borderRadius: scale(4)
                                                            }}>
                                                                <ClockIcon size={scale(12)} color={Colors.modeColor.colorCode} />
                                                                <CustomText style={{ fontSize: scale(12), flex: 1, color: Colors.modeColor.colorCode }}>{item.selectCustomerServices.reduce((acc, item) => acc + item.serviceEWT, 0)} mins</CustomText>
                                                            </View>

                                                        </View>
                                                    </View>

                                                    <Pressable
                                                        style={{
                                                            position: "absolute",
                                                            right: scale(10),
                                                            top: verticalScale(10),
                                                            height: verticalScale(20),
                                                            width: scale(60),
                                                            backgroundColor: "#E11D48",
                                                            borderRadius: scale(4),
                                                            justifyContent: "center",
                                                            alignItems: "center"
                                                        }}
                                                        onPress={() => removeGroupMember(item)}
                                                    ><CustomText style={{ fontSize: scale(12), color: "#fff" }}>Remove</CustomText>
                                                    </Pressable>

                                                </View>
                                            )
                                        })
                                    }
                                </>
                            ) : (
                                <View
                                    style={{
                                        paddingTop: verticalScale(20)
                                    }}
                                >
                                    <CustomText>No members added</CustomText>
                                </View>
                            )

                        )
                    }

                    {
                        activeSection === "addmember" && (
                            <>
                                <TextInput
                                    editable
                                    placeholder="Enter member name"
                                    placeholderTextColor={"gray"}
                                    style={[false ? styles.inputFielderror : styles.inputField, { backgroundColor: "#00B0901A", fontFamily: "AirbnbCereal_W_Bk", color: colors.text }]}
                                    value={memberName}
                                    onChangeText={text => setMemberName(text)}
                                />

                                {
                                    memberNameError && (
                                        <View style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: scale(5),
                                        }}>
                                            <ErrorIcon color='red' size={scale(16)} />
                                            <CustomText style={{ fontSize: scale(12), color: "red" }}>{memberNameError}</CustomText>
                                        </View>
                                    )
                                }

                                <Pressable
                                    onPress={() => {
                                        if (addIconPressCount === 1) {

                                            if (!memberName) {
                                                setMemberNameError("Member name is required");
                                                return;
                                            } else if (memberName.length < 2) {
                                                setMemberNameError("Member name must be at least 2 characters");
                                                return;
                                            } else if (memberName.length > 20) {
                                                setMemberNameError("Member name must be at most 20 characters");
                                                return;
                                            }

                                            setScrolling(false)
                                            setActiveSection("services")
                                            setAddIconPressCount(0)
                                        }
                                    }}
                                    style={styles.searchButton}>
                                    <CustomText style={{ color: '#fff' }}>Done</CustomText>
                                </Pressable>
                            </>
                        )
                    }

                    {
                        activeSection === "services" && (
                            salonServices?.loading ? (
                                [0, 1, 2, 3, 4, 5].map((_, index) => {
                                    return (
                                        <Skeleton
                                            key={index}
                                            height={verticalScale(150)}
                                            borderRadius={scale(10)}
                                        />
                                    )
                                })
                            ) : (
                                salonServices?.data?.map((item, index) => {
                                    return (
                                        <Pressable
                                            key={item?.serviceId}
                                            style={{
                                                borderRadius: scale(10),
                                                backgroundColor: "#00B0901A",
                                                padding: scale(12),
                                                gap: verticalScale(10)
                                            }}
                                        >
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        gap: scale(10)
                                                    }}
                                                >

                                                    {
                                                        item?.selected ? (
                                                            <View
                                                                style={{
                                                                    height: scale(50),
                                                                    width: scale(50),
                                                                    borderRadius: scale(80),
                                                                    backgroundColor: "rgba(0,0,0,0.4)",
                                                                    position: "relative"
                                                                }}
                                                            >
                                                                <Image
                                                                    style={{ height: scale(50), width: scale(50), borderRadius: scale(80), zIndex: -1 }}
                                                                    source={{ uri: item?.serviceIcon?.url }}
                                                                    // placeholder={{ blurhash }}
                                                                    contentFit="cover"
                                                                    transition={300}
                                                                />
                                                                <CheckIcon
                                                                    color='#fff'
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: scale(14),
                                                                        left: scale(14)
                                                                    }}
                                                                />
                                                            </View>
                                                        ) : (
                                                            <Image
                                                                style={{ height: scale(50), width: scale(50), borderRadius: scale(80) }}
                                                                source={{ uri: item?.serviceIcon?.url }}
                                                                // placeholder={{ blurhash }}
                                                                contentFit="cover"
                                                                transition={300}
                                                            />
                                                        )
                                                    }

                                                    <View style={{ gap: verticalScale(5) }}>
                                                        <CustomText style={{
                                                            fontSize: scale(12),
                                                            fontFamily: "AirbnbCereal_W_Bd"
                                                        }}>{item?.serviceName}</CustomText>
                                                        <Pressable
                                                            style={{
                                                                height: verticalScale(15),
                                                                width: scale(50),
                                                                backgroundColor: "#00B0901A",
                                                                borderRadius: scale(4),
                                                                justifyContent: "center",
                                                                alignItems: "center"
                                                            }}
                                                        ><CustomText style={{ fontSize: scale(10), color: "#00B090" }}>{item?.serviceCategoryName}</CustomText></Pressable>
                                                    </View>
                                                </View>

                                                {
                                                    item?.selected ? (
                                                        <Pressable
                                                            onPress={() => removeServiceHandler(item)}
                                                            style={{
                                                                height: verticalScale(20),
                                                                width: scale(60),
                                                                backgroundColor: "#E11D48",
                                                                borderRadius: scale(4),
                                                                justifyContent: "center",
                                                                alignItems: "center"
                                                            }}
                                                        ><CustomText style={{ fontSize: scale(12), color: "#fff" }}>Remove</CustomText>
                                                        </Pressable>
                                                    ) : (
                                                        <Pressable
                                                            onPress={() => addServiceHandler(item)}
                                                            style={{
                                                                height: verticalScale(20),
                                                                width: scale(55),
                                                                backgroundColor: "#1f2937",
                                                                borderRadius: scale(4),
                                                                justifyContent: "center",
                                                                alignItems: "center"
                                                            }}
                                                        ><CustomText style={{ fontSize: scale(12), color: "#fff" }}>Add</CustomText>
                                                        </Pressable>
                                                    )
                                                }
                                            </View>

                                            <View style={{ marginTop: verticalScale(5), gap: verticalScale(5) }}>
                                                <CustomText
                                                    style={{
                                                        color: "gray",
                                                        fontSize: scale(12)
                                                    }}
                                                >{item?.serviceDesc}</CustomText>

                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "space-between"
                                                    }}
                                                >
                                                    <View style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        width: scale(75),
                                                        gap: scale(2),
                                                        backgroundColor: colors.background,
                                                        paddingHorizontal: scale(5),
                                                        borderRadius: scale(4)
                                                    }}>
                                                        <ClockIcon size={scale(12)} color={Colors.modeColor.colorCode} />
                                                        <CustomText style={{ fontSize: scale(12), flex: 1, color: Colors.modeColor.colorCode }}>{item?.serviceEWT} mins</CustomText>
                                                    </View>

                                                    {/* Currency should also be added in authenticated user response */}
                                                    {/* Service Price doesnot have point value */}

                                                    <CustomText
                                                        style={{
                                                            fontFamily: "AirbnbCereal_W_Blk",
                                                            fontSize: scale(18),
                                                            color: Colors.modeColor.colorCode
                                                        }}
                                                    >{authenticatedUser?.currency} {item?.servicePrice}</CustomText>
                                                </View>
                                            </View>
                                        </Pressable >
                                    )
                                })
                            )

                        )
                    }

                    {
                        activeSection === "barber" && (
                            salonBarber?.loading ? (
                                [0, 1, 2, 3, 4, 5].map((_, index) => {
                                    return (
                                        <Skeleton
                                            key={index}
                                            height={verticalScale(60)}
                                            borderRadius={scale(10)}
                                        />
                                    )
                                })
                            ) : salonBarber?.data?.length > 0 ? (
                                salonBarber?.data?.map((item, index) => {
                                    return (
                                        <Pressable
                                            key={item?.barberId}
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                backgroundColor: "#00B0901A",
                                                borderRadius: scale(10),
                                                padding: scale(10)
                                            }}
                                            onPress={() => {
                                                if (selectCustomerServices.length === 0) {
                                                    Toast.error("Services are not selected")
                                                    return
                                                } else if (!memberName) {
                                                    Toast.error("Member Name is required")
                                                    return
                                                }

                                                setGroupJoinMembers([
                                                    ...groupJoinMembers,
                                                    {
                                                        id: Date.now(),
                                                        memberName,
                                                        selectCustomerServices,
                                                        selectedCustomerBarber: item
                                                    }
                                                ])
                                                setSelectedCustomerServices([])
                                                setMemberName("")
                                                setSalonServices((prev) => ({
                                                    loading: false, data: prev.data?.map((item) => {
                                                        return (
                                                            { ...item, selected: false }
                                                        )
                                                    }), success: true, error: null
                                                }))
                                                setScrolling(false)
                                                setActiveSection("addedmember")
                                                setAddIconPressCount(0)

                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: scale(10)
                                                }}
                                            >
                                                <Image
                                                    style={{ height: scale(50), width: scale(50), borderRadius: scale(40) }}
                                                    source={{ uri: item?.profile?.[0]?.url }}
                                                    contentFit="cover"
                                                    transition={300}
                                                />

                                                <View>
                                                    <CustomText style={{
                                                        fontSize: scale(14)
                                                    }}>{item?.name}</CustomText>
                                                    <View style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        gap: scale(2),
                                                        minWidth: scale(75),
                                                        flex: 1
                                                    }}>
                                                        <ClockIcon size={scale(12)} color='gray' />
                                                        <CustomText style={{ fontSize: scale(12), flex: 1, color: "gray" }}>{item?.barberEWT} mins</CustomText>
                                                    </View>
                                                </View>
                                            </View>

                                            <View
                                                style={{

                                                }}
                                            >
                                                <CustomText style={{ fontSize: scale(16), fontFamily: "AirbnbCereal_W_Blk", textAlign: "center" }}>{item?.queueCount}</CustomText>
                                                <CustomText style={{ fontSize: scale(14), color: "gray" }}>In Queue</CustomText>
                                            </View>
                                        </Pressable>
                                    )
                                })
                            ) : (
                                <View
                                    style={{
                                        paddingTop: verticalScale(20)
                                    }}
                                >
                                    <CustomText>No barbers available</CustomText>
                                </View>
                            )

                        )
                    }

                </ScrollView>

                {
                    scrolling && activeSection === "services" && selectCustomerServices.length > 0 && (
                        <View style={{
                            // height: verticalScale(50),
                            width: "100%",
                            borderTopColor: "#D2D2D2",
                            borderTopWidth: scale(0.5),
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingVertical: verticalScale(10),
                            marginBottom: -verticalScale(15),
                            // position: "absolute",
                        }}>
                            <View>
                                <CustomText
                                    style={{
                                        fontSize: scale(18),
                                        fontFamily: "AirbnbCereal_W_Blk"
                                    }}
                                >$ {selectCustomerServices.reduce((acc, item) => acc + item.servicePrice, 0)}</CustomText>
                                <CustomText
                                    style={{
                                        fontSize: scale(12),
                                        color: "gray"
                                    }}
                                >{selectCustomerServices.length} services | {selectCustomerServices.reduce((acc, item) => acc + item.serviceEWT, 0)} mins</CustomText>
                            </View>

                            <Pressable
                                onPress={() => {
                                    setContinueService(true)
                                    setScrolling(false)
                                    setActiveSection("barber")
                                    setAddIconPressCount(0)
                                }}
                                style={{
                                    height: verticalScale(40),
                                    width: scale(100),
                                    backgroundColor: Colors.modeColor.colorCode,
                                    borderRadius: scale(6),
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <CustomText style={{
                                    color: "#fff", fontSize: scale(16)
                                }}>Continue</CustomText>
                            </Pressable>
                        </View>
                    )
                }

            </Animated.View>
        ) : (
            <Pressable
                style={[styles.boxCloseWrapper, {
                    backgroundColor: colors.background,
                }]}
                onPress={() => setActiveSection(key)}
            >
                <CustomText>{title}</CustomText>
            </Pressable>
        )
    }

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    paddingHorizontal: paddingAnim,
                }
            ]}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={{ flex: 1, gap: verticalScale(15) }}>
                        {renderSection(
                            'addedmember',
                            'Added Members ?',
                            ''
                        )}

                        {renderSection(
                            'addmember',
                            'Member Name ?',
                            ''
                        )}

                        {/* {renderSection(
                        'addmember',
                        'Member Name ?',
                        ''
                    )} */}

                        {renderSection(
                            'services',
                            'Choose Services ?',
                            [
                                { id: 1 },
                                { id: 2 },
                                { id: 3 },
                                { id: 4 },
                                { id: 5 },
                                { id: 6 },
                                { id: 7 },
                                { id: 8 },
                                { id: 9 },
                            ]

                        )}
                        {renderSection(
                            'barber',
                            'Choose Barber ?',
                            [
                                { id: 1 },
                                { id: 2 },
                                { id: 3 },
                                { id: 4 },
                                { id: 5 },
                                { id: 6 },
                                { id: 7 },
                                { id: 8 },
                                { id: 9 },
                            ]
                        )}

                    </View>

                    {!scrolling && (
                        <View style={styles.footer}>
                            <Pressable
                                onPress={() => {
                                    router.replace("/queuelist")
                                }}
                                style={styles.searchButton}>
                                <CustomText style={{ color: '#fff' }}>Back</CustomText>
                            </Pressable>
                            <Pressable
                                disabled={groupJoinMembers?.length === 0}
                                style={[styles.searchButton, {
                                    opacity: groupJoinMembers?.length === 0 ? 0.5 : 1
                                }]}
                                onPress={joinConfirmation}
                            >
                                <CustomText style={{ color: '#fff' }}>Next</CustomText>
                            </Pressable>
                        </View>
                    )}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Animated.View>
    )
}

export default groupJoin

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00B0901A',
        paddingHorizontal: scale(15),
    },
    boxOpenWrapper: {
        // backgroundColor: '#fff',
        borderRadius: scale(20),
        height: verticalScale(300),
        padding: scale(25),

        // iOS shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        padding: scale(25),

        elevation: 3,
    },
    boxCloseWrapper: {
        height: verticalScale(60),
        // backgroundColor: '#fff',
        borderRadius: scale(15),
        paddingHorizontal: scale(25),
        justifyContent: 'center',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: verticalScale(10),
    },
    clearAll: {
        textDecorationLine: 'underline',
    },
    searchButton: {
        height: verticalScale(40),
        borderRadius: scale(4),
        backgroundColor: Colors.modeColor.colorCode,
        paddingHorizontal: scale(25),
        justifyContent: 'center',
        alignItems: 'center',
    },







    serviceItem: {
        width: "100%",
        height: verticalScale(124),
        // borderWidth: scale(0.5),
        // borderColor: "#D2D2D2",
        // borderRadius: scale(8),
        paddingVertical: verticalScale(8),
        // paddingHorizontal: scale(10),
        backgroundColor: "#fff",
        // elevation: 1
    },


    barberItem: {
        width: "100%",
        height: verticalScale(145),
        // borderWidth: scale(0.5),
        // borderColor: "#D2D2D2",
        borderRadius: scale(8),
        paddingVertical: verticalScale(8),
        // paddingHorizontal: scale(10),
        backgroundColor: "#fff",
        // elevation: 1
    },

    navButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: scale(10)
        // marginBottom: 10,
    },
    navButton: {
        backgroundColor: Colors.modeColor.colorCode3,
        borderColor: Colors.modeColor.colorCode,
        borderWidth: scale(1),
        width: scale(30),
        height: scale(30),
        borderRadius: scale(25),
        justifyContent: "center",
        alignItems: "center"
    },

    weekContainer: {
        gap: scale(10)
    },
    dayBox: {
        width: scale(60),
        height: verticalScale(100),
        borderColor: "#DDDDDD",
        borderWidth: scale(0.6),
        borderRadius: scale(4),
        alignItems: 'center',
        justifyContent: 'center',
        gap: verticalScale(5)
    },


    inputField: {
        width: "98%",
        height: verticalScale(40),
        borderRadius: scale(4),
        // borderWidth: scale(1),
        paddingHorizontal: scale(10),
        fontSize: scale(14),
    },

})
