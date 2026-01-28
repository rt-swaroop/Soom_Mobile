import React, { useEffect, useRef } from "react";

import { View, Text, TouchableOpacity, Animated } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";

import { styles } from "./CustomAlert.styles";

interface CustomAlertProps {
    visible: boolean;
    title?: string;
    message: string;
    type?: "success" | "danger" | "warning" | "info";
    onClose: () => void;
    duration?: number;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
    visible,
    title,
    message,
    type = "success",
    onClose,
    duration = 3000
}) => {
    const translateY = useRef(new Animated.Value(-150)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                speed: 12,
                bounciness: 5,
            }).start();

            const timer = setTimeout(() => {
                hideAlert();
            }, duration);

            return () => clearTimeout(timer);
        } else {
            hideAlert();
        }
    }, [visible]);

    const hideAlert = () => {
        Animated.timing(translateY, {
            toValue: -150,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            if (visible) onClose();
        });
    };

    if (!visible && (translateY as any)._value <= -140) return null;

    const getGradientColors = () => {
        switch (type) {
            case "success": return ["#4CAF50", "#2E7D32"];
            case "danger": return ["#FF5252", "#D32F2F"];
            case "warning": return ["#FFB74D", "#F57C00"];
            case "info": return ["#448AFF", "#1976D2"];
            default: return ["#4CAF50", "#2E7D32"];
        }
    };

    const getIconName = () => {
        switch (type) {
            case "success": return "check-circle";
            case "danger": return "error";
            case "warning": return "warning";
            case "info": return "info";
            default: return "check-circle";
        }
    };

    const defaultTitle = type.charAt(0).toUpperCase() + type.slice(1);

    return (
        <View pointerEvents="box-none" style={styles.container}>
            <Animated.View style={{ transform: [{ translateY }] }}>
                <LinearGradient
                    colors={getGradientColors()}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.alertContainer}
                >
                    <View style={styles.iconContainer}>
                        <Icon name={getIconName()} size={24} color="#FFF" />
                    </View>

                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>{title || defaultTitle}</Text>
                        <Text style={styles.message}>{message}</Text>
                    </View>

                    <TouchableOpacity onPress={hideAlert} style={styles.closeButton}>
                        <Icon name="close" size={20} color="rgba(255,255,255,0.8)" />
                    </TouchableOpacity>
                </LinearGradient>
            </Animated.View>
        </View>
    );
};

export default CustomAlert;