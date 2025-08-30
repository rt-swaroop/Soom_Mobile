import React, { useState } from "react";

import DeviceInfo from "react-native-device-info";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, View, Image } from "react-native";

import { styles } from "./Login.styles";
import { COLORS } from "../../theme/colors";
import { IMAGES } from "../../assets/images";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { ROUTES } from "../../navigation/routes";

const LoginScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [companyCode, setCompanyCode] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const appVersion = DeviceInfo.getVersion();

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

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(ROUTES.HOME)}>
                    <LinearGradient
                        colors={[COLORS.red1, COLORS.red2]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version {appVersion}</Text>

            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

export default LoginScreen;