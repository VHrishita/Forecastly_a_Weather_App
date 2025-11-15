export default function Forecast({ days }) {
  return (
    <div className="forecast-wrap">
      <div className="forecast-title">3-Day Forecast</div>

      <div className="forecast-row">
        {days.map((d) => (
          <div className="forecast-card" key={d.date}>
            <div className="f-date">{d.date}</div>
            <img src={d.day.condition.icon} width={48} height={48} />
            <div className="f-cond">{d.day.condition.text}</div>
            <div className="f-temps">
              {d.day.mintemp_c}°C — {d.day.maxtemp_c}°C
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
