'use client'

import { usePathname, useRouter } from 'next/navigation'

import { GetTeamsStatisticsActionState } from '@/app/actions'
import { Artillery } from '@/app/common/components/statistics/artillery'
import { BestBench } from '@/app/common/components/statistics/best-bench'
import { BestCoach } from '@/app/common/components/statistics/best-coach'
import { HighestAverage } from '@/app/common/components/statistics/highest-average'
import { HighestFinisher } from '@/app/common/components/statistics/highest-finisher'
import { HighestScorer } from '@/app/common/components/statistics/highest-scorer'
import { LeastValuedPlayer } from '@/app/common/components/statistics/least-valued-player'
import { LineupsPerClub } from '@/app/common/components/statistics/lineups-per-club'
import { MoreAssists } from '@/app/common/components/statistics/more-assists'
import { MoreDefenses } from '@/app/common/components/statistics/more-defenses'
import { MoreRedCards } from '@/app/common/components/statistics/more-red-cards'
import { MoreTackles } from '@/app/common/components/statistics/more-tackles'
import { MoreYellowCards } from '@/app/common/components/statistics/more-yellow-cards'
import { MostOffsidedPlayer } from '@/app/common/components/statistics/most-offsided-player'
import { MostRoundsAsCaptain } from '@/app/common/components/statistics/most-rounds-as-captain'
import { MostScheduledPlayer } from '@/app/common/components/statistics/most-scheduled-player'
import { MostValuedPlayer } from '@/app/common/components/statistics/most-valued-player'
import { PointsPerClub } from '@/app/common/components/statistics/points-per-club'
import { StatisticsSection } from '@/app/common/components/statistics/section'
import { WorstGoalkeeper } from '@/app/common/components/statistics/worst-goalkeeper'
import { TeamProfile } from '@/app/common/components/team/profile'
import { SeasonYears } from '@/app/constants/data'
import { Select } from '@mantine/core'

import { isEmpty, isNil } from 'lodash'

import { Flex } from '../components/flex'
import { Lineup } from '../components/lineup'
import { FinishesOnPost } from '../components/statistics/finishes-on-post'
import { MoreFouls } from '../components/statistics/more-fouls'
import { ParticipationInGoals } from '../components/statistics/participation-in-goals'
import { ShareOnTwitterButtonLink } from '../components/team/trophies'
import { ExtractImageContextProvider } from '../contexts/extract-image-context.client'
import { useLineupsResultContext } from '../contexts/lineups-result-context.client'
import { AVAILABLE_YEARS, useSelectedYearContext } from '../contexts/selected-year-context.client'
import { useTeamInfoContext } from '../contexts/team-info-context.client'
import { MostPoints } from '../components/statistics/most-points'

export default function TeamStatisticsContent({
  data
}: {
  data?: GetTeamsStatisticsActionState['data']
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { selectedYear, setSelectedYear } = useSelectedYearContext()
  const { teamInfo } = useTeamInfoContext()
  const { lineupsResult } = useLineupsResultContext()

  const handleChange = (item: string) => {
    setSelectedYear(+item as SeasonYears)
  }

  if (isNil(teamInfo) && isNil(data)) return null

  if (isNil(data) && isNil(lineupsResult)) router.push('/')

  if (isNil(lineupsResult)) return 'Sem dados para a temporada selecionada'

  const teamData = data ?? lineupsResult

  return (
    <ExtractImageContextProvider>
      <Flex className="w-full py-4" justify="center" align="center" direction="column">
        {teamData.teamInfo &&
        teamData.teamInfo.name &&
        !pathname.includes(teamData.teamInfo.id.toString()) ? (
          <Select
            className="max-w-[500px] self-end text-left mobile:self-center"
            placeholder="Selecione a temporada"
            label="Ano da temporada"
            defaultValue={teamData.year?.toString() ?? selectedYear.toString()}
            data={AVAILABLE_YEARS.map((n) => `${n}`)}
            onChange={handleChange}
          />
        ) : null}
        {!isNil(teamData.rounds) && !isNil(teamData.teamInfo) && !isNil(teamData.trophies) ? (
          <TeamProfile
            matchesData={teamData.rounds}
            teamInfo={teamData.teamInfo}
            trophies={teamData.trophies}
          />
        ) : null}
        {!isNil(teamData.teamInfo) ? (
          <Flex className="w-full py-4" justify="center">
            <ShareOnTwitterButtonLink
              type="trophyBoard"
              teamId={teamData.teamInfo.id.toString()}
              year={teamData.year ?? (new Date().getFullYear() as SeasonYears)}
            />
          </Flex>
        ) : null}
        {!isNil(lineupsResult) &&
        !isNil(teamData.athleteStatistics) &&
        !isEmpty(teamData.athleteStatistics) &&
        !isNil(teamData.benchStatistics) &&
        !isEmpty(teamData.benchStatistics) &&
        !isNil(teamData.clubStatistics) &&
        !isEmpty(teamData.clubStatistics) &&
        !isNil(teamData.positionsStatistics) &&
        !isEmpty(teamData.positionsStatistics) &&
        !isNil(teamData.rounds) &&
        !isEmpty(teamData.rounds) &&
        !isNil(teamData.lineups) &&
        !isEmpty(teamData.lineups) ? (
          <>
            <StatisticsSection title="os melhores">
              <HighestScorer crewData={teamData.athleteStatistics} matchesData={teamData.rounds!} />
              <MostPoints crewData={teamData.athleteStatistics} matchesData={teamData.rounds!} />
              <HighestAverage
                crewData={teamData.athleteStatistics}
                matchesData={teamData.rounds!}
              />
              <MostValuedPlayer crewData={teamData.athleteStatistics} />
              <Artillery crewData={teamData.athleteStatistics} matchesData={teamData.rounds} />
              <HighestFinisher crewData={teamData.athleteStatistics} />
              <MoreAssists crewData={teamData.athleteStatistics} matchesData={teamData.rounds!} />
              <ParticipationInGoals
                crewData={teamData.athleteStatistics}
                matchesData={teamData.rounds!}
              />
              <MoreTackles crewData={teamData.athleteStatistics} matchesData={teamData.rounds} />
              <MoreDefenses crewData={teamData.athleteStatistics} matchesData={teamData.rounds} />
              <BestCoach crewData={teamData.athleteStatistics} matchesData={teamData.rounds} />
              <BestBench crewData={teamData.benchStatistics} matchesData={teamData.rounds} />
            </StatisticsSection>
            <Lineup lineup={teamData.lineups.bestTeam} matchesData={teamData.rounds} />
            <StatisticsSection title="os piores">
              <LeastValuedPlayer crewData={teamData.athleteStatistics} />
              <MoreYellowCards
                crewData={teamData.athleteStatistics}
                matchesData={teamData.rounds}
              />
              <MoreRedCards crewData={teamData.athleteStatistics} matchesData={teamData.rounds!} />
              <WorstGoalkeeper
                crewData={teamData.athleteStatistics}
                matchesData={teamData.rounds}
              />
              <MostOffsidedPlayer
                crewData={teamData.athleteStatistics}
                matchesData={teamData.rounds}
              />
              <MoreFouls crewData={teamData.athleteStatistics} matchesData={teamData.rounds!} />
            </StatisticsSection>
            <Lineup
              lineup={teamData.lineups.worstTeam}
              matchesData={teamData.rounds}
              worstCaptain
              invertSummary
            />
            <StatisticsSection title="resto">
              <MostRoundsAsCaptain crewData={teamData.athleteStatistics} />
              <LineupsPerClub clubsData={teamData.clubStatistics} />
              <PointsPerClub clubsData={teamData.clubStatistics} />
              <MostScheduledPlayer
                crewData={teamData.athleteStatistics}
                matchesData={teamData.rounds}
              />
              <FinishesOnPost crewData={teamData.athleteStatistics} matchesData={teamData.rounds} />
            </StatisticsSection>
          </>
        ) : (
          'Sem dados para a temporada selecionada'
        )}
      </Flex>
    </ExtractImageContextProvider>
  )
}
