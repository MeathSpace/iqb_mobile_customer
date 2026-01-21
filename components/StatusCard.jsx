import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CustomText from "./CustomText";

const StatusCard = ({ item, index, width, height }) => {
  const { colors } = useTheme();

  return (
    <View
      key={index}
      style={{
        width: (width - scale(46)) / 2,
        backgroundColor: colors.modalBgColor,
        borderRadius: moderateScale(24),
        padding: scale(16),
        borderWidth: 1,
        borderColor: colors.queueBorder,
        flexDirection: "row",
        alignItems: "center",
        gap: scale(12),
      }}
    >
      {/* Icon Circle */}
      <View
        style={{
          width: scale(42),
          height: scale(42),
          borderRadius: moderateScale(14),
          backgroundColor: item.bgColor || "#f1f5f9",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Feather
          name={item.icon}
          size={moderateScale(20)}
          color={item.iconColor || colors.primary}
        />
      </View>

      {/* Text Content */}
      <View style={{ flex: 1 }}>
        <CustomText
          style={{
            fontSize: moderateScale(10),
            fontFamily: "AirbnbCereal_W_Bd",
            textTransform: "uppercase",
            letterSpacing: 1.2,
            color: "#94a3b8",
            marginBottom: verticalScale(2),
          }}
        >
          {item.label}
        </CustomText>
        <CustomText
          style={{
            fontFamily: "AirbnbCereal_W_XBd",
            fontSize: moderateScale(17),
            color: item.valueColor || colors.text,
          }}
          numberOfLines={1}
        >
          {item.value}
        </CustomText>
      </View>
    </View>
  );
};

export default StatusCard;

const styles = StyleSheet.create({});
