import React, {useEffect, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {auth} from '../firebase';
import ADMIN1_UID from './config';

const admin_uid = ADMIN1_UID;
const ProfilScreen = () => {
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.navigate('Login');
      })
      .catch(error => alert(error.message));
  };
  const navigation = useNavigation();
  let collection = '';
  const [identifiantUser, setIdentifiantUser] = useState('');
  const [nomUser, setNomUser] = useState('');
  const [prenomUser, setPrenomUser] = useState('');

  async function getUser() {
    if (auth.currentUser.uid === admin_uid) {
      collection = 'admins';
    } else {
      collection = 'utilisateurs';
    }
    const userDocument = await firestore()
      .collection(collection)
      .doc(auth.currentUser.uid)
      .get()
      .then(result => {
        setIdentifiantUser(result._data.Identifiant);
        setNomUser(result._data.Nom);
        setPrenomUser(result._data.Prenom);
      });
  }

  useEffect(() => {
    getUser();
  }, []);

  async function updateProfile(identifiant, nom, prenom) {
    if (auth.currentUser.uid === admin_uid) {
      collection = 'admins';
    } else {
      collection = 'utilisateurs';
    }
    const userDocument = await firestore()
      .collection(collection)
      .doc(auth.currentUser.uid)
      .update({
        Identifiant: identifiant,
        Nom: nom,
        Prenom: prenom,
      })
      .then(result => {
        alert('Profil mis à jour !');
      });
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Image
        source={require('.././assets/Logo.png')}
        style={{
          width: 100,
          height: 100,
          alignSelf: 'center',
          marginBottom: 50,
        }}
      />
      <Text style={styles.header}>Mon Profil</Text>
      <View style={styles.inputContainer}>
        <Icon
          name="person-outline"
          type="ionicon"
          size={20}
          color="rgba(0,0,0,0.5)"
          style={styles.iconInput}
        />
        <TextInput
          placeholder="Identifiant"
          placeholderTextColor="#b3b3b3"
          value={identifiantUser}
          onChangeText={text => setIdentifiantUser(text)}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon
          name="person-outline"
          type="ionicon"
          size={20}
          color="rgba(0,0,0,0.5)"
          style={styles.iconInput}
        />
        <TextInput
          placeholder="Nom"
          placeholderTextColor="#b3b3b3"
          value={nomUser}
          onChangeText={text => setNomUser(text)}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon
          name="person-outline"
          type="ionicon"
          size={20}
          color="rgba(0,0,0,0.5)"
          style={styles.iconInput}
        />
        <TextInput
          placeholder="Prénom"
          placeholderTextColor="#b3b3b3"
          value={prenomUser}
          onChangeText={text => setPrenomUser(text)}
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          updateProfile(identifiantUser, nomUser, prenomUser);
        }}
        style={styles.button}>
        <Text style={styles.buttonText}>Mettre à jour les informations</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignOut}>
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default ProfilScreen;

const styles = StyleSheet.create({
  logoutText: {
    color: 'rgba(0,0,0,0.5)',
    marginTop: 5,
    fontFamily: 'Afterglow-Regular',
  },
  header: {
    color: '#6d152e',
    fontSize: 25,
    fontFamily: 'Afterglow-Regular',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  inputContainer: {
    height: 50,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    borderBottomWidth: 0.5,
    borderRadius: 0,
    marginBottom: 20,
  },
  input: {
    color: 'black',
    width: '100%',
    padding: 0,
  },
  iconInput: {
    marginRight: 15,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    marginTop: 50,
    backgroundColor: '#6d152e',
    width: '100%',
    padding: 15,
    borderRadius: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'ProductSans-Thin',
  },
});
