import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockProfile, mockSettings } from '@/features/my/data/mockProfile';
export const useSettingsStore = create<{
 profile: typeof mockProfile;
 budget: number;
 reminders: number[];
 updateProfile: (profile: typeof mockProfile) => void;
 setBudget: (budget: number) => void;
 setReminders: (reminders: number[]) => void;
}>()(persist(set => ({
 profile: mockProfile, budget: mockSettings.monthlyBudget, reminders: mockSettings.reminderDays,
 updateProfile: profile => set({profile}), setBudget: budget => set({budget}), setReminders: reminders => set({reminders}),
}), {name: 'routineslim.settings.v1'}));
