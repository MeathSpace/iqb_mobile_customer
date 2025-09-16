import { Alert, FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomTabView from '../../../../components/CustomTabView'
import CustomText from '../../../../components/CustomText'
import { useAuth } from '../../../../context/AuthContext'
import { Link, useRouter } from 'expo-router'
import { useClerk, useUser } from '@clerk/clerk-expo'
import { Image } from 'expo-image'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@react-navigation/native'
import CustomSecondaryText from '../../../../components/CustomSecondaryText'
import CustomView from '../../../../components/CustomView'
import { AboutIcon, ArrowLeftIcon, HeartIcon, HelpIcon, LogoutIcon, NotificationIcon, PeopleIcon, ProfileIcon, RightIcon, SalonIcon, UserIcon } from '../../../../constants/icons'
import { Colors } from '../../../../constants/Colors'
import { useGlobal } from '../../../../context/GlobalContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from '@expo/vector-icons'
import axios from 'axios'
import { BASE_URL } from '@/utils/api';
import { Toast } from 'toastify-react-native'

const index = () => {


  const { colors } = useTheme()
  const { signOut } = useClerk()
  const { isSignedIn } = useUser()
  const {
    setSelectedBarber,
    setSelectedBarberServices,
    setCustomerName,
    rememberMe,
    setRememberMe,
    newNotification,
    setNewNotification,
    // hasRun
  } = useGlobal();

  const { setIsAuthenticated, authenticatedUser, setAuthenticatedUser } = useAuth()
  const router = useRouter()

  const logoutPressed = async () => {
    if (isSignedIn) {
      await signOut()
    }
    setSelectedBarber({})
    setSelectedBarberServices([])
    setCustomerName("")
    if (rememberMe) {
      await AsyncStorage.setItem("LoggedInUser", JSON.stringify({
        email: authenticatedUser?.email,
        userPassword: authenticatedUser?.userPassword
      }))
    } else {
      await AsyncStorage.removeItem("LoggedInUser")
    }
    await AsyncStorage.removeItem("isAuthenticated")
    setIsAuthenticated(false)
    setAuthenticatedUser(null)
    // router.push("/index")
  }


  const profileOptions = [
    {
      label: 'Favorites',
      icon: 'heart',
      lightBg: '#fee2e2',
      darkBg: '#7f1d1d33',
      lightColor: '#dc2626',
      darkColor: '#fca5a5',
      route: "/myFavourites",
      display: true
    },
    {
      label: 'Change Salon',
      icon: 'store',
      lightBg: '#ede9fe',
      darkBg: '#5b21b633',
      lightColor: '#7c3aed',
      darkColor: '#c4b5fd',
      route: "/connectSalon",
      display: authenticatedUser?.salonId ? true : false
    },
    {
      label: 'Help & Support',
      icon: 'life-buoy',
      lightBg: '#d1fae5',
      darkBg: '#065f4633',
      lightColor: '#059669',
      darkColor: '#6ee7b7',
      route: "/helpSupport",
      display: true
    },
    {
      label: 'About',
      icon: 'info',
      lightBg: '#e0f2fe',
      darkBg: '#1e3a8a33',
      lightColor: '#0284c7',
      darkColor: '#93c5fd',
      route: "/(about)",
      display: true
    },
  ];

  const { user } = useUser()


  const deleteHandler = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: handleDeleteConfirmed }
      ]
    );
  };

  const handleDeleteConfirmed = async () => {
    try {
      // Delete from your backend first
      await axios.post(`${BASE_URL}/customer/deleteCustomer`, {
        email: authenticatedUser?.email,
      });

      if (!user) {
        console.warn("No Clerk user found, skipping delete");
        return;
      }

      await user.delete();
      await signOut();

      setSelectedBarber({});
      setSelectedBarberServices([]);
      setCustomerName("");
      await AsyncStorage.multiRemove(["LoggedInUser", "isAuthenticated"]);
      setIsAuthenticated(false);
      setAuthenticatedUser(null);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
        paddingHorizontal: scale(10),
      }}
    >
      <View style={styles.header}>

        <CustomText style={{ fontSize: scale(18), fontFamily: "AirbnbCereal_W_XBd" }}>Profile</CustomText>

        {/* Right section - Notification bell */}
        <Pressable
          style={styles.bellWrapper}
          activeOpacity={0.7}
          onPress={async () => {

            if (newNotification.value) {
              await AsyncStorage.setItem(
                "newNotification",
                JSON.stringify({
                  email: authenticatedUser?.email,
                  value: false
                })
              );
              setNewNotification({
                email: "",
                value: false
              })
            }

            router.push("/notification")
          }}
        >
          <NotificationIcon size={moderateScale(24)} color={colors.notificationBellColor} />
          {/* {
            newNotification.value && (
              <View style={styles.badge} />
            )
          } */}

        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card */}

        <LinearGradient
          colors={['#14b8a6', '#0d9488']}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Image
            source={{ uri: authenticatedUser?.profile?.[0]?.url }}
            style={styles.avatar}
            onError={() => { }}
          />
          <View>
            <CustomText style={styles.cardTitle}>{authenticatedUser?.name}</CustomText>
            <CustomText style={[styles.cardSubtitle, { width: "80%"}]} numberOfLines={2}>{authenticatedUser?.email}</CustomText>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => router.push("/editProfile")}>
            <Feather name="edit-2" size={moderateScale(16)} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Profile Options */}
        <View style={[styles.optionsBox, { backgroundColor: colors.cardColor, borderColor: colors.queueBorder }]}>
          {profileOptions.map((opt, idx) => {
            if (!opt.display) return null; // Skip if display is false

            return (
              <View key={idx}>
                <TouchableOpacity style={styles.optionRow} onPress={() => router.push(opt.route)}>
                  <View style={[styles.optionIconWrapper, { backgroundColor: opt.lightBg }]}>
                    <Feather name={opt?.icon} size={moderateScale(24)} color={opt.lightColor} />
                  </View>
                  <CustomText style={[styles.optionLabel]}>{opt.label}</CustomText>
                  <RightIcon size={moderateScale(16)} color={colors.text} style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>
                {/* {idx !== profileOptions.length - 1 && (
                  <View style={[styles.separator, { backgroundColor: colors.queueBorder }]} />
                )} */}
                <View style={[styles.separator, { backgroundColor: colors.queueBorder }]} />
              </View>
            );
          })}

          <View>
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => {
                deleteHandler()
              }}
            >
              <View
                style={[
                  styles.optionIconWrapper,
                  { backgroundColor: '#fee2e2' } // light red bg for delete
                ]}
              >
                <Feather name="trash-2" size={moderateScale(24)} color="#ef4444" />
                {/* trash icon + red color */}
              </View>
              <CustomText style={[styles.optionLabel]}>Delete Account</CustomText>
              <RightIcon
                size={moderateScale(16)}
                color={colors.text}
                style={{ marginLeft: 'auto' }}
              />
            </TouchableOpacity>

            {/* <View
              style={[
                styles.separator,
                { backgroundColor: colors.queueBorder }]}
            /> */}
          </View>

        </View>


        {/* Log Out */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: '#fee2e2' }]}
          onPress={logoutPressed}
        >
          <Feather name="log-out" size={moderateScale(16)} color={'#dc2626'} />
          <CustomText style={[styles.logoutText, { color: '#dc2626' }]}>Log Out</CustomText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: verticalScale(40),
    // paddingTop: verticalScale(5),
    // paddingBottom: verticalScale(12),
  },

  bellWrapper: {
    padding: scale(8),
    borderRadius: scale(999),
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: scale(6),
    right: scale(6),
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#2dd4bf', // bg-teal-400
  },

  card: {
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(20),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    marginBottom: verticalScale(24),
    position: 'relative',
  },
  avatar: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    borderWidth: scale(2),
    borderColor: '#fff',
  },
  cardTitle: {
    fontSize: scale(20),
    fontFamily: "AirbnbCereal_W_XBd",
    color: '#fff',
  },
  cardSubtitle: {
    fontSize: scale(14),
    color: '#fff',
    opacity: 0.9,
    marginTop: verticalScale(4),
  },
  editButton: {
    position: 'absolute',
    top: verticalScale(12),
    right: scale(12),
    backgroundColor: '#ffffff33',
    padding: scale(8),
    borderRadius: 999,
  },
  optionsBox: {
    borderRadius: scale(16),
    borderWidth: scale(1),
    marginBottom: verticalScale(24),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
  },
  optionIconWrapper: {
    height: scale(40),
    width: scale(40),
    borderRadius: scale(12),
    justifyContent: "center",
    alignItems: "center"
  },
  optionLabel: {
    marginLeft: scale(12),
    fontFamily: "AirbnbCereal_W_Bd",
    fontSize: scale(16),
  },
  separator: {
    height: verticalScale(1),
    marginHorizontal: scale(16),
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(16),
    borderRadius: scale(12),
    gap: scale(8),
  },
  logoutText: {
    fontWeight: '700',
  },
})

