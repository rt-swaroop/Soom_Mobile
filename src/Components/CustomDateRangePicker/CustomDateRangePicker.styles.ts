import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../theme/colors";

const { width } = Dimensions.get('window');

export const createStyles = (theme: any) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: width * 0.9,
        backgroundColor: theme.cardBg,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        backgroundColor: COLORS.primary,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.white,
        letterSpacing: 0.5,
    },
    navBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarBody: {
        padding: 15,
    },
    weekDaysRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    weekDayText: {
        width: `${100 / 7}%`,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '700',
        color: theme.textSecondary,
        textTransform: 'uppercase',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: `${100 / 7}%`,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 2,
    },
    dayText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.text,
    },
    notInMonthText: {
        color: theme.textSecondary + '40',
    },
    todayCell: {
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        borderRadius: 10,
    },
    selectedDay: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
    },
    selectedDayText: {
        color: COLORS.white,
        fontWeight: '800',
    },
    inRangeDay: {
        backgroundColor: COLORS.primary + '20',
        borderRadius: 0,
    },
    rangeStart: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        backgroundColor: COLORS.primary,
    },
    rangeEnd: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: COLORS.primary,
    },
    footer: {
        flexDirection: 'row',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'flex-end',
    },
    footerBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        marginLeft: 10,
    },
    cancelBtn: {
        backgroundColor: 'transparent',
    },
    applyBtn: {
        backgroundColor: COLORS.primary,
    },
    btnText: {
        fontSize: 14,
        fontWeight: '700',
    },
    cancelBtnText: {
        color: theme.textSecondary,
    },
    applyBtnText: {
        color: COLORS.white,
    },
    summaryContainer: {
        padding: 15,
        backgroundColor: theme.background,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    summaryItem: {
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.textSecondary,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 13,
        fontWeight: '800',
        color: theme.text,
    },
});
