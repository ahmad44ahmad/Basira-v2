import type { IpcInspection, IpcIncident, IpcImmunization } from '@/types/database'

const now = new Date().toISOString()

export const DEMO_INSPECTIONS: IpcInspection[] = [
  { id: '1', inspection_date: '2026-02-27', inspection_time: '09:00', shift: 'صباحي', inspector_name: 'أ. محمد الحربي', location_id: null, location_name: 'جناح ذكور A', checklist_template_id: null, checklist_data: null, total_items: 15, compliant_items: 14, compliance_score: 93, non_compliance_details: 'عدم وجود مطهر عند مدخل الغرفة 3', corrective_actions: 'تم توفير المطهر فوراً', follow_up_required: false, evidence_photos: null, created_at: now },
  { id: '2', inspection_date: '2026-02-26', inspection_time: '14:30', shift: 'مسائي', inspector_name: 'أ. سارة العتيبي', location_id: null, location_name: 'المطبخ الرئيسي', checklist_template_id: null, checklist_data: null, total_items: 15, compliant_items: 12, compliance_score: 80, non_compliance_details: 'عدم ارتداء القفازات من قبل عاملين', corrective_actions: 'تنبيه فوري وتوثيق', follow_up_required: true, evidence_photos: null, created_at: now },
  { id: '3', inspection_date: '2026-02-25', inspection_time: '10:00', shift: 'صباحي', inspector_name: 'أ. محمد الحربي', location_id: null, location_name: 'جناح إناث B', checklist_template_id: null, checklist_data: null, total_items: 15, compliant_items: 15, compliance_score: 100, non_compliance_details: null, corrective_actions: null, follow_up_required: false, evidence_photos: null, created_at: now },
]

export const DEMO_INCIDENTS: IpcIncident[] = [
  { id: '1', incident_category: 'uti', detection_date: '2026-02-25', detection_time: '11:30', affected_type: 'beneficiary', beneficiary_id: 'b001', reported_by: 'أ. محمد الحربي', location_id: null, infection_site: 'مسالك بولية', pathogen_identified: 'E. coli', symptoms: ['حرارة', 'ألم'], onset_date: '2026-02-24', severity_level: 'medium', immediate_actions: ['عزل', 'مزرعة'], isolation_required: true, isolation_type: 'تماسي', status: 'investigating', assigned_to: 'د. أحمد', investigation_notes: 'بانتظار نتائج المزرعة', root_cause: null, outcome: null, created_at: now },
  { id: '2', incident_category: 'skin', detection_date: '2026-02-20', detection_time: '08:00', affected_type: 'beneficiary', beneficiary_id: 'b004', reported_by: 'أ. سارة', location_id: null, infection_site: 'جلدي', pathogen_identified: null, symptoms: ['احمرار', 'تورم'], onset_date: '2026-02-19', severity_level: 'low', immediate_actions: ['مرهم موضعي'], isolation_required: false, isolation_type: null, status: 'resolved', assigned_to: null, investigation_notes: null, root_cause: 'تحسس جلدي', outcome: 'شفاء كامل', created_at: now },
]

export const DEMO_IMMUNIZATIONS: IpcImmunization[] = [
  { id: '1', person_type: 'beneficiary', beneficiary_id: 'b001', staff_name: null, vaccine_code: 'FLU', vaccine_name: 'Influenza', vaccine_name_ar: 'الإنفلونزا', dose_number: 1, total_doses: 1, date_administered: '2026-01-15', next_due_date: '2027-01-15', immunity_status: 'complete', adverse_reaction: null, created_at: now },
  { id: '2', person_type: 'beneficiary', beneficiary_id: 'b002', staff_name: null, vaccine_code: 'HEP_B', vaccine_name: 'Hepatitis B', vaccine_name_ar: 'التهاب الكبد ب', dose_number: 2, total_doses: 3, date_administered: '2026-02-01', next_due_date: '2026-08-01', immunity_status: 'incomplete', adverse_reaction: null, created_at: now },
  { id: '3', person_type: 'staff', beneficiary_id: null, staff_name: 'أ. محمد الحربي', vaccine_code: 'FLU', vaccine_name: 'Influenza', vaccine_name_ar: 'الإنفلونزا', dose_number: 1, total_doses: 1, date_administered: '2026-01-10', next_due_date: '2027-01-10', immunity_status: 'complete', adverse_reaction: null, created_at: now },
]
