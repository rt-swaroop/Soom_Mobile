import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { createStyles } from '../DailyReports.styles';
import { useAppTheme } from '../../../../theme/useAppTheme';

const DailyReportCard = ({ task }: any) => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.taskCompany}>{task.company}</Text>
                <Text style={[
                    styles.taskStatus,
                    task.status === 'Completed' ? styles.statusCompleted : styles.statusInProgress
                ]}>
                    {task.status}
                </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.taskContainer}>
                <Text style={styles.taskDescription}>{task.description}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.taskMetaRow}>
                <Text style={styles.taskTime}>Time Spent: {task.hours}h {task.minutes || 0}m</Text>
            </View>
        </View>
    );
};

export default DailyReportCard;