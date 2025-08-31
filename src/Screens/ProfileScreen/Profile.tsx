import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { styles } from "./Profile.styles";
import { COLORS } from "../../theme/colors";
import { ROUTES } from "../../navigation/routes";
import { IMAGES } from "../../assets/images/index";
import { RootStackParamList } from "../../navigation/AppNavigator";

import { setUser } from '../../redux/reducers/authReducer'
import { selectUser } from '../../redux/selector'

import CollapsibleSection from "./components/CollapsibleSection";

const ProfileScreen = () => {

    const user = useSelector(selectUser);

    console.log("user", user)
    const dispatch = useDispatch();

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleLogout = async () => {

        try {

            dispatch(setUser({ user: null, token: null }));

            navigation.replace(ROUTES.GET_STARTED);

        } catch (error) {
            console.error("Logout error:", error);
        }
    }

    return (
        <ScrollView style={styles.container}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
                <Image source={user?.profilePic?.location ? { uri: user?.profilePic?.location } : IMAGES.user} style={styles.profilePic} />
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
        </ScrollView>
    );
};

export default ProfileScreen;