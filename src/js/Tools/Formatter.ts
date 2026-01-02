'use strict'

import { data, get_lang } from '../../lang'

function preformat(format: string): string {
  return format.replaceAll(/(%%)/g, '\x01%\x01')
}

function postformat(format: string): string {
  return format.replaceAll(/(\\x01%\\x01)/g, '%')
}

function zeroFormat(n: number, ln?: number): string {
  let nStr = n + ''
  while (nStr.length < (ln || 2)) nStr = '0' + nStr
  return nStr
}

function _time(format: string, date: Date, utc?: boolean): string {
  format = format.replaceAll(/(%H)/g, zeroFormat(utc ? date.getUTCHours() : date.getHours()))
  format = format.replaceAll(
    /(%I)/g,
    zeroFormat(
      (utc ? date.getUTCHours() : date.getHours()) > 12
        ? (utc ? date.getUTCHours() : date.getHours()) - 12
        : utc
          ? date.getUTCHours()
          : date.getHours()
    )
  )
  format = format.replaceAll(/(%h)/g, String(utc ? date.getUTCHours() : date.getHours()))
  format = format.replaceAll(
    /(%i)/g,
    String(
      (utc ? date.getUTCHours() : date.getHours()) > 12
        ? (utc ? date.getUTCHours() : date.getHours()) - 12
        : utc
          ? date.getUTCHours()
          : date.getHours()
    )
  )

  format = format.replaceAll(/(%K)/g, zeroFormat(utc ? date.getUTCMinutes() : date.getMinutes()))
  format = format.replaceAll(/(%k)/g, String(utc ? date.getUTCMinutes() : date.getMinutes()))

  format = format.replaceAll(/(%S)/g, zeroFormat(utc ? date.getUTCSeconds() : date.getSeconds()))
  format = format.replaceAll(/(%s)/g, String(utc ? date.getUTCSeconds() : date.getSeconds()))

  format = format.replaceAll(
    /(%L)/g,
    String(Math.round((utc ? date.getUTCMilliseconds() : date.getMilliseconds()) / 100))
  )

  format = format.replaceAll(
    /(%Q)/g,
    zeroFormat(Math.round((utc ? date.getUTCMilliseconds() : date.getMilliseconds()) / 10), 2)
  )
  format = format.replaceAll(
    /(%q)/g,
    String(Math.round((utc ? date.getUTCMilliseconds() : date.getMilliseconds()) / 10))
  )

  format = format.replaceAll(
    /(%F)/g,
    zeroFormat(utc ? date.getUTCMilliseconds() : date.getMilliseconds(), 3)
  )
  format = format.replaceAll(/(%f)/g, String(utc ? date.getUTCMilliseconds() : date.getMilliseconds()))

  format = format.replaceAll(
    /(%P)/g,
    (utc ? date.getUTCHours() : date.getHours()) > 12 ? 'PM' : 'AM'
  )
  format = format.replaceAll(
    /(%p)/g,
    (utc ? date.getUTCHours() : date.getHours()) > 12 ? 'pm' : 'am'
  )

  format = format.replaceAll(
    /(%T)/g,
    date.getTimezoneOffset() >= 0
      ? '+' +
          zeroFormat(Math.floor((date.getTimezoneOffset() + 1) / 60 - 1 / 60))
      : '-' + zeroFormat(Math.floor(Math.abs(date.getTimezoneOffset()) / 60))
  )
  format = format.replaceAll(
    /(%t)/g,
    date.getTimezoneOffset() >= 0
      ? '+' + String(Math.floor((date.getTimezoneOffset() + 1) / 60 - 1 / 60))
      : '-' + String(Math.floor(Math.abs(date.getTimezoneOffset()) / 60))
  )

  return format
}

function _date(format: string, date: Date, utc?: boolean): string {
  const months = data.get(get_lang() || 'english', 'time.months')
  const days = data.get(get_lang() || 'english', 'time.days')

  format = format.replaceAll(/(%Y)/g, String(utc ? date.getUTCFullYear() : date.getFullYear()))
  format = format.replaceAll(/(%y)/g, String(date.getYear()))
  format = format.replaceAll(/(%J)/g, () => {
    let count = utc ? date.getUTCDate() : date.getDate()
    for (let i = utc ? date.getUTCMonth() : date.getMonth(); i > 0; i--) {
      if (i != 1) {
        if ((i <= 6 && i % 2 == 0) || (i >= 7 && i % 2 == 1)) {
          count += 31
        } else {
          count += 30
        }
      } else {
        if ((utc ? date.getUTCFullYear() : date.getFullYear()) % 4 == 0) {
          count += 29
        } else {
          count += 28
        }
      }
    }
    return String(count)
  })

  format = format.replaceAll(/(%M)/g, zeroFormat((utc ? date.getUTCMonth() : date.getMonth()) + 1))
  format = format.replaceAll(/(%m)/g, String((utc ? date.getUTCMonth() : date.getMonth()) + 1))
  format = format.replaceAll(
    /(%B)/g,
    months.long[utc ? date.getUTCMonth() : date.getMonth()]
  )
  format = format.replaceAll(
    /(%b)/g,
    months.short[utc ? date.getUTCMonth() : date.getMonth()]
  )

  format = format.replaceAll(/(%D)/g, zeroFormat(utc ? date.getUTCDate() : date.getDate()))
  format = format.replaceAll(/(%d)/g, String(utc ? date.getUTCDate() : date.getDate()))

  format = format.replaceAll(/(%A)/g, days.long[utc ? date.getUTCDay() : date.getDay()])
  format = format.replaceAll(/(%a)/g, days.short[utc ? date.getUTCDay() : date.getDay()])
  format = format.replaceAll(/(%W)/g, String((utc ? date.getUTCDay() : date.getDay()) + 1))

  return format
}

export function time(format: string, date: Date = new Date(), utc?: boolean): string {
  return postformat(_time(preformat(format), date, utc))
}

export function date(format: string, date: Date = new Date(), utc?: boolean): string {
  return postformat(_date(preformat(format), date, utc))
}

export function universal(format: string, date: Date = new Date(), utc?: boolean): string {
  return postformat(_time(_date(preformat(format), date, utc), date, utc))
}
