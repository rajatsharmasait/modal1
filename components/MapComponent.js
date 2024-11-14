import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapComponent = ({ gardens, userLocation }) => {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: userLocation ? userLocation.latitude : 37.78825,
          longitude: userLocation ? userLocation.longitude : -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {userLocation && (
          <Marker
            coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
            title="Your Location"
            pinColor="blue"
          />
        )}
        {gardens.map(garden => (
          <Marker
            key={garden._id}
            coordinate={{
              latitude: garden.latitude, // Use actual lat/lng for gardens
              longitude: garden.longitude,
            }}
            title={garden.name}
            description={garden.address}
          />
        ))}
      </MapView>
    </View>
  );
};

export default MapComponent;