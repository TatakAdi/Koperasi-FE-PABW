export default function EmailInput({ onEmailChange, email }) {
  return (
    <>
      <label htmlFor="email" className="font-medium text-base">
        Email
      </label>
      <input
        type="email"
        id="email"
        className="block bg-[#F2F5F7] w-full h-[48px] rounded-xl py-[12px] pr-[12px] pl-[16px]"
        value={email}
        onChange={onEmailChange}
        placeholder="Rionando@example.itk.ac.id"
      />
    </>
  );
}
