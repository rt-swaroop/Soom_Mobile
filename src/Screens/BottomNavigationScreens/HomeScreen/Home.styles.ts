import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 20
    },
    attendanceCard: {
        marginTop: 10,
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5
    },
    timeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary
    },
    dateText: {
        fontSize: 16,
        color: COLORS.darkGray,
        marginVertical: 10
    },
    attendanceButtonContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        shadowColor: COLORS.black,
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
        color: COLORS.darkGray,
        textAlign: 'center',
    },
    dashedLine: {
        width: '100%',
        height: 1,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.darkGray,
        borderStyle: 'dashed',
        marginVertical: 5
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
        color: COLORS.primaryDark,
        marginTop: 5,
        textTransform: 'uppercase',
    },
    actionText: {
        fontSize: 14,
        color: COLORS.darkGray,
        marginTop: 5,
    },
    shiftCard: {
        marginTop: 16,
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3
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
        color: COLORS.primaryDark
    },
    shiftBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#eef3ff'
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
        color: COLORS.darkGray
    },
    shiftValue: {
        marginTop: 2,
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primaryDark
    }
});