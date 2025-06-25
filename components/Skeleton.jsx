import React, { useRef, useEffect, version } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

const Skeleton = ({ width = '100%', height = verticalScale(20), borderRadius = scale(8), style }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 100],
    });

    return (
        <View style={[styles.container, { width, height, borderRadius }, style]}>
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        transform: [{ translateX }],
                    },
                    styles.shimmerOverlay,
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(11, 163, 173, 0.1)',
        overflow: 'hidden',
        position: 'relative',
    },
    shimmerOverlay: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
        opacity: 0.4,
    },
});

export default Skeleton;





// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import Skeleton from '../../../components/Skeleton';

// const queuelist = () => {
//     return (
//         <View style={styles.container}>
//             <Skeleton width="90%" height={20} />
//             <View style={{ height: 16 }} />
//             <Skeleton width="60%" height={20} />
//             <View style={{ height: 16 }} />
//             <Skeleton width="100%" height={180} borderRadius={16} />
//             <View style={{ height: 16 }} />
//             <Skeleton height={40} width={40} borderRadius={40} />
//         </View>
//     )
// }

// export default queuelist

// const styles = StyleSheet.create({})


