import React, { useState, useEffect } from "react";
import { Box, HStack, Pressable, Center, Icon, Text } from "native-base";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";



const Fooster = ({ selected }: { selected: number }) => {
  const navigation = useNavigation();
  const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
      const fetchRole = async () => {
        const storedRole = await AsyncStorage.getItem("role");
        setRole(storedRole);
      };
  
      fetchRole();
    }, []);
  
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
          opacity={selected === 0 ? 1 : 0.5} 
          py="3" 
          flex={1} 
          onPress={() => {
            navigation.navigate("Activitylist");
          }}
        >
          <Center>
            <Icon 
              mb="1" 
              as={<MaterialCommunityIcons name={selected === 0 ? 'home' : 'home-outline'} />} 
              color="white" 
              size="md" 
            />
            <Text color="white" fontSize="12">
              Home
            </Text>
          </Center>
        </Pressable>

        <Pressable 
          cursor="pointer" 
          opacity={selected === 1 ? 1 : 0.5} 
          py="2" 
          flex={1} 
          onPress={() => {
            navigation.navigate("AttHisory");
          }}
        >
          <Center>
            <Icon 
              mb="1" 
              as={<MaterialIcons name="list" />} 
              color="white" 
              size="md" 
            />
            <Text color="white" fontSize="12">
              History
            </Text>
          </Center>
        </Pressable>
        
        {(role === "admin" || role === "super_admin") && (
        <Pressable 
          opacity={selected === 4 ? 1 : 0.5} 
          py="2" 
          flex={1} 
          onPress={() => navigation.navigate("AdList")}
        >
          <Center>
            <Icon 
              mb="1" 
              as={<MaterialIcons name="list" />} 
              color="white" 
              size="md" 
            />
            <Text color="white" fontSize="12">
              List
            </Text>
          </Center>
        </Pressable>)}

        {(role === "admin" || role === "super_admin") && (
          <Pressable 
            cursor="pointer" 
            opacity={selected === 2 ? 1 : 0.6} 
            py="2" 
            flex={1} 
            onPress={() => {
              navigation.navigate("AdCreate");
            }}
          >
            <Center>
              <Icon 
                mb="1" 
                as={<MaterialCommunityIcons name={selected === 2 ? 'folder' : 'folder-outline'} />} 
                color="white" 
                size="md" 
              />
              <Text color="white" fontSize="12">
                Create
              </Text>
            </Center>
          </Pressable>
        )}



        <Pressable 
          cursor="pointer" 
          opacity={selected === 3 ? 1 : 0.5} 
          py="2" 
          flex={1} 
          onPress={() => {
            navigation.navigate("StudentDetail");
          }}
        >
          <Center>
            <Icon 
              mb="1" 
              as={<MaterialCommunityIcons name={selected === 3 ? 'account' : 'account-outline'} />} 
              color="white" 
              size="md" 
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
