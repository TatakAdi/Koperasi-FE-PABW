export default function NameInput({ onNameChange, name }) {
  return (
    <>
      <label htmlFor="name" className="font-medium text-base">
        Full Name
      </label>
      <input
        type="text"
        id="name"
        className="block bg-[#F2F5F7] w-full h-[48px] rounded-xl py-[12px] pr-[12px] pl-[16px]"
        value={name}
        onChange={onNameChange}
        placeholder="Rio Ireng"
      />
    </>
  );
}
