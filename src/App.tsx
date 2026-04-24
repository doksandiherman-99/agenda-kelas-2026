import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Calendar,
  CalendarDays,
  ClipboardList,
  FileBarChart2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  UserCheck,
  Wrench,
  X,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";

type AppConfig = {
  appName: string;
  copyright: string;
  version: string;
  logoUrl: string;
};

type Profile = {
  fullName: string;
  position: string;
  subject: string;
  className: string;
  email: string;
  verificationCode: string;
  confirmCode: string;
  photo: string;
};

type Holiday = {
  id: string;
  image: string;
  startDate: string;
  endDate: string;
  type: string;
  note: string;
  basis: string;
};

type AgendaSchedule = {
  id: string;
  activeDays: string[];
  startTime: string;
  endTime: string;
  doneNote: string;
  image: string;
};

type Educator = {
  id: string;
  fullName: string;
  nip: string;
  position: string;
  gender: string;
  email: string;
  subject: string;
  className: string;
  verificationCode: string;
  photo: string;
  active: boolean;
};

type Student = {
  id: string;
  fullName: string;
  nisn: string;
  position: string;
  gender: string;
  className: string;
  verificationCode: string;
  photo: string;
  active: boolean;
};

type Information = {
  id: string;
  title: string;
  content: string;
  sender: string;
  sendDate: string;
  status: "terkirim" | "tidak terkirim";
};

type AgendaEntry = {
  id: string;
  day: string;
  date: string;
  className: string;
  subject: string;
  educatorName: string;
  subMaterial: string;
  absentStudents: string[];
  sickStudents: string[];
  permitStudents: string[];
  academicYear: string;
  semester: "ganjil" | "genap";
  shortNote: string;
};

type Recap = {
  id: string;
  semester: string;
  year: string;
  subject: string;
  className: string;
  rangeStart: string;
  rangeEnd: string;
};

type Maintenance = {
  title: string;
  message: string;
  startDate: string;
  endDate: string;
  active: boolean;
};

type Permission = { view: boolean; add: boolean; edit: boolean; delete: boolean };
type AccessControl = Record<string, Permission>;

type AppData = {
  appConfig: AppConfig;
  profile: Profile;
  levels: string[];
  subjects: string[];
  classes: string[];
  holidays: Holiday[];
  agendaSchedules: AgendaSchedule[];
  educators: Educator[];
  students: Student[];
  informations: Information[];
  agendas: AgendaEntry[];
  dailyRecaps: Recap[];
  monthlyRecaps: Recap[];
  yearlyRecaps: Recap[];
  maintenance: Maintenance;
  access: AccessControl;
};

const defaultAvatar =
  "https://img.freepik.com/vektor-premium/ikon-profil-avatar-dalam-gaya-datar-ilustrasi-vektor-profil-pengguna-pria-pada-latar-belakang-terisolasi-konsep-bisnis-tanda-profil-pria_157943-38764.jpg";
const defaultStudentAvatar =
  "https://img.freepik.com/vektor-premium/logo-profil-siswa-laki-laki-lucu-berseragam-sekolah_1639-51013.jpg";
const defaultLogo =
  "https://png.pngtree.com/png-vector/20231223/ourmid/pngtree-online-classes-icon-classes-png-image_11201917.png";
const defaultCode = "@199001092019031002";

const menuKeys = [
  "dashboard",
  "profil",
  "pengaturan",
  "pendidik",
  "murid",
  "informasi",
  "agenda",
  "rekap-harian",
  "rekap-bulanan",
  "rekap-tahunan",
  "maintenance",
];

const defaultAccess: AccessControl = menuKeys.reduce((acc, key) => {
  acc[key] = { view: true, add: true, edit: true, delete: true };
  return acc;
}, {} as AccessControl);

const defaultData: AppData = {
  appConfig: {
    appName: "Agenda Kelas",
    copyright: "Copyright 2026 Agenda Kelas",
    version: "v1.0.0",
    logoUrl: defaultLogo,
  },
  profile: {
    fullName: "Admin Sekolah",
    position: "Admin",
    subject: "Informatika",
    className: "7",
    email: "admin@sekolah.sch.id",
    verificationCode: defaultCode,
    confirmCode: defaultCode,
    photo: defaultAvatar,
  },
  levels: ["Admin", "Wali Kelas 7", "Wali Kelas 8", "Wali Kelas 9", "Ketua Kelas"],
  subjects: ["Pendidikan Agama Islam", "Matematika", "Bahasa Indonesia", "Informatika"],
  classes: ["7", "8", "9"],
  holidays: [
    {
      id: "holiday-1",
      image: defaultLogo,
      startDate: "2026-01-01",
      endDate: "2026-01-01",
      type: "Libur Nasional",
      note: "Tahun Baru",
      basis: "Keputusan Pemerintah",
    },
  ],
  agendaSchedules: [
    {
      id: "schedule-1",
      activeDays: ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at"],
      startTime: "07:00",
      endTime: "12:00",
      doneNote: "Input agenda selesai pukul 12:00",
      image: defaultLogo,
    },
  ],
  educators: [
    {
      id: "edu-1",
      fullName: "Budi Santoso",
      nip: "198711112010011001",
      position: "Wali Kelas 7",
      gender: "Laki-Laki",
      email: "budi@sekolah.sch.id",
      subject: "Matematika",
      className: "7",
      verificationCode: "GURU-7-A",
      photo: defaultAvatar,
      active: true,
    },
    {
      id: "edu-2",
      fullName: "Siti Aminah",
      nip: "198902022012012002",
      position: "Wali Kelas 8",
      gender: "Perempuan",
      email: "siti@sekolah.sch.id",
      subject: "Bahasa Indonesia",
      className: "8",
      verificationCode: "GURU-8-B",
      photo: defaultAvatar,
      active: true,
    },
  ],
  students: [
    {
      id: "stu-1",
      fullName: "Andi Pratama",
      nisn: "0071234561",
      position: "Ketua Kelas",
      gender: "Laki-Laki",
      className: "7",
      verificationCode: "MURID-7-01",
      photo: defaultStudentAvatar,
      active: true,
    },
    {
      id: "stu-2",
      fullName: "Nadia Putri",
      nisn: "0071234562",
      position: "Anggota Kelas",
      gender: "Perempuan",
      className: "7",
      verificationCode: "MURID-7-02",
      photo: defaultStudentAvatar,
      active: true,
    },
    {
      id: "stu-3",
      fullName: "Raka Saputra",
      nisn: "0081234563",
      position: "Anggota Kelas",
      gender: "Laki-Laki",
      className: "8",
      verificationCode: "MURID-8-01",
      photo: defaultStudentAvatar,
      active: true,
    },
  ],
  informations: [
    {
      id: "info-1",
      title: "Rapat Wali Kelas",
      content: "Rapat wali kelas dilaksanakan Jumat pukul 13:00.",
      sender: "Admin Sekolah",
      sendDate: "2026-01-10",
      status: "terkirim",
    },
  ],
  agendas: [
    {
      id: "agenda-1",
      day: "Senin",
      date: "2026-01-12",
      className: "7",
      subject: "Matematika",
      educatorName: "Budi Santoso",
      subMaterial: "Persamaan Linear",
      absentStudents: ["Nadia Putri"],
      sickStudents: [],
      permitStudents: [],
      academicYear: "2026/2027",
      semester: "ganjil",
      shortNote: "Kelas aktif dan diskusi berjalan baik.",
    },
  ],
  dailyRecaps: [
    {
      id: "daily-1",
      semester: "ganjil",
      year: "2026/2027",
      subject: "Matematika",
      className: "7",
      rangeStart: "2026-01-01",
      rangeEnd: "2026-01-12",
    },
  ],
  monthlyRecaps: [
    {
      id: "monthly-1",
      semester: "ganjil",
      year: "2026/2027",
      subject: "Semua",
      className: "Semua",
      rangeStart: "2026-01-01",
      rangeEnd: "2026-01-31",
    },
  ],
  yearlyRecaps: [
    {
      id: "yearly-1",
      semester: "ganjil",
      year: "2026/2027",
      subject: "Semua",
      className: "Semua",
      rangeStart: "2026-01-01",
      rangeEnd: "2026-12-31",
    },
  ],
  maintenance: {
    title: "",
    message: "",
    startDate: "",
    endDate: "",
    active: false,
  },
  access: defaultAccess,
};

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const parseCommaText = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const AppShell = ({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) => (
  <section className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
      {actions}
    </div>
    {children}
  </section>
);

function App() {
  const [data, setData] = useState<AppData>(defaultData);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [settingTab, setSettingTab] = useState("aplikasi");
  const [collapsed, setCollapsed] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifiedUser, setVerifiedUser] = useState<Profile | Educator | Student | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [verifyError, setVerifyError] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [detailModal, setDetailModal] = useState<{ title: string; data: Record<string, unknown> } | null>(null);
  const syncTimerRef = useRef<number | null>(null);
  const [editingHolidayId, setEditingHolidayId] = useState<string | null>(null);
  const [editingEducatorId, setEditingEducatorId] = useState<string | null>(null);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editingInformationId, setEditingInformationId] = useState<string | null>(null);
  const [editingAgendaId, setEditingAgendaId] = useState<string | null>(null);
  const [editingRecap, setEditingRecap] = useState<{ key: "dailyRecaps" | "monthlyRecaps" | "yearlyRecaps"; id: string } | null>(null);
  const [reportModal, setReportModal] = useState<{ title: string; recap: Recap; records: AgendaEntry[] } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [infoModal, setInfoModal] = useState<{ title: string; message: string } | null>(null);

  const [holidayFilter, setHolidayFilter] = useState("");
  const [educatorFilter, setEducatorFilter] = useState("");
  const [studentFilter, setStudentFilter] = useState("");
  const [informationFilter, setInformationFilter] = useState("");
  const [agendaDayFilter, setAgendaDayFilter] = useState("");
  const [agendaDateFilter, setAgendaDateFilter] = useState("");
  const [newHoliday, setNewHoliday] = useState<Holiday>({
    id: "",
    image: "",
    startDate: "",
    endDate: "",
    type: "",
    note: "",
    basis: "",
  });
  const [newEducator, setNewEducator] = useState<Educator>({
    id: "",
    fullName: "",
    nip: "",
    position: "",
    gender: "Laki-Laki",
    email: "",
    subject: "",
    className: "",
    verificationCode: defaultCode,
    photo: defaultAvatar,
    active: true,
  });
  const [newStudent, setNewStudent] = useState<Student>({
    id: "",
    fullName: "",
    nisn: "",
    position: "",
    gender: "Laki-Laki",
    className: "",
    verificationCode: defaultCode,
    photo: defaultStudentAvatar,
    active: true,
  });
  const [newInformation, setNewInformation] = useState<Information>({
    id: "",
    title: "",
    content: "",
    sender: "",
    sendDate: "",
    status: "terkirim",
  });
  const [newAgenda, setNewAgenda] = useState<AgendaEntry>({
    id: "",
    day: "",
    date: "",
    className: "",
    subject: "",
    educatorName: "",
    subMaterial: "",
    absentStudents: [],
    sickStudents: [],
    permitStudents: [],
    academicYear: "",
    semester: "ganjil",
    shortNote: "",
  });
  const [newSchedule, setNewSchedule] = useState<AgendaSchedule>({
    id: "",
    activeDays: [],
    startTime: "",
    endTime: "",
    doneNote: "",
    image: "",
  });
  const [recapForm, setRecapForm] = useState({
    semester: "ganjil",
    year: "2026/2027",
    subject: "Semua",
    className: "Semua",
    rangeStart: "",
    rangeEnd: "",
  });

  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [showEducatorModal, setShowEducatorModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showInformationModal, setShowInformationModal] = useState(false);
  const [showAgendaModal, setShowAgendaModal] = useState(false);
  const [cloudLoading, setCloudLoading] = useState(true);
  const [cloudError, setCloudError] = useState("");
  const [localRevision, setLocalRevision] = useState(0);

  const appsScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined;
  const appsScriptToken = import.meta.env.VITE_APPS_SCRIPT_TOKEN as string | undefined;
  const dirtyRef = useRef(false);
  const lastCloudUpdateRef = useRef("");

  useEffect(() => {
    const preventContext = (event: MouseEvent) => event.preventDefault();
    const preventCopy = (event: ClipboardEvent) => event.preventDefault();
    const preventShortcuts = (event: KeyboardEvent) => {
      const isBlockedCombo =
        (event.ctrlKey || event.metaKey) && ["c", "x", "u", "s", "p"].includes(event.key.toLowerCase());
      if (isBlockedCombo) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventContext);
    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);
    document.addEventListener("keydown", preventShortcuts);

    return () => {
      document.removeEventListener("contextmenu", preventContext);
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
      document.removeEventListener("keydown", preventShortcuts);
    };
  }, []);

  useEffect(() => {
    if (!appsScriptUrl || !appsScriptToken) {
      setCloudLoading(false);
      setCloudError("VITE_APPS_SCRIPT_URL atau VITE_APPS_SCRIPT_TOKEN belum diatur.");
      return;
    }

    let active = true;
    const fetchCloud = async (silent: boolean) => {
      try {
        const response = await fetch(appsScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "getAll", token: appsScriptToken }),
        });
        const result = await response.json();
        if (!active) return;
        if (result?.ok && result?.payload) {
          if (!dirtyRef.current) {
            setData({ ...defaultData, ...result.payload } as AppData);
          }
          lastCloudUpdateRef.current = result.updatedAt || lastCloudUpdateRef.current;
          setCloudError("");
          setCloudLoading(false);
          return;
        }
        if (!silent) setCloudError(result?.message || "Gagal mengambil data cloud.");
      } catch {
        if (!silent) setCloudError("Tidak dapat terhubung ke Apps Script.");
      } finally {
        if (!silent) setCloudLoading(false);
      }
    };

    fetchCloud(false);
    const pollId = window.setInterval(() => fetchCloud(true), 5000);
    return () => {
      active = false;
      window.clearInterval(pollId);
    };
  }, [appsScriptToken, appsScriptUrl]);

  const syncCloud = async (nextData: AppData) => {
    if (!appsScriptUrl || !appsScriptToken) return false;
    try {
      const response = await fetch(appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upsertAll",
          token: appsScriptToken,
          payload: nextData,
          clientUpdatedAt: lastCloudUpdateRef.current,
        }),
      });
      const result = await response.json();
      if (result?.ok) {
        lastCloudUpdateRef.current = result.updatedAt || lastCloudUpdateRef.current;
        setCloudError("");
        return true;
      }
      if (result?.conflict) {
        setCloudError("Perubahan user lain terdeteksi. Data terbaru dimuat ulang.");
        const refreshResponse = await fetch(appsScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "getAll", token: appsScriptToken }),
        });
        const refreshResult = await refreshResponse.json();
        if (refreshResult?.ok && refreshResult?.payload) {
          setData({ ...defaultData, ...refreshResult.payload } as AppData);
          dirtyRef.current = false;
          lastCloudUpdateRef.current = refreshResult.updatedAt || lastCloudUpdateRef.current;
        }
        return false;
      }
      setCloudError(result?.message || "Sinkronisasi cloud gagal.");
      return false;
    } catch {
      setCloudError("Sinkronisasi cloud gagal. Cek koneksi internet.");
      return false;
    }
  };

  useEffect(() => {
    if (localRevision === 0) return;
    if (!dirtyRef.current) return;
    if (syncTimerRef.current) {
      window.clearTimeout(syncTimerRef.current);
    }
    syncTimerRef.current = window.setTimeout(async () => {
      const ok = await syncCloud(data);
      if (ok) {
        dirtyRef.current = false;
      }
    }, 700);

    return () => {
      if (syncTimerRef.current) {
        window.clearTimeout(syncTimerRef.current);
      }
    };
  }, [data, localRevision]);

  const saveData = (updater: (current: AppData) => AppData) => {
    setData((current) => {
      const nextData = updater(current);
      dirtyRef.current = true;
      return nextData;
    });
    setLocalRevision((prev) => prev + 1);
  };

  const openDetail = (title: string, value: unknown) => {
    if (!value || typeof value !== "object") return;
    setDetailModal({ title, data: value as Record<string, unknown> });
  };

  const showInfo = (title: string, message: string) => setInfoModal({ title, message });

  const askConfirm = (title: string, message: string, onConfirm: () => void) =>
    setConfirmModal({ title, message, onConfirm });

  const countPresent = (agenda: AgendaEntry) => {
    const totalStudent = data.students.filter((s) => s.className === agenda.className).length;
    return Math.max(0, totalStudent - agenda.absentStudents.length - agenda.sickStudents.length - agenda.permitStudents.length);
  };

  const matchRecapRange = (date: string, recap: Recap, mode: "daily" | "monthly" | "yearly") => {
    if (!date) return false;
    if (mode === "daily") {
      if (!recap.rangeStart || !recap.rangeEnd) return true;
      return date >= recap.rangeStart && date <= recap.rangeEnd;
    }
    if (mode === "monthly") {
      const month = date.slice(0, 7);
      return month >= recap.rangeStart && month <= recap.rangeEnd;
    }
    const year = date.slice(0, 4);
    return year >= recap.rangeStart && year <= recap.rangeEnd;
  };

  const getRecapRecords = (recap: Recap, mode: "daily" | "monthly" | "yearly") =>
    data.agendas.filter(
      (agenda) =>
        (recap.subject === "Semua" || agenda.subject === recap.subject) &&
        (recap.className === "Semua" || agenda.className === recap.className) &&
        matchRecapRange(agenda.date, recap, mode),
    );

  const renderReportHtml = (title: string, recap: Recap, records: AgendaEntry[]) => {
    const rows = records
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.date}</td>
            <td>${item.day}</td>
            <td>${item.className}</td>
            <td>${item.subject}</td>
            <td>${item.educatorName}</td>
            <td>${item.subMaterial}</td>
            <td>${countPresent(item)}</td>
            <td>${item.absentStudents.length}</td>
            <td>${item.permitStudents.length}</td>
            <td>${item.sickStudents.length}</td>
          </tr>`,
      )
      .join("");

    return `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            h1, h2, p { margin: 0; }
            .header { text-align: center; margin-bottom: 16px; }
            .meta { margin: 12px 0; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #334155; padding: 6px; text-align: left; }
            th { background: #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${data.appConfig.appName}</h1>
            <h2>${title}</h2>
          </div>
          <div class="meta">
            <p>Semester: ${recap.semester}</p>
            <p>Tahun Ajaran: ${recap.year}</p>
            <p>Mata Pelajaran: ${recap.subject}</p>
            <p>Kelas: ${recap.className}</p>
            <p>Periode: ${recap.rangeStart} s/d ${recap.rangeEnd}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>No</th><th>Tanggal</th><th>Hari</th><th>Kelas</th><th>Mapel</th><th>Pendidik</th><th>Sub Materi</th><th>Hadir</th><th>Alpa</th><th>Izin</th><th>Sakit</th>
              </tr>
            </thead>
            <tbody>
              ${rows || '<tr><td colspan="11">Data tidak ditemukan</td></tr>'}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  const printRecapReport = (title: string, recap: Recap, records: AgendaEntry[]) => {
    const w = window.open("", "_blank", "width=1200,height=800");
    if (!w) return;
    w.document.write(renderReportHtml(title, recap, records));
    w.document.close();
    w.focus();
    w.print();
  };

  const handleMenuToggle = () => {
    if (window.innerWidth < 768) {
      setMobileMenuOpen((prev) => !prev);
      return;
    }
    setCollapsed((v) => !v);
  };

  const summary = useMemo(() => {
    const alpa = data.agendas.reduce((sum, item) => sum + item.absentStudents.length, 0);
    const izin = data.agendas.reduce((sum, item) => sum + item.permitStudents.length, 0);
    const sakit = data.agendas.reduce((sum, item) => sum + item.sickStudents.length, 0);
    const perClass = data.classes.map((className) => {
      const classAgenda = data.agendas.filter((agenda) => agenda.className === className);
      const total = classAgenda.reduce(
        (sum, item) => sum + item.absentStudents.length + item.sickStudents.length + item.permitStudents.length,
        0,
      );
      return { className, total };
    });
    return { alpa, izin, sakit, perClass };
  }, [data.agendas, data.classes]);

  const checkPermission = (menu: string, action: keyof Permission) => data.access[menu]?.[action] ?? true;

  const handleVerification = () => {
    const matchEducator = data.educators.find((item) => item.verificationCode === verifyCode);
    const matchStudent = data.students.find((item) => item.verificationCode === verifyCode);
    if (verifyCode === data.profile.verificationCode || matchEducator || matchStudent) {
      setVerifiedUser(matchEducator ?? matchStudent ?? data.profile);
      setVerifyError(false);
      return;
    }
    setVerifiedUser(null);
    setVerifyError(true);
  };

  const logoutMessage = `Apakah ${data.profile.fullName} yakin ingin menutup aplikasi ${data.appConfig.appName} ini?`;

  const studentByClass = data.students.filter((item) => item.className === newAgenda.className);
  const educatorsByClassSubject = data.educators.filter(
    (item) => item.className === newAgenda.className && item.subject === newAgenda.subject,
  );

  const Table = ({ headers, children }: { headers: string[]; children: ReactNode }) => (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="max-h-[420px] overflow-auto">
        <table className="w-full min-w-[900px] text-left text-sm text-slate-200">
          <thead className="sticky top-0 bg-slate-900/95 text-xs uppercase tracking-wide text-slate-400 backdrop-blur">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-3 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">{children}</tbody>
        </table>
      </div>
    </div>
  );

  const actionButtons = ({
    onView,
    onEdit,
    onDelete,
  }: {
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
  }) => (
    <div className="flex items-center gap-2 text-slate-300">
      <button className="rounded-lg border border-white/20 px-2 py-1 text-xs" onClick={onView} type="button">
        Lihat
      </button>
      <button className="rounded-lg border border-white/20 px-2 py-1 text-xs" onClick={onEdit} type="button">
        Edit
      </button>
      <button
        className="rounded-lg border border-rose-400/50 px-2 py-1 text-xs text-rose-300"
        onClick={onDelete}
        type="button"
      >
        Hapus
      </button>
    </div>
  );

  const menu = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "profil", label: "Profil", icon: User },
    { key: "pengaturan", label: "Pengaturan", icon: Settings },
    { key: "pendidik", label: "Pengguna Pendidik", icon: UserCheck },
    { key: "murid", label: "Pengguna Murid", icon: GraduationCap },
    { key: "informasi", label: "Informasi", icon: Bell },
    { key: "agenda", label: "Isi Agenda", icon: ClipboardList },
    { key: "rekap-harian", label: "Rekap Harian", icon: CalendarDays },
    { key: "rekap-bulanan", label: "Rekap Bulanan", icon: Calendar },
    { key: "rekap-tahunan", label: "Rekap Tahunan", icon: FileBarChart2 },
    { key: "maintenance", label: "Maintenance", icon: Wrench },
  ];

  const renderContent = () => {
    if (!checkPermission(activeMenu, "view")) {
      return <p className="text-amber-300">Akses menu ini dinonaktifkan oleh admin.</p>;
    }

    if (activeMenu === "dashboard") {
      return (
        <AppShell title="Dashboard">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[
              ["Total Pengguna", data.educators.length + data.students.length],
              ["Mapel", data.subjects.length],
              ["Kelas", data.classes.length],
              ["Alpa", summary.alpa],
              ["Izin", summary.izin],
              ["Sakit", summary.sakit],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border border-white/10 bg-slate-900/45 p-4">
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 rounded-xl border border-white/10 bg-slate-900/45 p-4">
            <p className="text-sm font-medium text-slate-200">Grafik Kelas Banyak Alpa/Izin/Sakit</p>
            <div className="space-y-3">
              {summary.perClass.map((item) => {
                const width = Math.min(100, item.total * 10);
                return (
                  <div key={item.className} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Kelas {item.className}</span>
                      <span>{item.total}</span>
                    </div>
                    <div className="h-2 rounded bg-white/10">
                      <motion.div
                        className="h-full rounded bg-gradient-to-r from-cyan-400 to-violet-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.7 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AppShell>
      );
    }

    if (activeMenu === "profil") {
      return (
        <AppShell
          title="Profil"
          actions={
            <button
              onClick={() =>
                saveData((current) => {
                  const next = {
                    ...current,
                    profile: { ...current.profile, confirmCode: current.profile.verificationCode },
                  };
                  showInfo("Simpan Profil", "Data profil berhasil disimpan.");
                  return next;
                })
              }
              className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-slate-900"
              type="button"
            >
              Simpan Profil
            </button>
          }
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="label">Nama Lengkap</label>
              <input
                value={data.profile.fullName}
                onChange={(e) => saveData((c) => ({ ...c, profile: { ...c.profile, fullName: e.target.value } }))}
                className="input"
                placeholder="Nama Lengkap"
              />
            </div>
            <div>
              <label className="label">Jabatan</label>
              <select
                value={data.profile.position}
                onChange={(e) => saveData((c) => ({ ...c, profile: { ...c.profile, position: e.target.value } }))}
                className="input"
              >
                {data.levels.map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Email Aktif</label>
              <input
                value={data.profile.email}
                onChange={(e) => saveData((c) => ({ ...c, profile: { ...c.profile, email: e.target.value } }))}
                className="input"
                placeholder="Email Aktif"
              />
            </div>
            <div>
              <label className="label">Kode Verifikasi</label>
              <input
                value={data.profile.verificationCode}
                onChange={(e) => saveData((c) => ({ ...c, profile: { ...c.profile, verificationCode: e.target.value } }))}
                className="input"
                placeholder="Kode Verifikasi"
              />
            </div>
            <div>
              <label className="label">Konfirmasi Kode Verifikasi</label>
              <input
                value={data.profile.confirmCode}
                onChange={(e) => saveData((c) => ({ ...c, profile: { ...c.profile, confirmCode: e.target.value } }))}
                className="input"
                placeholder="Konfirmasi Kode"
              />
            </div>
            <div>
              <label className="label">Link Foto Profil</label>
              <input
                value={data.profile.photo}
                onChange={(e) => saveData((c) => ({ ...c, profile: { ...c.profile, photo: e.target.value } }))}
                className="input"
                placeholder="Link Foto Profil"
              />
            </div>
          </div>
        </AppShell>
      );
    }

    if (activeMenu === "pengaturan") {
      return (
        <AppShell title="Pengaturan">
          <div className="flex flex-wrap gap-2">
            {[
              "aplikasi",
              "level pengguna",
              "mata pelajaran",
              "rombel kelas",
              "jadwal libur",
              "jadwal input agenda",
              "akses pengguna",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setSettingTab(tab)}
                className={`rounded-lg border px-3 py-2 text-xs uppercase ${
                  settingTab === tab ? "border-cyan-300 bg-cyan-400/20 text-cyan-100" : "border-white/15 text-slate-300"
                }`}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>

          {settingTab === "aplikasi" && (
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="label">Nama Aplikasi</label>
                <input
                  className="input"
                  value={data.appConfig.appName}
                  placeholder="Nama Aplikasi"
                  onChange={(e) => saveData((c) => ({ ...c, appConfig: { ...c.appConfig, appName: e.target.value } }))}
                />
              </div>
              <div>
                <label className="label">Versi Aplikasi</label>
                <input
                  className="input"
                  value={data.appConfig.version}
                  placeholder="Versi Aplikasi"
                  onChange={(e) => saveData((c) => ({ ...c, appConfig: { ...c.appConfig, version: e.target.value } }))}
                />
              </div>
              <div>
                <label className="label">Hak Cipta</label>
                <input
                  className="input"
                  value={data.appConfig.copyright}
                  placeholder="Hak Cipta"
                  onChange={(e) => saveData((c) => ({ ...c, appConfig: { ...c.appConfig, copyright: e.target.value } }))}
                />
              </div>
              <div>
                <label className="label">Link Logo Aplikasi</label>
                <input
                  className="input"
                  value={data.appConfig.logoUrl}
                  placeholder="Link Logo"
                  onChange={(e) => saveData((c) => ({ ...c, appConfig: { ...c.appConfig, logoUrl: e.target.value } }))}
                />
              </div>
            </div>
          )}

          {settingTab === "level pengguna" && (
            <div>
              <label className="label">Level Pengguna (pisahkan dengan koma)</label>
              <textarea
                className="input min-h-36"
                value={data.levels.join(", ")}
                onChange={(e) => saveData((c) => ({ ...c, levels: parseCommaText(e.target.value) }))}
              />
            </div>
          )}

          {settingTab === "mata pelajaran" && (
            <div>
              <label className="label">Mata Pelajaran (pisahkan dengan koma)</label>
              <textarea
                className="input min-h-36"
                value={data.subjects.join(", ")}
                onChange={(e) => saveData((c) => ({ ...c, subjects: parseCommaText(e.target.value) }))}
              />
            </div>
          )}

          {settingTab === "rombel kelas" && (
            <div>
              <label className="label">Nama Rombel Kelas (pisahkan dengan koma)</label>
              <textarea
                className="input min-h-36"
                value={data.classes.join(", ")}
                onChange={(e) => saveData((c) => ({ ...c, classes: parseCommaText(e.target.value) }))}
              />
            </div>
          )}

          {settingTab === "jadwal libur" && (
            <>
              <div className="flex flex-wrap justify-between gap-2">
                <input
                  className="input w-full max-w-xs"
                  placeholder="Cari jenis libur"
                  value={holidayFilter}
                  onChange={(e) => setHolidayFilter(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    className="rounded-lg border border-rose-400/50 px-3 py-2 text-xs text-rose-200"
                    type="button"
                    onClick={() =>
                      askConfirm("Hapus Jadwal", "Yakin ingin menghapus semua jadwal libur?", () => {
                        saveData((c) => ({ ...c, holidays: [] }));
                        showInfo("Hapus Data", "Semua jadwal libur berhasil dihapus.");
                      })
                    }
                  >
                    Hapus semua jadwal
                  </button>
                  <button
                    className="rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-900"
                    onClick={() => {
                      setEditingHolidayId(null);
                      setNewHoliday({ id: "", image: "", startDate: "", endDate: "", type: "", note: "", basis: "" });
                      setShowHolidayModal(true);
                    }}
                    type="button"
                  >
                    Tambah Jadwal
                  </button>
                </div>
              </div>
              <Table headers={["Gambar", "Mulai", "Selesai", "Jenis", "Keterangan", "Aksi"]}>
                {data.holidays
                  .filter((item) => item.type.toLowerCase().includes(holidayFilter.toLowerCase()))
                  .map((item) => (
                    <tr key={item.id}>
                      <td className="px-3 py-2">
                        <img src={item.image || data.appConfig.logoUrl} className="h-10 w-10 rounded object-cover" />
                      </td>
                      <td className="px-3 py-2">{item.startDate}</td>
                      <td className="px-3 py-2">{item.endDate}</td>
                      <td className="px-3 py-2">{item.type}</td>
                      <td className="px-3 py-2">{item.note}</td>
                      <td className="px-3 py-2">
                        {actionButtons({
                          onView: () => openDetail("Detail Jadwal Libur", item),
                          onEdit: () => {
                            setEditingHolidayId(item.id);
                            setNewHoliday(item);
                            setShowHolidayModal(true);
                          },
                          onDelete: () =>
                            askConfirm("Hapus Jadwal", "Yakin ingin menghapus jadwal ini?", () => {
                              saveData((c) => ({ ...c, holidays: c.holidays.filter((row) => row.id !== item.id) }));
                              showInfo("Hapus Data", "Jadwal libur berhasil dihapus.");
                            }),
                        })}
                      </td>
                    </tr>
                  ))}
              </Table>
            </>
          )}

          {settingTab === "jadwal input agenda" && (
            <form
              className="grid gap-3 md:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newSchedule.startTime || !newSchedule.endTime) return;
                saveData((c) => ({ ...c, agendaSchedules: [...c.agendaSchedules, { ...newSchedule, id: uid() }] }));
                setNewSchedule({ id: "", activeDays: [], startTime: "", endTime: "", doneNote: "", image: "" });
                showInfo("Tambah Jadwal", "Jadwal input agenda berhasil ditambahkan.");
              }}
            >
              <div>
                <label className="label">Hari Aktif (multi pilihan)</label>
                <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/10 p-3 text-sm text-slate-200">
                  {["Setiap Hari", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"].map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newSchedule.activeDays.includes(item)}
                        onChange={(e) =>
                          setNewSchedule((s) => ({
                            ...s,
                            activeDays: e.target.checked
                              ? [...s.activeDays, item]
                              : s.activeDays.filter((day) => day !== item),
                          }))
                        }
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid gap-3">
                <div>
                  <label className="label">Waktu Mulai</label>
                  <input
                    className="input"
                    type="time"
                    value={newSchedule.startTime}
                    onChange={(e) => setNewSchedule((s) => ({ ...s, startTime: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">Waktu Selesai</label>
                  <input
                    className="input"
                    type="time"
                    value={newSchedule.endTime}
                    onChange={(e) => setNewSchedule((s) => ({ ...s, endTime: e.target.value }))}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="label">Keterangan Jika Selesai</label>
                <textarea
                  className="input"
                  placeholder="Keterangan jika selesai"
                  value={newSchedule.doneNote}
                  onChange={(e) => setNewSchedule((s) => ({ ...s, doneNote: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">Link Gambar</label>
                <input
                  className="input"
                  placeholder="Link Gambar"
                  value={newSchedule.image}
                  onChange={(e) => setNewSchedule((s) => ({ ...s, image: e.target.value }))}
                />
              </div>
              <button className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-900" type="submit">
                Simpan Jadwal
              </button>
              <ul className="md:col-span-2 space-y-2 text-sm text-slate-300">
                {data.agendaSchedules.map((row) => (
                  <li key={row.id} className="flex items-center justify-between rounded-lg border border-white/10 p-2">
                    <span>{row.activeDays.join(", ")} | {row.startTime}-{row.endTime}</span>
                    <button
                      className="rounded border border-rose-300/50 px-2 py-1 text-xs text-rose-200"
                      onClick={() =>
                        saveData((c) => ({ ...c, agendaSchedules: c.agendaSchedules.filter((item) => item.id !== row.id) }))
                      }
                      type="button"
                    >
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            </form>
          )}

          {settingTab === "akses pengguna" && (
            <Table headers={["Menu", "Tampilkan", "Tambah", "Edit", "Hapus"]}>
              {menu.map((item) => (
                <tr key={item.key}>
                  <td className="px-3 py-2">{item.label}</td>
                  {(["view", "add", "edit", "delete"] as (keyof Permission)[]).map((permission) => (
                    <td className="px-3 py-2" key={permission}>
                      <input
                        type="checkbox"
                        checked={data.access[item.key]?.[permission] ?? true}
                        onChange={(e) =>
                          saveData((c) => ({
                            ...c,
                            access: {
                              ...c.access,
                              [item.key]: { ...c.access[item.key], [permission]: e.target.checked },
                            },
                          }))
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </Table>
          )}
        </AppShell>
      );
    }

    if (activeMenu === "pendidik") {
      return (
        <AppShell
          title="Pendidik"
          actions={
            <div className="flex gap-2">
              <button
                onClick={() =>
                  askConfirm("Hapus Pendidik", "Yakin ingin menghapus semua data pendidik?", () => {
                    saveData((c) => ({ ...c, educators: [] }));
                    showInfo("Hapus Data", "Semua data pendidik berhasil dihapus.");
                  })
                }
                className="rounded-lg border border-rose-400/50 px-3 py-2 text-xs text-rose-200"
                type="button"
              >
                Hapus semua pendidik
              </button>
              <button
                className="rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-900"
                onClick={() => {
                  setEditingEducatorId(null);
                  setNewEducator({
                    id: "",
                    fullName: "",
                    nip: "",
                    position: cValue(data.levels),
                    gender: "Laki-Laki",
                    email: "",
                    subject: cValue(data.subjects),
                    className: cValue(data.classes),
                    verificationCode: defaultCode,
                    photo: defaultAvatar,
                    active: true,
                  });
                  setShowEducatorModal(true);
                }}
                type="button"
                disabled={!checkPermission(activeMenu, "add")}
              >
                Pendidik Baru
              </button>
            </div>
          }
        >
          <input
            className="input max-w-sm"
            placeholder="Cari jabatan"
            value={educatorFilter}
            onChange={(e) => setEducatorFilter(e.target.value)}
          />
          <Table headers={["Profil", "Nama", "Jabatan", "Kelas", "Mapel", "Status", "Aksi"]}>
            {data.educators
              .filter((item) => item.position.toLowerCase().includes(educatorFilter.toLowerCase()))
              .map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-2">
                  <img src={item.photo || defaultAvatar} className="h-10 w-10 rounded-full object-cover" />
                </td>
                <td className="px-3 py-2">{item.fullName}</td>
                <td className="px-3 py-2">{item.position}</td>
                <td className="px-3 py-2">{item.className}</td>
                <td className="px-3 py-2">{item.subject}</td>
                <td className="px-3 py-2">{item.active ? "Aktif" : "Non Aktif"}</td>
                <td className="px-3 py-2">
                  {actionButtons({
                    onView: () => openDetail("Detail Pendidik", item),
                    onEdit: () => {
                      setEditingEducatorId(item.id);
                      setNewEducator(item);
                      setShowEducatorModal(true);
                    },
                    onDelete: () =>
                      askConfirm("Hapus Pendidik", "Yakin ingin menghapus data pendidik ini?", () => {
                        saveData((c) => ({ ...c, educators: c.educators.filter((row) => row.id !== item.id) }));
                        showInfo("Hapus Data", "Data pendidik berhasil dihapus.");
                      }),
                  })}
                </td>
              </tr>
            ))}
          </Table>
        </AppShell>
      );
    }

    if (activeMenu === "murid") {
      return (
        <AppShell
          title="Murid"
          actions={
            <div className="flex gap-2">
              <button
                onClick={() =>
                  askConfirm("Hapus Murid", "Yakin ingin menghapus semua data murid?", () => {
                    saveData((c) => ({ ...c, students: [] }));
                    showInfo("Hapus Data", "Semua data murid berhasil dihapus.");
                  })
                }
                className="rounded-lg border border-rose-400/50 px-3 py-2 text-xs text-rose-200"
                type="button"
              >
                Hapus semua murid
              </button>
              <button
                className="rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-900"
                onClick={() => {
                  setEditingStudentId(null);
                  setNewStudent({
                    id: "",
                    fullName: "",
                    nisn: "",
                    position: cValue(data.levels),
                    gender: "Laki-Laki",
                    className: cValue(data.classes),
                    verificationCode: defaultCode,
                    photo: defaultStudentAvatar,
                    active: true,
                  });
                  setShowStudentModal(true);
                }}
                type="button"
                disabled={!checkPermission(activeMenu, "add")}
              >
                Murid Baru
              </button>
            </div>
          }
        >
          <input
            className="input max-w-sm"
            placeholder="Cari kelas"
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
          />
          <Table headers={["Profil", "Nama", "NISN", "Jabatan", "Kelas", "Status", "Aksi"]}>
            {data.students
              .filter((item) => item.className.toLowerCase().includes(studentFilter.toLowerCase()))
              .map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-2">
                  <img src={item.photo || defaultStudentAvatar} className="h-10 w-10 rounded-full object-cover" />
                </td>
                <td className="px-3 py-2">{item.fullName}</td>
                <td className="px-3 py-2">{item.nisn}</td>
                <td className="px-3 py-2">{item.position}</td>
                <td className="px-3 py-2">{item.className}</td>
                <td className="px-3 py-2">{item.active ? "Aktif" : "Non Aktif"}</td>
                <td className="px-3 py-2">
                  {actionButtons({
                    onView: () => openDetail("Detail Murid", item),
                    onEdit: () => {
                      setEditingStudentId(item.id);
                      setNewStudent(item);
                      setShowStudentModal(true);
                    },
                    onDelete: () =>
                      askConfirm("Hapus Murid", "Yakin ingin menghapus data murid ini?", () => {
                        saveData((c) => ({ ...c, students: c.students.filter((row) => row.id !== item.id) }));
                        showInfo("Hapus Data", "Data murid berhasil dihapus.");
                      }),
                  })}
                </td>
              </tr>
            ))}
          </Table>
        </AppShell>
      );
    }

    if (activeMenu === "informasi") {
      return (
        <AppShell
          title="Informasi"
          actions={
            <div className="flex gap-2">
              <button
                onClick={() =>
                  askConfirm("Hapus Informasi", "Yakin ingin menghapus semua informasi?", () => {
                    saveData((c) => ({ ...c, informations: [] }));
                    showInfo("Hapus Data", "Semua informasi berhasil dihapus.");
                  })
                }
                className="rounded-lg border border-rose-400/50 px-3 py-2 text-xs text-rose-200"
                type="button"
              >
                Hapus semua informasi
              </button>
              <button
                className="rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-900"
                onClick={() => {
                  setEditingInformationId(null);
                  setNewInformation({ id: "", title: "", content: "", sender: "", sendDate: "", status: "terkirim" });
                  setShowInformationModal(true);
                }}
                type="button"
              >
                Informasi Baru
              </button>
            </div>
          }
        >
          <input
            className="input max-w-sm"
            placeholder="Cari judul"
            value={informationFilter}
            onChange={(e) => setInformationFilter(e.target.value)}
          />
          <Table headers={["Judul", "Pengirim", "Status", "Tanggal", "Aksi"]}>
            {data.informations
              .filter((item) => item.title.toLowerCase().includes(informationFilter.toLowerCase()))
              .map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-2">{item.title}</td>
                <td className="px-3 py-2">{item.sender}</td>
                <td className="px-3 py-2">{item.status}</td>
                <td className="px-3 py-2">{item.sendDate}</td>
                <td className="px-3 py-2">
                  {actionButtons({
                    onView: () => openDetail("Detail Informasi", item),
                    onEdit: () => {
                      setEditingInformationId(item.id);
                      setNewInformation(item);
                      setShowInformationModal(true);
                    },
                    onDelete: () =>
                      askConfirm("Hapus Informasi", "Yakin ingin menghapus informasi ini?", () => {
                        saveData((c) => ({ ...c, informations: c.informations.filter((row) => row.id !== item.id) }));
                        showInfo("Hapus Data", "Informasi berhasil dihapus.");
                      }),
                  })}
                </td>
              </tr>
            ))}
          </Table>
        </AppShell>
      );
    }

    if (activeMenu === "agenda") {
      return (
        <AppShell
          title="Isi Agenda"
          actions={
            <div className="flex gap-2">
              <button
                onClick={() =>
                  askConfirm("Hapus Agenda", "Yakin ingin menghapus semua agenda?", () => {
                    saveData((c) => ({ ...c, agendas: [] }));
                    showInfo("Hapus Data", "Semua agenda berhasil dihapus.");
                  })
                }
                className="rounded-lg border border-rose-400/50 px-3 py-2 text-xs text-rose-200"
                type="button"
              >
                Hapus semua agenda
              </button>
              <button
                className="rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-900"
                onClick={() => {
                  setEditingAgendaId(null);
                  setNewAgenda({
                    id: "",
                    day: "",
                    date: "",
                    className: "",
                    subject: "",
                    educatorName: "",
                    subMaterial: "",
                    absentStudents: [],
                    sickStudents: [],
                    permitStudents: [],
                    academicYear: "",
                    semester: "ganjil",
                    shortNote: "",
                  });
                  setShowAgendaModal(true);
                }}
                type="button"
              >
                Agenda Hari Ini
              </button>
            </div>
          }
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              className="input"
              placeholder="Cari hari"
              value={agendaDayFilter}
              onChange={(e) => setAgendaDayFilter(e.target.value)}
            />
            <input
              className="input"
              type="date"
              value={agendaDateFilter}
              onChange={(e) => setAgendaDateFilter(e.target.value)}
            />
          </div>
          <Table headers={["Hari", "Tanggal", "Kelas", "Mapel", "Pendidik", "Sub Materi", "Hadir", "Aksi"]}>
            {data.agendas
              .filter((item) => item.day.toLowerCase().includes(agendaDayFilter.toLowerCase()))
              .filter((item) => (agendaDateFilter ? item.date === agendaDateFilter : true))
              .map((item) => {
              const presentCount =
                data.students.filter((s) => s.className === item.className).length -
                item.absentStudents.length -
                item.sickStudents.length -
                item.permitStudents.length;
              return (
                <tr key={item.id}>
                  <td className="px-3 py-2">{item.day}</td>
                  <td className="px-3 py-2">{item.date}</td>
                  <td className="px-3 py-2">{item.className}</td>
                  <td className="px-3 py-2">{item.subject}</td>
                  <td className="px-3 py-2">{item.educatorName}</td>
                  <td className="px-3 py-2">{item.subMaterial}</td>
                  <td className="px-3 py-2">{Math.max(0, presentCount)}</td>
                  <td className="px-3 py-2">
                    {actionButtons({
                      onView: () => openDetail("Detail Agenda", item),
                      onEdit: () => {
                        setEditingAgendaId(item.id);
                        setNewAgenda(item);
                        setShowAgendaModal(true);
                      },
                      onDelete: () =>
                        askConfirm("Hapus Agenda", "Yakin ingin menghapus agenda ini?", () => {
                          saveData((c) => ({ ...c, agendas: c.agendas.filter((row) => row.id !== item.id) }));
                          showInfo("Hapus Data", "Agenda berhasil dihapus.");
                        }),
                    })}
                  </td>
                </tr>
              );
            })}
          </Table>
        </AppShell>
      );
    }

    if (["rekap-harian", "rekap-bulanan", "rekap-tahunan"].includes(activeMenu)) {
      const key =
        activeMenu === "rekap-harian"
          ? "dailyRecaps"
          : activeMenu === "rekap-bulanan"
            ? "monthlyRecaps"
            : "yearlyRecaps";
      const mode =
        key === "dailyRecaps"
          ? "daily"
          : key === "monthlyRecaps"
            ? "monthly"
            : "yearly";
      const title =
        activeMenu === "rekap-harian"
          ? "Rekap Harian"
          : activeMenu === "rekap-bulanan"
            ? "Rekap Bulanan"
            : "Rekap Tahunan";
      const rangeInputType = mode === "daily" ? "date" : mode === "monthly" ? "month" : "number";

      return (
        <AppShell title={title}>
          <form
            className="grid gap-3 md:grid-cols-3"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              if (editingRecap && editingRecap.key === key) {
                saveData((c) => ({
                  ...c,
                  [key]: (c[key as keyof AppData] as Recap[]).map((row) =>
                    row.id === editingRecap.id ? { ...row, ...recapForm } : row,
                  ),
                } as AppData));
                showInfo("Edit Laporan", "Laporan rekap berhasil diperbarui.");
                setEditingRecap(null);
                return;
              }
              const newRecap: Recap = { id: uid(), ...recapForm };
              saveData((c) => ({ ...c, [key]: [...(c[key as keyof AppData] as Recap[]), newRecap] } as AppData));
              showInfo("Tambah Laporan", "Laporan rekap berhasil dibuat.");
            }}
          >
            <div>
              <label className="label">Semester</label>
              <select
                className="input"
                value={recapForm.semester}
                onChange={(e) => setRecapForm((f) => ({ ...f, semester: e.target.value }))}
              >
                <option value="ganjil">ganjil</option>
                <option value="genap">genap</option>
              </select>
            </div>
            <div>
              <label className="label">Tahun Ajaran</label>
              <input
                className="input"
                value={recapForm.year}
                onChange={(e) => setRecapForm((f) => ({ ...f, year: e.target.value }))}
                placeholder="Tahun Ajaran"
              />
            </div>
            <div>
              <label className="label">Mata Pelajaran</label>
              <select
                className="input"
                value={recapForm.subject}
                onChange={(e) => setRecapForm((f) => ({ ...f, subject: e.target.value }))}
              >
                <option>Semua</option>
                {data.subjects.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Kelas</label>
              <select
                className="input"
                value={recapForm.className}
                onChange={(e) => setRecapForm((f) => ({ ...f, className: e.target.value }))}
              >
                <option>Semua</option>
                {data.classes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Rentang Awal</label>
              <input
                type={rangeInputType}
                className="input"
                value={recapForm.rangeStart}
                onChange={(e) => setRecapForm((f) => ({ ...f, rangeStart: e.target.value }))}
                min={mode === "yearly" ? "2000" : undefined}
                max={mode === "yearly" ? "2100" : undefined}
              />
            </div>
            <div>
              <label className="label">Rentang Akhir</label>
              <input
                type={rangeInputType}
                className="input"
                value={recapForm.rangeEnd}
                onChange={(e) => setRecapForm((f) => ({ ...f, rangeEnd: e.target.value }))}
                min={mode === "yearly" ? "2000" : undefined}
                max={mode === "yearly" ? "2100" : undefined}
              />
            </div>
            <button className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-900" type="submit">
              {editingRecap && editingRecap.key === key ? "Simpan Edit Laporan" : "Buat Laporan"}
            </button>
          </form>

          <Table headers={["Semester", "Mapel", "Kelas", "Rentang", "Aksi"]}>
            {(data[key as keyof AppData] as Recap[]).map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-2">{item.semester}</td>
                <td className="px-3 py-2">{item.subject}</td>
                <td className="px-3 py-2">{item.className}</td>
                <td className="px-3 py-2">{item.rangeStart} - {item.rangeEnd}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    {[
                      "Lihat",
                      "Edit",
                      "Print",
                      "PDF",
                      "Hapus",
                    ].map((action) => (
                      <button
                        key={action}
                        onClick={() => {
                          if (action === "Lihat") {
                            setReportModal({ title, recap: item, records: getRecapRecords(item, mode) });
                            return;
                          }
                          if (action === "Edit") {
                            setRecapForm({
                              semester: item.semester,
                              year: item.year,
                              subject: item.subject,
                              className: item.className,
                              rangeStart: item.rangeStart,
                              rangeEnd: item.rangeEnd,
                            });
                            setEditingRecap({ key, id: item.id });
                            return;
                          }
                          if (action === "Print") {
                            printRecapReport(title, item, getRecapRecords(item, mode));
                            return;
                          }
                          if (action === "PDF") {
                            printRecapReport(title, item, getRecapRecords(item, mode));
                            return;
                          }
                          if (action === "Hapus") {
                            askConfirm("Hapus Laporan", "Yakin ingin menghapus laporan ini?", () => {
                              saveData((c) => ({
                                ...c,
                                [key]: (c[key as keyof AppData] as Recap[]).filter((row) => row.id !== item.id),
                              } as AppData));
                              showInfo("Hapus Data", "Laporan berhasil dihapus.");
                            });
                          }
                        }}
                        className="rounded-lg border border-white/20 px-2 py-1 text-xs"
                        type="button"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </AppShell>
      );
    }

    return (
      <AppShell title="Maintenance">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="label">Judul Maintenance</label>
            <input
              className="input"
              value={data.maintenance.title}
              placeholder="Judul Maintenance"
              onChange={(e) => saveData((c) => ({ ...c, maintenance: { ...c.maintenance, title: e.target.value } }))}
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={String(data.maintenance.active)}
              onChange={(e) =>
                saveData((c) => ({ ...c, maintenance: { ...c.maintenance, active: e.target.value === "true" } }))
              }
            >
              <option value="true">Aktif</option>
              <option value="false">Non Aktif</option>
            </select>
          </div>
          <div>
            <label className="label">Tanggal Mulai</label>
            <input
              type="date"
              className="input"
              value={data.maintenance.startDate}
              onChange={(e) => saveData((c) => ({ ...c, maintenance: { ...c.maintenance, startDate: e.target.value } }))}
            />
          </div>
          <div>
            <label className="label">Tanggal Selesai</label>
            <input
              type="date"
              className="input"
              value={data.maintenance.endDate}
              onChange={(e) => saveData((c) => ({ ...c, maintenance: { ...c.maintenance, endDate: e.target.value } }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Pesan Maintenance</label>
            <textarea
              className="input"
              value={data.maintenance.message}
              placeholder="Pesan Maintenance"
              onChange={(e) => saveData((c) => ({ ...c, maintenance: { ...c.maintenance, message: e.target.value } }))}
            />
          </div>
        </div>
      </AppShell>
    );
  };

  const Modal = ({ show, title, children, onClose }: { show: boolean; title: string; children: ReactNode; onClose: () => void }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4">
        <div className="w-full max-w-2xl rounded-xl border border-white/15 bg-slate-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <button onClick={onClose} className="rounded-lg p-1 text-slate-300" type="button">
              <X size={18} />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  if (cloudLoading) {
    return (
      <div className="app-bg flex min-h-screen items-center justify-center p-6 text-slate-100">
        <div className="text-center">
          <p className="text-lg font-semibold">Menghubungkan ke Google Spreadsheet...</p>
          <p className="mt-2 text-sm text-slate-300">Mohon tunggu, sinkronisasi data sedang diproses.</p>
        </div>
      </div>
    );
  }

  if (cloudError && (!appsScriptUrl || !appsScriptToken)) {
    return (
      <div className="app-bg flex min-h-screen items-center justify-center p-6 text-slate-100">
        <div className="w-full max-w-xl rounded-xl border border-rose-400/40 bg-slate-950/70 p-5 text-center">
          <p className="text-lg font-semibold text-rose-200">Koneksi Apps Script Wajib</p>
          <p className="mt-2 text-sm text-slate-200">{cloudError}</p>
          <p className="mt-3 text-xs text-slate-400">Set VITE_APPS_SCRIPT_URL dan VITE_APPS_SCRIPT_TOKEN di environment frontend.</p>
        </div>
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div className="app-bg relative h-screen overflow-hidden p-4">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #22d3ee40, transparent 30%), radial-gradient(circle at 80% 80%, #a855f740, transparent 35%)" }}
        />
        <div className="relative mx-auto flex h-full max-w-5xl items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg rounded-2xl border border-white/20 bg-slate-900/70 p-6 backdrop-blur"
          >
            <div className="mb-4 flex flex-col items-center text-center">
              <img src={data.appConfig.logoUrl} className="mb-3 h-20 w-20 rounded-full bg-white object-cover" />
              <h1 className="text-2xl font-bold text-white">{data.appConfig.appName}</h1>
              <p className="mt-1 text-sm text-slate-300">Multi Verifikasi Kode</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="label">Kode Verifikasi</label>
                <input
                  className="input"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="Masukkan kode verifikasi"
                />
              </div>
              <button className="w-full rounded-lg bg-cyan-400 px-3 py-2 font-semibold text-slate-900" onClick={handleVerification} type="button">
                Verifikasi Kode
              </button>
            </div>

            {verifiedUser && (
              <div className="mt-4 rounded-xl border border-emerald-300/40 bg-emerald-900/20 p-3">
                <div className="flex gap-3">
                  <img
                    src={"photo" in verifiedUser ? verifiedUser.photo : defaultAvatar}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="text-sm text-slate-100">
                    <p><strong>Nama Lengkap:</strong> {verifiedUser.fullName}</p>
                    <p><strong>Jabatan:</strong> {verifiedUser.position}</p>
                    <p><strong>Mapel:</strong> {"subject" in verifiedUser ? verifiedUser.subject : "-"}</p>
                    <p><strong>Kelas:</strong> {"className" in verifiedUser ? verifiedUser.className : "-"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSessionReady(true)}
                  className="mt-3 w-full rounded-lg bg-emerald-400 px-3 py-2 font-semibold text-slate-900"
                  type="button"
                >
                  Lanjutkan
                </button>
              </div>
            )}
          </motion.div>
        </div>

        <Modal show={verifyError} title="Validasi Kode" onClose={() => setVerifyError(false)}>
          <p className="text-sm text-slate-200">
            Maaf...! Kode verifikasi yang anda masukkan tidak sesuai, hubungi admin jika belum mendapatkan kode verifikasi.
          </p>
        </Modal>
      </div>
    );
  }

  return (
    <div className="app-bg min-h-screen text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-3 py-3">
          <div className="flex items-center gap-3">
            <button onClick={handleMenuToggle} className="rounded-lg border border-white/20 p-2" type="button">
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <img src={data.appConfig.logoUrl} className="h-8 w-8 rounded bg-white" />
              <span className="font-semibold">{data.appConfig.appName}</span>
            </div>
          </div>
          <button onClick={() => setLogoutModal(true)} className="rounded-lg border border-rose-300/40 p-2 text-rose-200" type="button">
            <LogOut size={18} />
          </button>
        </div>
        <div className="mx-auto max-w-[1400px] px-3 pb-2">
          <p className={`text-xs ${cloudError ? "text-amber-300" : "text-emerald-300"}`}>
            {cloudError ? `Cloud: ${cloudError}` : "Cloud: terhubung realtime ke Google Spreadsheet"}
          </p>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px]">
        <motion.aside
          animate={{ width: collapsed ? 72 : 260 }}
          className="sticky top-[57px] hidden h-[calc(100vh-57px)] overflow-y-auto border-r border-white/10 bg-slate-950/60 p-2 md:block"
        >
          <nav className="space-y-1">
            {menu
              .filter((item) => data.access[item.key]?.view ?? true)
              .map((item) => {
                const Icon = item.icon;
                const active = item.key === activeMenu;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveMenu(item.key)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
                      active ? "bg-cyan-400/20 text-cyan-100" : "text-slate-300 hover:bg-white/5"
                    }`}
                    type="button"
                  >
                    <Icon size={18} />
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
          </nav>
        </motion.aside>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="fixed inset-0 z-40 bg-slate-950/70 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                className="h-full w-[280px] overflow-y-auto border-r border-white/10 bg-slate-950 p-3"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-200">Menu</span>
                  <button
                    className="rounded-lg border border-white/20 p-1 text-slate-200"
                    onClick={() => setMobileMenuOpen(false)}
                    type="button"
                  >
                    <X size={16} />
                  </button>
                </div>
                <nav className="space-y-1">
                  {menu
                    .filter((item) => data.access[item.key]?.view ?? true)
                    .map((item) => {
                      const Icon = item.icon;
                      const active = item.key === activeMenu;
                      return (
                        <button
                          key={item.key}
                          onClick={() => {
                            setActiveMenu(item.key);
                            setMobileMenuOpen(false);
                          }}
                          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
                            active ? "bg-cyan-400/20 text-cyan-100" : "text-slate-300 hover:bg-white/5"
                          }`}
                          type="button"
                        >
                          <Icon size={18} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                </nav>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="w-full p-3 pb-16 md:p-5 md:pb-20">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={activeMenu} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 md:p-5">
            {renderContent()}
          </motion.div>
        </main>
      </div>

      <footer className="sticky bottom-0 border-t border-white/10 bg-slate-950/70 px-4 py-2 text-center text-xs text-slate-300">
        {data.appConfig.copyright} | {data.appConfig.version}
      </footer>

      <Modal
        show={showHolidayModal}
        title={editingHolidayId ? "Edit Jadwal Libur" : "Tambah Jadwal Libur"}
        onClose={() => {
          setShowHolidayModal(false);
          setEditingHolidayId(null);
        }}
      >
        <form
          className="grid max-h-[70vh] gap-3 overflow-auto pr-1"
          onSubmit={(e) => {
            e.preventDefault();
            if (editingHolidayId) {
              saveData((c) => ({
                ...c,
                holidays: c.holidays.map((item) => (item.id === editingHolidayId ? { ...newHoliday, id: editingHolidayId } : item)),
              }));
              showInfo("Edit Data", "Jadwal libur berhasil diperbarui.");
            } else {
              saveData((c) => ({ ...c, holidays: [...c.holidays, { ...newHoliday, id: uid() }] }));
              showInfo("Tambah Data", "Jadwal libur berhasil ditambahkan.");
            }
            setNewHoliday({ id: "", image: "", startDate: "", endDate: "", type: "", note: "", basis: "" });
            setShowHolidayModal(false);
            setEditingHolidayId(null);
          }}
        >
          <div>
            <label className="label">Jenis Libur</label>
            <input className="input" placeholder="Jenis Libur" value={newHoliday.type} onChange={(e) => setNewHoliday((s) => ({ ...s, type: e.target.value }))} />
          </div>
          <div>
            <label className="label">Keterangan Libur</label>
            <textarea className="input" placeholder="Keterangan Libur" value={newHoliday.note} onChange={(e) => setNewHoliday((s) => ({ ...s, note: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Tanggal Mulai</label>
              <input type="date" className="input" value={newHoliday.startDate} onChange={(e) => setNewHoliday((s) => ({ ...s, startDate: e.target.value }))} />
            </div>
            <div>
              <label className="label">Tanggal Selesai</label>
              <input type="date" className="input" value={newHoliday.endDate} onChange={(e) => setNewHoliday((s) => ({ ...s, endDate: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Dasar Libur (Opsional)</label>
            <textarea className="input" placeholder="Dasar Libur (opsional)" value={newHoliday.basis} onChange={(e) => setNewHoliday((s) => ({ ...s, basis: e.target.value }))} />
          </div>
          <div>
            <label className="label">Link Gambar</label>
            <input className="input" placeholder="Link Gambar" value={newHoliday.image} onChange={(e) => setNewHoliday((s) => ({ ...s, image: e.target.value }))} />
          </div>
          <button className="rounded-lg bg-cyan-500 px-3 py-2 font-semibold text-slate-900" type="submit">
            {editingHolidayId ? "Simpan Perubahan" : "Simpan Jadwal"}
          </button>
        </form>
      </Modal>

      <Modal
        show={showEducatorModal}
        title={editingEducatorId ? "Edit Pendidik" : "Pendidik Baru"}
        onClose={() => {
          setShowEducatorModal(false);
          setEditingEducatorId(null);
        }}
      >
        <form
          className="grid max-h-[70vh] gap-3 overflow-auto pr-1 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (editingEducatorId) {
              saveData((c) => ({
                ...c,
                educators: c.educators.map((item) =>
                  item.id === editingEducatorId ? { ...newEducator, id: editingEducatorId } : item,
                ),
              }));
              showInfo("Edit Data", "Data pendidik berhasil diperbarui.");
            } else {
              saveData((c) => ({ ...c, educators: [...c.educators, { ...newEducator, id: uid() }] }));
              showInfo("Tambah Data", "Data pendidik berhasil ditambahkan.");
            }
            setNewEducator({
              id: "",
              fullName: "",
              nip: "",
              position: cValue(data.levels),
              gender: "Laki-Laki",
              email: "",
              subject: cValue(data.subjects),
              className: cValue(data.classes),
              verificationCode: defaultCode,
              photo: defaultAvatar,
              active: true,
            });
            setShowEducatorModal(false);
            setEditingEducatorId(null);
          }}
        >
          <div>
            <label className="label">Nama Lengkap</label>
            <input className="input" placeholder="Nama Lengkap" value={newEducator.fullName} onChange={(e) => setNewEducator((s) => ({ ...s, fullName: e.target.value }))} />
          </div>
          <div>
            <label className="label">NIP</label>
            <input className="input" placeholder="NIP" value={newEducator.nip} onChange={(e) => setNewEducator((s) => ({ ...s, nip: e.target.value }))} />
          </div>
          <div>
            <label className="label">Jabatan</label>
            <select className="input" value={newEducator.position} onChange={(e) => setNewEducator((s) => ({ ...s, position: e.target.value }))}>
              {data.levels.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Jenis Kelamin</label>
            <select className="input" value={newEducator.gender} onChange={(e) => setNewEducator((s) => ({ ...s, gender: e.target.value }))}>
              <option>Laki-Laki</option><option>Perempuan</option>
            </select>
          </div>
          <div>
            <label className="label">Email Aktif</label>
            <input className="input" placeholder="Email Aktif" value={newEducator.email} onChange={(e) => setNewEducator((s) => ({ ...s, email: e.target.value }))} />
          </div>
          <div>
            <label className="label">Mata Pelajaran</label>
            <select className="input" value={newEducator.subject} onChange={(e) => setNewEducator((s) => ({ ...s, subject: e.target.value }))}>
              {data.subjects.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Kelas Mengajar</label>
            <select className="input" value={newEducator.className} onChange={(e) => setNewEducator((s) => ({ ...s, className: e.target.value }))}>
              {data.classes.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Kode Verifikasi</label>
            <input className="input" placeholder="Kode Verifikasi" value={newEducator.verificationCode} onChange={(e) => setNewEducator((s) => ({ ...s, verificationCode: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Link Foto Profil</label>
            <input className="input" placeholder="Link Foto Profil" value={newEducator.photo} onChange={(e) => setNewEducator((s) => ({ ...s, photo: e.target.value }))} />
          </div>
          <button className="rounded-lg bg-cyan-500 px-3 py-2 font-semibold text-slate-900" type="submit">
            {editingEducatorId ? "Simpan Perubahan" : "Tambah Data"}
          </button>
        </form>
      </Modal>

      <Modal
        show={showStudentModal}
        title={editingStudentId ? "Edit Murid" : "Murid Baru"}
        onClose={() => {
          setShowStudentModal(false);
          setEditingStudentId(null);
        }}
      >
        <form
          className="grid max-h-[70vh] gap-3 overflow-auto pr-1 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (editingStudentId) {
              saveData((c) => ({
                ...c,
                students: c.students.map((item) => (item.id === editingStudentId ? { ...newStudent, id: editingStudentId } : item)),
              }));
              showInfo("Edit Data", "Data murid berhasil diperbarui.");
            } else {
              saveData((c) => ({ ...c, students: [...c.students, { ...newStudent, id: uid() }] }));
              showInfo("Tambah Data", "Data murid berhasil ditambahkan.");
            }
            setNewStudent({
              id: "",
              fullName: "",
              nisn: "",
              position: cValue(data.levels),
              gender: "Laki-Laki",
              className: cValue(data.classes),
              verificationCode: defaultCode,
              photo: defaultStudentAvatar,
              active: true,
            });
            setShowStudentModal(false);
            setEditingStudentId(null);
          }}
        >
          <div>
            <label className="label">Nama Lengkap</label>
            <input className="input" placeholder="Nama Lengkap" value={newStudent.fullName} onChange={(e) => setNewStudent((s) => ({ ...s, fullName: e.target.value }))} />
          </div>
          <div>
            <label className="label">NISN</label>
            <input className="input" placeholder="NISN" value={newStudent.nisn} onChange={(e) => setNewStudent((s) => ({ ...s, nisn: e.target.value }))} />
          </div>
          <div>
            <label className="label">Jabatan</label>
            <select className="input" value={newStudent.position} onChange={(e) => setNewStudent((s) => ({ ...s, position: e.target.value }))}>
              {data.levels.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Jenis Kelamin</label>
            <select className="input" value={newStudent.gender} onChange={(e) => setNewStudent((s) => ({ ...s, gender: e.target.value }))}>
              <option>Laki-Laki</option><option>Perempuan</option>
            </select>
          </div>
          <div>
            <label className="label">Kelas Mengajar</label>
            <select className="input" value={newStudent.className} onChange={(e) => setNewStudent((s) => ({ ...s, className: e.target.value }))}>
              {data.classes.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Kode Verifikasi</label>
            <input className="input" placeholder="Kode Verifikasi" value={newStudent.verificationCode} onChange={(e) => setNewStudent((s) => ({ ...s, verificationCode: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Link Foto Profil</label>
            <input className="input" placeholder="Link Foto Profil" value={newStudent.photo} onChange={(e) => setNewStudent((s) => ({ ...s, photo: e.target.value }))} />
          </div>
          <button className="rounded-lg bg-cyan-500 px-3 py-2 font-semibold text-slate-900" type="submit">
            {editingStudentId ? "Simpan Perubahan" : "Tambah Data"}
          </button>
        </form>
      </Modal>

      <Modal
        show={showInformationModal}
        title={editingInformationId ? "Edit Informasi" : "Informasi Baru"}
        onClose={() => {
          setShowInformationModal(false);
          setEditingInformationId(null);
        }}
      >
        <form
          className="grid max-h-[70vh] gap-3 overflow-auto pr-1"
          onSubmit={(e) => {
            e.preventDefault();
            if (editingInformationId) {
              saveData((c) => ({
                ...c,
                informations: c.informations.map((item) =>
                  item.id === editingInformationId ? { ...newInformation, id: editingInformationId } : item,
                ),
              }));
              showInfo("Edit Data", "Informasi berhasil diperbarui.");
            } else {
              saveData((c) => ({ ...c, informations: [...c.informations, { ...newInformation, id: uid() }] }));
              showInfo("Tambah Data", "Informasi berhasil ditambahkan.");
            }
            setNewInformation({ id: "", title: "", content: "", sender: "", sendDate: "", status: "terkirim" });
            setShowInformationModal(false);
            setEditingInformationId(null);
          }}
        >
          <div>
            <label className="label">Judul Informasi</label>
            <input className="input" placeholder="Judul Informasi" value={newInformation.title} onChange={(e) => setNewInformation((s) => ({ ...s, title: e.target.value }))} />
          </div>
          <div>
            <label className="label">Isi Informasi</label>
            <textarea className="input" placeholder="Isi Informasi" value={newInformation.content} onChange={(e) => setNewInformation((s) => ({ ...s, content: e.target.value }))} />
          </div>
          <div>
            <label className="label">Pengirim</label>
            <input className="input" placeholder="Pengirim" value={newInformation.sender} onChange={(e) => setNewInformation((s) => ({ ...s, sender: e.target.value }))} />
          </div>
          <div>
            <label className="label">Tanggal Dikirim</label>
            <input className="input" type="date" value={newInformation.sendDate} onChange={(e) => setNewInformation((s) => ({ ...s, sendDate: e.target.value }))} />
          </div>
          <button className="rounded-lg bg-cyan-500 px-3 py-2 font-semibold text-slate-900" type="submit">
            {editingInformationId ? "Simpan Perubahan" : "Tambah Informasi"}
          </button>
        </form>
      </Modal>

      <Modal
        show={showAgendaModal}
        title={editingAgendaId ? "Edit Agenda" : "Agenda Hari Ini"}
        onClose={() => {
          setShowAgendaModal(false);
          setEditingAgendaId(null);
        }}
      >
        <form
          className="grid max-h-[70vh] gap-3 overflow-auto pr-1 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (editingAgendaId) {
              saveData((c) => ({
                ...c,
                agendas: c.agendas.map((item) => (item.id === editingAgendaId ? { ...newAgenda, id: editingAgendaId } : item)),
              }));
              showInfo("Edit Data", "Agenda berhasil diperbarui.");
            } else {
              saveData((c) => ({ ...c, agendas: [...c.agendas, { ...newAgenda, id: uid() }] }));
              showInfo("Tambah Data", "Agenda berhasil ditambahkan.");
            }
            setNewAgenda({
              id: "",
              day: "",
              date: "",
              className: "",
              subject: "",
              educatorName: "",
              subMaterial: "",
              absentStudents: [],
              sickStudents: [],
              permitStudents: [],
              academicYear: "",
              semester: "ganjil",
              shortNote: "",
            });
            setShowAgendaModal(false);
            setEditingAgendaId(null);
          }}
        >
          <div>
            <label className="label">Hari</label>
            <select className="input" value={newAgenda.day} onChange={(e) => setNewAgenda((s) => ({ ...s, day: e.target.value }))}>
              <option value="">Pilih Hari</option>
              {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Tanggal</label>
            <input className="input" type="date" value={newAgenda.date} onChange={(e) => setNewAgenda((s) => ({ ...s, date: e.target.value }))} />
          </div>
          <div>
            <label className="label">Kelas</label>
            <select
              className="input"
              value={newAgenda.className}
              onChange={(e) =>
                setNewAgenda((s) => ({
                  ...s,
                  className: e.target.value,
                  educatorName: "",
                  absentStudents: [],
                  sickStudents: [],
                  permitStudents: [],
                }))
              }
            >
              <option value="">Pilih Kelas</option>
              {data.classes.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Mata Pelajaran</label>
            <select
              className="input"
              value={newAgenda.subject}
              onChange={(e) => setNewAgenda((s) => ({ ...s, subject: e.target.value, educatorName: "" }))}
            >
              <option value="">Pilih Mapel</option>
              {data.subjects.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Nama Pendidik</label>
            <select className="input" value={newAgenda.educatorName} onChange={(e) => setNewAgenda((s) => ({ ...s, educatorName: e.target.value }))}>
              <option value="">Pilih Pendidik</option>
              {educatorsByClassSubject.map((item) => <option key={item.id}>{item.fullName}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Sub Materi</label>
            <textarea className="input" placeholder="Sub Materi" value={newAgenda.subMaterial} onChange={(e) => setNewAgenda((s) => ({ ...s, subMaterial: e.target.value }))} />
          </div>
          <div>
            <label className="label">Murid Alpa (checkbox multi pilihan)</label>
            <div className="max-h-32 space-y-1 overflow-auto rounded-lg border border-white/10 p-2 text-sm">
              {studentByClass.map((item) => (
                <label key={item.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newAgenda.absentStudents.includes(item.fullName)}
                    onChange={(e) =>
                      setNewAgenda((s) => ({
                        ...s,
                        absentStudents: e.target.checked
                          ? [...s.absentStudents, item.fullName]
                          : s.absentStudents.filter((name) => name !== item.fullName),
                        sickStudents: s.sickStudents.filter((name) => name !== item.fullName),
                        permitStudents: s.permitStudents.filter((name) => name !== item.fullName),
                      }))
                    }
                  />
                  <span>{item.fullName}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Murid Sakit (checkbox multi pilihan)</label>
            <div className="max-h-32 space-y-1 overflow-auto rounded-lg border border-white/10 p-2 text-sm">
              {studentByClass.map((item) => (
                <label key={item.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newAgenda.sickStudents.includes(item.fullName)}
                    onChange={(e) =>
                      setNewAgenda((s) => ({
                        ...s,
                        sickStudents: e.target.checked
                          ? [...s.sickStudents, item.fullName]
                          : s.sickStudents.filter((name) => name !== item.fullName),
                        absentStudents: s.absentStudents.filter((name) => name !== item.fullName),
                        permitStudents: s.permitStudents.filter((name) => name !== item.fullName),
                      }))
                    }
                  />
                  <span>{item.fullName}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="label">Murid Izin (checkbox multi pilihan)</label>
            <div className="max-h-32 space-y-1 overflow-auto rounded-lg border border-white/10 p-2 text-sm">
              {studentByClass.map((item) => (
                <label key={item.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newAgenda.permitStudents.includes(item.fullName)}
                    onChange={(e) =>
                      setNewAgenda((s) => ({
                        ...s,
                        permitStudents: e.target.checked
                          ? [...s.permitStudents, item.fullName]
                          : s.permitStudents.filter((name) => name !== item.fullName),
                        absentStudents: s.absentStudents.filter((name) => name !== item.fullName),
                        sickStudents: s.sickStudents.filter((name) => name !== item.fullName),
                      }))
                    }
                  />
                  <span>{item.fullName}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Tahun Ajaran</label>
            <input className="input" placeholder="Tahun Ajaran" value={newAgenda.academicYear} onChange={(e) => setNewAgenda((s) => ({ ...s, academicYear: e.target.value }))} />
          </div>
          <div>
            <label className="label">Semester</label>
            <select className="input" value={newAgenda.semester} onChange={(e) => setNewAgenda((s) => ({ ...s, semester: e.target.value as "ganjil" | "genap" }))}>
              <option value="ganjil">ganjil</option>
              <option value="genap">genap</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">Catatan Singkat/Kesan</label>
            <textarea className="input" placeholder="Catatan Singkat/Kesan" value={newAgenda.shortNote} onChange={(e) => setNewAgenda((s) => ({ ...s, shortNote: e.target.value }))} />
          </div>
          <button className="rounded-lg bg-cyan-500 px-3 py-2 font-semibold text-slate-900" type="submit">
            {editingAgendaId ? "Simpan Perubahan" : "Tambah Agenda"}
          </button>
        </form>
      </Modal>

      <Modal
        show={Boolean(reportModal)}
        title={reportModal?.title ?? "Laporan"}
        onClose={() => setReportModal(null)}
      >
        {reportModal && (
          <div className="max-h-[70vh] space-y-3 overflow-auto rounded-lg border border-white/10 bg-slate-950/50 p-3 text-sm">
            <div className="border-b border-white/10 pb-3 text-center">
              <h4 className="text-base font-semibold text-white">{data.appConfig.appName}</h4>
              <p className="text-sm text-slate-300">{reportModal.title}</p>
            </div>
            <div className="grid gap-2 text-xs text-slate-200 sm:grid-cols-2">
              <p>Semester: {reportModal.recap.semester}</p>
              <p>Tahun Ajaran: {reportModal.recap.year}</p>
              <p>Mata Pelajaran: {reportModal.recap.subject}</p>
              <p>Kelas: {reportModal.recap.className}</p>
              <p className="sm:col-span-2">Periode: {reportModal.recap.rangeStart} s/d {reportModal.recap.rangeEnd}</p>
            </div>
            <Table headers={["No", "Tanggal", "Hari", "Kelas", "Mapel", "Pendidik", "Sub Materi", "Hadir", "Alpa", "Izin", "Sakit"]}>
              {reportModal.records.map((row, idx) => (
                <tr key={row.id}>
                  <td className="px-3 py-2">{idx + 1}</td>
                  <td className="px-3 py-2">{row.date}</td>
                  <td className="px-3 py-2">{row.day}</td>
                  <td className="px-3 py-2">{row.className}</td>
                  <td className="px-3 py-2">{row.subject}</td>
                  <td className="px-3 py-2">{row.educatorName}</td>
                  <td className="px-3 py-2">{row.subMaterial}</td>
                  <td className="px-3 py-2">{countPresent(row)}</td>
                  <td className="px-3 py-2">{row.absentStudents.length}</td>
                  <td className="px-3 py-2">{row.permitStudents.length}</td>
                  <td className="px-3 py-2">{row.sickStudents.length}</td>
                </tr>
              ))}
            </Table>
            {reportModal.records.length === 0 && <p className="text-center text-xs text-slate-400">Tidak ada data agenda pada periode ini.</p>}
          </div>
        )}
      </Modal>

      <Modal
        show={Boolean(detailModal)}
        title={detailModal?.title ?? "Detail"}
        onClose={() => setDetailModal(null)}
      >
        <div className="max-h-[55vh] space-y-2 overflow-auto rounded-lg border border-white/10 bg-slate-950/50 p-3 text-sm text-slate-200">
          {detailModal &&
            Object.entries(detailModal.data).map(([key, value]) => (
              <div key={key} className="rounded border border-white/10 p-2">
                <p className="text-xs uppercase tracking-wide text-slate-400">{key}</p>
                <p className="mt-1 whitespace-pre-wrap break-words text-slate-100">
                  {Array.isArray(value) ? value.join(", ") : String(value ?? "-")}
                </p>
              </div>
            ))}
        </div>
      </Modal>

      <Modal
        show={Boolean(confirmModal)}
        title={confirmModal?.title ?? "Konfirmasi"}
        onClose={() => setConfirmModal(null)}
      >
        <p className="text-sm text-slate-200">{confirmModal?.message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="rounded-lg border border-white/25 px-3 py-2 text-sm"
            type="button"
            onClick={() => setConfirmModal(null)}
          >
            Batal
          </button>
          <button
            className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white"
            type="button"
            onClick={() => {
              if (confirmModal) confirmModal.onConfirm();
              setConfirmModal(null);
            }}
          >
            Ya, Lanjutkan
          </button>
        </div>
      </Modal>

      <Modal
        show={Boolean(infoModal)}
        title={infoModal?.title ?? "Informasi"}
        onClose={() => setInfoModal(null)}
      >
        <p className="text-sm text-slate-200">{infoModal?.message}</p>
        <div className="mt-4 flex justify-end">
          <button
            className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-900"
            type="button"
            onClick={() => setInfoModal(null)}
          >
            OK
          </button>
        </div>
      </Modal>

      <Modal show={logoutModal} title="Konfirmasi Logout" onClose={() => setLogoutModal(false)}>
        <p className="text-sm text-slate-200">{logoutMessage}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button className="rounded-lg border border-white/25 px-3 py-2 text-sm" type="button" onClick={() => setLogoutModal(false)}>
            Tidak
          </button>
          <button
            className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white"
            type="button"
            onClick={() => {
              setSessionReady(false);
              setVerifiedUser(null);
              setVerifyCode("");
              setLogoutModal(false);
            }}
          >
            Ya
          </button>
        </div>
      </Modal>
    </div>
  );
}

const cValue = (arr: string[]) => arr[0] ?? "";

export default App;
