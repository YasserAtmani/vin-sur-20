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

import {auth} from '../firebase';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {Icon} from 'react-native-elements';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [identifiant, setIdentifiant] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.navigate('Menu', {screen: 'Accueil user'});
      }
    });
    return unsubscribe;
  }, []);

  async function handleSignUp() {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        firestore()
          .collection('utilisateurs')
          .doc(userCredentials.user.uid)
          .set({
            Identifiant: identifiant,
            Nom: nom,
            Prenom: prenom,
          });
        const user = userCredentials.user;
        console.log('Inscrit avec ' + user.email);
      })
      .catch(error => alert(error.message));
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView enabled>
        <View>
          <Image
            source={require('.././assets/Logo.png')}
            style={{
              width: 100,
              height: 100,
              alignSelf: 'center',
              marginBottom: 50,
            }}
          />
          <View style={styles.inputContainer}>
            <Icon
              name="mail-outline"
              type="ionicon"
              size={20}
              color="rgba(0,0,0,0.5)"
              style={styles.iconInput}
            />
            <TextInput
              placeholder="E-mail"
              keyboardType="email-address"
              placeholderTextColor="#b3b3b3"
              value={email}
              onChangeText={text => setEmail(text)}
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon
              name="key-outline"
              type="ionicon"
              size={20}
              color="rgba(0,0,0,0.5)"
              style={styles.iconInput}
            />
            <TextInput
              placeholder="Mot de passe"
              placeholderTextColor="#b3b3b3"
              value={password}
              onChangeText={text => setPassword(text)}
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
              placeholder="Identifiant"
              placeholderTextColor="#b3b3b3"
              value={identifiant}
              onChangeText={text => setIdentifiant(text)}
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
              value={nom}
              onChangeText={text => setNom(text)}
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
              value={prenom}
              onChangeText={text => setPrenom(text)}
              style={styles.input}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleSignUp} style={styles.button}>
              <Text style={styles.buttonText}>Inscription</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.registerText}>Déjà un compte ?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  slogan: {
    marginTop: 50,
    fontSize: 40,
    paddingHorizontal: '10%',
    fontFamily: 'Afterglow-Regular',
    color: 'white',
  },
  containerLogin: {
    marginTop: '100%',
    paddingTop: 30,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 50,
    width: '100%',
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
    backgroundColor: '#6d152e',
    width: '80%',
    padding: 15,
    borderRadius: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'ProductSans-Thin',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontSize: 16,
  },
  registerText: {
    color: 'rgba(0,0,0,0.5)',
    marginTop: 5,
    fontFamily: 'Afterglow-Regular',
  },
});
