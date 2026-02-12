import React from 'react';

import { View, ScrollView, Dimensions } from 'react-native';

import { useAppTheme } from '../../theme/useAppTheme';
import SkeletonItem from './SkeletonItem';
import { createStyles } from '../../screens/Admin/Dashboard/AdminDashboard.styles';

const { width } = Dimensions.get('window');

const DashboardSkeleton = () => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <SkeletonItem width={120} height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                <SkeletonItem width={180} height={28} borderRadius={4} />
            </View>

            <View style={{
                marginHorizontal: 16,
                height: 50,
                borderRadius: 12,
                backgroundColor: theme.cardBg,
                marginBottom: 20,
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: theme.glassCardBorder
            }}>
                <SkeletonItem width={20} height={20} borderRadius={10} style={{ marginRight: 10 }} />
                <SkeletonItem width={150} height={16} borderRadius={4} />
            </View>

            <View style={{ marginLeft: 20, marginBottom: 15 }}>
                <SkeletonItem width={160} height={20} borderRadius={4} />
            </View>

            <View style={styles.statsGrid}>
                <View style={[styles.statCardMain, { height: 110, backgroundColor: theme.cardBg, borderWidth: 1, borderColor: theme.glassCardBorder, padding: 16 }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                        <SkeletonItem width={36} height={36} borderRadius={18} />
                        <SkeletonItem width={20} height={20} borderRadius={4} />
                    </View>
                    <SkeletonItem width={60} height={24} borderRadius={4} style={{ marginBottom: 6 }} />
                    <SkeletonItem width={100} height={14} borderRadius={4} />
                </View>

                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <View key={i} style={[styles.statCardSmall, { height: 110, backgroundColor: theme.cardBg, borderWidth: 1, borderColor: theme.glassCardBorder, padding: 16 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                            <SkeletonItem width={36} height={36} borderRadius={18} />
                            <SkeletonItem width={20} height={20} borderRadius={4} />
                        </View>
                        <SkeletonItem width={40} height={24} borderRadius={4} style={{ marginBottom: 6 }} />
                        <SkeletonItem width={80} height={14} borderRadius={4} />
                    </View>
                ))}
            </View>

            <View style={{ marginLeft: 20, marginTop: 10, marginBottom: 15 }}>
                <SkeletonItem width={200} height={20} borderRadius={4} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16 }}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={[styles.employeeCard, { height: 120, justifyContent: 'center' }]}>
                        <SkeletonItem width={50} height={50} borderRadius={25} style={{ marginBottom: 10 }} />
                        <SkeletonItem width={80} height={14} borderRadius={4} style={{ marginBottom: 6 }} />
                        <SkeletonItem width={60} height={12} borderRadius={4} />
                    </View>
                ))}
            </ScrollView>
        </ScrollView>
    );
};

export default DashboardSkeleton;
