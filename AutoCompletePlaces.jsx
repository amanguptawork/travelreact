import React, { useState, useEffect } from "react";
import { getPlacesSearch } from '../services'
import { ListGroup  } from 'react-bootstrap';
import { sendEvent } from '../helpers/index'

const AutoCompletePlaces = React.forwardRef(({ placeholder, inputClass, defaultValue, searchHandler, close }, ref) => {

  const [searchQuery, setSearchQuery] = useState(defaultValue?.query || '')
  const [selectedItem, setSelectedItem] = useState('')
  const [result, setResults] = useState([])

  const handleSearch = async (e) => {
    const value = e.target.value?.trim()
    setSearchQuery(value)
    if (value?.length > 2) {
      const response = await getPlacesSearch({ searchTerm: value })
      if (response.data?.places) {
        setResults(response.data.places)
      }
    } else if (value?.length === 0) {
      setResults([])
    }
  }

  const handleSelect = (item) => {
    setSearchQuery(`${item.name}, ${item.cityName}, ${item.countryName}`)
    setSelectedItem(item)
    setResults([])
    if (close) close()
    if (ref) ref.current = item
  }

  const handleInputClick = () => {
    if (window.innerWidth <= 769) sendEvent('openModal', { modal: 'searchmodal', placeholder: placeholder, searchHandler: searchHandler, title: 'Search...' })
  }

  useEffect(() => {
    if (searchHandler) searchHandler(placeholder, searchQuery, selectedItem)
  }, [searchQuery])

  useEffect(() => {
    if (defaultValue) {
      if (defaultValue.query) setSearchQuery(defaultValue.query)
      if (defaultValue.item) handleSelect(defaultValue.item)
    }
  }, [defaultValue])

  return (
    <div className="position-relative">
      <input type="text" placeholder={placeholder} value={searchQuery} className={inputClass ? inputClass : 'htmlForm-control'} onChange={handleSearch} onClick={handleInputClick} />
      <div className="position-absolute">
        <ListGroup className="search-list">
          {
            result.map(item => <ListGroup.Item key={item.entityId} className="cursor-pointer" onClick={() => handleSelect(item)}> {item.name}, {item.cityName}, {item.countryName}</ListGroup.Item>)
          }
        </ListGroup>
      </div>
    </div>
  )
}
)
export default AutoCompletePlaces;