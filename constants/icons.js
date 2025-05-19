import React from 'react';
import { AntDesign, Feather, FontAwesome, Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons';
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

export const HomeIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <Octicons name="home" size={size} color={color} style={style} />
);

export const QueueIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <MaterialIcons name="add-to-queue" size={size} color={color} style={style} />
);

export const SalonIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <MaterialIcons name="storefront" size={size} color={color} style={style} />
);

export const CalenderIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <Feather name="calendar" size={size} color={color} style={style} />
);

export const NotificationIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <MaterialIcons name="notifications-none" size={size} color={color} style={style} />
);

export const CloseIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <AntDesign name="close" size={size} color={color} style={style} />
);