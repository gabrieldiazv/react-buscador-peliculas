import { useRef, useState, useMemo, useCallback } from 'react'
import { searchMovies } from '../services/movies'
export function useMovies ({ search, sort }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const previousSearch = useRef(search)

  const getMovies = useCallback(async ({ search }) => {
    try {
      setLoading(true)
      setError(null)
      if (search === previousSearch.current) return
      previousSearch.current = search
      const newMovies = await searchMovies({ search })
      setMovies(newMovies)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])
  // ! localeCompare() comapra los dos string incluyendo los acentos
  // ! esta funcion se ejecuta cada vez que se renderiza el componente y es costosa
  // const getSortedMovies = () => {
  //   console.log('getSortedMovies')
  //   const sortedMovies = sort
  //     ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
  //     : movies
  //   return sortedMovies

  const sortedMovies = useMemo(() => {
    // console.log('getSortedMovies')
    const sortedMovies = sort
      ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
      : movies
    return sortedMovies
  }, [movies, sort])

  return { movies: sortedMovies, getMovies, loading }
}
