interface FieldDisplayProps {
  label: string;
  value: string;
}

const InputFieldDisplay: React.FC<FieldDisplayProps> = ({ label, value }) => (
  <div className="my-2">
    <label className="block text-md md:text-lg font-semibold text-onsurface">
      {label}
    </label>
    <p className="text-onsurface text-md md:text-lg text-wrap" aria-label={label}>
      {value || 'N/A'}
    </p>
  </div>
);

export default InputFieldDisplay;
