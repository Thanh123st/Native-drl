import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Button, Card } from 'native-base';
import HeaderComponent from '../../component/View/Header';
import Fooster from '../../component/View/Fooster';
const TermsAndPrivacyScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Điều khoản sử dụng */}
      <HeaderComponent></HeaderComponent>
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>Điều khoản sử dụng</Text>
        </View>
        <View style={styles.cardBody}>
          <Text>
            Chào mừng bạn đến với ứng dụng điểm danh hoạt động rèn luyện của sinh viên trường Đại học Kỹ thuật - Công nghệ Cần Thơ. Việc sử dụng ứng dụng này có nghĩa là bạn đồng ý với các điều khoản và điều kiện được nêu dưới đây. Nếu bạn không đồng ý với các điều khoản này, vui lòng không sử dụng ứng dụng.
          </Text>
          <Text style={styles.subTitle}>1. Quyền sử dụng ứng dụng</Text>
          <Text>
            Ứng dụng này cung cấp các chức năng điểm danh, quản lý hoạt động rèn luyện và theo dõi quá trình học tập của sinh viên. Người dùng được cấp quyền sử dụng ứng dụng cho mục đích cá nhân và không được phép sao chép, sửa đổi, phân phối hoặc sử dụng ứng dụng vào các mục đích thương mại mà không có sự đồng ý của nhà phát triển.
          </Text>
          <Text style={styles.subTitle}>2. Trách nhiệm của người dùng</Text>
          <Text>
            Người dùng cam kết sử dụng ứng dụng đúng mục đích, không vi phạm pháp luật hoặc các quy định của trường Đại học Kỹ Thuật - Công Nghệ Cần Thơ. Mọi hành vi gian lận, lợi dụng ứng dụng để giả mạo điểm danh hoặc vi phạm các quy định khác sẽ bị xử lý theo quy định của nhà trường và pháp luật.
          </Text>
          <Text style={styles.subTitle}>3. Quyền sở hữu trí tuệ</Text>
          <Text>
            Tất cả quyền sở hữu trí tuệ liên quan đến ứng dụng, bao gồm nhưng không giới hạn ở phần mềm, giao diện người dùng, cơ sở dữ liệu, hình ảnh, biểu tượng, logo đều thuộc về trường Đại học Kỹ thuật - Công nghệ Cần Thơ và được bảo vệ bởi các quy định pháp lý hiện hành.
          </Text>
          <Text style={styles.subTitle}>4. Điều chỉnh và cập nhật</Text>
          <Text>
          Chúng tôi có quyền điều chỉnh, thay đổi hoặc cập nhật các điều khoản sử dụng mà không cần thông báo trước. Mọi thay đổi sẽ có hiệu lực ngay khi được công bố trong ứng dụng.          
          </Text>
          
        </View>
      </Card>

      {/* Chính sách bảo mật */}
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>Chính sách bảo mật</Text>
        </View>
        <View style={styles.cardBody}>
          <Text>
            Chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của người dùng khi sử dụng ứng dụng điểm danh hoạt động rèn luyện. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.
          </Text>
          <Text style={styles.subTitle}>1. Thông tin chúng tôi thu thập</Text>
          <Text>
            Khi bạn sử dụng ứng dụng, chúng tôi có thể thu thập các loại thông tin sau: thông tin cá nhân, dữ liệu điểm danh, thông tin thiết bị và các dữ liệu liên quan khác.
          </Text>
          <Text style={styles.subTitle}>2. Cách chúng tôi sử dụng thông tin</Text>
          <Text>
            Thông tin thu thập sẽ được sử dụng để cung cấp dịch vụ điểm danh và theo dõi hoạt động rèn luyện của sinh viên, cải thiện trải nghiệm người dùng và phát triển các tính năng mới.
          </Text>
          <Text style={styles.subTitle}>3. Chia sẻ thông tin</Text>
          <Text>
            Chúng tôi cam kết không chia sẻ thông tin cá nhân của người dùng với bất kỳ bên thứ ba nào, trừ khi có yêu cầu từ cơ quan nhà nước có thẩm quyền hoặc để bảo vệ quyền lợi của sinh viên và nhà trường.
          </Text>
          <Text style={styles.subTitle}>4. Bảo mật dữ liệu</Text>
          <Text>
          Chúng tôi áp dụng các biện pháp bảo mật hợp lý để bảo vệ thông tin cá nhân của bạn khỏi mất mát, truy cập trái phép hoặc tiết lộ. Tuy nhiên, không có phương thức truyền tải dữ liệu qua Internet nào là hoàn toàn an toàn, do đó chúng tôi không thể đảm bảo tuyệt đối an toàn cho dữ liệu của bạn.
          </Text>
          <Text style={styles.subTitle}>5. Quyền lợi của người dùng</Text>
          <Text>
          Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân mà chúng tôi đang lưu trữ. Nếu bạn muốn thực hiện các quyền này, vui lòng liên hệ với chúng tôi.
          </Text>
          <Text style={styles.subTitle}>6. Điều chỉnh và cập nhật chính sách bảo mật</Text>
          <Text>
          Chúng tôi có thể cập nhật chính sách bảo mật này khi cần thiết. Mọi thay đổi sẽ được công bố trong ứng dụng và có hiệu lực ngay khi được cập nhật.
          </Text>
        </View>
      </Card>
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>Liên hệ</Text>
        </View>
        <View style={styles.cardBody}>
          <Text>
          Nếu bạn có bất kỳ câu hỏi nào liên quan đến các điều khoản sử dụng, vui lòng liên hệ với chúng tôi qua địa chỉ email: Elementtracschool@gmail.com     
          </Text>          
        </View>
      </Card>

      {/* Nút chấp nhận */}
      <View style={styles.buttonContainer}>
        <Button onPress={() => alert('Chấp nhận điều khoản')}>
          <Text>Đồng ý</Text>
        </Button>
      </View>
      <Fooster></Fooster>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  cardHeader: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cardBody: {
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subTitle: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default TermsAndPrivacyScreen;
