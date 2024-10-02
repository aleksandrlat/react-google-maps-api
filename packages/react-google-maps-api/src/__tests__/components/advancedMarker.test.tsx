import React from 'react';
import { render, screen } from '@testing-library/react';
import { GoogleMap, useJsApiLoader, AdvancedMarker } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

describe('AdvancedMarker component', () => {
  it('renders correctly', async () => {
    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: "YOUR_API_KEY"
    });

    render(
      isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          <AdvancedMarker
            position={center}
            options={{ title: 'Advanced Marker' }}
          />
        </GoogleMap>
      ) : <></>
    );

    const markerElement = await screen.findByTitle('Advanced Marker');
    expect(markerElement).toBeInTheDocument();
  });

  it('updates correctly', async () => {
    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: "YOUR_API_KEY"
    });

    const { rerender } = render(
      isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          <AdvancedMarker
            position={center}
            options={{ title: 'Advanced Marker' }}
          />
        </GoogleMap>
      ) : <></>
    );

    const newPosition = { lat: -3.746, lng: -38.524 };

    rerender(
      isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          <AdvancedMarker
            position={newPosition}
            options={{ title: 'Advanced Marker' }}
          />
        </GoogleMap>
      ) : <></>
    );

    const markerElement = await screen.findByTitle('Advanced Marker');
    expect(markerElement).toHaveAttribute('data-lat', newPosition.lat.toString());
    expect(markerElement).toHaveAttribute('data-lng', newPosition.lng.toString());
  });

  it('unmounts correctly', async () => {
    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: "YOUR_API_KEY"
    });

    const { unmount } = render(
      isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          <AdvancedMarker
            position={center}
            options={{ title: 'Advanced Marker' }}
          />
        </GoogleMap>
      ) : <></>
    );

    unmount();

    const markerElement = screen.queryByTitle('Advanced Marker');
    expect(markerElement).not.toBeInTheDocument();
  });

  it('renders with all possible props', async () => {
    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: "YOUR_API_KEY"
    });

    render(
      isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          <AdvancedMarker
            position={center}
            options={{ title: 'Advanced Marker' }}
            draggable={true}
            visible={true}
            zIndex={1}
            onClick={() => {}}
            onDblClick={() => {}}
            onDrag={() => {}}
            onDragEnd={() => {}}
            onDragStart={() => {}}
            onMouseDown={() => {}}
            onMouseOut={() => {}}
            onMouseOver={() => {}}
            onMouseUp={() => {}}
            onRightClick={() => {}}
            onPositionChanged={() => {}}
            onZindexChanged={() => {}}
            onLoad={() => {}}
            onUnmount={() => {}}
          />
        </GoogleMap>
      ) : <></>
    );

    const markerElement = await screen.findByTitle('Advanced Marker');
    expect(markerElement).toBeInTheDocument();
  });
});
