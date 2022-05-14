import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {auth} from '../firebase';

const HomeScreen = () => {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [vins, setVins] = useState([]); // Initial empty array of wines
  const navigation = useNavigation();

  useEffect(() => {
    const subscriber = firestore()
      .collection('vins')
      .onSnapshot(querySnapshot => {
        const vins = [];
        querySnapshot.forEach(documentSnapshot => {
          console.log(documentSnapshot.id);
          vins.push({
            key: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });

        setVins(vins);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber;
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>VINS ({vins.length})</Text>
      <FlatList
        style={{flex: 1, alignSelf: 'center'}}
        data={vins}
        nestedScrollEnabled
        numColumns={2}
        keyExtractor={item => item.key}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Image source={{uri: item.Photo}} style={styles.imageItem} />
            <TouchableOpacity
              style={styles.buttonItem}
              onPress={() => {
                navigation.navigate('Détails user', {vin_id: item.key});
              }}>
              <Icon
                name="search-outline"
                type="ionicon"
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6d152e',
  },
  imageItem: {
    width: 150,
    height: 150,
  },
  item: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    margin: 5,
    padding: 15,
  },
  header: {
    marginLeft: 20,
    marginTop: 15,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Afterglow-Regular',
  },
  containerButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonItem: {
    backgroundColor: '#6d152e',
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonMenu: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 16,
    marginTop: 16,
  },
});
