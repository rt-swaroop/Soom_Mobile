import React from 'react';

import { View, ScrollView } from 'react-native';

import { useAppTheme } from '../../theme/useAppTheme';
import SkeletonItem from './SkeletonItem';
import { createStyles } from '../../screens/Admin/Attendance/AdminAttendance.styles';

const AdminAttendanceSkeleton = () => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SkeletonItem width="100%" height={45} borderRadius={12} style={{ marginBottom: 12 }} />
                <SkeletonItem width="100%" height={45} borderRadius={12} />
            </View>

            <View style={{ height: 60, paddingVertical: 12, paddingLeft: 16, flexDirection: 'row' }}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <SkeletonItem key={i} width={80} height={36} borderRadius={20} style={{ marginRight: 8 }} />
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <View key={i} style={[styles.employeeCard, { padding: 12 }]}>
                        <SkeletonItem width={50} height={50} borderRadius={25} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <SkeletonItem width={150} height={18} borderRadius={4} style={{ marginBottom: 6 }} />
                            <SkeletonItem width={100} height={14} borderRadius={4} style={{ marginBottom: 8 }} />
                            <SkeletonItem width={120} height={14} borderRadius={4} />
                        </View>
                        <SkeletonItem width={80} height={24} borderRadius={12} />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default AdminAttendanceSkeleton;
