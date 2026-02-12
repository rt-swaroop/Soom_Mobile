import React, { useEffect, useState, useMemo, useCallback } from "react";

import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl, Modal, TextInput, Linking, ScrollView, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import { useAppTheme } from "../../../theme/useAppTheme";
import { COLORS } from "../../../theme/colors";

import { selectUser } from "../../../redux/selector";

import { createStyles } from "./AdminEmployees.styles";
import { IMAGES } from "../../../assets/images";

import { getUsersList } from "../../../services/adminServices";
import AdminEmployeesSkeleton from "../../../components/Skeleton/AdminEmployeesSkeleton";

interface DetailItemProps {
    label: string;
    value: string;
    styles: any;
}

const DetailItem = ({ label, value, styles }: DetailItemProps) => (
    <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue} numberOfLines={1}>{value || 'N/A'}</Text>
    </View>
);

const AdminEmployees = () => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const user = useSelector(selectUser);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [employees, setEmployees] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("Active");

    const fetchData = useCallback(async () => {
        if (!user?.companyId) return;

        try {
            const companyId = typeof user.companyId === 'object' ? user.companyId._id : user.companyId;
            const response = await getUsersList(companyId);
            if (response.success) {
                setEmployees(response.data || []);
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const filteredEmployees = useMemo(() => {
        const isTabActive = activeTab === "Active";
        return employees.filter(emp => {
            const matchesTab = isTabActive ? emp.isActive : !emp.isActive;
            const matchesSearch = emp.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.officeInformation?.employeeCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.designation?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.workEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.personalEmail?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTab && matchesSearch;
        }).sort((a, b) => {
            const codeA = a.officeInformation?.employeeCode || '';
            const codeB = b.officeInformation?.employeeCode || '';
            return codeA.localeCompare(codeB, undefined, { numeric: true, sensitivity: 'base' });
        });
    }, [employees, searchQuery, activeTab]);

    const renderEmployee = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.employeeCard}
            onPress={() => setSelectedEmployee(item)}
            activeOpacity={0.7}
            delayPressIn={0}
        >
            <Image
                source={item.profilePic?.location ? { uri: item.profilePic.location } : IMAGES.user}
                style={styles.avatar}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.fullName}</Text>
                <View style={styles.roleContainer}>
                    <Text style={styles.roleText}>{item.designation?.name || item.role?.replace('-', ' ').toUpperCase() || 'EMPLOYEE'}</Text>
                </View>
                <View style={styles.officeBadge}>
                    <Icon name="badge" size={14} color={COLORS.primary} />
                    <Text style={styles.officeText}>{item.officeInformation?.employeeCode || 'N/A'}</Text>
                </View>
            </View>
            <View style={[styles.statusDot, item.isActive ? styles.statusDotActive : styles.statusDotInactive]} />
            <Icon name="chevron-right" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
    );


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === "Active" && styles.activeTab]}
                        onPress={() => setActiveTab("Active")}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={[styles.tabText, activeTab === "Active" && styles.activeTabText]}>Active</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === "Inactive" && styles.activeTab]}
                        onPress={() => setActiveTab("Inactive")}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={[styles.tabText, activeTab === "Inactive" && styles.activeTabText]}>Inactive</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <Icon name="search" size={20} color={theme.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search name, code, or role..."
                        placeholderTextColor={theme.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSearchQuery("")}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Icon name="cancel" size={20} color={theme.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {loading && !refreshing ? (
                <AdminEmployeesSkeleton />
            ) : (
                <FlatList
                    data={filteredEmployees}
                    renderItem={renderEmployee}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.listContent}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon name="people-outline" size={60} color={theme.textSecondary} style={styles.emptyIcon} />
                            <Text style={styles.emptyText}>
                                No employees found
                            </Text>
                        </View>
                    }
                />
            )}

            <Modal
                visible={!!selectedEmployee}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedEmployee(null)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.modalOverlayTouch}
                        activeOpacity={1}
                        onPress={() => setSelectedEmployee(null)}
                    />
                    <View style={styles.modalContent}>
                        <View style={styles.dragHandleContainer}>
                            <View style={styles.dragHandle} />
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.modalHeader}>
                                <Image
                                    source={selectedEmployee?.profilePic?.location ? { uri: selectedEmployee.profilePic.location } : IMAGES.user}
                                    style={styles.modalAvatar}
                                />
                                <Text style={styles.modalName}>{selectedEmployee?.fullName}</Text>
                                <Text style={styles.modalRole}>
                                    {selectedEmployee?.designation?.name || selectedEmployee?.role?.replace('-', ' ').toUpperCase() || 'EMPLOYEE'} • {selectedEmployee?.department?.name || selectedEmployee?.officeInformation?.department?.departmentName || 'No Dept'}
                                </Text>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Office Information</Text>
                                <View style={styles.detailGrid}>
                                    <DetailItem styles={styles} label="Employee Code" value={selectedEmployee?.officeInformation?.employeeCode} />
                                    <DetailItem styles={styles} label="Hire Date" value={selectedEmployee?.officeInformation?.hireDate ? dayjs(selectedEmployee.officeInformation.hireDate).format('DD MMM, YYYY') : 'N/A'} />
                                    <DetailItem styles={styles} label="Employee Type" value={selectedEmployee?.officeInformation?.employeeType} />
                                    <DetailItem styles={styles} label="Shift" value={selectedEmployee?.officeInformation?.shiftData?.name} />
                                    <DetailItem styles={styles} label="Work Location" value={selectedEmployee?.officeInformation?.location?.name} />
                                    <DetailItem styles={styles} label="Account Status" value={selectedEmployee?.isActive ? 'Active' : 'Inactive'} />
                                    <DetailItem styles={styles} label="Current Activity" value={selectedEmployee?.currentStatus || 'Unknown'} />
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Personal Details</Text>
                                <View style={styles.detailGrid}>
                                    <DetailItem styles={styles} label="Gender" value={selectedEmployee?.userInformation?.Gender} />
                                    <DetailItem styles={styles} label="Date of Birth" value={selectedEmployee?.userInformation?.dateOfBirth ? dayjs(selectedEmployee.userInformation.dateOfBirth).format('DD MMM, YYYY') : 'N/A'} />
                                    <DetailItem styles={styles} label="Blood Group" value={selectedEmployee?.userInformation?.bloodGroup} />
                                </View>
                                <View style={styles.addressBox}>
                                    <Text style={styles.detailLabel}>Home Address</Text>
                                    <Text style={styles.addressText}>
                                        {selectedEmployee?.userInformation?.userAddress || 'No address provided'}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Emergency Contact</Text>
                                <View style={styles.emergencyCard}>
                                    <View style={styles.emergencyIcon}>
                                        <Icon name="emergency" size={24} color="#FF5252" />
                                    </View>
                                    <View style={styles.emergencyInfo}>
                                        <Text style={styles.emergencyName}>{selectedEmployee?.userInformation?.emergencyContactName || 'N/A'}</Text>
                                        <Text style={styles.emergencyRelation}>{selectedEmployee?.userInformation?.emergencyContactRelation || 'Contact'}</Text>
                                    </View>
                                    {selectedEmployee?.userInformation?.emergencyContactNumber && (
                                        <TouchableOpacity
                                            onPress={() => Linking.openURL(`tel:${selectedEmployee.userInformation.emergencyContactNumber}`)}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                            <Icon name="call" size={24} color="#FF5252" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            {selectedEmployee?.educationInformation?.qualification?.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Education</Text>
                                    {selectedEmployee.educationInformation.qualification.map((edu: any, index: number) => (
                                        <View key={index} style={styles.educationItem}>
                                            <View style={styles.eduIconBox}>
                                                <Icon name="school" size={20} color={COLORS.primary} />
                                            </View>
                                            <View style={styles.eduContent}>
                                                <Text style={styles.eduTitle}>{edu.educationQualification}</Text>
                                                <Text style={styles.eduInstitution}>{edu.nameOfInstitution}</Text>
                                                <View style={styles.eduFooter}>
                                                    <Text style={styles.eduYear}>Graduated in {edu.yearOfPassing}</Text>
                                                    <Text style={styles.eduPercent}>{edu.percentage}%</Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {selectedEmployee?.officeInformation?.previousWorkExperience?.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Work Experience</Text>
                                    {selectedEmployee.officeInformation.previousWorkExperience.map((exp: any, index: number) => (
                                        <View key={index} style={styles.experienceCard}>
                                            <View style={styles.expHeader}>
                                                <Text style={styles.expTitle}>{exp.designation}</Text>
                                                <Text style={styles.expDate}>{exp.noOfYears} Years</Text>
                                            </View>
                                            <Text style={styles.expCompany}>{exp.companyName}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Contact Directory</Text>
                                <TouchableOpacity
                                    style={styles.contactRow}
                                    onPress={() => Linking.openURL(`mailto:${selectedEmployee?.workEmail}`)}
                                >
                                    <View style={styles.contactIcon}>
                                        <Icon name="work" size={20} color={COLORS.primary} />
                                    </View>
                                    <View style={styles.contactInfo}>
                                        <Text style={styles.detailLabel}>Work Email</Text>
                                        <Text style={styles.detailValue}>{selectedEmployee?.workEmail || 'N/A'}</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.contactRow}
                                    onPress={() => Linking.openURL(`mailto:${selectedEmployee?.personalEmail}`)}
                                >
                                    <View style={styles.contactIcon}>
                                        <Icon name="email" size={20} color={COLORS.primary} />
                                    </View>
                                    <View style={styles.contactInfo}>
                                        <Text style={styles.detailLabel}>Personal Email</Text>
                                        <Text style={styles.detailValue}>{selectedEmployee?.personalEmail || 'N/A'}</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.contactRow}
                                    onPress={() => Linking.openURL(`tel:${selectedEmployee?.mobileNumber}`)}
                                >
                                    <View style={styles.contactIcon}>
                                        <Icon name="phone" size={20} color={COLORS.primary} />
                                    </View>
                                    <View style={styles.contactInfo}>
                                        <Text style={styles.detailLabel}>Mobile Number</Text>
                                        <Text style={styles.detailValue}>{selectedEmployee?.mobileNumber || 'N/A'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.actionRow}>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.callBtn]}
                                    onPress={() => Linking.openURL(`tel:${selectedEmployee?.mobileNumber}`)}
                                >
                                    <Icon name="call" size={20} color={COLORS.white} />
                                    <Text style={styles.actionBtnText}>Call Employee</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.emailBtn]}
                                    onPress={() => Linking.openURL(`mailto:${selectedEmployee?.workEmail}`)}
                                >
                                    <Icon name="email" size={20} color={COLORS.white} />
                                    <Text style={styles.actionBtnText}>Email Work</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    );
};

export default AdminEmployees;