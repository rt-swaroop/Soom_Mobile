import React from 'react';

import { View, StyleSheet } from 'react-native';

import SkeletonItem from './SkeletonItem';
import { useAppTheme } from '../../theme/useAppTheme';

const AttendanceCardSkeleton = () => {
    const { theme } = useAppTheme();

    return (
        <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <SkeletonItem width={32} height={32} borderRadius={8} />
                    <SkeletonItem width={100} height={18} borderRadius={4} style={{ marginLeft: 10 }} />
                </View>
                <SkeletonItem width={80} height={24} borderRadius={12} />
            </View>

            <View style={styles.body}>
                <View style={styles.timeRow}>
                    <View style={styles.timeBox}>
                        <SkeletonItem width={60} height={12} borderRadius={4} />
                        <SkeletonItem width={100} height={28} borderRadius={6} style={{ marginTop: 8 }} />
                    </View>
                    <View style={[styles.divider, { backgroundColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]} />
                    <View style={styles.timeBox}>
                        <SkeletonItem width={60} height={12} borderRadius={4} />
                        <SkeletonItem width={100} height={28} borderRadius={6} style={{ marginTop: 8 }} />
                    </View>
                </View>

                {[1, 2, 3].map((i) => (
                    <View key={i} style={[styles.infoRow, { borderBottomColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)' }]}>
                        <View style={styles.infoLeft}>
                            <SkeletonItem width={28} height={28} borderRadius={8} />
                            <SkeletonItem width={80} height={14} borderRadius={4} style={{ marginLeft: 10 }} />
                        </View>
                        <SkeletonItem width={100} height={14} borderRadius={4} />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    header: {
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    body: {
        padding: 16,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    timeBox: {
        flex: 1,
    },
    divider: {
        width: 1,
        height: 40,
        marginHorizontal: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default AttendanceCardSkeleton;
