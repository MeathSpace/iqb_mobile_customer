import { BASE_URL } from "@/utils/api";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePreventRemove, useTheme } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Colors } from "../constants/Colors";
import {
  AddIcon,
  ArrowLeftIcon,
  ContactIcon,
  EmailIcon,
  FacebookIcon,
  HeartFilledIcon,
  HeartIcon,
  InstagramIcon,
  MapIcon,
  TiktokIcon,
  WebIcon,
  WhatsappIcon,
  XIcon,
} from "../constants/icons";
import { useAuth } from "../context/AuthContext";
import { useGlobal } from "../context/GlobalContext";
import i18n from "../src/localization/i18n";
import BarberCard from "./BarberCard";
import CustomSecondaryText from "./CustomSecondaryText";
import CustomText from "./CustomText";
import SalonCard from "./SalonCard";
import Skeleton from "./Skeleton";

const Map = () => {
  const colorScheme = useColorScheme();

  const { colors } = useTheme();
  const { searchSalon, setAuthenticatedUser, authenticatedUser } = useAuth();
  const { searchCitySalons, setSearchCitySalons, selectedSalonLocation } =
    useGlobal();

  const [region, setRegion] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLocationAndSalons = async () => {
      try {
        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (isMounted) {
            Alert.alert(
              "Permission Denied",
              "Location access is required to show your position.",
            );
            setSearchCitySalons((prev) => ({
              ...prev,
              loading: false,
              error: "Permission denied",
              success: false,
            }));
          }
          return;
        }

        // Get location
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        if (isMounted) {
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          });
        }

        // Fetch salons by location
        const { data } = await axios.get(
          `${BASE_URL}/mobileRoutes/getSalonsByLocation`,
          {
            params: { latitude, longitude },
            timeout: 10000, // optional timeout for safety
          },
        );

        if (isMounted) {
          setSearchCitySalons((prev) => ({
            ...prev,
            loading: false,
            data: data?.response || [],
            success: true,
            error: null,
          }));
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching location or salons:", error.message);
          setSearchCitySalons((prev) => ({
            ...prev,
            loading: false,
            data: [],
            success: false,
            error: error?.message || "An unexpected error occurred",
          }));
        }
      }
    };

    setSearchCitySalons((prev) => ({
      ...prev,
      loading: true,
      error: null,
      success: false,
    }));
    fetchLocationAndSalons();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedSalonLocation) {
      mapRef.current.animateToRegion(
        {
          latitude: selectedSalonLocation.latitude,
          longitude: selectedSalonLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        3000,
      ); // 1 second animation
    }
  }, [selectedSalonLocation]);

  const darkMapStyle = [
    {
      elementType: "geometry",
      stylers: [{ color: "#1d2c4d" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#ffffff" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1d2c4d" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [{ color: "#1d2c4d" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#283e6b" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#304a7d" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#98a5be" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#0f252e" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#ffffff" }],
    },
  ];

  const [selectedCustomerSalon, setSelectedCustomerSalon] = useState({
    open: false,
    data: {},
  });

  useEffect(() => {
    const fetchServiceCategoryData = async () => {
      try {
        setServiceCategoryData((prev) => ({ ...prev, loading: true }));

        const { data } = await axios.get(
          `${BASE_URL}/mobileRoutes/getAllServiceCategories`,
        );

        setServiceCategoryData((prev) => ({
          ...prev,
          loading: false,
          data: data?.response,
          success: true,
          error: null,
        }));
      } catch (error) {
        setServiceCategoryData((prev) => ({
          ...prev,
          loading: false,
          data: null,
          success: false,
          error: error,
        }));
        console.error("Error fetching service category data: ", error);
      }
    };

    fetchServiceCategoryData();
  }, []);

  const [getAllSalons, setGetAllSalons] = useState({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  useEffect(() => {
    const fetchAllSalons = async () => {
      try {
        setGetAllSalons((prev) => ({ ...prev, loading: true }));

        const { data } = await axios.get(
          `${BASE_URL}/mobileRoutes/getAllSalonsMob`,
        );

        setGetAllSalons((prev) => ({
          ...prev,
          loading: false,
          data: data?.response,
          success: true,
          error: null,
        }));
      } catch (error) {
        setGetAllSalons((prev) => ({
          ...prev,
          loading: false,
          data: null,
          success: false,
          error: error,
        }));
        console.log("Error fetching salons ", error);
      }
    };

    fetchAllSalons();
  }, []);

  const [connectSalonLoader, setConnectSalonLoader] = useState(false);

  const connectSalonPressed = async () => {
    try {
      setConnectSalonLoader(true);

      const { data } = await axios.post(
        `${BASE_URL}/customer/customerConnectSalon`,
        {
          salonId: selectedCustomerSalon?.data?.salonId,
          email: authenticatedUser?.email,
        },
      );

      const address = `${selectedCustomerSalon?.data?.address}, ${selectedCustomerSalon?.data?.city}, ${selectedCustomerSalon?.data?.country}`;
      await AsyncStorage.setItem("salonLocationAddress", address);

      setAuthenticatedUser(data?.response);
      await AsyncStorage.setItem(
        "LoggedInUser",
        JSON.stringify(data?.response),
      );
      setSelectedCustomerSalon({ open: false, data: {} });
      setSearchCitySalons({
        data: null,
        loading: false,
        error: null,
        success: false,
      });

      setConnectSalonLoader(false);
    } catch (error) {
      console.log("Error connecting salon ", error);
      setConnectSalonLoader(false);
    }
  };

  // Salon Info for connect Salon

  const [salonInfoData, setSalonInfoData] = useState({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const [selectecConnectSalonId, setSelectedConnectSalonId] = useState("");

  useFocusEffect(
    useCallback(() => {
      if (selectecConnectSalonId) {
        const fetchSalonInfo = async () => {
          try {
            setSalonInfoData((prev) => ({ ...prev, loading: true }));

            const { data } = await axios.get(
              `${BASE_URL}/mobileRoutes/getSalonInfoBySalonId`,
              {
                params: {
                  salonId: selectecConnectSalonId,
                  customerEmail: authenticatedUser?.email,
                },
              },
            );

            setSalonInfoData((prev) => ({
              ...prev,
              loading: false,
              data: data?.response,
              success: true,
              error: null,
            }));
          } catch (error) {
            setSalonInfoData((prev) => ({
              ...prev,
              loading: false,
              data: null,
              success: false,
              error: error,
            }));
            console.log("Error fetching salon Info ", error);
          }
        };

        fetchSalonInfo();
      }
    }, [authenticatedUser, selectecConnectSalonId]),
  );

  const flatlistRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  // hooks
  const sheetRef = useRef(null);

  const [tabData, setTabData] = useState(["Details", "Services", ""]);

  useFocusEffect(
    useCallback(() => {
      if (salonInfoData?.data?.salonInfo?.salonType === "Barber Shop") {
        setTabData((prev) => {
          const modifiedArr = ["Details", "Services", "Barbers"];
          return modifiedArr;
        });
      } else {
        setTabData((prev) => {
          const modifiedArr = ["Details", "Services", "Stylists"];
          return modifiedArr;
        });
      }
    }, [salonInfoData?.data?.salonInfo?.salonType]),
  );

  const [selectedTab, setSelectedTab] = useState("Details");

  const latitude =
    salonInfoData?.data?.salonInfo?.location?.coordinates?.latitude;
  const longitude =
    salonInfoData?.data?.salonInfo?.location?.coordinates?.longitude;

  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn("Can't open URL:", url);
    }
  };

  const [serviceCategorySelected, setServiceCategorySelected] = useState({
    categoryName: "",
    selected: false,
  });

  const [serviceCategoryData, setServiceCategoryData] = useState({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const [salonServicesCategoryData, setSalonServicesCategoryData] = useState({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  useFocusEffect(
    useCallback(() => {
      const fetchServiceCategoryData = async () => {
        try {
          setServiceCategoryData((prev) => ({ ...prev, loading: true }));

          const { data } = await axios.get(
            `${BASE_URL}/mobileRoutes/getAllServiceCategories`,
          );

          setServiceCategoryData((prev) => ({
            ...prev,
            loading: false,
            data: data?.response,
            success: true,
            error: null,
          }));
        } catch (error) {
          setServiceCategoryData((prev) => ({
            ...prev,
            loading: false,
            data: null,
            success: false,
            error: error,
          }));
          console.error("Error fetching service category data: ", error);
        }
      };

      fetchServiceCategoryData();

      if (
        serviceCategorySelected.selected &&
        serviceCategorySelected.categoryName
      ) {
        const fetchSalonServicesByCategory = async () => {
          try {
            setSalonServicesCategoryData((prev) => ({
              ...prev,
              loading: true,
            }));

            const { data } = await axios.get(
              `${BASE_URL}/mobileRoutes/getSalonServicesByCategory`,
              {
                params: {
                  salonId: selectecConnectSalonId,
                  serviceCategoryName: serviceCategorySelected.categoryName,
                },
              },
            );

            setSalonServicesCategoryData((prev) => ({
              ...prev,
              loading: false,
              data: data?.response,
              success: true,
              error: null,
            }));
          } catch (error) {
            setSalonServicesCategoryData((prev) => ({
              ...prev,
              loading: false,
              data: null,
              success: false,
              error: error,
            }));
            console.error(
              "Error fetching salon services category data: ",
              error,
            );
          }
        };

        fetchSalonServicesByCategory();
      }
    }, [serviceCategorySelected, selectecConnectSalonId]),
  );

  const [favouriteLoader, setFavouriteLoader] = useState(false);

  const addToFavourites = async () => {
    try {
      setFavouriteLoader(true);

      const { data } = await axios.post(
        `${BASE_URL}/customer/customerFavouriteSalon`,
        {
          email: authenticatedUser?.email,
          salonId: selectecConnectSalonId,
        },
      );

      setFavouriteLoader(false);

      setSalonInfoData({
        ...salonInfoData,
        data: {
          ...salonInfoData.data,
          salonInfo: {
            ...salonInfoData.data.salonInfo,
            isFavourite: true,
          },
        },
      });

      Alert.alert("Success", "Successfully added to favourites");
    } catch (error) {
      setFavouriteLoader(false);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Something went wrong",
      );
      console.log("Error in favourite salon ", error?.response?.data);
    }
  };

  // console.log(salonInfoData?.data?.salonInfo?.salonLogo)

  function formatMinutesToHrMin(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
    if (hours > 0) return `${hours}hr`;
    return `${mins}m`;
  }

  const hasUnsavedChanges = true;

  usePreventRemove(hasUnsavedChanges, ({ data }) => {});

  const [selectedMarker, setSelectedMarker] = useState("");
  const [selectedDemo, setSelectedDemo] = useState(null);

  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
          }}
        >
          {getAllSalons?.loading ? (
            <View
              style={{
                flex: 1,
                backgroundColor: colors.background,
              }}
            />
          ) : (
            getAllSalons?.data?.length > 0 && (
              <MapView
                provider={PROVIDER_GOOGLE}
                region={region}
                showsUserLocation={true}
                showsMyLocationButton={true}
                toolbarEnabled={true}
                zoomControlEnabled={true}
                ref={mapRef}
                style={{ flex: 1, paddingBottom: 80, position: "relative" }}
                customMapStyle={colorScheme === "dark" ? darkMapStyle : []}
              >
                {getAllSalons?.data?.length > 0 &&
                  getAllSalons?.data?.map((salon, index) => {
                    if (
                      salon?.location?.coordinates?.latitude &&
                      salon?.location?.coordinates?.longitude
                    ) {
                      return (
                        <Marker
                          key={salon._id}
                          coordinate={{
                            latitude: salon.location.coordinates.latitude,
                            longitude: salon.location.coordinates.longitude,
                          }}
                          onPress={() => {
                            setSelectedDemo(salon);
                          }}
                          tracksViewChanges={tracksViewChanges}
                        >
                          <Image
                            source={require("../assets/images/mapPointer.png")}
                            style={{
                              width: scale(35),
                              height: scale(33),
                              contentFit: "contain",
                            }}
                            onLoad={() => setTracksViewChanges(false)}
                          />
                        </Marker>
                      );
                    }
                    return null;
                  })}
              </MapView>
            )
          )}

          <Modal visible={!!selectedDemo} transparent animationType="slide">
            <View style={styles.overlay2}>
              <View
                style={[
                  styles.popup2,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderWidth: scale(1),
                  },
                ]}
              >
                <CustomText style={styles.title2}>
                  {selectedDemo?.salonName}
                </CustomText>
                <CustomSecondaryText style={styles.address2}>
                  {selectedDemo?.address}
                </CustomSecondaryText>

                <TouchableOpacity
                  style={[
                    styles.button2,
                    {
                      backgroundColor: colors.accentColor,
                    },
                  ]}
                  onPress={async () => {
                    try {
                      setConnectSalonLoader(true);

                      const { data } = await axios.post(
                        `${BASE_URL}/customer/customerConnectSalon`,
                        {
                          salonId: selectedDemo?.salonId,
                          email: authenticatedUser?.email,
                        },
                      );

                      const address = `${selectedDemo?.address}, ${selectedDemo?.city}, ${selectedDemo?.country}`;
                      await AsyncStorage.setItem(
                        "salonLocationAddress",
                        address,
                      );

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

                      setConnectSalonLoader(false);
                    } catch (error) {
                      console.log("Error connecting salon ", error);
                      setConnectSalonLoader(false);
                    }
                  }}
                >
                  {connectSalonLoader ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: scale(2),
                      }}
                    >
                      <CustomText style={styles.buttonText2}>
                        {i18n.t("protected.map.connect")}
                      </CustomText>
                      <AddIcon size={scale(14)} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeButton2}
                  onPress={() => setSelectedDemo(null)}
                >
                  <Text
                    style={[
                      styles.closeButtonText2,
                      {
                        color: colors.accentColor,
                      },
                    ]}
                  >
                    {i18n.t("protected.map.close")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <FlatList
            style={{
              position: "absolute",
              bottom:
                Platform.OS === "ios" ? verticalScale(100) : verticalScale(20),
              left: 0,
              right: 0,
              paddingHorizontal: scale(10),
              overflow: "visible",
            }}
            contentContainerStyle={{
              gap: scale(10),
            }}
            data={searchCitySalons?.data}
            renderItem={({ item }) => (
              <SalonCard
                item={item}
                setSelectedCustomerSalon={setSelectedCustomerSalon}
                setSelectedConnectSalonId={setSelectedConnectSalonId}
                map={true}
                // connectSalonCardPressed={connectSalonCardPressed}
                // connectSalonLoader={connectSalonLoader}
                // selectecConnectSalonId={selectecConnectSalonId}
              />
            )}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          <Modal
            animationType="fade"
            transparent={true}
            visible={selectedCustomerSalon.open}
            onRequestClose={() =>
              setSelectedCustomerSalon({ open: false, data: {} })
            }
          >
            <SafeAreaView
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.background,
              }}
            >
              <GestureHandlerRootView
                style={[
                  styles.container,
                  {
                    backgroundColor: colors.background,
                  },
                ]}
              >
                {salonInfoData?.loading ? (
                  <Skeleton height={verticalScale(200)} width={scale(400)} />
                ) : salonInfoData?.data?.salonInfo?.gallery?.length > 0 ? (
                  <View style={{ position: "relative" }}>
                    <Pressable
                      onPress={() =>
                        setSelectedCustomerSalon({ open: false, data: {} })
                      }
                      style={{
                        position: "absolute",
                        top: verticalScale(10),
                        left: scale(10),
                        zIndex: 10,
                        backgroundColor: colors.background,
                        borderWidth: scale(1),
                        borderColor: colors.queueBorder,
                        height: scale(40),
                        width: scale(40),
                        borderRadius: scale(30),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ArrowLeftIcon color={colors.text} />
                    </Pressable>

                    <Pressable
                      disabled={favouriteLoader}
                      onPress={addToFavourites}
                      style={{
                        width: scale(30),
                        height: scale(30),
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: scale(4),
                        position: "absolute",
                        top: verticalScale(10),
                        right: scale(10),
                        zIndex: 10,
                        backgroundColor: colors.background,
                        borderWidth: scale(1),
                        borderColor: colors.queueBorder,
                        height: scale(40),
                        width: scale(40),
                        borderRadius: scale(30),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {salonInfoData?.data?.salonInfo?.isFavourite ? (
                        <HeartFilledIcon size={scale(20)} color="#E11D48" />
                      ) : (
                        <HeartIcon size={scale(16)} color="#E11D48" />
                      )}
                    </Pressable>

                    <FlatList
                      data={salonInfoData?.data?.salonInfo?.gallery?.slice(
                        0,
                        5,
                      )}
                      style={{
                        position: "relative",
                      }}
                      renderItem={({ item }) => <SalonItem item={item} />}
                      keyExtractor={(item) => item._id}
                      ref={flatlistRef}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      // snapToAlignment="start"
                      decelerationRate="fast"
                      snapToInterval={scale(400)}
                      pagingEnabled={true}
                      onMomentumScrollEnd={(event) => {
                        const offsetX = event.nativeEvent.contentOffset.x;
                        const index = Math.round(offsetX / scale(400));
                        setCurrentIndex(index);
                      }}
                      initialNumToRender={3}
                      maxToRenderPerBatch={3}
                    />
                    <View
                      style={{
                        position: "absolute",
                        bottom:
                          Platform.OS === "ios"
                            ? verticalScale(40)
                            : verticalScale(30),
                        alignSelf: "center",
                        flexDirection: "row",
                        gap: scale(8),
                        alignItems: "center",
                      }}
                    >
                      {salonInfoData?.data?.salonInfo?.gallery
                        ?.slice(0, 5)
                        ?.map((item, index) => {
                          return (
                            <Pressable
                              onPress={() => {
                                setCurrentIndex(index);
                                flatlistRef.current?.scrollToIndex({
                                  animated: true,
                                  index,
                                });
                              }}
                              key={index}
                              style={{
                                width:
                                  index === currentIndex
                                    ? scale(25)
                                    : scale(10),
                                height: scale(10),
                                borderRadius: scale(30),
                                backgroundColor:
                                  index === currentIndex
                                    ? Colors.modeColor.colorCode
                                    : "#fff",
                              }}
                            ></Pressable>
                          );
                        })}
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      width: "100%",
                      height: verticalScale(200),
                      position: "relative",
                    }}
                  >
                    <Image
                      style={{
                        width: scale(350),
                        height: verticalScale(200),
                      }}
                      source={require("@/assets/images/dummygallery.jpg")}
                      contentFit="cover"
                      transition={300}
                    />

                    <Pressable
                      onPress={() =>
                        setSelectedCustomerSalon({ open: false, data: {} })
                      }
                      style={{
                        position: "absolute",
                        top: verticalScale(10),
                        left: scale(10),
                        zIndex: 10,
                        backgroundColor: colors.background,
                        borderWidth: scale(1),
                        borderColor: colors.queueBorder,
                        height: scale(40),
                        width: scale(40),
                        borderRadius: scale(30),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ArrowLeftIcon color={colors.text} />
                    </Pressable>

                    <Pressable
                      disabled={favouriteLoader}
                      onPress={addToFavourites}
                      style={{
                        width: scale(30),
                        height: scale(30),
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: scale(4),
                        position: "absolute",
                        top: verticalScale(10),
                        right: scale(10),
                        zIndex: 10,
                        backgroundColor: colors.background,
                        borderWidth: scale(1),
                        borderColor: colors.queueBorder,
                        height: scale(40),
                        width: scale(40),
                        borderRadius: scale(30),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {salonInfoData?.data?.salonInfo?.isFavourite ? (
                        <HeartFilledIcon size={scale(20)} color="#E11D48" />
                      ) : (
                        <HeartIcon size={scale(16)} color="#E11D48" />
                      )}
                    </Pressable>
                  </View>
                )}

                <BottomSheet
                  ref={sheetRef}
                  index={0}
                  snapPoints={
                    Platform.OS === "ios" ? ["72%", "90%"] : ["73%", "87%"]
                  }
                  enableDynamicSizing={false}
                  backgroundStyle={{
                    backgroundColor: colors.background,
                    borderTopLeftRadius: scale(20),
                    borderTopRightRadius: scale(20),
                  }}
                  handleIndicatorStyle={{
                    backgroundColor: colors.secondaryText,
                  }}
                  // onChange={handleSheetChange}
                >
                  {salonInfoData?.loading ? (
                    <View style={{ flex: 1, padding: scale(10) }}>
                      <Skeleton
                        height={verticalScale(60)}
                        style={{ marginBottom: verticalScale(10) }}
                      />
                      <Skeleton
                        height={verticalScale(60)}
                        style={{ marginBottom: verticalScale(10) }}
                      />
                      <Skeleton
                        height={verticalScale(128)}
                        style={{ marginBottom: verticalScale(10) }}
                      />
                      <Skeleton
                        height={verticalScale(60)}
                        style={{ marginBottom: verticalScale(10) }}
                      />
                    </View>
                  ) : (
                    <>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: scale(10),
                          padding: scale(10),
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: scale(10),
                          }}
                        >
                          <Image
                            style={{
                              height: scale(40),
                              width: scale(40),
                              borderRadius: scale(20),
                              position: "relative",
                            }}
                            source={
                              salonInfoData?.data?.salonInfo?.salonLogo?.[0]
                                ?.url
                            }
                            // placeholder={{ blurhash }}
                            contentFit="cover"
                            transition={1000}
                          />

                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <CustomText
                              style={{
                                fontSize: scale(18),
                                fontFamily: "AirbnbCereal_W_XBd",
                              }}
                            >
                              {salonInfoData?.data?.salonInfo?.salonName}
                            </CustomText>
                            <TouchableOpacity
                              onPress={() => connectSalonPressed()}
                              disabled={connectSalonLoader}
                              style={[
                                styles.signinButton,
                                { backgroundColor: colors.accentColor },
                              ]}
                              activeOpacity={0.85}
                            >
                              {connectSalonLoader ? (
                                <ActivityIndicator size="small" color="#fff" />
                              ) : (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: scale(2),
                                  }}
                                >
                                  <CustomText style={styles.signinButtonText}>
                                    {i18n.t("protected.map.connect")}
                                  </CustomText>
                                  <AddIcon size={scale(14)} color="#fff" />
                                </View>
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: scale(10),
                          padding: scale(5),
                          justifyContent: "space-between",
                          backgroundColor: colors.cardColor,
                          marginHorizontal: scale(10),
                          borderRadius: scale(12),
                        }}
                      >
                        {tabData.map((item, index) => {
                          return (
                            <Pressable
                              key={index}
                              style={[
                                styles.tabBtn,
                                {
                                  backgroundColor:
                                    selectedTab === item
                                      ? colors.accentColor
                                      : colorScheme === "dark"
                                        ? "#3f3f46"
                                        : "#e4e4e7",
                                },
                              ]}
                              onPress={() => {
                                setSelectedTab(item);
                              }}
                            >
                              <CustomText
                                style={{
                                  fontSize: scale(12),
                                  color:
                                    selectedTab === item
                                      ? "#fff"
                                      : colorScheme === "dark"
                                        ? "#fff"
                                        : "#000",
                                }}
                              >
                                {item}
                              </CustomText>
                            </Pressable>
                          );
                        })}
                      </View>

                      <BottomSheetScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[
                          styles.contentContainer,
                          {
                            position: "relative",
                          },
                        ]}
                      >
                        {selectedTab === "Details" && (
                          <>
                            <View
                              style={{
                                backgroundColor: colors.cardColor,
                                borderWidth: scale(1),
                                borderColor: colors.queueBorder,
                                borderRadius: scale(12),
                                padding: scale(10),
                                // gap: verticalScale(5)
                              }}
                            >
                              <CustomText
                                style={{
                                  fontFamily: "AirbnbCereal_W_XBd",
                                }}
                              >
                                {i18n.t("protected.map.description")}
                              </CustomText>

                              <CustomSecondaryText
                                style={
                                  {
                                    // fontSize: scale(14),
                                  }
                                }
                              >
                                {salonInfoData?.data?.salonInfo?.salonDesc}
                              </CustomSecondaryText>
                            </View>

                            <View
                              style={{
                                backgroundColor: colors.cardColor,
                                borderRadius: scale(12),
                                borderWidth: scale(1),
                                borderColor: colors.queueBorder,
                                padding: scale(10),
                                // gap: verticalScale(5),
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <View>
                                <CustomText
                                  style={{
                                    fontFamily: "AirbnbCereal_W_XBd",
                                  }}
                                >
                                  {i18n.t("protected.map.contactUs")}
                                </CustomText>

                                <CustomSecondaryText
                                  style={
                                    {
                                      // fontSize: scale(14),
                                    }
                                  }
                                >
                                  {i18n.t("protected.map.anyQuestion")}
                                </CustomSecondaryText>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: scale(10),
                                }}
                              >
                                {salonInfoData?.data?.salonInfo
                                  ?.mobileCountryCode &&
                                  salonInfoData?.data?.salonInfo
                                    ?.contactTel && (
                                    <Pressable
                                      style={{
                                        width: scale(30),
                                        height: scale(30),
                                        backgroundColor: colors.background,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: scale(4),
                                      }}
                                      onPress={() => {
                                        Linking.openURL(
                                          `tel:${salonInfoData.data.salonInfo.mobileCountryCode}${salonInfoData.data.salonInfo.contactTel}`,
                                        );
                                      }}
                                    >
                                      <ContactIcon
                                        size={scale(18)}
                                        color={"#4285F4"}
                                      />
                                    </Pressable>
                                  )}

                                {salonInfoData?.data?.salonInfo
                                  ?.whatsappNumber && (
                                  <Pressable
                                    style={{
                                      width: scale(30),
                                      height: scale(30),
                                      backgroundColor: colors.background,
                                      justifyContent: "center",
                                      alignItems: "center",
                                      borderRadius: scale(4),
                                    }}
                                    onPress={() =>
                                      openLink(
                                        `https://wa.me/${salonInfoData.data.salonInfo.whatsappNumber}`,
                                      )
                                    }
                                  >
                                    <WhatsappIcon
                                      size={scale(18)}
                                      color={"#25D366"}
                                    />
                                  </Pressable>
                                )}

                                {salonInfoData?.data?.salonInfo?.salonEmail && (
                                  <Pressable
                                    style={{
                                      width: scale(30),
                                      height: scale(30),
                                      backgroundColor: colors.background,
                                      justifyContent: "center",
                                      alignItems: "center",
                                      borderRadius: scale(4),
                                    }}
                                    onPress={() =>
                                      openLink(
                                        `mailto:${salonInfoData.data.salonInfo.salonEmail}`,
                                      )
                                    }
                                  >
                                    <EmailIcon
                                      size={scale(18)}
                                      color={"#EA4335"}
                                    />
                                  </Pressable>
                                )}
                              </View>
                            </View>

                            <View>
                              {salonInfoData?.data?.salonInfo?.location
                                ?.coordinates?.latitude &&
                                salonInfoData?.data?.salonInfo?.location
                                  ?.coordinates?.longitude && (
                                  <MapView
                                    provider={PROVIDER_GOOGLE}
                                    initialCamera={{
                                      center: {
                                        latitude:
                                          salonInfoData?.data?.salonInfo
                                            ?.location?.coordinates?.latitude,
                                        longitude:
                                          salonInfoData?.data?.salonInfo
                                            ?.location?.coordinates?.longitude,
                                      },
                                      zoom: 15, // 0 (world view) to ~20 (very close)
                                      pitch: 0,
                                      heading: 0,
                                    }}
                                    scrollEnabled={false}
                                    zoomEnabled={false}
                                    rotateEnabled={false}
                                    pitchEnabled={false}
                                    style={[
                                      styles.map,
                                      {
                                        // borderColor: "#efefef",
                                        // borderWidth: scale(1)
                                      },
                                    ]}
                                    pointerEvents={
                                      Platform.OS === "ios" ? "none" : "auto"
                                    }
                                    customMapStyle={
                                      colorScheme === "dark" ? darkMapStyle : []
                                    }
                                  />
                                )}

                              <View
                                style={{
                                  backgroundColor: colors.cardColor,
                                  borderBottomLeftRadius: scale(12),
                                  borderBottomRightRadius: scale(12),
                                  borderWidth: scale(1),
                                  borderColor: colors.queueBorder,
                                  padding: scale(10),
                                  // gap: verticalScale(5),
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <View>
                                  <CustomText
                                    style={{
                                      fontFamily: "AirbnbCereal_W_XBd",
                                    }}
                                  >
                                    {i18n.t("protected.map.location")}
                                  </CustomText>

                                  <CustomSecondaryText
                                    style={{
                                      // fontSize: scale(14),
                                      maxWidth: "90%",
                                    }}
                                  >
                                    {`${salonInfoData?.data?.salonInfo?.address}, ${salonInfoData?.data?.salonInfo?.city}, ${salonInfoData?.data?.salonInfo?.country}`}
                                  </CustomSecondaryText>
                                </View>

                                <Pressable
                                  style={{
                                    width: scale(30),
                                    height: scale(30),
                                    backgroundColor: colors.background,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: scale(4),
                                  }}
                                  onPress={() =>
                                    openLink(
                                      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
                                    )
                                  }
                                >
                                  <MapIcon size={scale(18)} color={"#fbbf24"} />
                                </Pressable>
                              </View>
                            </View>

                            {salonInfoData?.data?.salonInfo?.instraLink ||
                            salonInfoData?.data?.salonInfo?.fbLink ||
                            salonInfoData?.data?.salonInfo?.twitterLink ||
                            salonInfoData?.data?.salonInfo?.tiktokLink ||
                            salonInfoData?.data?.salonInfo?.webLink ? (
                              <View
                                style={{
                                  backgroundColor: colors.cardColor,
                                  borderColor: colors.queueBorder,
                                  borderWidth: scale(1),
                                  borderRadius: scale(12),
                                  padding: scale(10),
                                  // gap: verticalScale(5),
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <View>
                                  <CustomText
                                    style={{
                                      fontFamily: "AirbnbCereal_W_XBd",
                                    }}
                                  >
                                    {i18n.t("protected.map.followUs")}
                                  </CustomText>

                                  <CustomSecondaryText
                                    style={
                                      {
                                        // fontSize: scale(14),
                                      }
                                    }
                                  >
                                    {i18n.t("protected.map.socialLinks")}
                                  </CustomSecondaryText>
                                </View>

                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: scale(10),
                                  }}
                                >
                                  {salonInfoData?.data?.salonInfo
                                    ?.instraLink && (
                                    <Pressable
                                      style={{
                                        width: scale(30),
                                        height: scale(30),
                                        backgroundColor: colors.background,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: scale(4),
                                      }}
                                      onPress={() =>
                                        openLink(
                                          salonInfoData.data.salonInfo
                                            .instraLink,
                                        )
                                      }
                                    >
                                      <InstagramIcon
                                        size={scale(18)}
                                        color={"#E1306C"}
                                      />
                                    </Pressable>
                                  )}

                                  {salonInfoData?.data?.salonInfo?.fbLink && (
                                    <Pressable
                                      style={{
                                        width: scale(30),
                                        height: scale(30),
                                        backgroundColor: colors.background,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: scale(4),
                                      }}
                                      onPress={() =>
                                        openLink(
                                          salonInfoData.data.salonInfo.fbLink,
                                        )
                                      }
                                    >
                                      <FacebookIcon
                                        size={scale(18)}
                                        color={"#1877F2"}
                                      />
                                    </Pressable>
                                  )}

                                  {salonInfoData?.data?.salonInfo
                                    ?.twitterLink && (
                                    <Pressable
                                      style={{
                                        width: scale(30),
                                        height: scale(30),
                                        backgroundColor: colors.background,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: scale(4),
                                      }}
                                      onPress={() =>
                                        openLink(
                                          salonInfoData.data.salonInfo
                                            .twitterLink,
                                        )
                                      }
                                    >
                                      <XIcon
                                        size={scale(18)}
                                        color={colors.text}
                                      />
                                    </Pressable>
                                  )}

                                  {salonInfoData?.data?.salonInfo
                                    ?.tiktokLink && (
                                    <Pressable
                                      style={{
                                        width: scale(30),
                                        height: scale(30),
                                        backgroundColor: colors.background,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: scale(4),
                                      }}
                                      onPress={() =>
                                        openLink(
                                          salonInfoData.data.salonInfo
                                            .tiktokLink,
                                        )
                                      }
                                    >
                                      <TiktokIcon
                                        size={scale(18)}
                                        color={colors.text}
                                      />
                                    </Pressable>
                                  )}

                                  {salonInfoData?.data?.salonInfo?.webLink && (
                                    <Pressable
                                      style={{
                                        width: scale(30),
                                        height: scale(30),
                                        backgroundColor: colors.background,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: scale(4),
                                      }}
                                      onPress={() =>
                                        openLink(
                                          salonInfoData.data.salonInfo.webLink,
                                        )
                                      }
                                    >
                                      <WebIcon
                                        size={scale(18)}
                                        color={colors.text}
                                      />
                                    </Pressable>
                                  )}
                                </View>
                              </View>
                            ) : null}
                          </>
                        )}

                        {selectedTab === "Services" &&
                          (salonInfoData?.loading
                            ? [0, 1, 2, 3, 4, 5, 6, 7].map((_, index) => (
                                <Skeleton
                                  key={index}
                                  height={scale(80)}
                                  borderRadius={scale(12)}
                                  style={{
                                    marginBottom: verticalScale(5),
                                  }}
                                />
                              ))
                            : salonInfoData?.data?.categorizedSalonServices?.map(
                                (item, index) => (
                                  <React.Fragment
                                    key={item?.serviceCategoryName || index}
                                  >
                                    <CustomText style={styles.serviceName}>
                                      {item?.serviceCategoryName}
                                    </CustomText>
                                    {item?.services?.map((ser) => (
                                      <View
                                        key={ser.serviceId}
                                        style={[
                                          styles.card,
                                          {
                                            backgroundColor: colors.cardColor,
                                            borderColor: colors.queueBorder,
                                            borderWidth: scale(1),
                                          },
                                        ]}
                                      >
                                        {/* <Image source={{ uri: ser?.serviceIcon?.url }} style={styles.icon} /> */}
                                        <View style={styles.cardContent}>
                                          <CustomText
                                            style={styles.serviceName}
                                          >
                                            {ser.serviceName}
                                          </CustomText>
                                          <CustomSecondaryText
                                            style={[styles.serviceDesc, {}]}
                                          >
                                            {ser.serviceDesc}
                                          </CustomSecondaryText>
                                          <View
                                            style={{
                                              flexDirection: "row",
                                              alignItems: "center",
                                              gap: scale(10),
                                              marginTop: verticalScale(5),
                                            }}
                                          >
                                            <CustomText
                                              style={[
                                                styles.servicePrice,
                                                { color: colors.accentColor },
                                              ]}
                                            >
                                              {
                                                salonInfoData?.data?.salonInfo
                                                  ?.currency
                                              }{" "}
                                              {ser.servicePrice}
                                            </CustomText>
                                            <CustomText
                                              style={[
                                                styles.serviceEWT,
                                                { color: colors.secondaryText },
                                              ]}
                                            >
                                              ~{" "}
                                              {formatMinutesToHrMin(
                                                ser.serviceEWT,
                                              )}
                                            </CustomText>
                                          </View>
                                        </View>
                                      </View>
                                    ))}
                                  </React.Fragment>
                                ),
                              ))}

                        {selectedTab === "Stylists" && (
                          <>
                            <CustomText
                              style={{
                                fontFamily: "AirbnbCereal_W_Blk",
                              }}
                            >
                              {i18n.t("protected.map.exploreAll")} {selectedTab}
                            </CustomText>

                            {salonInfoData?.data?.barbers?.length > 0 ? (
                              <View
                                style={{
                                  flexDirection: "row",
                                  flexWrap: "wrap",
                                  gap: scale(10),
                                }}
                              >
                                {salonInfoData?.data?.barbers?.map(
                                  (item, index) => {
                                    return (
                                      <BarberCard
                                        key={item?.barberId}
                                        item={item}
                                      />
                                    );
                                  },
                                )}
                              </View>
                            ) : (
                              <View
                                style={{
                                  height: verticalScale(180),
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <CustomText>
                                  {/* No {selectedTab} available */}
                                  {i18n.t("protected.map.NoTabAvailable", {
                                    selectedTab: selectedTab,
                                  })}
                                </CustomText>
                              </View>
                            )}
                          </>
                        )}

                        {selectedTab === "Barbers" && (
                          <>
                            <CustomText
                              style={{
                                fontFamily: "AirbnbCereal_W_Blk",
                              }}
                            >
                              {/* Explore all {selectedTab} */}
                              {i18n.t("protected.map.NoTabAvailable", {
                                selectedTab: selectedTab,
                              })}
                            </CustomText>

                            {salonInfoData?.data?.barbers?.length > 0 ? (
                              <View
                                style={{
                                  flexDirection: "row",
                                  flexWrap: "wrap",
                                  gap: scale(10),
                                }}
                              >
                                {salonInfoData?.data?.barbers?.map(
                                  (item, index) => {
                                    return (
                                      <BarberCard
                                        key={item?.barberId}
                                        item={item}
                                      />
                                    );
                                  },
                                )}
                              </View>
                            ) : (
                              <View
                                style={{
                                  height: verticalScale(180),
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <CustomText>
                                  {/* No {selectedTab} available */}
                                  {i18n.t("protected.map.NoTabAvailable", {
                                    selectedTab: selectedTab,
                                  })}
                                </CustomText>
                              </View>
                            )}
                          </>
                        )}

                      </BottomSheetScrollView>
                    </>
                  )}
                </BottomSheet>
              </GestureHandlerRootView>
            </SafeAreaView>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

export default Map;

const SalonItem = ({ item }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.cardWrapper, { backgroundColor: colors.background }]}>
      <Image
        style={styles.cardImage}
        source={{ uri: item.url }}
        contentFit="cover"
        transition={300}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    height: "90%",
    borderRadius: moderateScale(12),
    padding: scale(15),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  modalImage: {
    width: "100%",
    height: verticalScale(140),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(12),
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontFamily: "AirbnbCereal_W_Md",
  },
  modalService: {
    fontSize: moderateScale(14),
    marginBottom: verticalScale(4),
  },
  modalbtn: {
    minHeight: verticalScale(35),
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(15),
    borderRadius: moderateScale(6),
  },
  closebtn: {
    minHeight: verticalScale(35),
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(15),
    borderRadius: moderateScale(6),
    backgroundColor: "#E11D481A",
  },

  container: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: scale(10),
    paddingTop: scale(10),
    // paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(10),
    gap: verticalScale(10),
    // backgroundColor: "#fff",
  },

  cardWrapper: {
    height: verticalScale(200),
    width: scale(400),
  },
  cardImage: {
    height: "100%",
    width: "100%",
  },

  tabBtn: {
    height: verticalScale(30),
    flex: 1,
    paddingInline: scale(10),
    borderRadius: scale(8),
    justifyContent: "center",
    alignItems: "center",
  },

  map: {
    width: "100%",
    height: verticalScale(128),
    borderTopLeftRadius: scale(12),
    borderTopRightRadius: scale(12),
  },

  // signinButton: {
  //     width: '100%',
  //     backgroundColor: 'colors.accentColor', // bg-teal-500
  //     paddingVertical: verticalScale(12), // py-4
  //     borderRadius: scale(8), // rounded-xl
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //     marginBottom: verticalScale(20),
  // },

  //  signinButtonText: {
  //     color: '#fff', // text-white
  //     fontFamily: "AirbnbCereal_W_XBd",
  //     fontSize: scale(16),
  // },

  signinButton: {
    // bg-teal-500
    paddingHorizontal: scale(6), // py-4
    paddingVertical: verticalScale(6), // py-4
    borderRadius: scale(8), // rounded-xl
    alignItems: "center",
    justifyContent: "center",
  },
  signinButtonText: {
    color: "#fff", // text-white
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(12),
  },

  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    marginHorizontal: 16,
  },
  card: {
    flexDirection: "row",
    padding: scale(12),
    // marginHorizontal: 16,
    marginBottom: verticalScale(8),
    borderRadius: scale(12),
  },
  icon: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(8),
    marginRight: scale(12),
    borderWidth: scale(1),
    borderColor: "#efefef", // gray-200
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  serviceName: {
    fontSize: scale(16),
    fontFamily: "AirbnbCereal_W_XBd",
  },
  serviceDesc: {
    // fontSize: scale(14),
  },
  servicePrice: {
    fontSize: scale(14),
    fontFamily: "AirbnbCereal_W_Bd",
  },
  serviceEWT: {
    fontSize: scale(12),
  },

  /** Marker Design */
  marker2: {
    padding: scale(8),
    borderRadius: scale(20),
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  /** Overlay Background */
  overlay2: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },

  /** Popup Card */
  popup2: {
    backgroundColor: "#fff",
    padding: scale(15),
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    elevation: 10, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  /** Title Text */
  title2: {
    fontWeight: "700",
    fontSize: scale(16),
    marginBottom: scale(5),
    textAlign: "center",
  },

  /** Address Text */
  address2: {
    fontSize: scale(13),
    textAlign: "center",
    marginBottom: scale(15),
  },

  /** Connect Button */
  button2: {
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  buttonText2: {
    color: "#fff",
    fontWeight: "600",
    fontSize: scale(14),
  },

  /** Close Button */
  closeButton2: {
    marginTop: scale(12),
    alignItems: "center",
    height: verticalScale(35),
  },

  closeButtonText2: {
    fontWeight: "600",
    fontSize: scale(13),
  },
});






