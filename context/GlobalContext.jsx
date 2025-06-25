import { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

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

    const [selectedSalonLocation, setSelectedSalonLocation] = useState("")

    const { authenticatedUser } = useAuth()

    const hasRun = useRef(false);

    useEffect(() => {
        if (authenticatedUser && !hasRun.current) {
            setCustomerName(authenticatedUser.name);
            hasRun.current = true;
        }
    }, [authenticatedUser]);

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
        setSelectedSalonLocation
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => useContext(GlobalContext);
