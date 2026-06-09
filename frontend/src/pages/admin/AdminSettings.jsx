import React from 'react'
import { AdminCard, Field, PageHeader, inputClass } from '../../components/admin/AdminUI'

const AdminSettings = () => (
    <div>
        <PageHeader
            eyebrow="Preferences"
            title="Settings"
            description="Simple admin preferences for store identity, notifications, and team access."
        />

        <div className="grid gap-6 xl:grid-cols-2">
            <AdminCard className="space-y-5">
                <h3 className="text-lg font-semibold text-black">Store Profile</h3>
                <Field label="Store Name">
                    <input className={inputClass} defaultValue="Forever" />
                </Field>
                <Field label="Support Email">
                    <input className={inputClass} defaultValue="support@forever.com" />
                </Field>
                <Field label="Default Currency">
                    <select className={inputClass} defaultValue="Rs.">
                        <option>Rs.</option>
                        <option>USD</option>
                        <option>INR</option>
                    </select>
                </Field>
                <button type="button" className="rounded-full bg-black px-6 py-3 text-sm text-white">Save Settings</button>
            </AdminCard>

            <AdminCard>
                <h3 className="text-lg font-semibold text-black">Notifications</h3>
                <div className="mt-5 space-y-4">
                    {['New order alerts', 'Low stock reminders', 'Weekly performance report'].map((item) => (
                        <label key={item} className="flex items-center justify-between rounded-2xl border p-4">
                            <span className="text-sm font-medium text-gray-700">{item}</span>
                            <input type="checkbox" defaultChecked className="h-4 w-4 accent-black" />
                        </label>
                    ))}
                </div>
            </AdminCard>
        </div>
    </div>
)

export default AdminSettings
