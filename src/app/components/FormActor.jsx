"use client";

import Navbar from "@/app/components/Navbar";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import useInput from "@/app/hooks/useInput";
import { getUserLogged } from "@/app/lib/api/login";
import { logout } from "@/app/lib/api/logout";
import { postPaymentMember } from "@/app/lib/api/payment";
import { addUser, updateUser } from "@/app/lib/api/user";
import { useEffect, useRef, useState } from "react";

export default function FormActor({ onClose, initialData = null }) {
  const [status, setStatus] = useState("idle");
  const [actorName, setActorName] = useState(
    initialData ? initialData.fullname : ""
  );
  const [actorEmail, setActorEmail] = useState(
    initialData ? initialData.email : ""
  );

  const [privilageDropdownOpen, setPrivilageDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const [selectedPrivilage, setSelectedPrivilage] = useState(
    initialData && initialData.tipe
      ? initialData.tipe.charAt(0).toUpperCase() +
          initialData.tipe.slice(1).toLowerCase()
      : "Admin"
  );

  const [selectedStatus, setSelectedStatus] = useState(() => {
    if (initialData && initialData.status_keanggotaan) {
      return (
        initialData.status_keanggotaan.charAt(0).toUpperCase() +
        initialData.status_keanggotaan.slice(1).toLowerCase()
      );
    }
    return "Bukan Anggota";
  });

  const privilageRef = useRef(null);
  const statusRef = useRef(null);

  const [keyword, setKeyword] = useInput("");
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const fetchAuthUser = async () => {
      const { error, data } = await getUserLogged();
      if (error) {
        console.log("Token Invalid & Data user gagal terambil di FormActor");
      }
      setAuthUser(data);
    };
    fetchAuthUser();
  }, []);

  async function onLogoutHandler() {
    await logout();
    setAuthUser(null);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        privilageRef.current &&
        !privilageRef.current.contains(event.target)
      ) {
        setPrivilageDropdownOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setStatusDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (initialData) {
      if (selectedPrivilage === "Admin" || selectedPrivilage === "Pegawai") {
        if (selectedStatus !== "Bukan Anggota") {
          setSelectedStatus("Bukan Anggota");
        }
      } else if (
        selectedPrivilage === "Pengguna" ||
        selectedPrivilage === "Penitip"
      ) {
        if (selectedStatus === "Bukan Anggota") {
          setSelectedStatus("Tidak Aktif");
        }
      }
    }
  }, [selectedPrivilage, initialData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");

    try {
      const privilegeToSend = selectedPrivilage.toLowerCase();

      if (initialData) {
        let statusToSendOnEdit;
        if (privilegeToSend === "admin" || privilegeToSend === "pegawai") {
          statusToSendOnEdit = "bukan anggota";
        } else {
          statusToSendOnEdit = selectedStatus.toLowerCase();
        }

        const { error: updateError } = await updateUser({
          id: initialData.id,
          fullname: actorName,
          email: actorEmail,
          tipe: privilegeToSend,
          status_keanggotaan: statusToSendOnEdit,
        });

        if (updateError) {
          console.error("Failed to update user:", updateError);
          alert(
            `Gagal memperbarui aktor: ${updateError.message || updateError}`
          );
        } else {
          alert("Aktor berhasil diperbarui!");
        }
      } else {
        let defaultStatusForNewUser;
        if (privilegeToSend === "admin" || privilegeToSend === "pegawai") {
          defaultStatusForNewUser = "bukan anggota";
        } else if (
          privilegeToSend === "pengguna" ||
          privilegeToSend === "penitip"
        ) {
          defaultStatusForNewUser = "tidak aktif";
        } else {
          defaultStatusForNewUser = "bukan anggota";
        }

        const { error: addUserError, data: newUserResponse } = await addUser({
          fullname: actorName,
          email: actorEmail,
          tipe: privilegeToSend,
          status_keanggotaan: defaultStatusForNewUser,
        });

        console.log("handleSubmit - priviligeToSend:", privilegeToSend);
        console.log(
          "handleSubmit - defaultStatusForNewUser:",
          defaultStatusForNewUser
        );
        console.log(
          "Full response from addUser API (should be the ID directly):",
          newUserResponse
        );
        console.log("Error from addUser API (if any):", addUserError);

        if (addUserError) {
          console.error("Failed to add user:", addUserError);
          alert(
            `Gagal menambahkan aktor: ${
              addUserError.message || addUserError
            }. Silakan coba lagi.`
          );
          return;
        }

        const newUserId = newUserResponse;

        if (newUserId) {
          if (privilegeToSend !== "admin" && privilegeToSend !== "pegawai") {
            const paymentResult = await postPaymentMember({
              user_id: newUserId,
              payment_method: "link",
              amount: 17000,
            });

            if (paymentResult.error) {
              console.error(
                "Failed to post payment for new member:",
                paymentResult.error
              );
              let specificError = "Unknown error";
              if (
                typeof paymentResult.error === "object" &&
                paymentResult.error !== null
              ) {
                specificError = JSON.stringify(
                  paymentResult.error.errors ||
                    paymentResult.error.message ||
                    paymentResult.error
                );
              } else if (typeof paymentResult.error === "string") {
                specificError = paymentResult.error;
              }
              alert(
                `Aktor (tipe: ${privilegeToSend}, status: ${defaultStatusForNewUser}, ID: ${newUserId}) berhasil ditambahkan, tetapi gagal mencatat pembayaran awal. Detail: ${specificError}`
              );
            } else {
              alert(
                `Aktor (tipe: ${privilegeToSend}, status: ${defaultStatusForNewUser}, ID: ${newUserId}) dan pembayaran awal berhasil ditambahkan!`
              );
            }
          } else {
            alert(
              `Aktor (tipe: ${privilegeToSend}, status: ${defaultStatusForNewUser}, ID: ${newUserId}) berhasil ditambahkan!`
            );
          }
        } else {
          console.error(
            "User added, but newUserId was not found or was invalid. Actual response:",
            newUserResponse
          );
          alert(
            "Aktor berhasil ditambahkan, tetapi ID pengguna tidak valid atau tidak ditemukan untuk proses selanjutnya."
          );
        }
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setStatus("idle");
    }
  };

  const formTitle = initialData ? "Edit Actor" : "Add Actor";
  const formDescription = initialData
    ? "Perbarui informasi aktor ini"
    : "Tambah aktor baru ke list";
  const submitButtonText = initialData ? "Submit" : "Submit";

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <Navbar
        keyword={keyword}
        onKeywordChange={setKeyword}
        authUser={authUser}
        roles={authUser ? authUser.tipe : null}
        fullName={authUser ? authUser.fullname : null}
        email={authUser ? authUser.email : null}
        saldo={authUser ? authUser.saldo : null}
        logout={onLogoutHandler}
      />
      <div className="flex flex-1">
        <SidebarAdmin />
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="h-full bg-white">
            <div className="mb-4 inline-flex justify-start items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="text-[#969696] text-base font-normal font-['Geist'] leading-tight hover:text-[#555555] cursor-pointer"
              >
                Actors
              </button>
              <span className="w-5 h-5 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M7 5L12 10L7 15"
                    stroke="#969696"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="text-[#171717] text-base font-medium font-['Geist'] leading-tight">
                {formTitle}
              </div>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div className="flex-grow">
                <h1 className="text-black text-2xl font-medium font-['Geist']">
                  {formTitle}
                </h1>
                <p className="text-neutral-500 text-base font-medium font-['Geist']">
                  {formDescription}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={`px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors ${
                    status === "loading"
                      ? "cursor-not-allowed opacity-75"
                      : "cursor-pointer"
                  }`}
                  form="actor-form"
                >
                  {status === "loading" ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  ) : (
                    submitButtonText
                  )}
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              id="actor-form"
              className="flex flex-col gap-6 md:mr-[15%] lg:mr-[240px]"
            >
              <div className="flex flex-col md:flex-row gap-6 ">
                <div className="flex-1 flex flex-col gap-2">
                  <label
                    htmlFor="actorName"
                    className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal"
                  >
                    Nama
                  </label>
                  <div className="self-stretch h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex items-center border border-gray-300">
                    <input
                      id="actorName"
                      type="text"
                      placeholder="Masukkan nama"
                      className="bg-transparent outline-none border-none w-full text-neutral-900 text-base font-medium font-['Geist'] placeholder-gray-400"
                      value={actorName}
                      onChange={(e) => setActorName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label
                    htmlFor="actorEmail"
                    className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal"
                  >
                    Email
                  </label>
                  <div className="self-stretch h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex items-center border border-gray-300">
                    <input
                      id="actorEmail"
                      type="email"
                      placeholder="Masukkan email"
                      className="bg-transparent outline-none border-none w-full text-neutral-900 text-base font-medium font-['Geist'] placeholder-gray-400"
                      value={actorEmail}
                      onChange={(e) => setActorEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 ">
                {/* Privilege Dropdown */}
                <div className="w-full flex flex-col gap-2">
                  <label className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal">
                    Privilege
                  </label>
                  <div className="relative self-stretch" ref={privilageRef}>
                    <button
                      type="button"
                      className="w-full h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex justify-between items-center text-left border border-gray-300 cursor-pointer"
                      onClick={() => setPrivilageDropdownOpen((prev) => !prev)}
                      aria-haspopup="listbox"
                      aria-expanded={privilageDropdownOpen}
                    >
                      <span className="text-neutral-900 text-base font-medium font-['Geist']">
                        {selectedPrivilage}
                      </span>
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        className={`transition-transform duration-300 ease-in-out ${
                          privilageDropdownOpen ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M7 8L10 11L13 8"
                          stroke="#64748B"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <div
                      role="listbox"
                      aria-hidden={!privilageDropdownOpen}
                      className={`absolute left-0 right-0 mt-1 z-20 bg-white rounded-md shadow-lg border border-gray-200 flex flex-col overflow-hidden max-h-60 overflow-y-auto
                                transition-all duration-300 ease-in-out transform
                                ${
                                  privilageDropdownOpen
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-95 pointer-events-none"
                                }`}
                    >
                      {["Admin", "Pegawai", "Pengguna", "Penitip"].map(
                        (item) => (
                          <div
                            key={item}
                            role="option"
                            aria-selected={selectedPrivilage === item}
                            className={`px-4 py-3 text-black text-base font-normal font-['Geist'] cursor-pointer hover:bg-gray-100
                              ${
                                selectedPrivilage === item ? "bg-gray-100" : ""
                              }`}
                            onClick={() => {
                              setSelectedPrivilage(item);
                              setPrivilageDropdownOpen(false);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                setSelectedPrivilage(item);
                                setPrivilageDropdownOpen(false);
                              }
                            }}
                            tabIndex={0}
                          >
                            {item}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Dropdown - Tampil di mode EDIT hanya jika privilege BUKAN Admin/Pegawai */}
                {initialData &&
                selectedPrivilage !== "Admin" &&
                selectedPrivilage !== "Pegawai" ? (
                  <div className="w-full flex flex-col gap-2">
                    <label className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal">
                      Status Keanggotaan
                    </label>
                    <div className="relative self-stretch" ref={statusRef}>
                      <button
                        type="button"
                        className="w-full h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex justify-between items-center text-left border border-gray-300 cursor-pointer"
                        onClick={() => setStatusDropdownOpen((prev) => !prev)}
                        aria-haspopup="listbox"
                        aria-expanded={statusDropdownOpen}
                      >
                        <span className="text-neutral-900 text-base font-medium font-['Geist']">
                          {selectedStatus}
                        </span>
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          className={`transition-transform duration-300 ease-in-out ${
                            statusDropdownOpen ? "rotate-180" : ""
                          }`}
                        >
                          <path
                            d="M7 8L10 11L13 8"
                            stroke="#64748B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      {statusDropdownOpen && (
                        <div
                          role="listbox"
                          aria-hidden={!statusDropdownOpen}
                          className={`absolute left-0 right-0 mt-1 z-20 bg-white rounded-md shadow-lg border border-gray-200 flex flex-col overflow-hidden max-h-60 overflow-y-auto
                                    transition-all duration-300 ease-in-out transform
                                    ${
                                      statusDropdownOpen
                                        ? "opacity-100 scale-100"
                                        : "opacity-0 scale-95 pointer-events-none"
                                    }`}
                        >
                          {["Aktif", "Tidak Aktif"].map((item) => (
                            <div
                              key={item}
                              role="option"
                              aria-selected={selectedStatus === item}
                              className={`px-4 py-3 text-black text-base font-normal font-['Geist'] cursor-pointer hover:bg-gray-100
                                ${
                                  selectedStatus === item ? "bg-gray-100" : ""
                                }`}
                              onClick={() => {
                                setSelectedStatus(item);
                                setStatusDropdownOpen(false);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  setSelectedStatus(item);
                                  setStatusDropdownOpen(false);
                                }
                              }}
                              tabIndex={0}
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
