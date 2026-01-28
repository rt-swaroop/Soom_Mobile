import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ActivityIndicator, Alert, Platform, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { createStyles } from '../Timeoff.styles';
import { COLORS } from '../../../../theme/colors';
import { selectUser } from '../../../../redux/selector';
import { useAppTheme } from '../../../../theme/useAppTheme';
import dayjs from 'dayjs';

import CustomDateRangePicker from '../../../../components/CustomDateRangePicker/CustomDateRangePicker';
import TimePickerInput from '../../../../components/TimePickerInput';
import Dropdown from '../../../../components/Dropdown';

import { applyTimeOff } from '../../../../services/timeoffServices';

const AddEditTimeoff = (props: any) => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [selectedOption, setSelectedOption] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [noOfDays, setNoOfDays] = useState<number>(0);
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [noOfHours, setNoOfHours] = useState<number>(0);
    const [contactNumber, setContactNumber] = useState<string>('');
    const [reason, setReason] = useState<string>('');

    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const user = useSelector(selectUser);

    const navigation = useNavigation<any>();

    const item = props?.route?.params?.item;
    const isEdit = props?.route?.params?.mode === 'edit';
    const isNonEdit = props?.route?.params?.mode === 'non-edit';

    const timeOffOptions = [
        { label: 'Work From Home', value: 'Work From Home' },
        { label: 'Half Day', value: 'Half Day' },
    ];

    useEffect(() => {
        if ((isEdit || isNonEdit) && item) {
            setSelectedOption(item.timeOffType || '');
            setStartDate(item.startDate || '');
            setEndDate(item.endDate || '');
            setStartTime(item.startTime || '');
            setEndTime(item.endTime || '');
            setNoOfDays(item.noOfDays || 0);
            setNoOfHours(item.noOfHours || 0);
            setContactNumber(item.contactNumber || '');
            setReason(item.reason || '');
        } else if (!isEdit && !isNonEdit) {
            setSelectedOption('');
            setStartDate('');
            setEndDate('');
            setStartTime('');
            setEndTime('');
            setNoOfDays(0);
            setNoOfHours(0);
            setContactNumber('');
            setReason('');
        }
    }, [isEdit, isNonEdit, item]);

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

    useEffect(() => {
        if (startTime && endTime) {

            const parseTime = (timeStr: string) => {
                timeStr = timeStr.replace(/\s+/g, ' ').trim();

                const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
                if (!match) return null;

                let [, hourStr, minuteStr, period] = match;
                let hour = Number(hourStr);
                let minute = Number(minuteStr);

                if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
                if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;

                return { hour, minute };

            }

            const start = parseTime(startTime);
            const end = parseTime(endTime);

            if (start && end) {

                const startDate = new Date();
                startDate.setHours(start.hour, start.minute, 0, 0);

                const endDate = new Date();
                endDate.setHours(end.hour, end.minute, 0, 0);

                const diffMs = endDate.getTime() - startDate.getTime();
                const diffHours = diffMs / (1000 * 60 * 60);
                if (diffHours > 0) {
                    setNoOfHours(diffHours);
                } else {
                    setNoOfHours(0);
                    Alert.alert("End time must be greater than start time!");
                }

            } else {
                setNoOfHours(0);
            }
        } else {
            setNoOfHours(0);
        }
    }, [startTime, endTime]);
    const handleApplyDates = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
        setStartDate(start.toISOString());
        setEndDate(end.toISOString());
    };

    const handleSubmit = async () => {

        if (!selectedOption || !contactNumber || !reason || (!startTime && selectedOption === "Half Day") || (!startDate && selectedOption !== "Half Day")) {
            showMessage({
                message: "Validation Error",
                description: "Please fill all required fields for Time Off.",
                type: "warning",
                duration: 3000,
            });
            return;
        }

        setLoading(true);

        try {
            const TimeOffData = {
                ...(isEdit && item?._id ? { timeOffId: item._id } : {}),
                timeOffType: selectedOption,
                startTime: startTime || null,
                endTime: endTime || null,
                noOfHours,
                startDate: startDate || null,
                endDate: endDate || null,
                noOfDays,
                contactNumber,
                reason
            }

            await applyTimeOff(TimeOffData, user?._id, user?.companyId?._id)

            showMessage({
                message: "TimeOff Request Submitted",
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

    }

    return (
        <View style={styles.timeoffHistorycontainer}>
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
                            {isEdit ? 'Edit Time-off' : 'Apply Time-off'}
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
                            label={'Time-off Type'}
                            value={selectedOption}
                            items={timeOffOptions}
                            title="Select Time-off Type"
                            message="Choose the type of time-off you want to apply for."
                            onSelect={setSelectedOption}
                            placeholder={`Select Time-off Type`}
                        />
                    </View>

                    {(selectedOption === 'Work From Home') && (
                        <>
                            <View style={{ marginBottom: 16 }}>
                                <TouchableOpacity
                                    onPress={() => setShowDatePicker(true)}
                                    activeOpacity={0.7}
                                    disabled={isNonEdit}
                                >
                                    <Text style={styles.infoLabel}>Time-off Duration</Text>
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
                        </>
                    )}

                    {selectedOption === 'Half Day' && (
                        <>
                            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                                <View style={{ flex: 1, marginRight: 8 }}>
                                    <TimePickerInput
                                        label="Start Time"
                                        time={startTime}
                                        setTime={setStartTime}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TimePickerInput
                                        label="End Time"
                                        time={endTime}
                                        setTime={setEndTime}
                                    />
                                </View>
                            </View>

                            {noOfHours > 0 && (
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={styles.infoLabel}>Total Hours</Text>
                                    <View style={{
                                        backgroundColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
                                        borderRadius: 12,
                                        padding: 12,
                                        marginTop: 6,
                                    }}>
                                        <Text style={styles.infoValue}>
                                            {noOfHours.toFixed(1)} Hour{noOfHours > 1 ? 's' : ''}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </>
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
                                {isEdit ? 'UPDATE TIME-OFF' : 'SUBMIT TIME-OFF'}
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

export default AddEditTimeoff;