import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import {auth} from '../firebase';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-elements';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.navigate('Menu', {screen: 'Accueil user'});
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Connecté avec ' + user.email);
      })
      .catch(error => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerSlogan}>
        <Image
          source={require('.././assets/Logo_icon.png')}
          style={{width: 75, height: 75, alignSelf: 'center', marginTop: 50}}
        />
        <Text style={styles.slogan}>
          Scannez. {'\n'}Buvez.{'\n'}Notez.
        </Text>
      </View>
      <KeyboardAvoidingView behavior="padding" enabled>
        <View
          //EMPECHER LE CLAVIER DE VENIR SUR L'INPUT FIELD
          style={styles.containerLogin}>
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
              secureTextEntry
              value={password}
              onChangeText={text => setPassword(text)}
              style={styles.input}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              <Text style={styles.buttonText}>Connexion</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>Pas de compte ?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6d152e',
  },
  containerSlogan: {
    flex: 1,
  },
  slogan: {
    marginTop: 50,
    fontSize: 40,
    paddingHorizontal: '10%',
    fontFamily: 'Afterglow-Regular',
    color: 'white',
  },
  containerLogin: {
    marginTop: '50%',
    paddingTop: 30,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 50,
  },
  inputContainer: {
    height: 50,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
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
    width: '60%',
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
