import PublicHeader from '../components/PublicHeader'
import Footer from '../components/Footer'
import { BLOG_POSTS } from '../data/content'
import type { NavProps } from '../types'

interface BlogPageProps extends NavProps { detail?: boolean }

export default function BlogPage({ navigate, cartCount, detail }: BlogPageProps) {
  if (detail) {
    const post = BLOG_POSTS[0]
    return (
      <div className="bg-white min-h-screen">
        <PublicHeader navigate={navigate} cartCount={cartCount} currentPage="blog" />
        <section className="py-10 px-4 lg:px-8">
          <div className="max-w-[800px] mx-auto">
            <button onClick={() => navigate('blog')} className="text-sm text-orange font-semibold mb-4 cursor-pointer bg-transparent border-none">← Back to Blog</button>
            <span className="text-xs text-orange font-semibold uppercase tracking-wide">{post.category} · {post.readTime}</span>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-navy mt-2 mb-4">{post.title}</h1>
            <div className="flex items-center gap-3 text-sm text-text-muted mb-6">
              <span>By {post.author}</span>
              <span>·</span>
              <span>{new Date(post.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <img src={post.image} alt={post.title} className="w-full h-[300px] object-cover rounded-xl mb-6" />
            <div className="prose text-text-body leading-relaxed">
              <p>{post.excerpt}</p>
              <p>Medical equipment maintenance is crucial for ensuring the longevity and reliability of healthcare devices. Regular preventive maintenance not only extends the life of the equipment but also ensures patient safety and compliance with regulatory standards.</p>
              <h3 className="font-heading text-lg font-bold text-navy mt-6 mb-3">Key Maintenance Practices</h3>
              <p>1. <strong>Regular Cleaning</strong> — Keep all equipment surfaces clean and free from dust and debris. Use manufacturer-recommended cleaning agents.</p>
              <p>2. <strong>Scheduled Inspections</strong> — Follow the manufacturer's recommended inspection schedule. This includes visual checks, performance testing, and calibration verification.</p>
              <p>3. <strong>Professional Servicing</strong> — Engage certified biomedical engineers for regular servicing. Mediko Bazaar provides qualified engineers across Nepal for all types of medical equipment.</p>
              <p>4. <strong>Documentation</strong> — Maintain detailed records of all maintenance activities, repairs, and calibrations. This is essential for compliance and warranty claims.</p>
              <h3 className="font-heading text-lg font-bold text-navy mt-6 mb-3">When to Call a Professional</h3>
              <p>If you notice any unusual sounds, error messages, or performance degradation, contact a qualified biomedical engineer immediately. Mediko Bazaar's engineering team is available for both scheduled maintenance and emergency support.</p>
            </div>
          </div>
        </section>
        <Footer navigate={navigate} />
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <PublicHeader navigate={navigate} cartCount={cartCount} currentPage="blog" />
      <section className="bg-gradient-to-br from-navy to-navy-deep py-14 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto text-center">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-2">Healthcare Insights & News</h1>
          <p className="text-white/60 text-base">Expert articles on medical equipment, maintenance, and healthcare trends</p>
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map(post => (
            <div key={post.id} onClick={() => navigate('blog-detail')} className="bg-white border border-border rounded-xl overflow-hidden cursor-pointer group hover:shadow-lg transition-all">
              <div className="h-48 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              </div>
              <div className="p-5">
                <span className="text-[11px] font-semibold text-orange uppercase tracking-wide">{post.category} · {post.readTime}</span>
                <h3 className="text-base font-bold text-navy mt-1.5 mb-2 line-clamp-2 group-hover:text-orange transition-colors" style={{ fontFamily: 'Inter' }}>{post.title}</h3>
                <p className="text-sm text-text-muted line-clamp-2 m-0 mb-3">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-text-light">
                  <span>{post.author}</span><span>·</span>
                  <span>{new Date(post.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
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
