import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useDispatch } from 'react-redux';

import DeviceInfo from "react-native-device-info";
import { CommonActions, useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator, Switch, Animated, KeyboardAvoidingView, Platform } from "react-native";
import * as Keychain from "react-native-keychain";

import { createStyles } from "./Login.styles";
import { COLORS } from "../../../theme/colors";
import { IMAGES } from "../../../assets/images";
import { ROLES } from "../../../utils/constants";

import type { RootStackParamList } from "../../../navigation/AppNavigator";
import { ROUTES } from "../../../navigation/routes";

import { setUser, setActiveRole } from '../../../redux/reducers/authReducer'

import { loginUser } from '../../../services/authServices'

import CustomAlert from "../../../components/CustomAlert/CustomAlert";
import { useAppTheme } from "../../../theme/useAppTheme";

const LoginScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const { theme, isDark } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [companyCode, setCompanyCode] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [loading, setLoading] = useState(false);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: "",
        message: "",
        type: "success" as "success" | "danger" | "warning" | "info"
    });

    const showAlert = (message: string, type: "success" | "danger" = "success", title?: string) => {
        setAlertConfig({
            title: title || (type === "success" ? "Success" : "Error"),
            message,
            type
        });
        setAlertVisible(true);
    };

    const appVersion = DeviceInfo.getVersion();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    const startEntranceAnimation = useCallback(() => {
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
            })
        ]).start();
    }, [fadeAnim, slideAnim]);

    const loadSavedCredentials = useCallback(async () => {
        try {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                setUserEmail(credentials.username);
                setPassword(credentials.password);
            }
        } catch (err) {
            console.log("Error loading saved credentials:", err);
        }
    }, []);

    useEffect(() => {
        loadSavedCredentials();
        startEntranceAnimation();
    }, [loadSavedCredentials, startEntranceAnimation]);

    const handleLogin = async () => {
        if (!companyCode) {
            showAlert('Company Code is required', 'danger');
            return;
        }
        if (!userEmail) {
            showAlert('Email is required', 'danger');
            return;
        }
        if (!password) {
            showAlert('Password is required', 'danger');
            return;
        }

        try {
            setLoading(true);
            const data = { companyCode, userEmail, password, deviceType: 'mobile' };
            const response = await loginUser(data);

            showAlert(`Welcome back! ${response?.data?.user?.firstName}.`, 'success');

            dispatch(setUser({
                user: response.data.user,
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken
            }));

            if (rememberMe) {
                await Keychain.setGenericPassword(userEmail, password, {
                    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
                });
            } else {
                await Keychain.resetGenericPassword();
            }

            let targetRoute: any = ROUTES.HOME;
            if (response.data.user.role === ROLES.COMPANY_ADMIN) {
                targetRoute = ROUTES.ROLE_SELECTION;
            } else if (response.data.user.role === ROLES.GLOBAL_MANAGER) {
                targetRoute = ROUTES.ADMIN_NAV;
                dispatch(setActiveRole('admin'));
            }

            setTimeout(() => {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: targetRoute }],
                    })
                );
            }, 1000);

        } catch (err: any) {
            console.log('Login error catch block:', err);
            showAlert(err.msg || 'Login failed. Please try again.', 'danger');
            setLoading(false);
        } finally {
            // Do not stop loading on success to keep spinner until navigation
            // setLoading(false); 
        }
    }

    return (
        <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex1}>
                <View style={styles.topDecoration} />
                <View style={styles.bottomDecoration} />
                <View style={styles.midDecoration} />

                <View style={styles.innerContainer}>
                    <Animated.View
                        style={[
                            styles.logoContainer,
                            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                        ]}
                    >
                        <Image source={isDark ? IMAGES.appLogo : IMAGES.appLogoDark} style={styles.logo} resizeMode="contain" />
                    </Animated.View>

                    <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }, styles.animatedView]}>
                        <LinearGradient colors={theme.glassCardGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.glassCard}>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Log in to your account</Text>

                            <View style={styles.inputContainer}>
                                <Icon name="business" size={22} color={theme.iconColor} style={styles.icon} />
                                <TextInput placeholder="Company Code" placeholderTextColor={theme.textSecondary} style={styles.input} autoCapitalize="characters"
                                    value={companyCode}
                                    onChangeText={setCompanyCode}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Icon name="email" size={22} color={theme.iconColor} style={styles.icon} />
                                <TextInput placeholder="Email Address" placeholderTextColor={theme.textSecondary} style={styles.input} autoCapitalize="none"
                                    value={userEmail}
                                    onChangeText={setUserEmail}
                                    keyboardType="email-address"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Icon name="lock" size={22} color={theme.iconColor} style={styles.icon} />
                                <TextInput placeholder="Password" placeholderTextColor={theme.textSecondary} style={styles.input} autoCapitalize="none"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                    <Icon name={showPassword ? "visibility" : "visibility-off"} size={22} color={theme.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.rememberContainer}>
                                <Switch value={rememberMe} onValueChange={setRememberMe} trackColor={{ false: theme.textSecondary, true: COLORS.red1 }} thumbColor={COLORS.white} ios_backgroundColor={theme.textSecondary} />
                                <Text style={styles.rememberText}>Remember Me</Text>
                            </View>

                            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
                                <LinearGradient colors={[COLORS.accent, '#ff5757']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.buttonGradient}>
                                    {loading ? (
                                        <ActivityIndicator size="small" color={COLORS.white} />
                                    ) : (
                                        <>
                                            <Text style={styles.buttonText}>Login</Text>
                                            <Icon name="arrow-forward" size={20} color={COLORS.white} />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </LinearGradient>
                    </Animated.View>

                </View>
            </KeyboardAvoidingView>

            <Text style={styles.versionText}>v{appVersion}</Text>

            <CustomAlert
                visible={alertVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={() => setAlertVisible(false)}
            />
        </LinearGradient>
    );
};

export default LoginScreen;