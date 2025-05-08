import React from 'react';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { moderateScale } from 'react-native-size-matters';

export const CalendarIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <AntDesign name="calendar" size={size} color={color} style={style} />
);

export const SearchIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <AntDesign name="search1" size={size} color={color} style={style} />
);

export const UserIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <FontAwesome name="user" size={size} color={color} style={style} />
);


