import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.lightBlue,
    },
    applyBtn: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: "auto",
    },
    applyText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "600"
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
    },
    card: {
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 16,
        shadowColor: COLORS.black,
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 4,
        color: COLORS.primaryDark
    },
    balanceGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    balanceTile: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginHorizontal: 4,
        alignItems: "center",
        backgroundColor: COLORS.lightBlue,
        borderWidth: 1,
    },
    iconCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 6,
    },
    tileTitle: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 4,
        textAlign: "center",
    },
    tileValue: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 2
    },
    tileSub: {
        fontSize: 14,
        color: COLORS.gray3,
        marginBottom: 4
    },
    tileInfo: {
        fontSize: 13,
        color: COLORS.gray4,
    },
    historyBtn: {
        alignSelf: "flex-end",
        borderWidth: 1,
        borderColor: COLORS.primaryDark,
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    historyText: {
        color: COLORS.primary,
        fontSize: 13,
        fontWeight: "600"
    },
    leaveHistorycontainer: {
        flex: 1,
        backgroundColor: COLORS.lightBlue,
    },
    noDataText: {
        textAlign: 'center',
        color: '#6B7280',
        fontSize: 16,
        fontStyle: 'italic',
        marginTop: 20,
    },
    cardContainer: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        borderRadius: 14,
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 12,
        shadowColor: COLORS.black,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 3,
    },
    statusIndicator: {
        width: 6,
        borderRadius: 3,
    },
    cardContent: {
        flex: 1,
        marginLeft: 12,
    },
    headerRow2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    cardTitle2: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    statusBadgeContainer: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    statusBadgeText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '600',
    },
    infoRow: {
        flexDirection: 'row',
        marginVertical: 2,
    },
    infoLabel: {
        fontWeight: '500',
        color: '#4B5563',
        marginRight: 4,
    },
    infoValue: {
        fontWeight: '600',
        color: '#111827',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    statusText: {
        fontSize: 12,
        color: '#374151',
    },
    approverRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    approvedByLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginRight: 4,
    },
    approvedByName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginHorizontal: 4,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2ecc7133",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
})
