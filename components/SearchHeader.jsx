import { FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import React, { useEffect, useRef, useState } from 'react';
import { NotificationIcon, SearchIcon } from '../constants/icons';
import CustomText from './CustomText';
import { useTheme } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useAuth } from '../context/AuthContext';
import { useGlobal } from '../context/GlobalContext';
import { BASE_URL } from '@/utils/api'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchHeader = () => {

    const { colors } = useTheme()
    const { authenticatedUser, setSearchSalon } = useAuth()
    const { searchCitySalons, setSearchCitySalons } = useGlobal()

    const [query, setQuery] = useState('');

    const timeoutRef = useRef(null);


    const handleTextChange = (text) => {
        clearTimeout(timeoutRef.current);
        setQuery(text);
    };

    useEffect(() => {

        let timeId;

        if (query) {

            timeId = setTimeout(() => {
                const fetchCityName = async () => {
                    try {

                        setSearchCitySalons((prev) => ({ ...prev, loading: true }))

                        const { data } = await axios.get(`${BASE_URL}/mobileRoutes/searchByNameAndCity`, {
                            params: {
                                searchValue: query
                            }
                        })

                        setSearchCitySalons((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))
                        Keyboard.dismiss()

                    } catch (error) {

                        setSearchCitySalons((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
                        console.log("Error fetching city or name ", error)
                    }
                }

                fetchCityName()

            }, 1000)

            timeoutRef.current = timeId;
        }

        return () => {
            clearTimeout(timeoutRef.current);
        }

    }, [query])

    const router = useRouter()
    const { newNotification, setNewNotification } = useGlobal()

    return (
        <View style={[styles.container, {
            backgroundColor: colors.background
        }]}>
            <View style={[styles.searchWrapper,
            {
                backgroundColor: colors.cardColor,
                borderColor: colors.queueBorder,
                borderWidth: scale(1),
                borderRadius: scale(20)
            }]}>
                <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Search city or salon name"
                    placeholderTextColor={colors.secondaryText}
                    value={query}
                    onChangeText={handleTextChange}
                />
                <Pressable style={styles.iconBtn}>
                    <SearchIcon size={moderateScale(16)} color={colors.text} />
                </Pressable>
            </View>

            <Pressable
                style={{
                    height: scale(40),
                    width: scale(40),
                    borderRadius: scale(30),
                    // backgroundColor: "#EAA82433",
                    justifyContent: "center",
                    alignItems: "center"
                }}
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
                <NotificationIcon size={moderateScale(24)} color={colors.text} />
            </Pressable>

            {/* {searchCityNameData?.data?.length > 0 && query.length > 0 && (
                <FlatList
                    data={searchCityNameData?.data}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[styles.dropdownItem, {
                                borderBottomColor: colors.border,
                                borderBottomWidth: moderateScale(1),
                            }]}
                            onPress={() => handleSelect(item)}
                        >
                            <CustomText>{item.city}</CustomText>
                        </Pressable>
                    )}
                    style={[styles.dropdown, {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        borderWidth: scale(1),
                    }]}
                />
            )} */}
        </View>
    );
};

export default SearchHeader;

const styles = StyleSheet.create({
    container: {
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(10),
        position: 'relative',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: scale(10),
    },
    searchWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: moderateScale(4),
        paddingHorizontal: scale(10),
        height: verticalScale(40),
    },
    input: {
        flex: 1,
        fontSize: moderateScale(16),
        fontFamily: 'AirbnbCereal_W_Bk',
    },
    dropdown: {
        position: 'absolute',
        top: verticalScale(50),
        left: scale(10),
        right: scale(10),
        borderRadius: moderateScale(4),
        marginTop: verticalScale(4),
        maxHeight: verticalScale(200),
        zIndex: 2
    },
    dropdownItem: {
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(10),
    },
});
