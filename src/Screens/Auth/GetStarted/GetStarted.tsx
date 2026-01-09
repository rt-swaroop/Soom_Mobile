import React, { useEffect, useRef, useMemo } from "react";
import { View, Text, TouchableOpacity, Image, Animated, useColorScheme } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { createStyles } from './GetStarted.styles';
import { IMAGES } from "../../../assets/images";
import { COLORS, lightTheme, darkTheme } from "../../../theme/colors";
import { ROUTES } from "../../../navigation/routes";
import { RootStackParamList } from "../../../navigation/AppNavigator";

const GetStartedScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const scheme = useColorScheme();
    const theme = scheme === 'dark' ? darkTheme : lightTheme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const cardScale = useRef(new Animated.Value(0.95)).current;

    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(cardScale, {
                toValue: 1,
                friction: 7,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                })
            ])
        ).start();

    }, []);

    return (
        <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>

            <View style={styles.topDecoration} />
            <View style={styles.bottomDecoration} />
            <View style={styles.midDecoration} />

            <View style={styles.contentContainer}>

                <Animated.View
                    style={[
                        styles.imageContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <Image source={IMAGES.getStarted} style={styles.image} resizeMode="contain" />
                </Animated.View>

                <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: cardScale }], width: '100%' }}>
                    <LinearGradient colors={theme.glassCardGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.glassCard}>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>SOOM</Text>
                            <Text style={styles.subtitle}>Smart Operational Office Management</Text>
                            <Text style={styles.description}>Experience the future of workplace efficiency. Seamlessly manage attendance, shifts, and requests.</Text>
                        </View>

                        <Animated.View style={{ transform: [{ scale: pulseAnim }], width: '100%' }}>
                            <TouchableOpacity style={styles.button} activeOpacity={0.85}
                                onPress={() => navigation.navigate(ROUTES.LOGIN)}
                            >
                                <LinearGradient colors={[COLORS.accent, '#bf360c']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.buttonGradient}>
                                    <Text style={styles.buttonText}>Get Started</Text>
                                    <Icon name="arrow-forward" size={20} color={COLORS.white} />
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    </LinearGradient>
                </Animated.View>

            </View>
        </LinearGradient>
    );
};

export default GetStartedScreen;