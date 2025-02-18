import React, { useState } from "react";
import { Box, HStack, Pressable, Center, Icon, Text } from "native-base";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Fooster = () => {
  const [selected,SetSelected] = useState(0);
  const navigation = useNavigation();
  const [currentSelected, setCurrentSelected] = useState(selected || 0); // Đảm bảo giá trị mặc định là 0

  return (
    <Box flex={1} bg="" safeAreaTop width="100%" alignSelf="center" style={{
      position: 'absolute', // Đặt footer cố định ở dưới cùng
      bottom: 0, // Cố định footer ở cuối màn hình
      width: '100%' // Đảm bảo footer chiếm hết chiều rộng màn hình
    }}>
      

      {/* Footer */}
      <HStack 
        bg="#0066CC" 
        alignItems="center" 
        safeAreaBottom 
        shadow={6} 
        justifyContent="space-around"
      >
        <Pressable 
          cursor="pointer" 
          opacity={currentSelected === 0 ? 1 : 0.5} 
          py="3" 
          flex={1} 
          onPress={() => {
            setCurrentSelected(0);
            navigation.navigate("Activitylist");
          }}
        >
          <Center>
            <Icon 
              mb="1" 
              as={<MaterialCommunityIcons name={currentSelected === 0 ? 'home' : 'home-outline'} />} 
              color="white" 
              size="sm" 
            />
            <Text color="white" fontSize="12">
              Home
            </Text>
          </Center>
        </Pressable>

        <Pressable 
          cursor="pointer" 
          opacity={currentSelected === 1 ? 1 : 0.5} 
          py="2" 
          flex={1} 
          onPress={() => {
            setCurrentSelected(1);
            navigation.navigate("AttHisory");
          }}
        >
          <Center>
            <Icon 
              mb="1" 
              as={<MaterialIcons name="search" />} 
              color="white" 
              size="sm" 
            />
            <Text color="white" fontSize="12">
              Search
            </Text>
          </Center>
        </Pressable>

        <Pressable 
          cursor="pointer" 
          opacity={currentSelected === 2 ? 1 : 0.6} 
          py="2" 
          flex={1} 
          onPress={() => {
            setCurrentSelected(2);
            navigation.navigate("AdCreate");
          }}
        >
          <Center>
            <Icon 
              mb="1" 
              as={<MaterialCommunityIcons name={currentSelected === 2 ? 'cart' : 'cart-outline'} />} 
              color="white" 
              size="sm" 
            />
            <Text color="white" fontSize="12">
              Cart
            </Text>
          </Center>
        </Pressable>

        <Pressable 
          cursor="pointer" 
          opacity={currentSelected === 3 ? 1 : 0.5} 
          py="2" 
          flex={1} 
          onPress={() => {
            setCurrentSelected(3);
            navigation.navigate("StudentDetail");
          }}
        >
          <Center>
            <Icon 
              mb="1" 
              as={<MaterialCommunityIcons name={currentSelected === 3 ? 'account' : 'account-outline'} />} 
              color="white" 
              size="sm" 
            />
            <Text color="white" fontSize="12">
              Account
            </Text>
          </Center>
        </Pressable>
      </HStack>
    </Box>
  );
};

export default Fooster;
