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
import ADMIN1_UID from './config';
import {Screen} from 'react-native-screens';

const admin_uid = ADMIN1_UID;

const DetailsVinScreen = ({route}) => {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [vin, setVin] = useState([]); // Initial empty array of users
  const navigation = useNavigation();
  const [coms, setComs] = useState([]); // Initial empty array of wines
  const [comUser, setComUser] = useState('');
  const [noteUser, setNoteUser] = useState('');
  const [titreComUser, setTitre] = useState('');
  const [identifiantUser, setIdentifiantUser] = useState('');
  const docVin = route.params.vin_id;
  let collection = '';

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
      });
  }

  async function addCom(titre, note, commentaire, uid, id_vin) {
    if (titre == '' || note == '' || commentaire == '') {
      alert('Champ vide détecté, veuillez réessayer');
      return;
    }
    const userDocument = await firestore()
      .collection('commentaires')
      .add({
        id_vin: id_vin,
        texte: commentaire,
        titre: titre,
        note: note,
        uid: uid,
      })
      .then(() => {
        alert('Commentaire publié !');
      });
  }

  function getComs(doc) {
    const subscriber = firestore()
      .collection('commentaires')
      .where('id_vin', '==', doc)
      .onSnapshot(querySnapshot => {
        const commentaires = [];
        querySnapshot.forEach(documentSnapshot => {
          commentaires.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setComs(commentaires);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber;
  }

  function getVin(doc) {
    const getVin = firestore()
      .collection('vins')
      .doc(doc)
      .get()
      .then(documentSnapshot => {
        setVin(documentSnapshot.data());
      });
  }

  useEffect(() => {
    setLoading(true);
    setLoading(true);
    getUser();
    getVin(docVin);
    getComs(docVin);
    setLoading(false);
    console.log(docVin);
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.containerImageFond}>
          <View style={styles.imageContainer}>
            <Image
              source={{uri: vin.Photo}}
              style={{width: 300, height: 300}}
            />
          </View>
        </View>
        <View style={styles.containerFond}>
          <View style={styles.detailsContainer}>
            <Text style={styles.nomVin}>{vin.Nom}</Text>
            <View style={styles.separator} />
            <View style={styles.infosContainer}>
              <Text style={styles.info}>Couleur : {vin.Couleur}</Text>
              <Text style={styles.info}>Cépage : {vin.Cépage}</Text>
              <Text style={styles.info}>
                Appellation viticole : {vin.Viticole}
              </Text>
              <Text style={styles.info}>Alcool : {vin.Alcool}%</Text>
              <Text style={styles.info}>Volume : {vin.Volume}cl</Text>
              <Text style={styles.info}>Prix : {vin.Prix}€</Text>
            </View>
          </View>
        </View>
        <View style={styles.comContainer}>
          {/*<FlatList
        data={coms}
        renderItem={({item}) => (
          <View style={styles.container}>
            <Text>
              Par {item.uid} : {item.texte}
            </Text>
            <Text>Note : {item.note}</Text>
          </View>
        )}
        nestedScrollEnabled
      />*/}
          <Text style={styles.headerComSection}>
            COMMENTAIRES ({coms.length})
          </Text>
          {coms.map(item => {
            //AFFICHAGE COM
            return (
              <View style={styles.comRow} key={item.key}>
                <View style={styles.user}>
                  <Image
                    source={require('.././assets/User_icon.png')}
                    style={{
                      width: 50,
                      height: 50,
                      alignSelf: 'center',
                      opacity: 0.2,
                    }}
                  />
                  <Text style={styles.pseudoUser}>{item.uid}</Text>
                </View>
                <View
                  style={{
                    marginRight: 30,
                    width: 170,
                  }}>
                  <Text style={styles.titreCom}>"{item.titre}"</Text>
                  <Text style={styles.texteCom}>{item.texte}</Text>
                </View>
                <View style={styles.noteCom}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'ProductSans-Light',
                      color: '#fff',
                    }}>
                    {item.note}/20
                  </Text>
                </View>
              </View>
            );
          })}
          <TextInput
            placeholder="Note sur 20"
            placeholderTextColor="#b3b3b3"
            value={noteUser}
            keyboardType="numeric"
            maxLength={4}
            onChangeText={text => {
              let newText = '';
              let numbers = '0123456789.';

              for (var i = 0; i < text.length; i++) {
                if (numbers.indexOf(text[i]) > -1) {
                  newText = newText + text[i];
                } else {
                  // your call back function
                  alert('Veuillez entrer seulement des chiffres !');
                }
              }
              if (Number(newText) <= 20) {
                setNoteUser(newText);
              } else {
                alert('Veuillez entrer une note comprise entre 0 et 20 !');
              }
            }}
            style={styles.input}
          />
          <TextInput
            placeholder="Titre commentaire.."
            placeholderTextColor="#b3b3b3"
            value={titreComUser}
            onChangeText={text => setTitre(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Commentaire.."
            placeholderTextColor="#b3b3b3"
            value={comUser}
            onChangeText={text => setComUser(text)}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              addCom(titreComUser, noteUser, comUser, identifiantUser, docVin);
              setTitre('');
              setComUser('');
              setNoteUser('');
            }}>
            <Text style={styles.buttonText}>Ajouter un commentaire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailsVinScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6d152e',
  },
  separator: {
    backgroundColor: '#fff',
    height: 2,
    width: '50%',
    padding: 0,
  },
  containerImageFond: {
    backgroundColor: '#6d152e',
    width: '100%',
    alignItems: 'center',
  },
  containerFond: {
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
    padding: 20,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  detailsContainer: {
    backgroundColor: '#6d152e',
    width: '100%',
    alignItems: 'center',
    paddingBottom: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  infosContainer: {
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  nomVin: {
    paddingTop: 20,
    fontFamily: 'Afterglow-Regular',
    fontSize: 25,
    color: '#fff',
  },
  comContainer: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  comRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    marginBottom: 50,
  },
  headerComSection: {
    paddingTop: 20,
    fontFamily: 'Afterglow-Regular',
    fontSize: 25,
    color: '#6d152e',
  },
  titreCom: {
    fontFamily: 'Afterglow-Regular',
    fontSize: 15,
    color: '#6d152e',
  },
  texteCom: {
    fontFamily: 'ProductSans-Light',
    fontSize: 15,
    color: '#6d152e',
  },
  noteCom: {
    backgroundColor: '#6d152e',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  user: {
    marginRight: 10,
    alignItems: 'center',
    width: 70,
  },
  pseudoUser: {
    fontFamily: 'ProductSans-Light',
    fontSize: 15,
    color: '#6d152e',
  },
  info: {
    fontFamily: 'ProductSans-Light',
    fontSize: 15,
    marginTop: 30,
    color: '#fff',
  },
  input: {
    color: 'black',
    width: '80%',
    paddingVertical: 20,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    borderBottomWidth: 0.5,
  },
  button: {
    backgroundColor: '#6d152e',
    width: '80%',
    borderRadius: 100,
    alignItems: 'center',
    marginVertical: 40,
    padding: 20,
  },

  buttonText: {
    fontFamily: 'ProductSans-Thin',
    fontSize: 15,
    color: '#fff',
  },
});
