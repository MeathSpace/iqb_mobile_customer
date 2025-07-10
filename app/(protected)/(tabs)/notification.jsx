// import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
// import { useRouter } from 'expo-router';
// import CustomTabView from '../../../components/CustomTabView';
// import { ArrowLeftIcon } from '../../../constants/icons';
// import CustomText from '../../../components/CustomText';
// import { Image } from 'expo-image';

// const notification = () => {

//     const router = useRouter()

//     return (
//         <CustomTabView
//             style={{
//                 paddingVertical: verticalScale(0),
//                 paddingTop: verticalScale(10),
//                 paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(20)
//             }}>
//             {
//                 [0, 1, 2].map((item, index) => {
//                     return (
//                         <View
//                             key={index}
//                             style={{
//                                 paddingVertical: verticalScale(15),
//                                 flexDirection: "row",
//                                 alignItems: "center",
//                                 gap: scale(10)
//                             }}
//                         >
//                             <Image
//                                 style={{ height: scale(50), width: scale(50), borderRadius: scale(40) }}
//                                 source={{ uri: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg" }}
//                                 // placeholder={{ blurhash }}
//                                 contentFit="cover"
//                                 transition={300}
//                             />

//                             <View style={{ gap: verticalScale(5), flex: 1 }}>
//                                 <CustomText
//                                     style={{
//                                         fontSize: scale(14)
//                                     }}
//                                 >Your appointment with Wade Warren has been successfully made.</CustomText>
//                                 <CustomText
//                                     style={{
//                                         fontSize: scale(12),
//                                         fontFamily: "AirbnbCereal_W_Bk"
//                                     }}
//                                 >2 mins ago</CustomText>
//                             </View>
//                         </View>
//                     )
//                 })
//             }
//         </CustomTabView>
//     )
// }

// export default notification

// const styles = StyleSheet.create({})

import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});



async function sendPushNotification(expoPushToken) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}


function handleRegistrationError(errorMessage) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission not granted to get push token for push notification!');
            return;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log(pushTokenString);
            return pushTokenString;
        } catch (e) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}

export default function notification() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(
        undefined
    );

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(token => setExpoPushToken(token ?? ''))
            .catch((error) => setExpoPushToken(`${error}`));

        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
            <Text>Your Expo push token: {expoPushToken}</Text>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text>Title: {notification && notification.request.content.title} </Text>
                <Text>Body: {notification && notification.request.content.body}</Text>
                <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
            </View>
            <Button
                title="Press to Send Notification"
                onPress={async () => {
                    await sendPushNotification(expoPushToken);
                }}
            />
        </View>
    );
}
