'use client';

import Navbar from "@/app/components/Navbar";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import Privilage from "@/app/components/Privilage";
import Image from "next/image";

const actors = [
	{
		id: 1,
		nama: "Mas Fu’ad Grobogan Jateng",
		email: "fuadtamvan@gmail.com",
		status: "Belum Bayar",
		statusClass: "text-DESCTRC-2-FG",
		saldoSukarela: "Rp. 192.700",
		saldoWajib: "Rp. 192.700",
		privilage: "admin",
	},
	{
		id: 2,
		nama: "Mas Fu’ad Grobogan Jateng",
		email: "fuadtamvan@gmail.com",
		status: "Sudah Bayar",
		statusClass: "text-17-SOFT-BLACK",
		saldoSukarela: "Rp. 192.700",
		saldoWajib: "Rp. 192.700",
		privilage: "penitip",
	},
	{
		id: 3,
		nama: "Mas Fu’ad Grobogan Jateng",
		email: "fuadtamvan@gmail.com",
		status: "Sudah Bayar",
		statusClass: "text-17-SOFT-BLACK",
		saldoSukarela: "Rp. 192.700",
		saldoWajib: "Rp. 192.700",
		privilage: "anggota",
	},
	{
		id: 4,
		nama: "Mas Fu’ad Grobogan Jateng",
		email: "fuadtamvan@gmail.com",
		status: "Belum Bayar",
		statusClass: "text-DESCTRC-2-FG",
		saldoSukarela: "Rp. 192.700",
		saldoWajib: "Rp. 192.700",
		privilage: "pegawai",
	},
	{
		id: 5,
		nama: "Mas Fu’ad Grobogan Jateng",
		email: "fuadtamvan@gmail.com",
		status: "Belum Bayar",
		statusClass: "text-DESCTRC-2-FG",
		saldoSukarela: "Rp. 192.700",
		saldoWajib: "Rp. 192.700",
		privilage: "admin",
	},
	{
		id: 6,
		nama: "Mas Fu’ad Grobogan Jateng",
		email: "fuadtamvan@gmail.com",
		status: "Sudah Bayar",
		statusClass: "text-17-SOFT-BLACK",
		saldoSukarela: "Rp. 192.700",
		saldoWajib: "Rp. 192.700",
		privilage: "penitip",
	},
	{
		id: 7,
		nama: "Mas Fu’ad Grobogan Jateng",
		email: "fuadtamvan@gmail.com",
		status: "Sudah Bayar",
		statusClass: "text-17-SOFT-BLACK",
		saldoSukarela: "Rp. 192.700",
		saldoWajib: "Rp. 192.700",
		privilage: "anggota",
	},
	{
		id: 8,
		nama: "Mas Fu’ad Grobogan Jateng",
		email: "fuadtamvan@gmail.com",
		status: "Belum Bayar",
		statusClass: "text-DESCTRC-2-FG",
		saldoSukarela: "Rp. 192.700",
		saldoWajib: "Rp. 192.700",
		privilage: "pegawai",
	},
];

export default function ActorsPage() {
	return (
		<div className="w-[1440px] h-[1024px] relative bg-white overflow-hidden">
			{/* Navbar */}
			<div className="w-[1440px] h-20 left-0 top-0 absolute bg-white border-b overflow-hidden z-10">
				<Navbar />
			</div>
			{/* Sidebar */}
			<div className="w-72 min-h-[936px] px-3 pt-3 pb-4 left-[20px] top-[88px] absolute bg-gray-100 rounded-xl flex flex-col gap-2.5 overflow-hidden z-10">
				<SidebarAdmin />
			</div>
			{/* Main Content */}
			<div className="w-[1124px] h-[936px] left-[316px] top-[88px] absolute bg-white rounded-xl overflow-hidden">
				<div className="w-[1072px] h-[840px] left-[20px] top-[16px] absolute">
					{/* Header Info */}
					<div className="w-[1072px] h-16 left-0 top-0 absolute inline-flex justify-between items-end">
						<div className="flex justify-start items-start gap-9">
							<div className="inline-flex flex-col justify-start items-start gap-2">
								<div className="inline-flex justify-center items-center gap-2.5">
									<div className="text-stone-500 text-base font-normal font-['Geist'] leading-normal">
										Iuran Wajib:
									</div>
								</div>
								<div className="min-w-40 px-3 py-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stroke-4 inline-flex justify-start items-center gap-2">
									<div className="inline-flex flex-col justify-center items-center gap-2.5">
										<div className="self-stretch text-foreground-9 text-base font-normal font-['Geist'] leading-tight">
											Rp
										</div>
									</div>
									<div className="flex justify-start items-center gap-2">
										<div className="flex justify-center items-center">
											<div className="text-neutral-900 text-base font-medium font-['Geist'] leading-normal">
												172.659.267
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="min-w-40 inline-flex flex-col justify-start items-start gap-2">
								<div className="inline-flex justify-center items-center gap-2.5">
									<div className="text-stone-500 text-base font-normal font-['Geist'] leading-normal">
										Tenggat Bayar:
									</div>
								</div>
								<div className="px-3 py-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stroke-4 inline-flex justify-start items-center gap-2">
									<div className="size-5 relative overflow-hidden">
										<div className="w-0 h-[3.33px] left-[6.67px] top-[1.67px] absolute outline outline-2 outline-offset-[-1px] outline-neutral-400" />
										<div className="w-0 h-[3.33px] left-[13.33px] top-[1.67px] absolute outline outline-2 outline-offset-[-1px] outline-neutral-400" />
										<div className="size-3.5 left-[2.50px] top-[3.33px] absolute outline outline-2 outline-offset-[-1px] outline-neutral-400" />
										<div className="w-3.5 h-0 left-[2.50px] top-[8.33px] absolute outline outline-2 outline-offset-[-1px] outline-neutral-400" />
									</div>
									<div className="flex justify-center items-center">
										<div className="justify-start">
											<span className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">
												Tgl{" "}
											</span>
											<span className="text-black text-base font-medium font-['Geist'] leading-normal">
												27
											</span>
											<span className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">
												{" "}/ Bulan
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="px-3 py-2 bg-PRIMARY-1 rounded-lg outline outline-1 outline-offset-[-1px] inline-flex justify-start items-center gap-1 overflow-hidden">
							{/* Icon listrik di kiri */}
							<img src="/listrik.svg" alt="Listrik" className="w-6 h-6" />
							{/* Teks Actions */}
							<div className="px-2 flex justify-center items-center">
								<div className="text-FOREGROUND-2 text-base font-medium font-['Geist'] leading-normal">
									Actions
								</div>
							</div>
							{/* Icon arrow page down di kanan */}
							<img src="/arrow-down.svg" alt="Arrow Down" className="w-6 h-6" />
						</div>
					</div>
					{/* Table */}
					<div className="w-[1072px] left-0 top-[96px] absolute flex flex-col justify-start items-start">
						<div className="w-full max-w-[1084px] border-b border-STROKE1 flex flex-col justify-start items-start gap-2.5 overflow-hidden">
							<div className="self-stretch inline-flex justify-start items-center">
								<div className="size-14 max-w-16 border-r border-STROKE1 flex justify-center items-center gap-2">
									<div className="text-SIDEBAR-MODULE text-base font-medium font-['Geist'] leading-normal">
										ID
									</div>
								</div>
								<div className="flex-1 h-14 border-r border-STROKE1 flex justify-center items-center gap-2">
									<div className="text-SIDEBAR-MODULE text-base font-medium font-['Geist'] leading-normal">
										Nama Anggota
									</div>
								</div>
								<div className="flex-1 h-14 max-w-52 min-w-48 border-r border-STROKE1 flex justify-center items-center gap-2">
									<div className="text-SIDEBAR-MODULE text-base font-medium font-['Geist'] leading-normal">
										Email
									</div>
								</div>
								<div className="w-28 h-14 max-w-28 border-r border-neutral-200 flex justify-center items-center gap-2">
									<div className="text-SIDEBAR-MODULE text-base font-medium font-['Geist'] leading-normal">
										Status
									</div>
								</div>
								<div className="flex-1 h-14 max-w-32 border-r border-STROKE1 flex justify-center items-center gap-2">
									<div className="text-SIDEBAR-MODULE text-base font-medium font-['Geist'] leading-normal">
										Saldo Sukarela
									</div>
								</div>
								<div className="flex-1 h-14 max-w-28 border-r border-STROKE1 flex justify-center items-center gap-2">
									<div className="text-SIDEBAR-MODULE text-base font-medium font-['Geist'] leading-normal">
										Saldo Wajib
									</div>
								</div>
								<div className="flex-1 h-14 max-w-28 border-r border-STROKE1 flex justify-center items-center gap-2">
									<div className="text-SIDEBAR-MODULE text-base font-medium font-['Geist'] leading-normal">
										Privilege
									</div>
								</div>
								<div className="w-24 h-14 border-r border-neutral-200 flex justify-center items-center gap-2">
									<div className="text-SIDEBAR-MODULE text-base font-medium font-['Geist'] leading-normal">
										Aksi
									</div>
								</div>
							</div>
						</div>
						{/* Table Rows */}
						{actors.map((actor) => (
							<div
								key={actor.id}
								className="self-stretch h-16 border-b border-STROKE1 inline-flex justify-start items-center"
							>
								<div className="w-14 self-stretch max-w-16 p-2 border-r border-STROKE1 flex justify-center items-center gap-2">
									<div className="flex-1 text-center text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">
										{actor.id}
									</div>
								</div>
								<div className="flex-1 self-stretch p-2 border-r border-STROKE1 flex justify-center items-center gap-2">
									<div className="flex-1 text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">
										{actor.nama}
									</div>
								</div>
								<div className="w-52 self-stretch p-2 border-r border-STROKE1 flex justify-center items-center gap-2">
									<div className="flex-1 text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">
										{actor.email}
									</div>
								</div>
								<div className="flex-1 self-stretch max-w-28 p-2 border-r border-STROKE1 flex justify-center items-center gap-2">
									<div className="w-24 h-6 relative">
										<div
											className={`w-24 left-0 top-0 absolute text-center text-base font-medium font-['Geist'] leading-normal ${
												actor.status === "Sudah Bayar"
													? "text-black"
													: "text-red-600"
											}`}
										>
											{actor.status}
										</div>
									</div>
								</div>
								<div className="flex-1 self-stretch max-w-32 p-2 border-r border-STROKE1 flex justify-center items-center gap-2">
									<div className="flex-1 text-center text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">
										{actor.saldoSukarela}
									</div>
								</div>
								<div className="flex-1 self-stretch max-w-28 p-2 border-r border-STROKE1 flex justify-center items-center gap-2">
									<div className="flex-1 text-center text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">
										{actor.saldoWajib}
									</div>
								</div>
								<div className="flex-1 self-stretch max-w-28 p-2 border-r border-STROKE1 flex justify-center items-center gap-2">
									<Privilage value={actor.privilage} />
								</div>
								<div className="w-24 self-stretch p-2 border-r border-STROKE1 flex justify-center items-center gap-2">
									<div className="flex justify-center items-center gap-4">
										<Image
											src="/Trash.svg"
											alt="Hapus"
											width={24}
											height={24}
											className="w-6 h-6 cursor-pointer"
										/>
										<Image
											src="/Pensil.svg"
											alt="Edit"
											width={24}
											height={24}
											className="w-6 h-6 cursor-pointer"
										/>
									</div>
								</div>
							</div>
						))}
					</div>
					{/* Pagination */}
					<div className="w-[1072px] h-6 left-0 top-[816px] absolute flex justify-center items-center gap-2">
						<div className="flex justify-center items-center gap-2">
							<div className="size-6 relative overflow-hidden">
								<div className="w-1.5 h-3 left-[9px] top-[6px] absolute outline outline-2 outline-offset-[-1px] outline-pagenum-left" />
							</div>
							<div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">
								1
							</div>
							<div className="text-SIDEBAR-MODULE text-base font-medium font-['Geist'] leading-normal">
								...
							</div>
							<div className="text-SIDEBAR-MODULE text-base font-medium font-['Geist'] leading-normal">
								6
							</div>
							<div className="size-6 relative overflow-hidden">
								<div className="w-1.5 h-3 left-[9px] top-[6px] absolute outline outline-2 outline-offset-[-1px] outline-17-SOFT-BLACK" />
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Success Notification */}
			<div className="h-12 p-4 left-[527px] top-[1058px] absolute bg-fill-success rounded-xl shadow-[0px_4px_8px_0px_rgba(0,0,0,0.02)] shadow-[0px_8px_16px_-0.5px_rgba(0,0,0,0.02)] shadow-[0px_0px_0px_1px_rgba(41,122,58,0.32)] shadow-[0px_12px_24px_-1.5px_rgba(0,0,0,0.04)] shadow-[0px_16px_32px_-3px_rgba(0,0,0,0.04)] outline outline-1 outline-offset-[-1px] flex items-center gap-12 overflow-hidden">
				<div className="flex items-center gap-3">
					<div className="size-6 relative overflow-hidden">
						<div className="size-5 left-[2px] top-[1.99px] absolute outline outline-2 outline-offset-[-1px] outline-foreground-success" />
					</div>
					<div className="text-foreground-success text-base font-medium font-['Inter'] leading-normal">
						Barang berhasil ditambahkan ke keranjang
					</div>
				</div>
			</div>
		</div>
	);
}