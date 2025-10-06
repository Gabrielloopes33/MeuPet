import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MeuPet meubem </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3b82f6', // Cor azul-500 do Tailwind
    paddingHorizontal: 16, // px-4
    paddingTop: 48, // pt-12
    paddingBottom: 16, // pb-4
  },
  title: {
    color: 'white',
    fontSize: 20, // text-xl
    fontWeight: 'bold',
  },
});
