import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

    const { authenticatedUser } = useAuth()

    useEffect(() => {
        if (authenticatedUser) {
            setCustomerName(authenticatedUser?.name)
        }
    }, [authenticatedUser])

    const [groupJoinMembers, setGroupJoinMembers] = useState([])
    const [removeGroupMember, setRemoveGroupMember] = useState({
        remove: false,
        data: {}
    })
    const [customerName, setCustomerName] = useState("")
    const [selectedBarber, setSelectedBarber] = useState({})
    const [selectedBarberServices, setSelectedBarberServices] = useState([])
    const [joinQueue, setJoinQueue] = useState({
        singleJoin: false,
        groupJoin: false
    })

    const value = {
        selectedBarber,
        setSelectedBarber,
        selectedBarberServices,
        setSelectedBarberServices,
        joinQueue,
        setJoinQueue,
        customerName,
        setCustomerName,
        groupJoinMembers,
        setGroupJoinMembers,
        removeGroupMember,
        setRemoveGroupMember
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => useContext(GlobalContext);
