// To be continued !!

import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default function Dashboard() {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#07263B'
    }}>
      <Text style={[globalStyles.text, { fontSize: 30 }]}>Welcome to Dashboard!</Text>
    </View>
  );
}