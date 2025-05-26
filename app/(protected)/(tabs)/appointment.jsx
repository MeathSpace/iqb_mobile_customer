import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomTabView from '../../../components/CustomTabView';
import CustomText from '../../../components/CustomText';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../../constants/Colors';
import { useTheme } from '@react-navigation/native';
import AppointmentItem from '../../../components/AppointmentItem';
import { router, useRouter } from 'expo-router';
import { useGlobal } from '../../../context/GlobalContext'
import CustomSecondaryText from '../../../components/CustomSecondaryText';

const Appointment = () => {
  const baseAppointData = {
    CustomerName: "Tom Cruise",
    barberName: "Korbyn Larson",
    barberImage: "https://celebrity.edu/wp-content/uploads/2021/08/top-tips-to-be-a-successful-barber.jpg",
    timeJoined: "15:30 - 15:40",
    date: "May 01"
  };

  const appointData = Array.from({ length: 30 }, (_, index) => ({
    id: index + 1,
    ...baseAppointData,
  }));

  const { colors } = useTheme();
  const router = useRouter()
  const { setJoinModes, joinModes } = useGlobal();

  return (
    <CustomTabView style={{ justifyContent: "space-between", paddingVertical: verticalScale(0), paddingTop: verticalScale(10) }}>
      <View style={{ flex: 1, paddingBottom: Platform.OS === 'ios' ? verticalScale(60) : 0 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: verticalScale(6) }}>
          <CustomText style={styles.title}>Scheduled Appointment</CustomText>
          <View
            style={{
              width: moderateScale(28),
              height: moderateScale(28),
              borderRadius: moderateScale(20),
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: Colors.modeColor.colorCode2,

            }}
          ><CustomSecondaryText style={{ color: Colors.modeColor.colorCode }}>15</CustomSecondaryText></View>
        </View>
        <FlatList
          data={appointData}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            return (<AppointmentItem item={item} />)
          }}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: verticalScale(20) }} />}
        />
        <Pressable
          onPress={() => {
            setJoinModes((prev) => ({ ...prev, appointment: true, appointmentType: "Book" }))
            router.push("/selectBarber")
            // router.push("/appointmentCalender")
          }}
          style={[
            styles.btn,
            {
              backgroundColor: Colors.modeColor.colorCode,
              shadowColor: Colors.modeColor.colorCode,
              marginBottom: Platform.OS === 'ios' ? verticalScale(20) : verticalScale(10),
              marginTop: verticalScale(10)
            }
          ]}
        >
          <CustomText style={styles.btnText}>Book Appt</CustomText>
        </Pressable>
      </View>


    </CustomTabView>
  );

};

export default Appointment;

const styles = StyleSheet.create({
  title: {
    fontFamily: "AirbnbCereal_W_Bd"
  },
  listContent: {
    overflow: "visible",
  },
  btn: {
    height: verticalScale(35),
    borderRadius: scale(4),
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  btnText: {
    color: "#fff"
  }
});
