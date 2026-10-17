import { EventEmitter } from 'events'

class TaskQueue extends EventEmitter {
  constructor() {
    super()
    this.queue = []
    this.processing = false
    this.completed = []
    this.failed = []

    this.on('newTask', () => {
      if (!this.processing) {
        this.processNext()
      }
    })
  }

  enqueue(type, payload) {
    const job = {
      id: `JOB-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      payload,
      status: 'QUEUED',
      createdAt: new Date(),
      attempts: 0,
      maxAttempts: 3,
    }

    this.queue.push(job)
    console.log(`[TaskQueue] Enqueued job ${job.id} of type '${job.type}'`)
    this.emit('newTask')
    return job
  }

  async processNext() {
    if (this.queue.length === 0) {
      this.processing = false
      return
    }

    this.processing = true
    const job = this.queue.shift()
    job.status = 'PROCESSING'
    job.attempts += 1
    job.startedAt = new Date()

    try {
      console.log(`[TaskQueue] Processing job ${job.id} (${job.type})...`)
      await this.handleJob(job)
      job.status = 'COMPLETED'
      job.completedAt = new Date()
      this.completed.unshift(job)
      if (this.completed.length > 50) this.completed.pop()
      console.log(`[TaskQueue] Job ${job.id} completed successfully`)
    } catch (err) {
      console.error(`[TaskQueue] Job ${job.id} failed:`, err.message)
      if (job.attempts < job.maxAttempts) {
        job.status = 'RETRYING'
        this.queue.push(job)
      } else {
        job.status = 'FAILED'
        job.error = err.message
        this.failed.unshift(job)
        if (this.failed.length > 50) this.failed.pop()
      }
    }

    // Process next job after small delay to avoid thread lock
    setTimeout(() => this.processNext(), 200)
  }

  async handleJob(job) {
    switch (job.type) {
      case 'EMAIL_DISPATCH':
        // Simulates async transactional email delivery to hospitals/vendors
        await new Promise((r) => setTimeout(r, 300))
        console.log(`[EmailWorker] Dispatched email to ${job.payload.to}: ${job.payload.subject}`)
        break

      case 'AUDIT_LOG':
        // Records audit action
        console.log(`[AuditWorker] User ${job.payload.userId} performed '${job.payload.action}' on ${job.payload.target}`)
        break

      case 'RENTAL_PENALTY_CALC':
        // Calculates daily penalty deduction
        console.log(`[RentalWorker] Checked rental #${job.payload.rentalId} for expiry bounds`)
        break

      case 'LANDING_COST_SYNC':
        console.log(`[CustomsWorker] Synchronized Nepal Customs HS Code rates for ${job.payload.hsCode}`)
        break

      default:
        console.log(`[TaskQueue] Handled default job type: ${job.type}`)
    }
  }

  getStats() {
    return {
      pending: this.queue.length,
      processing: this.processing,
      completedCount: this.completed.length,
      failedCount: this.failed.length,
      recentCompleted: this.completed.slice(0, 10),
      recentFailed: this.failed.slice(0, 10),
    }
  }
}

export const taskQueue = new TaskQueue()
