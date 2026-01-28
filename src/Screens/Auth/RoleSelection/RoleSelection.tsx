import React, { useEffect, useRef, useMemo } from "react";
import { useDispatch } from "react-redux";

import { View, Text, TouchableOpacity, SafeAreaView, Animated, StatusBar } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { showMessage } from "react-native-flash-message";

import { createStyles } from "./RoleSelection.styles";
import { COLORS } from "../../../theme/colors";
import { ROUTES } from "../../../navigation/routes";
import { RootStackParamList } from "../../../navigation/AppNavigator";

import { logoutUser } from "../../../redux/reducers/authReducer";
import { useAppTheme } from "../../../theme/useAppTheme";

const RoleSelectionScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const { theme, isDark } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleRoleSelect = (roleType: 'admin' | 'user') => {
        if (roleType === 'admin') {
            showMessage({
                message: "Coming Soon",
                description: "The Company Admin module is currently under development.",
                type: "info",
                icon: "info",
                backgroundColor: COLORS.primary,
            });
            return;
        }

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: ROUTES.HOME }],
            })
        );
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: ROUTES.GET_STARTED }],
            })
        );
    };

    return (
        <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            <View style={styles.backgroundDecoration} />
            <View style={styles.backgroundDecorationBottom} />

            <SafeAreaView style={styles.safeArea}>
                <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.headerSection}>
                        <View style={styles.iconCircle}>
                            <Icon name="supervisor-account" size={50} color={theme.text} />
                        </View>
                        <Text style={styles.title}>Explore as...</Text>
                        <Text style={styles.subtitle}>
                            Select your workspace profile to personalize your experience
                        </Text>
                    </View>

                    <View style={styles.selectionContainer}>
                        <TouchableOpacity
                            onPress={() => handleRoleSelect('admin')}
                            activeOpacity={0.85}
                            style={{ width: '100%' }}
                        >
                            <LinearGradient
                                colors={theme.glassCardGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.card}
                            >
                                <View style={styles.iconWrapper}>
                                    <Icon name="admin-panel-settings" size={30} color={COLORS.primary} />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>Company Admin</Text>
                                    <Text style={styles.cardDescription}>Oversee operations, track attendance, and generate reports.</Text>
                                </View>
                                <View style={styles.goIconWrapper}>
                                    <Icon name="arrow-forward" size={20} color={theme.textSecondary} />
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleRoleSelect('user')}
                            activeOpacity={0.85}
                            style={{ width: '100%' }}
                        >
                            <LinearGradient
                                colors={theme.glassCardGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.card}
                            >
                                <View style={styles.iconWrapper}>
                                    <Icon name="person-outline" size={30} color={COLORS.green1} />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>Employee Portal</Text>
                                    <Text style={styles.cardDescription}>Log your attendance, view shifts, and manage leave requests.</Text>
                                </View>
                                <View style={styles.goIconWrapper}>
                                    <Icon name="arrow-forward" size={20} color={theme.textSecondary} />
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
                        <Icon name="power-settings-new" size={20} color={theme.text} />
                        <Text style={styles.logoutBtnText}>Switch Account</Text>
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default RoleSelectionScreen;
