import { View } from 'react-native'
import { useAuth } from '../../../context/AuthContext'
import Map from '../../../components/Map'
import Dashboard from '../../../components/Dashboard'
import SearchHeader from '../../../components/SearchHeader'

const dashboard = () => {

    const { authenticatedUser } = useAuth()
    return (
        <View style={{ flex: 1 }}>
            {
                authenticatedUser?.salonId ? (
                    <Dashboard />
                ) : (
                    <>
                        <SearchHeader />
                        <Map />
                    </>
                )
            }

        </View>
    )
}

export default dashboard


