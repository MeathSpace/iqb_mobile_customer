import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import React, { useState } from 'react';
import { SearchIcon } from '../constants/icons';
import CustomText from './CustomText';
import { useTheme } from '@react-navigation/native';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { useAuth } from '../context/AuthContext';

const SearchHeader = () => {
    const allCities = [
        { id: '1', title: 'Mumbai', latitude: 19.0760, longitude: 72.8777 },
        { id: '2', title: 'Delhi', latitude: 28.6139, longitude: 77.2090 },
        { id: '3', title: 'Bengaluru', latitude: 12.9716, longitude: 77.5946 },
        { id: '4', title: 'Hyderabad', latitude: 17.3850, longitude: 78.4867 },
        { id: '5', title: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714 },
        { id: '6', title: 'Chennai', latitude: 13.0827, longitude: 80.2707 },
        { id: '7', title: 'Kolkata', latitude: 22.5726, longitude: 88.3639 },
        { id: '8', title: 'Pune', latitude: 18.5204, longitude: 73.8567 },
        { id: '9', title: 'Jaipur', latitude: 26.9124, longitude: 75.7873 },
        { id: '10', title: 'Surat', latitude: 21.1702, longitude: 72.8311 },
    ];


    const [query, setQuery] = useState('');
    const [filteredCities, setFilteredCities] = useState(allCities);


    const handleTextChange = (text) => {
        setQuery(text);
        if (!text) {
            setFilteredCities(allCities);
            return;
        }
        const filtered = allCities.filter((item) =>
            item.title.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCities(filtered);
    };

    const handleSelect = (item) => {
        setSearchSalon(item);
        setQuery(item.title);
        setFilteredCities([]);
    };

    const { colors } = useTheme()
    const { authenticatedUser, setSearchSalon } = useAuth()

    const blurhash =
        'https://thumbs.dreamstime.com/b/default-profile-picture-avatar-photo-placeholder-vector-illustration-default-profile-picture-avatar-photo-placeholder-vector-189495158.jpg';

    return (
        <View style={[styles.container, { backgroundColor: colors.tabBackground }]}>
            <View style={[styles.searchWrapper,
            {
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderWidth: moderateScale(1),
            }]}>
                <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Search city"
                    placeholderTextColor={colors.secondaryText}
                    value={query}
                    onChangeText={handleTextChange}
                />
                <Pressable style={styles.iconBtn}>
                    <SearchIcon size={moderateScale(16)} color={colors.text} />
                </Pressable>
            </View>
            <Link href="/account">
                <Image
                    style={{ height: moderateScale(35), width: moderateScale(35), borderRadius: moderateScale(20) }}
                    source={authenticatedUser?.imageUrl}
                    placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={1000}
                />
            </Link>

            {filteredCities.length > 0 && query.length > 0 && (
                <FlatList
                    data={filteredCities}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[styles.dropdownItem, {
                                borderBottomColor: colors.border,
                                borderBottomWidth: moderateScale(1),
                            }]}
                            onPress={() => handleSelect(item)}
                        >
                            <CustomText>{item.title}</CustomText>
                        </Pressable>
                    )}
                    style={[styles.dropdown, {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        borderWidth: moderateScale(1),
                    }]}
                />
            )}
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
        alignItems:"center",
        gap: scale(10),
    },
    searchWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: moderateScale(4),
        paddingHorizontal: scale(10),
        height: verticalScale(40),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
