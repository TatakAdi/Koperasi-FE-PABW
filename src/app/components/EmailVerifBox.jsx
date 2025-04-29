import Image from "next/image";

function renderComponentStatus({ email, status }) {
  if (status === "idle") {
    return (
      <>
        <div>
          <h2>Email Verification</h2>
          <p className="font-normal text-[#999999]">
            We've sent a verification link to{" "}
            <span className="text-black">
              {email ? email : "starnigz@star.com"}
            </span>
          </p>
        </div>
        <div id="Notes" className="text-[#999999]">
          <p className="">Can't find your link? Check your spam folder</p>
          <p className="">
            Haven't received the link?{" "}
            <span className="text-black">Get a new verification link</span>
          </p>
        </div>
      </>
    );
  }
  if (status === "loading") {
    return (
      <>
        <div>
          <h3 className="font-bold text-5xl">Tunggu Sebentar</h3>
        </div>
      </>
    );
  }
  if (status === "success") {
    return (
      <div>
        <h3 className="font-bold text-5xl">Verifikasi Email Sukses</h3>
      </div>
    );
  }
}

export default function EmailVerifBox({ email, status }) {
  return (
    <div className="w-[420px]">
      <div className="w-[44px] h-[44px] relative mb-4">
        <Image src="/logo.svg" alt="Logo" fill className="object-contain" />
      </div>
      {renderComponentStatus({ email, status })}
    </div>
  );
}
