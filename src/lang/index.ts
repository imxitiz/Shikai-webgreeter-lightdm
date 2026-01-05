import credits from './credits'
import { query } from '../js/Tools/Dictionary'

import english from './eng'
import spanish from './spa'
import japanesse from './jap'
import arab from './arb'
import german from './ger'
import french from './fre'
import portuguese from './por'
import nepali from './nep'

export const langs = [
	english,
	nepali,
	spanish,
	japanesse,
	arab,
	german,
	french,
	portuguese,
];
export const names = langs.map((lang) => lang.names.long)
export const data = (function () {
  const _data: any = {
    get(lang: string, path: string) {
      return query(this[lang], path)
    }
  }
  langs.forEach((lang) => {
    _data[lang.names.long] = lang.data
  })
  return _data
})()

let lang: string
export function get_lang(): string {
  return lang
}
export function set_lang(_lang: string): void {
  lang = _lang
}
