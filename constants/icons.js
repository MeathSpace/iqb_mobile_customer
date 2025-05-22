import React from 'react';
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
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

export const RightIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <AntDesign name="right" size={size} color={color} style={style} />
);

export const HeartIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <AntDesign name="hearto" size={size} color={color} style={style} />
);

export const HelpIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <Feather name="help-circle" size={size} color={color} style={style} />
);

export const AboutIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <MaterialCommunityIcons name="information-outline" size={size} color={color} style={style} />
);

export const LogoutIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <MaterialIcons name="logout" size={size} color={color} style={style} />
);

export const ArrowLeftIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <AntDesign name="arrowleft" size={size} color={color} style={style} />
);

export const SettingsIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <Feather name="settings" size={size} color={color} style={style} />
);

export const NextIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <MaterialIcons name="queue-play-next" size={size} color={color} style={style} />
);

export const ContactIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <Entypo name="phone" size={size} color={color} style={style} />
);

export const MapIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <FontAwesome5 name="map-marker-alt" size={size} color={color} style={style} />
);

export const FacebookIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <FontAwesome name="facebook-square" size={size} color={color} style={style} />
);

export const ClockIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <Feather name="clock" size={size} color={color} style={style} />
);

export const PeopleIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <MaterialIcons name="people-alt" size={size} color={color} style={style} />
);

export const CheckIcon = ({ size = moderateScale(24), color = 'black', style }) => (
    <Feather name="check" size={size} color={color} style={style} />
);
