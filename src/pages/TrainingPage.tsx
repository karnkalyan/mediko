import PublicHeader from '../components/PublicHeader'
import Footer from '../components/Footer'
import { TRAINING_COURSES } from '../data/content'
import { formatNPR } from '../lib/utils'
import type { NavProps } from '../types'
import { Calendar, User, MapPin, Users, Award, ArrowRight, CheckCircle2 } from 'lucide-react'

interface TrainingPageProps extends NavProps { detail?: boolean }

export default function TrainingPage({ navigate, cartCount, detail }: TrainingPageProps) {
  if (detail) {
    const course = TRAINING_COURSES[0]
    return (
      <div className="bg-white min-h-screen">
        <PublicHeader navigate={navigate} cartCount={cartCount} currentPage="training" />
        <section className="bg-gradient-to-br from-navy to-navy-deep py-12 px-4 lg:px-8">
          <div className="max-w-[1440px] mx-auto">
            <button onClick={() => navigate('training')} className="text-sm text-orange font-semibold mb-4 cursor-pointer bg-transparent border-none">← All Courses</button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <span className="text-xs text-orange font-semibold uppercase tracking-wide">{course.mode} · {course.duration}</span>
                <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mt-2 mb-3">{course.title}</h1>
                <p className="text-white/60 text-sm mb-4">{course.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-white/80">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-orange" /> {new Date(course.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - {new Date(course.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-orange" /> {course.trainer}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-orange" /> {course.location}</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <p className="text-2xl font-bold text-navy mb-1">{formatNPR(course.price)}</p>
                <p className="text-sm text-text-muted mb-4">{course.seatsAvailable} seats available</p>
                <button className="w-full bg-orange hover:bg-orange-hover text-white border-none py-3 rounded-lg text-sm font-semibold cursor-pointer transition-colors mb-2 flex items-center justify-center gap-1.5">
                  <span>Enroll Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {course.certification && (
                  <p className="text-xs text-emerald-600 font-semibold m-0 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Certificate included
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="py-10 px-4 lg:px-8">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="font-heading text-xl font-bold text-navy mb-4">Topics Covered</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {course.topics.map((topic, i) => (
                <div key={i} className="flex items-center gap-3 bg-bg-light border border-border rounded-lg p-4">
                  <span className="w-8 h-8 rounded-full bg-orange text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</span>
                  <span className="text-sm font-medium text-navy">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Footer navigate={navigate} />
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <PublicHeader navigate={navigate} cartCount={cartCount} currentPage="training" />
      <section className="bg-gradient-to-br from-navy to-navy-deep py-14 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto text-center">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-2">Training & Professional Certification</h1>
          <p className="text-white/60 text-base mb-6">Practical medical equipment training for healthcare professionals and technicians</p>
          <button onClick={() => navigate('certificate-verify')} className="bg-transparent text-white border border-white/30 px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer hover:bg-white/10 transition-colors">
            Verify Certificate →
          </button>
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRAINING_COURSES.map(course => (
            <div key={course.id} onClick={() => navigate('training-detail')} className="bg-white border border-border rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all">
              <div className="bg-navy p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-orange font-semibold uppercase tracking-wide">{course.mode}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${course.status === 'Upcoming' ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'}`}>{course.status}</span>
                </div>
                <h3 className="font-heading text-base font-bold text-white m-0 line-clamp-2">{course.title}</h3>
              </div>
              <div className="p-5">
                <div className="space-y-2 text-xs text-text-muted mb-4">
                  <p className="m-0 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-orange shrink-0" />
                    <span>{course.duration} · {new Date(course.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </p>
                  <p className="m-0 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-orange shrink-0" />
                    <span>{course.trainer}</span>
                  </p>
                  <p className="m-0 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-orange shrink-0" />
                    <span>{course.location}</span>
                  </p>
                  <p className="m-0 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-orange shrink-0" />
                    <span>{course.seatsAvailable}/{course.seats} seats available</span>
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-navy">{formatNPR(course.price)}</span>
                  {course.certification && (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-100">
                      <Award className="w-3 h-3 text-emerald-600" /> Certificate
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer navigate={navigate} />
    </div>
  )
}
