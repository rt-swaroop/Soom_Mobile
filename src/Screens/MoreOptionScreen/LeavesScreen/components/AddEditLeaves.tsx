import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';

import { COLORS } from '../../../../theme/colors';
import { selectUser } from '../../../../redux/selector';

import DatePickerInput from '../../../../Components/DatePickerInput';
import Dropdown from '../../../../Components/Dropdown';

import { applyLeave } from '../../../../services/leavesServices';

const AddEditLeaves = (props: any) => {

    const [selectedOption, setSelectedOption] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [noOfDays, setNoOfDays] = useState<number>(0);
    const [contactNumber, setContactNumber] = useState<string>('');
    const [reason, setReason] = useState<string>('');

    const [loading, setLoading] = useState(false);

    const user = useSelector(selectUser);

    const navigation = useNavigation();

    const item = props?.route?.params?.item;
    const isEdit = props?.route?.params?.mode === 'edit';
    const isNonEdit = props?.route?.params?.mode === 'non-edit';

    const leaveOptions = [
        { label: 'Casual Leave', value: 'Casual Leave' },
        { label: 'Sick Leave', value: 'Sick Leave' },
        { label: 'Compensatory Leave (Comp Off)', value: 'Compensatory Leave (Comp Off)' },
    ];

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
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                <View style={styles.formRow}>
                    <Dropdown
                        label={'Leave Type'}
                        value={selectedOption}
                        items={leaveOptions}
                        onSelect={setSelectedOption}
                        placeholder={'Select Leave Type'}
                    />
                </View>

                <>
                    <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <DatePickerInput
                                label="Start Date"
                                date={startDate ? new Date(startDate) : null}
                                setDate={d => setStartDate(d.toISOString())}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <DatePickerInput
                                label="End Date"
                                date={endDate ? new Date(endDate) : null}
                                setDate={d => setEndDate(d.toISOString())}
                            />
                        </View>
                    </View>

                    {noOfDays > 0 && (
                        <View style={styles.formRow}>
                            <Text style={styles.label}>Total Days</Text>
                            <View style={styles.readonlyInput}>
                                <Text style={styles.readonlyText}>
                                    {noOfDays} Day{noOfDays > 1 ? 's' : ''}
                                </Text>
                            </View>
                        </View>
                    )}
                </>

                <View style={styles.formRow}>
                    <Text style={styles.label}>Contact Number </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter contact number"
                        keyboardType="phone-pad"
                        value={contactNumber}
                        onChangeText={setContactNumber}
                        maxLength={10}
                    />
                </View>

                <View style={styles.formRow}>
                    <Text style={styles.label}>Reason</Text>
                    <TextInput
                        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                        placeholder="Enter reason"
                        value={reason}
                        onChangeText={setReason}
                        multiline
                    />
                </View>

            </ScrollView>

            {!isNonEdit && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.submitButton, loading && { opacity: 0.7 }]}
                        onPress={handleSubmit}
                        activeOpacity={0.85}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.submitText}>
                                {isEdit ? 'Update' : 'Submit'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

export default AddEditLeaves;

const styles = StyleSheet.create({
    container: {
        padding: 18,
        paddingBottom: 120,
        backgroundColor: COLORS.lightBlue,
        flexGrow: 1,
    },
    formRow: {
        marginBottom: 12,
        zIndex: 1000,
    },
    label: {
        fontSize: 14,
        color: COLORS.primaryDark,
        marginBottom: 6,
        fontWeight: '600',
    },
    readonlyInput: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray2,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    readonlyText: {
        color: COLORS.primaryDark,
        fontSize: 15,
    },
    input: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray2,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 15,
        color: COLORS.primaryDark,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        backgroundColor: 'transparent',
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
    },
});