import React from 'react';
import { useTranslation } from "react-i18next";
import EsFlag from '../assets/images/es-flag.png'
import EnFlag from '../assets/images/en-flag.png'

const LanguageSelector = () => {
  const [t, i18n] = useTranslation('header');
  const [lang, setLang] = React.useState(window.localStorage.getItem('lang') || 'en');
  const changeLang = (e) => {
    const value = e.target.value;
    setLang(value)
    i18n.changeLanguage(value)
    window.localStorage.setItem('lang', value)
  };

  return (
    <div>
      <img src={lang === 'en' ? EnFlag : EsFlag} />
      <select className="selectpicker" data-width="fit" value={lang} onChange={changeLang}>
        <option value={'en'}>English(UK)</option>
        <option value={'es'}>Spanish</option>
      </select>
    </div>
  )
}

export default LanguageSelector;