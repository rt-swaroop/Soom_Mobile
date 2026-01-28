import React, { useEffect, useRef, useMemo } from "react";

import { View, Image, Animated, Easing, StatusBar } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { useAppTheme } from "../../../theme/useAppTheme";
import { createStyles } from "./Launcher.styles";
import { IMAGES } from "../../../assets/images";

const LauncherScreen = () => {
    const { theme, isDark } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                friction: 8,
                tension: 40,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <LinearGradient
            colors={[theme.gradientStart, theme.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <View style={styles.logoContainer}>
                <Animated.View
                    style={[
                        styles.pulseCircle,
                        {
                            opacity: pulseAnim.interpolate({
                                inputRange: [1, 1.2],
                                outputRange: [0.3, 0],
                            }),
                            transform: [{ scale: pulseAnim }],
                        },
                    ]}
                />

                <Animated.View
                    style={{
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim,
                    }}
                >
                    <Image
                        source={isDark ? IMAGES.appLogo : IMAGES.appLogoDark}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>
            </View>

            <Animated.View style={[styles.loaderContainer, { opacity: opacityAnim }]}>
                <View style={{ height: 2, width: 100, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 1, overflow: 'hidden' }}>
                    <Animated.View
                        style={{
                            height: '100%',
                            width: '40%',
                            backgroundColor: '#fff',
                            transform: [{
                                translateX: pulseAnim.interpolate({
                                    inputRange: [1, 1.2],
                                    outputRange: [-40, 100]
                                })
                            }]
                        }}
                    />
                </View>
                <Animated.Text style={styles.loaderText}>Initializing</Animated.Text>
            </Animated.View>
        </LinearGradient>
    );
};

export default LauncherScreen;
