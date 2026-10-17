import { useState } from 'react'
import PublicHeader from '../components/PublicHeader'
import Footer from '../components/Footer'
import type { NavProps } from '../types'
import { Award, CheckCircle2, XCircle } from 'lucide-react'

export default function CertificateVerifyPage({ navigate, cartCount }: NavProps) {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<'valid' | 'invalid' | null>(null)

  const handleVerify = () => {
    // Mock verification
    if (code.trim().length >= 6) {
      setResult('valid')
    } else {
      setResult('invalid')
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <PublicHeader navigate={navigate} cartCount={cartCount} currentPage="training" />
      <section className="bg-navy py-12 px-4 lg:px-8 text-center">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">Certificate Verification</h1>
          <p className="text-white/60 text-base">Verify the authenticity of a Mediko Bazaar training certificate</p>
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
        <div className="max-w-[600px] mx-auto">
          <div className="bg-white border border-border rounded-xl p-8 text-center shadow-sm">
            <Award className="w-12 h-12 text-orange mx-auto mb-3" />
            <h2 className="font-heading text-xl font-bold text-navy mb-2">Certificate Verification</h2>
            <p className="text-sm text-text-muted mb-6">Enter the certificate verification code to check its validity</p>
            <div className="flex gap-2 mb-4">
              <input
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Enter verification code (e.g., MB-CERT-12345)"
                className="flex-1 px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-orange transition-colors text-center font-mono tracking-wider"
                onKeyDown={e => e.key === 'Enter' && handleVerify()}
              />
              <button onClick={handleVerify} className="bg-orange hover:bg-orange-hover text-white border-none px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap">
                Verify
              </button>
            </div>
            {result === 'valid' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mt-4 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-base font-bold text-emerald-800">Certificate Valid</span>
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                  <p className="m-0"><strong>Name:</strong> Ram Shrestha</p>
                  <p className="m-0"><strong>Course:</strong> Patient Monitor Operation & Safety</p>
                  <p className="m-0"><strong>Issued:</strong> 15 Jul 2026</p>
                  <p className="m-0"><strong>Expires:</strong> 15 Jul 2028</p>
                  <p className="m-0"><strong>Trainer:</strong> Er. Bikash Tamang</p>
                  <p className="m-0"><strong>Status:</strong> <span className="text-emerald-700 font-semibold">Active</span></p>
                </div>
              </div>
            )}
            {result === 'invalid' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-4 text-center">
                <XCircle className="w-8 h-8 text-rose-600 mx-auto" />
                <p className="text-rose-700 font-semibold mt-2 mb-0">Certificate Not Found</p>
                <p className="text-sm text-slate-500 mt-1 mb-0">Please check the verification code and try again.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer navigate={navigate} />
    </div>
  )
}
