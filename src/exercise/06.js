// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react';
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback
} from '../pokemon';

function PokemonInfo({ pokemonName }) {
  const [state, setState] = React.useState({
    pokemon: null,
    status: 'idle',
    error: null,
  });

  const { pokemon, status, error } = state;

  React.useEffect(() => {
    if (!pokemonName) return;

    setState({ ...state, status: 'pending'});
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({ ...state, pokemon: pokemonData, status: 'resolved' })
      })
      .catch(error => {
        setState({ ...state, status: 'rejected', error })
      })
  }, [pokemonName]);

  if (status === 'idle') {
    return 'Submit a pokemon';
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />;
  } else if (status === 'rejected') {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      </div>
    );
  }
  else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />;
  }

  throw new Error('This should be impossible');
}
  

function App() {
  const [pokemonName, setPokemonName] = React.useState(null);

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName);
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  );
}

export default App;
