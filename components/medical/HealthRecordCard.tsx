"use client";

import { useState } from "react";
import type { Elder } from "@/types/elder";

interface HealthRecordCardProps {
  elder: Elder;
  records: {
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      startDate: string;
      status: string;
    }>;
    reports: Array<{
      date: string;
      title: string;
      url: string;
    }>;
  };
}

type TabKey = "basic" | "history" | "medication" | "allergy" | "reports";

const tabs: { key: TabKey; label: string }[] = [
  { key: "basic", label: "基本信息" },
  { key: "history", label: "既往病史" },
  { key: "medication", label: "用药记录" },
  { key: "allergy", label: "过敏史" },
  { key: "reports", label: "体检报告" },
];

function BasicInfo({ elder }: { elder: Elder }) {
  return (
    <div className="space-y-3">
      <InfoRow label="姓名" value={elder.name} />
      <InfoRow label="性别" value={elder.gender} />
      <InfoRow label="年龄" value={`${elder.age}岁`} />
      <InfoRow label="出生日期" value={elder.birthDate} />
      <InfoRow label="血型" value={elder.bloodType} />
      <InfoRow label="身份证" value={elder.idCard} />
      <InfoRow label="医保类型" value={elder.insuranceType} />
      <InfoRow label="社区" value={elder.community} />
      <InfoRow label="地址" value={elder.address} />
      <InfoRow label="电话" value={elder.phone} />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <span className="w-24 text-medical-body text-text-secondary flex-shrink-0">{label}</span>
      <span className="text-medical-body text-text-primary">{value}</span>
    </div>
  );
}

function MedicalHistory({ elder }: { elder: Elder }) {
  const histories = elder.medicalHistory;
  if (histories.length === 0) {
    return <p className="text-medical-body text-text-disabled">无既往病史记录</p>;
  }
  return (
    <div className="space-y-2">
      {histories.map((h, i) => (
        <div key={i} className="flex items-center gap-2 bg-background rounded-medical px-4 py-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-warning flex-shrink-0">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <span className="text-medical-body text-text-primary">{h}</span>
        </div>
      ))}
    </div>
  );
}

function MedicationList({ medications }: { medications: HealthRecordCardProps["records"]["medications"] }) {
  if (medications.length === 0) {
    return <p className="text-medical-body text-text-disabled">无用药记录</p>;
  }
  return (
    <div className="space-y-2">
      {medications.map((med, i) => (
        <div key={i} className="bg-background rounded-medical p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-medical-h2 text-text-primary">{med.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-medical-caption ${
              med.status === "服用中" ? "bg-success/10 text-success" : "bg-gray-100 text-text-disabled"
            }`}>
              {med.status}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-medical-caption text-text-secondary">
            <span>用量：{med.dosage}</span>
            <span>频率：{med.frequency}</span>
            <span>开始：{med.startDate}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AllergyList({ elder }: { elder: Elder }) {
  const allergies = elder.allergies;
  if (allergies.length === 0) {
    return <p className="text-medical-body text-text-disabled">无过敏史记录</p>;
  }
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {allergies.map((a, i) => (
          <span
            key={i}
            className="px-3 py-1.5 rounded-full bg-danger/10 text-danger text-medical-body font-medium"
          >
            {a}
          </span>
        ))}
      </div>
    </div>
  );
}

function ReportList({ reports }: { reports: HealthRecordCardProps["records"]["reports"] }) {
  if (reports.length === 0) {
    return <p className="text-medical-body text-text-disabled">无体检报告</p>;
  }
  return (
    <div className="space-y-2">
      {reports.map((report, i) => (
        <div key={i} className="flex items-center justify-between bg-background rounded-medical px-4 py-3">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary">
              <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0116 6.622V16.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 013 16.5v-13z" />
            </svg>
            <div>
              <div className="text-medical-body text-text-primary">{report.title}</div>
              <div className="text-medical-caption text-text-secondary">{report.date}</div>
            </div>
          </div>
          <a
            href={report.url}
            className="text-medical-caption text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            查看
          </a>
        </div>
      ))}
    </div>
  );
}

export default function HealthRecordCard({ elder, records }: HealthRecordCardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("basic");

  const renderContent = () => {
    switch (activeTab) {
      case "basic":
        return <BasicInfo elder={elder} />;
      case "history":
        return <MedicalHistory elder={elder} />;
      case "medication":
        return <MedicationList medications={records.medications} />;
      case "allergy":
        return <AllergyList elder={elder} />;
      case "reports":
        return <ReportList reports={records.reports} />;
    }
  };

  return (
    <div className="bg-card rounded-medical overflow-hidden">
      {/* Elder header */}
      <div className="px-5 py-4 border-b border-border flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
          {elder.name.charAt(0)}
        </div>
        <div>
          <div className="text-medical-h1 text-text-primary">{elder.name}</div>
          <div className="text-medical-caption text-text-secondary">
            {elder.gender} · {elder.age}岁 · {elder.community}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-4 py-3 text-medical-body font-medium transition-colors relative ${
              activeTab === tab.key
                ? "text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-5">{renderContent()}</div>
    </div>
  );
}
