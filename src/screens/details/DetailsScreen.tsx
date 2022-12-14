/* eslint-disable react-native/no-unused-styles */
import React, { useCallback } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontStyles } from "shared/styles/fonts";
import { InterText } from "@shared-components/inter-text/InterText";
import Icon from "react-native-dynamic-vector-icons";
import LinearGradient from "react-native-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import { ERoomStatus, Room } from "types/room";
import { COLORS, SCREENS } from "@shared-constants";
import { Tag } from "@shared-components/tag/InterText";
import { ScheduleBar } from "@shared-components/schedule-bar/ScheduleBar";
import {
  BUTTON_POSITION_STYLES,
  InteractiveMap,
} from "@shared-components/interactive-map/InteractiveMap";
import { useRooms } from "api/useRooms";
import { arrayUpsert } from "utils/array";
import { StatusButton } from "@shared-components/status-button/StatusButton";
import { useUser } from "api/useUser";

const buttonStyles = (pressed: boolean) =>
  StyleSheet.create({
    button: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: pressed ? "#D3E2E5" : "#DEE9EB",
      borderRadius: 9999,
    },
  });

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.TEXT,
  },
  scheduleAnnotation: {
    fontSize: 10,
    fontWeight: "500",
    color: "#B9B9B9",
  },
});

export const DetailsScreen: React.FC<any> = ({ navigation, route }) => {
  const { roomId } = route.params;
  const { user } = useUser();
  const { rooms, mutate } = useRooms();
  const room = rooms.find((x) => x.id === roomId);

  let statusText = "Idle";
  let tagColor = "blue";

  switch (room!.status) {
    case ERoomStatus.ON:
      statusText = "On";
      tagColor = "green";
      break;
    case ERoomStatus.SHUTOFF:
      statusText = "Off";
      tagColor = "red";
      break;
    default:
      break;
  }

  const handleChangeState = useCallback(() => {
    if (room!.status === ERoomStatus.ON) {
      mutate((r) => arrayUpsert(r, { ...room!, status: ERoomStatus.IDLE })!);
    } else {
      mutate((r) => arrayUpsert(r, { ...room!, status: ERoomStatus.ON })!);
    }
  }, [mutate, room]);

  const getRoomMode = (room: Room, check: string) =>
    room.id === check
      ? room.status === ERoomStatus.ON
        ? "Active"
        : "Off"
      : "Transparent";

  const toggleRoomMode = (room: Room) => () =>
    mutate(
      (r) =>
        arrayUpsert(r, {
          ...room,
          status:
            room.status === ERoomStatus.ON ? ERoomStatus.IDLE : ERoomStatus.ON,
        })!,
    );
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ScrollView style={{ overflow: "visible" }}>
        <View style={{ padding: 32 }}>
          {/* ==================== Your room ==================== */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable
                onPress={() => navigation.navigate(SCREENS.DASHBOARD)}
                style={{ paddingRight: 12 }}
              >
                <Icon type="Feather" name="arrow-left" color="#333" />
              </Pressable>
              <InterText style={fontStyles.h2}>Your {room!.name}</InterText>
              <Tag
                name={statusText}
                color={tagColor as any}
                style={{ marginLeft: 8 }}
              />
              <View style={{ flex: 1 }} />
              <Pressable
                onPress={handleChangeState}
                style={({ pressed }) => buttonStyles(pressed).button}
              >
                <InterText style={styles.buttonText}>
                  {room!.status === ERoomStatus.ON && "Mark as idle"}
                  {room!.status === ERoomStatus.IDLE && "Force on"}
                  {room!.status === ERoomStatus.SHUTOFF && "Force on"}
                </InterText>
              </Pressable>
            </View>
            <InterText style={fontStyles.subtitle}>
              {room!.status === ERoomStatus.IDLE && (
                <>10 kWh per day, currently {statusText.toLowerCase()} </>
              )}
              {room!.status !== ERoomStatus.IDLE && (
                <>16 kWh per day, currently {statusText.toLowerCase()} </>
              )}
            </InterText>

            <LinearGradient
              colors={["#E6E7F2", "#EBECF8"]}
              useAngle={true}
              angle={140}
              style={{
                marginTop: 24,
                marginHorizontal: -16,
                paddingHorizontal: 16,
                paddingVertical: 32,
                borderRadius: 13,
              }}
            >
              <View style={{ position: "relative" }}>
                <InteractiveMap
                  bathroom={getRoomMode(room!, "bathroom")}
                  kitchen={getRoomMode(room!, "kitchen")}
                  bedroom={getRoomMode(room!, "bedroom")}
                  livingroom={getRoomMode(room!, "livingroom")}
                  office={getRoomMode(room!, "office")}
                />
                <StatusButton
                  status={room!.status}
                  style={(BUTTON_POSITION_STYLES as any)[room!.id]}
                  onPress={toggleRoomMode(room!)}
                />
              </View>
            </LinearGradient>
          </View>

          {/* ==================== Your Energy consumption ==================== */}
          <View style={{ marginTop: 32 }}>
            <InterText style={fontStyles.h3}>
              Your energy consumption today
            </InterText>

            <Image
              source={
                room!.status === ERoomStatus.ON
                  ? require("../../assets/images/chart-1.png")
                  : require("../../assets/images/chart.png")
              }
              style={{ width: "100%", height: 100, marginTop: 12 }}
              resizeMode="contain"
            />
          </View>

          {/* ==================== Automated idle schedule ==================== */}
          <View style={{ marginTop: 32 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <InterText style={fontStyles.h3}>
                Automated idle schedule
              </InterText>
              <View style={{ flex: 1 }} />
              <Pressable style={({ pressed }) => buttonStyles(pressed).button}>
                <InterText style={styles.buttonText}>Edit</InterText>
              </Pressable>
            </View>

            <ScheduleBar
              style={{ marginTop: 24 }}
              schedules={room!.schedules}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 12,
              }}
            >
              <InterText style={styles.scheduleAnnotation}>0AM</InterText>
              <InterText style={styles.scheduleAnnotation}>6AM</InterText>
              <InterText style={styles.scheduleAnnotation}>12AM</InterText>
              <InterText style={styles.scheduleAnnotation}>6PM</InterText>
              <InterText style={styles.scheduleAnnotation}>12PM</InterText>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
