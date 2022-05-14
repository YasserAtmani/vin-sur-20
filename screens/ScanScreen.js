import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  ImageBackground,
} from 'react-native';
import {auth} from '../firebase';
import {useNavigation} from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {Icon} from 'react-native-elements';
import MlkitOcr from 'react-native-mlkit-ocr';
import firestore from '@react-native-firebase/firestore';
import ADMIN1_UID from './config';

const ScanScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState('image_path');
  const [imageName, setImageName] = useState('image_name');
  const [ocr, setOCR] = useState([]);
  const [sizeDoc, setSizeDoc] = useState(null);

  const scanFunction = path => {
    if (path == 'image_path') {
      alert('Aucun fichier à scanner, veuillez réessayer.');
      return;
    }
    setIsLoading(true);
    MlkitOcr.detectFromUri(path).then(res => {
      const temp = [];
      res.forEach(result => {
        let str = result.text
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace('\n', ' ');
        const temp2 = str.split(' ');
        temp2.forEach(t => {
          temp.push(t);
        });
        setOCR(temp);
        console.log(ocr);
      });
      for (let i = 0; i < temp.length; i++) {
        firestore()
          .collection('vins')
          .where('Keywords', 'array-contains', temp[i])
          .get()
          .then(documentSnapshot => {
            if (documentSnapshot.size == 1) {
              setSizeDoc(1);
              documentSnapshot.forEach(doc => {
                if (auth.currentUser.uid == ADMIN1_UID) {
                  navigation.navigate('Détails Admin', {vin_id: doc.id});
                } else {
                  navigation.navigate('Détails user', {vin_id: doc.id});
                }
              });
            } else {
              setSizeDoc(0);
            }
          });
      }
      if (sizeDoc == 0) {
        alert('Aucun vin détecté, veuillez reprendre une photo correcte !');
      }
    });
    setIsLoading(false);
  };

  const handleChoosePhoto = () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 1,
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (!response.didCancel) {
        setPhoto(response.assets[0].uri);
        console.log('response', response.assets[0].uri);
      }
    });
  };

  const handleTakePhoto = () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 1,
    };
    ImagePicker.launchCamera(options, response => {
      if (!response.didCancel) {
        setPhoto(response.assets[0].uri);
        console.log('response', response.assets[0].uri);
      }
    });
  };

  const handleFirebase = async () => {
    const reference = storage().ref(imageName);
    await reference.putFile(photo);
  };

  const handleOcr = async () => {
    try {
      await scanFunction(photo);
    } catch (err) {
      if (err.message !== 'User cancelled image selection') {
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Text
        style={{
          position: 'absolute',
          color: '#6d152e',
          fontFamily: 'ProductSans-Light',
          fontSize: 20,
        }}>
        Veuillez choisir ou prendre une photo à scanner.
      </Text>
      <ImageBackground
        source={{uri: photo}}
        style={{width: '100%', height: '100%'}}
      />
      <View style={styles.containerButton}>
        <TouchableOpacity onPress={handleChoosePhoto} style={styles.button}>
          <Icon name="folder-outline" type="ionicon" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleTakePhoto} style={styles.button}>
          <Icon name="camera-outline" type="ionicon" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOcr} style={styles.button}>
          <Icon name="search-outline" type="ionicon" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  containerButton: {
    position: 'absolute',
    top: '65%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#6d152e',
    width: 65,
    padding: 15,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 40,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  text: {
    color: 'black',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
