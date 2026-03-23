import { CiCreditCard1 } from "react-icons/ci";
interface Props {
  label: string;
  isSelected: boolean;
  onSelect: (label: string) => void;
}
//git
export default function CriteriaButton({ label, isSelected, onSelect }: Props) {
  return (
    <div>
      <button
        onClick={() => onSelect(label)}
        className={`flex items-center w-full py-1 px-5 my-2 rounded-lg text-slate-600 transition-all duration-200 gap-5 ${
          isSelected ? "bg-blue-100/80" : "bg-slate-50 hover:bg-blue-100/40"
        }`}
      >
        <div
          className={`w-5 h-5 rounded-xl flex items-center justify-center  transition-all ${
            isSelected
              ? "bg-black/5 border-black/50 border-2"
              : "bg-white border-slate-300 group-hover:border-blue-400 border"
          }`}
        >
          <CiCreditCard1
            className={`transition-all duration-300 transform ${
              isSelected ? "opacity-100 scale-85" : "opacity-0 scale-50"
            }`}
          />
        </div>
        {label}
      </button>
    </div>
  );
}
