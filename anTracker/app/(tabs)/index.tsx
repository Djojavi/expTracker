import { en, es } from '@/utils/translations';
import * as Localization from 'expo-localization';
import { Link } from 'expo-router';
import { I18n } from 'i18n-js';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

//Pantalla de bienvenida

const Welcome = () => {
   let [locale, setLocale] = useState(Localization.getLocales())
        const i18n = new I18n();
        i18n.enableFallback = true;
        i18n.translations = { en, es };
        i18n.locale = locale[0].languageCode ?? 'en';

  return (
    <View style={styles.container}>
      <View style={styles.images}>
        <Image source={require('../../assets/images/LogoWelcome.png')} style={{ marginTop: 150, width: 320, height: 115 }} />
        <Image source={require('../../assets/images/AntWelcome.png')} style={{ marginTop: 50, width: 210, height: 190 }} />
      </View>
      <View style={styles.buttonContainer}>
        <Link href="/(tabs)/transacciones">
          <View style={styles.buttonTransacciones}>
            <Text style={styles.buttonTitle}> {i18n.t('Home.Transactions')} </Text>
          </View>
        </Link>

        <Link href="/(tabs)/categoria">
          <View style={styles.button}>
            <Text style={styles.buttonTitle}>{i18n.t('Home.Categories')}</Text>
          </View>
        </Link>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonTransacciones: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A37366',
    height: 40,
    width: 200,
    borderColor: '#A37366',
    borderRadius: 10
  },
  images: {
    alignItems: 'center'
  },
  txt: {
    textAlign: 'left',
    marginTop: 150,
    fontWeight: '600',
    fontSize: 20,
    fontStyle: 'italic',
    marginBottom: 10
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#E0F7FA'
  },
  buttonContainer: {
    flexDirection: 'column',
    position: 'absolute',
    bottom: 50,
    width: '80%',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    gap: 20,
    justifyContent: 'center',
    marginBottom: 45,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A37366',
    height: 40,
    width: 150,
    borderColor: '#A37366',
    borderRadius: 10
  },
  buttonTitle: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default Welcome;