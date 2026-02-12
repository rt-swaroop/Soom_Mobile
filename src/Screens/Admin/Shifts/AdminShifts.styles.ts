import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';

export const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    header: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        backgroundColor: theme.text === '#FFFFFF' ? '#374151' : '#F3F4F6',
        minWidth: 130,
        height: 48,
    },
    selectedDateText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
        color: theme.text,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        height: 48,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        backgroundColor: theme.text === '#FFFFFF' ? '#374151' : '#F3F4F6',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: theme.text,
    },
    filterContainer: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    filterBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginRight: 10,
    },
    filterBtnActive: {
        backgroundColor: COLORS.primary,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        backgroundColor: theme.text === '#FFFFFF' ? '#1F2937' : '#FFFFFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    infoContainer: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.text,
    },
    code: {
        fontSize: 12,
        marginTop: 2,
        color: theme.textSecondary,
    },
    shiftDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    shiftType: {
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 4,
    },
    activeShiftType: {
        color: COLORS.primary,
    },
    offShiftType: {
        color: '#9E9E9E',
    },
    defaultLabel: {
        fontSize: 11,
        fontStyle: 'italic',
        opacity: 0.7,
    },
    timeBadge: {
        backgroundColor: COLORS.primary + '15',
        padding: 8,
        borderRadius: 10,
        alignItems: 'center',
        minWidth: 80,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
    },
    timeDivider: {
        width: 15,
        height: 1,
        backgroundColor: COLORS.primary,
        marginVertical: 4,
        opacity: 0.3,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        marginTop: 12,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionBadge: {
        backgroundColor: COLORS.primary + '20',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: 8,
    },
    sectionBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.primary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: theme.textSecondary,
        marginTop: 10,
    },
});
