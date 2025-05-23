import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomTabView from '../../components/CustomTabView'
import CustomText from '../../components/CustomText'
import { useAuth } from '../../context/AuthContext'
import { Link, useRouter } from 'expo-router'
import { useClerk, useUser } from '@clerk/clerk-expo'
import { Image } from 'expo-image'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@react-navigation/native'
import CustomSecondaryText from '../../components/CustomSecondaryText'
import CustomView from '../../components/CustomView'
import { AboutIcon, ArrowLeftIcon, HeartIcon, HelpIcon, RightIcon, SalonIcon } from '../../constants/icons'
import { Colors } from '../../constants/Colors'
import { useGlobal } from '../../context/GlobalContext'

const account = () => {

  const { colors } = useTheme()
  const { signOut } = useClerk()
  const { isSignedIn } = useUser()
  const { setSelectedBarber, setSelectedBarberServices, setCustomerName } = useGlobal();

  const { setIsAuthenticated, authenticatedUser, setAuthenticatedUser } = useAuth()
  const router = useRouter()

  const logoutPressed = async () => {
    if (isSignedIn) {
      signOut()
    }
    setSelectedBarber({})
    setSelectedBarberServices([])
    setCustomerName("")
    setIsAuthenticated(false)
    setAuthenticatedUser(null)
    await AsyncStorage.removeItem("LoggedInUser")
    await AsyncStorage.removeItem("isAuthenticated")
    router.replace("/")
  }

  const accountDetails = [
    {
      id: 1,
      title: "My favourites",
      icon: <HeartIcon color={colors.text} />,
      route: "/"
    },
    {
      id: 2,
      title: "Change Salon",
      icon: <SalonIcon color={colors.text} />,
      route: "/(protected)/account/payment"
    },
    {
      id: 3,
      title: "Help & Support",
      icon: <HelpIcon color={colors.text} />,
      route: "/(protected)/account/notifications"
    },
    {
      id: 4,
      title: "About",
      icon: <AboutIcon color={colors.text} />,
      route: "/(protected)/account/settings"
    }
  ]

  return (
    <CustomView>
      <View>
        <Pressable
          onPress={() => router.push("/home")}
          style={{ flexDirection: "row", alignItems: "center", gap: moderateScale(10), marginBottom: verticalScale(10) }}>
          <ArrowLeftIcon color={colors.text} />
          <CustomText style={styles.heading}>
            Your Account
          </CustomText>
        </Pressable>

        <CustomSecondaryText>
          Your details, preferences, and activity in one place
        </CustomSecondaryText>
      </View>

      <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: moderateScale(10) }}>
          <Image
            style={{ height: moderateScale(55), width: moderateScale(55), borderRadius: moderateScale(30) }}
            source={{ uri: authenticatedUser?.imageUrl }}
            // placeholder={{ blurhash }}
            contentFit="cover"
            transition={300}
          />
          <View style={{ gap: moderateScale(5) }}>
            <CustomText style={{ fontFamily: "AirbnbCereal_W_Md" }}>{authenticatedUser?.name}</CustomText>
            <CustomSecondaryText>{authenticatedUser?.email}</CustomSecondaryText>
          </View>
        </View>
        <Link href="#">
          <RightIcon size={moderateScale(20)} color={colors.text} />
        </Link>
      </View>

      <CustomText style={styles.headingtwo}>
        Manage your account
      </CustomText>

      <FlatList
        data={accountDetails}
        renderItem={({ item }) => (
          <View style={[styles.profile_item, { borderColor: colors.border, backgroundColor: colors.card }]}>
            {item.icon}
            <CustomText style={{ fontFamily: "AirbnbCereal_W_Md" }}>{item.title}</CustomText>
          </View>
        )}
        keyExtractor={item => item.id}
        bounces={false}
      />

      <Pressable
        onPress={logoutPressed}
        style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>
        <CustomText style={{ color: "#fff" }}>Logout</CustomText>
      </Pressable>

    </CustomView>
  )
}

export default account

const styles = StyleSheet.create({
  heading: {
    fontFamily: "AirbnbCereal_W_Bd",
    fontSize: moderateScale(22)
  },
  headingtwo: {
    fontFamily: "AirbnbCereal_W_Bd",
    fontSize: moderateScale(18),
    marginBottom: verticalScale(10)
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: moderateScale(10),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(15),
    borderRadius: scale(4),
    marginVertical: verticalScale(20),
    borderWidth: scale(1),
    elevation: 3,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profile_item: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(15),
    borderRadius: scale(4),
    marginVertical: verticalScale(5),
    borderWidth: scale(1),
  },
  btn: {
    height: verticalScale(40),
    borderRadius: scale(4),
    alignItems: "center",
    justifyContent: "center",
    marginBlock: verticalScale(0)
  },
})