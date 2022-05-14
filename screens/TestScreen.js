/*
 *
 *
 *
 *
 * Test avec Tesseract
 * Resultats non concluants
 *
 *
 *
 *
 */
import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  ScrollView,
} from 'react-native';
import {auth} from '../firebase';
import {useNavigation} from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {Icon} from 'react-native-elements';
import ProgressCircle from 'react-native-progress/Circle';
import TesseractOcr, {
  LANG_FRENCH,
  LANG_ENGLISH,
  LEVEL_WORD,
  useEventListener,
} from 'react-native-tesseract-ocr';

const TestScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState('image_path');
  const [imageName, setImageName] = useState('image_name');
  const [ocr_result, setOcr] = useState('');
  const [progress, setProgress] = useState(0);

  const tessOptions = {
    whitelist: null,
    blacklist: null,
  };

  useEventListener('onProgressChange', p => {
    setProgress(p.percent / 100);
  });

  const recognizeTextFromImage = path => {
    setIsLoading(true);
    TesseractOcr.recognize(path, LANG_ENGLISH, {}).then(res => {
      console.log('tess = ' + res), setOcr(res);
      setIsLoading(false);
    });
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

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch(error => alert(error.message));
  };

  const handleTesseract = async () => {
    try {
      await recognizeTextFromImage(photo);
    } catch (err) {
      if (err.message !== 'User cancelled image selection') {
        console.error(err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{uri: photo}} style={{width: 300, height: 300}} />
      {/*<Text style={styles.text}>Email : {auth.currentUser?.email}</Text>*/}
      <View style={styles.containerButton}>
        <TouchableOpacity onPress={handleChoosePhoto} style={styles.button}>
          <Icon name="folder-outline" type="ionicon" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleTakePhoto} style={styles.button}>
          <Icon name="camera-outline" type="ionicon" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleTesseract} style={styles.button}>
          <Icon name="search-outline" type="ionicon" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <ProgressCircle showsText progress={progress} />
      <ScrollView>
        <Text style={styles.text}>Résultat : {ocr_result}</Text>
      </ScrollView>
      <TouchableOpacity onPress={handleSignOut} style={styles.buttonLogout}>
        <Icon name="log-out-outline" type="ionicon" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#0782F9',
    width: 65,
    padding: 15,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonLogout: {
    backgroundColor: '#ff2137',
    width: 65,
    padding: 15,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10,
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
