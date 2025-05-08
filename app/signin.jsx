import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import CustomScrollView from "../components/CustomScrollView"
import CustomText from "../components/CustomText"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const signin = () => {

    const colorScheme = useColorScheme()

    return (
        <CustomScrollView>
            <CustomText>signin</CustomText>

            <Image
                style={{
                    // width: 100,
                    // height: 100
                    tintColor: colorScheme === "dark" ? "#fff" : "#000"
                }}
                source={require("../assets/images/IQB_Logo.png")}
            />
        </CustomScrollView>
    )
}

export default signin

const styles = StyleSheet.create({})