import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch } from 'react-redux';

import DeviceInfo from "react-native-device-info";
import { CommonActions, useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator, Switch, useColorScheme, Animated, KeyboardAvoidingView, Platform } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import * as Keychain from "react-native-keychain";

import { createStyles } from "./Login.styles";
import { COLORS, lightTheme, darkTheme } from "../../../theme/colors";
import { IMAGES } from "../../../assets/images";
import { ROLES } from "../../../utils/constants";

import type { RootStackParamList } from "../../../navigation/AppNavigator";
import { ROUTES } from "../../../navigation/routes";

import { setUser } from '../../../redux/reducers/authReducer'

import { loginUser } from '../../../services/authServices'

const LoginScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const scheme = useColorScheme();
    const theme = scheme === 'dark' ? darkTheme : lightTheme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [companyCode, setCompanyCode] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [loading, setLoading] = useState(false);

    const appVersion = DeviceInfo.getVersion();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        loadSavedCredentials();
        startEntranceAnimation();
    }, []);

    const startEntranceAnimation = () => {
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
    };

    const loadSavedCredentials = async () => {
        try {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                setUserEmail(credentials.username);
                setPassword(credentials.password);
            }
        } catch (err) {
            console.log("Error loading saved credentials:", err);
        }
    };

    const handleLogin = async () => {
        if (!companyCode) {
            showMessage({ message: 'Company Code is required', type: 'danger' });
            return;
        }
        if (!userEmail) {
            showMessage({ message: 'Email is required', type: 'danger' });
            return;
        }
        if (!password) {
            showMessage({ message: 'Password is required', type: 'danger' });
            return;
        }

        try {
            setLoading(true);
            const data = { companyCode, userEmail, password, deviceType: 'mobile' };
            const response = await loginUser(data);

            showMessage({
                message: "Login Successful",
                description: `Welcome back! ${response?.data?.user?.firstName}.`,
                type: "success",
            });

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

            const targetRoute = response.data.user.role === ROLES.COMPANY_ADMIN
                ? ROUTES.ROLE_SELECTION
                : ROUTES.HOME;

            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: targetRoute }],
                })
            );

        } catch (err: any) {
            console.log('Login error catch block:', err);
            showMessage({
                message: err.msg || 'Login failed. Please try again.',
                type: 'danger',
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
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
                        <Image source={scheme === 'dark' ? IMAGES.appLogo : IMAGES.appLogoDark} style={styles.logo} resizeMode="contain" />
                    </Animated.View>

                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: '100%' }}>
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
                                            <Icon name="login" size={20} color={COLORS.white} />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </LinearGradient>
                    </Animated.View>

                </View>
            </KeyboardAvoidingView>

            <Text style={styles.versionText}>v{appVersion}</Text>
            <FlashMessage position="top" />
        </LinearGradient>
    );
};

export default LoginScreen;