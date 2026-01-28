import React, { useState, useMemo, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Animated, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, CommonActions } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import DeviceInfo from 'react-native-device-info';

import LogoutModal from "./components/LogoutModal";
import ThemeSelectionModal from "./components/ThemeSelectionModal";
import ImageViewModal from "./components/ImageViewModal";

import { createStyles } from "./Profile.styles";
import { COLORS } from "../../theme/colors";
import { ROUTES } from "../../navigation/routes";
import { IMAGES } from "../../assets/images/index";
import { ROLES } from "../../utils/constants";

import { logoutUser } from '../../redux/reducers/authReducer'
import { selectUser } from '../../redux/selector'
import { useAppTheme } from "../../theme/useAppTheme";

const ProfileScreen = () => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showThemeModal, setShowThemeModal] = useState(false);

    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const workspaceAnim = useRef(new Animated.Value(0)).current;
    const securityAnim = useRef(new Animated.Value(0)).current;
    const logoutAnim = useRef(new Animated.Value(0)).current;
    const footerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(120, [
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(workspaceAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(securityAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(logoutAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(footerAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleLogout = () => setShowLogoutModal(true);

    const confirmLogout = () => {
        dispatch(logoutUser());
        setShowLogoutModal(false);
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: ROUTES.GET_STARTED }],
            })
        );
    }

    const ScaleButton = ({ children, onPress, style, activeOpacity = 0.85 }: any) => {
        const scale = useRef(new Animated.Value(1)).current;

        const handlePressIn = () => {
            Animated.spring(scale, {
                toValue: 0.97,
                useNativeDriver: true,
                speed: 40,
                bounciness: 4,
            }).start();
        };

        const handlePressOut = () => {
            Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
                speed: 40,
                bounciness: 4,
            }).start();
        };

        return (
            <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={activeOpacity} style={style}>
                <Animated.View style={{ transform: [{ scale }], flexDirection: 'row', alignItems: 'center', justifyContent: (StyleSheet.flatten(style) as any)?.justifyContent || 'flex-start', flex: 1 }}>
                    {children}
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <View style={styles.headerBackground} />

            <TouchableOpacity
                style={[styles.backButton, { top: 50 }]}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <Animated.View
                style={[
                    styles.profileHeader,
                    {
                        opacity: fadeAnim,
                        transform: [{
                            translateY: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [15, 0]
                            })
                        }]
                    }
                ]}
                renderToHardwareTextureAndroid={true}
            >
                <TouchableOpacity onPress={() => setShowImageModal(true)} activeOpacity={0.9} style={styles.profilePicContainer}>
                    <Image source={user?.profilePic?.location ? { uri: user?.profilePic?.location } : IMAGES.user} style={styles.profilePic} />
                </TouchableOpacity>
                <Text style={styles.name}>{user?.fullName}</Text>
                <Text style={styles.email}>{user?.workEmail}</Text>
            </Animated.View>

            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <Animated.View
                        style={{
                            opacity: workspaceAnim,
                            transform: [{
                                translateY: workspaceAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0]
                                })
                            }]
                        }}
                        renderToHardwareTextureAndroid={true}
                    >
                        <View style={styles.sectionCard}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleContainer}>
                                    <Icon name="work-outline" size={22} color={COLORS.primary} />
                                    <Text style={styles.sectionTitle}>Profile & Workspace</Text>
                                </View>
                            </View>

                            <ScaleButton style={styles.settingButton} onPress={() => navigation.navigate(ROUTES.PROFILE_DETAILS)} activeOpacity={0.7}>
                                <View style={styles.settingIconWrapper}>
                                    <Icon name="person-outline" size={20} color="#6B7280" />
                                </View>
                                <Text style={styles.settingText}>Profile Details</Text>
                                <Icon name="chevron-right" size={24} color="#D1D5DB" />
                            </ScaleButton>

                            {user?.role === ROLES.COMPANY_ADMIN && (
                                <>
                                    <View style={styles.divider} />
                                    <ScaleButton
                                        style={styles.settingButton}
                                        onPress={() => {
                                            navigation.dispatch(
                                                CommonActions.reset({
                                                    index: 0,
                                                    routes: [{ name: ROUTES.ROLE_SELECTION }],
                                                })
                                            );
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.settingIconWrapper}>
                                            <Icon name="sync" size={20} color={COLORS.primary} />
                                        </View>
                                        <Text style={[styles.settingText, { color: COLORS.primary }]}>Switch Role</Text>
                                        <Icon name="chevron-right" size={24} color={COLORS.primary} />
                                    </ScaleButton>
                                </>
                            )}
                        </View>
                    </Animated.View>

                    <Animated.View
                        style={{
                            opacity: securityAnim,
                            transform: [{
                                translateY: securityAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0]
                                })
                            }]
                        }}
                        renderToHardwareTextureAndroid={true}
                    >
                        <View style={styles.sectionCard}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleContainer}>
                                    <Icon name="security" size={22} color={COLORS.primary} />
                                    <Text style={styles.sectionTitle}>Security</Text>
                                </View>
                            </View>

                            <ScaleButton style={styles.settingButton} activeOpacity={0.7}>
                                <View style={styles.settingIconWrapper}>
                                    <Icon name="lock-outline" size={20} color="#6B7280" />
                                </View>
                                <Text style={styles.settingText}>Change Password</Text>
                                <Icon name="chevron-right" size={24} color="#D1D5DB" />
                            </ScaleButton>
                        </View>
                    </Animated.View>

                    <Animated.View
                        style={{
                            opacity: footerAnim,
                            transform: [{
                                translateY: footerAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0]
                                })
                            }]
                        }}
                        renderToHardwareTextureAndroid={true}
                    >
                        <View style={styles.sectionCard}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleContainer}>
                                    <Icon name="settings" size={22} color={COLORS.primary} />
                                    <Text style={styles.sectionTitle}>Preferences</Text>
                                </View>
                            </View>

                            <ScaleButton
                                style={styles.settingButton}
                                onPress={() => navigation.navigate(ROUTES.NOTIFICATION_PREFERENCES)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.settingIconWrapper}>
                                    <Icon name="notifications-none" size={20} color="#6B7280" />
                                </View>
                                <Text style={styles.settingText}>Notification Preferences</Text>
                                <Icon name="chevron-right" size={24} color="#D1D5DB" />
                            </ScaleButton>

                            <View style={styles.divider} />

                            <ScaleButton style={styles.settingButton} onPress={() => setShowThemeModal(true)} activeOpacity={0.7}>
                                <View style={styles.settingIconWrapper}>
                                    <Icon name="palette" size={20} color="#6B7280" />
                                </View>
                                <Text style={styles.settingText}>App Theme</Text>
                                <Icon name="chevron-right" size={24} color="#D1D5DB" />
                            </ScaleButton>

                            <View style={styles.divider} />

                            <ScaleButton
                                style={styles.settingButton}
                                onPress={() => navigation.navigate(ROUTES.PERMISSION_MANAGER)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.settingIconWrapper}>
                                    <Icon name="verified-user" size={20} color="#6B7280" />
                                </View>
                                <Text style={styles.settingText}>Permission Manager</Text>
                                <Icon name="chevron-right" size={24} color="#D1D5DB" />
                            </ScaleButton>
                        </View>
                    </Animated.View>

                    <Animated.View
                        style={{
                            opacity: logoutAnim,
                            transform: [{
                                translateY: logoutAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0]
                                })
                            }]
                        }}
                        renderToHardwareTextureAndroid={true}
                    >
                        <ScaleButton style={styles.logoutButton} onPress={handleLogout}>
                            <LinearGradient colors={[COLORS.accent, '#ff5757']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.logoutGradient}>
                                <Icon name="logout" size={22} color={COLORS.white} />
                                <Text style={styles.logoutText}>Sign Out</Text>
                            </LinearGradient>
                        </ScaleButton>

                        <View style={styles.footer}>
                            <Text style={styles.versionText}>Version {DeviceInfo.getVersion()} ({DeviceInfo.getBuildNumber()})</Text>
                        </View>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>

            <LogoutModal
                isVisible={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onLogout={confirmLogout}
            />

            <ThemeSelectionModal
                isVisible={showThemeModal}
                onClose={() => setShowThemeModal(false)}
            />

            <ImageViewModal
                isVisible={showImageModal}
                onClose={() => setShowImageModal(false)}
                imageUri={user?.profilePic?.location}
            />
        </View>
    );
};

export default ProfileScreen;