import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/actions/auth'
import { getMyTeams } from '@/lib/actions/teams'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile()
  // If profile is null the user is not authenticated → send to login.
  // If profile exists but no team → send to onboarding.
  // Never loop back to /login for an authenticated user with a missing profile;
  // redirect to /onboarding instead so it can be created there.
  if (!profile) redirect('/onboarding')
  if (!profile.active_team_id) redirect('/onboarding')

  const teams = await getMyTeams()
  const activeTeam = teams.find(t => t.id === profile.active_team_id) ?? null

  return (
    <div className="flex min-h-screen">
      <Sidebar
        role={profile.role}
        fullName={profile.full_name}
        teamName={activeTeam?.nombre ?? null}
        teams={teams}
        activeTeamId={profile.active_team_id}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900">{activeTeam?.nombre ?? 'Guardias'}</span>
        </header>

        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-auto">
          {children}
        </main>
      </div>

      <MobileNav role={profile.role} />
    </div>
  )
}
