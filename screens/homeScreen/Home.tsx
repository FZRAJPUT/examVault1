import React, { useEffect, useState } from 'react';
import {
  FlatList, Text, TouchableOpacity, Share, View,
  StyleSheet, Linking, RefreshControl, Image, Modal,
  Alert, ActivityIndicator, TextInput
} from 'react-native';
import axios from 'axios';
import Greet from '../../components/Greet';
import getFileSize from '../../utils/getSize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from "react-native-vector-icons/Ionicons";
import SkeletonPDFList from '../../components/SkeletonPDFList';

const Home = ({ route }: any) => {
  const [files, setFiles] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [fileSizes, setFileSizes] = useState<{ [key: string]: string }>({});
  const [details, setDetails] = useState<any>([]);
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");

  const LIMIT = 10;

  // The function to get files, now with caching logic
  const getFiles = async (pageNum = 1, refreshing = false) => {
    try {
      if (!refreshing && pageNum === 1) {
        setIsLoading(true);
        // Try to load from cache first
        const cachedFiles = await AsyncStorage.getItem("cached_files");
        if (cachedFiles) {
          setFiles(JSON.parse(cachedFiles));
        }
      }

      const res = await axios.get(
        `https://upload-pdf-g77m.onrender.com/files?page=${pageNum}&limit=${LIMIT}`
      );

      if (res.data.success) {
        if (pageNum === 1) {
          setFiles(res.data.files);
          // Save the new data to local storage
          await AsyncStorage.setItem("cached_files", JSON.stringify(res.data.files));
        } else {
          setFiles(prev => [...prev, ...res.data.files]);
        }
        setHasMore(res.data.files.length === LIMIT);
      }
    } catch (error: any) {
      Alert.alert("Error fetching files", error.message);
      // Fallback to cache if API call fails
      const cachedFiles = await AsyncStorage.getItem("cached_files");
      if (cachedFiles) {
        setFiles(JSON.parse(cachedFiles));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await getFiles(1, true);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      getFiles(nextPage);
    }
  };

  const getBranchFullForm = (branch: string) => {
    const branchMap: { [key: string]: string } = {
      'ME': 'Mechanical Engineering',
      'CSE': 'Computer Science',
      'CE': 'Civil Engineering',
      'EE': 'Electrical Engineering'
    };
    return branchMap[branch?.toUpperCase()] || branch;
  };



  useEffect(() => {
    getFiles(1);
  }, []);

  useEffect(() => {
    const fetchSizes = async () => {
      const sizes: { [key: string]: string } = {};
      for (const file of files) {
        try {
          const size = await getFileSize(file.url);
          sizes[file.url] = size ? size.toString() : 'Unknown';
        } catch {
          sizes[file.url] = 'Unknown';
        }
      }
      setFileSizes(sizes);
    };

    if (files.length > 0) {
      fetchSizes();
    }
  }, [files]);

  const openPDFOptions = (url: string) => {
    setSelectedPDF(url);
    setModalVisible(true);
  };
  
  const handleViewPDF = () => {
    if (selectedPDF) Linking.openURL(selectedPDF);
    setModalVisible(false);
  };
  
  const handleSharePDF = async () => {
    try {
      if (selectedPDF) {
        await Share.share({
          message: `Check out this PDF: ${selectedPDF}`,
          url: selectedPDF,
        });
      }
    } catch (error) {}
    setModalVisible(false);
  };

  // filter files with search
  const filteredFiles = files.filter(item => {
    const query = search.toLowerCase();
    return (
      item.subject?.toLowerCase().includes(query) ||
      item.branch?.toLowerCase().includes(query) ||
      item.type?.toLowerCase().includes(query)
    );
  });

  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => openPDFOptions(item.url)} style={styles.card}>
      <View style={styles.iconContainer}>
        <Image
          source={require('./pdf.png')}
          style={{ width: 30, height: 30 }}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.filename}>{item.subject}</Text>
        <View style={styles.br}>
          <Text style={styles.type}>
            {fileSizes[item.url] ? fileSizes[item.url] + " KB" : "unavailable"}
          </Text>
          <Text style={styles.type}>{getBranchFullForm(item.branch)}</Text>
        </View>
      </View>
      <Text style={styles.type}>{item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Greet />
      <View style={styles.main}>
        {/* Header with search bar */}
        <View style={styles.header}>
          <Text style={styles.avail}>Available PDF's</Text>
          <TextInput
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor={"#ccc"}
          />
        </View>

        {isLoading && page === 1 ? (
          <SkeletonPDFList />
        ) : (
          <FlatList
            data={filteredFiles}
            keyExtractor={(item) => item._id || item.url}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#007bff']}
                tintColor="#007bff"
              />
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isLoading && page > 1 ? (
                <ActivityIndicator size="small" color="#007bff" style={{ marginVertical: 10 }} />
              ) : null
            }
          />
        )}
      </View>

      {/* Modal for PDF options */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalBtn} onPress={handleViewPDF}>
              <Ionicons name="document-text-outline" size={20} color="#007bff" style={styles.icon} />
              <Text style={styles.modalText}>View PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalBtn} onPress={handleSharePDF}>
              <Ionicons name="share-social-outline" size={20} color="#007bff" style={styles.icon} />
              <Text style={styles.modalText}>Share PDF</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9fb' },
  main: { flex: 1, paddingHorizontal: 15 },
  list: { paddingBottom: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    width: 200,
    backgroundColor: "#fff"
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 11,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    elevation: 1,
    gap: 12
  },
  iconContainer: { marginRight: 12 },
  info: { flex: 1, gap: 3 },
  filename: { fontSize: 12, fontWeight: 'bold', color: '#34495e' },
  avail: { fontSize: 12, fontWeight: 'bold', color: '#34495e' },
  type: { fontSize: 10, color: '#7f8c8d' },
  br: { width: 170, flexDirection: "row", justifyContent: "space-between" },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'flex-end',
    elevation: 1
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  modalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  icon: { marginRight: 10 },
  modalText: { fontSize: 16, fontWeight: '500', color: '#333' },
});

export default Home;