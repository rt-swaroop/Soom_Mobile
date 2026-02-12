import React from 'react';

import { View, ScrollView } from 'react-native';

import { useAppTheme } from '../../theme/useAppTheme';
import SkeletonItem from './SkeletonItem';
import { createStyles } from '../../screens/Admin/Employees/AdminEmployees.styles';

const AdminEmployeesSkeleton = () => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.tabContainer}>
                    <SkeletonItem width="50%" height={32} borderRadius={8} />
                    <SkeletonItem width="50%" height={32} borderRadius={8} />
                </View>
                <SkeletonItem width="100%" height={48} borderRadius={12} />
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <View key={i} style={styles.employeeCard}>
                        <SkeletonItem width={52} height={52} borderRadius={26} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <SkeletonItem width={140} height={18} borderRadius={4} style={{ marginBottom: 6 }} />
                            <SkeletonItem width={100} height={14} borderRadius={4} style={{ marginBottom: 8 }} />
                            <SkeletonItem width={80} height={14} borderRadius={4} />
                        </View>
                        <SkeletonItem width={24} height={24} borderRadius={12} />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default AdminEmployeesSkeleton;
