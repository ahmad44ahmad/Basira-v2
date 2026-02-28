import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout'

// Lazy-loaded pages
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const BeneficiariesPage = lazy(() => import('@/features/beneficiaries').then((m) => ({ default: m.BeneficiariesPage })))
const MedicalOverviewPage = lazy(() => import('@/features/medical').then((m) => ({ default: m.MedicalOverviewPage })))
const DailyCarePage = lazy(() => import('@/features/care').then((m) => ({ default: m.DailyCarePage })))
const ShiftHandoverPage = lazy(() => import('@/features/care').then((m) => ({ default: m.ShiftHandoverPage })))
const FallRiskPage = lazy(() => import('@/features/safety').then((m) => ({ default: m.FallRiskPage })))
const MedicationsPage = lazy(() => import('@/features/medications').then((m) => ({ default: m.MedicationsPage })))
const SocialPage = lazy(() => import('@/features/social').then((m) => ({ default: m.SocialPage })))
const EmpowermentPage = lazy(() => import('@/features/empowerment').then((m) => ({ default: m.EmpowermentPage })))
const FamilyPortalPage = lazy(() => import('@/features/family').then((m) => ({ default: m.FamilyPortalPage })))
const OperationsPage = lazy(() => import('@/features/operations').then((m) => ({ default: m.OperationsPage })))
const CateringPage = lazy(() => import('@/features/catering').then((m) => ({ default: m.CateringPage })))
const QualityPage = lazy(() => import('@/features/quality').then((m) => ({ default: m.QualityPage })))
const GRCPage = lazy(() => import('@/features/grc').then((m) => ({ default: m.GRCPage })))
const ReportsPage = lazy(() => import('@/features/reports').then((m) => ({ default: m.ReportsPage })))
const IndicatorsPage = lazy(() => import('@/features/indicators').then((m) => ({ default: m.IndicatorsPage })))
const IPCPage = lazy(() => import('@/features/ipc').then((m) => ({ default: m.IPCPage })))
const DentalPage = lazy(() => import('@/features/dental').then((m) => ({ default: m.DentalPage })))
const FeedbackPage = lazy(() => import('@/features/feedback').then((m) => ({ default: m.FeedbackPage })))
const EmergencyPage = lazy(() => import('@/features/safety').then((m) => ({ default: m.EmergencyPage })))
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const TrainingPage = lazy(() => import('@/pages/TrainingPage').then((m) => ({ default: m.TrainingPage })))
const SupportPage = lazy(() => import('@/pages/SupportPage').then((m) => ({ default: m.SupportPage })))

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },

      // Beneficiaries
      { path: 'beneficiaries', element: <BeneficiariesPage /> },
      { path: 'beneficiaries/:id', element: <BeneficiariesPage /> },
      { path: 'empowerment', element: <EmpowermentPage /> },
      { path: 'family', element: <FamilyPortalPage /> },

      // Medical
      { path: 'medical', element: <MedicalOverviewPage /> },
      { path: 'medications', element: <MedicationsPage /> },
      { path: 'safety', element: <FallRiskPage /> },

      // Care
      { path: 'care', element: <DailyCarePage /> },
      { path: 'handover', element: <ShiftHandoverPage /> },

      // Feedback (Silent Echo)
      { path: 'feedback', element: <FeedbackPage /> },

      // Emergency PEEP
      { path: 'emergency', element: <EmergencyPage /> },

      // Dental
      { path: 'dental', element: <DentalPage /> },

      // IPC
      { path: 'ipc', element: <IPCPage /> },
      { path: 'ipc/inspection', element: <IPCPage /> },
      { path: 'ipc/immunizations', element: <IPCPage /> },

      // Social
      { path: 'social', element: <SocialPage /> },
      { path: 'social/leaves', element: <SocialPage /> },
      { path: 'social/activities', element: <SocialPage /> },

      // Catering
      { path: 'catering', element: <CateringPage /> },
      { path: 'catering/daily-log', element: <CateringPage /> },
      { path: 'catering/quality', element: <CateringPage /> },

      // Operations
      { path: 'operations', element: <OperationsPage /> },
      { path: 'operations/assets', element: <OperationsPage /> },
      { path: 'operations/maintenance', element: <OperationsPage /> },

      // GRC & Quality
      { path: 'grc', element: <GRCPage /> },
      { path: 'grc/risks', element: <GRCPage /> },
      { path: 'grc/compliance', element: <GRCPage /> },
      { path: 'quality', element: <QualityPage /> },

      // Reports & Indicators
      { path: 'reports', element: <ReportsPage /> },
      { path: 'strategic', element: <ReportsPage /> },
      { path: 'indicators', element: <IndicatorsPage /> },

      // Admin
      { path: 'training', element: <TrainingPage /> },
      { path: 'support', element: <SupportPage /> },
      { path: 'settings', element: <SettingsPage /> },

      // Catch-all
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
])
