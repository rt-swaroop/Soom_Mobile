import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { showMessage } from 'react-native-flash-message';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { styles } from '../DailyReports.styles'
import { COLORS } from '../../../../theme/colors'

import Dropdown from '../../../../Components/Dropdown';

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

            const hasInvalid = tasks.some(t => !t.company || !t.description || !t.status || (t.hours === '' && t.minutes === ''))

            if (hasInvalid) {
                showMessage({
                    message: "Validation Error",
                    description: "Please fill all required fields for each task.",
                    type: "warning",
                    duration: 3000,
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
                message: isEditMode ? "Daily Report Updated" : "Daily Report Submitted",
                description: isEditMode
                    ? `Your Daily Report has been updated successfully.`
                    : `Your Daily Report has been submitted.`,
                type: "success",
                duration: 3000,
            });

        } catch (error) {
            console.error('Error submitting daily report:', error);
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
        <KeyboardAvoidingWidget>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                <View style={{ marginTop: 8 }}>
                    {tasks.map((task, index) => (
                        <View key={index} style={styles.taskCard}>
                            <View style={styles.taskCardHeader}>
                                <Text style={styles.taskCardTitle}>Task {index + 1}</Text>
                                {tasks.length > 1 && (
                                    <TouchableOpacity onPress={() => removeTask(index)}>
                                        <Icon name="delete-outline" size={24} color={COLORS.red1} />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Company</Text>
                                <TextInput
                                    placeholder="Enter company"
                                    placeholderTextColor={COLORS.gray2}
                                    style={styles.input}
                                    value={task.company}
                                    onChangeText={v => updateTask(index, 'company', v)}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Task Description</Text>
                                <TextInput
                                    placeholder="Describe the task"
                                    placeholderTextColor={COLORS.gray2}
                                    style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                                    value={task.description}
                                    onChangeText={v => updateTask(index, 'description', v)}
                                    multiline
                                />
                            </View>

                            <View style={styles.inlineGroup}>
                                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                                    <Text style={styles.label}>Hours</Text>
                                    <TextInput
                                        placeholder="0"
                                        placeholderTextColor={COLORS.gray2}
                                        style={styles.input}
                                        value={task.hours}
                                        onChangeText={v => updateTask(index, 'hours', v.replace(/[^0-9]/g, ''))}
                                        keyboardType="number-pad"
                                        maxLength={2}
                                    />
                                </View>
                                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                                    <Text style={styles.label}>Minutes</Text>
                                    <TextInput
                                        placeholder="0"
                                        placeholderTextColor={COLORS.gray2}
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
                                <Text style={styles.label}>Status</Text>
                                <Dropdown
                                    label=""
                                    value={task.status}
                                    items={statusOptions}
                                    placeholder="Select status"
                                    onSelect={(v) => updateTask(index, 'status', v)}
                                />
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.addTaskButton} onPress={addTask}>
                        <Icon name="add-circle-outline" size={22} color={COLORS.white} />
                        <Text style={styles.addTaskButtonText}>Add another task</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View style={styles.fixedButtonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>
                            {isEditMode ? 'Update Daily Report' : 'Submit Daily Report'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingWidget>
    )
}

const KeyboardAvoidingWidget = ({ children }: { children: React.ReactNode }) => (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {children}
    </KeyboardAvoidingView>
)

export default SubmitDailyReport