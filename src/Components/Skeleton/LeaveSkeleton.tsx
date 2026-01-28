import React from 'react';

import { View, StyleSheet, ScrollView } from 'react-native';

import SkeletonItem from './SkeletonItem';
import { useAppTheme } from '../../theme/useAppTheme';

export const LeaveBalanceSkeleton = () => {
    const { theme } = useAppTheme();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SkeletonItem width={120} height={20} borderRadius={6} />
                <SkeletonItem width={60} height={16} borderRadius={4} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.balanceGrid}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={[styles.balanceTile, { backgroundColor: theme.cardBg }]}>
                        <SkeletonItem width={40} height={40} borderRadius={20} style={{ marginBottom: 12 }} />
                        <SkeletonItem width={80} height={14} borderRadius={4} style={{ marginBottom: 8 }} />
                        <SkeletonItem width={40} height={24} borderRadius={6} style={{ marginBottom: 4 }} />
                        <SkeletonItem width={60} height={12} borderRadius={4} />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export const AppliedCardSkeleton = () => {
    const { theme } = useAppTheme();

    return (
        <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
            <View style={[styles.statusLine, { backgroundColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />
            <View style={styles.cardContent}>
                <View style={styles.rowBetween}>
                    <SkeletonItem width={100} height={18} borderRadius={4} />
                    <SkeletonItem width={70} height={20} borderRadius={10} />
                </View>

                <View style={styles.infoRow}>
                    <SkeletonItem width={40} height={12} borderRadius={4} style={{ marginRight: 8 }} />
                    <SkeletonItem width={140} height={12} borderRadius={4} />
                </View>

                <View style={styles.infoRow}>
                    <SkeletonItem width={70} height={12} borderRadius={4} style={{ marginRight: 8 }} />
                    <SkeletonItem width={90} height={12} borderRadius={4} />
                </View>

                <View style={[styles.infoRow, { alignItems: 'flex-start' }]}>
                    <SkeletonItem width={50} height={12} borderRadius={4} style={{ marginRight: 8 }} />
                    <View style={{ flex: 1 }}>
                        <SkeletonItem width="100%" height={12} borderRadius={4} style={{ marginBottom: 6 }} />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    balanceGrid: {
        paddingLeft: 16,
        paddingBottom: 4,
    },
    balanceTile: {
        width: 120,
        height: 140,
        borderRadius: 20,
        marginRight: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    card: {
        flexDirection: 'row',
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statusLine: {
        width: 5,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    cardContent: {
        flex: 1,
        padding: 16,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.03)',
    },
    approverRow: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
