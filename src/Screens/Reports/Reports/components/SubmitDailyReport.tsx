import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Text, View, TextInput, TouchableOpacity, Platform, ActivityIndicator, StatusBar } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { showMessage } from 'react-native-flash-message';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { createStyles } from '../DailyReports.styles'
import { COLORS } from '../../../../theme/colors'
import { useAppTheme } from '../../../../theme/useAppTheme';

import Dropdown from "../../../../components/Dropdown";
import { selectUser } from '../../../../redux/selector';

import { submitDailyReport } from '../../../../services/dailyReportsServices'

type TaskInput = {
    company: string;
    description: string;
    hours: string;
    minutes: string;
    status: string;
}

const defaultTask: TaskInput = {
    company: '',
    description: '',
    hours: '',
    minutes: '',
    status: '',
}

const statusOptions = [
    { label: 'Completed', value: 'Completed' },
    { label: 'In Progress', value: 'In Progress' },
]

type SubmitDailyReportParams = {
    mode?: 'edit';
    reportData?: any;
};

type SubmitDailyReportRouteProp = RouteProp<Record<string, SubmitDailyReportParams>, string>;

const SubmitDailyReport = () => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [tasks, setTasks] = useState<TaskInput[]>([{ ...defaultTask }]);
    const [loading, setLoading] = useState(false);

    const user = useSelector(selectUser);
    const navigation = useNavigation();
    const route = useRoute<SubmitDailyReportRouteProp>();

    const isEditMode = route.params?.mode === 'edit';
    const reportData = route.params?.reportData;

    useEffect(() => {
        if (isEditMode && reportData?.tasks && Array.isArray(reportData.tasks) && reportData.tasks.length > 0) {
            const formattedTasks: TaskInput[] = reportData.tasks.map((task: any) => ({
                company: task.company || '',
                description: task.description || '',
                hours: String(task.hours || 0),
                minutes: String(task.minutes || 0),
                status: task.status || '',
            }));
            setTasks(formattedTasks);
        }
    }, [isEditMode, reportData]);

    const updateTask = (index: number, field: keyof TaskInput, value: string) => {
        setTasks(prev => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)))
    }

    const addTask = () => setTasks(prev => [...prev, { ...defaultTask }])
    const removeTask = (index: number) => setTasks(prev => prev.filter((_, i) => i !== index))

    const handleSubmit = async () => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setLoading(true);

        try {
            const hasInvalid = tasks.some(t => {
                const isCompanyEmpty = !t.company || t.company.trim() === '';
                const isDescriptionEmpty = !t.description || t.description.trim() === '';
                const isStatusEmpty = !t.status || t.status.trim() === '';
                const isTimeEmpty = (t.hours === '' && t.minutes === '') || (t.hours === '0' && t.minutes === '0');

                return isCompanyEmpty || isDescriptionEmpty || isStatusEmpty || isTimeEmpty;
            });

            if (hasInvalid) {
                showMessage({
                    message: "Missing Information",
                    description: "All fields are required. Please ensure each task has a company, description, status, and duration.",
                    type: "warning",
                });
                setLoading(false);
                return;
            }

            const data = tasks.map(t => ({
                company: t.company.trim(),
                description: t.description.trim(),
                hours: Number(t.hours || 0),
                minutes: Number(t.minutes || 0),
                status: t.status,
            }))

            const submitData = {
                ...(isEditMode && reportData?._id ? { reportId: reportData._id } : {}),
                data,
            };

            await submitDailyReport(submitData, user?._id, timezone)

            showMessage({
                message: isEditMode ? "Report Updated" : "Report Submitted",
                type: "success",
            });
            navigation.goBack();
        } catch (error) {
            console.error('Error submitting daily report:', error);
            showMessage({
                message: "Submission Failed",
                type: "danger",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.mainContainer}>
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
                            {isEditMode ? 'Edit Daily Report' : 'Submit Daily Report'}
                        </Text>
                    </View>
                </LinearGradient>
            </View>

            <KeyboardAwareScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 150, paddingTop: 130 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                extraScrollHeight={100}
                enableAutomaticScroll={Platform.OS === 'ios'}
            >
                <View>
                    {tasks.map((task, index) => (
                        <View key={index} style={styles.taskCard}>
                            <View style={styles.taskCardHeader}>
                                <Text style={styles.taskCardTitle}>Task {index + 1}</Text>
                                {tasks.length > 1 && (
                                    <TouchableOpacity onPress={() => removeTask(index)}>
                                        <Icon name="trash-can-outline" size={24} color={COLORS.red1} />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Company<Text style={{ color: COLORS.red1 }}> *</Text></Text>
                                <TextInput
                                    placeholder="Enter company name"
                                    placeholderTextColor={theme.textSecondary + '80'}
                                    style={styles.input}
                                    value={task.company}
                                    onChangeText={v => updateTask(index, 'company', v)}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Task Description<Text style={{ color: COLORS.red1 }}> *</Text></Text>
                                <TextInput
                                    placeholder="What did you work on?"
                                    placeholderTextColor={theme.textSecondary + '80'}
                                    style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                                    value={task.description}
                                    onChangeText={v => updateTask(index, 'description', v)}
                                    multiline
                                />
                            </View>

                            <View style={styles.inlineGroup}>
                                <View style={[styles.formGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>Hours<Text style={{ color: COLORS.red1 }}> *</Text></Text>
                                    <TextInput
                                        placeholder="0"
                                        placeholderTextColor={theme.textSecondary + '80'}
                                        style={styles.input}
                                        value={task.hours}
                                        onChangeText={v => updateTask(index, 'hours', v.replace(/[^0-9]/g, ''))}
                                        keyboardType="number-pad"
                                        maxLength={2}
                                    />
                                </View>
                                <View style={[styles.formGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>Minutes<Text style={{ color: COLORS.red1 }}> *</Text></Text>
                                    <TextInput
                                        placeholder="0"
                                        placeholderTextColor={theme.textSecondary + '80'}
                                        style={styles.input}
                                        value={task.minutes}
                                        onChangeText={v => {
                                            const only = v.replace(/[^0-9]/g, '')
                                            const bounded = only === '' ? '' : String(Math.min(Number(only), 59))
                                            updateTask(index, 'minutes', bounded)
                                        }}
                                        keyboardType="number-pad"
                                        maxLength={2}
                                    />
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Status<Text style={{ color: COLORS.red1 }}> *</Text></Text>
                                <Dropdown
                                    label=""
                                    value={task.status}
                                    items={statusOptions}
                                    title="Select Status"
                                    message="Update the current progress of this task."
                                    placeholder="Select status"
                                    onSelect={(v) => updateTask(index, 'status', v)}
                                />
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.addTaskButton} onPress={addTask}>
                        <Icon name="plus-circle-outline" size={22} color={COLORS.primary} />
                        <Text style={styles.addTaskButtonText}>Add Another Task</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>

            <View style={styles.fixedButtonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>
                            {isEditMode ? 'UPDATE REPORT' : 'SUBMIT REPORT'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SubmitDailyReport