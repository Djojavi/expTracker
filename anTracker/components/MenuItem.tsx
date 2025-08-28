import { Link, RelativePathString } from "expo-router"
import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native"

type MenuProps = {
    source: ImageSourcePropType,
    href: RelativePathString,
    text: string,
    screenName: string
}
export const MenuItem: React.FC<MenuProps> = ({ source, href, text, screenName }) => {
    return (
        <Link href={href} style={styles.link}>
            <View style={[styles.menuItem, screenName===text ? styles.menuItemActive: styles.menuItemInactive]}>
                <Image
                    style={styles.icon}
                    source={source}
                />
                <Text style={styles.menuText}>{text}</Text>
            </View>
        </Link>
    )
}

const styles = StyleSheet.create({
    link: {
        marginVertical: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 15,
        width: '90%',
    },
    menuItemActive: {
        backgroundColor: '#d6d6d6ff',
    },
    menuItemInactive:{
        backgroundColor: '#f9f9f9',
    },
    icon: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
        marginRight: 12,
    },
    menuText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
    },
})