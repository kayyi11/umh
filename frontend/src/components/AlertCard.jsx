import alertRed from "../assets/alert_red.svg";
import alertYellow from "../assets/alert_yellow.svg";

export default function AlertCard({ color, message }) {
  const bgClass =
    color === "red"
      ? "bg-[#7F2626]"
      : color === "green"
      ? "bg-[#14532D]"
      : "bg-[#966814]";

  const currentIcon = color === "red" ? alertRed : alertYellow;

  return (
    <div
      className={`h-[84px] p-5 rounded-xl flex items-center shadow-sm ${bgClass}`}
    >
      {color !== "green" && (
        <img
          src={currentIcon}
          alt={`${color} alert`}
          className="h-8 w-8 flex-shrink-0"
        />
      )}
      {message && (
        <span className="ml-3 text-white text-sm font-medium">{message}</span>
      )}
    </div>
  );
}
