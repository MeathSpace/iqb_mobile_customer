import { StyleSheet, View } from 'react-native';
import React from 'react';
import * as Progress from 'react-native-progress';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';

const ProgressHeader = ({ progressOne, progressTwo, progressThree }) => {

    const { colors } = useTheme()

    return (
        <View style={styles.container}>
            <Progress.Bar
                progress={progressOne}
                style={styles.bar}
                color={colors.text}
                unfilledColor={colors.border}
                borderWidth={0}
                height={verticalScale(5)}
            />
            <Progress.Bar
                progress={progressTwo}
                style={styles.bar}
                color={colors.text}
                unfilledColor={colors.border}
                borderWidth={0}
                height={verticalScale(5)}
            />
            <Progress.Bar
                progress={progressThree}
                style={styles.bar}
                color={colors.text}
                unfilledColor={colors.border}
                borderWidth={0}
                height={verticalScale(5)}
            />
        </View>
    );
};

export default ProgressHeader;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: scale(10),
        minHeight: verticalScale(20),
        alignItems: 'center',
        width: '100%',

    },
    bar: {
        flex: 1
    },
});
