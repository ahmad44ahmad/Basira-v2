import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Download } from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { Button, Spinner } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { StatCard } from '@/components/data'
import { useBeneficiaries, useBeneficiaryStats } from '../api/beneficiary-queries'
import { BeneficiaryCard, BeneficiaryFilters, BeneficiaryDetail, AddBeneficiaryForm } from '../components'
import type { BeneficiaryFilters as FilterState, UnifiedBeneficiaryProfile } from '../types'

const ITEMS_PER_PAGE = 20

export function BeneficiariesPage() {
  const { data: beneficiaries, isLoading, error } = useBeneficiaries()
  const stats = useBeneficiaryStats()

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    section: 'all',
    riskLevel: 'all',
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [page, setPage] = useState(1)

  // Apply filters
  const filtered = useMemo(() => {
    if (!beneficiaries) return []
    return beneficiaries.filter((b) => {
      // Text search
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const match =
          b.full_name.toLowerCase().includes(q) ||
          b.file_number.toLowerCase().includes(q) ||
          b.national_id.includes(q)
        if (!match) return false
      }
      // Status
      if (filters.status !== 'all' && b.status !== filters.status) return false
      // Section
      if (filters.section !== 'all' && b.section !== filters.section) return false
      // Risk
      if (filters.riskLevel !== 'all' && b.riskLevel !== filters.riskLevel) return false
      return true
    })
  }, [beneficiaries, filters])

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const selectedBeneficiary = beneficiaries?.find((b) => b.id === selectedId)

  // CSV Export
  const exportCSV = () => {
    if (!filtered.length) return
    const BOM = '\uFEFF'
    const header = 'الاسم,رقم الملف,رقم الهوية,القسم,الغرفة,الحالة,تاريخ القبول\n'
    const rows = filtered
      .map((b) => `${b.full_name},${b.file_number},${b.national_id},${b.section},${b.room_number ?? ''},${b.status},${b.admission_date}`)
      .join('\n')

    const blob = new Blob([BOM + header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `beneficiaries_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-danger">خطأ في تحميل البيانات</p>
          <p className="mt-1 text-sm text-slate-500">{String(error)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="المستفيدون"
        description="إدارة ملفات المستفيدين والمعلومات الشخصية والطبية"
        icon={<Users className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />} onClick={exportCSV} disabled={filtered.length === 0}>
              تصدير
            </Button>
            <Button variant="gold" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setShowAddForm(true)}>
              إضافة مستفيد
            </Button>
          </div>
        }
      />

      {/* Stats Row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard title="الإجمالي" value={stats.total} accent="navy" />
        <StatCard title="نشط" value={stats.active} accent="success" />
        <StatCard title="ذكور" value={stats.male} accent="teal" />
        <StatCard title="إناث" value={stats.female} accent="gold" />
        <StatCard title="أطفال" value={stats.children} accent="teal" />
        <StatCard title="خطر عالي" value={stats.highRisk} accent="danger" />
      </div>

      {/* Main Content: List + Detail */}
      <div className="flex gap-6">
        {/* List Panel */}
        <div className={selectedBeneficiary ? 'hidden w-full shrink-0 sm:block sm:w-[380px]' : 'w-full'}>
          <BeneficiaryFilters
            filters={filters}
            onChange={(f) => { setFilters(f); setPage(1) }}
            totalCount={beneficiaries?.length ?? 0}
            filteredCount={filtered.length}
          />

          {isLoading ? (
            <div className="mt-8 flex justify-center">
              <Spinner size="lg" text="جاري تحميل المستفيدين..." />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="لا يوجد مستفيدون"
              description={filters.search ? 'جرب تغيير معايير البحث' : 'لم يتم إضافة مستفيدين بعد'}
              action={
                <Button variant="primary" size="sm" onClick={() => setShowAddForm(true)} icon={<Plus className="h-4 w-4" />}>
                  إضافة مستفيد
                </Button>
              }
            />
          ) : (
            <>
              <div className="mt-4 space-y-2">
                {paged.map((b) => (
                  <BeneficiaryCard
                    key={b.id}
                    beneficiary={b}
                    selected={b.id === selectedId}
                    onClick={() => setSelectedId(b.id === selectedId ? null : b.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    السابق
                  </Button>
                  <span className="text-sm text-slate-500">
                    {page} من {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    التالي
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedBeneficiary && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
            >
              <BeneficiaryDetail
                beneficiary={selectedBeneficiary}
                onClose={() => setSelectedId(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Form Modal */}
      <AddBeneficiaryForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={() => setShowAddForm(false)}
      />
    </div>
  )
}
