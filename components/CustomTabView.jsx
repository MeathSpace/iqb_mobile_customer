import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { memo } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { SalonIcon } from "../constants/icons";
import { useAuth } from "../context/AuthContext";
import CustomText from "./CustomText"; // Make sure this is imported

const CustomTabView = ({ style, children, scrollable = false, ...props }) => {
  const { colors } = useTheme();
  const { authenticatedUser } = useAuth();
  const router = useRouter();

  const ContentWrapper = scrollable ? ScrollView : View;

  return authenticatedUser?.salonId ? (
    <ContentWrapper
      style={{
        backgroundColor: colors.background,
        flex: 1,
        paddingHorizontal: scale(10),
        paddingTop: verticalScale(10),
        ...style,
      }}
      contentContainerStyle={scrollable ? { flexGrow: 1 } : {}}
      {...props}
    >
      {children}
    </ContentWrapper>
  ) : (
    <View style={styles.centered}>
      <View
        style={[
          styles.upcomingCard,
          { backgroundColor: colors.cardColor, borderColor: colors.cardBorder },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: "rgba(13, 148, 136, 0.1)" },
          ]}
        >
          <SalonIcon color={colors.accentColor} size={scale(32)} />
        </View>
        <CustomText style={styles.cardTitle}>Browse Salons</CustomText>
        <CustomText style={[styles.cardSubtitle, {}]}>
          You're currently not connected to any salon
        </CustomText>
        <TouchableOpacity
          onPress={() => router.replace("/home")}
          style={[styles.bookButton, { backgroundColor: colors.accentColor }]}
          activeOpacity={0.85}
        >
          <CustomText style={styles.bookButtonText}>Connect Now</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    justifyContent: "center",
    padding: scale(10),
    // backgroundColor: "red"
  },
  btn: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(15),
    borderRadius: scale(4),
    alignItems: "center",
    justifyContent: "center",
    marginBlock: verticalScale(15),
  },

  upcomingCard: {
    // backgroundColor: '#ffffff',
    borderRadius: scale(12),
    padding: scale(20),
    // alignItems: 'center',
    // borderColor: '#e5e7eb',
    borderWidth: scale(1),
    gap: verticalScale(15),
    marginBottom: verticalScale(60),
    // marginTop: verticalScale(40)
  },

  iconContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(80),
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "auto",
  },
  cardTitle: {
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(18),
    textAlign: "center",
    // marginBottom: verticalScale(4),
  },
  cardSubtitle: {
    textAlign: "center",
    // marginBottom: verticalScale(20)
  },
  bookButton: {
    // bg-teal-500
    paddingVertical: verticalScale(16), // py-4
    borderRadius: scale(12), // rounded-xl
    // marginBottom: verticalScale(15), // mb-6
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonText: {
    color: "#fff", // text-white
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(16),
  },
});

export default memo(CustomTabView);
