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
  Dimensions,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {auth} from '../firebase';
import ADMIN1_UID from './config';

const admin_uid = ADMIN1_UID;

const AdminDetails = ({route}) => {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [vin, setVin] = useState([]); // Initial empty array of users
  const navigation = useNavigation();
  const [coms, setComs] = useState([]); // Initial empty array of wines
  const [comUser, setComUser] = useState('');
  const [titreComUser, setTitre] = useState('');
  const [noteUser, setNoteUser] = useState('');
  const [identifiantUser, setIdentifiantUser] = useState('');

  //VAR POUR MAJ VIN
  const [nomVin, setNomVin] = useState('');
  const [couleurVin, setCouleurVin] = useState('');
  const [cepageVin, setCepage] = useState('');
  const [viticoleVin, setViticole] = useState('');
  const [alcoolVin, setAlcool] = useState('');
  const [volumVin, setVolume] = useState('');
  const [prixVin, setPrix] = useState('');
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
    return () => userDocument;
  }

  function deleteCom(doc) {
    const subscriber = firestore()
      .collection('commentaires')
      .doc(doc)
      .delete()
      .then(() => {
        alert('Commentaire supprimé !');
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber;
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
    console.log('doc = ' + docVin);
    const subscriber = firestore()
      .collection('vins')
      .doc(doc)
      .get()
      .then(documentSnapshot => {
        setVin(documentSnapshot.data());
        setNomVin(documentSnapshot.data().Nom);
        setCouleurVin(documentSnapshot.data().Couleur);
        setCepage(documentSnapshot.data().Cépage);
        setViticole(documentSnapshot.data().Viticole);
        setAlcool(documentSnapshot.data().Alcool);
        setVolume(documentSnapshot.data().Volume);
        setPrix(documentSnapshot.data().Prix);
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber;
  }

  async function updateVin(
    nom,
    couleur,
    cepage,
    app_viti,
    prix,
    alcool,
    vol,
    docVin,
  ) {
    await firestore()
      .collection('vins')
      .doc(docVin)
      .update({
        Alcool: alcool,
        Couleur: couleur,
        Cépage: cepage,
        Nom: nom,
        Prix: prix,
        Viticole: app_viti,
        Volume: vol,
      })
      .then(result => {
        alert('Vin mis à jour !');
      });
  }

  useEffect(() => {
    getUser();
    getVin(docVin);
    getComs(docVin);
    setLoading(false);
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView>
      <View style={styles.containerImageFond}>
        <View style={styles.imageContainer}>
          <Image source={{uri: vin.Photo}} style={{width: 300, height: 300}} />
        </View>
      </View>
      <View style={styles.containerFond}>
        <View style={styles.detailsContainer}>
          <Text style={styles.categorie}>Nom</Text>
          <TextInput
            placeholder="Nom..."
            value={nomVin}
            placeholderTextColor="#b3b3b3"
            onChangeText={text => {
              setNomVin(text);
            }}
            style={[styles.input, {marginVertical: 2}]}
          />
          <Text style={styles.categorie}>Couleur</Text>
          <TextInput
            placeholder="Couleur..."
            value={couleurVin}
            placeholderTextColor="#b3b3b3"
            onChangeText={text => {
              setCouleurVin(text);
            }}
            style={[styles.input, {marginVertical: 2}]}
          />
          <Text style={styles.categorie}>Cépage</Text>
          <TextInput
            placeholder="Couleur..."
            value={cepageVin}
            placeholderTextColor="#b3b3b3"
            onChangeText={text => {
              setCepage(text);
            }}
            style={[styles.input, {marginVertical: 2}]}
          />
          <Text style={styles.categorie}>Appellation viticole</Text>
          <TextInput
            placeholder="Appellation viticole..."
            value={viticoleVin}
            placeholderTextColor="#b3b3b3"
            onChangeText={text => {
              setViticole(text);
            }}
            style={[styles.input, {marginVertical: 2}]}
          />

          <Text style={styles.categorie}>Taux d'alcool (%)</Text>
          <TextInput
            placeholder="Taux d'alcool..."
            placeholderTextColor="#b3b3b3"
            value={'' + alcoolVin}
            keyboardType="numeric"
            onChangeText={text => {
              let newText = '';
              let numbers = '0123456789';

              for (var i = 0; i < text.length; i++) {
                if (numbers.indexOf(text[i]) > -1) {
                  newText = newText + text[i];
                } else {
                  // your call back function
                  alert('Veuillez entrer un nombre valide.');
                }
              }
              setAlcool(newText);
            }}
            style={styles.input}
          />
          <Text style={styles.categorie}>Volume bouteille (cL)</Text>
          <TextInput
            placeholder="Volume en cL..."
            placeholderTextColor="#b3b3b3"
            value={'' + volumVin}
            keyboardType="numeric"
            onChangeText={text => {
              let newText = '';
              let numbers = '0123456789';

              for (var i = 0; i < text.length; i++) {
                if (numbers.indexOf(text[i]) > -1) {
                  newText = newText + text[i];
                } else {
                  // your call back function
                  alert('Veuillez entrer un nombre valide.');
                }
              }
              setVolume(newText);
            }}
            style={styles.input}
          />
          <Text style={styles.categorie}>Prix (€)</Text>
          <TextInput
            placeholder="Prix..."
            placeholderTextColor="#b3b3b3"
            value={'' + prixVin}
            keyboardType="numeric"
            onChangeText={text => {
              let newText = '';
              let numbers = '0123456789';

              for (var i = 0; i < text.length; i++) {
                if (numbers.indexOf(text[i]) > -1) {
                  newText = newText + text[i];
                } else {
                  // your call back function
                  alert('Veuillez entrer un nombre valide.');
                }
              }
              setPrix(newText);
            }}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.buttonMaj}
            onPress={() => {
              updateVin(
                nomVin,
                couleurVin,
                cepageVin,
                viticoleVin,
                prixVin,
                alcoolVin,
                volumVin,
                docVin,
              );
            }}>
            <Text style={styles.buttonMajText}>Mettre à jour le vin</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.comContainer}>
          <Text style={styles.headerComSection}>
            COMMENTAIRES ({coms.length})
          </Text>
          {coms.map(item => {
            //AFFICHAGE COM
            return (
              <View style={styles.comRow} key={item.key}>
                <TouchableOpacity
                  onPress={() => {
                    deleteCom(item.key);
                  }}>
                  <Icon
                    name="remove-circle-outline"
                    type="ionicon"
                    size={30}
                    color="#6d152e"
                  />
                </TouchableOpacity>
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
                    marginRight: 20,
                    width: 150,
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
            style={styles.inputCom}
          />
          <TextInput
            placeholder="Titre commentaire.."
            placeholderTextColor="#b3b3b3"
            value={titreComUser}
            onChangeText={text => setTitre(text)}
            style={styles.inputCom}
          />
          <TextInput
            placeholder="Commentaire.."
            placeholderTextColor="#b3b3b3"
            value={comUser}
            onChangeText={text => setComUser(text)}
            style={styles.inputCom}
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

export default AdminDetails;

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
  categorie: {
    paddingTop: 20,
    fontFamily: 'ProductSans-Light',
    fontSize: 15,
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
    marginRight: 10,
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
    color: 'white',
    width: '80%',
    paddingVertical: 20,
    borderBottomColor: 'rgba(255,255,255,0.5)',
    borderBottomWidth: 0.5,
  },
  inputCom: {
    color: 'black',
    width: '80%',
    paddingVertical: 20,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    borderBottomWidth: 0.5,
  },
  buttonMaj: {
    backgroundColor: '#fff',
    width: '50%',
    borderRadius: 100,
    alignItems: 'center',
    marginVertical: 40,
    padding: 20,
  },

  buttonMajText: {
    fontFamily: 'ProductSans-Light',
    fontSize: 15,
    color: '#6d152e',
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
    fontFamily: 'ProductSans-Light',
    fontSize: 15,
    color: '#fff',
  },
});
