import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";

export default function OddsScreen() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await axios.get("https://api-football-v1.p.rapidapi.com/v3/leagues", {
          headers: {
            "x-rapidapi-key": "1494a4566bmsh2f366aae6248d03p184505jsn57027a5e582a",
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
          },
        });
        setLeagues(response.data.response); // API trả về trong `response.data.response`
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚽ Danh sách giải đấu</Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={leagues}
          keyExtractor={(item) => item.league.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.leagueItem}>
              <Text style={styles.leagueName}>{item.league.name}</Text>
              <Text style={styles.leagueCountry}>🌍 {item.country.name}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  leagueItem: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  leagueName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  leagueCountry: {
    fontSize: 14,
    color: "gray",
  },
});
