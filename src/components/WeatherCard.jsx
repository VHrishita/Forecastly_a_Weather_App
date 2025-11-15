export default function WeatherCard({ current, location }) {
  return (
    <div className="card glass">
      <div className="card-left">
        <img src={current.condition.icon} className="cond-icon" />
        <div className="temp">{current.temp_c}°C</div>
        <div className="cond-text">{current.condition.text}</div>
      </div>

      <div className="card-right">
        <div className="loc">
          <div className="city">{location.name}</div>
          <div className="country">{location.country}</div>
        </div>

        <div className="extra">
          <div className="extra-item">💧 Humidity: {current.humidity}%</div>
          <div className="extra-item">💨 Wind: {current.wind_kph} km/h</div>
          <div className="extra-item">🌡️ Feels: {current.feelslike_c}°C</div>
        </div>
      </div>
    </div>
  );
}
