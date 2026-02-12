import { StyleSheet, Dimensions } from "react-native";
import { Theme } from "../../../theme/useAppTheme";
import { COLORS } from "../../../theme/colors";

const { width } = Dimensions.get("window");

export const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    header: {
        padding: 16,
        paddingBottom: 8,
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
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.background,
        paddingHorizontal: 12,
        borderRadius: 12,
        height: 48,
        borderWidth: 1,
        borderColor: theme.glassCardBorder,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: theme.text,
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
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 2,
        borderColor: COLORS.primary + '20',
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
    roleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    roleText: {
        fontSize: 12,
        color: theme.textSecondary,
        fontWeight: '500',
    },
    officeBadge: {
        marginTop: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    officeText: {
        fontSize: 11,
        color: COLORS.primary,
        fontWeight: '600',
        marginLeft: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusDotActive: {
        backgroundColor: '#4CAF50',
    },
    statusDotInactive: {
        backgroundColor: '#F44336',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalOverlayTouch: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: theme.cardBg,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        maxHeight: '85%',
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    dragHandleContainer: {
        alignItems: 'center',
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: theme.glassCardBorder,
        borderRadius: 2,
        marginBottom: 20,
    },
    modalAvatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: COLORS.primary,
        marginBottom: 12,
    },
    modalName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.text,
    },
    modalRole: {
        fontSize: 14,
        color: theme.textSecondary,
        marginTop: 4,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.text,
        marginBottom: 12,
    },
    detailGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    detailItem: {
        width: (width - 60) / 2,
        backgroundColor: theme.background,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.glassCardBorder,
    },
    detailLabel: {
        fontSize: 11,
        color: theme.textSecondary,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.text,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.background,
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: theme.glassCardBorder,
    },
    contactIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    contactInfo: {
        flex: 1,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 80,
    },
    emptyIcon: {
        marginBottom: 10,
    },
    emptyText: {
        color: theme.textSecondary,
        fontSize: 16,
    },
    experienceCard: {
        backgroundColor: theme.background,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.glassCardBorder,
    },
    expHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    expTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.text,
        flex: 1,
    },
    expDate: {
        fontSize: 11,
        color: COLORS.primary,
        fontWeight: '600',
    },
    expCompany: {
        fontSize: 12,
        color: theme.textSecondary,
    },
    educationItem: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    eduIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    eduContent: {
        flex: 1,
    },
    eduTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.text,
    },
    eduInstitution: {
        fontSize: 12,
        color: theme.textSecondary,
        marginTop: 2,
    },
    eduFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    eduYear: {
        fontSize: 11,
        color: theme.textSecondary,
        fontWeight: '600',
    },
    eduPercent: {
        fontSize: 11,
        color: COLORS.primary,
        fontWeight: '700',
    },
    addressBox: {
        backgroundColor: theme.background,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.glassCardBorder,
        marginTop: 12,
    },
    addressText: {
        fontSize: 13,
        color: theme.text,
        lineHeight: 20,
    },
    emergencyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF525208',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FF525220',
    },
    emergencyIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FF525215',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    emergencyInfo: {
        flex: 1,
    },
    emergencyName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.text,
    },
    emergencyRelation: {
        fontSize: 12,
        color: '#FF5252',
        fontWeight: '600',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    callBtn: {
        backgroundColor: '#4CAF50',
    },
    emailBtn: {
        backgroundColor: COLORS.primary,
    },
    actionBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 15,
    }
});
