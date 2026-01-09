import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { View, Text, TouchableOpacity, SafeAreaView, Animated, StatusBar } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";

import { styles } from "./RoleSelection.styles";
import { COLORS } from "../../../theme/colors";
import { ROUTES } from "../../../navigation/routes";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { logoutUser } from "../../../redux/reducers/authReducer";

const RoleSelectionScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();

    // Animation values
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
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.backgroundDecoration} />
            <View style={styles.backgroundDecorationBottom} />

            <SafeAreaView style={styles.safeArea}>
                <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.headerSection}>
                        <View style={styles.iconCircle}>
                            <Icon name="supervisor-account" size={50} color={COLORS.white} />
                        </View>
                        <Text style={styles.title}>Explore as...</Text>
                        <Text style={styles.subtitle}>
                            Select your workspace profile to personalize your experience
                        </Text>
                    </View>

                    <View style={styles.selectionContainer}>
                        <TouchableOpacity
                            style={[styles.card, styles.adminAccent]}
                            onPress={() => handleRoleSelect('admin')}
                            activeOpacity={0.85}
                        >
                            <View style={styles.iconWrapper}>
                                <Icon name="admin-panel-settings" size={34} color="#0288D1" />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>Admin Workspace</Text>
                                <Text style={styles.cardDescription}>Oversee operations, track attendance, and generate reports.</Text>
                            </View>
                            <View style={styles.goIconWrapper}>
                                <Icon name="arrow-forward" size={20} color="#64748B" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.card, styles.userAccent]}
                            onPress={() => handleRoleSelect('user')}
                            activeOpacity={0.85}
                        >
                            <View style={styles.iconWrapper}>
                                <Icon name="person-outline" size={34} color="#388E3C" />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>Personal Workspace</Text>
                                <Text style={styles.cardDescription}>Log your attendance, view shifts, and manage leave requests.</Text>
                            </View>
                            <View style={styles.goIconWrapper}>
                                <Icon name="arrow-forward" size={20} color="#64748B" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
                        <Icon name="power-settings-new" size={20} color={COLORS.white} />
                        <Text style={styles.logoutBtnText}>Switch Account</Text>
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default RoleSelectionScreen;
