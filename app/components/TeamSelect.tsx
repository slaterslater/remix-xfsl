export default function TeamSelect({ teams, label, name, selected, onChange }) {
  return (
    <div className="flex">
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        defaultValue={selected}
        onChange={(e) => {
          onChange(e.target.selectedOptions[0].label)
        }}
      >
        <option value={null}>{null}</option>
        {teams?.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  )
}
