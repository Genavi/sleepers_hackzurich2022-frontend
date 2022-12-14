import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, View } from "react-native";
import Icon from "react-native-dynamic-vector-icons";
import { COLORS } from "@shared-constants";
import Animated, { Layout, ZoomIn, FadeOutUp } from "react-native-reanimated";

interface NotificationProps {
  variant?: "warning" | "alert" | "celebration";
  title: ReactNode;
  titleAction?: ReactNode;
  description?: ReactNode;
  style?: StyleProp<any>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    color: "#fff",
    padding: 10,
    borderRadius: 12,
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  description: {
    marginTop: 9,
  },
});

export const Notification = ({
  variant = "alert",
  title,
  titleAction,
  description,
  ...rest
}: NotificationProps) => {
  return (
    <Animated.View
      {...rest}
      style={[styles.container, rest.style]}
      layout={Layout.springify().duration(200).damping(15).delay(200)}
      entering={ZoomIn.duration(400)
        .springify()
        .duration(300)
        .damping(14)
        .restSpeedThreshold(0.0001)}
      exiting={FadeOutUp.duration(300)}
    >
      <View style={styles.title}>
        {variant === "alert" && (
          <Icon
            type="Feather"
            name="alert-triangle"
            color={COLORS.FAILURE}
            size={14}
            style={styles.icon}
          />
        )}
        {variant === "celebration" && (
          <Icon
            type="Ionicons"
            name="megaphone-outline"
            color={"#fff"}
            size={14}
            style={styles.icon}
          />
        )}
        {variant === "warning" && (
          <Icon
            type="Feather"
            name="alert-circle"
            size={14}
            color={COLORS.PRIMARY}
            style={styles.icon}
          />
        )}
        {title}
        <View style={{ flex: 1 }} />
        {titleAction}
      </View>
      {description && <View style={styles.description}>{description}</View>}
    </Animated.View>
  );
};
