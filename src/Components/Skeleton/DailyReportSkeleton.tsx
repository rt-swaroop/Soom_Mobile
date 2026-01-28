import React from 'react';

import { View, StyleSheet } from 'react-native';

import SkeletonItem from './SkeletonItem';
import { useAppTheme } from '../../theme/useAppTheme';

const DailyReportSkeleton = () => {
    const { theme } = useAppTheme();

    return (
        <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
            <View style={styles.cardHeader}>
                <SkeletonItem width={120} height={18} borderRadius={4} />
                <SkeletonItem width={80} height={20} borderRadius={8} />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }]} />

            <View style={styles.taskContainer}>
                <SkeletonItem width="100%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
                <SkeletonItem width="80%" height={14} borderRadius={4} />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }]} />

            <View style={styles.taskMetaRow}>
                <SkeletonItem width={110} height={13} borderRadius={4} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    divider: {
        height: 1,
        marginVertical: 12,
    },
    taskContainer: {
        marginBottom: 4,
    },
    taskMetaRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 4,
    },
});

export default DailyReportSkeleton;
