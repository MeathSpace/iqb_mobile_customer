import { FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import CustomText from '../../../components/CustomText'
import { useTheme } from '@react-navigation/native'
import { AddIcon, CheckIcon, ClockIcon, SearchIcon } from '../../../constants/icons'
import CustomSecondaryText from '../../../components/CustomSecondaryText'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import CustomTabView from '../../../components/CustomTabView'
import { useGlobal } from '../../../context/GlobalContext'
import { Colors } from '../../../constants/Colors'

const groupJoin = () => {

    const pageData = [
        {
            title: "ChooseService",
        },
        {
            title: "ChooseBarber",
        }
    ]

    const { colors } = useTheme()

    const serviceData = [
        {
            id: '1',
            name: 'Hair Cut',
            description: 'The Best Hair Cutting In the Town',
            price: 75,
            duration: '15 mins',
        },
        {
            id: '2',
            name: 'Hair Cut',
            description: 'The Best Hair Cutting In the Town',
            price: 75,
            duration: '15 mins',
        },
        {
            id: '3',
            name: 'Hair Cut',
            description: 'The Best Hair Cutting In the Town',
            price: 75,
            duration: '15 mins',
        },
        {
            id: '4',
            name: 'Hair Cut',
            description: 'The Best Hair Cutting In the Town',
            price: 75,
            duration: '15 mins',
        },
        {
            id: '5',
            name: 'Hair Cut',
            description: 'The Best Hair Cutting In the Town',
            price: 75,
            duration: '15 mins',
        },
        {
            id: '6',
            name: 'Hair Cut',
            description: 'The Best Hair Cutting In the Town',
            price: 75,
            duration: '15 mins',
        },
    ];

    const barberData = [
        {
            name: "Michael",
            image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
            services: [
                { serviceName: "Cutting" },
                { serviceName: "Styling" },
                { serviceName: "Hair color" },
                { serviceName: "Hair Straightening" },
            ],
            queue: 2,
            nextPos: 3,
            est: 15
        },
    ];

    const [addMember, setAddMember] = useState(true)
    const [chooseService, serChooseService] = useState(false)
    const [chooseBarber, setChooseBarber] = useState(false)

    const [addedMember, setAddedMember] = useState(false)

    const router = useRouter()

    const {
        customerName,
        setCustomerName,
        selectedBarber,
        setSelectedBarber,
        selectedBarberServices,
        setSelectedBarberServices,
        joinModes } = useGlobal();

    // console.log("joinModes ", joinModes)

    const [groupJoinMembers, setGroupJoinMembers] = useState([])

    const nextHandler = () => {
        setAddedMember(false)

        if (addMember) {
            serChooseService(true)
            setAddMember(false)
        } else if (chooseService) {
            serChooseService(false)
            setChooseBarber(true)
        } else {
            setChooseBarber(false)
            const memberData = {
                customerName: customerName,
                barberData: selectedBarber,
                servicesData: selectedBarberServices
            }
            setGroupJoinMembers([...groupJoinMembers, memberData])
            setCustomerName("")
            setSelectedBarberServices([])
            setSelectedBarber({})
            setAddMember(true)
        }
    }


    console.log("setGroupJoinMembers ", groupJoinMembers)

    return (
        <View style={{
            flex: 1, paddingHorizontal: scale(10),
            paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(5),
            backgroundColor: "#f7f7f7", gap: verticalScale(15)
        }}>
            {
                addedMember ? (
                    <ScrollView
                        style={styles.addedMemberContainer}
                        contentContainerStyle={{ gap: verticalScale(20), paddingBottom: verticalScale(40) }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: scale(10)
                                }}
                            >
                                <CustomText
                                    style={{
                                        fontSize: scale(18)
                                    }}
                                >Added Members</CustomText>
                                <View
                                    style={{
                                        width: scale(25),
                                        height: scale(25),
                                        borderRadius: scale(50),
                                        backgroundColor: Colors.modeColor.colorCode,
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                ><CustomText
                                    style={{
                                        fontFamily: "AirbnbCereal_W_Bk",
                                        fontSize: scale(12),
                                        color: "#fff"
                                    }}
                                >2</CustomText></View>
                            </View>

                            <Pressable
                                style={{
                                    width: scale(90),
                                    height: verticalScale(40),
                                    borderRadius: scale(8),
                                    backgroundColor: Colors.modeColor.colorCode,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <CustomText
                                    style={{
                                        fontSize: scale(12),
                                        color: "#fff"
                                    }}
                                >Book</CustomText>
                            </Pressable>
                        </View>

                        {
                            groupJoinMembers.map((item, index) => {
                                return (
                                    <View 
                                    key={index}
                                    style={{
                                        paddingVertical: verticalScale(8),
                                        paddingHorizontal: scale(16),
                                        borderRadius: scale(8),
                                        width: "100%",
                                        elevation: 1,
                                        backgroundColor: "#fff",
                                        position: "relative"
                                    }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
                                            <Image
                                                style={{ height: moderateScale(55), width: moderateScale(55), borderRadius: moderateScale(30) }}
                                                source={{ uri: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg" }}
                                                // placeholder={{ blurhash }}
                                                contentFit="cover"
                                                transition={300}
                                            />
                                            <View style={{
                                                gap: verticalScale(8)
                                            }}>
                                                <CustomText style={{
                                                    fontSize: scale(14)
                                                }}>Michael</CustomText>
                                                <CustomText
                                                    style={{
                                                        fontSize: scale(14),
                                                        color: "rgba(0,0,0,0.6)"
                                                    }}
                                                >Arghya Ghosh</CustomText>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                height: verticalScale(0.5),
                                                backgroundColor: "#D2D2D2",
                                                marginVertical: verticalScale(10)
                                            }}
                                        />

                                        <View style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between"
                                        }}>
                                            <View>
                                                <CustomSecondaryText
                                                    style={{
                                                        fontSize: scale(11)
                                                    }}
                                                >. Hair cut</CustomSecondaryText>

                                                <CustomSecondaryText
                                                    style={{
                                                        fontSize: scale(11)
                                                    }}
                                                >. Hair wash</CustomSecondaryText>

                                                <CustomSecondaryText
                                                    style={{
                                                        fontSize: scale(11)
                                                    }}
                                                >. Beard</CustomSecondaryText>

                                            </View>

                                            <View style={{ gap: scale(6) }}>
                                                <CustomText style={{ textAlign: "center", fontSize: moderateScale(20) }}>$ 30.00</CustomText>
                                                <View style={{ flexDirection: "row", alignItems: "center", gap: scale(5), }}>
                                                    <ClockIcon size={moderateScale(16)} color={colors.secondaryText} />
                                                    <CustomSecondaryText style={{ fontSize: scale(12) }}>65 mins</CustomSecondaryText>

                                                </View>
                                            </View>
                                        </View>

                                        <Pressable
                                            style={{
                                                position: "absolute",
                                                right: scale(10),
                                                top: verticalScale(10),
                                                backgroundColor: Colors.modeColor.colorCode,
                                                borderRadius: scale(4),
                                                height: verticalScale(24),
                                                width: scale(56),
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}
                                        ><CustomText style={{ color: "#fff", fontSize: scale(12) }}>Remove</CustomText></Pressable>
                                    </View>
                                )
                            })
                        }



                        {/* <View style={{
                            paddingVertical: verticalScale(8),
                            paddingHorizontal: scale(16),
                            borderRadius: scale(8),
                            width: "100%",
                            elevation: 1,
                            backgroundColor: "#fff",
                            position: "relative"
                        }}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
                                <Image
                                    style={{ height: moderateScale(55), width: moderateScale(55), borderRadius: moderateScale(30) }}
                                    source={{ uri: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg" }}
                                    // placeholder={{ blurhash }}
                                    contentFit="cover"
                                    transition={300}
                                />
                                <View style={{
                                    gap: verticalScale(8)
                                }}>
                                    <CustomText style={{
                                        fontSize: scale(14)
                                    }}>Michael</CustomText>
                                    <CustomText
                                        style={{
                                            fontSize: scale(14),
                                            color: "rgba(0,0,0,0.6)"
                                        }}
                                    >Arghya Ghosh</CustomText>
                                </View>
                            </View>

                            <View
                                style={{
                                    height: verticalScale(0.5),
                                    backgroundColor: "#D2D2D2",
                                    marginVertical: verticalScale(10)
                                }}
                            />

                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}>
                                <View>
                                    <CustomSecondaryText
                                        style={{
                                            fontSize: scale(11)
                                        }}
                                    >. Hair cut</CustomSecondaryText>

                                    <CustomSecondaryText
                                        style={{
                                            fontSize: scale(11)
                                        }}
                                    >. Hair wash</CustomSecondaryText>

                                    <CustomSecondaryText
                                        style={{
                                            fontSize: scale(11)
                                        }}
                                    >. Beard</CustomSecondaryText>

                                </View>

                                <View style={{ gap: scale(6) }}>
                                    <CustomText style={{ textAlign: "center", fontSize: moderateScale(20) }}>$ 30.00</CustomText>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: scale(5), }}>
                                        <ClockIcon size={moderateScale(16)} color={colors.secondaryText} />
                                        <CustomSecondaryText style={{ fontSize: scale(12) }}>65 mins</CustomSecondaryText>

                                    </View>
                                </View>
                            </View>

                            <Pressable
                                style={{
                                    position: "absolute",
                                    right: scale(10),
                                    top: verticalScale(10),
                                    backgroundColor: Colors.modeColor.colorCode,
                                    borderRadius: scale(4),
                                    height: verticalScale(24),
                                    width: scale(56),
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            ><CustomText style={{ color: "#fff", fontSize: scale(12) }}>Remove</CustomText></Pressable>
                        </View> */}

                    </ScrollView>
                ) : (
                    (
                        <Pressable
                            onPress={
                                () => {
                                    serChooseService(false)
                                    setChooseBarber(false)
                                    setAddMember(false)
                                    setAddedMember(true)
                                }
                            }
                            style={{
                                height: verticalScale(60),
                                backgroundColor: "#fff",
                                elevation: 2,
                                padding: scale(16),
                                marginTop: verticalScale(5),
                                borderRadius: scale(8),
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: scale(10)
                                }}
                            >
                                <CustomText>Added Members</CustomText>
                                <View
                                    style={{
                                        width: scale(25),
                                        height: scale(25),
                                        borderRadius: scale(50),
                                        backgroundColor: Colors.modeColor.colorCode,
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                ><CustomText
                                    style={{
                                        fontFamily: "AirbnbCereal_W_Bk",
                                        fontSize: scale(12),
                                        color: "#fff"
                                    }}
                                >2</CustomText></View>
                            </View>

                            <Pressable
                                style={{
                                    width: scale(90),
                                    height: verticalScale(40),
                                    borderRadius: scale(8),
                                    backgroundColor: "#D7D7D7",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <CustomText
                                    style={{
                                        fontSize: scale(12),
                                        color: "#999898"
                                    }}
                                >Book</CustomText>
                            </Pressable>
                        </Pressable>
                    )
                )
            }
            {
                addMember ? (
                    <ScrollView
                        style={styles.memberContainer}
                        contentContainerStyle={{ gap: verticalScale(20), paddingBottom: verticalScale(0) }}
                        showsVerticalScrollIndicator={false}
                    >
                        <CustomText
                            style={{
                                fontSize: scale(22.5),
                            }}
                        >Member Name ?</CustomText>

                        <TextInput
                            editable
                            placeholder="Enter member name"
                            placeholderTextColor={colors.secondaryText}
                            style={[false ? styles.inputFielderror : styles.inputField, { borderColor: Colors.modeColor.colorCode, backgroundColor: Colors.modeColor.colorCode3, fontFamily: "AirbnbCereal_W_Bk", }]}
                            value={customerName}
                            onChangeText={text => setCustomerName(text)}
                        />
                    </ScrollView>
                ) : (
                    (
                        <Pressable
                            // onPress={() => {
                            //     serChooseService(false)
                            //     setChooseBarber(false)
                            //     setAddMember(true)
                            //     setAddedMember(false)
                            // }}
                            style={{
                                height: verticalScale(60),
                                backgroundColor: "#fff",
                                elevation: 2,
                                padding: scale(16),
                                marginTop: verticalScale(5),
                                borderRadius: scale(8),
                                flexDirection: "row",
                                alignItems: "center"
                            }}
                        ><CustomText>Add Member</CustomText></Pressable>
                    )
                )
            }
            {
                chooseService ? (
                    <ScrollView
                        style={styles.serviceContainer}
                        contentContainerStyle={{ gap: verticalScale(20), paddingBottom: verticalScale(40) }}
                        showsVerticalScrollIndicator={false}
                    >
                        <CustomText
                            style={{
                                fontSize: scale(22.5),
                            }}
                        >Choose Services?</CustomText>
                        <View style={styles.inputWrapper}>
                            <SearchIcon
                                size={scale(18)}
                                color={"rgba(0, 0, 0, 0.5)"}
                                style={styles.icon}
                            />
                            <TextInput
                                editable
                                placeholder="Search Your Services"
                                placeholderTextColor={colors.secondaryText}
                                style={[
                                    styles.inputField,
                                    {
                                        borderColor: Colors.modeColor.colorCode,
                                        backgroundColor: Colors.modeColor.colorCode3,
                                        fontFamily: "AirbnbCereal_W_Bk",
                                        color: colors.text,
                                        paddingLeft: scale(45), // leave space for icon
                                    }
                                ]}
                                value=""
                            />
                        </View>

                        {
                            serviceData.map((item, index) => {
                                return <ServiceItem key={index} item={item} index={index} setSelectedBarberServices={setSelectedBarberServices} selectedBarberServices={selectedBarberServices} />
                            })
                        }
                    </ScrollView>
                ) : (
                    <Pressable
                        // onPress={() => {
                        //     serChooseService(true)
                        //     setChooseBarber(false)
                        //     setAddMember(false)
                        //     setAddedMember(false)
                        // }}
                        style={{
                            height: verticalScale(60),
                            backgroundColor: "#fff",
                            elevation: 2,
                            padding: scale(16),
                            marginTop: verticalScale(5),
                            borderRadius: scale(8),
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    ><CustomText>Services</CustomText></Pressable>
                )
            }
            {
                chooseBarber ? (
                    <ScrollView
                        style={styles.barberContainer}
                        contentContainerStyle={{ gap: verticalScale(20), paddingBottom: verticalScale(40) }}
                        showsVerticalScrollIndicator={false}
                    >
                        <CustomText
                            style={{
                                fontSize: scale(22.5),
                            }}
                        >Choose Barber?</CustomText>
                        <View style={styles.inputWrapper}>
                            <SearchIcon
                                size={scale(18)}
                                color={"rgba(0, 0, 0, 0.5)"}
                                style={styles.icon}
                            />
                            <TextInput
                                editable
                                placeholder="Search Your Barber"
                                placeholderTextColor={colors.secondaryText}
                                style={[
                                    styles.inputField,
                                    {
                                        borderColor: Colors.modeColor.colorCode,
                                        backgroundColor: Colors.modeColor.colorCode3,
                                        fontFamily: "AirbnbCereal_W_Bk",
                                        color: colors.text,
                                        paddingLeft: scale(45), // leave space for icon
                                    }
                                ]}
                                value=""
                            />


                        </View>

                        {
                            [0, 1, 2, 3, 4, 5, 6].map((item, index) => {
                                return <BarberItem item={item} index={index} selectedBarber={selectedBarber} setSelectedBarber={setSelectedBarber} />
                            })
                        }
                    </ScrollView>
                ) : (
                    <Pressable
                        // onPress={() => {
                        //     serChooseService(false)
                        //     setChooseBarber(true)
                        //     setAddMember(false)
                        //     setAddedMember(false)
                        // }}
                        style={{
                            height: verticalScale(60),
                            backgroundColor: "#fff",
                            elevation: 2,
                            padding: scale(16),
                            marginTop: verticalScale(5),
                            borderRadius: scale(8),
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    ><CustomText>Barber</CustomText></Pressable>
                )
            }

            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: verticalScale(10)
            }}>
                {/* <CustomText>Clear All</CustomText> */}

                <Pressable
                    // onPress={() => {
                    //     if (joinModes.appointmentType === "Book" && joinModes.appointment) {
                    //         router.push("/appointmentCalender")
                    //     } else {
                    //         router.push("/joinConfirmation")
                    //     }
                    // }}
                    onPress={() => {
                        setCustomerName(false)
                        setChooseBarber(false)
                        serChooseService(false)
                    }}
                    style={{
                        height: verticalScale(40),
                        width: scale(95),
                        borderRadius: scale(8),
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Colors.modeColor.colorCode
                    }}>
                    <CustomText style={{ color: "#fff", fontSize: scale(12) }}>Back</CustomText>
                </Pressable>

                <Pressable
                    // onPress={() => {
                    //     if (joinModes.appointmentType === "Book" && joinModes.appointment) {
                    //         router.push("/appointmentCalender")
                    //     } else {
                    //         router.push("/joinConfirmation")
                    //     }
                    // }}
                    onPress={nextHandler}
                    style={{
                        height: verticalScale(40),
                        width: scale(95),
                        borderRadius: scale(8),
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Colors.modeColor.colorCode
                    }}>
                    <CustomText style={{ color: "#fff", fontSize: scale(12) }}>Next</CustomText>
                </Pressable>
            </View>
        </View >
    )
}

export default groupJoin

const styles = StyleSheet.create({
    container: {
        flex: 1, // Ensures the SafeAreaView takes full screen height
    },
    serviceContainer: {
        width: "100%",
        height: verticalScale(550),
        backgroundColor: "#fff",
        borderRadius: scale(16),
        padding: scale(16),
        elevation: 1,
    },
    barberContainer: {
        width: "100%",
        height: verticalScale(550),
        backgroundColor: "#fff",
        borderRadius: scale(16),
        padding: scale(16),
        elevation: 1
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    icon: {
        position: 'absolute',
        left: scale(10),
        zIndex: 1,
    },
    inputField: {
        height: verticalScale(40),
        borderRadius: scale(8),
        borderWidth: scale(1),
        paddingHorizontal: scale(10),
        fontSize: scale(14),
    },
    serviceItem: {
        width: "100%",
        height: verticalScale(124),
        borderWidth: scale(0.5),
        borderColor: "#D2D2D2",
        borderRadius: scale(8),
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(10),
        backgroundColor: "#fff",
        elevation: 1
    },

    barberItem: {
        width: "100%",
        height: verticalScale(145),
        borderWidth: scale(0.5),
        borderColor: "#D2D2D2",
        borderRadius: scale(8),
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(10),
        backgroundColor: "#fff",
        elevation: 1
    },

    memberContainer: {
        width: "100%",
        maxHeight: verticalScale(148),
        backgroundColor: "#fff",
        borderRadius: scale(16),
        padding: scale(16),
        elevation: 1,
        marginTop: verticalScale(5),
    },

    addedMemberContainer: {
        width: "100%",
        height: verticalScale(550),
        backgroundColor: "#fff",
        borderRadius: scale(16),
        padding: scale(16),
        elevation: 1,
        marginTop: verticalScale(5),
    }
})

const ServiceItem = ({ item, index, setSelectedBarberServices, selectedBarberServices }) => (
    <Pressable
        key={index}
        style={[styles.serviceItem, {
            borderColor: selectedBarberServices.some(service => service.index === index) ? Colors.modeColor.colorCode : "#D2D2D2",
            borderWidth: scale(1)
        }]}
    >
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <CustomText style={{ fontSize: scale(13) }}>{item.name}</CustomText>

            {
                selectedBarberServices.some(service => service.index === index) ? (
                    <Pressable
                        style={{
                            height: scale(32),
                            width: scale(32),
                            borderRadius: scale(30),
                            backgroundColor: Colors.modeColor.colorCode,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            setSelectedBarberServices(
                                selectedBarberServices.filter(service => service.index !== index)
                            );
                        }}
                    >
                        <CheckIcon color="#fff" size={scale(16)} />
                    </Pressable>
                ) : (
                    <Pressable
                        style={{
                            height: scale(32),
                            width: scale(32),
                            borderRadius: scale(30),
                            backgroundColor: Colors.modeColor.colorCode,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            setSelectedBarberServices([...selectedBarberServices, { ...item, index }]);
                        }}
                    >
                        <AddIcon color="#fff" />
                    </Pressable>
                )
            }


        </View >
        <View
            style={{
                height: scale(0.5),
                marginVertical: verticalScale(10),
                backgroundColor: '#D2D2D2',
            }}
        />
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <CustomText
                style={{
                    fontFamily: 'AirbnbCereal_W_Bk',
                    color: '#808080',
                    fontSize: scale(12),
                }}
            >
                {item.description}
            </CustomText>

            <View style={{ gap: scale(6) }}>
                <CustomText style={{ textAlign: 'center', fontSize: moderateScale(17) }}>
                    € {item.price}
                </CustomText>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(5) }}>
                    <ClockIcon size={scale(12)} color={'#808080'} />
                    <CustomSecondaryText
                        style={{
                            fontFamily: 'AirbnbCereal_W_Bk',
                            color: '#808080',
                            fontSize: scale(12),
                        }}
                    >
                        {item.duration}
                    </CustomSecondaryText>
                </View>
            </View>
        </View>
    </Pressable >
);


const BarberItem = ({ item, index, selectedBarber, setSelectedBarber }) => (
    <Pressable
        key={index}
        onPress={() => setSelectedBarber({ ...item, index })}
        style={[styles.barberItem, {
            borderColor: selectedBarber.index === index ? Colors.modeColor.colorCode : "#D2D2D2",
            borderWidth: scale(1)
        }]}
    >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flex: 1, flexDirection: "row", gap: 10 }}>
                <Image
                    style={{ height: scale(60), width: scale(60), borderRadius: scale(40) }}
                    source={{ uri: "https://media.istockphoto.com/id/1365608023/photo/shot-of-a-handsome-young-barber-standing-alone-in-his-salon.jpg?s=612x612&w=0&k=20&c=0l2Q3UVgXNnf3lbUvMM7hT18-AAnOloeoNMOHntomcw=" }}
                    contentFit="cover"
                    transition={300}
                />
                <View style={{ gap: verticalScale(5), flex: 1 }}>
                    <CustomText style={{ fontSize: scale(15) }}>Michael</CustomText>
                    <CustomSecondaryText
                        style={{
                            fontSize: scale(11),
                            fontFamily: "AirbnbCereal_W_Bk",
                            flexWrap: "wrap",
                            color: "#808080"
                        }}>
                        Cutting, Styling, Haircut, Hair Straightening
                    </CustomSecondaryText>
                </View>
            </View>

            <View style={{ gap: verticalScale(5) }}>
                <CustomSecondaryText style={{
                    textAlign: "center",
                    fontSize: scale(12),
                    fontFamily: "AirbnbCereal_W_Bk",
                    color: "#808080"
                }}>Queueing</CustomSecondaryText>
                <CustomText style={{
                    textAlign: "center",
                    fontSize: scale(22)
                }}>2</CustomText>
            </View>
        </View>

        <View
            style={{
                height: scale(0.5),
                marginVertical: verticalScale(10),
                backgroundColor: '#D2D2D2',
            }}
        />

        <View style={{
            flexDirection: "row",
            justifyContent: "space-around"
        }}>
            <View style={{ gap: verticalScale(5) }}>
                <CustomSecondaryText
                    style={{
                        fontSize: scale(11),
                        color: "#808080",
                        fontFamily: "AirbnbCereal_W_Bk",
                    }}
                >Next available position</CustomSecondaryText>
                <CustomText style={{
                    textAlign: "center",
                    fontSize: scale(13),
                }}>3</CustomText>
            </View>

            <View style={{ gap: verticalScale(5) }}>
                <CustomSecondaryText style={{
                    fontSize: scale(11),
                    color: "#808080",
                    fontFamily: "AirbnbCereal_W_Bk",
                }}>Estimated Time</CustomSecondaryText>
                <CustomText style={{
                    textAlign: "center",
                    fontSize: scale(13),
                }}>15 mins</CustomText>
            </View>
        </View>
    </Pressable>
)