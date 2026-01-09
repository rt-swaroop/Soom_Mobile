import React from 'react';

import { Text, View } from 'react-native';

import { styles } from '../DailyReports.styles';

const DailyReportCard = ({ task }: any) => {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.taskCompany}>{task.company}</Text>
                <Text style={[styles.taskStatus, task.status === 'Completed' ? styles.statusCompleted : styles.statusInProgress]}>
                    {task.status}
                </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.taskContainer}>
                <Text style={styles.taskDescription}>➤ {task.description}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.taskMetaRow}>
                <Text style={styles.taskTime}>Time: {task.hours}h {task.minutes}m</Text>
            </View>
        </View>
    );
};

export default DailyReportCard;