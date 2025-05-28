import { KeyRound, List, LogIn, LogOut, Package, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePicMenu({
  fullName,
  email,
  roles,
  authed,
  logout,
  saldo,
}) {
  const router = useRouter();

  const styleBox =
    "flex flex-row text-sm font-medium text-[#535353] p-2 cursor-pointer hover:bg-[#EDEDED] rounded-lg gap-2 m-2";

  return (
    <div className="w-[420px] flex flex-col bg-[#F2F4F7] rounded-lg">
      {authed !== null && (
        <div className="flex h-[74px] items-center gap-2 mx-2">
          <div className="rounded-full w-10 h-10  bg-gray-400 cursor-pointer "></div>
          <div>
            <p className="font-medium text-black">{fullName}</p>
            <p className="font-medium text-[#737373]">{email}</p>
          </div>
        </div>
      )}
      <div
        className={`${
          authed !== null ? "border-y " : "border-b "
        } border-[#E6E6E6]`}
      >
        <div className={`${styleBox}`}>
          <User size={20} />
          <span className=""> Account Setting</span>{" "}
        </div>

        <div className={`${styleBox}`}>
          <List size={20} />
          <span> My Orders</span>
        </div>
        <div className={`${styleBox}`}>
          {roles === "admin"? (
            <>
              <button
                onClick={() => router.push("/Admin/Statistic")}
                className="flex flex-row items-center gap-2"
              >
                <KeyRound size={20} />
                <span>Admin Panel</span>
              </button>
            </>
          ) : (
            <>
              <Package size={20} />
              <span>My Product</span>
            </>
          )}
        </div>
      </div>
      {authed !== null && (
        <div className=" border-b border-[#e6e6e6]">
          <div className="flex flex-row gap-1 justify-between items-center m-2 p-2">
            <div>
              <p className="text-[#535353] font-base text-base">
                Iuran Sukarela
              </p>
              <p className="font-medium text-base text-black">
                Rp. {saldo.toLocaleString("id-ID")}
              </p>
              <p className="text-[#666666] font-medium text-xs">
                Last Payment: 02/12/23
              </p>
            </div>
            <div>
              <p className="text-[#535353] font-base text-base">Iuran Wajib</p>
              <p className="font-medium text-base text-black">Rp. 17.000</p>
              <p className="text-[#666666] font-medium text-xs">
                Last Payment: 02/12/23
              </p>
            </div>
          </div>
        </div>
      )}
      <div
        onClick={!authed ? () => router.push("/Login") : logout}
        className={` ${styleBox} `}
      >
        {!authed ? (
          <LogIn size={20} stroke="green" />
        ) : (
          <LogOut size={20} stroke="red" />
        )}
        <span className={`${!authed ? "text-[#199F48]" : "text-[#E50000]"}`}>
          {!authed ? "Log in" : "Logout"}
        </span>
      </div>
    </div>
  );
}
