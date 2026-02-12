import { StyleSheet } from "react-native";

import { Theme } from "../../../theme/useAppTheme";
import { COLORS } from "../../../theme/colors";


export const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    header: {
        padding: 16,
        backgroundColor: theme.cardBg,
        borderBottomWidth: 1,
        borderBottomColor: theme.glassCardBorder,
    },
    tabContainer: {
        flexDirection: 'row',
        padding: 4,
        backgroundColor: theme.background,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.glassCardBorder,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textSecondary,
    },
    activeTabText: {
        color: COLORS.white,
    },
    filterContainer: {
        paddingVertical: 12,
        paddingLeft: 0,
    },
    filterBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: theme.cardBg,
        borderWidth: 1,
        borderColor: theme.glassCardBorder,
    },
    filterBtnActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        fontSize: 13,
        fontWeight: "600",
        color: theme.textSecondary,
    },
    filterTextActive: {
        color: COLORS.white,
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    requestCard: {
        backgroundColor: theme.cardBg,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.glassCardBorder,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    headerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    employeeName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.text,
    },
    requestDate: {
        fontSize: 12,
        color: theme.textSecondary,
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    cardBody: {
        backgroundColor: theme.background + '50',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 13,
        color: theme.textSecondary,
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.text,
    },
    reasonContainer: {
        marginTop: 4,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: theme.glassCardBorder,
    },
    reasonText: {
        fontSize: 13,
        color: theme.text,
        fontStyle: 'italic',
        lineHeight: 18,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    rejectBtn: {
        backgroundColor: '#FF525210',
        borderWidth: 1,
        borderColor: '#FF5252',
    },
    approveBtn: {
        backgroundColor: '#4CAF5010',
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    actionBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme.cardBg,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.text,
        marginBottom: 16,
    },
    commentInput: {
        backgroundColor: theme.background,
        borderRadius: 12,
        padding: 12,
        height: 100,
        textAlignVertical: 'top',
        color: theme.text,
        borderWidth: 1,
        borderColor: theme.glassCardBorder,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalCancelBtn: {
        backgroundColor: theme.background,
        borderWidth: 1,
        borderColor: theme.glassCardBorder,
    },
    modalConfirmBtn: {
        backgroundColor: COLORS.primary,
    },
    modalBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    rejectText: {
        color: COLORS.red1,
    },
    approveText: {
        color: COLORS.green1,
    },
    adminCommentContainer: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: theme.glassCardBorder,
        paddingTop: 10,
    },
    emptyStateContainer: {
        alignItems: 'center',
        marginTop: 80,
    },
    emptyStateText: {
        color: theme.textSecondary,
        marginTop: 10,
        fontSize: 16,
    },
    modalLabel: {
        fontSize: 13,
        color: theme.textSecondary,
        marginBottom: 8,
    },
    modalConfirmRejectBtn: {
        backgroundColor: COLORS.red1,
    }
});