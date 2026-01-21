import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { StyleSheet, View, Dimensions, TouchableOpacity } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CustomSecondaryText from "./CustomSecondaryText";
import CustomText from "./CustomText";

const { width } = Dimensions.get('window');

const BarberCard = ({ item }) => {
  const { colors } = useTheme();

  function formatMinutesToHrMin(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
    if (hours > 0) return `${hours}hr`;
    return `${mins}m`;
  }

  return (
    <View
      style={{
        width: (width - scale(46)) / 2, // Perfect 2-column alignment
        backgroundColor: colors.modalBgColor,
        borderRadius: moderateScale(28), // Matching Hero & Modal corners
        padding: scale(12),
        borderWidth: 1,
        borderColor: colors.queueBorder,
        alignItems: 'center', // Premium centered look
        marginBottom: verticalScale(2),
      }}
    >
      {/* Profile Image with Online Ring */}
      <View style={{ marginTop: verticalScale(5) }}>
        <View style={{
            padding: scale(3),
            borderRadius: scale(100),
            borderWidth: 2,
            borderColor: item?.isOnline ? "#14b8a6" : "#cbd5e1", // Status ring
        }}>
            <Image
            style={{
                height: scale(70),
                width: scale(70),
                borderRadius: scale(100),
                backgroundColor: colors.modalSectionColor,
            }}
            source={{ uri: item?.profile?.[0]?.url }}
            contentFit="cover"
            transition={300}
            />
        </View>
        
        {/* Status Dot */}
        <View style={{
            position: 'absolute',
            bottom: scale(2),
            right: scale(5),
            width: scale(14),
            height: scale(14),
            borderRadius: scale(10),
            backgroundColor: item?.isOnline ? "#14b8a6" : "#ef4444",
            borderWidth: 2,
            borderColor: colors.modalBgColor,
        }} />
      </View>

      {/* Info Section */}
      <View style={{ alignItems: 'center', marginTop: verticalScale(10), width: '100%' }}>
        <CustomText
          style={{
            fontFamily: "AirbnbCereal_W_XBd", // Extra Bold for hierarchy
            fontSize: moderateScale(15),
            color: colors.text,
            textAlign: 'center'
          }}
          numberOfLines={1}
        >
          {item.name}
        </CustomText>
        
        {/* Wait Time Badge */}
        <View
          style={{
            marginTop: verticalScale(6),
            backgroundColor: colors.background, // Nested contrast
            paddingHorizontal: scale(10),
            paddingVertical: verticalScale(4),
            borderRadius: moderateScale(10),
            borderWidth: 1,
            borderColor: colors.queueBorder,
            width: '100%',
            alignItems: 'center'
          }}
        >
          <CustomText
            style={{
              fontFamily: "AirbnbCereal_W_Bd",
              fontSize: moderateScale(10),
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              color: "#64748b",
            }}
          >
            Wait Time
          </CustomText>
          <CustomText
            style={{
              fontFamily: "AirbnbCereal_W_XBd",
              fontSize: moderateScale(13),
              color: colors.primary,
              marginTop: 1
            }}
          >
            {formatMinutesToHrMin(item?.barberEWT)}
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default BarberCard;