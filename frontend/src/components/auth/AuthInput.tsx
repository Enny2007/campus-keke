
type AuthInputProps = {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
  minLength?: number;
  value: string;
  onChange: (value: string) => void;
};

const AuthInput = ({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  minLength,
  value,
  onChange,
}: AuthInputProps) => {
  return (
    <div className="min-w-0 space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[13px] font-semibold text-[#263D30]"
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="block h-[43px] w-full min-w-0 rounded-xl border border-[#DCE5DC] bg-white px-3.5 text-sm text-[#172B20] outline-none transition placeholder:text-[#929D95] hover:border-[#B7C9BA] focus:border-[#00C96B] focus:ring-4 focus:ring-[#00C96B]/10"
      />
    </div>
  );
};

export default AuthInput;
