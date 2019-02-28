import { Location } from "../models/location"
import { Forecast } from "../models/forecast"
import { get } from "https"
import { IncomingMessage } from "http"

function kelvinToCelsius(temp: string) {
  return (parseInt(temp, 10) - 273.15).toFixed(2).toString() + " °C"
}

const getWeatherByZipCode = (
  locations: Location[]
): Array<Promise<Forecast>> => {
  let allPromises: Array<Promise<Forecast>> = []

  locations.forEach((loc: Location) => {
    allPromises.push(
      new Promise((resolve, reject) => {
        let url = new URL(
          `https://samples.openweathermap.org/data/2.5/weather?q=${
            loc.postalCode
          },${loc.locationName}&appid=b6907d289e10d714a6e88b30761fae22`
        )
        let req = get(url, (res: IncomingMessage) => {
          if (res.statusCode) {
            if (res.statusCode < 200 || res.statusCode >= 300) {
              return reject(new Error("error " + res.statusCode))
            }
          }

          let data: Forecast
          let body: any = ""

          res.on("data", data => {
            console.log(loc.postalCode)
            body = JSON.parse(Buffer.from(data).toString())
            //console.log(body);
          })

          res.on("end", function() {
            data = {
              currentTime: new Date().toLocaleString("en-US", {
                timeZone: loc.locationName
              }),
              weather: kelvinToCelsius(body.main.temp)
            }
            return resolve(data)
          })
        })

        req.on("error", function(err) {
          reject(err)
        })

        req.end()
      })
    )
  })

  return allPromises
}

export function getForecast(locations: Location[]): Array<Promise<Forecast>> {
  return getWeatherByZipCode(locations)
}
