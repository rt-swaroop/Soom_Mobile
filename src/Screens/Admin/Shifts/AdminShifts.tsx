import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";

import { View, Text, SectionList, TouchableOpacity, TextInput, Image, RefreshControl, ActivityIndicator, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { useAppTheme } from "../../../theme/useAppTheme";
import { COLORS } from "../../../theme/colors";
import { selectUser } from "../../../redux/selector";
import { IMAGES } from "../../../assets/images";
import CustomDateRangePicker from "../../../components/CustomDateRangePicker/CustomDateRangePicker";
import { getAllShifts } from "../../../services/shiftServices";
import AdminAttendanceSkeleton from "../../../components/Skeleton/AdminAttendanceSkeleton";
import { createStyles } from "./AdminShifts.styles";

dayjs.extend(utc);
dayjs.extend(timezone);

const AdminShifts = () => {
    const { theme } = useAppTheme();
    const user = useSelector(selectUser);
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [teamShifts, setTeamShifts] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    const fetchData = useCallback(async (date: dayjs.Dayjs) => {
        const subscriberId = typeof user.companyId === 'object' ? user.companyId._id : user.companyId;
        if (!subscriberId) return;

        try {
            const timeZone = dayjs.tz.guess();
            const formattedDate = date.format('YYYY-MM-DD');
            const data = {
                formattedData: {
                    startDate: formattedDate,
                    endDate: formattedDate
                },
                timeZone
            };

            const response = await getAllShifts({
                subscriberId,
                data
            });

            setTeamShifts(response.teamShifts || []);
        } catch (error) {
            console.error("Error fetching admin shifts:", error);
        } finally {
            setInitialLoading(false);
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData(selectedDate);
    }, [fetchData, selectedDate]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData(selectedDate);
    };

    const handleDateApply = (start: dayjs.Dayjs) => {
        setSelectedDate(start);
        setShowDatePicker(false);
    };

    const groupedShifts = useMemo(() => {
        const filtered = teamShifts.filter(item =>
            item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (activeFilter === "All" || (item.shifts[0]?.shiftType === activeFilter))
        );

        const grouped = filtered.reduce((acc: any, item: any) => {
            const shiftType = item.shifts[0]?.shiftType || "No Shift";
            if (!acc[shiftType]) {
                acc[shiftType] = [];
            }
            acc[shiftType].push(item);
            return acc;
        }, {});

        return Object.keys(grouped).map(title => ({
            title,
            data: grouped[title]
        })).sort((a, b) => a.title.localeCompare(b.title));
    }, [teamShifts, searchQuery, activeFilter]);

    const shiftFilters = useMemo(() => {
        const types = new Set(teamShifts.map(item => item.shifts[0]?.shiftType).filter(Boolean));
        return ["All", ...Array.from(types)];
    }, [teamShifts]);

    const renderShiftItem = ({ item }: { item: any }) => {
        const shift = item.shifts[0];
        const isDefault = shift?.isDefault;
        const isOff = shift?.shiftType === "Week Off" || shift?.shiftType === "Public Holiday";

        return (
            <TouchableOpacity style={styles.card} activeOpacity={0.7}>
                <Image
                    source={item.profilePic?.location ? { uri: item.profilePic.location } : IMAGES.user}
                    style={styles.avatar}
                />
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{item.fullName}</Text>
                    <Text style={styles.code}>{item.employeeCode}</Text>
                    <View style={styles.shiftDetailRow}>
                        <Icon name="schedule" size={14} color={COLORS.primary} />
                        <Text style={[styles.shiftType, isOff ? styles.offShiftType : styles.activeShiftType]}>
                            {shift?.shiftType || 'No Shift'}
                            {isDefault && <Text style={styles.defaultLabel}> (Default)</Text>}
                        </Text>
                    </View>
                </View>
                {shift?.shiftData && (
                    <View style={styles.timeBadge}>
                        <Text style={styles.timeText}>{shift.shiftData.startTime}</Text>
                        <View style={styles.timeDivider} />
                        <Text style={styles.timeText}>{shift.shiftData.endTime}</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    if (initialLoading) {
        return <AdminAttendanceSkeleton />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Icon name="search" size={20} color={theme.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search employees..."
                        placeholderTextColor={theme.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDatePicker(true)}>
                    <Icon name="event" size={20} color={COLORS.primary} />
                    <Text style={styles.selectedDateText}>{selectedDate.format('DD MMM')}</Text>
                    <Icon name="arrow-drop-down" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
                    {shiftFilters.map((filter) => (
                        <TouchableOpacity
                            key={filter as string}
                            style={[styles.filterBtn, activeFilter === filter && styles.filterBtnActive]}
                            onPress={() => setActiveFilter(filter as string)}
                        >
                            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                                {filter as string}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <SectionList
                    sections={groupedShifts}
                    renderItem={renderShiftItem}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{title}</Text>
                            <View style={styles.sectionBadge}>
                                <Text style={styles.sectionBadgeText}>
                                    {groupedShifts.find(s => s.title === title)?.data.length}
                                </Text>
                            </View>
                        </View>
                    )}
                    keyExtractor={item => item.userId}
                    contentContainerStyle={styles.listContent}
                    stickySectionHeadersEnabled={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon name="event-busy" size={60} color={theme.textSecondary} />
                            <Text style={styles.emptyText}>No shifts found for this date</Text>
                        </View>
                    }
                />
            )}

            <CustomDateRangePicker
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                onApply={handleDateApply}
                initialStartDate={selectedDate}
                initialEndDate={selectedDate}
                selectionMode="single"
            />
        </View>
    );
};



export default AdminShifts;
