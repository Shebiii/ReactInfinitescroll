import React, { useRef, useCallback, useState } from "react"
import useBooks from "./CustumHooks/useBooks"

function App() {
  const [query, setQuery] = useState("")
  const [pageNumber, setPageNumber] = useState(1)
  const observer = useRef()
  const { loading, books, error, hasMore } = useBooks(query, pageNumber)
  const lastBookElement = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  const changeHandler = (e) => {
    setQuery(e.target.value)
    setPageNumber(1)
  }

  return (
    <div>
      <input type="text" value={query} onChange={changeHandler} />
      <div>
        {books.map((book, index) => {
          if (books.length === index + 1) {
            return (
              <div key={book} ref={lastBookElement}>
                {book}
              </div>
            )
          } else {
            return <div key={book}>{book}</div>
          }
        })}
      </div>

      <div>{loading && "loading..."}</div>
      <div>{error && "error"}</div>
    </div>
  )
}

export default App
