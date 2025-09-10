-- Add missing foreign keys so embedded selects work for Attendance Overview

-- Ensure referenced columns are unique/primary
CREATE UNIQUE INDEX IF NOT EXISTS profiles_id_unique_idx ON public.profiles(id);
CREATE UNIQUE INDEX IF NOT EXISTS classes_id_unique_idx ON public.classes(id);

-- Add FK attendance.student_id -> profiles.id with the exact name expected by the UI
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'attendance_student_id_fkey'
  ) THEN
    ALTER TABLE public.attendance
      ADD CONSTRAINT attendance_student_id_fkey
      FOREIGN KEY (student_id)
      REFERENCES public.profiles(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- Add FK attendance.class_id -> classes.id with the exact name expected by the UI
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'attendance_class_id_fkey'
  ) THEN
    ALTER TABLE public.attendance
      ADD CONSTRAINT attendance_class_id_fkey
      FOREIGN KEY (class_id)
      REFERENCES public.classes(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- Helpful indexes for attendance filters
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON public.attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_class ON public.attendance(class_id);
