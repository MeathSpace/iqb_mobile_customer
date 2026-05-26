// import { Ionicons } from "@expo/vector-icons";
// import { useTheme } from "@react-navigation/native";
// import { useState } from "react";
// import {
//   Modal,
//   Pressable,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import { scale, verticalScale } from "react-native-size-matters";

// import CustomText from "./CustomText";
// import CustomSecondaryText from "./CustomSecondaryText";
// import { useLanguage } from "../context/LanguageContext";
// import i18n from "../src/localization/i18n";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const LanguageDropdown = () => {
//   const { colors } = useTheme();
//   const { changeLanguage, locale, setLocale } = useLanguage();

//   const [visible, setVisible] = useState(false);

//   const baseContent = i18n.t("LanguageDropdown", { locale });

//   const handleChangeLanguage = async (lang) => {
//     changeLanguage(lang);
//     setVisible(false);
//   };

//   const getLabel = () => {
//     switch (locale) {
//       case "de":
//         return baseContent.german;
//       case "pt":
//         return baseContent.portugese;
//       default:
//         return baseContent.english;
//     }
//   };

//   return (
//     <>
//       <View style={styles.languageContainer}>
//         <TouchableOpacity
//           activeOpacity={0.85}
//           onPress={() => setVisible(true)}
//           style={[
//             styles.languageButton,
//             {
//               backgroundColor: colors.card,
//               borderColor: colors.border,
//             },
//           ]}
//         >
//           <Text style={styles.flag}>
//             {locale === "en" ? "🇺🇸" : locale === "de" ? "🇩🇪" : "🇵🇹"}
//           </Text>

//           <CustomText style={styles.languageText}>
//             {getLabel()}
//           </CustomText>

//           <Ionicons name="chevron-down" size={16} color={colors.text} />
//         </TouchableOpacity>
//       </View>

//       <Modal transparent visible={visible} animationType="fade">
//         <Pressable
//           style={styles.modalOverlay}
//           onPress={() => setVisible(false)}
//         >
//           <View
//             style={[
//               styles.dropdownContainer,
//               {
//                 backgroundColor: colors.card,
//                 borderColor: colors.border,
//               },
//             ]}
//           >
//             <TouchableOpacity
//               style={styles.languageOption}
//               onPress={() => handleChangeLanguage("en")}
//             >
//               <Text style={styles.flag}>🇺🇸</Text>
//               <View>
//                 <CustomText>English</CustomText>
//                 <CustomSecondaryText>{baseContent.english}</CustomSecondaryText>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.languageOption}
//               onPress={() => handleChangeLanguage("de")}
//             >
//               <Text style={styles.flag}>🇩🇪</Text>
//               <View>
//                 <CustomText>Deutsch</CustomText>
//                 <CustomSecondaryText>{baseContent.german}</CustomSecondaryText>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.languageOption}
//               onPress={() => handleChangeLanguage("pt")}
//             >
//               <Text style={styles.flag}>🇵🇹</Text>
//               <View>
//                 <CustomText>Português</CustomText>
//                 <CustomSecondaryText>{baseContent.portugese}</CustomSecondaryText>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </Pressable>
//       </Modal>
//     </>
//   );
// };

// export default LanguageDropdown;

// const styles = StyleSheet.create({
//   languageContainer: {
//     position: "absolute",
//     top: verticalScale(40),
//     right: scale(20),
//     zIndex: 100,
//   },

//   languageButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: scale(6),
//     paddingHorizontal: scale(12),
//     paddingVertical: verticalScale(8),
//     borderRadius: scale(10),
//     borderWidth: 1,
//   },

//   languageText: {
//     fontSize: scale(14),
//     fontFamily: "AirbnbCereal_W_Md",
//   },

//   flag: {
//     fontSize: scale(16),
//   },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.15)",
//   },

//   dropdownContainer: {
//     position: "absolute",
//     top: verticalScale(60),
//     right: scale(20),
//     width: scale(170),
//     borderRadius: scale(14),
//     borderWidth: 1,
//     overflow: "hidden",
//     elevation: 5,
//   },

//   languageOption: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: scale(10),
//     paddingHorizontal: scale(14),
//     paddingVertical: verticalScale(14),
//   },
// });

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { scale, verticalScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomText from "./CustomText";
import CustomSecondaryText from "./CustomSecondaryText";
import { useLanguage } from "../context/LanguageContext";
import i18n from "../src/localization/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LanguageDropdown = () => {
  const { colors } = useTheme();
  const { changeLanguage, locale } = useLanguage();
  const insets = useSafeAreaInsets();

  const [visible, setVisible] = useState(false);

  const baseContent = i18n.t("LanguageDropdown", { locale });

  const handleChangeLanguage = async (lang) => {
    await AsyncStorage.setItem("currentLanguage", lang);
    changeLanguage(lang);
    setVisible(false);
  };

  const getLabel = () => {
    switch (locale) {
      case "de":
        return baseContent.german;
      case "pt":
        return baseContent.portugese;
      default:
        return baseContent.english;
    }
  };

  const LanguageOption = ({ flag, title, subtitle, lang }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => handleChangeLanguage(lang)}
      activeOpacity={0.8}
    >
      <Text style={styles.flag}>{flag}</Text>

      <View style={styles.optionTextContainer}>
        <CustomText>{title}</CustomText>
        <CustomSecondaryText>{subtitle}</CustomSecondaryText>
      </View>

      {locale === lang && (
        <Ionicons name="checkmark" size={20} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      {/* Trigger Button */}
      <View style={[styles.container]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setVisible(true)}
          style={[
            styles.button,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={styles.flag}>
            {locale === "en" ? "🇬🇧" : locale === "de" ? "🇩🇪" : "🇵🇹"}
          </Text>

          <CustomText style={styles.label}>{getLabel()}</CustomText>

          <Ionicons name="chevron-down" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal transparent visible={visible} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View
            style={[
              styles.modal,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <CustomText>Select Language</CustomText>

              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Options */}
            <LanguageOption
              flag="🇺🇸"
              title="English"
              subtitle={baseContent.english}
              lang="en"
            />

            <LanguageOption
              flag="🇩🇪"
              title="Deutsch"
              subtitle={baseContent.german}
              lang="de"
            />

            <LanguageOption
              flag="🇵🇹"
              title="Português"
              subtitle={baseContent.portugese}
              lang="pt"
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default LanguageDropdown;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: scale(20),
    top: verticalScale(15),
    zIndex: 100,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderRadius: scale(10),
    borderWidth: 1,
  },

  label: {
    fontSize: scale(14),
    fontFamily: "AirbnbCereal_W_Md",
  },

  flag: {
    fontSize: scale(16),
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(20),
  },

  modal: {
    width: "100%",
    borderRadius: scale(16),
    borderWidth: 1,
    padding: scale(16),
    gap: verticalScale(10),
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(5),
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
    paddingVertical: verticalScale(12),
  },

  optionTextContainer: {
    flex: 1,
  },
});
