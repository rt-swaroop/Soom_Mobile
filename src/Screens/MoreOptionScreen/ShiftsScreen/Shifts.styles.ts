import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    weekHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingVertical: 12,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    weekText: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.primary,
    },
    navButton: {
        backgroundColor: COLORS.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        borderRadius: 12,
        backgroundColor: '#fff',
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardTitle: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        flex: 1,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#eef2ff',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primary,
    },
    cardHeaderGradient: {
        padding: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    headerTextContainer: {
        marginLeft: 8,
        flex: 1,
    },
    cardTitleWhite: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
    },
    cardDateWhite: {
        fontSize: 12,
        color: COLORS.white,
        opacity: 0.9,
        marginTop: 2,
    },
    cardDate: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    holidayBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    weekOffBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    badgeTextWhite: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.white,
    },
    cardBody: {
        padding: 16,
    },
    holidayContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    holidayTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    holidayText: {
        fontSize: 14,
        color: '#6b7280',
        fontStyle: 'italic',
    },
    weekOffContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    weekOffTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    weekOffText: {
        fontSize: 14,
        color: '#6b7280',
        fontStyle: 'italic',
    },
    emptyCard: {
        opacity: 0.6,
    },
    shiftHeaderGradient: {
        padding: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    activeBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    timeBox: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    timeBoxContent: {
        marginLeft: 8,
        alignItems: 'center',
    },
    timeLabel: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '600',
    },
    timeValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        marginTop: 4,
    },
    timeDivider: {
        width: 1,
        height: '80%',
        backgroundColor: '#e5e7eb',
        marginHorizontal: 15,
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    durationText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#6b7280',
    },
    durationValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1f2937',
    },
})