import { Location } from "./components/models/location"
import { Forecast } from "./components/models/forecast"
import { testLocations } from "./components/mock/testLocation"
import { getForecast } from "./components/forecast/forecast"

Promise.all(getForecast(testLocations))
  .then(result => {
    result.forEach((data, index, arr) => {
      console.log("index.js " + index, data)
    })
  })
  .catch(e => console.log(e))
