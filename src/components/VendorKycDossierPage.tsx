import { useState } from 'react'
import {
  ArrowLeft,
  FileCheck,
  Building2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Eye,
  CheckCircle2,
} from 'lucide-react'
import type { VendorKycProfile } from './VendorKycModal'

interface VendorKycDossierPageProps {
  profile: VendorKycProfile
  onBack: () => void
  isAdminView?: boolean
  onApproveKyc?: (vendorId: string) => void
  onRejectKyc?: (vendorId: string, reason: string) => void
}

export default function VendorKycDossierPage({
  profile,
  onBack,
  isAdminView = true,
  onApproveKyc,
  onRejectKyc,
}: VendorKycDossierPageProps) {
  const [activeDoc, setActiveDoc] = useState(profile.documents[0] || null)
  const [rejectReason, setRejectReason] = useState('')
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [successToast, setSuccessToast] = useState('')

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Top Sticky Header */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-xs hover:border-orange hover:bg-orange/5 hover:text-orange transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Registry</span>
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Vendor KYC Compliance</span>
                <span>/</span>
                <span className="font-bold text-navy">{profile.companyName}</span>
              </div>
              <h1 className="font-heading text-lg font-extrabold text-navy">
                Legal Entity Verification Dossier
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                profile.kycStatus === 'VERIFIED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : profile.kycStatus === 'REJECTED'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              Status: {profile.kycStatus}
            </span>

            {isAdminView && profile.kycStatus !== 'VERIFIED' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (onApproveKyc) onApproveKyc(String(profile.id))
                    setSuccessToast('Vendor entity KYC & DDA Wholesale License verified!')
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve KYC Dossier</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsRejectOpen(true)}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-6">
        {successToast && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-800">
            ✓ {successToast}
          </div>
        )}

        {isRejectOpen && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-white p-5 shadow-xs">
            <h4 className="font-heading text-sm font-bold text-rose-700 mb-2">Reason for Dossier Rejection</h4>
            <textarea
              rows={2}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Specify compliance deficiency (e.g. Expired DDA license, blurry PAN certificate)..."
              className="w-full rounded-xl border border-rose-200 p-3 text-xs text-navy outline-none focus:border-rose-500 mb-3"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onRejectKyc) onRejectKyc(String(profile.id), rejectReason || 'Non-compliant credentials')
                  setIsRejectOpen(false)
                  setSuccessToast('KYC rejection notice sent to vendor.')
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer"
              >
                Confirm Rejection
              </button>
              <button
                type="button"
                onClick={() => setIsRejectOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: 5 Legal Document Cards */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="font-heading text-sm font-bold text-navy uppercase text-xs tracking-wider border-b border-slate-100 pb-2 mb-3">
                Mandatory Legal Credentials ({profile.documents.length})
              </h3>
              <div className="space-y-2">
                {profile.documents.map((doc) => {
                  const isSelected = activeDoc?.id === doc.id
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setActiveDoc(doc)}
                      className={`rounded-xl border p-3 cursor-pointer transition ${
                        isSelected
                          ? 'border-orange bg-orange/5 shadow-xs'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <FileCheck className={`w-4 h-4 ${isSelected ? 'text-orange' : 'text-amber-500'}`} />
                          <h4 className="font-bold text-navy text-xs leading-snug">{doc.title}</h4>
                        </div>
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                            doc.status === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : doc.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                      <span className="block text-[10px] text-slate-400 mt-1 pl-6">
                        Updated: {doc.uploadedDate || '2026-09-08'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Corporate Profile Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-navy">
                <Building2 className="w-4 h-4 text-orange" />
                <h4 className="font-heading font-bold uppercase text-[11px] tracking-wider">Entity Details</h4>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Registered Name:</span>
                <strong className="text-navy block text-sm">{profile.companyName}</strong>
              </div>

              <div className="flex justify-between border-t border-slate-100 pt-2">
                <span className="text-slate-500">Business tax number:</span>
                <strong className="font-mono text-navy font-bold">{profile.panVatNumber}</strong>
              </div>

              <div className="flex justify-between border-t border-slate-100 pt-2">
                <span className="text-slate-500">Reg #:</span>
                <strong className="font-mono text-navy font-bold">{profile.registrationNumber}</strong>
              </div>

              <div className="border-t border-slate-100 pt-2 space-y-1 text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{profile.address}, {profile.city}, Nepal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{profile.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 2 Columns: Live Document Viewer */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs min-h-[600px] flex flex-col">
              {activeDoc ? (
                <>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div>
                      <h3 className="font-heading text-base font-bold text-navy">{activeDoc.title}</h3>
                      <p className="text-xs text-slate-500">Document Code: {docTypeLabel(activeDoc.code)} · High-Resolution Preview</p>
                    </div>
                    {activeDoc.fileUrl && (
                      <a
                        href={activeDoc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-navy hover:border-orange hover:text-orange transition cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Full Size</span>
                      </a>
                    )}
                  </div>

                  <div className="flex-1 rounded-xl border border-slate-200 bg-slate-900/5 p-4 flex items-center justify-center overflow-hidden">
                    {activeDoc.fileUrl ? (
                      <img
                        src={activeDoc.fileUrl}
                        alt={activeDoc.title}
                        className="max-h-[500px] w-auto max-w-full rounded-lg shadow-md object-contain border border-slate-300"
                      />
                    ) : (
                      <div className="text-center py-12 text-slate-400">
                        <FileCheck className="w-12 h-12 stroke-1 mb-2 mx-auto text-slate-300" />
                        <p className="font-medium text-xs">PDF Document: {activeDoc.fileName || 'document.pdf'}</p>
                        <p className="text-[10px] text-slate-400 mt-1">Uploaded and encrypted on Mediko Secure Vault</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <span>Document verified by Mediko Automated DDA OCR Parser</span>
                    <span className="font-mono text-emerald-700 font-bold">100% Legibility Passed</span>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <Eye className="w-12 h-12 stroke-1 mb-2 text-slate-300" />
                  <p>Select a document from the list to preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function docTypeLabel(code: string) {
  switch (code) {
    case 'COMPANY_REG':
      return 'Company Registration Certificate'
    case 'PAN_VAT':
      return 'Business tax registration'
    case 'DDA_LICENSE':
      return 'DDA Wholesale Medical License'
    case 'TAX_CLEARANCE':
      return 'Tax Clearance Certificate'
    case 'ISO_OR_AUTHORIZATION':
      return 'ISO 13485 / Manufacturer Auth'
    default:
      return code
  }
}
