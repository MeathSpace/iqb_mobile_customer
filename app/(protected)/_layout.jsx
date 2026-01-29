import { Redirect, Stack, useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    return <Redirect href="/signin" />;
  }

  // useEffect(() => {
  //     if (!isAuthenticated) {
  //         router.push("/s")
  //         console.log("Loged out")
  //     }
  // }, [isAuthenticated])

  return (
    <Stack
      initialRouteName="(tabs)"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="selectBarber"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="selectServices"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="appointmentConfirmation"
        options={{
          presentation: "transparentModal",
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="joinpopup"
        options={{
          presentation: "transparentModal",
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="joinQueueTypeModal"
        options={{
          presentation: "transparentModal",
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="appointmentFilter"
        options={{
          presentation: "transparentModal",
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="singleJoinModal"
        options={{
          presentation: "transparentModal",
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="groupAddMemberModal"
        options={{
          presentation: "transparentModal",
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="groupHostMemberModal"
        options={{
          presentation: "transparentModal",
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="groupJoinModal"
        options={{
          presentation: "transparentModal",
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="appointmentCalenderModal"
        options={{
          presentation: "transparentModal",
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="editAppointmentCalenderModal"
        options={{
          presentation: "transparentModal",
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="appointmentSuccessPage"
        options={{
          presentation: "card",
          animation: "default",
        }}
      />

      <Stack.Screen
        name="appointmentPop"
        options={{
          presentation: "transparentModal",
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="appointmentpopup"
        options={{
          presentation: "transparentModal",
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="editAppointmentCalender"
        options={{
          presentation: "card",
        }}
      />
      {/* editAppointmentCalender */}
    </Stack>
  );
};

export default ProtectedLayout;

const styles = StyleSheet.create({});
