import { usePreventRemove, useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import api from "../../utils/api"
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native"; // Removed unused TouchableOpacity
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import CustomSecondaryText from "../../components/CustomSecondaryText";
import CustomText from "../../components/CustomText";
import Skeleton from "../../components/Skeleton";
import {
  AddIcon,
  ArrowLeftIcon,
  CheckIcon,
  SearchIcon,
} from "../../constants/icons";
import { useAuth } from "../../context/AuthContext";
import { useGlobal } from "../../context/GlobalContext";
import i18n from "../../src/localization/i18n"

const SingleJoin = () => {

  const baseContent = i18n.t("protected.singleJoin")

  const router = useRouter();
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const { authenticatedUser } = useAuth();

  const [servicesCategoryList, setServicesCategoryList] = useState({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        setServicesCategoryList((prev) => ({ ...prev, loading: true }));

        const { data } = await api.post(
          `/mobileRoutes/getAllSalonCategories`,
          {
            salonId: authenticatedUser?.salonId,
          },
        );

        setServicesCategoryList((prev) => ({
          ...prev,
          loading: false,
          data: data?.response,
          success: true,
          error: null,
        }));
        setSelectedCategory(data?.response?.[0]?.serviceCategoryName);
      } catch (error) {
        setServicesCategoryList((prev) => ({
          ...prev,
          loading: false,
          data: null,
          success: false,
          error: error,
        }));
        console.log("Error ", error?.response);
      }
    };

    fetchCategoryList();
  }, [authenticatedUser]);

  const categoryList = ["Hair Cut", "Beard", "Trim", "Spa", "Hair"];

  const [selectedCategory, setSelectedCategory] = useState("");

  const [salonServicesByCategory, setSalonServicesByCategory] = useState({
    data: [],
    filteredData: [],
    loading: false,
    error: null,
    success: false,
  });

  useEffect(() => {
    const fetchSalonServicesByCategory = async () => {
      try {
        setSalonServicesByCategory((prev) => ({ ...prev, loading: true }));

        const { data } = await api.get(
          `/mobileRoutes/getSalonServicesByCategory`,
          {
            params: {
              salonId: authenticatedUser?.salonId,
              serviceCategoryName: selectedCategory,
            },
          },
        );

        setSalonServicesByCategory((prev) => ({
          ...prev,
          loading: false,
          data: data?.response,
          filteredData: data?.response,
          success: true,
          error: null,
        }));
      } catch (error) {
        setSalonServicesByCategory((prev) => ({
          ...prev,
          loading: false,
          data: null,
          filteredData: null,
          success: false,
          error: error,
        }));
        console.log("Error ", error);
      }
    };

    if (selectedCategory) {
      fetchSalonServicesByCategory();
    }
  }, [selectedCategory]);

  const [searchServiceQuery, setSearchServiceQuery] = useState("");

  const handleChange = (text) => {
    setSearchServiceQuery(text);
  };

  useEffect(() => {
    if (searchServiceQuery) {
      const filtered = salonServicesByCategory?.data?.filter((item) =>
        item?.serviceName
          ?.toLowerCase()
          .includes(searchServiceQuery.toLowerCase()),
      );

      setSalonServicesByCategory((prev) => ({
        ...prev,
        filteredData: filtered,
      }));
    } else {
      setSalonServicesByCategory((prev) => ({
        ...prev,
        filteredData: prev.data,
      }));
    }
  }, [searchServiceQuery]);

  function formatMinutesToHrMin(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
    if (hours > 0) return `${hours}hr`;
    return `${mins}m`;
  }

  const [selectedServices, setSelectedServices] = useState([]);

  const addServiceHandler = (service) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.serviceId === service.serviceId);
      if (exists) return prev;
      return [...prev, service];
    });
  };

  const removeServiceHandler = (service) => {
    setSelectedServices((prev) =>
      prev.filter((s) => s.serviceId !== service.serviceId),
    );
  };

  const insets = useSafeAreaInsets();

  const totalPrice = selectedServices.reduce(
    (acc, service) => acc + service.servicePrice,
    0,
  );
  const totalTime = selectedServices.reduce(
    (acc, service) => acc + service.serviceEWT,
    0,
  );
  const totalServices = selectedServices.length;

  const { setQueueJoinType, queueJoinType, joinPopupType, setJoinPopupType } =
    useGlobal();

  let hasUnsavedChanges = true;

  usePreventRemove(
    hasUnsavedChanges, // This boolean determines if removal should be prevented
    ({ data }) => {
      Alert.alert(
        baseContent.alertBox.alertOne.header,
        baseContent.alertBox.alertOne.subHeader,
        [
          {
            text: baseContent.alertBox.alertOne.cancel,
            style: "cancel",
            onPress: () => null, // Do nothing, stay on screen
          },
          {
            text: baseContent.alertBox.alertOne.ok,
            onPress: () => {
              setQueueJoinType({
                barberSelect: false,
                serviceSelect: false,
              });
              setJoinPopupType({
                single: false,
                group: false,
              });
              router.push("/(tabs)/home");
            },
          },
        ], // Only an 'OK' button
      );
    },
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          padding: scale(10),
          flex: 1,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: scale(10),
            marginBottom: verticalScale(20),
          }}
        >
          <Pressable onPress={() => router.replace("/queuelist")}>
            <ArrowLeftIcon color={colors.text} size={scale(16)} />
          </Pressable>
          <CustomText
            style={{
              flex: 1,
              fontFamily: "AirbnbCereal_W_XBd",
              fontSize: scale(18),
            }}
          >
            {baseContent.header}
          </CustomText>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          {/* Search Input */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={baseContent.searchInput.placeholder}
              placeholderTextColor={colors.secondaryText}
              value={searchServiceQuery}
              onChangeText={handleChange}
              style={[
                styles.input,
                {
                  borderWidth: scale(1),
                  borderColor: colors.queueBorder,
                  backgroundColor: colors.cardColor,
                  color: colors.text,
                },
              ]}
            />
            <Pressable style={[styles.searchButton, {backgroundColor: colors.accentColor}]}>
              <SearchIcon size={scale(20)} color="white" />
            </Pressable>
          </View>
        </TouchableWithoutFeedback>

        {/* Categories */}
        {servicesCategoryList?.loading ? (
          <FlatList
            data={[0, 1, 2, 3, 4, 5, 6]}
            renderItem={({ item }) => (
              <Skeleton
                height={verticalScale(40)}
                width={scale(100)}
                borderRadius={scale(12)}
              />
            )}
            keyExtractor={(item) => item.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              height: verticalScale(40),
              flexGrow: 0,
              marginBottom: verticalScale(15),
            }}
            contentContainerStyle={{
              alignItems: "center",
              gap: scale(8),
            }}
          />
        ) : (
          <FlatList
            data={servicesCategoryList?.data}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item.serviceCategoryName)}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor:
                      selectedCategory === item?.serviceCategoryName
                        ? colors.accentColor
                        : colorScheme === "dark"
                          ? "#3f3f46"
                          : "#e4e4e7",
                    flexDirection: "row",
                    gap: scale(5),
                  },
                ]}
              >
                <Image
                  style={{
                    width: scale(20),
                    height: scale(20),
                    borderRadius: scale(20),
                    borderWidth: scale(1),
                    borderColor: colors.queueBorder,
                  }}
                  source={{ uri: item?.serviceCategoryImage?.url }}
                  contentFit="cover"
                  transition={300}
                />
                <CustomText
                  style={{
                    lineHeight: verticalScale(35),
                    color:
                      selectedCategory === item?.serviceCategoryName
                        ? "#fff"
                        : colorScheme === "dark"
                          ? "#fff"
                          : "#000",
                    textAlign: "center",
                  }}
                >
                  {item?.serviceCategoryName}
                </CustomText>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              height: verticalScale(35),
              flexGrow: 0,
              marginBottom: verticalScale(15),
            }}
            contentContainerStyle={{
              alignItems: "center",
              gap: scale(8),
            }}
          />
        )}

        {/* Scrollable List Area */}
        <View
          style={{
            flex: 1,
          }}
        >
          {salonServicesByCategory?.loading ? (
            <FlatList
              data={[1, 2, 3, 4, 5, 6, 7, 8]}
              renderItem={() => (
                <Skeleton
                  width={scale(160)}
                  height={235}
                  borderRadius={scale(8)}
                />
              )}
              keyExtractor={(item) => item.toString()}
              numColumns={2}
              columnWrapperStyle={{ columnGap: scale(10) }}
              ItemSeparatorComponent={() => (
                <View style={{ height: scale(10) }} />
              )}
              contentContainerStyle={{
                paddingBottom: scale(20),
                paddingTop: scale(10),
              }}
              showsVerticalScrollIndicator={false}
            />
          ) : salonServicesByCategory?.data?.length > 0 ? (
            <FlatList
              data={salonServicesByCategory?.filteredData}
              renderItem={({ item }) => {
                const isSelected = selectedServices.find(
                  (s) => s.serviceId === item.serviceId,
                );
                return (
                  <Pressable
                    onPress={() =>
                      isSelected
                        ? removeServiceHandler(item)
                        : addServiceHandler(item)
                    }
                    style={[
                      styles.serviceCard,
                      {
                        backgroundColor: colors.cardColor,
                        borderColor: isSelected
                          ? colors.accentColor
                          : colors.queueBorder,
                        borderWidth: isSelected ? scale(2) : scale(1),
                      },
                    ]}
                  >
                    <View style={styles.serviceCardImageContainer}>
                      <Image
                        style={[
                          styles.serviceCardImage,
                          {
                            borderWidth: scale(1),
                            borderColor: colors.queueBorder,
                          },
                        ]}
                        source={{ uri: item?.serviceIcon?.url }}
                        contentFit="cover"
                        transition={300}
                      />
                      <Pressable
                        onPress={() =>
                          isSelected
                            ? removeServiceHandler(item)
                            : addServiceHandler(item)
                        }
                        style={[
                          styles.selectIcon,
                          {
                            backgroundColor: isSelected
                              ? colors.accentColor
                              : colorScheme === "dark"
                                ? "#3f3f46"
                                : "#e4e4e7",
                          },
                        ]}
                      >
                        {isSelected ? (
                          <CheckIcon color="#fff" size={scale(18)} />
                        ) : (
                          <AddIcon color={colors.text} />
                        )}
                      </Pressable>
                    </View>
                    <CustomText
                      style={{
                        fontFamily: "AirbnbCereal_W_Bd",
                        textAlign: "center",
                      }}
                    >
                      {item?.serviceName}
                    </CustomText>
                    <CustomSecondaryText>
                      ~{formatMinutesToHrMin(item?.serviceEWT)}
                    </CustomSecondaryText>
                    <CustomText
                      style={{
                        fontFamily: "AirbnbCereal_W_XBd",
                      }}
                    >
                      {authenticatedUser?.currency} {item?.servicePrice}
                    </CustomText>
                  </Pressable>
                );
              }}
              keyExtractor={(item) => item?.serviceId}
              numColumns={2}
              columnWrapperStyle={{ columnGap: scale(10) }}
              ItemSeparatorComponent={() => (
                <View style={{ height: scale(10) }} />
              )}
              contentContainerStyle={{
                paddingBottom: scale(20),
                paddingTop: scale(10),
              }}
              showsVerticalScrollIndicator={false}
            />
          ) : null}
        </View>
      </View>

      {/* Footer */}
      {selectedServices?.length ? (
        <View
          style={{
            // backgroundColor: colors.cardColor,
            borderTopColor: colors.queueBorder,
            borderTopWidth: scale(1),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: scale(10),
          }}
        >
          <View style={{}}>
            <CustomText
              style={{ fontFamily: "AirbnbCereal_W_XBd", fontSize: scale(18) }}
            >
              {authenticatedUser?.currency} {totalPrice.toFixed(2)}
            </CustomText>
            <CustomSecondaryText>
              {totalServices} {totalServices === 1 ? baseContent.service : baseContent.services} |{" "}
              {formatMinutesToHrMin(totalTime)}
            </CustomSecondaryText>
          </View>

          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/singleJoinBarber",
                params: {
                  data: JSON.stringify(selectedServices),
                },
              });
            }}
            style={[styles.queueButton, {backgroundColor: colors.accentColor}]}
            activeOpacity={0.85}
          >
            <CustomText style={styles.queueButtonText}>{baseContent.continue}</CustomText>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default SingleJoin;

const styles = StyleSheet.create({
  categoryButton: {
    paddingHorizontal: scale(10),
    borderRadius: scale(8),
    justifyContent: "center",
    alignItems: "center",
  },

  inputContainer: {
    position: "relative",
    width: "100%",
    justifyContent: "center",
    marginBottom: verticalScale(15),
  },
  input: {
    width: "100%",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    paddingRight: scale(50), // space for the search button
    borderRadius: scale(8),
  },
  searchButton: {
    position: "absolute",
    right: scale(4),
     // teal-500
    padding: scale(8),
    borderRadius: scale(6),
    justifyContent: "center",
    alignItems: "center",
  },

  serviceCard: {
    // width: scale(103), for 3 cards
    width: scale(160),
    // height: verticalScale(150),
    borderRadius: scale(8),
    justifyContent: "center",
    alignItems: "center",
    padding: scale(10),
    gap: verticalScale(5),
  },

  serviceCardImageContainer: {
    width: "100%",
    height: verticalScale(120),
    position: "relative",
  },

  serviceCardImage: {
    width: "100%",
    height: "100%",
    borderRadius: scale(4),
  },
  selectIcon: {
    position: "absolute",
    bottom: verticalScale(10),
    right: scale(10),
    height: scale(30),
    width: scale(30),
    borderRadius: scale(30),
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },

  queueButton: {
    width: "40%",
     // bg-teal-500
    paddingVertical: verticalScale(12), // py-4
    borderRadius: scale(8), // rounded-xl
    // marginBottom: verticalScale(15), // mb-6
    alignItems: "center",
    justifyContent: "center",
  },
  queueButtonText: {
    color: "#fff", // text-white
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(16),
  },

  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
