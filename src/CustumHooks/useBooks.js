import axios from "axios"
import { useEffect, useState } from "react"

function useBooks(query, pagenumber) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [books, setBooks] = useState([])
  const [hasMore, setHasMore] = useState(false)
  useEffect(() => {
    setBooks([])
  }, [query])
  useEffect(() => {
    setLoading(true)
    setError(false)
    let cancel
    axios({
      method: "GET",
      url: "https://openlibrary.org/search.json",
      params: { q: query, page: pagenumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setBooks((prev) => {
          return [...new Set([...prev, ...res.data.docs.map((b) => b.title)])]
        })
        setHasMore(res.data.docs.length > 0)
        setLoading(false)
        console.log(res.data)
      })
      .catch((e) => {
        if (axios.isCancel(e)) return

        setError(true)
        console.log(e)
      })
    return () => cancel()
  }, [query, pagenumber])

  return { loading, books, error, hasMore }
}

export default useBooks
