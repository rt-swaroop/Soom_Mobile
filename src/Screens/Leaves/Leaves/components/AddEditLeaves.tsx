import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { ActivityIndicator, Platform, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import dayjs from 'dayjs';

import { createStyles } from '../Leaves.styles';
import { COLORS } from '../../../../theme/colors';
import { selectUser } from '../../../../redux/selector';
import { useAppTheme } from '../../../../theme/useAppTheme';

import CustomDateRangePicker from '../../../../components/CustomDateRangePicker/CustomDateRangePicker';
import Dropdown from '../../../../components/Dropdown';

import { applyLeave, getLeaveTypes } from '../../../../services/leavesServices';

const AddEditLeaves = (props: any) => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [selectedOption, setSelectedOption] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [noOfDays, setNoOfDays] = useState<number>(0);
    const [contactNumber, setContactNumber] = useState<string>('');
    const [reason, setReason] = useState<string>('');
    const [allLeaveTypes, setAllLeaveTypes] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const user = useSelector(selectUser);

    const navigation = useNavigation<any>();

    const item = props?.route?.params?.item;
    const isEdit = props?.route?.params?.mode === 'edit';
    const isNonEdit = props?.route?.params?.mode === 'non-edit';

    const leaveOptions = allLeaveTypes.map((type: any) => ({
        label: type.leaveTypeName,
        value: type.leaveTypeName,
    }));

    useEffect(() => {
        if ((isEdit || isNonEdit) && item) {
            setSelectedOption(item.leaveType || '');
            setStartDate(item.startDate || '');
            setEndDate(item.endDate || '');
            setNoOfDays(item.noOfDays || 0);
            setContactNumber(item.contactNumber || '');
            setReason(item.reason || '');
        } else if (!isEdit && !isNonEdit) {
            setSelectedOption('');
            setStartDate('');
            setEndDate('');
            setNoOfDays(0);
            setContactNumber('');
            setReason('');
        }
    }, [isEdit, isNonEdit, item]);

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            if (user?.companyId?._id) {
                try {
                    const response = await getLeaveTypes(user.companyId._id);
                    if (response?.leaveTypes) {
                        setAllLeaveTypes(response.leaveTypes);
                    }
                } catch (error) {
                    console.error("Error fetching leave types on mobile:", error);
                }
            }
        };
        fetchLeaveTypes();
    }, [user?.companyId?._id]);

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (end < start) {
                setNoOfDays(0);
            } else {
                const diffInMs = end.getTime() - start.getTime();
                const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;
                setNoOfDays(diffInDays);
            }
        } else {
            setNoOfDays(0);
        }
    }, [startDate, endDate]);

    const handleApplyDates = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
        setStartDate(start.toISOString());
        setEndDate(end.toISOString());
    };

    const handleSubmit = async () => {
        if (!selectedOption || !startDate || !endDate || !contactNumber || !reason) {
            showMessage({
                message: "Validation Error",
                description: "Please fill all required fields for Leave.",
                type: "warning",
                duration: 3000,
            });
            return;
        }

        setLoading(true);

        try {

            const leaveData = {
                ...(isEdit && item?._id ? { leaveId: item._id } : {}),
                leaveType: selectedOption,
                startDate,
                endDate,
                noOfDays,
                contactNumber,
                reason
            }
            await applyLeave(leaveData, user?._id, user?.companyId?._id)

            showMessage({
                message: "Leave Request Submitted",
                description: `Your ${selectedOption} Request has been submitted.`,
                type: "success",
                duration: 3000,
            });

        } catch (error) {
            showMessage({
                message: "Submission Failed",
                description: "Something went wrong. Please try again.",
                type: "danger",
                duration: 4000,
            });
        } finally {
            setLoading(false);
            navigation.goBack();
        }
    };

    return (
        <View style={styles.leaveHistorycontainer}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <View style={styles.screenHeader}>
                <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryDark]}
                    style={styles.headerGradient}
                >
                    <View style={styles.headerContent}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.headerBackButton}
                        >
                            <MIcon name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>
                            {isEdit ? 'Edit Leave' : 'Apply Leave'}
                        </Text>
                    </View>
                </LinearGradient>
            </View>

            <KeyboardAwareScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                extraScrollHeight={100}
                enableAutomaticScroll={Platform.OS === 'ios'}
            >
                <View style={styles.card}>
                    <View style={styles.formRow}>
                        <Dropdown
                            label={'Leave Type'}
                            value={selectedOption}
                            items={leaveOptions}
                            title="Select Leave Type"
                            message="Please pick the most appropriate leave category."
                            onSelect={setSelectedOption}
                            placeholder={'Select Leave Type'}
                        />
                    </View>

                    <View style={{ marginBottom: 16 }}>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            activeOpacity={0.7}
                            disabled={isNonEdit}
                        >
                            <Text style={styles.infoLabel}>Leave Duration</Text>
                            <View style={styles.dateInputBox}>
                                <Text style={styles.dateInputText}>
                                    {startDate && endDate
                                        ? `${dayjs(startDate).format('DD/MM/YYYY')} - ${dayjs(endDate).format('DD/MM/YYYY')}`
                                        : 'Select Start & End Date'}
                                </Text>
                                <Icon name="calendar-month" size={20} color={COLORS.primary} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {noOfDays > 0 && (
                        <View style={{ marginBottom: 16 }}>
                            <Text style={styles.infoLabel}>Total Days</Text>
                            <View style={{
                                backgroundColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
                                borderRadius: 12,
                                padding: 12,
                                marginTop: 6,
                            }}>
                                <Text style={styles.infoValue}>
                                    {noOfDays} Day{noOfDays > 1 ? 's' : ''}
                                </Text>
                            </View>
                        </View>
                    )}

                    <View style={{ marginBottom: 16 }}>
                        <Text style={styles.infoLabel}>Contact Number <Text style={{ color: '#EF4444' }}>*</Text></Text>
                        <TextInput
                            style={{
                                backgroundColor: theme.cardBg,
                                borderWidth: 1,
                                borderColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
                                borderRadius: 12,
                                padding: 12,
                                marginTop: 6,
                                color: theme.text,
                                fontSize: 14,
                            }}
                            placeholder="Enter contact number"
                            placeholderTextColor={theme.textSecondary}
                            keyboardType="phone-pad"
                            value={contactNumber}
                            onChangeText={setContactNumber}
                            maxLength={10}
                        />
                    </View>

                    <View style={{ marginBottom: 8 }}>
                        <Text style={styles.infoLabel}>Reason <Text style={{ color: '#EF4444' }}>*</Text></Text>
                        <TextInput
                            style={{
                                backgroundColor: theme.cardBg,
                                borderWidth: 1,
                                borderColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
                                borderRadius: 12,
                                padding: 12,
                                marginTop: 6,
                                color: theme.text,
                                fontSize: 14,
                                height: 100,
                                textAlignVertical: 'top'
                            }}
                            placeholder="Enter reason"
                            placeholderTextColor={theme.textSecondary}
                            value={reason}
                            onChangeText={setReason}
                            multiline
                        />
                    </View>
                </View>

                {!isNonEdit && (
                    <TouchableOpacity
                        style={[styles.applyBtn, loading && { opacity: 0.7 }]}
                        onPress={handleSubmit}
                        activeOpacity={0.85}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.applyText}>
                                {isEdit ? 'UPDATE LEAVE' : 'SUBMIT LEAVE'}
                            </Text>
                        )}
                    </TouchableOpacity>
                )}
            </KeyboardAwareScrollView>
            <CustomDateRangePicker
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                onApply={handleApplyDates}
                initialStartDate={startDate ? dayjs(startDate) : undefined}
                initialEndDate={endDate ? dayjs(endDate) : undefined}
                selectionMode="range"
            />
        </View>
    );
};

export default AddEditLeaves;