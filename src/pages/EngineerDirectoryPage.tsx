import PublicHeader from '../components/PublicHeader'
import Footer from '../components/Footer'
import { ENGINEERS } from '../data/content'
import type { NavProps } from '../types'
import { CheckCircle2, MapPin } from 'lucide-react'

export default function EngineerDirectoryPage({ navigate, cartCount }: NavProps) {
  return (
    <div className="bg-white min-h-screen">
      <PublicHeader navigate={navigate} cartCount={cartCount} currentPage="engineer-directory" />
      <section className="bg-gradient-to-br from-navy to-navy-deep py-14 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto text-center">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-2">Our Engineer Network</h1>
          <p className="text-white/60 text-base">Certified biomedical engineers across Nepal for installation, repair and maintenance</p>
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ENGINEERS.map(eng => (
            <div key={eng.id} className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-orange-soft flex items-center justify-center text-2xl flex-shrink-0">{eng.photo}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-navy m-0">{eng.name}</h3>
                    {eng.verified && <CheckCircle2 className="w-4 h-4 text-info" />}
                  </div>
                  <p className="text-xs text-text-muted m-0">{eng.title}</p>
                  <p className="text-xs text-text-light m-0 mt-0.5">{eng.experience} experience</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  eng.availability === 'Available' ? 'bg-success-bg text-success' :
                  eng.availability === 'Busy' ? 'bg-warning-bg text-warning' : 'bg-bg-section text-text-muted'
                }`}>{eng.availability}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {eng.specializations.map(s => (
                  <span key={s} className="text-[10px] font-medium text-navy bg-bg-light border border-border px-2 py-0.5 rounded">{s}</span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs text-text-muted mb-4">
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="#F26A1A" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  {eng.rating} ({eng.reviews})
                </div>
                <span>{eng.completedJobs} jobs done</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-text-muted mb-4">
                <MapPin className="w-3.5 h-3.5 text-orange shrink-0" />
                <span>{eng.serviceArea.join(', ')}</span>
              </div>

              <div className="flex gap-2">
                <button onClick={() => navigate('engineering-service')} className="flex-1 bg-orange hover:bg-orange-hover text-white border-none py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                  Book Service →
                </button>
                <button className="px-4 py-2.5 bg-white text-navy border border-border-strong rounded-lg text-xs font-semibold cursor-pointer hover:border-navy transition-colors">
                  Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer navigate={navigate} />
    </div>
  )
}
