import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        padding: 20
    },
    attendanceCard: {
        marginTop: 10,
        backgroundColor: theme.cardBg,
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 0.5,
        borderColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },
    timeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.text
    },
    dateText: {
        fontSize: 16,
        color: theme.textSecondary,
        marginVertical: 10
    },
    attendanceButtonContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5
    },
    attendanceButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    attendanceButtonText: {
        marginTop: 10,
        color: COLORS.white,
        fontSize: 16
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    locationText: {
        marginLeft: 1,
        fontSize: 16,
        color: theme.textSecondary,
        textAlign: 'center',
    },
    dashedLine: {
        width: '100%',
        height: 1,
        borderBottomWidth: 1,
        borderBottomColor: theme.textSecondary,
        borderStyle: 'dashed',
        marginVertical: 5,
        opacity: 0.3
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: 20
    },
    actionItem: {
        alignItems: 'center',
    },
    actionLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.text,
        marginTop: 5,
        textTransform: 'uppercase',
    },
    actionText: {
        fontSize: 14,
        color: theme.textSecondary,
        marginTop: 5,
    },
    shiftCard: {
        marginTop: 16,
        backgroundColor: theme.cardBg,
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 0.5,
        borderColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },
    shiftHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    shiftTitle: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '700',
        color: theme.text
    },
    shiftBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: theme.inputBg
    },
    shiftBadgeText: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '600'
    },
    shiftRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    shiftItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%'
    },
    shiftItemTextWrap: {
        marginLeft: 8
    },
    shiftLabel: {
        fontSize: 12,
        color: theme.textSecondary
    },
    shiftValue: {
        marginTop: 2,
        fontSize: 16,
        fontWeight: '700',
        color: theme.text
    }
});