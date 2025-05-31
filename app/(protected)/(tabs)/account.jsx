import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomTabView from '../../../components/CustomTabView'
import CustomText from '../../../components/CustomText'
import { useAuth } from '../../../context/AuthContext'
import { Link, useRouter } from 'expo-router'
import { useClerk, useUser } from '@clerk/clerk-expo'
import { Image } from 'expo-image'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@react-navigation/native'
import CustomSecondaryText from '../../../components/CustomSecondaryText'
import CustomView from '../../../components/CustomView'
import { AboutIcon, ArrowLeftIcon, HeartIcon, HelpIcon, PeopleIcon, ProfileIcon, RightIcon, SalonIcon, UserIcon } from '../../../constants/icons'
import { Colors } from '../../../constants/Colors'
import { useGlobal } from '../../../context/GlobalContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

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


  const menuOptionPressed = (item) => {
    if (item.title === "Change Salon") {
      Alert.alert(
        "Confirm",
        "Are you sure you want to disconnect?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes, Disconnect",
            onPress: async () => {
              setAuthenticatedUser({ ...authenticatedUser, salonId: "" })
              await AsyncStorage.setItem("LoggedInUser", JSON.stringify({ ...authenticatedUser, salonId: "" }))
            },
            style: "destructive",
          },
        ],
        { cancelable: true }
      );
    } else if (item.title === "My favourites") {
      router.push("/myFavourites")
    }
  };

  return (
    <CustomTabView
      style={{
        justifyContent: "space-between",
        paddingVertical: verticalScale(0),
        paddingTop: verticalScale(10),
        paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(20)
      }}>

      <View>
        <View
          onPress={() => router.push("/editProfile")}
          style={[styles.profileCard, { backgroundColor: Colors.modeColor.colorCode3, marginBottom: verticalScale(10) }]}>
          {/* <View style={{ flexDirection: "row", alignItems: "center", gap: moderateScale(10) }}> */}
          <View style={{ gap: moderateScale(5) }}>
            <CustomText style={{ fontFamily: "AirbnbCereal_W_Bd", fontSize: scale(22) }}>{authenticatedUser?.name}</CustomText>
            <CustomText style={{ fontSize: scale(14), color: "#222222" }}>{authenticatedUser?.email}</CustomText>
          </View>

          <Image
            style={{ height: scale(90), width: scale(90), borderRadius: scale(10) }}
            source={{ uri: authenticatedUser?.imageUrl }}
            // placeholder={{ blurhash }}
            contentFit="cover"
            transition={300}
          />
          {/* </View> */}
          {/* <RightIcon size={moderateScale(20)} color={colors.text} /> */}
        </View>


        <View>
          <Pressable
            onPress={() => router.push("/editProfile")}
            style={styles.profileItem}>
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scale(10)
            }}>
              <ProfileIcon />
              <CustomText style={{ fontFamily: "AirbnbCereal_W_Bk" }}>My Account</CustomText>
            </View>
            <RightIcon size={scale(16)} />
          </Pressable>

          <Pressable
            onPress={() => router.push("/myFavourites")}
            style={styles.profileItem}>
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scale(10)
            }}>
              <HeartIcon />
              <CustomText style={{ fontFamily: "AirbnbCereal_W_Bk" }}>My Favourites</CustomText>
            </View>
            <RightIcon size={scale(16)} />
          </Pressable>
        </View>

        <View
          style={{
            height: verticalScale(1),
            backgroundColor: "#DDDDDD",
            marginVertical: verticalScale(10),
          }}
        />
        <CustomText style={{ fontFamily: "AirbnbCereal_W_Bd", height: verticalScale(35), marginTop: verticalScale(10) }}>Settings</CustomText>

        <Pressable
          style={styles.profileItem}
          onPress={() => {
            Alert.alert(
              "Confirm",
              "Are you sure you want to disconnect?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Yes, Disconnect",
                  onPress: async () => {
                    setAuthenticatedUser({ ...authenticatedUser, salonId: "" })
                    await AsyncStorage.setItem("LoggedInUser", JSON.stringify({ ...authenticatedUser, salonId: "" }))
                  },
                  style: "destructive",
                },
              ],
              { cancelable: true }
            );
          }}
        >
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: scale(10)
          }}>
            <SalonIcon />
            <CustomText style={{ fontFamily: "AirbnbCereal_W_Bk" }}>Change Salon</CustomText>
          </View>
          <RightIcon size={scale(16)} />
        </Pressable>

        <View style={styles.profileItem}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: scale(10)
          }}>
            <AboutIcon />
            <CustomText style={{ fontFamily: "AirbnbCereal_W_Bk" }}>About</CustomText>
          </View>
          <RightIcon size={scale(16)} />
        </View>

        <View style={styles.profileItem}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: scale(10)
          }}>
            <HelpIcon />
            <CustomText style={{ fontFamily: "AirbnbCereal_W_Bk" }}>Help & Support</CustomText>
          </View>
          <RightIcon size={scale(16)} />
        </View>

        <View
          style={{
            height: verticalScale(1),
            backgroundColor: "#DDDDDD",
            marginVertical: verticalScale(10),
          }}
        />

      </View>


      <Pressable
        onPress={logoutPressed}
        style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>
        <CustomText style={{ color: "#fff", fontSize: scale(16) }}>Log out</CustomText>
      </Pressable>
    </CustomTabView>
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
    // paddingVertical: verticalScale(10),
    height: verticalScale(138),
    padding: scale(24),
    borderRadius: scale(4),
    // marginVertical: verticalScale(20),
    // borderWidth: scale(1),
  },
  // profile_item: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   gap: moderateScale(10),
  //   paddingVertical: verticalScale(10),
  //   paddingHorizontal: scale(15),
  //   borderRadius: scale(4),
  //   marginVertical: verticalScale(5),
  //   borderWidth: scale(1),
  // },
  btn: {
    height: verticalScale(40),
    borderRadius: scale(4),
    alignItems: "center",
    justifyContent: "center",
    marginBlock: verticalScale(0)
  },

  profileItem: {
    height: verticalScale(50),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "red"
  }
})