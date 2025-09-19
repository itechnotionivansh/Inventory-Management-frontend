export default function ColorChips({ colors }) {
  return (
    <div className="flex gap-1 justify-center">
      {colors.map((c, i) => (
        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
          {c}
        </span>
      ))}
    </div>
  );
}
