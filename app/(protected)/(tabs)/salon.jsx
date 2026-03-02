import { BASE_URL } from "@/utils/api";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  FlatList,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Toast } from "toastify-react-native";
import BarberCard from "../../../components/BarberCard";
import CustomSecondaryText from "../../../components/CustomSecondaryText";
import CustomTabView from "../../../components/CustomTabView";
import CustomText from "../../../components/CustomText";
import Skeleton from "../../../components/Skeleton";
import { Colors } from "../../../constants/Colors";
import {
  ContactIcon,
  EmailIcon,
  FacebookIcon,
  InstagramIcon,
  MapIcon,
  TiktokIcon,
  WebIcon,
  WhatsappIcon,
  XIcon,
} from "../../../constants/icons";
import { useAuth } from "../../../context/AuthContext";

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

const salon = () => {
  const { authenticatedUser } = useAuth();

  const [salonInfoData, setSalonInfoData] = useState({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  useFocusEffect(
    useCallback(() => {
      const fetchSalonInfo = async () => {
        try {
          setSalonInfoData((prev) => ({ ...prev, loading: true }));

          const { data } = await axios.get(
            `${BASE_URL}/mobileRoutes/getSalonInfoBySalonId`,
            {
              params: {
                salonId: authenticatedUser?.salonId,
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
    }, [authenticatedUser]),
  );

  // console.log("salonInfoData ", salonInfoData?.data?.salonInfo?.gallery)

  const flatlistRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  // hooks
  const sheetRef = useRef(null);

  // variables
  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    [],
  );

  // render
  const renderItem = useCallback(
    (item) => (
      <View key={item} style={styles.itemContainer}>
        <Text>{item}</Text>
      </View>
    ),
    [],
  );

  const [tabData, setTabData] = useState(["Details", "Services", ""]);

  useFocusEffect(
    useCallback(() => {
      if (authenticatedUser?.salonType === "Barber Shop") {
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
    }, [authenticatedUser?.salonType]),
  );

  // console.log(authenticatedUser?.salonType)

  const [selectedTab, setSelectedTab] = useState("Details");

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

  const [serviceCategorySelected, setServiceCategorySelected] = useState({
    categoryName: "",
    selected: false,
  });

  const { colors } = useTheme();
  const colorScheme = useColorScheme();

  // console.log(salonInfoData?.data?.salonInfo?.location?.coordinates?.latitude)

  const latitude =
    salonInfoData?.data?.salonInfo?.location?.coordinates?.latitude;
  const longitude =
    salonInfoData?.data?.salonInfo?.location?.coordinates?.longitude;

  // const openLink = async (url) => {

  //     const supported = await Linking.canOpenURL(url);
  //     if (supported) {
  //         await Linking.openURL(url);
  //     } else {
  //         console.warn("Can't open URL:", url);
  //     }
  // };

  const openLink = async (url) => {
    if (url) {
      await Linking.openURL(url);
    } else {
      console.warn("Invalid URL || Cannot Open it");
    }
  };

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
                  salonId: authenticatedUser?.salonId,
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
    }, [authenticatedUser, serviceCategorySelected]),
  );

  const [selectCustomerServices, setSelectedCustomerServices] = useState([]);
  const [selectedCustomerBarber, setSelectedCustomerBarber] = useState(null);

  const addServiceHandler = (service) => {
    const updatedSalonServices = salonServicesCategoryData?.data?.map(
      (item) => {
        return item?.serviceId === service?.serviceId
          ? { ...service, selected: true }
          : item;
      },
    );

    setSalonServicesCategoryData({
      data: updatedSalonServices,
      loading: false,
      error: null,
      success: false,
    });

    setSelectedCustomerServices([...selectCustomerServices, service]);
  };

  const removeServiceHandler = (service) => {
    const updatedSalonServices = salonServicesCategoryData?.data?.map(
      (item) => {
        return item?.serviceId === service?.serviceId
          ? { ...service, selected: false }
          : item;
      },
    );

    setSalonServicesCategoryData({
      data: updatedSalonServices,
      loading: false,
      error: null,
      success: false,
    });

    setSelectedCustomerServices((prev) => {
      const filteredArray = prev.filter((item) => {
        return item?.serviceId !== service?.serviceId;
      });

      return filteredArray;
    });
  };

  const [favouriteLoader, setFavouriteLoader] = useState(false);

  const addToFavourites = async () => {
    try {
      setFavouriteLoader(true);

      const { data } = await axios.post(
        `${BASE_URL}/customer/customerFavouriteSalon`,
        {
          email: authenticatedUser?.email,
          salonId: authenticatedUser?.salonId,
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

      Toast.success("Successfully added to favourites");
    } catch (error) {
      setFavouriteLoader(false);
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || "Something went wrong",
      });
      console.log("Error in favourite salon ", error);
    }
  };

  const handleCall = async () => {
    const phoneNumber = "+919876543210"; // Include country code if needed
    const url = `tel:${phoneNumber}`;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Can't open dialer");
    }
  };

  function formatMinutesToHrMin(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
    if (hours > 0) return `${hours}hr`;
    return `${mins}m`;
  }

  // console.log("categorizedSalonServices ", JSON.stringify(salonInfoData?.data?.categorizedSalonServices, null, 2));

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [selectedTab]);

  return (
    <CustomTabView
      style={{
        paddingHorizontal: scale(0),
        paddingTop: verticalScale(0),
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
          <View>
            <FlatList
              data={salonInfoData?.data?.salonInfo?.gallery?.slice(0, 5)}
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
                  Platform.OS === "ios" ? verticalScale(40) : verticalScale(30),
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
                        width: index === currentIndex ? scale(25) : scale(10),
                        height: scale(10),
                        borderRadius: scale(30),
                        backgroundColor:
                          index === currentIndex
                            ? colors.accentColor
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
            }}
          >
            <Image
              style={{
                width: "100%",
                height: "100%",
              }}
              source={require("@/assets/images/dummygallery.jpg")}
              contentFit="cover"
              transition={300}
            />
          </View>
        )}

        <BottomSheet
          ref={sheetRef}
          index={0}
          snapPoints={Platform.OS === "ios" ? ["72%", "90%"] : ["66%", "87%"]}
          enableDynamicSizing={false}
          backgroundStyle={{
            backgroundColor: colors.background,
            borderTopLeftRadius: scale(20),
            borderTopRightRadius: scale(20),
          }}
          handleIndicatorStyle={{
            backgroundColor: colors.secondaryText,
          }}
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
                }}
              >
                <Image
                  style={{
                    height: scale(40),
                    width: scale(40),
                    borderRadius: scale(20),
                    position: "relative",
                  }}
                  source={salonInfoData?.data?.salonInfo?.salonLogo?.[0]?.url}
                  // placeholder={{ blurhash }}
                  contentFit="cover"
                  transition={1000}
                />

                <CustomText
                  style={{
                    fontSize: scale(18),
                    fontFamily: "AirbnbCereal_W_XBd",
                  }}
                >
                  {salonInfoData?.data?.salonInfo?.salonName}
                </CustomText>
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
                contentContainerStyle={styles.contentContainer}
                ref={scrollRef}
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
                        Description
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
                        gap: verticalScale(5),
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
                          Contact Us
                        </CustomText>

                        <CustomSecondaryText
                          style={
                            {
                              // fontSize: scale(14),
                            }
                          }
                        >
                          If you have any questions
                        </CustomSecondaryText>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: scale(10),
                        }}
                      >
                        {salonInfoData?.data?.salonInfo?.mobileCountryCode &&
                          salonInfoData?.data?.salonInfo?.contactTel && (
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
                                  `tel:${salonInfoData?.data?.salonInfo?.mobileCountryCode}${salonInfoData?.data?.salonInfo?.contactTel}`,
                                );
                              }}
                            >
                              <ContactIcon size={scale(18)} color={"#4285F4"} />
                            </Pressable>
                          )}

                        {salonInfoData?.data?.salonInfo?.whatsappNumber && (
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
                              openLink(
                                `https://wa.me/${salonInfoData?.data?.salonInfo?.whatsappNumber}`,
                              );
                            }}
                          >
                            <WhatsappIcon size={scale(18)} color={"#25D366"} />
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
                            onPress={() => {
                              openLink(
                                `mailto:${salonInfoData?.data?.salonInfo?.salonEmail}`,
                              );
                            }}
                          >
                            <EmailIcon size={scale(18)} color={"#EA4335"} />
                          </Pressable>
                        )}
                      </View>
                    </View>

                    <View>
                      {salonInfoData?.data?.salonInfo?.location?.coordinates
                        ?.latitude &&
                        salonInfoData?.data?.salonInfo?.location?.coordinates
                          ?.longitude && (
                          <MapView
                            provider={PROVIDER_GOOGLE}
                            initialCamera={{
                              center: {
                                latitude:
                                  salonInfoData?.data?.salonInfo?.location
                                    ?.coordinates?.latitude,
                                longitude:
                                  salonInfoData?.data?.salonInfo?.location
                                    ?.coordinates?.longitude,
                              },
                              zoom: 15,
                              pitch: 0,
                              heading: 0,
                            }}
                            scrollEnabled={false}
                            zoomEnabled={false}
                            rotateEnabled={false}
                            pitchEnabled={false}
                            style={[styles.map]}
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
                          gap: verticalScale(5),
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
                            Location
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
                          gap: verticalScale(5),
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
                            Follow us on
                          </CustomText>

                          <CustomSecondaryText
                            style={
                              {
                                // fontSize: scale(14),
                              }
                            }
                          >
                            Social links
                          </CustomSecondaryText>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: scale(10),
                          }}
                        >
                          {salonInfoData?.data?.salonInfo?.instraLink && (
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
                                  salonInfoData.data.salonInfo.instraLink,
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
                                openLink(salonInfoData.data.salonInfo.fbLink)
                              }
                            >
                              <FacebookIcon
                                size={scale(18)}
                                color={"#1877F2"}
                              />
                            </Pressable>
                          )}

                          {salonInfoData?.data?.salonInfo?.twitterLink && (
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
                                  salonInfoData.data.salonInfo.twitterLink,
                                )
                              }
                            >
                              <XIcon size={scale(18)} color={colors.text} />
                            </Pressable>
                          )}

                          {salonInfoData?.data?.salonInfo?.tiktokLink && (
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
                                  salonInfoData.data.salonInfo.tiktokLink,
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
                                openLink(salonInfoData.data.salonInfo.webLink)
                              }
                            >
                              <WebIcon size={scale(18)} color={colors.text} />
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
                                  <CustomText style={styles.serviceName}>
                                    {ser.serviceName}
                                  </CustomText>
                                  <CustomSecondaryText
                                    style={[
                                      styles.serviceDesc,
                                      { color: colors.secondaryText },
                                    ]}
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
                                    <CustomSecondaryText
                                      style={[
                                        styles.servicePrice,
                                        { color: colors.accentColor },
                                      ]}
                                    >
                                      {authenticatedUser?.currency}{" "}
                                      {ser.servicePrice}
                                    </CustomSecondaryText>
                                    <CustomText
                                      style={[
                                        styles.serviceEWT,
                                        { color: colors.secondaryText },
                                      ]}
                                    >
                                      ~ {formatMinutesToHrMin(ser.serviceEWT)}
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
                      Explore all {selectedTab}
                    </CustomText>

                    {salonInfoData?.data?.barbers?.length > 0 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: scale(10),
                        }}
                      >
                        {salonInfoData?.data?.barbers?.map((item, index) => {
                          return (
                            <BarberCard key={item?.barberId} item={item} />
                          );
                        })}
                      </View>
                    ) : (
                      <View
                        style={{
                          height: verticalScale(180),
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <CustomText>No {selectedTab} available</CustomText>
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
                      Explore all {selectedTab}
                    </CustomText>

                    {salonInfoData?.data?.barbers?.length > 0 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: scale(10),
                        }}
                      >
                        {salonInfoData?.data?.barbers?.map((item, index) => {
                          return (
                            <BarberCard key={item?.barberId} item={item} />
                          );
                        })}
                      </View>
                    ) : (
                      <View
                        style={{
                          height: verticalScale(180),
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <CustomText>No {selectedTab} available</CustomText>
                      </View>
                    )}
                  </>
                )}
              </BottomSheetScrollView>
            </>
          )}
        </BottomSheet>
      </GestureHandlerRootView>
    </CustomTabView>
  );
};

export default salon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: scale(10),
    paddingTop: scale(10),
    paddingBottom:
      Platform.OS === "ios" ? verticalScale(100) : verticalScale(20),
    gap: verticalScale(10),
    // backgroundColor: "#fff",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
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
    backgroundColor: "gray",
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
    // fontSize: scale(16),
    fontFamily: "AirbnbCereal_W_XBd",
  },
  serviceDesc: {
    // fontSize: scale(14),
  },
  servicePrice: {
    // fontSize: scale(14),
    fontFamily: "AirbnbCereal_W_Bd",
  },
  serviceEWT: {
    fontSize: moderateScale(12),
  },
});
