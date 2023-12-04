import React, { useRef } from 'react';
import { Tab, Tabs, Dropdown } from 'react-bootstrap';
import AutoCompletePlaces from './AutoCompletePlaces'
import { useTranslation } from "react-i18next";
import { getLangQuery } from '../helpers';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../Pages/HomePage/HomePage.css'
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const [t] = useTranslation('search');
  const source = useRef()
  const destination = useRef()
  const [selectedItems, setSelectedItem] = React.useState({})
  const [formData, setFormData] = React.useState({
    source: '',
    destination: '',
    sourceDate: new Date(),
    destinationDate: new Date(),
    tripType: 'RT',
    passengers: {
      adult: 1,
      child: 0,
      infant: 0
    },
    class: 'economy'
  })

  const handlePassengers = (type, pValue) => {
    let value = formData.passengers[pValue];
    if (type === 'inc') {
      value += 1
    } else if (value !== 0) {
      value -= 1
    }
    formData.passengers[pValue] = value
    setFormData({ ...formData })
  }

  const handleClass = (type = 'class', value) => {
    setFormData({
      ...formData,
      [type]: value
    })
  }

  const getPassengerClass = () => {
    const passengers = formData.passengers.adult + formData.passengers.child + formData.passengers.infant;
    return `${passengers} ${t('passenger')}, ${t(formData.class)}`
  }

  const handleSearch = (field, arg, item) => {
    setFormData({
      ...formData,
      [field.toLowerCase()]: arg
    })
    if (item) {
      setSelectedItem({
        ...selectedItems,
        [field.toLowerCase()]: item
      })
    }
  }

  const handleSearchSubmit = () => {
    if (source.current && destination.current) {
      const lang = getLangQuery()
      const body = {
        curren: lang.curreny,
        local: lang.locale,
        cntry: lang.market,
        frmCty: source.current.iataCode,
        tCty: destination.current.iataCode,
        depDt: 'Anytime',
        arvDt: '',
        noOfadult: formData.passengers.adult,
        noOfChile: formData.passengers.child,
        infant: formData.passengers.infant,
        tripType: formData.tripType,
        flightcls: formData.class,
        siid: '',
        fval: source.current.name,
        tval: destination.current.name,
        localIp: '',
        tripDuration: '',
        outboundDepartStartTime: "01.00",
        outboundDepartEndTime: "24.00",
        inboundDepartStartTime: "01.00",
        inboundDepartEndTime: "24.00",
        visitorId: 0,
      }
      window.localStorage.setItem('searchParams', JSON.stringify(body))
      navigate("/result");
    }
  }

  return (
    <div className="search-wrap">
      <Tabs
        defaultActiveKey="flight"
        id="uncontrolled-tab-example"
        className="">
        <Tab eventKey="flight" title={t('flight')}>
          <div className="search-inner">
            <ul className="trip-type web-trip">
              <li>
                <input type="radio" id="round15" name="radio-group9" defaultChecked value={'RT'} onChange={() => handleClass('tripType', 'RT')} />
                <label htmlFor="round15">{t('roundTrip')}</label>
              </li>
              <li>
                <input type="radio" id="round4" name="radio-group9" value={'OW'} onChange={() => handleClass('tripType', 'OW')} />
                <label htmlFor="round4">{t('oneWay')}</label>
              </li>
              {/* <li>
                <input type="radio" id="round9" name="radio-group9" value={'multiCity'} onChange={() => handleClass('tripType', 'multiCity')} />
                <label htmlFor="round9">{t('multiCity')}</label>
              </li> */}
            </ul>
            <div className="field-list">
              <div className="field">
                <label>{t('from')}</label>
                <AutoCompletePlaces placeholder={t('source')} defaultValue={{ query: formData.source, item: selectedItems.source}} searchHandler={handleSearch} ref={source} />
              </div>
              <div className="field">
                <label>{t('to')}</label>
                <AutoCompletePlaces placeholder={t('destination')} defaultValue={{ query: formData.destination, item: selectedItems.destination }} searchHandler={handleSearch} ref={destination} />
              </div>
              <div className="full-field">
                <div className="field">
                  <label>{t('journeyDate')}</label>
                  <DatePicker withPortal minDate={new Date()} showIcon selected={formData.sourceDate} onChange={(date) => setFormData({
                    ...formData,
                    sourceDate: date,
                    destinationDate: date
                  })} />
                </div>
                <div className={formData.tripType === 'OW' ? 'disabled-field' : 'field'}>
                  <label>{t('returnDate')}</label>
                  <DatePicker disabled={formData.tripType === 'OW'} withPortal minDate={formData.sourceDate} showIcon isClearable selected={formData.destinationDate} onChange={(date) => setFormData({
                    ...formData,
                    destinationDate: date
                  })} />
                </div>
              </div>

              <div className="field">
                <label>{t('passenger')}, {t('class')}</label>
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    <input type="text" placeholder="0" className="htmlForm-control" value={getPassengerClass()} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <h5>{t('passenger')}s</h5>
                    <div className="item">
                      <span>{t('adult')}</span>
                      <div className="count-box">
                        <span onClick={() => handlePassengers('desc', 'adult')}> <i className="fa fa-minus cursor-pointer"></i> </span>
                        <span className="count mx-2">{formData.passengers.adult}</span>
                        <span onClick={() => handlePassengers('inc', 'adult')}>

                          <i className="fa fa-plus cursor-pointer"></i>
                        </span>
                      </div>
                    </div>
                    <div className="item">
                      <span>{t('child')}</span>
                      <div className="count-box">
                        <span onClick={() => handlePassengers('desc', 'child')}>
                          <i className="fa fa-minus cursor-pointer" ></i>
                        </span>
                        <span className="count mx-2">{formData.passengers.child}</span>
                        <span onClick={() => handlePassengers('inc', 'child')}>
                          <i className="fa fa-plus cursor-pointer"></i>
                        </span>
                      </div>
                    </div>
                    <div className="item">
                      <span>{t('infant')}</span>
                      <div className="count-box">
                        <span onClick={() => handlePassengers('desc', 'infant')}>
                          <i className="fa fa-minus cursor-pointer" ></i>
                        </span>

                        <span className="count mx-2">{formData.passengers.infant}</span>
                        <span onClick={() => handlePassengers('inc', 'infant')}>
                          <i className="fa fa-plus cursor-pointer" ></i>
                        </span>
                      </div>
                    </div>
                    <h5>{t('class')}</h5>
                    <ul className="flight-type">
                      <li>
                        <input type="radio" id="test1" name="radio-group6" value={'economy'} onChange={() => handleClass('economy')} defaultChecked />
                        <label htmlFor="test1">{t('economy')}</label>
                      </li>
                      <li>
                        <input type="radio" id="test2" name="radio-group6" value={'premiumEconomy'} onChange={() => handleClass('premiumEconomy')} />
                        <label htmlFor="test2">{t('premiumEconomy')}</label>
                      </li>
                      <li>
                        <input type="radio" id="test5" name="radio-group6" value={'businessClass'} onChange={() => handleClass('businessClass')} />
                        <label htmlFor="test5">{t('businessClass')}</label>
                      </li>
                      <li>
                        <input type="radio" id="test7" name="radio-group6" value={'firstClass'} onChange={() => handleClass('firstClass')} />
                        <label htmlFor="test7">{t('firstClass')}</label>
                      </li>
                    </ul>
                    <Dropdown.Item className='p-0'>
                      <button className="btn btn-success close-menu">{t('submit')}</button>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="field" onClick={handleSearchSubmit}>
                <a className="main-btn">{t('search')}</a>
              </div>
            </div>
            <p className='mt-3 mb-0 fst-italic' style={{ fontSize: '10px' }}> {t('disclaimer')}</p>
          </div>
        </Tab>
        {/* <Tab eventKey="hotel" title="Hotel">
          Coming Soon!!
        </Tab>
        <Tab eventKey="car" title="Car" >
          Coming Soon!!
        </Tab> */}
      </Tabs>
    </div>
  )
}

export default SearchBox;