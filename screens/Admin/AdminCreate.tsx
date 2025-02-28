import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Alert, StyleSheet, SafeAreaView ,TouchableOpacity , Modal} from "react-native";
import { Select, CheckIcon, Button } from "native-base";
import { getCurrentLocation } from "../../component/locationService";
import { AuthContext } from "../../Context/Authcontext";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Checkbox } from "native-base";
import Icon from "react-native-vector-icons/MaterialIcons"; // Chọn icon phù hợp
import MapScreen from "../../component/View/MapScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
const AdminCreate: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const[category,SetCategory]= useState([]);
  
  const navigation = useNavigation();
  const handleCheckboxChange = (value) => {
    SetCategory((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const onChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShow(true);
    setDate(currentDate);
    setFormattedDate(currentDate.toISOString());
  };

  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const[type,SetType]= useState<string>("");
  const[level,SetLevel]= useState<string>("");
  const [groupId,SetgroupId] = useState<string>("");
  const [locationPost,setLocationPost] = useState<any>(null);

  const [groupList, setGroupList] = useState([]);

  const fetchGroupAdminList = async () => {
    try {
      const response = await axios.get(`${apiUrl}/group-admin/list`);
      if (response.data && Array.isArray(response.data)) {
        const clubList = response.data.map(item => ({
          id: item._id,
          name: item.name
        }));
        setGroupList(clubList); // Lưu danh sách nhóm vào state
        console.log("Danh sách nhóm:", clubList);
      } else {
        console.error("Dữ liệu trả về không hợp lệ:", response.data);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchGroupAdminList();
  }, []);

  const { apiUrl, token } = authContext;

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    setShow(false); // Đóng modal sau khi chọn ngày
  };

  useEffect(() => {
    getCurrentLocation()
      .then(setLocation)
      .catch((error) => setErrorMsg(error.message));
  }, []);
  console.log("đia chỉ",JSON.stringify(location));

  const handleSubmit = async () => {
    
    setLocationPost(JSON.stringify(location));
    const lati = await AsyncStorage.getItem('Latitude');
    const long = await AsyncStorage.getItem('Longitude');
    const payload = {
      name,
      description,
      date,
      locations: [
        { lat: lati, lon: long, radius: 20 } // Vị trí
      ],
      type,
      level,
      category,
      groupId,

    };

    try {
      console.log("TATATSAETDR",payload);
      const response = await fetch(`${apiUrl}/api/superadmin/activity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Thành công", "Hoạt động đã được tạo!");
      } else {
        Alert.alert("Lỗi", data.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối đến server.");
      console.error(error);
    }
  };

  const [isOpen, setIsOpen] = React.useState(false);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
      <Text style={styles.label}>Tên hoạt động:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nhập tên hoạt động"
      />

      <Text style={styles.label}>Mô tả:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Nhập mô tả"
      />

      <Text style={styles.label}>Ngày:</Text>
      

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => setShow(true)} style={{ flexDirection:"row", padding: 10 }}>
          <FontAwesome name="calendar" size={20} color="black" />
          <Text style={{ paddingLeft: 5 }}>{date.toLocaleString()}</Text>
        </TouchableOpacity>

        {/* Modal DateTime Picker */}
        <DateTimePickerModal
          isVisible={show}
          mode="datetime"
          display="default"
          onConfirm={handleConfirm}
          onCancel={() => setShow(false)}
        />
      </View>


      <Text style={styles.label}>Loại:</Text>
      <Select selectedValue={type} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="5" />
      }} mt={1} onValueChange={itemValue => SetType(itemValue)}>
          <Select.Item label="Chính trị" value="political" />
          <Select.Item label="Xã hội" value="social" />
          <Select.Item label="Thể thao" value="sports" />
          <Select.Item label="Tình nguyện" value="volunteer" />
          <Select.Item label="Khác" value="other" />
        </Select>
      
      <Text style={styles.label}>Cấp:</Text>
      <Select selectedValue={level} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="3" />
      }} mt={1} onValueChange={itemValue => SetLevel(itemValue)}>
          <Select.Item label="Trường học" value="school" />
          <Select.Item label="Thành phố" value="city" />
          <Select.Item label="Quốc gia" value="national" />
        </Select>
      
        <Text style={styles.label}>Đơn vị:</Text>
      <Select selectedValue={groupId} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="3" />
      }} mt={1} onValueChange={itemValue => SetgroupId(itemValue)}>
          
          {groupList.map((item, index) => (
          <Select.Item key={index} label={item.name} value={item.id} />
          ))}
        </Select>

      <Text style={styles.label}>Mục:</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, margin: 10, marginLeft: 0 }}>
      {[
        { label: "Câu lạc bộ, hoạt động học thuật, nghiên cứu khoa học", value: "1b" },
        { label: "Hoạt động chính trị, xã hội, văn hóa, văn nghệ, thể thao", value: "3a" },
        { label: "Tình nguyện, công ích, công tác xã hội", value: "3b" },
        { label: "Tuyên truyền, phòng chống tội phạm, tệ nạn xã hội", value: "3c" },
        { label: "Phong trào Lớp, Đoàn, Hội, công tác đoàn thể xã hội", value: "5a" },
      ].map((item) => (
        <View key={item.value} style={{ flexDirection: "row", alignItems: "center" }}>
          <Checkbox
            value={item.value}
            size="md"
            isChecked={category.includes(item.value)}
            onChange={() => handleCheckboxChange(item.value)}
            colorScheme="blue"
          />
          <Text style={{ marginLeft: 5 }}>{item.label}</Text>
        </View>
      ))}
      
    </View>

    <View>
    <TouchableOpacity 
      style={{ 
        flexDirection: "row", 
        alignItems: "center", 
        padding: 10, 
        borderRadius: 8 ,
        justifyContent: "center",
        marginVertical: 10
      }} 
      onPress={() => setIsOpen(true)}
    >
      <Icon name="map" size={25} color="#0066CC" />
      <Text style={{ color: "#0066CC", marginLeft: 8, fontWeight: "bold", fontSize: 18 }}>Mở Bản Đồ</Text>
    </TouchableOpacity>
    
    <Modal visible={isOpen} animationType="slide" transparent={true}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
        <View style={{ width: "90%", height: "80%", backgroundColor: "white", borderRadius: 10, padding: 10 }}>
          <MapScreen onClose={() => setIsOpen(false)} />
        </View>
      </View>
    </Modal>
  </View>


      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
      {/* Button "Tạo hoạt động" có chiều rộng 60% */}
      <Button
        onPress={handleSubmit}
        style={{ width: '60%',backgroundColor: "#0066CC" }}
      >Tạo hoạt động</Button>
      {/* Button "Quay lại" có chiều rộng 30% */}
      <Button
        onPress={() => navigation.goBack()}
        style={{ width: '35%' , backgroundColor: "#0066CC"}}
      >Quay lại</Button>
    </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    marginTop: 20
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "white"
  },
  
});

export default AdminCreate;
