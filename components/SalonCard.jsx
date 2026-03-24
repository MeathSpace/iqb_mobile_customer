import { BASE_URL } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { AddIcon } from "../constants/icons";
import { useAuth } from "../context/AuthContext";
import { useGlobal } from "../context/GlobalContext";
import CustomText from "./CustomText";

const SalonCard = ({
  item,
  setSelectedCustomerSalon,
  setSelectedConnectSalonId,
  map = false,
}) => {
  const { colors } = useTheme();
  const { setSearchCitySalon } = useGlobal();

  const [salonCardConnectLoader, setSalonCardConnectLoader] = useState(false);
  const { authenticatedUser, setAuthenticatedUser } = useAuth();

  const connectSalonCardPressed = async (selectSalonId) => {
    try {
      setSalonCardConnectLoader(true);

      const { data } = await axios.post(
        `${BASE_URL}/customer/customerConnectSalon`,
        {
          salonId: selectSalonId,
          email: authenticatedUser?.email,
        },
      );

      const address = `${item?.address}, ${item?.city}, ${item?.country}`;
      await AsyncStorage.setItem("salonLocationAddress", address);

      // console.log(JSON.stringify(data, null, 2));

      setAuthenticatedUser(data?.response);
      await AsyncStorage.setItem(
        "LoggedInUser",
        JSON.stringify(data?.response),
      );
      setSearchCitySalons({
        data: null,
        loading: false,
        error: null,
        success: false,
      });

      setSalonCardConnectLoader(false);
    } catch (error) {
      console.log("Error connecting salon ", error);
      setSalonCardConnectLoader(false);
    }
  };

  return (
    <Pressable
      onPress={() => {
        setSelectedConnectSalonId(item?.salonId);
        setSelectedCustomerSalon({
          open: true,
          data: item,
        });
      }}
    >
      <View
        style={[
          styles.cardWrapper,
          { width: scale(280), backgroundColor: colors.background },
        ]}
      >
        {/* <Image
                    style={styles.cardImage}
                    source={{ uri: item?.gallery?.[0]?.url }}
                    contentFit="cover"
                    transition={300}
                /> */}
        {item?.gallery.length ? (
          <Image
            style={styles.cardImage}
            source={{ uri: item?.gallery?.[0]?.url }}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <Image
            style={styles.cardImage}
            source={require("@/assets/images/dummygallery.jpg")}
            contentFit="cover"
            transition={300}
          />
        )}
        <View style={styles.cardContentWrapper}>
          <Image
            style={{
              height: moderateScale(35),
              width: moderateScale(35),
              borderRadius: moderateScale(20),
            }}
            source={{ uri: item?.salonLogo?.[0]?.url }}
            // placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
          />
          <CustomText
            style={{
              fontSize: moderateScale(14),
              fontFamily: "AirbnbCereal_W_Md",
            }}
          >
            {item.salonName}
          </CustomText>
        </View>

        <TouchableOpacity
          onPress={() => {
            // setSelectedConnectSalonId()
            connectSalonCardPressed(item?.salonId);
          }}
          disabled={!map || salonCardConnectLoader}
          style={[
            styles.connectButton,
            { backgroundColor: colors.accentColor },
          ]}
          activeOpacity={0.85}
        >
          {salonCardConnectLoader ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(2),
              }}
            >
              <CustomText style={styles.connectButtonText}>Connect</CustomText>
              <AddIcon size={scale(16)} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default SalonCard;

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: moderateScale(8),
    elevation: 4,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardImage: {
    height: verticalScale(125),
    width: "100%",
    borderTopLeftRadius: moderateScale(8),
    borderTopRightRadius: moderateScale(8),
  },
  cardContentWrapper: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
  },

  connectButton: {
    // bg-teal-500
    paddingHorizontal: scale(6), // py-4
    paddingVertical: verticalScale(10), // py-4
    borderRadius: scale(8), // rounded-xl
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginHorizontal: "auto",
    marginBottom: verticalScale(10),
  },
  connectButtonText: {
    color: "#fff", // text-white
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(16),
  },
});
