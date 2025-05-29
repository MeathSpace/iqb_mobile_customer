import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import CustomText from './CustomText'; // Make sure this is imported
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

const CustomTabView = ({ style, children, scrollable = false, ...props }) => {
    const { colors } = useTheme();
    const { authenticatedUser } = useAuth();
    const router = useRouter();

    const ContentWrapper = scrollable ? ScrollView : View;

    return (
        authenticatedUser?.salonId ? (
            <ContentWrapper
                style={{
                    backgroundColor: colors.tabBackground,
                    flex: 1,
                    paddingHorizontal: scale(20),
                    paddingVertical: verticalScale(10),
                    ...style
                }}
                contentContainerStyle={scrollable ? { flexGrow: 1, } : {}}
                {...props}
            >
                {children}
            </ContentWrapper>
        ) : (
            <View style={styles.centered}>
                <CustomText style={{ fontFamily: "AirbnbCereal_W_Md" }}>You are not connected to any salon</CustomText>
                <Pressable
                    onPress={() => router.replace('/home')}
                    style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>
                    <CustomText style={{ color: "#fff" }}>Go Back</CustomText></Pressable>
            </View>
        )
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(15),
        borderRadius: scale(4),
        alignItems: "center",
        justifyContent: "center",
        marginBlock: verticalScale(15)
    },
});

export default memo(CustomTabView);
