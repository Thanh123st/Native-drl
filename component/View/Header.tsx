import React from "react";
import { View, Text, Image, Box, Menu, Pressable } from "native-base";
import { SafeAreaView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet } from "react-native";

const HeaderComponent = () => {
    return (
        <View style={styles.safeAreaContainer}>
            <Box style={styles.headerContainer}>
            <SafeAreaView style={{ flexDirection: 'row' }}>
                {/* Left side: Image and Text */}
                <View style={styles.imageContainer}>
                    <Image 
                        source={require('../../assets/picture/th.jpg')} 
                        alt="University Logo" 
                        style={styles.image}
                    />
                    <Text style={styles.text}>Element - Trac Sofwaer</Text>
                </View>

                {/* Right side: Bell Icon */}
                <View style={styles.iconContainer}>
                    <Box w="90%" alignItems="center">
                        <Menu w="190" trigger={triggerProps => {
                        return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                                <Icon name="bell" size={30} color="white" />
                                </Pressable>;
                        }} placement="bottom left">
                            <Menu.Item>Arial</Menu.Item>
                            <Menu.Item isDisabled>Sofia</Menu.Item>
                            <Menu.Item>Cookie</Menu.Item>
                        </Menu>
                    </Box>
                </View>
                </SafeAreaView>
            </Box>
        </View>
    );
};

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#0066CC",
        padding: 10,
        paddingTop: 20,
        justifyContent: 'space-between',
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    image: {
        width: 40, 
        height: 40, 
        borderRadius: 100,
    },
    text: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10, 
    },
    iconContainer: {
        marginLeft: 10,
    },
});

export default HeaderComponent;
