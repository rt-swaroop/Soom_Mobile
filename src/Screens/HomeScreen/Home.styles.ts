import { StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";

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
        marginBottom: 20
    },
    locationText: {
        marginLeft: 3,
        fontSize: 16,
        color: COLORS.darkGray
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
    }
});