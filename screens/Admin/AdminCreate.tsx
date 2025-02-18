import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import { Select, CheckIcon, Button } from "native-base";
import { getCurrentLocation } from "../../component/locationService";
import { AuthContext } from "../../Context/Authcontext";
import DateTimePicker from '@react-native-community/datetimepicker';
import MapScreen from "../../component/View/MapScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';


const AdminCreate: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  const onChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setFormattedDate(currentDate.toISOString());  // Định dạng ngày theo ISO
  };

  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const[type,SetType]= useState<string>("");
  const[level,SetLevel]= useState<string>("");
  const[category,SetCategory]= useState<string>("");

  const [locationPost,setLocationPost] = useState<any>(null);
  const { apiUrl, token } = authContext;
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
      category

    };

    try {
      console.log("TATATSAETDR",payload);
      const response = await fetch(`${apiUrl}/api/superadmin/activity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YjQxYWU5ZjM1OTFjMDc4MTM1NzBkYyIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Mzk4NTk0MjAsImV4cCI6MTczOTk0NTgyMH0.I_yIus4zzi00C86g9m_z2Xi2md036aWQZPbLnuA5mds`
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

  return (
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
      <Button onPress={() => setShow(!show)} style={{ marginTop: 10 }}>
        <Text>Chọn ngày giờ</Text>
      </Button>

      {show && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={onChange}
        />
      )}

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

      <Text style={styles.label}>Mục:</Text>
      <Select selectedValue={category} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="2" />
      }} mt={1} onValueChange={itemValue => SetCategory(itemValue)}>
          <Select.Item label="3b" value="3b" />
          <Select.Item label="3c" value="3c" />
        </Select>

      <MapScreen></MapScreen>

      <Button onPress={handleSubmit} >Tạo hoạt động</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9"
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "white"
  }
});

export default AdminCreate;
