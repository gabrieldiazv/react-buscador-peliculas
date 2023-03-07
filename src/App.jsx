import debounce from 'just-debounce-it'
import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import { Movies } from './components/Movies'
import { useMovies } from './hooks/useMovies'

function useSearch () {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === ''
      return
    }
    if (search === '') {
      setError('No se puede realizar una busqueda vacia')
      return
    }

    if (search.match(/^\d+$/)) {
      setError('No se puede realizar una busqueda con numeros')
      return
    }

    setError(null)
  }, [search])

  return { search, updateSearch, error }
}

function App () {
  const [sort, setSort] = useState(false)

  const { search, updateSearch, error } = useSearch()
  const { movies, getMovies, loading } = useMovies({ search, sort })

  const handleSort = () => {
    setSort(!sort)
    console.log(sort)
  }

  // ! en cada render se ejecuta la funcion, y no se cancela la ejecucion anterior
  // ! por eso usamos useCallback
  const debouncedGetMovies = useCallback(debounce(search => {
    console.log('llamando api')
    getMovies({ search })
  }, 500), [])

  const handleSubmit = (event) => {
    event.preventDefault()
    // ! forma no controlada - es mas simple, es recomendable usarla
    // ! asi evitamos que el componente se renderice cada vez que se escriba en el input
    // ! const { search } = Object.fromEntries(new FormData(event.target))
    // ? forma controlada
    // ? no depende del DOM, y es mas versatil a la hora de validar el formulario
    // console.log(search)
    getMovies({ search })
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)
    debouncedGetMovies(newSearch)
  }

  return (
    <div className='page'>
      <header>
        <h2>Buscador de peliculas</h2>
        <form action='form' onSubmit={handleSubmit}>
          <input onChange={handleChange} value={search} name='search' placeholder='Avenger, Start Wars, The Matrix...' />
          <input type='checkbox' onChange={handleSort} checked={sort} />
          <button type='submit'>Buscar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>

      <main>
        {
          loading
            ? <p>Cargando...</p>
            : <Movies movies={movies} />
        }
      </main>
    </div>
  )
}

export default App
