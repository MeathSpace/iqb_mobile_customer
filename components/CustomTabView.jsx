import { ScrollView, StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import CustomText from './CustomText'; // Make sure this is imported

const CustomTabView = ({ style, children, scrollable = false, ...props }) => {
    const { colors } = useTheme();
    const { authenticatedUser } = useAuth();

    const ContentWrapper = scrollable ? ScrollView : View;

    return (
        authenticatedUser?.salonId ? (
            <ContentWrapper
                style={{
                    backgroundColor: colors.tabBackground,
                    flex: 1,
                    paddingHorizontal: scale(10),
                    paddingVertical: verticalScale(10),
                    ...style
                }}
                contentContainerStyle={scrollable ? { flexGrow: 1 } : {}}
                {...props}
            >
                {children}
            </ContentWrapper>
        ) : (
            <View style={styles.centered}>
                <CustomText style={{ fontFamily: "AirbnbCereal_W_Md" }}>Salon is not selected</CustomText>
            </View>
        )
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default memo(CustomTabView);
