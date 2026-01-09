import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Modal from "react-native-modal";

import { styles } from "./Profile.styles";
import { COLORS } from "../../../theme/colors";
import { ROUTES } from "../../../navigation/routes";
import { IMAGES } from "../../../assets/images/index";
import { RootStackParamList } from "../../../navigation/AppNavigator";

import { logoutUser } from '../../../redux/reducers/authReducer'
import { selectUser } from '../../../redux/selector'

import CollapsibleSection from "./components/CollapsibleSection";

const ProfileScreen = () => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);

    const user = useSelector(selectUser);

    const dispatch = useDispatch();

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleLogout = async () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = async () => {
        try {
            dispatch(logoutUser());
            navigation.replace(ROUTES.GET_STARTED);

        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setShowLogoutModal(false);
        }
    }

    return (
        <>
            <ScrollView style={styles.container}>
                <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
                    <TouchableOpacity onPress={() => setShowImageModal(true)} activeOpacity={0.8}>
                        <Image source={user?.profilePic?.location ? { uri: user?.profilePic?.location } : IMAGES.user} style={styles.profilePic} />
                    </TouchableOpacity>
                    <Text style={styles.name}>{user?.fullName}</Text>
                    <Text style={styles.email}>{user?.workEmail}</Text>
                </LinearGradient>

                <CollapsibleSection title="Personal Information">
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mobile Number</Text>
                        <Text style={styles.infoValue}>{user?.mobileNumber}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Personal Email</Text>
                        <Text style={styles.infoValue}>{user?.personalEmail}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Date of Birth</Text>
                        <Text style={styles.infoValue}>
                            {user?.userInformation?.dateOfBirth
                                ? new Date(user.userInformation.dateOfBirth).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })
                                : ''}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Blood Group</Text>
                        <Text style={styles.infoValue}>{user?.userInformation?.bloodGroup}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Address</Text>
                        <Text style={styles.infoValue}>
                            {`${user?.userInformation?.city ?? ''}, ${user?.userInformation?.state ?? ''}, ${user?.userInformation?.country ?? ''}`}
                        </Text>
                    </View>
                </CollapsibleSection>

                <CollapsibleSection title="Work Information">
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Employee ID</Text>
                        <Text style={styles.infoValue}>{user?.officeInformation?.employeeCode}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Role</Text>
                        <Text style={styles.infoValue}>{user?.officeInformation?.jobTitle}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Department</Text>
                        <Text style={styles.infoValue}>{user?.department?.name}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Hire Date</Text>
                        <Text style={styles.infoValue}>
                            {user?.officeInformation?.hireDate
                                ? new Date(user?.officeInformation?.hireDate).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })
                                : ''}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Location</Text>
                        <Text style={styles.infoValue}>{user?.officeInformation?.location?.name}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Shift</Text>
                        <Text style={styles.infoValue}>{user?.officeInformation?.shiftData?.name}</Text>
                    </View>
                </CollapsibleSection>

                <View style={styles.section}>
                    <TouchableOpacity style={styles.optionRow}>
                        <Text style={styles.optionText}>Change Password</Text>
                        <Icon name="chevron-right" size={24} color={COLORS.gray} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionRow}>
                        <Text style={styles.optionText}>Settings</Text>
                        <Icon name="chevron-right" size={24} color={COLORS.gray} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
                <Modal
                    isVisible={showLogoutModal}
                    onBackdropPress={() => setShowLogoutModal(false)}
                    backdropOpacity={0.5}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Confirm Logout</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: COLORS.gray }]}
                                onPress={() => setShowLogoutModal(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: COLORS.primary }]}
                                onPress={confirmLogout}
                            >
                                <Text style={styles.buttonText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    isVisible={showImageModal}
                    onBackdropPress={() => setShowImageModal(false)}
                    backdropOpacity={0.9}
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    style={{ margin: 0, justifyContent: 'center', alignItems: 'center' }}
                >
                    <View style={{ flex: 1, width: '100%', backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{ position: 'absolute', top: 50, right: 20, zIndex: 10 }}
                            onPress={() => setShowImageModal(false)}
                        >
                            <Icon name="close" size={32} color={COLORS.white} />
                        </TouchableOpacity>

                        <Image
                            source={user?.profilePic?.location ? { uri: user?.profilePic?.location } : IMAGES.user}
                            style={{ width: '100%', height: '80%', resizeMode: 'contain' }}
                        />
                    </View>
                </Modal>

            </ScrollView>
        </>
    );
};

export default ProfileScreen;