import React, { useState } from "react";
import { useDispatch } from 'react-redux';

import DeviceInfo from "react-native-device-info";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, View, Image, ActivityIndicator } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";

import { styles } from "./Login.styles";
import { COLORS } from "../../theme/colors";
import { IMAGES } from "../../assets/images";

import type { RootStackParamList } from "../../navigation/AppNavigator";
import { ROUTES } from "../../navigation/routes";

import { setUser } from '../../redux/reducers/authReducer'

import { loginUser } from '../../services/authServices'
import store from "../../redux/store";

const LoginScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [companyCode, setCompanyCode] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const appVersion = DeviceInfo.getVersion();

    const dispatch = useDispatch();

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
            console.log("data", data)
            const response = await loginUser(data);

            console.log("response", response)

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

            console.log("Redux state after login:", store.getState().auth);

            navigation.navigate(ROUTES.HOME);

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
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={IMAGES.appLogo} style={styles.logo} resizeMode="contain" />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.innerContainer}
            >
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Log in to continue</Text>

                <View style={styles.inputContainer}>
                    <Icon name="business" size={20} color={COLORS.gray} style={styles.icon} />
                    <TextInput
                        placeholder="Company Code"
                        placeholderTextColor={COLORS.darkGray}
                        style={styles.input}
                        value={companyCode}
                        onChangeText={setCompanyCode}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="email" size={20} color={COLORS.gray} style={styles.icon} />
                    <TextInput
                        placeholder="Work Email"
                        placeholderTextColor={COLORS.darkGray}
                        style={styles.input}
                        value={userEmail}
                        onChangeText={setUserEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color={COLORS.gray} style={styles.icon} />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor={COLORS.darkGray}
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Icon
                            name={showPassword ? "visibility" : "visibility-off"}
                            size={20}
                            color={COLORS.gray}
                            style={styles.eyeIcon}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading} >
                    <LinearGradient
                        colors={[COLORS.red1, COLORS.red2]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color={COLORS.white} />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version {appVersion}</Text>

            </KeyboardAvoidingView>
            <FlashMessage position="top" />
        </LinearGradient>
    );
};

export default LoginScreen;