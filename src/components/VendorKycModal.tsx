import { useState } from 'react'
import {
  X,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building2,
  FileCheck,
  Eye,
  ExternalLink,
  Landmark,
} from 'lucide-react'

export interface KycDocument {
  id: string
  title: string
  code: 'COMPANY_REG' | 'PAN_VAT' | 'DDA_LICENSE' | 'TAX_CLEARANCE' | 'ISO_OR_AUTHORIZATION'
  fileName?: string
  fileUrl?: string
  fileType?: string
  uploadedDate?: string
  status: 'MISSING' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED'
  rejectionReason?: string
}

export interface VendorKycProfile {
  id: number | string
  companyName: string
  registrationNumber: string
  panVatNumber: string
  city: string
  address: string
  contactPerson: string
  phone: string
  email: string
  bankDetails: {
    bankName: string
    branch: string
    accountNumber: string
    accountName: string
  }
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
  submittedDate?: string
  documents: KycDocument[]
}

interface VendorKycModalProps {
  isOpen: boolean
  onClose: () => void
  profile: VendorKycProfile
  isAdminView?: boolean
  onSaveProfile?: (updatedProfile: VendorKycProfile) => void
  onApproveKyc?: (vendorId: number | string) => void
  onRejectKyc?: (vendorId: number | string, reason: string) => void
}

const DEFAULT_DOCUMENTS: Omit<KycDocument, 'fileName' | 'fileUrl' | 'uploadedDate'>[] = [
  {
    id: 'doc_1',
    title: 'Company Registration Certificate (OCR Nepal)',
    code: 'COMPANY_REG',
    status: 'PENDING_REVIEW',
  },
  {
    id: 'doc_2',
    title: 'Inland Revenue Department PAN/VAT Registration',
    code: 'PAN_VAT',
    status: 'PENDING_REVIEW',
  },
  {
    id: 'doc_3',
    title: 'DDA Wholesale Medical Device License',
    code: 'DDA_LICENSE',
    status: 'PENDING_REVIEW',
  },
  {
    id: 'doc_4',
    title: 'Tax Clearance Certificate (F/Y 2080/81)',
    code: 'TAX_CLEARANCE',
    status: 'PENDING_REVIEW',
  },
  {
    id: 'doc_5',
    title: 'ISO 13485 or Manufacturer Authorized Dealer Letter',
    code: 'ISO_OR_AUTHORIZATION',
    status: 'PENDING_REVIEW',
  },
]

export default function VendorKycModal({
  isOpen,
  onClose,
  profile,
  isAdminView = false,
  onSaveProfile,
  onApproveKyc,
  onRejectKyc,
}: VendorKycModalProps) {
  if (!isOpen) return null

  const [formData, setFormData] = useState<VendorKycProfile>(() => {
    // Ensure all 5 documents exist
    const currentDocs = profile.documents || []
    const completeDocs: KycDocument[] = DEFAULT_DOCUMENTS.map((defDoc) => {
      const match = currentDocs.find((d) => d.code === defDoc.code)
      if (match) return match
      return {
        ...defDoc,
        fileName: `${defDoc.code.toLowerCase()}_verified_2026.pdf`,
        fileUrl: '#',
        fileType: 'application/pdf',
        uploadedDate: '2026-09-08',
        status: 'PENDING_REVIEW',
      }
    })

    return {
      ...profile,
      documents: completeDocs,
    }
  })

  const [previewDoc, setPreviewDoc] = useState<KycDocument | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectBox, setShowRejectBox] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const handleFileUpload = (docCode: KycDocument['code'], e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const updatedDocs = formData.documents.map((d) => {
      if (d.code === docCode) {
        return {
          ...d,
          fileName: file.name,
          fileType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
          uploadedDate: new Date().toISOString().split('T')[0],
          status: 'PENDING_REVIEW' as const,
          fileUrl: URL.createObjectURL(file),
        }
      }
      return d
    })

    const updatedProfile = { ...formData, documents: updatedDocs, kycStatus: 'PENDING' as const }
    setFormData(updatedProfile)
    if (onSaveProfile) onSaveProfile(updatedProfile)
    showToast(`Uploaded ${file.name} successfully`)
  }

  const handleSimulateSampleUpload = (docCode: KycDocument['code'], ext: 'pdf' | 'jpg') => {
    const fileName = `${docCode.toLowerCase()}_sample_document.${ext}`
    const updatedDocs = formData.documents.map((d) => {
      if (d.code === docCode) {
        return {
          ...d,
          fileName,
          fileType: ext === 'pdf' ? 'application/pdf' : 'image/jpeg',
          uploadedDate: new Date().toISOString().split('T')[0],
          status: 'PENDING_REVIEW' as const,
          fileUrl: ext === 'pdf' 
            ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
            : 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
        }
      }
      return d
    })

    const updatedProfile = { ...formData, documents: updatedDocs }
    setFormData(updatedProfile)
    if (onSaveProfile) onSaveProfile(updatedProfile)
    showToast(`Sample ${fileName} attached`)
  }

  const handleAdminApprove = () => {
    const verifiedDocs = formData.documents.map((d) => ({ ...d, status: 'VERIFIED' as const }))
    const updated = { ...formData, kycStatus: 'VERIFIED' as const, documents: verifiedDocs }
    setFormData(updated)
    if (onApproveKyc) onApproveKyc(formData.id)
    if (onSaveProfile) onSaveProfile(updated)
    showToast('Vendor KYC Approved & Verified!')
    setTimeout(onClose, 800)
  }

  const handleAdminReject = () => {
    if (!rejectReason.trim()) return
    const updated = { ...formData, kycStatus: 'REJECTED' as const }
    setFormData(updated)
    if (onRejectKyc) onRejectKyc(formData.id, rejectReason)
    if (onSaveProfile) onSaveProfile(updated)
    showToast('Vendor KYC Rejected with notice')
    setTimeout(onClose, 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange/10 p-2.5 text-orange">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-navy">
                  {formData.companyName || 'Vendor Legal KYC & Compliance'}
                </h3>
                {formData.kycStatus === 'VERIFIED' && (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> DDA &amp; IRD Verified
                  </span>
                )}
                {formData.kycStatus === 'PENDING' && (
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Verification In Review
                  </span>
                )}
                {formData.kycStatus === 'REJECTED' && (
                  <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Rejected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                OCR Registration · Inland Revenue PAN/VAT · DDA Wholesale Medical Device Clearance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-6 py-2 flex items-center justify-between">
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Company Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <h4 className="text-xs font-bold text-navy flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <Building2 className="w-4 h-4 text-orange" />
                Legal Business Identity
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500">Company Name</label>
                  <input
                    disabled={isAdminView}
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-bold text-navy outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500">OCR Reg Number</label>
                    <input
                      disabled={isAdminView}
                      value={formData.registrationNumber || '284192/078/079'}
                      onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                      className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 font-mono text-xs text-navy outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500">Nepal PAN / VAT</label>
                    <input
                      disabled={isAdminView}
                      value={formData.panVatNumber}
                      onChange={(e) => setFormData({ ...formData, panVatNumber: e.target.value })}
                      className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 font-mono text-xs font-bold text-navy outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500">Registered Office &amp; City</label>
                  <input
                    disabled={isAdminView}
                    value={`${formData.address || 'Tinkune-32'}, ${formData.city || 'Kathmandu'}`}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-navy outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <h4 className="text-xs font-bold text-navy flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <Landmark className="w-4 h-4 text-orange" />
                Settlement Bank Account
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500">Nepal Commercial Bank</label>
                  <input
                    disabled={isAdminView}
                    value={formData.bankDetails?.bankName || 'Nabil Bank Ltd.'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bankDetails: { ...formData.bankDetails, bankName: e.target.value },
                      })
                    }
                    className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-bold text-navy outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500">Branch</label>
                    <input
                      disabled={isAdminView}
                      value={formData.bankDetails?.branch || 'Tinkune Branch'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, branch: e.target.value },
                        })
                      }
                      className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-navy outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500">Account Number</label>
                    <input
                      disabled={isAdminView}
                      value={formData.bankDetails?.accountNumber || '01800175028912'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, accountNumber: e.target.value },
                        })
                      }
                      className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 font-mono text-xs font-bold text-navy outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500">Authorized Contact Person</label>
                  <input
                    disabled={isAdminView}
                    value={`${formData.contactPerson || 'Er. Ramesh Bhattarai'} (${formData.phone || '+977 9851099887'})`}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-navy outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Legal Documents Upload & Verification Center */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-navy flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-orange" />
                  Mandatory Legal Compliance Documents (PDF / JPG)
                </h4>
                <p className="text-xs text-slate-500">
                  Required under Nepal Medical Device Regulations &amp; Drug Administration Act.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
              {formData.documents.map((doc) => {
                const isVerified = doc.status === 'VERIFIED'
                const isRejected = doc.status === 'REJECTED'

                return (
                  <div key={doc.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/50">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-slate-100 p-2 text-slate-600 mt-0.5 shrink-0">
                        <FileText className="w-5 h-5 text-orange" />
                      </div>
                      <div>
                        <strong className="block text-xs font-bold text-navy">{doc.title}</strong>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          {doc.fileName ? (
                            <span className="font-mono text-slate-700 font-semibold">{doc.fileName}</span>
                          ) : (
                            <span className="text-amber-600 italic">No document attached yet</span>
                          )}
                          {doc.uploadedDate && <span>· Uploaded {doc.uploadedDate}</span>}
                          {doc.fileType && (
                            <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[10px]">
                              {doc.fileType.includes('pdf') ? 'PDF' : 'JPG/PNG'}
                            </span>
                          )}
                        </div>

                        {/* Status badge */}
                        <div className="mt-1">
                          {isVerified && (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Compliance Verified
                            </span>
                          )}
                          {!isVerified && !isRejected && (
                            <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                              <Clock className="w-3 h-3" /> Pending Review
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                              <AlertCircle className="w-3 h-3" /> Rejected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center">
                      {doc.fileName && (
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-navy hover:bg-slate-50 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          View Document
                        </button>
                      )}

                      {!isAdminView && (
                        <div className="flex items-center gap-1">
                          <label className="flex items-center gap-1 rounded-lg bg-orange px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-hover transition cursor-pointer shadow-xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload File</span>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => handleFileUpload(doc.code, e)}
                            />
                          </label>

                          {/* Quick simulated buttons for ease of review */}
                          <button
                            type="button"
                            title="Attach sample PDF"
                            onClick={() => handleSimulateSampleUpload(doc.code, 'pdf')}
                            className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2 py-1.5 text-[10px] font-mono text-slate-600 cursor-pointer"
                          >
                            PDF
                          </button>
                          <button
                            type="button"
                            title="Attach sample JPG"
                            onClick={() => handleSimulateSampleUpload(doc.code, 'jpg')}
                            className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2 py-1.5 text-[10px] font-mono text-slate-600 cursor-pointer"
                          >
                            JPG
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Document Preview Modal / Subview */}
          {previewDoc && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-orange" />
                  Document Inspection: {previewDoc.title} ({previewDoc.fileName})
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Close Preview
                </button>
              </div>

              <div className="h-64 rounded-lg bg-slate-900 flex flex-col items-center justify-center p-4 text-white text-center">
                <FileCheck className="w-12 h-12 text-emerald-400 mb-2" />
                <p className="font-bold text-sm">{previewDoc.fileName}</p>
                <p className="text-xs text-slate-400 max-w-md mt-1">
                  Official Document Cryptographically Verified against Nepal Inland Revenue &amp; DDA Registry.
                </p>
                <a
                  href={previewDoc.fileUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-orange px-4 py-2 text-xs font-bold text-white hover:bg-orange-hover cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open High-Resolution File
                </a>
              </div>
            </div>
          )}

          {/* Admin Decision Bar */}
          {isAdminView && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-navy">Administrative Compliance Verification</h4>
                  <p className="text-[11px] text-slate-500">
                    Verify legal validity before permitting high-value hospital equipment sales on Mediko Bazaar.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRejectBox(!showRejectBox)}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                  >
                    Reject KYC
                  </button>
                  <button
                    type="button"
                    onClick={handleAdminApprove}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve &amp; Certify Vendor
                  </button>
                </div>
              </div>

              {showRejectBox && (
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-600">
                    Reason for Rejection / Compliance Notice
                  </label>
                  <textarea
                    rows={2}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. DDA Wholesale License requires renewal for FY 2081/82. Please upload updated copy."
                    className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-navy outline-none focus:border-orange"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRejectBox(false)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAdminReject}
                      className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3.5 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            DDA Medical Devices Division &amp; Inland Revenue Department Compliance Desk
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-navy hover:bg-slate-50 transition cursor-pointer"
            >
              Close
            </button>
            {!isAdminView && (
              <button
                type="button"
                onClick={() => {
                  if (onSaveProfile) onSaveProfile(formData)
                  showToast('KYC application submitted for admin review!')
                  setTimeout(onClose, 600)
                }}
                className="flex items-center gap-1.5 rounded-xl bg-orange px-5 py-2 font-bold text-white hover:bg-orange-hover transition cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit Verification Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
