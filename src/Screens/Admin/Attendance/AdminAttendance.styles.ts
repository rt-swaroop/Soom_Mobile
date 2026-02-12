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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateSelector: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.background,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.glassCardBorder,
        minWidth: 140,
        height: 45,
    },
    dateText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: "600",
        color: theme.text,
    },
    searchContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.background,
        marginRight: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        height: 45,
        borderWidth: 1,
        borderColor: theme.glassCardBorder,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: theme.text,
    },
    filterContainer: {
        paddingVertical: 12,
        paddingLeft: 16,
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
    employeeCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.cardBg,
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.glassCardBorder,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
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
        fontWeight: "700",
        color: theme.text,
    },
    code: {
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
        fontWeight: "700",
    },
    timeContainer: {
        marginTop: 4,
        flexDirection: "row",
        alignItems: "center",
    },
    timeText: {
        fontSize: 12,
        color: theme.textSecondary,
        marginLeft: 4,
    },
    // Modal Styles
    modalContent: {
        backgroundColor: theme.cardBg,
        padding: 24,
        borderRadius: 24,
        alignItems: "center",
    },
    modalAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 16,
    },
    modalName: {
        fontSize: 20,
        fontWeight: "bold",
        color: theme.text,
    },
    modalCode: {
        fontSize: 14,
        color: theme.textSecondary,
        marginBottom: 20,
    },
    detailsRow: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.glassCardBorder,
    },
    detailItem: {
        alignItems: "center",
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: theme.textSecondary,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: "600",
        color: theme.text,
    },
    locationBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primary + '10',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        marginTop: 8,
    },
    locationText: {
        marginLeft: 8,
        color: COLORS.primary,
        fontWeight: "600",
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    placeIcon: {
        marginLeft: 6,
    },
    checkIcon: {
        marginRight: 4,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalIndicator: {
        width: 40,
        height: 4,
        backgroundColor: theme.glassCardBorder,
        borderRadius: 2,
        marginBottom: 20,
    }
});
