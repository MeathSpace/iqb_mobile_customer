import { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

    const [homeDashboardData, setHomeDashboardData] = useState({
        dashboardData: null,
        loading: false,
        error: null,
        success: false
    })

    const [searchCitySalons, setSearchCitySalons] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
    })

    const [selectedTab, setSelectedTab] = useState("All")

    const [selectedSalonLocation, setSelectedSalonLocation] = useState("")

    const { authenticatedUser } = useAuth()

    const hasRun = useRef(false);

    useEffect(() => {
        if (authenticatedUser && !hasRun.current) {
            setCustomerName(authenticatedUser.name);
            setMemberName(authenticatedUser?.name)
            hasRun.current = true;
        }
    }, [authenticatedUser]);

    // useEffect(() => {
    //     setMemberName(authenticatedUser?.name)
    // }, [])

    const [memberName, setMemberName] = useState("")
    const [groupJoinMembers, setGroupJoinMembers] = useState([])
    const [removeGroupMember, setRemoveGroupMember] = useState({
        remove: false,
        data: {}
    })
    const [customerName, setCustomerName] = useState("")
    const [selectedBarber, setSelectedBarber] = useState({})
    const [selectedBarberServices, setSelectedBarberServices] = useState([])
    const [joinModes, setJoinModes] = useState({
        singleJoin: false,
        groupJoin: false,
        appointment: false,
        appointmentType: "Book"
    })
    const [appointmentCalenderData, setAppointmentCalenderData] = useState([])
    const [applyAppointmentFilter, setApplyAppointmentFilter] = useState({
        selectedTab: "All",
        open: true
    })
    const [rememberMe, setRememberMe] = useState(true);
    const [notificationListData, setNotificationListData] = useState(useState({
        notificationData: null,
        loading: false,
        error: null,
        success: false
    }))

    useEffect(() => {
        const saveNotificationToStorage = async () => {
            if (authenticatedUser?.email) {
                try {

                    const value = await AsyncStorage.getItem("newNotification");

                    if (value !== null) {
                        const parsedValue = JSON.parse(value);

                        setNewNotification({
                            email: parsedValue.email,
                            value: parsedValue.email === authenticatedUser?.email ? parsedValue.value : false
                        })
                    }

                } catch (error) {
                    console.log("Error from new Notification Async Storage", error);
                }
            }
        };

        saveNotificationToStorage();
    }, [authenticatedUser]);


    const [newNotification, setNewNotification] = useState({
        email: "",
        value: false
    })

    const [selectedMemberServices, setSelectedMemberServices] = useState([])
    const [selectedMemberBarber, setSelectedMemberBarber] = useState({})

    const value = {
        selectedBarber,
        setSelectedBarber,
        selectedBarberServices,
        setSelectedBarberServices,
        joinModes,
        setJoinModes,
        customerName,
        setCustomerName,
        groupJoinMembers,
        setGroupJoinMembers,
        removeGroupMember,
        setRemoveGroupMember,
        appointmentCalenderData,
        setAppointmentCalenderData,
        homeDashboardData,
        setHomeDashboardData,
        searchCitySalons,
        setSearchCitySalons,
        selectedSalonLocation,
        setSelectedSalonLocation,
        selectedTab,
        setSelectedTab,
        applyAppointmentFilter,
        setApplyAppointmentFilter,
        rememberMe,
        setRememberMe,
        notificationListData,
        setNotificationListData,
        newNotification,
        setNewNotification,
        memberName,
        setMemberName,

        selectedMemberServices,
        setSelectedMemberServices,
        selectedMemberBarber,
        setSelectedMemberBarber
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => useContext(GlobalContext);
