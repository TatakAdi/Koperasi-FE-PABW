export default function EmailVerifBox({ email }) {
  return (
    <div className="w-[420px]">
      <div className="w-[44px] h-[44px] relative mb-4">
        <Image src="/logo.svg" alt="Logo" fill className="object-contain" />
      </div>
      <div>
        <h2>Email Verification</h2>
        <p className="font-normal text-[#999999]">
          We've sent a verification link to{" "}
          <span className="text-black">
            {email ? email : "starnigz@star.com"}
          </span>
        </p>
      </div>
      {/* <div id="toGmailButton">
        <button
          className="bg-black text-white w-full h-[53px] rounded-xl py-[16px] cursor-pointer my-3"
          onClick={() => window.open("https://mail.google.com/", "_blank")}
        >
          Gmail
        </button>
      </div> */}
      <div id="Notes" className="text-[#999999]">
        <p className="">Can't find your link? Check your spam folder</p>
        <p className="">
          Haven't received the link?{" "}
          <span className="text-black">Get a new verification link</span>
        </p>
      </div>
    </div>
  );
}
